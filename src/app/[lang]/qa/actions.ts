"use server";

import { sops } from "@/data";
import { getUser } from "@/lib/auth";
import { claimSopCopy, sopBucket, type CopyResult } from "@/lib/metering";
import { sectionsFor } from "@/lib/subscriptions";

/**
 * Takes one copy from the reader's monthly SOP allowance before the browser copies the text.
 * Only subscribers to QA or QC copy SOPs.
 */
export async function copySop(code: string): Promise<CopyResult & { error?: "denied" }> {
  const user = await getUser().catch(() => null);
  const sop = sops.items.find((s) => s.code === code);
  if (!user || !sop) return { ok: false, used: 0, limit: 0, error: "denied" };
  const sections = await sectionsFor(user.mobile).catch(() => new Set<string>());
  if (!sections.has("qa") && !sections.has("qc")) return { ok: false, used: 0, limit: 0, error: "denied" };
  return claimSopCopy(user.id, sopBucket(sop.dep), sop.code);
}
