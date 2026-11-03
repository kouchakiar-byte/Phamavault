import { createHash } from "node:crypto";
import { db, transaction } from "@/lib/db";
import { tehranNow } from "@/lib/scheduler";

/*
 * Metered reading. Signed-in readers without a section get FREE_DAYS Tehran
 * calendar days a Jalali month (a day counts once, however many pages are read
 * that day). Subscribers copy SOPs within SOP_COPIES per bucket (QA, QC) a
 * Jalali month; copying the same SOP again in the month uses nothing.
 */

export const FREE_DAYS = 2;
export const SOP_COPIES = 10;

export type SopBucket = "qa" | "qc";

/** QC and microbiology SOPs count against the QC allowance; every other SOP against QA. */
export const sopBucket = (dep: string): SopBucket => (dep === "qc" || dep === "mic" ? "qc" : "qa");

/** The Jalali month in Tehran as "1405-08". */
export function jalaliMonth(now = new Date()): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-u-ca-persian", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit" })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}`;
}

const hashIp = (ip: string | null) => (ip ? createHash("sha256").update(`pv-trial:${ip}`).digest("hex").slice(0, 32) : null);

export type TrialResult = { ok: boolean; used: number; today: boolean };

/** Counts today as a free day if this month still has one; a day already counted stays open all day. */
export async function claimTrialDay(userId: string, ip: string | null): Promise<TrialResult> {
  const { day } = tehranNow();
  const month = jalaliMonth();
  return transaction(async (client) => {
    // One reader at a time, so two tabs cannot both take the last day.
    await client.query("select pg_advisory_xact_lock(hashtext('trial:' || $1))", [userId]);
    const { rows } = await client.query<{ day: string }>("select day from trial_days where user_id = $1 and month = $2", [userId, month]);
    const days = new Set(rows.map((r) => r.day));
    if (days.has(day)) return { ok: true, used: days.size, today: true };
    if (days.size >= FREE_DAYS) return { ok: false, used: days.size, today: false };
    await client.query("insert into trial_days (user_id, day, month, ip_hash) values ($1, $2, $3, $4) on conflict do nothing", [userId, day, month, hashIp(ip)]);
    return { ok: true, used: days.size + 1, today: true };
  });
}

export type CopyResult = { ok: boolean; used: number; limit: number };

export async function sopCopiesUsed(userId: string, bucket: SopBucket): Promise<number> {
  const { rows } = await (await db()).query<{ n: number }>(
    "select count(*)::int as n from sop_copies where user_id = $1 and month = $2 and bucket = $3",
    [userId, jalaliMonth(), bucket],
  );
  return rows[0]?.n ?? 0;
}

/** Takes one SOP copy from this month's allowance; the same SOP again is free. */
export async function claimSopCopy(userId: string, bucket: SopBucket, code: string): Promise<CopyResult> {
  const month = jalaliMonth();
  return transaction(async (client) => {
    await client.query("select pg_advisory_xact_lock(hashtext('sop:' || $1))", [userId]);
    const { rows } = await client.query<{ code: string }>("select code from sop_copies where user_id = $1 and month = $2 and bucket = $3", [userId, month, bucket]);
    const codes = new Set(rows.map((r) => r.code));
    if (codes.has(code)) return { ok: true, used: codes.size, limit: SOP_COPIES };
    if (codes.size >= SOP_COPIES) return { ok: false, used: codes.size, limit: SOP_COPIES };
    await client.query("insert into sop_copies (user_id, month, bucket, code) values ($1, $2, $3, $4) on conflict do nothing", [userId, month, bucket, code]);
    return { ok: true, used: codes.size + 1, limit: SOP_COPIES };
  });
}

export type MeterRow = { userId: string; name: string; mobile: string; trialDays: number; qa: number; qc: number; ips: number };

/** This month's free days and SOP copies per reader, for the admin panel. */
export async function meteringThisMonth(limit = 100): Promise<MeterRow[]> {
  const { rows } = await (await db()).query<{ user_id: string; name: string; mobile: string; trial: number; qa: number; qc: number; ips: number }>(
    `with t as (select user_id, count(*)::int as trial, count(distinct ip_hash)::int as ips from trial_days where month = $1 group by user_id),
          c as (select user_id, count(*) filter (where bucket = 'qa')::int as qa, count(*) filter (where bucket = 'qc')::int as qc
                from sop_copies where month = $1 group by user_id)
     select u.id as user_id, u.name, u.mobile, coalesce(t.trial, 0) as trial, coalesce(c.qa, 0) as qa, coalesce(c.qc, 0) as qc, coalesce(t.ips, 0) as ips
     from users u left join t on t.user_id = u.id left join c on c.user_id = u.id
     where t.user_id is not null or c.user_id is not null
     order by coalesce(t.trial, 0) + coalesce(c.qa, 0) + coalesce(c.qc, 0) desc limit $2`,
    [jalaliMonth(), limit],
  );
  return rows.map((r) => ({ userId: r.user_id, name: r.name, mobile: r.mobile, trialDays: r.trial, qa: r.qa, qc: r.qc, ips: r.ips }));
}
