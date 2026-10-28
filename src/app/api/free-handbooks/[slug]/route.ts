import { readFile } from "node:fs/promises";
import path from "node:path";
import { freeHandbooks } from "@/content/free-handbooks";
import { getUser } from "@/lib/auth";
import { sectionsFor } from "@/lib/subscriptions";

/**
 * GET /api/free-handbooks/hplc — the handbook PDF. This week's issue is free
 * for everyone; earlier issues need an active subscription. With ?check=1 it
 * only answers whether the download is allowed ({ ok }), so the page can show
 * the subscribers-only notice instead of an error page.
 */
export async function GET(request: Request, ctx: RouteContext<"/api/free-handbooks/[slug]">) {
  const { slug } = await ctx.params;
  const handbook = freeHandbooks.find((h) => h.slug === slug);
  if (!handbook) return Response.json({ error: "not found" }, { status: 404 });

  const free = handbook === freeHandbooks[0];
  let allowed = free;
  if (!free) {
    const user = await getUser().catch(() => null);
    allowed = Boolean(user && (await sectionsFor(user.mobile).catch(() => new Set())).size > 0);
  }
  if (new URL(request.url).searchParams.has("check")) {
    return Response.json({ ok: allowed }, { headers: { "Cache-Control": "private, no-store" } });
  }
  if (!allowed) return Response.json({ error: "subscribers only" }, { status: 403, headers: { "Cache-Control": "private, no-store" } });

  const pdf = await readFile(path.join(process.cwd(), "private", "handbooks", path.basename(handbook.pdf)));
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${handbook.pdf}"`,
      "Content-Length": String(pdf.length),
      "Cache-Control": free ? "public, max-age=3600" : "private, no-store",
    },
  });
}
