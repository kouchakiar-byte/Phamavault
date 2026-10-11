import { copy } from "@/content/site";
import { sections, type SectionSlug } from "@/content/sections";

/** The nine sections a subscription can unlock (everything but the enterprise page). */
export type PaidSection = Exclude<SectionSlug, "enterprise">;
export const paidSections = sections.map((s) => s.slug).filter((s): s is PaidSection => s !== "enterprise");

export const isPaidSection = (value: string): value is PaidSection =>
  (paidSections as readonly string[]).includes(value);

export type PlanId = "individual" | "team";

/** Subscription lengths offered at checkout, in months. */
export const monthOptions = [1, 3, 6, 12] as const;

export type Purchase = { plan: PlanId; sections: PaidSection[]; seats: number; months: number };

const p = copy.plans.pricing;

/**
 * Cleans a purchase coming from a form: the team plan always covers every
 * section, the individual plan always has one seat. Returns null when the
 * input can't be a valid purchase.
 */
export function normalizePurchase(input: {
  plan: string;
  sections: string[];
  seats: number;
  months: number;
}): Purchase | null {
  if (!monthOptions.includes(input.months as (typeof monthOptions)[number])) return null;
  if (input.plan === "team") {
    const seats = Math.floor(input.seats);
    if (!Number.isFinite(seats) || seats < p.teamUsers || seats > 500) return null;
    return { plan: "team", sections: [...paidSections], seats, months: input.months };
  }
  if (input.plan !== "individual") return null;
  const chosen = paidSections.filter((s) => input.sections.includes(s));
  if (chosen.length === 0) return null;
  return { plan: "individual", sections: chosen, seats: 1, months: input.months };
}

/** Price per month in Toman, from the published prices in `copy.plans.pricing`. */
export function monthlyPrice({ plan, sections: chosen, seats }: Omit<Purchase, "months">): number {
  if (plan === "team") return p.team + Math.max(0, seats - p.teamUsers) * p.extraUser;
  return chosen.length >= p.sections ? p.full : chosen.length * p.section;
}

export const totalPrice = (purchase: Purchase): number => monthlyPrice(purchase) * purchase.months;
