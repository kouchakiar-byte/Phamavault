import { BeCalculator } from "@/components/be-calculator";
import { PageHeader } from "@/components/page-header";
import { Bullets, Cards, DataTable, JumpNav, Steps, SubTitle } from "@/components/quality-blocks";
import { Container } from "@/components/ui";
import { be as raw } from "@/content/bioequivalence";
import type { Bi } from "@/i18n/bi";
import { getLocale } from "@/i18n/locale";
import { sampleSize } from "@/lib/be-stats";
import { isolateLatin } from "@/lib/bidi";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

/** Every Persian string with its Latin and numeric runs isolated, so terms, numbers and units keep their order. */
function isolateAll<T>(value: T): T {
  if (Array.isArray(value)) return value.map(isolateAll) as T;
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (typeof o.en === "string" && typeof o.fa === "string") return { ...o, fa: isolateLatin(o.fa) } as T;
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, isolateAll(v)])) as T;
  }
  return value;
}
const be = isolateAll(raw);

export const generateMetadata = () => pageMetadata(raw.title, raw.lead, "regulatory/bioequivalence");

// Sample sizes for the reference table, computed once when the module loads.
const CVS = [10, 15, 20, 25, 30, 35, 40, 45, 50];
const COLS = [
  { gmr: 0.9, power: 0.8 },
  { gmr: 0.95, power: 0.8 },
  { gmr: 1, power: 0.8 },
  { gmr: 0.9, power: 0.9 },
  { gmr: 0.95, power: 0.9 },
  { gmr: 1, power: 0.9 },
];
const sizeRows = CVS.map((cv) => [`${cv}%`, ...COLS.map((c) => String(sampleSize(c.gmr, cv / 100, c.power)?.n ?? "—"))]);

export default async function BioequivalencePage() {
  const locale = await getLocale();
  const sizeCols: Bi[] = [be.sizeCv, ...COLS.map((c) => ({ en: `GMR ${c.gmr.toFixed(2)} · ${c.power * 100}%`, fa: `GMR ${c.gmr.toFixed(2)} · ${c.power * 100}%` }))];
  const calcLabels = Object.fromEntries(Object.entries(be.calc).map(([k, v]) => [k, v[locale]])) as Record<keyof typeof be.calc, string>;
  return (
    <>
      <PageHeader locale={locale} section="regulatory" title={be.title} lead={be.lead} back={{ href: href(locale, "regulatory"), label: be.back }} />
      <Container className="py-12">
        <p className="mb-8 rounded-card border-2 border-dashed border-molecule-400 bg-molecule-50 px-5 py-3.5 text-sm leading-relaxed text-molecule-700">{be.note[locale]}</p>
        <JumpNav
          locale={locale}
          label={be.title[locale]}
          items={[
            { id: "concepts", label: be.conceptsTitle },
            { id: "design", label: be.designTitle },
            { id: "pk", label: be.pkTitle },
            { id: "stats", label: be.statsTitle },
            { id: "acceptance", label: be.accTitle },
            { id: "bcs", label: be.bcsTitle },
            { id: "strengths", label: be.strengthsTitle },
            { id: "size", label: be.sizeTitle },
            { id: "calculators", label: be.calcTitle },
            { id: "checklist", label: be.checklistTitle },
            { id: "glossary", label: be.glossaryTitle },
          ]}
        />

        <SubTitle id="concepts" text={be.conceptsTitle} locale={locale} />
        <Cards items={be.concepts} locale={locale} />

        <SubTitle id="design" text={be.designTitle} locale={locale} />
        <Bullets items={be.design} locale={locale} />

        <SubTitle id="pk" text={be.pkTitle} locale={locale} />
        <DataTable cols={be.pkCols} rows={be.pk} locale={locale} />

        <SubTitle id="stats" text={be.statsTitle} locale={locale} />
        <Steps items={be.stats} locale={locale} />
        <div className="mt-4">
          <Cards items={be.formulas} locale={locale} />
        </div>

        <SubTitle id="acceptance" text={be.accTitle} locale={locale} />
        <DataTable cols={be.accCols} rows={be.acc} locale={locale} />

        <SubTitle id="bcs" text={be.bcsTitle} locale={locale} />
        <DataTable cols={be.bcsCols} rows={be.bcs} locale={locale} />
        <div className="mt-4">
          <Bullets items={be.bcsNotes} locale={locale} />
        </div>

        <SubTitle id="strengths" text={be.strengthsTitle} locale={locale} />
        <Bullets items={be.strengths} locale={locale} />

        <SubTitle id="size" text={be.sizeTitle} locale={locale} lead={be.sizeLead} />
        <DataTable cols={sizeCols} rows={sizeRows} locale={locale} mono={[1, 2, 3, 4, 5, 6]} />

        <SubTitle id="calculators" text={be.calcTitle} locale={locale} />
        <BeCalculator labels={calcLabels} />

        <SubTitle id="checklist" text={be.checklistTitle} locale={locale} />
        <Bullets items={be.checklist} locale={locale} numbered />

        <SubTitle id="glossary" text={be.glossaryTitle} locale={locale} />
        <Cards items={be.glossary} locale={locale} />

        <SubTitle id="refs" text={be.refsTitle} locale={locale} />
        <ul className="list-disc space-y-1.5 ps-6 text-sm leading-relaxed text-muted" dir="ltr" style={{ textAlign: "left" }}>
          {be.refs.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Container>
    </>
  );
}
