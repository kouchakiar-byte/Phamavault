import { account } from "@/content/account";
import { getSection } from "@/content/sections";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "./format";
import { coreSections, paidSections, type PaidSection } from "./pricing";

const t = account.dashboard;

/** The plan card of a plan id (the team plan is shown as "enterprise"). */
export const planItem = (plan: string) =>
  copy.plans.items.find((i) => i.id === (plan === "team" ? "enterprise" : plan)) ?? copy.plans.items[0];

export const planName = (plan: string, locale: Locale) => planItem(plan).name[locale];

export function sectionsLabel(sections: readonly string[], locale: Locale): string {
  if (paidSections.every((s) => sections.includes(s))) return t.allSections[locale];
  if (coreSections.every((s) => sections.includes(s))) return t.coreSections[locale];
  return sections.map((s) => getSection(s as PaidSection).title[locale]).join(locale === "fa" ? "، " : ", ");
}

export const periodLabel = (months: number, locale: Locale) =>
  months === 1 ? t.month[locale] : t.months[locale].replace("{n}", formatNumber(months, locale));
