import { FormulaBuilder } from "@/components/formula-builder";
import { FormulationAdvisor } from "@/components/formulation-advisor";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { advisorCatalogue, advisorCopy } from "@/content/formulation-advisor";
import { pages } from "@/content/pages";
import { formulation } from "@/data";
import { monographs } from "@/data/monographs";
import type { Bi } from "@/i18n/bi";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

const page = pages.formulation;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "formulation");

/** Monograph incompatibility notes of the excipients the advisor offers. */
const incompatibilities: Record<string, Bi> = Object.fromEntries(
  advisorCatalogue.flatMap((c) => (monographs[c.name]?.incompatibilities ? [[c.key, monographs[c.name].incompatibilities]] : [])),
);

export default async function FormulationPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader locale={locale} section="formulation" title={page.title} lead={page.lead} />
      <Container className="space-y-12 py-12">
        <FormulationAdvisor locale={locale} incompatibilities={incompatibilities} />
        <div>
          <h2 className="mb-4 text-xl font-bold text-vault-900">{advisorCopy.templates[locale]}</h2>
          <FormulaBuilder locale={locale} data={formulation} />
        </div>
      </Container>
    </>
  );
}
