import { Suspense } from "react";
import { Calculator } from "lucide-react";
import { Calculators } from "@/components/calculators";
import { PageHeader } from "@/components/page-header";
import { TrialBanner, sectionAccess } from "@/components/section-gate";
import { ButtonLink, Container } from "@/components/ui";
import { account } from "@/content/account";
import { calculations } from "@/content/calculations";
import { pages } from "@/content/pages";
import { copy } from "@/content/site";
import { bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { formatNumber } from "@/lib/format";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

const page = pages.tools;
const lead = bi(
  page.lead.en.replace("{n}", String(calculations.length)),
  page.lead.fa.replace("{n}", calculations.length.toLocaleString("fa-IR-u-nu-latn")),
);
const { gate: t } = account;

export const generateMetadata = () => pageMetadata(page.title, lead, "tools");

export default async function ToolsPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="tools" title={page.title} lead={lead} />
      <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
        <Tools locale={locale} />
      </Suspense>
    </>
  );
}

async function Tools({ locale }: { locale: Locale }) {
  const access = await sectionAccess("tools");
  const demo = access.kind === "signup" || access.kind === "trialOver";
  return (
    <>
      {access.kind === "trial" && <TrialBanner locale={locale} day={access.day} />}
      <Container className="py-12">
        {demo && <ExampleNotice locale={locale} signedIn={access.kind === "trialOver"} />}
        <Calculators locale={locale} demo={demo} />
      </Container>
    </>
  );
}

function ExampleNotice({ locale, signedIn }: { locale: Locale; signedIn: boolean }) {
  const here = href(locale, "tools");
  const buy = href(locale, "account/buy");
  return (
    <div className="mb-8 flex flex-col gap-5 rounded-card border border-capsule-400/50 bg-gradient-to-br from-capsule-50 via-white to-molecule-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-molecule-600 shadow-sm">
          <Calculator className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-lg font-bold text-vault-900">{t.exampleTitle[locale]}</p>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{t.exampleText[locale].replace("{n}", String(calculations.length))}</p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-2 sm:items-end">
        {signedIn ? (
          <ButtonLink href={buy}>{t.buyAll[locale].replace("{price}", formatNumber(copy.plans.pricing.full, locale))}</ButtonLink>
        ) : (
          <>
            <ButtonLink href={`${href(locale, "account/register")}?next=${encodeURIComponent(here)}`}>{t.signup[locale]}</ButtonLink>
            <span className="text-xs text-muted">{t.exampleSignup[locale]}</span>
          </>
        )}
      </div>
    </div>
  );
}
