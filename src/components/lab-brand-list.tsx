"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { LabBrand } from "@/content/lab-brands";
import type { Locale } from "@/i18n/config";

type Labels = { filter: string; companies: string; open: string; empty: string };

/** The brand cards with a quick filter by brand or company name. */
export function LabBrandList({ brands, locale, labels, searchHref }: { brands: LabBrand[]; locale: Locale; labels: Labels; searchHref: string }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = needle
    ? brands.filter((b) => b.name.toLowerCase().includes(needle) || b.companies.some((c) => c.fa.includes(q.trim()) || c.en.toLowerCase().includes(needle)))
    : brands;
  return (
    <div className="space-y-6">
      <label className="relative block max-w-md">
        <span className="sr-only">{labels.filter}</span>
        <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={labels.filter} className="field-input ps-10" />
      </label>
      {shown.length === 0 ? (
        <p className="text-muted">{labels.empty}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((b) => (
            <li key={b.name}>
              <Link
                href={`${searchHref}?q=${encodeURIComponent(b.name)}`}
                className="group flex h-full flex-col rounded-card border border-line bg-white p-4 transition hover:border-molecule-500 hover:shadow-md"
              >
                <span dir="ltr" className="text-start text-lg font-extrabold tracking-tight text-vault-900 group-hover:text-molecule-700 rtl:text-end">
                  {b.name}
                </span>
                <span className="mt-2 text-xs font-semibold text-muted">{labels.companies}</span>
                <span className="mt-1 text-sm leading-6 text-ink">{b.companies.map((c) => (locale === "fa" ? c.fa : c.en)).join("، ")}</span>
                <span className="mt-auto pt-3 text-xs font-bold text-molecule-700">{labels.open} ←</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
