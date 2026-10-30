import Link from "next/link";
import { ArrowLeft, ArrowRight, FlaskConical } from "lucide-react";
import { FormulaBuilder } from "@/components/formula-builder";
import { FormulationAdvisor, type ApiEntry } from "@/components/formulation-advisor";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { compat } from "@/content/compatibility";
import { advisorCatalogue, advisorCopy } from "@/content/formulation-advisor";
import { pages } from "@/content/pages";
import { formulation } from "@/data";
import { monographs } from "@/data/monographs";
import rawMaterials from "@/data/raw-materials.json";
import type { Bi } from "@/i18n/bi";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

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
        <Link
          href={href(locale, "formulation/compatibility")}
          className="group flex items-center gap-5 rounded-card border border-molecule-400/60 bg-gradient-to-l from-molecule-50 to-white p-5 transition hover:border-molecule-500 hover:shadow-md sm:p-6"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-vault-900 text-capsule-400">
            <FlaskConical className="size-6" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold text-vault-900">{compat.title[locale]}</span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">{compat.lead[locale]}</span>
          </span>
          {locale === "fa" ? (
            <ArrowLeft className="size-5 shrink-0 text-molecule-600 transition group-hover:-translate-x-1" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-5 shrink-0 text-molecule-600 transition group-hover:translate-x-1" aria-hidden="true" />
          )}
        </Link>
        <div>
          <h2 className="mb-4 text-xl font-bold text-vault-900">{advisorCopy.templates[locale]}</h2>
          <FormulaBuilder locale={locale} data={formulation} />
        </div>
      </Container>
    </>
  );
}
