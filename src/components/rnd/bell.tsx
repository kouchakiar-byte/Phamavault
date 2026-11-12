import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { BellRing } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/paths";
import { alertsFor, getAccess } from "@/lib/rnd/server";

async function Resolved({ locale }: { locale: Locale }) {
  if (!(await cookies()).has("pv_session")) return null; // guests: no database work at all
  const access = await getAccess().catch(() => null);
  if (!access) return null;
  const urgent = (await alertsFor(access).catch(() => [])).filter((a) => a.d <= 3).length;
  return (
    <Link data-rnd-bell href={urgent ? href(locale, "rnd/alerts") : href(locale, "rnd")} aria-label={urgent ? `${urgent} هشدار پروژه` : "پروژه‌های تحقیق و توسعه"} title="پروژه‌های تحقیق و توسعه"
      className="relative grid size-9 shrink-0 place-items-center rounded-full text-vault-800 transition hover:bg-vault-50 hover:text-molecule-700">
      <BellRing className="size-5" aria-hidden="true" />
      {urgent > 0 && <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-red-600 px-1 font-mono text-[10px] font-bold leading-4 text-white">{urgent > 99 ? "99+" : urgent}</span>}
    </Link>
  );
}

/** Shown only to people with access to the private R&D workspace; everyone else sees nothing. */
export function RndBell({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={null}>
      <Resolved locale={locale} />
    </Suspense>
  );
}
