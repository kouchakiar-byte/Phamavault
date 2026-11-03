import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";
import { sectionsFor } from "@/lib/subscriptions";
import { AllowCopy, SubscriberCopy } from "./copy-guard";

/**
 * Request-time: only admins copy page text. Readers, subscribers included, cannot copy
 * the content; SOPs are copied with their own button, within the monthly allowance.
 */
export async function CopyAllowance() {
  await cookies();
  const user = await getUser().catch(() => null);
  if (!user) return null;
  if (user.isAdmin) return <AllowCopy />;
  const sections = await sectionsFor(user.mobile).catch(() => new Set<string>());
  return sections.size ? <SubscriberCopy /> : null;
}
