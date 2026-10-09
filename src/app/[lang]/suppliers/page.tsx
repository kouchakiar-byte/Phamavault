import { PageHeader } from "@/components/page-header";
import { SupplierBank } from "@/components/supplier-bank";
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
      <Container className="max-w-5xl py-10">
        <SupplierBank locale={locale} />
      </Container>
    </>
  );
}
