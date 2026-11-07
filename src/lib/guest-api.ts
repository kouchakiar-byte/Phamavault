import { guestId } from "./guest-access";
import { claimGuestUse, guestKey } from "./guest-meter";
import type { PaidSection } from "./pricing";

/** For an API a guest calls from a locked section: one free use per distinct request `item`. */
export async function guestApiUse(section: PaidSection, item: string): Promise<boolean> {
  const key = guestKey(item);
  if (!key) return false;
  const r = await claimGuestUse(section, key, await guestId()).catch(() => ({ ok: false }));
  return r.ok;
}

export const guestUsedResponse = () => Response.json({ error: "guest" }, { status: 403, headers: { "Cache-Control": "private, no-store" } });
