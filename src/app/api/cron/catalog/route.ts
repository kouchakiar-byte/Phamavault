import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/catalog";
import { runDailyUpdate } from "@/lib/daily-update";
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
  if (summary) revalidateTag(CATALOG_TAG, { expire: 0 });
  return Response.json({ ran: Boolean(summary), summary });
}
