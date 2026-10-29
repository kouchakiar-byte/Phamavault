import Link from "next/link";
import { ArrowLeft, ArrowRight, Scale } from "lucide-react";
import { CtdTree } from "@/components/ctd-tree";
import { TableWrap } from "@/components/filters";
import { IchTable } from "@/components/ich-table";
import { PageHeader } from "@/components/page-header";
import { BiTitle, Container } from "@/components/ui";
import { be } from "@/content/bioequivalence";
import { pages } from "@/content/pages";
import { regulatory } from "@/data";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

const page = pages.regulatory;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "regulatory");

function SubTitle({ text, locale }: { text: Bi; locale: Locale }) {
  return (
    <BiTitle
      as="h2"
      text={text}
      locale={locale}
      className="mb-5 mt-14 text-2xl font-bold text-vault-900 first:mt-0"
    />
  );
}

export default async function RegulatoryPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="regulatory" title={page.title} lead={page.lead} />
      <Container className="py-12">
        <Link
          href={href(locale, "regulatory/bioequivalence")}
          className="group mb-12 flex items-center gap-5 rounded-card border border-molecule-400/60 bg-gradient-to-l from-molecule-50 to-white p-5 transition hover:border-molecule-500 hover:shadow-md sm:p-6"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-vault-900 text-capsule-400">
            <Scale className="size-6" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold text-vault-900">{be.title[locale]}</span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">{be.lead[locale]}</span>
          </span>
          {locale === "fa" ? (
            <ArrowLeft className="size-5 shrink-0 text-molecule-600 transition group-hover:-translate-x-1" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-5 shrink-0 text-molecule-600 transition group-hover:translate-x-1" aria-hidden="true" />
          )}
        </Link>

        <SubTitle text={page.ctd} locale={locale} />
        <CtdTree modules={regulatory.ctd} locale={locale} />

        <SubTitle text={page.ich} locale={locale} />
        <IchTable locale={locale} rows={regulatory.ich} />

        <SubTitle text={page.stability} locale={locale} />
        <TableWrap>
          <table className="db">
            <thead>
              <tr>
                <th>{page.study[locale]}</th>
                <th>{page.storage[locale]}</th>
                <th>{page.minData[locale]}</th>
              </tr>
            </thead>
            <tbody>
              {page.stabilityRows.map((r) => (
                <tr key={r.study.en}>
                  <td className="font-medium">{r.study[locale]}</td>
                  <td className="num">{r.condition}</td>
                  <td>{r.data[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      </Container>
    </>
  );
}
