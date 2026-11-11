import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Droplets, Scale } from "lucide-react";
import { LastUpdate } from "@/components/last-update";
import { MaterialTable } from "@/components/material-table";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { saltForms } from "@/content/salt-forms";
import { solubilityCopy } from "@/content/solubility";
import solubility from "@/data/solubility.json";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";
import { saltLinks } from "@/lib/salt-match";

const page = pages.materials;
const soluble = Object.keys(solubility.items);

export const generateMetadata = () => pageMetadata(page.title, page.lead, "materials");

export default async function MaterialsPage() {
  const locale = await getLocale();
  const { materials, materialGroups, updatedAt } = await getCatalog();
  return (
    <>
      <PageHeader locale={locale} section="materials" title={page.title} lead={page.lead} />
      <Container className="py-12">
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <ToolCard locale={locale} path="materials/salt-forms" icon={<Scale className="size-6" aria-hidden="true" />} title={saltForms.title[locale]} lead={saltForms.lead[locale]} />
          <ToolCard locale={locale} path="materials/solubility" icon={<Droplets className="size-6" aria-hidden="true" />} title={solubilityCopy.title[locale]} lead={solubilityCopy.lead[locale]} />
        </div>
        <LastUpdate at={updatedAt} locale={locale} className="mb-6 text-muted" />
        <MaterialTable locale={locale} data={{ groups: materialGroups, items: materials }} salts={saltLinks(materials)} soluble={soluble} />
      </Container>
    </>
  );
}

function ToolCard({ locale, path, icon, title, lead }: { locale: Locale; path: string; icon: ReactNode; title: string; lead: string }) {
  return (
    <Link
      href={href(locale, path)}
      className="group flex items-center gap-5 rounded-card border border-molecule-400/60 bg-gradient-to-l from-molecule-50 to-white p-5 transition hover:border-molecule-500 hover:shadow-md sm:p-6"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-vault-900 text-capsule-400">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-bold text-vault-900">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-muted">{lead}</span>
      </span>
      {locale === "fa" ? (
        <ArrowLeft className="size-5 shrink-0 text-molecule-600 transition group-hover:-translate-x-1" aria-hidden="true" />
      ) : (
        <ArrowRight className="size-5 shrink-0 text-molecule-600 transition group-hover:translate-x-1" aria-hidden="true" />
      )}
    </Link>
  );
}
