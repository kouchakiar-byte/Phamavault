import { searchOrangeBook } from "@/lib/orange-book";

/** GET /api/orange-book?q=atorvastatin&discn=1&all=1 — Orange Book products and Iranian manufacturers (all=1: every product of each ingredient). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").slice(0, 80);
  const result = searchOrangeBook(q, url.searchParams.get("discn") === "1", url.searchParams.get("all") === "1" ? 2000 : undefined);
  return Response.json(result, { headers: { "Cache-Control": "public, max-age=3600" } });
}
