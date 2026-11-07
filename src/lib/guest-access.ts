import { cookies, headers } from "next/headers";
import { GUEST_COOKIE, GUEST_ID } from "./guest-cookie";
import type { GuestId } from "./guest-meter";

/** The guest's hashed-later IP and browser id for this request. */
export async function guestId(): Promise<GuestId> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  const gid = (await cookies()).get(GUEST_COOKIE)?.value ?? null;
  return { ip, gid: gid && GUEST_ID.test(gid) ? gid : null };
}
