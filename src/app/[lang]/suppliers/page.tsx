import { Suspense } from "react";
import Link from "next/link";
import { Microscope } from "lucide-react";
import { labBrands, labBrandsCopy } from "@/content/lab-brands";
import { href } from "@/lib/paths";
import { LastUpdate, lastUpdateText } from "@/components/last-update";
import { PageHeader } from "@/components/page-header";
import { SupplierBankFromUrl } from "@/components/supplier-bank-from-url";
import { Container } from "@/components/ui";
import { pages } from "@/content/pages";
import { getLocale } from "@/i18n/locale";
import { getCatalog } from "@/lib/catalog";
import { pageMetadata } from "@/lib/metadata";
import { filtersFrom, querySuppliers } from "@/lib/supplier-api";

const page = pages.suppliers;

export const generateMetadata = () => pageMetadata(page.title, page.lead, "suppliers");

export default async function SuppliersPage() {
  const locale = await getLocale();
  const { updatedAt } = await getCatalog();
  // Only the first page, without contact details; further pages and searches come from /api/suppliers.
  const first = await querySuppliers(filtersFrom(new URLSearchParams()), 1, false);
  return (
    <>
      <PageHeader locale={locale} section="suppliers" title={page.title} lead={page.lead} />
      <Container className="max-w-5xl py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <LastUpdate at={updatedAt} locale={locale} className="text-muted" />
          <Link
            href={href(locale, "lab-brands")}
            className="inline-flex items-center gap-2 rounded-full border border-molecule-400/60 bg-molecule-50 px-4 py-2 text-sm font-semibold text-molecule-700 transition hover:bg-molecule-100"
          >
            <Microscope className="size-4" aria-hidden="true" />
            {labBrandsCopy.linkLabel[locale].replace("{n}", String(labBrands.length))}
          </Link>
        </div>
        <Suspense>
          <SupplierBankFromUrl locale={locale} data={{ first, updated: updatedAt && lastUpdateText(updatedAt, locale) }} />
        </Suspense>
      </Container>
    </>
  );
}
