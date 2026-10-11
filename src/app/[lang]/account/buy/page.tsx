import { Suspense } from "react";
import { redirect } from "next/navigation";
import { BuyForm } from "@/components/account/forms";
import { AccountShell, Loading, accountMetadata } from "@/components/account/shell";
import { account } from "@/content/account";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";
import { formatNumber } from "@/lib/format";
import { planName, sectionsLabel } from "@/lib/labels";
import { href } from "@/lib/paths";
import { isPaidSection, paidSections } from "@/lib/pricing";
import { getSubscription } from "@/lib/subscriptions";
import { onlinePaymentEnabled } from "@/lib/zarinpal";

const { buy: t } = account;

export const generateMetadata = () => accountMetadata(t.title);

type Search = Record<string, string | string[] | undefined>;

async function Checkout({ locale, searchParams }: { locale: Locale; searchParams: Promise<Search> }) {
  const search = await searchParams;
  if (!databaseConfigured()) return <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">{account.errors.unavailable[locale]}</p>;

  const user = await getUser();
  if (!user) {
    const query = new URLSearchParams(Object.entries(search).map(([k, v]) => [k, String(v)])).toString();
    const here = `${href(locale, "account/buy")}${query ? `?${query}` : ""}`;
    redirect(`${href(locale, "account/register")}?next=${encodeURIComponent(here)}`);
  }

  const renewing = search.renew ? await getSubscription(String(search.renew)) : null;
  const renewal =
    renewing && renewing.ownerId === user.id && !renewing.revoked
      ? {
          id: renewing.id,
          plan: renewing.plan,
          sections: renewing.sections,
          seats: renewing.seats,
          label: `${planName(renewing.plan, locale)} · ${
            renewing.plan === "team"
              ? account.dashboard.users[locale].replace("{n}", formatNumber(renewing.seats, locale))
              : sectionsLabel(renewing.sections, locale)
          }`,
        }
      : null;

  // ?plan=team, ?s=qa (one section) or ?s=all preselect the form.
  const section = String(search.s ?? "all");
  return (
    <BuyForm
      locale={locale}
      initialPlan={search.plan === "team" ? "team" : "individual"}
      initialSections={isPaidSection(section) ? [section] : [...paidSections]}
      renewal={renewal}
      online={onlinePaymentEnabled()}
    />
  );
}

export default async function BuyPage({ searchParams }: PageProps<"/[lang]/account/buy">) {
  const locale = await getLocale();
  return (
    <AccountShell locale={locale} title={t.title} lead={t.lead} wide>
      <Suspense fallback={<Loading label="…" />}>
        <Checkout locale={locale} searchParams={searchParams} />
      </Suspense>
    </AccountShell>
  );
}
