/*
 * The 18:00 clock. Loaded by src/instrumentation.ts, so it imports nothing:
 * no database driver or cache code ends up in the instrumentation bundle.
 * It only asks the app's own /api/cron/catalog route to run the update; the
 * route (and the database) make sure it runs once per Tehran day.
 */

/** Hour of the day (Tehran time) when the catalog is updated. */
export const UPDATE_HOUR = 18;

const g = globalThis as unknown as { pvScheduler?: ReturnType<typeof setInterval>; pvCronToken?: string };

/** Shared with the cron route so only this process (or CRON_SECRET) can start an update. */
export const internalCronToken = (): string => (g.pvCronToken ??= `${crypto.randomUUID()}${crypto.randomUUID()}`);

/** Today's date and the hour in Tehran. */
export function tehranNow(now = new Date()): { day: string; hour: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tehran",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { day: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
}

/** Checks every minute; after 18:00 Tehran time, triggers today's update once. */
export function startScheduler(): void {
  if (g.pvScheduler || !process.env.DATABASE_URL || process.env.CATALOG_SCHEDULER === "off") return;
  const port = process.env.PORT ?? "3000";
  let doneDay = "";
  let busy = false;
  g.pvScheduler = setInterval(async () => {
    const { day, hour } = tehranNow();
    if (busy || hour < UPDATE_HOUR || doneDay === day) return;
    busy = true;
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/cron/catalog`, {
        method: "POST",
        headers: { authorization: `Bearer ${internalCronToken()}` },
        signal: AbortSignal.timeout(15 * 60_000),
      });
      if (response.ok) doneDay = day;
      console.log(`daily catalog update ${day}: ${response.status}`);
    } catch (error) {
      console.error("daily catalog update failed", error);
    } finally {
      busy = false;
    }
  }, 60_000);
}
