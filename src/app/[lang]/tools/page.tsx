import { Calculators } from "@/components/calculators";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

const page = pages.tools;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "tools");

export default async function ToolsPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} plate="CA" eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Container className="py-12">
        <Calculators locale={locale} />
      </Container>
    </>
  );
}
