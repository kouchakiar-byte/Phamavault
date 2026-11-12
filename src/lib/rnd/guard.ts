import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { getUser } from "@/lib/auth";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/paths";
import { alertsFor, getAccess, type Access } from "./server";

/**
 * Every page of the workspace starts here. Visitors who are not signed in go to the sign-in page
 * and come back; signed-in accounts without access (or whose access was revoked) get a plain 404,
 * so the workspace's existence is not revealed.
 */
export async function requireAccess(locale: Locale, back: string): Promise<{ access: Access; urgent: number }> {
  await connection();
  const user = await getUser().catch(() => null);
  if (!user) redirect(`${href(locale, "account/login")}?next=${encodeURIComponent(back)}`);
  const access = await getAccess().catch(() => null);
  if (!access) notFound();
  const urgent = (await alertsFor(access).catch(() => [])).filter((a) => a.d <= 3).length;
  return { access, urgent };
}
