import { getUser } from "@/lib/auth";
import { fetchIrcPage, parseIrc, textLines } from "@/lib/iran-drugs";

/**
 * GET /api/admin/irc-raw?q=metformin — admins only: what the Iran FDA register
 * returns to this server, as text lines plus what the parser read from it, to
 * check the reader when the register changes its page.
 */
export async function GET(request: Request) {
  const user = await getUser().catch(() => null);
  if (!user?.isAdmin) return new Response("Not found", { status: 404 });
  const q = new URL(request.url).searchParams.get("q") || "metformin";
  try {
    const html = await fetchIrcPage(q);
    const parsed = parseIrc(html);
    const body = [
      `bytes: ${html.length}`,
      `parsed products: ${parsed.length}`,
      JSON.stringify(parsed.slice(0, 3), null, 1),
      "----- text lines (first 120) -----",
      ...textLines(html).slice(0, 120),
    ].join("\n");
    return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  } catch (e) {
    return new Response(`register not reachable: ${String(e)}`, { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
}
