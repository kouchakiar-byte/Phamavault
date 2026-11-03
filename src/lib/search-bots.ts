import { lookup, reverse } from "node:dns/promises";

/*
 * Search engines read the locked sections, so the pages stay in Google and Bing;
 * the sections carry isAccessibleForFree=false markup, the way Google asks paywalled
 * pages to be marked. A crawler is trusted only after the DNS check the engines
 * document (reverse lookup to their domain, then forward lookup back to the same
 * IP), so a browser cannot get in by calling itself Googlebot.
 */

const AGENTS = /Googlebot|Google-InspectionTool|GoogleOther-Image|Storebot-Google|bingbot|BingPreview/i;
const DOMAINS = [".googlebot.com", ".google.com", ".googleusercontent.com", ".search.msn.com"];
const DAY = 24 * 60 * 60_000;

const g = globalThis as unknown as { pvBotCache?: Map<string, { ok: boolean; at: number }> };
const cache = (g.pvBotCache ??= new Map());

const withTimeout = <T>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

async function verify(ip: string): Promise<boolean> {
  try {
    const hosts = await withTimeout(reverse(ip), 2500);
    for (const host of hosts) {
      const name = host.toLowerCase().replace(/\.$/, "");
      if (!DOMAINS.some((d) => name.endsWith(d))) continue;
      const back = await withTimeout(lookup(name, { all: true }), 2500);
      if (back.some((a) => a.address === ip)) return true;
    }
  } catch {}
  return false;
}

export async function isVerifiedSearchBot(userAgent: string | null, ip: string | null): Promise<boolean> {
  if (!userAgent || !ip || !AGENTS.test(userAgent)) return false;
  const hit = cache.get(ip);
  if (hit && performance.now() - hit.at < DAY) return hit.ok;
  const ok = await verify(ip);
  if (cache.size > 5000) cache.clear();
  cache.set(ip, { ok, at: performance.now() }); // a timer, not a date shown anywhere
  return ok;
}
