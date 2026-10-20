import { PageHeader } from "@/components/page-header";
import { InteractionChecker, ReferenceCheckers, SeverityScale } from "@/components/pharmacy/interaction-checker";
import { Container } from "@/components/ui";
import { interactionsCopy as t, pharmacyPage } from "@/content/pharmacy";
import { getLocale } from "@/i18n/locale";
import { interactionsReviewed } from "@/data/interactions";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";
import { withReviewedMonth } from "@/lib/data-dates";

export const generateMetadata = () => pageMetadata(t.title, t.lead, "pharmacy/interactions");

export default async function InteractionsPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader
        locale={locale}
        section="pharmacy"
        title={t.title}
        lead={t.lead}
        back={{ href: href(locale, "pharmacy"), label: pharmacyPage.title }}
      />
      <Container className="space-y-10 py-12">
        <InteractionChecker locale={locale} />
        <ReferenceCheckers locale={locale} />
        <SeverityScale locale={locale} />
        <div className="space-y-3 border-t border-line pt-8 text-sm leading-relaxed text-muted">
          <p className="rounded-xl border border-capsule-400/40 bg-capsule-400/10 px-4 py-3 text-ink">
            {t.disclaimer[locale]} {withReviewedMonth(interactionsReviewed[locale], "interactions", locale)}.
          </p>
          <p className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-vault-900">{pharmacyPage.refsLabel[locale]}:</span>
            {t.refs.map((r) =>
              r.url ? (
                <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer" dir="ltr" className="rounded-lg border border-line bg-white px-2 py-0.5 text-molecule-700 hover:border-molecule-500">
                  {r.label} ↗
                </a>
              ) : (
                <bdi key={r.label} dir="ltr" className="rounded-lg border border-line bg-white px-2 py-0.5">
                  {r.label}
                </bdi>
              ),
            )}
          </p>
        </div>
      </Container>
    </>
  );
}
