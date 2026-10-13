import { searchOrangeBook } from "@/lib/orange-book";

/** GET /api/orange-book?q=atorvastatin&discn=1 — Orange Book products and Iranian manufacturers. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").slice(0, 80);
  const result = searchOrangeBook(q, url.searchParams.get("discn") === "1");
  return Response.json(result, { headers: { "Cache-Control": "public, max-age=3600" } });
}
