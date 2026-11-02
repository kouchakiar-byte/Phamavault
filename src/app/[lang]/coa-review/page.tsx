import { CoaReview } from "@/components/coa-review";
import { SimpleHeader } from "@/components/simple-header";
import { Container } from "@/components/ui";
import { coaCopy as t } from "@/content/coa-review";
import { copy } from "@/content/site";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(t.title, t.lead, "coa-review");

export default async function CoaReviewPage() {
  const locale = await getLocale();
  return (
    <>
      <div className="no-print">
        <SimpleHeader locale={locale} title={t.title} lead={t.lead} back={{ href: href(locale), label: copy.nav.home }} />
      </div>
      <Container className="py-12">
        <CoaReview locale={locale} />
      </Container>
    </>
  );
}
