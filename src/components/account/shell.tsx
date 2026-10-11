import type { ReactNode } from "react";
import type { Metadata } from "next";
import { BiTitle, Container } from "@/components/ui";
import type { Bi } from "@/i18n/bi";
import { both } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";

/** Account pages are personal: kept out of search results. */
export async function accountMetadata(title: Bi): Promise<Metadata> {
  const locale = await getLocale();
  return { title: both(title, locale), robots: { index: false, follow: false } };
}

/** Narrow card used by the sign-in, sign-up and checkout pages. */
export function AccountShell({
  locale,
  title,
  lead,
  wide = false,
  children,
}: {
  locale: Locale;
  title: Bi;
  lead?: Bi;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="bg-paper py-12 sm:py-16">
      <Container className={wide ? "max-w-3xl" : "max-w-lg"}>
        <div className="rounded-card border border-line bg-white p-6 shadow-sm sm:p-10">
          <BiTitle as="h1" text={title} locale={locale} className="text-2xl font-bold text-vault-900 sm:text-3xl" />
          {lead && <p className="mt-3 text-muted">{lead[locale]}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </Container>
    </div>
  );
}

export function Loading({ label }: { label: string }) {
  return <p className="animate-pulse py-10 text-center text-sm text-muted">{label}</p>;
}
