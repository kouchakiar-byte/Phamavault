import dates from "@/data/data-dates.json";
import type { Locale } from "@/i18n/config";

/*
 * When each part of the content last changed, from the git history
 * (scripts/data-dates.mjs runs before every build). "Last reviewed" lines
 * read it, so they never fall behind the content they describe.
 */
export type DataKey = keyof typeof dates;

/** "مهر ۱۴۰۵" or "October 2026": the month the content last changed, Tehran time. */
export function reviewedMonth(key: DataKey, locale: Locale): string {
  const date = new Date(`${dates[key]}T12:00:00+03:30`);
  if (locale === "en") return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "Asia/Tehran" }).format(date);
  const parts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "long", year: "numeric", timeZone: "Asia/Tehran" }).formatToParts(date);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("month")} ${part("year")}`;
}

/** Fills `{month}` in a "last reviewed" line. */
export const withReviewedMonth = (text: string, key: DataKey, locale: Locale) => text.replace("{month}", reviewedMonth(key, locale));
