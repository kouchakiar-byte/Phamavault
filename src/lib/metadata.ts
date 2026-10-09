import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import { both, type Bi } from "@/i18n/bi";
import { getLocale } from "@/i18n/locale";
import { href } from "./paths";

/** Bilingual <title>, description and hreflang alternates for a page. */
export async function pageMetadata(title: Bi, description: Bi, path: string): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: both(title, locale),
    description: description[locale],
    alternates: {
      canonical: href(locale, path),
      languages: Object.fromEntries(locales.map((l) => [l, href(l, path)])),
    },
  };
}
