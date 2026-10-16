import { after } from "next/server";
import { getUser } from "@/lib/auth";
import { recordView, refHost } from "@/lib/analytics";

/** POST /api/track {p, r} — one page view, sent by the site's own pages (see VisitBeacon). */
export async function POST(request: Request) {
  const host = request.headers.get("host") ?? "";
  // Only this site's pages: a beacon carries its own origin.
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== host) return new Response(null, { status: 204 });
  let body: { p?: unknown; r?: unknown };
  try {
    body = JSON.parse((await request.text()).slice(0, 2000));
  } catch {
    return new Response(null, { status: 204 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
  const userAgent = request.headers.get("user-agent")?.slice(0, 300) ?? null;
  const path = typeof body.p === "string" ? body.p : "";
  const ref = refHost(typeof body.r === "string" ? body.r : null, host.split(":")[0]);
  after(async () => {
    // The site's admins are not visitors.
    if ((await getUser().catch(() => null))?.isAdmin) return;
    await recordView({ path, ref, ip, userAgent }).catch((error) => console.error("track failed", error));
  });
  return new Response(null, { status: 204 });
}
