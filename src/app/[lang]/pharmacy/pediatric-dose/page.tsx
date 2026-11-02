import { PageHeader } from "@/components/page-header";
import { PediatricDose } from "@/components/pharmacy/pediatric-dose";
import { RefList } from "@/components/pharmacy/refs";
import { Container } from "@/components/ui";
import { pharmacyPage } from "@/content/pharmacy";
import { pedDoseCopy as t, pedDrugs } from "@/content/pharmacy-tools";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(t.title, t.lead, "pharmacy/pediatric-dose");

export default async function PediatricDosePage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="pharmacy" title={t.title} lead={t.lead} back={{ href: href(locale, "pharmacy"), label: pharmacyPage.title }} />
      <Container className="space-y-6 py-12">
        <PediatricDose locale={locale} />
        <RefList refs={pedDrugs.flatMap((d) => d.refs)} locale={locale} />
      </Container>
    </>
  );
}
