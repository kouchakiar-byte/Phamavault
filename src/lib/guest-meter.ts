import { createHash } from "node:crypto";
import { transaction, db } from "./db";
import { jalaliMonth } from "./metering";
import type { PaidSection } from "./pricing";

/** Uses a guest (not signed in) has in each section, per Jalali month. */
export const GUEST_USES = 3;

/**
 * Landing pages that are only a list or a tool's front: viewing them costs nothing (the
 * searches and checks on them are counted). Other landing pages are content and count once.
 */
export const FREE_LANDING: ReadonlySet<PaidSection> = new Set<PaidSection>([
  "suppliers",
  "materials",
  "tools",
  "pharmacy",
  "formulation",
  "excipients",
  "qa",
  "references",
]);

/** Pages that are only a tool's front (each check on them is counted), free to view like a list landing. */
export const FREE_PAGES: ReadonlySet<string> = new Set(["pharmacy/interactions", "formulation/compatibility"]);

export type GuestId = { ip: string | null; gid: string | null };
export type GuestResult = { ok: boolean; used: number; left: number };

const hashIp = (ip: string) => createHash("sha256").update(`pv-guest:${ip}`).digest("hex").slice(0, 32);

/** Normalises what is counted: a page path, a search, a pair of drugs. Same item, same key. */
export const guestKey = (raw: string) => raw.toLowerCase().normalize("NFKC").replace(/\s+/g, " ").trim().slice(0, 200);

/** Uses already taken in a section this month by this IP or this browser. */
export async function guestUsed(section: PaidSection, who: GuestId): Promise<number> {
  if (!who.ip && !who.gid) return GUEST_USES;
  const { rows } = await (await db()).query<{ n: number }>(
    `select count(distinct item)::int as n from guest_uses
     where month = $1 and section = $2 and (ip_hash = $3 or (gid is not null and gid = $4))`,
    [jalaliMonth(), section, who.ip ? hashIp(who.ip) : "", who.gid],
  );
  return rows[0]?.n ?? 0;
}

/**
 * Takes one use for an item; the same item again is free. Counted against the IP and the
 * browser id together, so neither a new IP nor a cleared cookie alone resets the month.
 */
export async function claimGuestUse(section: PaidSection, item: string, who: GuestId): Promise<GuestResult> {
  if (!who.ip && !who.gid) return { ok: false, used: GUEST_USES, left: 0 };
  const key = guestKey(item) || "/";
  const month = jalaliMonth();
  const ipHash = who.ip ? hashIp(who.ip) : `gid:${who.gid}`;
  return transaction(async (client) => {
    await client.query("select pg_advisory_xact_lock(hashtext('guest:' || $1))", [ipHash]);
    const scope = "month = $1 and section = $2 and (ip_hash = $3 or (gid is not null and gid = $4))";
    const seen = await client.query(`select 1 from guest_uses where ${scope} and item = $5 limit 1`, [month, section, ipHash, who.gid, key]);
    const { rows } = await client.query<{ n: number }>(`select count(distinct item)::int as n from guest_uses where ${scope}`, [month, section, ipHash, who.gid]);
    const used = rows[0]?.n ?? 0;
    if (seen.rows.length) return { ok: true, used, left: Math.max(0, GUEST_USES - used) };
    if (used >= GUEST_USES) return { ok: false, used, left: 0 };
    await client.query(
      "insert into guest_uses (ip_hash, gid, month, section, item) values ($1, $2, $3, $4, $5) on conflict do nothing",
      [ipHash, who.gid, month, section, key],
    );
    return { ok: true, used: used + 1, left: GUEST_USES - used - 1 };
  });
}

export type GuestStats = { section: string; visitors: number; uses: number; exhausted: number };

/** Admin: this month's guest uses per section. */
export async function guestStatsThisMonth(): Promise<GuestStats[]> {
  const { rows } = await (await db()).query<GuestStats>(
    `select section, count(distinct ip_hash)::int as visitors, count(*)::int as uses,
            count(distinct ip_hash) filter (where n >= $2)::int as exhausted
     from (select section, ip_hash, count(*) over (partition by section, ip_hash) as n from guest_uses where month = $1) t
     group by section order by uses desc`,
    [jalaliMonth(), GUEST_USES],
  );
  return rows;
}
