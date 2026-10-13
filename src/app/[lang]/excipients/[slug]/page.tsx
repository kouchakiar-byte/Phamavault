import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BackLink, Container } from "@/components/ui";
import { SheetHeader, SheetPage } from "@/components/excipient-sheet";
import { excipientSheet as t } from "@/content/excipient-sheet";
import { excipients } from "@/data";
import { monographs } from "@/data/monographs";
import sheets from "@/data/excipient-sheets.json";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { excipientSlug } from "@/lib/excipient-slug";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

type PubChem = { cid: number | null; title?: string; formula?: string; mw?: string; unii?: string; match?: "cas" | "name" | "none" };
const pubchem = (sheets as { generated: string; items: Record<string, PubChem> }).items;
const accessed = (sheets as { generated: string }).generated;

/** Reference list entries, cited at the foot of every sheet that uses them. */
const REFS: Record<string, string> = {
  hpe: "Sheskey PJ, Hancock BC, Moss GP, Goldfarb DJ (eds). Handbook of Pharmaceutical Excipients, 9th ed. London: Pharmaceutical Press; 2020.",
  usp: "United States Pharmacopeia and National Formulary (USP–NF 2026). Rockville, MD: United States Pharmacopeial Convention.",
  ep: "European Pharmacopoeia, 12th ed. (Ph. Eur. 12.3). Strasbourg: EDQM, Council of Europe.",
  bp: "British Pharmacopoeia 2026. London: Medicines and Healthcare products Regulatory Agency.",
  jp: "The Japanese Pharmacopoeia, 19th ed. (JP19). Tokyo: Ministry of Health, Labour and Welfare; 2026.",
  iid: "U.S. Food and Drug Administration. Inactive Ingredient Database (IID). accessdata.fda.gov/scripts/cder/iig",
  gras: "U.S. Code of Federal Regulations, Title 21, Parts 182 and 184: substances generally recognised as safe (GRAS).",
  "eu-additives": "Regulation (EC) No 1333/2008 of the European Parliament and of the Council on food additives, Annex II (Union list).",
  efsa: "European Food Safety Authority (EFSA). Scientific opinions on the re-evaluation of food additives. EFSA Journal.",
  jecfa: "Joint FAO/WHO Expert Committee on Food Additives (JECFA). Evaluations of food additives. Geneva: WHO.",
  ich: "ICH Q3C(R9): Impurities — Guideline for Residual Solvents. International Council for Harmonisation; 2024.",
  hsdb: "Hazardous Substances Data Bank (HSDB). U.S. National Library of Medicine, via PubChem.",
};
const PH_REF: Record<string, string> = { BP: "bp", JP: "jp", PhEur: "ep", "USP-NF": "usp", USP: "usp" };
const PH_LABEL: Record<string, string> = { BP: "BP", JP: "JP", PhEur: "Ph. Eur.", "USP-NF": "USP–NF", USP: "USP" };

// One sheet is prerendered; the others render on first request and are then cached.
export function generateStaticParams() {
  return [{ slug: excipientSlug(excipients.items[0].name) }];
}

async function load(params: PageProps<"/[lang]/excipients/[slug]">["params"]) {
  const { slug } = await params;
  const item = excipients.items.find((x) => excipientSlug(x.name) === slug);
  if (!item) notFound();
  return { item, mono: monographs[item.name], pc: pubchem[item.name] };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/excipients/[slug]">): Promise<Metadata> {
  const { item } = await load(params);
  return pageMetadata(
    { en: `${item.name} — ${t.docTitle.en}`, fa: `${item.name} — ${t.docTitle.fa}` },
    t.openNote,
    `excipients/${excipientSlug(item.name)}`,
  );
}

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-5 break-inside-avoid">
      <h2 className="mb-1.5 flex items-baseline gap-2 text-[0.95rem] font-bold text-vault-900">
        <span className="font-mono text-molecule-700">{n}</span>
        {title}
      </h2>
      <div className="leading-7 text-ink">{children}</div>
    </section>
  );
}

/**
 * Persian text mixes in numbers, units and Latin terms ("117–150 °C", "PH-102");
 * each such run is wrapped in a left-to-right isolate so it keeps its order.
 */
const LATIN_RUN = /[A-Za-z0-9≈±~<>≤≥+−-][A-Za-z0-9≈±~<>≤≥+−\-–.,:/×·°µ%³²⁻¹ ]*[A-Za-z0-9°µ%³²⁻¹]|[A-Za-z0-9]/g;
function isolate(text: string, locale: Locale): string {
  return locale === "fa" ? text.replace(LATIN_RUN, (m) => `\u2066${m}\u2069`) : text;
}

function Para({ text, locale }: { text: { en: string; fa: string }; locale: Locale }) {
  return <p className="text-justify">{isolate(text[locale], locale)}</p>;
}

function Ltr({ children }: { children: ReactNode }) {
  return (
    <span dir="ltr" className="font-mono">
      {children}
    </span>
  );
}

export default async function ExcipientSheetPage({ params }: PageProps<"/[lang]/excipients/[slug]">) {
  const [locale, { item, mono, pc }] = await Promise.all([getLocale(), load(params)]);
  const sep = locale === "fa" ? "، " : ", ";
  const s = t.sections;
  const fa = /[؀-ۿ]/;
  const synonyms = item.synonyms.split(/,\s*/).filter(Boolean);
  const synFa = synonyms.filter((x) => fa.test(x));
  const synEn = synonyms.filter((x) => !fa.test(x));
  // Only PubChem records that list the excipient's own CAS number are used.
  const compound = pc?.cid && pc.match === "cas" ? pc : null;
  const formula = mono ? mono.formula : compound?.formula || "";
  const mw = mono ? mono.mw : compound?.mw || "";

  const refKeys = new Set<string>(["hpe"]);
  mono?.names.forEach((x) => PH_REF[x.ph] && refKeys.add(PH_REF[x.ph]));
  mono?.refs.forEach((r) => REFS[r] && refKeys.add(r));
  if (!mono) refKeys.add("iid");
  const refs = [...refKeys].map((k) => REFS[k]);
  if (compound)
    refs.push(
      `PubChem Compound Summary for CID ${compound.cid} (${compound.title}). National Center for Biotechnology Information, U.S. National Library of Medicine${accessed ? `; accessed ${accessed}` : ""}. pubchem.ncbi.nlm.nih.gov/compound/${compound.cid}`,
    );

  let n = 0;
  const next = () => ++n;
  const functions = item.functions.map((f) => excipients.functions[f as keyof typeof excipients.functions]?.[locale] ?? f).join(sep);
  const forms = item.forms.map((f) => excipients.forms[f as keyof typeof excipients.forms]?.[locale] ?? f).join(sep);

  return (
    <Container className="py-8 sm:py-12">
      <BackLink href={href(locale, "excipients")}>{t.back[locale]}</BackLink>
      <div className="mt-5">
        <SheetPage locale={locale} printBlocked={t.printBlocked[locale]}>
          <SheetHeader docTitle={`${t.docTitle.en} · ${t.docTitle.fa}`} />
          <div className="px-6 pb-8 pt-6 text-sm sm:px-10">
            <h1 className="text-2xl font-bold tracking-tight text-vault-900 sm:text-3xl" dir="ltr" style={{ textAlign: locale === "fa" ? "right" : "left" }}>
              {item.name}
            </h1>
            {synFa.length > 0 && <p className="mt-1 text-base font-semibold text-molecule-700">{synFa.join("، ")}</p>}
            {!mono && <p className="mt-3 rounded-lg bg-capsule-400/10 px-3 py-2 text-xs text-vault-800">{t.pending[locale]}</p>}

            {mono && mono.names.length > 0 && (
              <Section n={next()} title={s.names[locale]}>
                <ul dir="ltr" className="grid gap-x-6 gap-y-0.5 sm:grid-cols-2" style={{ textAlign: "left" }}>
                  {mono.names.map((x) => (
                    <li key={x.ph}>
                      <span className="inline-block w-16 font-semibold text-molecule-700">{PH_LABEL[x.ph] ?? x.ph}</span>
                      {x.name}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section n={next()} title={s.synonyms[locale]}>
              <p dir="ltr" style={{ textAlign: "left" }}>
                {mono?.tradeNames || synEn.join("; ") || "—"}
              </p>
            </Section>

            <Section n={next()} title={s.chemical[locale]}>
              <p dir="ltr" style={{ textAlign: "left" }}>
                {mono?.chemicalName && <span>{mono.chemicalName} · </span>}
                <span className="font-mono">[{item.cas || "—"}]</span>
              </p>
              {compound?.unii && (
                <p className="mt-0.5 text-xs text-muted" dir="ltr" style={{ textAlign: "left" }}>
                  UNII <span className="font-mono">{compound.unii}</span> · PubChem CID <span className="font-mono">{compound.cid}</span>
                </p>
              )}
            </Section>

            <Section n={next()} title={s.formula[locale]}>
              {formula ? (
                <p dir="ltr" style={{ textAlign: "left" }}>
                  <Ltr>{formula}</Ltr>
                  {mw && (
                    <>
                      {"  ·  "}
                      <Ltr>{mw}</Ltr>
                    </>
                  )}
                </p>
              ) : (
                <p>{t.noCompound[locale]}</p>
              )}
            </Section>

            <Section n={next()} title={s.category[locale]}>
              <p>{isolate(functions, locale)}</p>
              <p className="mt-1 text-muted">
                {t.levels[locale]}: <bdi>{item.useLevel || "—"}</bdi> · {t.forms[locale]}: {forms}
              </p>
            </Section>

            {mono && (
              <>
                <Section n={next()} title={s.applications[locale]}>
                  <Para text={mono.applications} locale={locale} />
                </Section>
                <Section n={next()} title={s.description[locale]}>
                  <Para text={mono.description} locale={locale} />
                </Section>
                {mono.properties.length > 0 && (
                  <Section n={next()} title={s.properties[locale]}>
                    <dl className="divide-y divide-line/70">
                      {mono.properties.map((p) => (
                        <div key={p.k.en} className="grid gap-0.5 py-1.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-3">
                          <dt className="font-semibold text-vault-900">{isolate(p.k[locale], locale)}</dt>
                          <dd>{isolate(p.v[locale], locale)}</dd>
                        </div>
                      ))}
                    </dl>
                  </Section>
                )}
                <Section n={next()} title={s.stability[locale]}>
                  <Para text={mono.stability} locale={locale} />
                </Section>
                <Section n={next()} title={s.incompatibilities[locale]}>
                  <Para text={mono.incompatibilities} locale={locale} />
                </Section>
                <Section n={next()} title={s.manufacture[locale]}>
                  <Para text={mono.manufacture} locale={locale} />
                </Section>
                <Section n={next()} title={s.safety[locale]}>
                  <Para text={mono.safety} locale={locale} />
                </Section>
                <Section n={next()} title={s.handling[locale]}>
                  <Para text={mono.handling} locale={locale} />
                </Section>
                <Section n={next()} title={s.regulatory[locale]}>
                  <Para text={mono.regulatory} locale={locale} />
                </Section>
                <Section n={next()} title={s.related[locale]}>
                  <Para text={mono.related} locale={locale} />
                </Section>
                <Section n={next()} title={s.comments[locale]}>
                  <Para text={mono.comments} locale={locale} />
                </Section>
              </>
            )}
          </div>

          <footer className="border-t-2 border-molecule-500 bg-paper/80 px-6 py-4 text-[0.72rem] leading-relaxed text-vault-800 sm:px-10">
            <p className="font-bold text-vault-900">{t.sources[locale]}</p>
            <ol className="mt-1 list-decimal space-y-0.5 ps-5" dir="ltr" style={{ textAlign: "left" }}>
              {refs.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
            <p className="mt-3 text-muted">{t.disclaimer[locale]}</p>
            <p className="mt-2 flex items-center justify-between gap-3 font-semibold text-vault-900" dir="ltr">
              <span>PharmaVault · The Pharmaceutical Information Vault · گنجینه اطلاعات داروسازی</span>
              <span className="font-mono text-molecule-700">pharmavault.ir</span>
            </p>
          </footer>
        </SheetPage>
      </div>
    </Container>
  );
}
