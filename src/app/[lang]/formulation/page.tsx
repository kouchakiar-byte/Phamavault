import { FormulaBuilder } from "@/components/formula-builder";
import { FormulationAdvisor, type ApiEntry } from "@/components/formulation-advisor";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { advisorCatalogue, advisorCopy } from "@/content/formulation-advisor";
import { pages } from "@/content/pages";
import { formulation } from "@/data";
import { monographs } from "@/data/monographs";
import rawMaterials from "@/data/raw-materials.json";
import type { Bi } from "@/i18n/bi";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

const page = pages.formulation;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "formulation");

/** Monograph incompatibility notes of the excipients the advisor offers. */
const incompatibilities: Record<string, Bi> = Object.fromEntries(
  advisorCatalogue.flatMap((c) => (monographs[c.name]?.incompatibilities ? [[c.key, monographs[c.name].incompatibilities]] : [])),
);

/** APIs for the advisor's autocomplete: name, molecular weight and BCS class. */
const apis: ApiEntry[] = (rawMaterials.items as { name: string; mw: string; bcs?: string }[]).map((m) => [m.name, m.mw, m.bcs ?? ""]);

export default async function FormulationPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="formulation" title={page.title} lead={page.lead} />
      <Container className="space-y-12 py-12">
        <FormulationAdvisor locale={locale} incompatibilities={incompatibilities} apis={apis} />
        <div>
          <h2 className="mb-4 text-xl font-bold text-vault-900">{advisorCopy.templates[locale]}</h2>
          <FormulaBuilder locale={locale} data={formulation} />
        </div>
      </Container>
    </>
  );
}
