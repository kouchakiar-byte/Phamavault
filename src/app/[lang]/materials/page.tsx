import Link from "next/link";
import { ArrowLeft, ArrowRight, Scale } from "lucide-react";
import { LastUpdate } from "@/components/last-update";
import { MaterialTable } from "@/components/material-table";
import { PageHeader } from "@/components/page-header";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { saltForms } from "@/content/salt-forms";
import { getLocale } from "@/i18n/locale";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";
import { saltLinks } from "@/lib/salt-match";

const page = pages.materials;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "materials");

export default async function MaterialsPage() {
  const locale = await getLocale();
  const { materials, materialGroups, updatedAt } = await getCatalog();
  return (
    <>
      <PageHeader locale={locale} section="materials" title={page.title} lead={page.lead} />
      <Container className="py-12">
        <Link
          href={href(locale, "materials/salt-forms")}
          className="group mb-8 flex items-center gap-5 rounded-card border border-molecule-400/60 bg-gradient-to-l from-molecule-50 to-white p-5 transition hover:border-molecule-500 hover:shadow-md sm:p-6"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-vault-900 text-capsule-400">
            <Scale className="size-6" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-lg font-bold text-vault-900">{saltForms.title[locale]}</span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">{saltForms.lead[locale]}</span>
          </span>
          {locale === "fa" ? (
            <ArrowLeft className="size-5 shrink-0 text-molecule-600 transition group-hover:-translate-x-1" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-5 shrink-0 text-molecule-600 transition group-hover:translate-x-1" aria-hidden="true" />
          )}
        </Link>
        <LastUpdate at={updatedAt} locale={locale} className="mb-6 text-muted" />
        <MaterialTable locale={locale} data={{ groups: materialGroups, items: materials }} salts={saltLinks(materials)} />
      </Container>
    </>
  );
}
