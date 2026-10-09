import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

const page = pages.suppliers;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "suppliers");

export default async function SuppliersPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} plate="SP" eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Container className="py-14">
        <p className="max-w-2xl rounded-card border-2 border-dashed border-molecule-400 bg-molecule-50 p-7 text-molecule-700">
          {page.hold[locale]}
        </p>
      </Container>
    </>
  );
}
