import { PageHeader } from "@/components/page-header";
import { SupplementInteractions } from "@/components/pharmacy/supplement-interactions";
import { Container } from "@/components/ui";
import { pharmacyPage } from "@/content/pharmacy";
import { supplementsCopy as t } from "@/content/pharmacy-tools";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(t.title, t.lead, "pharmacy/supplements");

export default async function SupplementsPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="pharmacy" title={t.title} lead={t.lead} back={{ href: href(locale, "pharmacy"), label: pharmacyPage.title }} />
      <Container className="space-y-6 py-12">
        <p className="rounded-xl border border-capsule-400/40 bg-capsule-400/10 px-4 py-3 text-sm leading-relaxed text-ink">{t.note[locale]}</p>
        <SupplementInteractions locale={locale} />
      </Container>
    </>
  );
}
