import { LabBrandList } from "@/components/lab-brand-list";
import { QuoteRequest } from "@/components/quote-request";
import { SimpleHeader } from "@/components/simple-header";
import { Container } from "@/components/ui";
import { labBrands, labBrandsCopy as t, labSupplierCount } from "@/content/lab-brands";
import { getSection } from "@/content/sections";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(t.title, t.lead, "lab-brands");

export default async function LabBrandsPage() {
  const locale = await getLocale();
  const suppliers = getSection("suppliers");
  return (
    <>
      <SimpleHeader
        locale={locale}
        title={t.title}
        lead={t.lead}
        eyebrow={t.eyebrow}
        back={{ href: href(locale, suppliers.href), label: suppliers.title }}
      >
        <p className="mt-5 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-capsule-400">
          {t.count[locale].replace("{b}", String(labBrands.length)).replace("{c}", String(labSupplierCount))}
        </p>
      </SimpleHeader>
      <Container className="space-y-10 py-12">
        <LabBrandList
          brands={labBrands}
          locale={locale}
          searchHref={href(locale, suppliers.href)}
          labels={{ filter: t.filter[locale], companies: t.companies[locale], open: t.open[locale], empty: t.empty[locale] }}
        />
        <p className="rounded-xl border border-capsule-400/40 bg-capsule-400/10 px-4 py-3 text-sm leading-relaxed text-ink">{t.note[locale]}</p>
        <section className="rounded-card border border-line bg-paper p-6 sm:p-8">
          <h2 className="text-xl font-bold text-vault-900">{t.askTitle[locale]}</h2>
          <p className="mt-2 mb-5 text-muted">{t.askText[locale]}</p>
          <QuoteRequest locale={locale} />
        </section>
      </Container>
    </>
  );
}
