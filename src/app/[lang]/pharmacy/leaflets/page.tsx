import { PageHeader } from "@/components/page-header";
import { LeafletBoard } from "@/components/pharmacy/leaflet";
import { Container } from "@/components/ui";
import { pharmacyPage } from "@/content/pharmacy";
import { leaflets, leafletsCopy as t } from "@/content/pharmacy-tools";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(t.title, t.lead, "pharmacy/leaflets");

export default async function LeafletsPage() {
  const locale = await getLocale();
  return (
    <div className="print-shell">
      <div className="no-print">
        <PageHeader locale={locale} section="pharmacy" title={t.title} lead={t.lead} back={{ href: href(locale, "pharmacy"), label: pharmacyPage.title }} />
      </div>
      <Container className="py-12">
        <LeafletBoard leaflets={leaflets} locale={locale} refsLabel={pharmacyPage.refsLabel[locale]} />
      </Container>
    </div>
  );
}
