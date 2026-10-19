import { copy } from "@/content/site";
import { sections, type SectionSlug } from "@/content/sections";

/** The sections a subscription can unlock: everything but the services ordered separately (enterprise, CTD compilation). */
type ServiceSection = "enterprise" | "ctd";
export type PaidSection = Exclude<SectionSlug, ServiceSection>;
export const paidSections = sections
  .map((s) => s.slug)
  .filter((s): s is PaidSection => s !== "enterprise" && s !== "ctd");

export const isPaidSection = (value: string): value is PaidSection =>
  (paidSections as readonly string[]).includes(value);

/** The ten sections of the individual and team plans; the pharmacy section comes only with the pharmacy plan. */
export const coreSections = paidSections.filter((s) => s !== "pharmacy");

export type PlanId = "individual" | "team" | "pharmacy";
export const planIds: readonly PlanId[] = ["individual", "team", "pharmacy"];

export const isPlanId = (value: string): value is PlanId => (planIds as readonly string[]).includes(value);

/** Sections a plan opens. */
export const sectionsOf = (plan: PlanId): PaidSection[] => (plan === "pharmacy" ? [...paidSections] : [...coreSections]);

/** Subscription lengths offered at checkout, in months. */
export const monthOptions = [1, 3, 6, 12] as const;

export type Purchase = { plan: PlanId; sections: PaidSection[]; seats: number; months: number };

const p = copy.plans.pricing;

/**
 * Cleans a purchase coming from a form: every plan covers its fixed set of
 * sections, and only the team plan has more than one seat. Returns null when
 * the input can't be a valid purchase.
 */
export function normalizePurchase(input: { plan: string; seats: number; months: number }): Purchase | null {
  if (!monthOptions.includes(input.months as (typeof monthOptions)[number])) return null;
  if (!isPlanId(input.plan)) return null;
  let seats = 1;
  if (input.plan === "team") {
    seats = Math.floor(input.seats);
    if (!Number.isFinite(seats) || seats < p.teamUsers || seats > 500) return null;
  }
  return { plan: input.plan, sections: sectionsOf(input.plan), seats, months: input.months };
}

const extraUsers = (seats: number) => Math.max(0, seats - p.teamUsers) * p.extraUser;

/** Price per month in Toman, from the published prices in `copy.plans.pricing`. */
export function monthlyPrice({ plan, seats }: Pick<Purchase, "plan" | "seats">): number {
  if (plan === "team") return p.team + extraUsers(seats);
  return plan === "pharmacy" ? p.pharmacy : p.full;
}

export const totalPrice = (purchase: Purchase): number => monthlyPrice(purchase) * purchase.months;

/** Monthly price before the plan discount (10% individual, 20% team, 15% pharmacy); extra users are not discounted. */
export function listPrice({ plan, seats }: Pick<Purchase, "plan" | "seats">): number {
  if (plan === "team") return p.teamList + extraUsers(seats);
  return plan === "pharmacy" ? p.pharmacyList : p.fullList;
}
