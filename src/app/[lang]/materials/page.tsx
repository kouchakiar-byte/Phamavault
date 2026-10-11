import { LastUpdate } from "@/components/last-update";
import { MaterialTable } from "@/components/material-table";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { getLocale } from "@/i18n/locale";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";

const page = pages.materials;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "materials");

export default async function MaterialsPage() {
  const locale = await getLocale();
  const { materials, materialGroups, updatedAt } = await getCatalog();
  return (
    <>
      <PageHeader locale={locale} section="materials" title={page.title} lead={page.lead} />
      <Container className="py-12">
        <LastUpdate at={updatedAt} locale={locale} className="mb-6 text-muted" />
        <MaterialTable locale={locale} data={{ groups: materialGroups, items: materials }} />
      </Container>
    </>
  );
}
