import { ExcipientTable } from "@/components/excipient-table";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { excipients } from "@/data";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

const page = pages.excipients;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "excipients");

export default async function ExcipientsPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="excipients" title={page.title} lead={page.lead} />
      <Container className="py-12">
        <ExcipientTable locale={locale} data={excipients} />
        <p className="mt-4 text-sm text-muted">{page.note[locale]}</p>
      </Container>
    </>
  );
}
