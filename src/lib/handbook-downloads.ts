import { createHash } from "node:crypto";
import { databaseConfigured, db } from "@/lib/db";

/** Counts one download; the same address downloading the same handbook again within 10 minutes is not counted twice. */
export async function recordDownload(slug: string, ip: string, userId: string | null): Promise<void> {
  if (!databaseConfigured()) return;
  try {
    const ipHash = createHash("sha256").update(`pv-handbook:${ip}`).digest("hex");
    await (await db()).query(
      `insert into handbook_downloads (slug, ip_hash, user_id)
       select $1, $2, $3
       where not exists (select 1 from handbook_downloads where slug = $1 and ip_hash = $2 and created_at > now() - interval '10 minutes')`,
      [slug, ipHash, userId],
    );
  } catch (error) {
    console.error("handbook download count failed", error);
  }
}

export type DownloadStats = { slug: string; total: number; unique: number; week: number; today: number; last: Date | null };

/** Per handbook: all downloads, distinct addresses, the last 7 days and today (Tehran time). */
export async function downloadStats(): Promise<Map<string, DownloadStats>> {
  const { rows } = await (await db()).query<{ slug: string; total: number; uniq: number; week: number; today: number; last: Date | null }>(
    `select slug,
       count(*)::int as total,
       count(distinct ip_hash)::int as uniq,
       count(*) filter (where created_at > now() - interval '7 days')::int as week,
       count(*) filter (where (created_at at time zone 'Asia/Tehran')::date = (now() at time zone 'Asia/Tehran')::date)::int as today,
       max(created_at) as last
     from handbook_downloads group by slug`,
  );
  return new Map(rows.map((r) => [r.slug, { slug: r.slug, total: r.total, unique: r.uniq, week: r.week, today: r.today, last: r.last }]));
}
