import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight, BookOpen, ExternalLink, FlaskConical, Pill } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { BudCalculator } from "@/components/pharmacy/bud-calculator";
import { CompoundingBasics, CompoundingTables } from "@/components/pharmacy/compounding-guide";
import { InteractionSearchBox } from "@/components/pharmacy/interaction-checker";
import { IranDrugSearch } from "@/components/pharmacy/iran-drug-search";
import { OrangeBookSearch } from "@/components/pharmacy/orange-book-search";
import { Container } from "@/components/ui";
import { compounding, compoundingGuide, interactionsCopy, iranDrugs, orangeBook, pharmacyPage, type Ref } from "@/content/pharmacy";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";
import { withReviewedMonth } from "@/lib/data-dates";
import pharmacist from "@/assets/photos/pharmacist.webp";

export const generateMetadata = () => pageMetadata(pharmacyPage.title, pharmacyPage.lead, "pharmacy");

function Refs({ refs, locale }: { refs: Ref[]; locale: Locale }) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted">
      <span className="font-semibold text-vault-900">{pharmacyPage.refsLabel[locale]}:</span>
      {refs.map((r) =>
        r.url ? (
          <a
            key={r.label}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="rounded-lg border border-line bg-white px-2 py-0.5 text-molecule-700 hover:border-molecule-500 hover:underline"
          >
            {r.label} ↗
          </a>
        ) : (
          <bdi key={r.label} dir="ltr" className="rounded-lg border border-line bg-white px-2 py-0.5">
            {r.label}
          </bdi>
        ),
      )}
    </p>
  );
}

function LinkCards({ links, locale }: { links: { label: string; url: string; note: Bi }[]; locale: Locale }) {
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {links.map((l) => (
        <li key={l.url}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full items-start gap-2 rounded-xl border border-line bg-white px-3 py-2.5 transition hover:border-molecule-500 hover:bg-molecule-50"
          >
            <ExternalLink className="mt-0.5 size-4 shrink-0 text-molecule-500" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block font-semibold text-vault-900">
                <bdi>{l.label}</bdi>
              </span>
              <span className="block text-xs leading-relaxed text-muted">{l.note[locale]}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

const q = pharmacyPage.quick;
const tools = [
  { section: interactionsCopy, icon: ArrowLeftRight },
  { section: iranDrugs, icon: Pill },
  { section: orangeBook, icon: BookOpen },
];

/** Every part of the page one click away: the three search tools, then each compounding topic. */
function QuickAccess({ locale }: { locale: Locale }) {
  const chip = "inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-vault-900 transition hover:border-molecule-500 hover:text-molecule-700";
  const compoundingLinks = [
    { id: "cmp-facts", label: q.facts },
    ...compoundingGuide.topics.map((t) => ({ id: `cmp-${t.key}`, label: t.title })),
    { id: "cmp-bud", label: q.bud },
    { id: "cmp-record", label: q.record },
    { id: "cmp-excipients", label: q.excipients },
    { id: "cmp-counsel", label: q.counsel },
    { id: "cmp-formulas", label: q.formulas },
    { id: "cmp-calcs", label: q.calcs },
  ];
  return (
    <nav id="quick" aria-label={q.title[locale]} className="scroll-mt-24 rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-bold text-vault-900">{q.title[locale]}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {tools.map(({ section, icon: Icon }) => (
          <li key={section.key}>
            <a
              href={`#${section.key}`}
              className="flex h-full items-center gap-3 rounded-2xl border border-vault-100 bg-vault-50 px-4 py-3 font-semibold text-vault-900 transition hover:border-capsule-400 hover:bg-capsule-50"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-vault-900 text-molecule-400">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm leading-snug">{section.title[locale]}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-line pt-4">
        <a href={`#${compounding.key}`} className="flex items-center gap-2 text-sm font-bold text-vault-900 hover:text-molecule-700">
          <FlaskConical className="size-4 text-capsule-600" aria-hidden="true" />
          {q.compounding[locale]}
        </a>
        <ul className="mt-3 flex flex-wrap gap-2">
          {compoundingLinks.map((l) => (
            <li key={l.id}>
              <a href={`#${l.id}`} className={chip}>
                {l.label[locale]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default async function PharmacyPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="pharmacy" title={pharmacyPage.title} lead={pharmacyPage.lead} />
      <Container className="space-y-14 py-12">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="space-y-3">
            <p className="rounded-xl border border-capsule-400/40 bg-capsule-400/10 px-4 py-3 text-sm leading-relaxed text-ink">
              {pharmacyPage.disclaimer[locale]} {withReviewedMonth(pharmacyPage.reviewed[locale], "pharmacy", locale)}
            </p>
            <QuickAccess locale={locale} />
          </div>
          <div className="relative order-first h-60 overflow-hidden rounded-3xl shadow-lg shadow-vault-950/10 ring-1 ring-line sm:h-72 lg:order-none lg:h-auto">
            <Image src={pharmacist} alt="" fill priority sizes="(min-width: 1024px) 272px, 100vw" placeholder="blur" className="object-cover object-[50%_28%] lg:object-[50%_35%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-vault-950/30 to-transparent" aria-hidden="true" />
          </div>
        </div>

        {/* 0. Drug interaction checker */}
        <section id={interactionsCopy.key} className="scroll-mt-24 space-y-5 rounded-3xl border border-capsule-400/40 bg-capsule-50 bg-gradient-to-br from-capsule-50 to-white p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-vault-900">{interactionsCopy.title[locale]}</h2>
              <p className="mt-2 max-w-3xl text-muted">{interactionsCopy.lead[locale]}</p>
            </div>
            <Link href={href(locale, "pharmacy/interactions")} className="text-sm font-semibold text-capsule-700 hover:underline">
              {interactionsCopy.open[locale]}
            </Link>
          </div>
          <InteractionSearchBox locale={locale} />
        </section>

        {/* 1. Iranian medicines: live from the Iran FDA register */}
        <section id={iranDrugs.key} className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-vault-900">{iranDrugs.title[locale]}</h2>
            <p className="mt-2 text-muted">{iranDrugs.lead[locale]}</p>
          </div>
          <IranDrugSearch locale={locale} />
        </section>

        {/* 2. Generic and brand products */}
        <section id={orangeBook.key} className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-vault-900">{orangeBook.title[locale]}</h2>
            <p className="mt-2 text-muted">{orangeBook.lead[locale]}</p>
          </div>
          <OrangeBookSearch locale={locale} />
          <p className="text-sm leading-relaxed text-ink">{orangeBook.note[locale]}</p>
          <Refs refs={orangeBook.refs} locale={locale} />
          <LinkCards links={orangeBook.links} locale={locale} />
        </section>

        {/* 3. Compounding */}
        <section id={compounding.key} className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-vault-900">{compounding.title[locale]}</h2>
            <p className="mt-2 text-muted">{compounding.lead[locale]}</p>
          </div>

          <CompoundingBasics locale={locale} />

          <div id="cmp-bud" className="scroll-mt-24">
            <h3 className="mb-3 text-lg font-bold text-vault-900">{compounding.budTitle[locale]}</h3>
            <BudCalculator locale={locale} />
            <p className="mt-3 text-sm leading-relaxed text-ink">{compounding.budNote[locale]}</p>
            <Refs refs={compounding.refs} locale={locale} />
          </div>

          <div id="cmp-record" className="scroll-mt-24 rounded-card border border-line bg-white p-5">
            <h3 className="text-lg font-bold text-vault-900">{compounding.recordTitle[locale]}</h3>
            <ul className="mt-3 list-disc space-y-1.5 ps-5 leading-relaxed text-ink">
              {compounding.record.map((r) => (
                <li key={r.en}>{r[locale]}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-muted">{compounding.recordNote[locale]}</p>
          </div>

          <CompoundingTables locale={locale} />

          <div id="cmp-formulas" className="scroll-mt-24">
            <h3 className="text-lg font-bold text-vault-900">{compounding.formulasTitle[locale]}</h3>
            <LinkCards links={compounding.formulas} locale={locale} />
          </div>

          <div id="cmp-calcs" className="scroll-mt-24">
            <h3 className="text-lg font-bold text-vault-900">{compounding.calcsTitle[locale]}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {compounding.calcs.map((c) => (
                <li key={c.key}>
                  <Link href={`${href(locale, "tools")}?calc=${c.key}`} className="inline-block rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium text-molecule-700 hover:border-molecule-500">
                    {c.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Container>
    </>
  );
}
