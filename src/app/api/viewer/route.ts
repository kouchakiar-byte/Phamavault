import { getUser } from "@/lib/auth";

/**
 * GET /api/viewer — a short code for the signed-in viewer (PV-<account id>),
 * printed in the watermark of view-only sheets so a leaked screenshot can be
 * traced to its account without showing any personal detail.
 */
export async function GET() {
  const user = await getUser().catch(() => null);
  return Response.json({ tag: user ? `PV-${user.id}` : null }, { headers: { "Cache-Control": "private, no-store" } });
}
