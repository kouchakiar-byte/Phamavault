/**
 * A fixed-window request counter kept in process memory: enough to slow down
 * scrapers that page through the site or its APIs. Each key gets `max` requests
 * per `windowMs`; counters reset when their window ends.
 */
type Bucket = { n: number; reset: number };
const g = globalThis as unknown as { pvRate?: Map<string, Bucket>; pvRateSweep?: number };

export function allow(key: string, max: number, windowMs: number): boolean {
  const buckets = (g.pvRate ??= new Map());
  const now = Date.now();
  // Drop finished windows now and then so the map does not grow without end.
  if (!g.pvRateSweep || now - g.pvRateSweep > 60_000) {
    g.pvRateSweep = now;
    for (const [k, b] of buckets) if (b.reset <= now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.reset <= now) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  b.n += 1;
  return b.n <= max;
}

/** The visitor's address as the Liara proxy reports it. */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}
