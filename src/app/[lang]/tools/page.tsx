import { Calculators } from "@/components/calculators";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { calculations } from "@/content/calculations";
import { pages } from "@/content/pages";
import { bi } from "@/i18n/bi";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

const page = pages.tools;
const lead = bi(
  page.lead.en.replace("{n}", String(calculations.length)),
  page.lead.fa.replace("{n}", calculations.length.toLocaleString("fa-IR")),
);

export const generateMetadata = () => pageMetadata(page.title, lead, "tools");

export default async function ToolsPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="tools" title={page.title} lead={lead} />
      <Container className="py-12">
        <Calculators locale={locale} />
      </Container>
    </>
  );
}
