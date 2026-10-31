import { getUser } from "@/lib/auth";
import { allow, clientIp } from "@/lib/rate-limit";
import { filtersFrom, querySuppliers } from "@/lib/supplier-api";
import { paywallEnabled, sectionsFor } from "@/lib/subscriptions";

/**
 * GET /api/suppliers?q=&type=&cat=&sort=&tel=1&page= — one page of the supplier bank.
 * Contact details only for signed-in readers; with PAYWALL=on, only for subscribers to the bank.
 * Requests are rate-limited per account or address so the bank cannot be paged through by a script.
 */
export async function GET(request: Request) {
  const user = await getUser().catch(() => null);
  if (paywallEnabled() && !user?.isAdmin) {
    const open = user ? (await sectionsFor(user.mobile).catch(() => new Set<string>())).has("suppliers") : false;
    if (!open) return Response.json({ error: "subscription" }, { status: 403 });
  }
  const key = user ? `sup:u:${user.id}` : `sup:ip:${clientIp(request.headers)}`;
  if (!allow(key, user ? 150 : 50, 5 * 60_000)) return Response.json({ error: "rate" }, { status: 429, headers: { "Retry-After": "300" } });

  const params = new URL(request.url).searchParams;
  const page = await querySuppliers(filtersFrom(params), Number(params.get("page")) || 1, Boolean(user));
  return Response.json(page, { headers: { "Cache-Control": "private, no-store" } });
}
