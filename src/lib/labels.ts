import { account } from "@/content/account";
import { getSection } from "@/content/sections";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "./format";
import { paidSections, type PaidSection } from "./pricing";

const t = account.dashboard;

export const planName = (plan: string, locale: Locale) =>
  copy.plans.items.find((i) => i.id === (plan === "team" ? "enterprise" : "individual"))!.name[locale];

export function sectionsLabel(sections: readonly string[], locale: Locale): string {
  if (sections.length >= paidSections.length) return t.allSections[locale];
  return sections.map((s) => getSection(s as PaidSection).title[locale]).join(locale === "fa" ? "، " : ", ");
}

export const periodLabel = (months: number, locale: Locale) =>
  months === 1 ? t.month[locale] : t.months[locale].replace("{n}", formatNumber(months, locale));
