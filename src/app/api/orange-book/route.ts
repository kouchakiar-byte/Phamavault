import { searchOrangeBook } from "@/lib/orange-book";
import { lockedSections } from "@/lib/site-search";

/** GET /api/orange-book?q=atorvastatin&discn=1&all=1 — Orange Book products and Iranian manufacturers (all=1: every product of each ingredient). */
export async function GET(request: Request) {
  // Used by the formulation advisor and the pharmacy section; closed when both are.
  const locked = await lockedSections();
  if (locked("formulation") && locked("pharmacy")) return Response.json({ error: "locked" }, { status: 403 });
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").slice(0, 80);
  const result = searchOrangeBook(q, url.searchParams.get("discn") === "1", url.searchParams.get("all") === "1" ? 2000 : undefined);
  return Response.json(result, { headers: { "Cache-Control": "private, max-age=3600" } });
}
