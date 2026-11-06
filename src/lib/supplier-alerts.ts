import { alertCopy as t } from "@/content/supplier-alerts";
import { siteConfig } from "@/content/site";
import { db, databaseConfigured } from "./db";
import { logMail } from "./mail-log";
import { mailConfigured, sendMail } from "./mail";
import { strongMatchCount } from "./supplier-api";
import { norm } from "./supplier-search";

export const MAX_OPEN_ALERTS = 20;

export type SupplierAlert = { id: string; query: string; email: string | null; createdAt: Date; foundAt: Date | null; found: number };

type Row = { id: string; query: string; email: string | null; created_at: Date; found_at: Date | null; found: number };
const toAlert = (r: Row): SupplierAlert => ({ id: r.id, query: r.query, email: r.email, createdAt: r.created_at, foundAt: r.found_at, found: r.found });

export const alertKey = (query: string) => norm(query).replace(/\s+/g, " ").trim();

/** Saves (or refreshes) a reader's alert; "full" once they hold MAX_OPEN_ALERTS open ones. */
export async function addAlert(userId: string, query: string, email: string | null, locale: string): Promise<"ok" | "full"> {
  const pool = await db();
  const key = alertKey(query);
  const { rows } = await pool.query<{ n: number }>(
    "select count(*)::int as n from supplier_alerts where user_id = $1 and found_at is null and query_key <> $2",
    [userId, key],
  );
  if ((rows[0]?.n ?? 0) >= MAX_OPEN_ALERTS) return "full";
  await pool.query(
    `insert into supplier_alerts (user_id, query, query_key, email, locale) values ($1, $2, $3, $4, $5)
     on conflict (user_id, query_key) do update set email = coalesce(excluded.email, supplier_alerts.email),
       found_at = null, found = 0, mailed_at = null, created_at = now()`,
    [userId, query, key, email, locale],
  );
  return "ok";
}

export async function alertsFor(userId: string): Promise<SupplierAlert[]> {
  const { rows } = await (await db()).query<Row>(
    "select id, query, email, created_at, found_at, found from supplier_alerts where user_id = $1 order by found_at desc nulls last, created_at desc",
    [userId],
  );
  return rows.map(toAlert);
}

export async function removeAlert(userId: string, id: string): Promise<void> {
  await (await db()).query("delete from supplier_alerts where id = $1 and user_id = $2", [id, userId]);
}

export type AlertDemand = { query: string; readers: number; open: number; found: number };

/** What readers are waiting for, most asked first (admin panel). */
export async function alertDemand(limit = 50): Promise<AlertDemand[]> {
  const { rows } = await (await db()).query<{ query: string; readers: number; open: number; found: number }>(
    `select min(query) as query, count(*)::int as readers, count(*) filter (where found_at is null)::int as open, max(found)::int as found
     from supplier_alerts group by query_key order by count(*) filter (where found_at is null) desc, count(*) desc limit $1`,
    [limit],
  );
  return rows;
}

/**
 * After each daily update: closes every open alert whose material now has suppliers in the
 * bank, and emails the reader when they left an address. Returns how many were closed.
 */
export async function checkSupplierAlerts(): Promise<number> {
  if (!databaseConfigured()) return 0;
  const pool = await db();
  const { rows } = await pool.query<{ id: string; user_id: string; query: string; email: string | null; locale: string }>(
    "select id, user_id, query, email, locale from supplier_alerts where found_at is null order by created_at limit 2000",
  );
  const counts = new Map<string, number>();
  let closed = 0;
  for (const a of rows) {
    const key = alertKey(a.query);
    if (!counts.has(key)) counts.set(key, await strongMatchCount(a.query));
    const n = counts.get(key)!;
    if (!n) continue;
    await pool.query("update supplier_alerts set found_at = now(), found = $2 where id = $1", [a.id, n]);
    closed++;
    if (a.email && mailConfigured()) await mailAlert(a, n).catch(() => {});
  }
  return closed;
}

async function mailAlert(a: { id: string; user_id: string; query: string; email: string | null; locale: string }, n: number) {
  const lang = a.locale === "en" ? "en" : "fa";
  const link = `${siteConfig.url}/${lang}/suppliers?q=${encodeURIComponent(a.query)}`;
  const fill = (s: string) => s.replace("{q}", a.query).replace("{n}", String(n));
  const subject = fill(t.mailSubject[lang]);
  const text = `${fill(t.mailText[lang])}\n${link}`;
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const html = `<div dir="${lang === "fa" ? "rtl" : "ltr"}" style="font-family:Tahoma,Arial,sans-serif;line-height:1.8;color:#0b1f33">
<p>${esc(fill(t.mailText[lang]))}</p><p><a href="${esc(link)}" style="color:#0f766e;font-weight:bold">${esc(link)}</a></p>
<p style="color:#64748b;font-size:12px">PharmaVault — ${siteConfig.domain}</p></div>`;
  try {
    await sendMail({ to: a.email!, subject, text, html });
    await markMailed(a.id);
    await logMail({ kind: "alert", recipient: a.email, userId: a.user_id, ok: true, detail: "sent" });
  } catch (e) {
    await logMail({ kind: "alert", recipient: a.email, userId: a.user_id, ok: false, detail: String((e as Error).message ?? e).slice(0, 200) });
  }
}

async function markMailed(id: string) {
  await (await db()).query("update supplier_alerts set mailed_at = now() where id = $1", [id]);
}
