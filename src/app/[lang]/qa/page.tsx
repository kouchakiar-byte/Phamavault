import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { TableWrap } from "@/components/filters";
import { PageHeader } from "@/components/page-header";
import { Bullets, Cards, DataTable, JumpNav, Steps, SubTitle } from "@/components/quality-blocks";
import { SopTable, type SopRow } from "@/components/sop-table";
import { BiTitle, Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { qaKnowledge as k } from "@/content/quality";
import { qaMore as q } from "@/content/quality-more";
import { formsCopy } from "@/content/qa-forms";
import { sops } from "@/data";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

const page = pages.qa;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "qa");

// Only the list goes to the browser; full texts live on their own pages.
const rows: SopRow[] = sops.items.map(({ code, dep, title, covers, text }) => ({
  code,
  dep,
  title,
  covers,
  hasText: text !== null,
}));
const withText = sops.items.filter((s) => s.text !== null).length;

export default async function QaPage() {
  const locale = await getLocale();
  const jump = [
    { id: "pqs", label: k.pqsTitle },
    { id: "qrm", label: k.qrmTitle },
    { id: "gmp", label: q.gmpTitle },
    { id: "deviations", label: q.devTitle },
    { id: "rca", label: q.rcaTitle },
    { id: "change", label: q.changeTitle },
    { id: "validation", label: q.pvTitle },
    { id: "cleaning", label: q.cleanTitle },
    { id: "release", label: q.releaseTitle },
    { id: "pqr", label: q.pqrTitle },
    { id: "suppliers", label: q.supplierTitle },
    { id: "recall", label: q.recallTitle },
    { id: "inspections", label: q.inspTitle },
    { id: "metrics", label: q.metricsTitle },
    { id: "ccs", label: q.ccsTitle },
    { id: "gdp", label: q.gdpTitle },
    { id: "refs", label: k.refsTitle },
    { id: "library", label: page.library },
  ];
  return (
    <>
      <PageHeader locale={locale} section="qa" title={page.title} lead={page.lead} />
      <Container className="py-12">
        <JumpNav items={jump} locale={locale} label={page.title[locale]} />
        <Link
          href={href(locale, "qa/forms")}
          className="group mb-12 flex items-center gap-5 rounded-card border border-molecule-400/60 bg-gradient-to-l from-molecule-50 to-white p-5 transition hover:border-molecule-500 hover:shadow-md sm:p-6"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-vault-900 text-capsule-400">
            <FileText className="size-6" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold text-vault-900">{formsCopy.title[locale]}</span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">{formsCopy.card[locale]}</span>
          </span>
          {locale === "fa" ? (
            <ArrowLeft className="size-5 shrink-0 text-molecule-600 transition group-hover:-translate-x-1" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-5 shrink-0 text-molecule-600 transition group-hover:translate-x-1" aria-hidden="true" />
          )}
        </Link>

        <SubTitle id="pqs" text={k.pqsTitle} locale={locale} lead={k.pqsLead} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {k.pqs.map((el) => (
            <div
              key={el.title.en}
              className={`rounded-card border p-5 ${el.enabler ? "border-dashed border-molecule-400 bg-molecule-50/60" : "border-line bg-white"}`}
            >
              {el.enabler && (
                <span className="mb-2 inline-block rounded-full bg-molecule-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {k.enabler[locale]}
                </span>
              )}
              <p className="font-bold text-vault-900">{el.title[locale]}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{el.text[locale]}</p>
            </div>
          ))}
        </div>

        <SubTitle id="qrm" text={k.qrmTitle} locale={locale} lead={k.qrmLead} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                <th>{k.tool[locale]}</th>
                <th>{k.use[locale]}</th>
                <th>{k.method[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {k.qrmTools.map((t) => (
                <tr key={t.name}>
                  <td className="font-bold text-vault-900">{locale === "fa" && t.nameFa ? t.nameFa : t.name}</td>
                  <td>{t.use[locale]}</td>
                  <td className="min-w-72 leading-relaxed">{t.method[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>

        <SubTitle id="gmp" text={q.gmpTitle} locale={locale} lead={q.gmpLead} />
        <DataTable cols={q.gmpCols} rows={q.gmp} locale={locale} />

        <SubTitle id="deviations" text={q.devTitle} locale={locale} lead={q.devLead} />
        <Cards items={q.devClasses} locale={locale} />
        <div className="mt-4">
          <Steps items={q.devSteps} locale={locale} />
        </div>

        <SubTitle id="rca" text={q.rcaTitle} locale={locale} />
        <Cards items={q.rca} locale={locale} />
        <p className="mb-3 mt-6 font-bold text-vault-900">{q.capaTitle[locale]}</p>
        <Bullets items={q.capa} locale={locale} />

        <SubTitle id="change" text={q.changeTitle} locale={locale} lead={q.changeLead} />
        <DataTable cols={q.changeCols} rows={q.change} locale={locale} />
        <p className="mt-3 text-sm text-muted">{q.changeNote[locale]}</p>

        <SubTitle id="validation" text={q.pvTitle} locale={locale} />
        <Cards items={q.pv} locale={locale} />
        <div className="mt-4">
          <Bullets items={q.pvNotes} locale={locale} />
        </div>
        <p className="mb-3 mt-6 font-bold text-vault-900">{q.qualTitle[locale]}</p>
        <Cards items={q.qual} locale={locale} />

        <SubTitle id="cleaning" text={q.cleanTitle} locale={locale} lead={q.cleanLead} />
        <Cards items={q.clean} locale={locale} />
        <div className="mt-4">
          <Bullets items={q.cleanNotes} locale={locale} />
        </div>

        <SubTitle id="release" text={q.releaseTitle} locale={locale} />
        <Bullets items={q.release} locale={locale} />

        <SubTitle id="pqr" text={q.pqrTitle} locale={locale} lead={q.pqrLead} />
        <Bullets items={q.pqr} locale={locale} numbered />

        <SubTitle id="suppliers" text={q.supplierTitle} locale={locale} />
        <Steps items={q.supplier} locale={locale} />

        <SubTitle id="recall" text={q.recallTitle} locale={locale} />
        <DataTable cols={q.recallCols} rows={q.recall} locale={locale} />
        <p className="mt-3 text-sm text-muted">{q.recallNote[locale]}</p>

        <SubTitle id="inspections" text={q.inspTitle} locale={locale} />
        <Cards items={q.insp} locale={locale} />
        <p className="mt-3 text-sm text-muted">{q.inspNote[locale]}</p>

        <SubTitle id="metrics" text={q.metricsTitle} locale={locale} lead={q.metricsLead} />
        <Cards items={q.metrics} locale={locale} />

        <SubTitle id="ccs" text={q.ccsTitle} locale={locale} />
        <Bullets items={q.ccs} locale={locale} />

        <SubTitle id="gdp" text={q.gdpTitle} locale={locale} />
        <Bullets items={q.gdp} locale={locale} />

        <SubTitle id="refs" text={k.refsTitle} locale={locale} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                <th>{k.refCode[locale]}</th>
                <th>{k.refSubject[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {k.refs.map((r) => (
                <tr key={r.code}>
                  <td className="num">{r.code}</td>
                  <td>{r.subject[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>

        <SubTitle id="library" text={page.library} locale={locale} lead={page.libraryLead} />
        <p className="mb-6 rounded-card border-2 border-dashed border-molecule-400 bg-molecule-50 px-5 py-3.5 text-sm text-molecule-700">
          {page.ready[locale].replace("{n}", withText.toLocaleString(locale === "fa" ? "fa-IR-u-nu-latn" : "en-US"))}
        </p>
        <SopTable locale={locale} rows={rows} departments={sops.departments} />
        <p className="mt-4 text-sm text-muted">{page.codesNote[locale]}</p>

        <BiTitle as="h2" text={page.template} locale={locale} className="mt-14 text-2xl font-bold text-vault-900" />
        <p className="mt-3 max-w-3xl text-muted">{page.templateHead[locale]}</p>
        <ol className="mt-5 grid max-w-2xl list-decimal gap-x-10 gap-y-2 ps-6 marker:font-semibold marker:text-molecule-600 sm:grid-cols-2">
          {page.templateItems.map((item) => (
            <li key={item.en}>{item[locale]}</li>
          ))}
        </ol>
      </Container>
    </>
  );
}
