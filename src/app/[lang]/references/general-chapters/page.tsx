import { GeneralChaptersTable } from "@/components/general-chapters-table";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { generalChaptersPage as page } from "@/content/general-chapters";
import { generalChapters, generalChapterSheets } from "@/data";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(page.title, page.lead, "references/general-chapters");

export default async function GeneralChaptersPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader
        locale={locale}
        section="references"
        title={page.title}
        lead={page.lead}
        back={{ href: href(locale, "references"), label: page.back }}
      />
      <Container className="py-12">
        <p className="mb-6 rounded-xl border border-line bg-vault-50 px-4 py-3 text-sm leading-relaxed text-muted">{page.note[locale]}</p>
        <GeneralChaptersTable locale={locale} data={generalChapters} detailed={Object.keys(generalChapterSheets)} />
      </Container>
    </>
  );
}
