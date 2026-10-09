import { MaterialTable } from "@/components/material-table";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { rawMaterials } from "@/data";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

const page = pages.materials;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "materials");

export default async function MaterialsPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} plate="RM" eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Container className="py-12">
        <MaterialTable locale={locale} data={rawMaterials} />
      </Container>
    </>
  );
}
