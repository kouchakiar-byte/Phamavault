"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { LOCALE_COOKIE, localeLabel, locales, type Locale } from "@/i18n/config";

type Props = { current: Locale; label: string };

export function LanguageSwitcher({ current, label }: Props) {
  const pathname = usePathname();
  const target = locales.find((l) => l !== current) ?? current;
  // Swap only the leading locale segment so the visitor stays on the same page.
  const href = pathname.replace(new RegExp(`^/${current}(?=/|$)`), `/${target}`);

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={`${label}: ${localeLabel[target]}`}
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-medium text-vault-800 transition hover:border-molecule-500 hover:text-molecule-700"
    >
      <Globe className="size-4" aria-hidden="true" />
      {localeLabel[target]}
    </Link>
  );
}
