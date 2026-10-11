import { Suspense, type ReactNode } from "react";
import { cookies } from "next/headers";
import { Lock } from "lucide-react";
import { account } from "@/content/account";
import { getSection } from "@/content/sections";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { formatNumber } from "@/lib/format";
import { href } from "@/lib/paths";
import type { PaidSection } from "@/lib/pricing";
import { paywallEnabled, sectionsFor } from "@/lib/subscriptions";
import { ButtonLink, Container } from "./ui";

const { gate: t } = account;
const p = copy.plans.pricing;

/**
 * Shows a section only to subscribers who have it, once PAYWALL=on.
 * Access is checked per request, so it streams in behind a boundary.
 */
export function SectionGate({ section, children }: { section: PaidSection; children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
      <Gate section={section}>{children}</Gate>
    </Suspense>
  );
}

async function Gate({ section, children }: { section: PaidSection; children: ReactNode }) {
  await cookies(); // request-time check, never prerendered
  if (!paywallEnabled()) return children;
  const user = await getUser().catch(() => null);
  if (user?.isAdmin) return children;
  if (user && (await sectionsFor(user.mobile).catch(() => new Set<string>())).has(section)) return children;
  return <Paywall section={section} locale={await getLocale()} signedIn={Boolean(user)} />;
}

function Paywall({ section, locale, signedIn }: { section: PaidSection; locale: Locale; signedIn: boolean }) {
  const title = getSection(section).title[locale];
  const buy = href(locale, "account/buy");
  const here = href(locale, getSection(section).href);
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl rounded-card border border-line bg-white p-8 text-center shadow-sm sm:p-12">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-molecule-50 text-molecule-600">
          <Lock className="size-7" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-vault-900 sm:text-3xl">{t.title[locale]}</h1>
        <p className="mt-2 text-lg font-semibold text-molecule-700">{title}</p>
        <p className="mt-4 text-muted">{t.text[locale].replace("{section}", title)}</p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href={`${buy}?s=all`}>{t.buyAll[locale].replace("{price}", formatNumber(p.full, locale))}</ButtonLink>
          <ButtonLink href={`${buy}?s=${section}`} variant="ghost" arrow={false}>
            {t.buySection[locale].replace("{price}", formatNumber(p.section, locale))}
          </ButtonLink>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {!signedIn && (
            <a href={`${href(locale, "account/login")}?next=${encodeURIComponent(here)}`} className="font-semibold text-molecule-700 hover:underline">
              {t.signIn[locale]}
            </a>
          )}
          <a href={href(locale, "#plans")} className="text-muted hover:text-molecule-700">
            {t.plans[locale]}
          </a>
        </div>
      </div>
    </Container>
  );
}
