import { searchIranDrugs } from "@/lib/iran-drugs";
import { lockedSections } from "@/lib/site-search";

/** GET /api/iran-drugs?q=metformin — Iran FDA register products, grouped by generic (pharmacy plan). */
export async function GET(request: Request) {
  if ((await lockedSections())("pharmacy")) return Response.json({ error: "locked" }, { status: 403 });
  const q = new URL(request.url).searchParams.get("q") ?? "";
  return Response.json(await searchIranDrugs(q), { headers: { "Cache-Control": "private, max-age=3600" } });
}
