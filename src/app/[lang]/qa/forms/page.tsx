import { Suspense } from "react";
import { cookies } from "next/headers";
import { FormGenerator } from "@/components/form-generator";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { formsCopy as t } from "@/content/qa-forms";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";
import { sectionsFor } from "@/lib/subscriptions";

export const generateMetadata = () => pageMetadata(t.title, t.lead, "qa/forms");

/** Export is for subscribers to the QA or QC section, like copying the SOP texts. */
async function Generator({ locale }: { locale: Locale }) {
  await cookies(); // request-time check
  const user = await getUser().catch(() => null);
  let allowed = false;
  if (user) {
    const sections = await sectionsFor(user.mobile).catch(() => new Set<string>());
    allowed = sections.has("qa") || sections.has("qc");
  }
  return <FormGenerator locale={locale} allowed={allowed} buyHref={`${href(locale, "account/buy")}?s=qa`} />;
}

export default async function FormsPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="qa" title={t.title} lead={t.lead} back={{ href: href(locale, "qa"), label: t.back }} />
      <Container className="py-12">
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <Generator locale={locale} />
        </Suspense>
      </Container>
    </>
  );
}
