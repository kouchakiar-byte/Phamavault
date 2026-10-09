import { FormulaBuilder } from "@/components/formula-builder";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { formulation } from "@/data";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

const page = pages.formulation;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "formulation");

export default async function FormulationPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} plate="FT" eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Container className="py-12">
        <FormulaBuilder locale={locale} data={formulation} />
      </Container>
    </>
  );
}
