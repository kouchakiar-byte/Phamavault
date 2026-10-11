import type { Locale } from "@/i18n/config";

export const formatNumber = (n: number, locale: Locale) => n.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");

/** Solar Hijri dates in Persian, day-month-year in English. */
export const formatDate = (date: Date, locale: Locale, timeZone?: string) =>
  new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-persian" : "en-GB", { dateStyle: "medium", timeZone }).format(date);

/** Whole days left until `date`, never negative. */
export const daysUntil = (date: Date) => Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86_400_000));
