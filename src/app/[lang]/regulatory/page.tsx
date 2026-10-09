import { Accordion } from "@/components/accordion";
import { TableWrap } from "@/components/filters";
import { IchTable } from "@/components/ich-table";
import { PageHeader } from "@/components/page-header";
import { BiTitle, Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { regulatory } from "@/data";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

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
      <PageHeader locale={locale} plate="RG" eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Container className="py-12">
        <SubTitle text={page.ctd} locale={locale} />
        <Accordion items={regulatory.ctd} locale={locale} />

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
