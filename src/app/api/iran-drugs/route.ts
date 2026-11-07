import { searchIranDrugs } from "@/lib/iran-drugs";
import { getUser } from "@/lib/auth";
import { guestApiUse } from "@/lib/guest-api";
import { lockedSections } from "@/lib/site-search";

/** GET /api/iran-drugs?q=metformin — Iran FDA register products, grouped by generic (pharmacy plan). */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  if ((await lockedSections())("pharmacy")) {
    // Guests: each search is one free use of the pharmacy section.
    const guest = !(await getUser().catch(() => null));
    if (!guest || !(await guestApiUse("pharmacy", `iran:${q}`))) return Response.json({ error: guest ? "guest" : "locked" }, { status: 403 });
  }
  return Response.json(await searchIranDrugs(q), { headers: { "Cache-Control": "private, max-age=3600" } });
}
