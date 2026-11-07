"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { account } from "@/content/account";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/paths";

const t = account.gate;

/** Shown in a tool when a guest's free uses of the section are used up. */
export function GuestLimit({ locale, total = 3 }: { locale: Locale; total?: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-card border border-capsule-400/50 bg-capsule-50 p-5 sm:flex-row sm:items-center sm:justify-between" role="status">
      <p className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
        <Lock className="mt-0.5 size-4 shrink-0 text-capsule-700" aria-hidden="true" />
        <span>
          <b className="text-vault-900">{t.guestUsedTitle[locale].replace("{total}", String(total))}.</b> {t.guestLimitText[locale]}
        </span>
      </p>
      <Link href={href(locale, "account/register")} className="inline-flex shrink-0 items-center justify-center rounded-full bg-molecule-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-molecule-600">
        {t.signup[locale]}
      </Link>
    </div>
  );
}
