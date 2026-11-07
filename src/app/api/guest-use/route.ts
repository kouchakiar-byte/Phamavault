import { getUser } from "@/lib/auth";
import { guestId } from "@/lib/guest-access";
import { claimGuestUse } from "@/lib/guest-meter";
import { isPaidSection } from "@/lib/pricing";
import { allow, clientIp } from "@/lib/rate-limit";
import { isVerifiedSearchBot } from "@/lib/search-bots";
import { paywallEnabled } from "@/lib/subscriptions";

/**
 * POST /api/guest-use {section, key}: a tool in the browser (interaction check, material
 * search, calculator) asks before showing a guest its result. Signed-in readers are governed
 * by the section pages (free days, subscription), so they always get { ok: true } here.
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { section?: string; key?: string };
  const section = String(body.section ?? "");
  const key = String(body.key ?? "").slice(0, 200);
  if (!isPaidSection(section) || !key) return Response.json({ error: "bad request" }, { status: 400 });
  const noStore = { headers: { "Cache-Control": "private, no-store" } };
  if (!paywallEnabled()) return Response.json({ ok: true, guest: false }, noStore);
  if (await getUser().catch(() => null)) return Response.json({ ok: true, guest: false }, noStore);
  if (await isVerifiedSearchBot(request.headers.get("user-agent"), clientIp(request.headers))) return Response.json({ ok: true, guest: false }, noStore);
  if (!allow(`guest-use:${clientIp(request.headers)}`, 60, 5 * 60_000)) return Response.json({ ok: false, guest: true, left: 0 }, { status: 429 });
  const r = await claimGuestUse(section, key, await guestId()).catch(() => ({ ok: false, used: 0, left: 0 }));
  return Response.json({ ok: r.ok, guest: true, left: r.left }, noStore);
}
