import { randomBytes } from "node:crypto";
import { databaseConfigured } from "./db";
import { UPDATE_HOUR, hasRun, tehranNow } from "./daily-update";

const g = globalThis as unknown as { pvScheduler?: NodeJS.Timeout; pvCronToken?: string };

/** Shared with the cron route so only this process (or CRON_SECRET) can start an update. */
export const internalCronToken = (): string => (g.pvCronToken ??= randomBytes(24).toString("hex"));

/**
 * Checks every minute; after 18:00 Tehran time, if today's update hasn't run,
 * asks the app's own cron route to run it (the route can also refresh the
 * cached pages, which plain background code can't).
 */
export function startScheduler(): void {
  if (g.pvScheduler || !databaseConfigured() || process.env.CATALOG_SCHEDULER === "off") return;
  const port = process.env.PORT ?? "3000";
  let busy = false;
  const tick = async () => {
    const { day, hour } = tehranNow();
    if (busy || hour < UPDATE_HOUR) return;
    busy = true;
    try {
      if (await hasRun(day)) return;
      const response = await fetch(`http://127.0.0.1:${port}/api/cron/catalog`, {
        method: "POST",
        headers: { authorization: `Bearer ${internalCronToken()}` },
        signal: AbortSignal.timeout(15 * 60_000),
      });
      console.log(`daily catalog update ${day}: ${response.status}`);
    } catch (error) {
      console.error("daily catalog update failed", error);
    } finally {
      busy = false;
    }
  };
  g.pvScheduler = setInterval(tick, 60_000);
  g.pvScheduler.unref();
}
