import { getUser } from "@/lib/auth";
import { diagnose, ircGet } from "@/lib/irc-http";
import { IRC_ORIGIN, ircSearchUrl, parseIrc, textLines } from "@/lib/iran-drugs";

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
    const reply = await ircGet(ircSearchUrl(q, 1, 100));
    const html = reply.body;
    const parsed = parseIrc(html);
    const body = [
      `requests: ${reply.chain.join("  →  ")}`,
      `bytes: ${html.length}`,
      `parsed products: ${parsed.length}`,
      JSON.stringify(parsed.slice(0, 3), null, 1),
      "----- text lines (first 120) -----",
      ...textLines(html).slice(0, 120),
    ].join("\n");
    return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  } catch (e) {
    const err = e as { code?: string; cause?: { code?: string; message?: string } };
    const lines = [
      `register not reachable: ${String(e)}`,
      `code: ${err.code ?? "-"} · cause: ${err.cause?.code ?? "-"} ${err.cause?.message ?? ""}`,
      ...(await diagnose(new URL(IRC_ORIGIN).hostname)),
    ];
    return new Response(lines.join("\n"), { status: 502, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  }
}
