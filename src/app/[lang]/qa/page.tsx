import { TableWrap } from "@/components/filters";
import { PageHeader } from "@/components/page-header";
import { SopTable, type SopRow } from "@/components/sop-table";
import { BiTitle, Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { qaKnowledge as k } from "@/content/quality";
import { sops } from "@/data";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

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

function SubTitle({ id, text, locale, lead }: { id?: string; text: Bi; locale: Locale; lead?: Bi }) {
  return (
    <div id={id} className="mb-5 mt-14 scroll-mt-24 first:mt-0">
      <BiTitle as="h2" text={text} locale={locale} className="text-2xl font-bold text-vault-900" />
      {lead && <p className="mt-2 max-w-3xl text-sm text-muted">{lead[locale]}</p>}
    </div>
  );
}

export default async function QaPage() {
  const locale = await getLocale();
  const jump = [
    { id: "pqs", label: k.pqsTitle },
    { id: "qrm", label: k.qrmTitle },
    { id: "refs", label: k.refsTitle },
    { id: "library", label: page.library },
  ];
  return (
    <>
      <PageHeader locale={locale} section="qa" title={page.title} lead={page.lead} />
      <Container className="py-12">
        <nav className="mb-10 flex flex-wrap gap-2" aria-label={page.title[locale]}>
          {jump.map((j) => (
            <a
              key={j.id}
              href={`#${j.id}`}
              className="rounded-full border border-line bg-white px-4 py-1.5 text-sm text-vault-900 hover:border-molecule-400 hover:text-molecule-700"
            >
              {j.label[locale]}
            </a>
          ))}
        </nav>

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
                  <td className="font-semibold text-vault-900">{locale === "fa" && t.nameFa ? t.nameFa : t.name}</td>
                  <td>{t.use[locale]}</td>
                  <td className="min-w-72 leading-relaxed">{t.method[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>

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
          {page.ready[locale].replace("{n}", withText.toLocaleString(locale === "fa" ? "fa-IR" : "en-US"))}
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
