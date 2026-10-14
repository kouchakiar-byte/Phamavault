import { timingSafeEqual } from "node:crypto";
import { lastRuns, runDailyUpdate } from "@/lib/daily-update";
import { databaseConfigured } from "@/lib/db";
import { tehranNow } from "@/lib/scheduler";
import { internalCronToken } from "@/lib/scheduler";

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/**
 * Runs the daily catalog update. Called by the in-app scheduler at 18:00
 * Tehran time, or by an external cron with `Authorization: Bearer $CRON_SECRET`.
 */
export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const secret = process.env.CRON_SECRET ?? "";
  if (!token || !(same(token, internalCronToken()) || (secret.length >= 16 && same(token, secret)))) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const summary = await runDailyUpdate();
  return Response.json({ ran: Boolean(summary), summary });
}

/** Public health check for the daily update: the last runs and the Tehran date, nothing private. */
export async function GET() {
  if (!databaseConfigured()) return Response.json({ database: false, today: tehranNow().day });
  const runs = await lastRuns(5).catch(() => []);
  return Response.json({
    database: true,
    today: tehranNow().day,
    scheduler: process.env.CATALOG_SCHEDULER !== "off",
    cronSecret: (process.env.CRON_SECRET ?? "").length >= 16,
    runs: runs.map((r) => ({ day: r.day, finished: Boolean(r.finishedAt), published: r.published, checked: r.checked, unreachable: r.unreachable })),
  });
}
