import { getUser } from "@/lib/auth";
import { guestApiUse, guestUsedResponse } from "@/lib/guest-api";
import { allow, clientIp } from "@/lib/rate-limit";
import { filtersFrom, querySuppliers } from "@/lib/supplier-api";
import { lockedSections } from "@/lib/site-search";
import { paywallEnabled } from "@/lib/subscriptions";

/**
 * GET /api/suppliers?q=&type=&cat=&sort=&tel=1&page= — one page of the supplier bank.
 * Contact details only for signed-in readers; with PAYWALL=on, only for subscribers to the bank
 * and for readers on one of their free days; guests get a few searches a month (see guest-meter).
 * Requests are rate-limited per account or address so the bank cannot be paged through by a script.
 */
export async function GET(request: Request) {
  const user = await getUser().catch(() => null);
  const key = user ? `sup:u:${user.id}` : `sup:ip:${clientIp(request.headers)}`;
  if (!allow(key, user ? 150 : 50, 5 * 60_000)) return Response.json({ error: "rate" }, { status: 429, headers: { "Retry-After": "300" } });

  const params = new URL(request.url).searchParams;
  if (paywallEnabled() && (await lockedSections())("suppliers")) {
    if (user) return Response.json({ error: "subscription" }, { status: 403 });
    // Guests: the first page of the plain list is free; each other search (query, filters) is one free use.
    const f = filtersFrom(params);
    const plain = !f.query.trim() && f.cat === "all" && f.type === "all" && !f.telOnly;
    const pageNo = Number(params.get("page")) || 1;
    if (!(plain && pageNo === 1) && !(await guestApiUse("suppliers", plain ? "list" : `search:${f.query}|${f.cat}|${f.type}|${f.telOnly ? 1 : 0}`))) {
      return guestUsedResponse();
    }
  }
  const page = await querySuppliers(filtersFrom(params), Number(params.get("page")) || 1, Boolean(user));
  return Response.json(page, { headers: { "Cache-Control": "private, no-store" } });
}
