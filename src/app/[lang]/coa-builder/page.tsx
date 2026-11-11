import { Suspense } from "react";
import { cookies } from "next/headers";
import { CoaBuilder, type CoaMaterial } from "@/components/coa-builder";
import { SimpleHeader } from "@/components/simple-header";
import { Container } from "@/components/ui";
import { coaBuilderCopy as t } from "@/content/coa-builder";
import { excipients, rawMaterials } from "@/data";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";
import { sectionsFor } from "@/lib/subscriptions";

export const generateMetadata = () => pageMetadata(t.title, t.lead, "coa-builder");

/** APIs, vitamins and minerals from the raw-material database, then the excipients. */
const materials: CoaMaterial[] = [
  ...rawMaterials.items.map((m) => ({ n: m.name, c: m.cas || undefined, f: m.formula || undefined, w: m.mw || undefined, g: m.group })),
  ...excipients.items.map((x) => ({ n: x.name, c: x.cas || undefined, g: "exc" })),
];

/** Printing and Word export are for subscribers to the QC or QA section, like the GMP forms. */
async function Builder({ locale }: { locale: Locale }) {
  await cookies(); // request-time check
  const user = await getUser().catch(() => null);
  let allowed = false;
  if (user) {
    const sections = await sectionsFor(user.mobile).catch(() => new Set<string>());
    allowed = sections.has("qc") || sections.has("qa");
  }
  return <CoaBuilder locale={locale} materials={materials} allowed={allowed} signedIn={Boolean(user)} buyHref={`${href(locale, "account/buy")}?s=qc`} />;
}

export default async function CoaBuilderPage() {
  const locale = await getLocale();
  return (
    <>
      <SimpleHeader locale={locale} title={t.title} lead={t.lead} back={{ href: href(locale, "coa-review"), label: t.back }} />
      <Container className="py-12">
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <Builder locale={locale} />
        </Suspense>
      </Container>
    </>
  );
}
