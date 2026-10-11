import { databaseConfigured, db, transaction } from "./db";
import { loadCatalog, type CatalogKind } from "./catalog";
import { tehranNow } from "./scheduler";

/** Adds an edit to the queue the next daily update publishes. `data: null` hides the record. */
export async function queueChange(kind: CatalogKind, key: string, data: unknown | null, userId: string): Promise<void> {
  await (await db()).query("insert into catalog_pending (kind, key, data, hide, created_by) values ($1, $2, $3, $4, $5)", [
    kind,
    key,
    data === null ? null : JSON.stringify(data),
    data === null,
    userId,
  ]);
}

export async function cancelChange(id: string): Promise<void> {
  await (await db()).query("delete from catalog_pending where id = $1 and published_at is null", [id]);
}

export type PendingChange = { id: string; kind: CatalogKind; key: string; hide: boolean; createdAt: Date };

export async function pendingChanges(): Promise<PendingChange[]> {
  const { rows } = await (await db()).query<{ id: string; kind: CatalogKind; key: string; hide: boolean; created_at: Date }>(
    "select id, kind, key, hide, created_at from catalog_pending where published_at is null order by id",
  );
  return rows.map((r) => ({ id: r.id, kind: r.kind, key: r.key, hide: r.hide, createdAt: r.created_at }));
}

export type RunSummary = { day: string; finishedAt: Date | null; published: number; checked: number; unreachable: number };

export async function lastRuns(limit = 7): Promise<RunSummary[]> {
  const { rows } = await (await db()).query<{
    day: string;
    finished_at: Date | null;
    published: number;
    checked: number;
    unreachable: number;
  }>("select * from catalog_runs order by day desc limit $1", [limit]);
  return rows.map((r) => ({ day: r.day, finishedAt: r.finished_at, published: r.published, checked: r.checked, unreachable: r.unreachable }));
}

/** Reachable means the server answered at all; only network failures and 5xx count as down. */
async function reachable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
      headers: { "user-agent": "PharmaVault link check (+https://pharmavault.ir)" },
    });
    await response.body?.cancel();
    return response.status < 500;
  } catch {
    return false;
  }
}

async function checkLinks(urls: string[]): Promise<number> {
  const pool = await db();
  let unreachable = 0;
  const queue = [...new Set(urls)];
  const worker = async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      const ok = await reachable(url);
      if (!ok) unreachable++;
      await pool.query(
        `insert into supplier_links (url, fails, checked_at) values ($1, $2, now())
         on conflict (url) do update set fails = case when $3 then 0 else supplier_links.fails + 1 end, checked_at = now()`,
        [url, ok ? 0 : 1, ok],
      );
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
  return unreachable;
}

/**
 * The daily update: publishes queued edits, checks every supplier website and
 * records the run, which is what the "last updated" stamp shows. Runs once per
 * Tehran day unless forced from the admin page.
 */
export async function runDailyUpdate({ force = false } = {}): Promise<RunSummary | null> {
  if (!databaseConfigured()) return null;
  const { day } = tehranNow();
  const pool = await db();
  const claimed = await pool.query(
    force
      ? "insert into catalog_runs (day) values ($1) on conflict (day) do update set started_at = now() returning day"
      : `insert into catalog_runs (day) values ($1)
         on conflict (day) do update set started_at = now()
           where catalog_runs.finished_at is null and catalog_runs.started_at < now() - interval '30 minutes'
         returning day`,
    [day],
  );
  if (!claimed.rows.length) return null; // already done today, or running

  const published = await transaction(async (client) => {
    const { rows } = await client.query<{ id: string; kind: string; key: string; data: unknown; hide: boolean }>(
      "select id, kind, key, data, hide from catalog_pending where published_at is null order by id for update",
    );
    for (const change of rows) {
      await client.query(
        `insert into catalog_entries (kind, key, data, hidden, updated_at) values ($1, $2, $3, $4, now())
         on conflict (kind, key) do update set data = excluded.data, hidden = excluded.hidden, updated_at = now()`,
        [change.kind, change.key, change.hide ? null : JSON.stringify(change.data), change.hide],
      );
      await client.query("update catalog_pending set published_at = now() where id = $1", [change.id]);
    }
    return rows.length;
  });

  const catalog = await loadCatalog();
  const urls = catalog.companies.map((c) => c.web).filter((u): u is string => Boolean(u && /^https?:\/\//.test(u)));
  const unreachable = await checkLinks(urls);

  const { rows } = await pool.query<{ finished_at: Date }>(
    `update catalog_runs set finished_at = now(), published = published + $2, checked = $3, unreachable = $4
     where day = $1 returning finished_at`,
    [day, published, new Set(urls).size, unreachable],
  );
  return { day, finishedAt: rows[0]?.finished_at ?? null, published, checked: new Set(urls).size, unreachable };
}
