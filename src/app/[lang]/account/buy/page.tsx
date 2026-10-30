import { EnamadSeal } from "@/components/enamad-seal";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { BuyForm } from "@/components/account/forms";
import { AccountShell, Loading, accountMetadata } from "@/components/account/shell";
import { account } from "@/content/account";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { formatNumber } from "@/lib/format";
import { planName, sectionsLabel } from "@/lib/labels";
import { isPlanId, monthOptions, type PlanId } from "@/lib/pricing";
import { href } from "@/lib/paths";
import { getSubscription } from "@/lib/subscriptions";
import { onlinePaymentEnabled } from "@/lib/zarinpal";

const { buy: t } = account;

export const generateMetadata = () => accountMetadata(t.title);

type Search = Record<string, string | string[] | undefined>;

async function Checkout({ locale, searchParams }: { locale: Locale; searchParams: Promise<Search> }) {
  const search = await searchParams;
  // The Android app (user agent "PharmaVaultApp") does not sell subscriptions; the stores have their own billing rules.
  if ((await headers()).get("user-agent")?.includes("PharmaVaultApp")) return <AppNotice locale={locale} signedIn={Boolean(await getUser())} />;
  // Anyone can walk through the vault; signing up is asked for at the last key.
  const user = await getUser();

  const renewing = user && search.renew ? await getSubscription(String(search.renew)) : null;
  const renewal =
    user && renewing && renewing.ownerId === user.id && !renewing.revoked
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

  // ?plan=team or ?plan=pharmacy, ?seats=, ?months= preselect the form; ?ready=1 (back from sign-up) opens it at the last key.
  const months = Number(search.months);
  return (
    <BuyForm
      // A new set of choices (e.g. back from sign-up) starts a fresh form, not the remembered one.
      key={new URLSearchParams(Object.entries(search).map(([k, v]) => [k, String(v)])).toString()}
      locale={locale}
      initialPlan={isPlanId(String(search.plan)) ? (String(search.plan) as PlanId) : "individual"}
      initialSeats={Math.max(copy.plans.pricing.teamUsers, Math.floor(Number(search.seats)) || 0)}
      initialMonths={monthOptions.includes(months as (typeof monthOptions)[number]) ? months : 1}
      startAtLast={search.ready === "1"}
      signedIn={Boolean(user)}
      renewal={renewal}
      online={onlinePaymentEnabled()}
    />
  );
}

function AppNotice({ locale, signedIn }: { locale: Locale; signedIn: boolean }) {
  return (
    <div className="mx-auto max-w-md rounded-card border border-line bg-white p-6 text-center">
      <h2 className="font-bold text-vault-900">{t.appTitle[locale]}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">{t.appLead[locale]}</p>
      <Link
        href={signedIn ? href(locale, "account") : href(locale, "account/login")}
        className="mt-5 inline-flex rounded-full bg-vault-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-vault-800"
      >
        {signedIn ? account.nav.account[locale] : account.nav.signIn[locale]}
      </Link>
    </div>
  );
}

export default async function BuyPage({ searchParams }: PageProps<"/[lang]/account/buy">) {
  const locale = await getLocale();
  return (
    <AccountShell locale={locale} title={t.title} lead={t.lead} wide>
      <Suspense fallback={<Loading label="…" />}>
        <Checkout locale={locale} searchParams={searchParams} />
      </Suspense>
      <EnamadSeal locale={locale} className="mx-auto mt-8 w-full max-w-md" />
    </AccountShell>
  );
}
