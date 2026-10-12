import { Calculators } from "@/components/calculators";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import Link from "next/link";
import { calculations, referencesAccess, referencesReviewed } from "@/content/calculations";
import { referenceLabels } from "@/content/references";
import { href } from "@/lib/paths";
import { pages } from "@/content/pages";
import { bi } from "@/i18n/bi";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

const page = pages.tools;
const lead = bi(
  page.lead.en.replace("{n}", String(calculations.length)),
  page.lead.fa.replace("{n}", calculations.length.toLocaleString("fa-IR")),
);

export const generateMetadata = () => pageMetadata(page.title, lead, "tools");

export default async function ToolsPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="tools" title={page.title} lead={lead} />
      <Container className="py-12">
        <p className="mb-6 rounded-xl border border-line bg-vault-50 px-4 py-3 text-sm text-muted">{referencesReviewed[locale]} {referencesAccess[locale]}{" "}
          <Link href={href(locale, "references")} className="font-semibold text-molecule-700 hover:underline">
            {referenceLabels.seeAll[locale]}
          </Link>
        </p>
        <Calculators locale={locale} />
      </Container>
    </>
  );
}
