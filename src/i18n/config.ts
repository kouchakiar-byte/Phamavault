export const locales = ["fa", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fa";

/** Remembers an explicit language choice; read by `src/proxy.ts`. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeDirection: Record<Locale, "rtl" | "ltr"> = {
  fa: "rtl",
  en: "ltr",
};

export const localeLabel: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
