import { HandbookLibrary } from "@/components/handbook-library";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { handbooks } from "@/data";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

const page = pages.handbooks;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "handbooks");

export default async function HandbooksPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="handbooks" title={page.title} lead={page.lead} />
      <Container className="py-14">
        <HandbookLibrary handbooks={handbooks} locale={locale} />
      </Container>
    </>
  );
}
