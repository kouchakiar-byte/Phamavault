import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BackLink, Container } from "@/components/ui";
import { SheetHeader, SheetPage } from "@/components/excipient-sheet";
import { excipientSheet as t } from "@/content/excipient-sheet";
import { excipients } from "@/data";
import sheets from "@/data/excipient-sheets.json";
import { getLocale } from "@/i18n/locale";
import { excipientSlug } from "@/lib/excipient-slug";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

type HsdbRow = { text: string; ref: { source: string; record: string; id: string; url: string } };
type SheetData = {
  cid: number | null;
  title?: string;
  formula?: string;
  mw?: string;
  iupac?: string;
  unii?: string;
  match?: "cas" | "name" | "none";
  props?: Record<string, HsdbRow[]>;
};
const data = sheets as { generated: string; items: Record<string, SheetData> };

const HANDBOOK =
  "Sheskey PJ, Hancock BC, Moss GP, Goldfarb DJ (eds). Handbook of Pharmaceutical Excipients, 9th ed. London: Pharmaceutical Press; 2020. ISBN 978-0-85711-375-7.";
const IID_URL = "https://www.accessdata.fda.gov/scripts/cder/iig/";

// One sheet is prerendered; the others render on first request and are then cached.
export function generateStaticParams() {
  return [{ slug: excipientSlug(excipients.items[0].name) }];
}

async function load(params: PageProps<"/[lang]/excipients/[slug]">["params"]) {
  const { slug } = await params;
  const item = excipients.items.find((x) => excipientSlug(x.name) === slug);
  if (!item) notFound();
  return { item, sheet: data.items[item.name] ?? { cid: null } };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/excipients/[slug]">): Promise<Metadata> {
  const { item } = await load(params);
  return pageMetadata(
    { en: `${item.name} — ${t.docTitle.en}`, fa: `${item.name} — ${t.docTitle.fa}` },
    t.openNote,
    `excipients/${excipientSlug(item.name)}`,
  );
}

function Sup({ n }: { n: number }) {
  return (
    <sup className="ms-0.5 font-mono text-[0.65rem] font-bold text-molecule-700" dir="ltr">
      [{n}]
    </sup>
  );
}

function Row({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="grid gap-0.5 border-b border-line/70 py-1.5 last:border-0 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-3">
      <dt className="font-semibold text-vault-900">{k}</dt>
      <dd className="min-w-0 leading-relaxed">{children}</dd>
    </div>
  );
}

function H({ children }: { children: ReactNode }) {
  return <h2 className="mb-2 mt-6 border-s-4 border-molecule-500 ps-2 text-base font-bold text-vault-900">{children}</h2>;
}

export default async function ExcipientSheetPage({ params }: PageProps<"/[lang]/excipients/[slug]">) {
  const [locale, { item, sheet }] = await Promise.all([getLocale(), load(params)]);
  const sep = locale === "fa" ? "، " : ", ";
  const fa = /[؀-ۿ]/;
  const synonyms = item.synonyms.split(/,\s*/).filter(Boolean);
  const synEn = synonyms.filter((s) => !fa.test(s));
  const synFa = synonyms.filter((s) => fa.test(s));
  const compound = sheet.cid && sheet.match && sheet.match !== "none" ? sheet : null;
  const accessed = data.generated;

  // Numbered sources, in the order they are cited on the sheet.
  const sources: { key: string; text: string; url?: string }[] = [];
  const cite = (key: string, text: string, url?: string) => {
    let i = sources.findIndex((s) => s.key === key);
    if (i < 0) i = sources.push({ key, text, url }) - 1;
    return i + 1;
  };
  const refHandbook = cite("hpe", HANDBOOK);
  const refPubchem = compound
    ? cite(
        "pubchem",
        `PubChem Compound Summary, CID ${compound.cid} (${compound.title}). National Center for Biotechnology Information, U.S. National Library of Medicine${accessed ? `; ${t.accessed.en} ${accessed}` : ""}.`,
        `https://pubchem.ncbi.nlm.nih.gov/compound/${compound.cid}`,
      )
    : 0;
  const props = compound
    ? Object.entries(compound.props ?? {}).map(([heading, rows]) => ({
        heading,
        rows: rows.map((r) => ({
          text: r.text,
          n: cite(
            `hsdb-${r.ref.id}`,
            `Hazardous Substances Data Bank (HSDB), record ${r.ref.id}${r.ref.record ? ` — ${r.ref.record}` : ""}. U.S. National Library of Medicine, via PubChem${accessed ? `; ${t.accessed.en} ${accessed}` : ""}.`,
            r.ref.url || undefined,
          ),
        })),
      }))
    : [];
  const refIid = cite("iid", "U.S. Food and Drug Administration. Inactive Ingredient Database (IID).", IID_URL);

  return (
    <Container className="py-8 sm:py-12">
      <BackLink href={href(locale, "excipients")}>{t.back[locale]}</BackLink>
      <div className="mt-5">
        <SheetPage locale={locale} printBlocked={t.printBlocked[locale]}>
          <SheetHeader docTitle={`${t.docTitle.en} · ${t.docTitle.fa}`} />
          <div className="px-6 pb-6 pt-5 text-sm sm:px-10">
            <h1 className="text-2xl font-bold tracking-tight text-vault-900 sm:text-3xl" dir="ltr" style={{ textAlign: locale === "fa" ? "right" : "left" }}>
              {item.name}
            </h1>
            {synFa.length > 0 && <p className="mt-1 text-base font-semibold text-molecule-700">{synFa.join("، ")}</p>}

            <H>{t.identification[locale]}</H>
            <dl>
              <Row k={t.cas[locale]}>
                <span className="font-mono" dir="ltr">{item.cas || "—"}</span>
              </Row>
              {synEn.length > 0 && (
                <Row k={t.synonyms[locale]}>
                  <bdi>{synEn.join(", ")}</bdi>
                </Row>
              )}
              {compound ? (
                <>
                  {compound.unii && (
                    <Row k={t.unii[locale]}>
                      <span className="font-mono" dir="ltr">{compound.unii}</span>
                      <Sup n={refPubchem} />
                    </Row>
                  )}
                  <Row k={t.cid[locale]}>
                    <span className="font-mono" dir="ltr">{compound.cid}</span> <bdi className="text-muted">({compound.title})</bdi>
                    <Sup n={refPubchem} />
                  </Row>
                  {compound.formula && (
                    <Row k={t.formula[locale]}>
                      <span className="font-mono" dir="ltr">{compound.formula}</span>
                      <Sup n={refPubchem} />
                    </Row>
                  )}
                  {compound.mw && (
                    <Row k={t.mw[locale]}>
                      <span className="font-mono" dir="ltr">{compound.mw}</span>
                      <Sup n={refPubchem} />
                    </Row>
                  )}
                  {compound.iupac && compound.iupac.length < 160 && (
                    <Row k={t.iupac[locale]}>
                      <bdi className="break-words">{compound.iupac}</bdi>
                      <Sup n={refPubchem} />
                    </Row>
                  )}
                </>
              ) : (
                <Row k={t.formula[locale]}>{t.noCompound[locale]}</Row>
              )}
            </dl>

            <H>{t.use[locale]}</H>
            <dl>
              <Row k={t.functions[locale]}>
                {item.functions.map((f) => excipients.functions[f as keyof typeof excipients.functions]?.[locale] ?? f).join(sep)}
                <Sup n={refHandbook} />
              </Row>
              <Row k={t.levels[locale]}>
                {item.useLevel ? (
                  <>
                    <bdi>{item.useLevel}</bdi>
                    <Sup n={refHandbook} />
                  </>
                ) : (
                  "—"
                )}
              </Row>
              <Row k={t.forms[locale]}>
                {item.forms.map((f) => excipients.forms[f as keyof typeof excipients.forms]?.[locale] ?? f).join(sep)}
                <Sup n={refHandbook} />
              </Row>
            </dl>

            <H>{t.properties[locale]}</H>
            {props.length ? (
              <>
                <p className="mb-1 text-xs text-muted">{t.propertiesNote[locale]}</p>
                <dl>
                  {props.map((p) => (
                    <Row key={p.heading} k={t.headings[p.heading]?.[locale] ?? p.heading}>
                      {p.rows.map((r, i) => (
                        <p key={i} dir="ltr" className="text-start" style={{ textAlign: "left" }}>
                          {r.text}
                          <Sup n={r.n} />
                        </p>
                      ))}
                    </Row>
                  ))}
                </dl>
              </>
            ) : (
              <p className="text-muted">{t.noProperties[locale]}</p>
            )}

            <H>{t.regulatory[locale]}</H>
            <p className="leading-relaxed">
              {t.iid[locale]}
              <Sup n={refIid} />
            </p>
          </div>

          <footer className="border-t-2 border-molecule-500 bg-paper/80 px-6 py-4 text-[0.72rem] leading-relaxed text-vault-800 sm:px-10">
            <p className="font-bold text-vault-900">{t.sources[locale]}</p>
            <ol className="mt-1 space-y-0.5" dir="ltr">
              {sources.map((s, i) => (
                <li key={s.key} className="flex gap-1.5">
                  <span className="font-mono font-bold text-molecule-700">[{i + 1}]</span>
                  <span>
                    {s.text}
                    {s.url && <span className="ms-1 break-all font-mono text-muted">{s.url}</span>}
                  </span>
                </li>
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
