import { PageHeader } from "@/components/page-header";
import { LeafletView } from "@/components/pharmacy/leaflet";
import { RefList } from "@/components/pharmacy/refs";
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
      <Container className="space-y-12 py-12">
        {leaflets.map((l) => (
          <section key={l.key} id={l.key} className="scroll-mt-24 space-y-4">
            <LeafletView leaflet={l} locale={locale} />
            <div className="no-print">
              <RefList refs={l.refs} locale={locale} />
            </div>
          </section>
        ))}
      </Container>
    </div>
  );
}
