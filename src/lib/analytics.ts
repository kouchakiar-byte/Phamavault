import { createHash } from "node:crypto";
import { db, databaseConfigured } from "./db";
import { tehranNow } from "./scheduler";

/**
 * Site visits, counted on the site's own database: no outside service, no
 * cookie, no IP kept. A visitor is a one-way hash of the day, IP and browser,
 * so the same person counts once a day. Distinct IPs are counted from a second,
 * day-independent one-way hash of the IP alone.
 */

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|whatsapp|telegram|curl|wget|python|axios|node-fetch|go-http|java\//i;

export type View = { path: string; ref: string | null; ip: string | null; userAgent: string | null };

export const device = (ua: string): "mobile" | "tablet" | "desktop" =>
  /ipad|tablet/i.test(ua) ? "tablet" : /mobi|android|iphone/i.test(ua) ? "mobile" : "desktop";

/** Only the site's own pages, without the query string: /fa/excipients, /en/qc/… */
export function cleanPath(path: string): string | null {
  const p = path.split(/[?#]/)[0].slice(0, 200);
  return /^\/(fa|en)(\/|$)/.test(p) && !/^\/(fa|en)\/admin(\/|$)/.test(p) ? p : null;
}

/** The referring site's host, when it is another site. */
export function refHost(ref: string | null | undefined, ownHost: string): string | null {
  try {
    const host = new URL(ref ?? "").hostname.replace(/^www\./, "");
    return host && host !== ownHost.replace(/^www\./, "") ? host.slice(0, 100) : null;
  } catch {
    return null;
  }
}

export async function recordView(v: View): Promise<void> {
  if (!databaseConfigured() || !v.userAgent || BOT.test(v.userAgent)) return;
  const path = cleanPath(v.path);
  if (!path) return;
  const salt = process.env.ANALYTICS_SALT || process.env.DATABASE_URL || "";
  const visitor = createHash("sha256").update(`${tehranNow().day}|${v.ip}|${v.userAgent}|${salt}`).digest("hex").slice(0, 20);
  const ip = v.ip ? createHash("sha256").update(`ip|${v.ip}|${salt}`).digest("hex").slice(0, 20) : null;
  await (await db()).query("insert into page_views (path, visitor, ref, device, ip) values ($1, $2, $3, $4, $5)", [
    path,
    visitor,
    v.ref,
    device(v.userAgent),
    ip,
  ]);
}

export type VisitStats = {
  totals: { label: "today" | "week" | "month"; visitors: number; views: number }[];
  days: { day: string; visitors: number; views: number }[];
  pages: { path: string; views: number; visitors: number }[];
  refs: { host: string; visitors: number }[];
  devices: { device: string; visitors: number }[];
  /** Distinct IPs; counted only for views recorded since IPs began to be hashed (`since`). */
  ips: { today: number; week: number; month: number; all: number; since: string | null };
};

const TZ = "Asia/Tehran";

/** Visitors and page views for today, 7 and 30 days, per day, and where they came from. */
export async function visitStats(): Promise<VisitStats> {
  const pool = await db();
  const since = (days: number) => `(date_trunc('day', now() at time zone '${TZ}') - interval '${days} days') at time zone '${TZ}'`;
  const [totals, days, pages, refs, devices, ips] = await Promise.all([
    pool.query<{ label: string; visitors: string; views: string }>(
      ["today", "week", "month"]
        .map(
          (label, i) =>
            `select '${label}' as label, count(distinct visitor) as visitors, count(*) as views from page_views where at >= ${since([0, 6, 29][i])}`,
        )
        .join(" union all "),
    ),
    pool.query<{ day: string; visitors: string; views: string }>(
      `select to_char(at at time zone '${TZ}', 'YYYY-MM-DD') as day, count(distinct visitor) as visitors, count(*) as views
       from page_views where at >= ${since(29)} group by 1 order by 1`,
    ),
    pool.query<{ path: string; views: string; visitors: string }>(
      `select path, count(*) as views, count(distinct visitor) as visitors from page_views
       where at >= ${since(29)} group by path order by 2 desc limit 15`,
    ),
    pool.query<{ host: string; visitors: string }>(
      `select ref as host, count(distinct visitor) as visitors from page_views
       where at >= ${since(29)} and ref is not null group by ref order by 2 desc limit 10`,
    ),
    pool.query<{ device: string; visitors: string }>(
      `select device, count(distinct visitor) as visitors from page_views where at >= ${since(29)} group by device order by 2 desc`,
    ),
    pool.query<{ today: string; week: string; month: string; all: string; since: string | null }>(
      `select count(distinct ip) filter (where at >= ${since(0)}) as today,
              count(distinct ip) filter (where at >= ${since(6)}) as week,
              count(distinct ip) filter (where at >= ${since(29)}) as month,
              count(distinct ip) as all,
              to_char(min(at) at time zone '${TZ}', 'YYYY-MM-DD') as since
       from page_views where ip is not null`,
    ),
  ]);
  const n = (x: string) => Number(x) || 0;
  // Every one of the 30 days, zero where nobody came.
  const byDay = new Map(days.rows.map((r) => [r.day, r]));
  const today = tehranNow().day;
  const series = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(`${today}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - (29 - i));
    const day = d.toISOString().slice(0, 10);
    const r = byDay.get(day);
    return { day, visitors: r ? n(r.visitors) : 0, views: r ? n(r.views) : 0 };
  });
  return {
    totals: totals.rows.map((r) => ({ label: r.label as "today" | "week" | "month", visitors: n(r.visitors), views: n(r.views) })),
    days: series,
    pages: pages.rows.map((r) => ({ path: r.path, views: n(r.views), visitors: n(r.visitors) })),
    refs: refs.rows.map((r) => ({ host: r.host, visitors: n(r.visitors) })),
    devices: devices.rows.map((r) => ({ device: r.device, visitors: n(r.visitors) })),
    ips: { today: n(ips.rows[0].today), week: n(ips.rows[0].week), month: n(ips.rows[0].month), all: n(ips.rows[0].all), since: ips.rows[0].since },
  };
}

/** Keeps a year of page views. */
export async function pruneViews(): Promise<void> {
  if (!databaseConfigured()) return;
  await (await db()).query("delete from page_views where at < now() - interval '400 days'");
}
