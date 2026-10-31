import { Suspense } from "react";
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
        <LastUpdate at={updatedAt} locale={locale} className="mb-5 text-muted" />
        <Suspense>
          <SupplierBankFromUrl locale={locale} data={{ first, updated: updatedAt && lastUpdateText(updatedAt, locale) }} />
        </Suspense>
      </Container>
    </>
  );
}
