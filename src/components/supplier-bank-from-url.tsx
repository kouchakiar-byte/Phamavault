"use client";

import { useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { filtersFromParams, SupplierBank, type SupplierData } from "./supplier-bank";

/**
 * The supplier bank with filters taken from the URL (?q=, ?cat=, ?type=).
 */
export function SupplierBankFromUrl({ locale, data }: { locale: Locale; data: SupplierData }) {
  const params = useSearchParams();
  // Remount when the URL changes so a new search from the home page applies.
  return <SupplierBank key={params.toString()} locale={locale} data={data} initial={filtersFromParams(params)} />;
}
