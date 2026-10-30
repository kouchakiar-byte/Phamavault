import { CompatibilityChecker } from "@/components/compatibility-checker";
import { PageHeader } from "@/components/page-header";
import { Bullets, SubTitle } from "@/components/quality-blocks";
import { Container } from "@/components/ui";
import { compat } from "@/content/compatibility";
import rawMaterials from "@/data/raw-materials.json";
import type { Bi } from "@/i18n/bi";
import { getLocale } from "@/i18n/locale";
import { isolateLatin } from "@/lib/bidi";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(compat.title, compat.lead, "formulation/compatibility");

const apis = (rawMaterials.items as { name: string }[]).map((m) => m.name);
const iso = (b: Bi): Bi => ({ en: b.en, fa: isolateLatin(b.fa) });

export default async function CompatibilityPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader
        locale={locale}
        section="formulation"
        title={compat.title}
        lead={iso(compat.lead)}
        back={{ href: href(locale, "formulation"), label: compat.back }}
      />
      <Container className="py-12">
        <CompatibilityChecker locale={locale} apis={apis} />

        <SubTitle id="study" text={compat.studyTitle} locale={locale} />
        <Bullets items={compat.study.map(iso)} locale={locale} numbered />

        <SubTitle id="refs" text={compat.refsTitle} locale={locale} />
        <ul className="list-disc space-y-1.5 ps-6 text-sm leading-relaxed text-muted" dir="ltr" style={{ textAlign: "left" }}>
          {compat.references.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </Container>
    </>
  );
}
