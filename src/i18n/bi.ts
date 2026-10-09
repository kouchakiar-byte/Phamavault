import type { Locale } from "./config";

/** A string in both site languages. Titles show both side by side. */
export type Bi = { readonly en: string; readonly fa: string };

export const bi = (en: string, fa: string): Bi => ({ en, fa });

export const otherLocale = (locale: Locale): Locale => (locale === "fa" ? "en" : "fa");

/** The text in the reader's language. */
export const pick = (text: Bi, locale: Locale): string => text[locale];

/** "Primary · Secondary" for places that need one plain string (e.g. <title>). */
export const both = (text: Bi, locale: Locale): string =>
  text.en === text.fa ? text.en : `${text[locale]} · ${text[otherLocale(locale)]}`;

/** Normalises Persian/Arabic letters, digits and separators for search. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[آأإ]/g, "ا")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[\s‌‍,،\-]/g, "");
}
