import { Suspense, type ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import { cookies, headers } from "next/headers";
import { connection } from "next/server";
import { CalendarClock, Lock, UserPlus } from "lucide-react";
import { account } from "@/content/account";
import { getSection } from "@/content/sections";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { formatNumber } from "@/lib/format";
import { href } from "@/lib/paths";
import type { PaidSection } from "@/lib/pricing";
import { FREE_DAYS, claimTrialDay } from "@/lib/metering";
import { isVerifiedSearchBot } from "@/lib/search-bots";
import { paywallEnabled, sectionsFor } from "@/lib/subscriptions";
import { ButtonLink, Container } from "./ui";
import suppliersPreview from "@/assets/previews/suppliers.webp";
import handbooksPreview from "@/assets/previews/handbooks.webp";
import excipientsPreview from "@/assets/previews/excipients.webp";
import materialsPreview from "@/assets/previews/materials.webp";
import toolsPreview from "@/assets/previews/tools.webp";
import formulationPreview from "@/assets/previews/formulation.webp";
import regulatoryPreview from "@/assets/previews/regulatory.webp";
import qcPreview from "@/assets/previews/qc.webp";
import qaPreview from "@/assets/previews/qa.webp";
import referencesPreview from "@/assets/previews/references.webp";
import pharmacyPreview from "@/assets/previews/pharmacy.webp";


const { gate: t } = account;

/** A blurred, static picture of each section's page: readers see what is inside, but nothing in it can be read or copied. */
const previews: Record<PaidSection, StaticImageData> = {
  suppliers: suppliersPreview,
  handbooks: handbooksPreview,
  excipients: excipientsPreview,
  materials: materialsPreview,
  tools: toolsPreview,
  formulation: formulationPreview,
  regulatory: regulatoryPreview,
  qc: qcPreview,
  qa: qaPreview,
  references: referencesPreview,
  pharmacy: pharmacyPreview,
};
const p = copy.plans.pricing;

/**
 * Google's markup for paywalled pages: the section body is not free, so showing it
 * to verified crawlers while readers see the paywall is not cloaking.
 */
const paywallSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  isAccessibleForFree: false,
  hasPart: { "@type": "WebPageElement", isAccessibleForFree: false, cssSelector: ".pv-paywalled" },
});

/**
 * Shows a section, once PAYWALL=on, to subscribers who have it, to admins, to verified
 * search engines and, on FREE_DAYS days a Jalali month, to any signed-in reader.
 * Access is checked per request, so it streams in behind a boundary.
 */
export function SectionGate({ section, children }: { section: PaidSection; children: ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
      <Gate section={section}>{children}</Gate>
    </Suspense>
  );
}

const open = (children: ReactNode, banner?: ReactNode) => (
  <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: paywallSchema }} />
    {banner}
    <div className="pv-paywalled">{children}</div>
  </>
);

export type SectionAccess =
  | { kind: "free" } // PAYWALL is off
  | { kind: "open" }
  | { kind: "trial"; day: number }
  | { kind: "signup" }
  | { kind: "trialOver" };

/**
 * Who may use a section on this request: subscribers to it, admins and verified search
 * engines; a signed-in reader on one of this month's free days (taking a day if one is left).
 */
export async function sectionAccess(section: PaidSection): Promise<SectionAccess> {
  await cookies(); // request-time check, never prerendered
  if (!paywallEnabled()) return { kind: "free" };
  await connection(); // the free-day count and the crawler check read the clock
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;
  const user = await getUser().catch(() => null);
  if (user?.isAdmin) return { kind: "open" };
  if (user && (await sectionsFor(user.mobile).catch(() => new Set<string>())).has(section)) return { kind: "open" };
  if (!user && (await isVerifiedSearchBot(h.get("user-agent"), ip))) return { kind: "open" };
  if (!user) return { kind: "signup" };
  const trial = await claimTrialDay(user.id, ip).catch(() => ({ ok: false, used: FREE_DAYS, today: false }));
  return trial.ok ? { kind: "trial", day: trial.used } : { kind: "trialOver" };
}

async function Gate({ section, children }: { section: PaidSection; children: ReactNode }) {
  const access = await sectionAccess(section);
  if (access.kind === "free") return children;
  if (access.kind === "open") return open(children);
  const locale = await getLocale();
  if (access.kind === "trial") return open(children, <TrialBanner locale={locale} day={access.day} />);
  return <Paywall section={section} locale={locale} state={access.kind} />;
}

export function TrialBanner({ locale, day }: { locale: Locale; day: number }) {
  return (
    <div className="border-b border-capsule-400/40 bg-capsule-400/10">
      <Container className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
        <p className="flex items-center gap-2 text-ink">
          <CalendarClock className="size-4 shrink-0 text-capsule-700" aria-hidden="true" />
          {t.trialBanner[locale].replace("{n}", String(day))}
        </p>
        <a href={href(locale, "account/buy")} className="font-semibold text-molecule-700 hover:underline">
          {t.trialBuy[locale]}
        </a>
      </Container>
    </div>
  );
}

function Paywall({ section, locale, state }: { section: PaidSection; locale: Locale; state: "signup" | "trialOver" }) {
  const signedIn = state !== "signup";
  const { title: sectionTitle, description } = getSection(section);
  const title = sectionTitle[locale];
  const buy = href(locale, "account/buy");
  const here = href(locale, getSection(section).href);
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-card border border-line bg-white text-center shadow-sm">
        <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-paper" aria-hidden="true">
          <Image src={previews[section]} alt="" fill sizes="(min-width: 672px) 672px, 100vw" placeholder="blur" className="scale-110 object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white" />
          <span className="absolute inset-x-0 bottom-5 mx-auto flex size-16 items-center justify-center rounded-2xl border border-molecule-400/40 bg-white/90 text-molecule-600 shadow-lg backdrop-blur">
            {signedIn ? <Lock className="size-8" /> : <UserPlus className="size-8" />}
          </span>
        </div>
        <div className="p-8 pt-6 sm:p-12 sm:pt-8">
          <h1 className="text-2xl font-bold text-vault-900 sm:text-3xl">{(signedIn ? t.trialOverTitle : t.signupTitle)[locale]}</h1>
          <p className="mt-2 text-lg font-semibold text-molecule-700">{title}</p>
          <p className="mx-auto mt-3 max-w-xl rounded-xl bg-molecule-50/60 px-4 py-3 text-sm leading-relaxed text-ink">{description[locale]}</p>
          <p className="mt-4 leading-relaxed text-muted">{(signedIn ? t.trialOverText : t.signupText)[locale].replace("{section}", title)}</p>
          {section === "pharmacy" && <p className="mt-2 text-sm text-muted">{t.textPharmacy[locale]}</p>}
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            {!signedIn ? (
              <>
                <ButtonLink href={`${href(locale, "account/register")}?next=${encodeURIComponent(here)}`}>{t.signup[locale]}</ButtonLink>
                <ButtonLink href={`${href(locale, "account/login")}?next=${encodeURIComponent(here)}`} variant="ghost" arrow={false}>
                  {t.signInPlain[locale]}
                </ButtonLink>
              </>
            ) : section === "pharmacy" ? (
              <ButtonLink href={`${buy}?plan=pharmacy`}>{t.buyPharmacy[locale].replace("{price}", formatNumber(p.pharmacy, locale))}</ButtonLink>
            ) : (
              <>
                <ButtonLink href={buy}>{t.buyAll[locale].replace("{price}", formatNumber(p.full, locale))}</ButtonLink>
                <ButtonLink href={`${buy}?plan=team`} variant="ghost" arrow={false}>
                  {copy.plans.items[1].name[locale]}
                </ButtonLink>
              </>
            )}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {!signedIn && (
              <a href={buy} className="font-semibold text-molecule-700 hover:underline">
                {t.buyAll[locale].replace("{price}", formatNumber(p.full, locale))}
              </a>
            )}
            <a href={href(locale, "#plans")} className="text-muted hover:text-molecule-700">
              {t.plans[locale]}
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
