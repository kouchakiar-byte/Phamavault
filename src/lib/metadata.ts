import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import { both, type Bi } from "@/i18n/bi";
import { getLocale } from "@/i18n/locale";
import { href } from "./paths";

/** hreflang alternates for a path, with Persian as the default for other languages. */
export function languageAlternates(path: string): Record<string, string> {
  return { ...Object.fromEntries(locales.map((l) => [l, href(l, path)])), "x-default": href("fa", path) };
}

/** Bilingual <title>, description, hreflang alternates and share preview for a page. */
export async function pageMetadata(title: Bi, description: Bi, path: string): Promise<Metadata> {
  const locale = await getLocale();
  const t = both(title, locale);
  return {
    title: t,
    description: description[locale],
    alternates: { canonical: href(locale, path), languages: languageAlternates(path) },
    // Child openGraph replaces the layout's, so the shared fields are repeated here.
    openGraph: {
      siteName: "PharmaVault",
      title: t,
      description: description[locale],
      url: href(locale, path),
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
  };
}
