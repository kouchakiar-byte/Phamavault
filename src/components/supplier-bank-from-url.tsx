"use client";

import { useSearchParams } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { filtersFromParams, SupplierBank } from "./supplier-bank";

/**
 * The supplier bank with filters taken from the URL. Rendered inside
 * <Suspense> so the unfiltered bank is still prerendered as the fallback.
 */
export function SupplierBankFromUrl({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  // Remount when the URL changes so a new search from the home page applies.
  return <SupplierBank key={params.toString()} locale={locale} initial={filtersFromParams(params)} />;
}
