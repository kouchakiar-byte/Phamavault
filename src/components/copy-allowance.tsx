import { cookies } from "next/headers";
import { getUser } from "@/lib/auth";
import { sectionsFor } from "@/lib/subscriptions";
import { AllowCopy } from "./copy-guard";

/** Request-time: lets subscribers and admins copy (rendered inside Suspense in the layout). */
export async function CopyAllowance() {
  await cookies();
  const user = await getUser().catch(() => null);
  if (!user) return null;
  if (user.isAdmin) return <AllowCopy />;
  const sections = await sectionsFor(user.mobile).catch(() => new Set<string>());
  return sections.size ? <AllowCopy /> : null;
}
