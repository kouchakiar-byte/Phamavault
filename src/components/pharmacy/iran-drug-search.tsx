"use client";

import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { iranDrugs as t } from "@/content/pharmacy";
import type { Locale } from "@/i18n/config";
import type { IranDrugResult } from "@/lib/iran-drugs";

const n = (x: number, locale: Locale) => x.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");
const registerUrl = (q: string) => `https://irc.fda.gov.ir/nfi/Search?Term=${encodeURIComponent(q)}&PageNumber=1&PageSize=10`;

/** Live search of the Iran FDA register: each generic with its licensed products, cheapest first. */
export function IranDrugSearch({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<IranDrugResult | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "locked">("idle");
  const q = query.trim();

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (q.length < 3) return;
    setState("loading");
    try {
      const res = await fetch(`/api/iran-drugs?q=${encodeURIComponent(q)}`);
      if (res.status === 403) return setState("locked");
      setResult((await res.json()) as IranDrugResult);
    } catch {
      setResult({ term: q, status: "unavailable", generics: [], total: 0, fetchedAt: "", source: registerUrl(q) });
    }
    setState("idle");
  };

  const message =
    result && result.status !== "ok"
      ? { empty: t.none, unavailable: t.unavailable, unreadable: t.unreadable }[result.status][locale].replace("{q}", result.term)
      : null;

  return (
    <div className="space-y-4">
      <form onSubmit={search} className="flex flex-col gap-2 rounded-card border border-line bg-white p-4 sm:flex-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder[locale]}
          aria-label={t.title[locale]}
          dir="auto"
          className="field-input min-w-0 flex-1 text-base"
        />
        <button
          type="submit"
          disabled={q.length < 3 || state === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-molecule-600 px-6 py-2.5 font-semibold text-white hover:bg-molecule-700 disabled:opacity-60"
        >
          <Search className="size-4" aria-hidden="true" />
          {t.search[locale]}
        </button>
      </form>
      <p className="text-xs text-muted">{t.hint[locale]}</p>

      <div aria-live="polite" className="space-y-5">
        {state === "loading" && <p className="text-sm text-muted">{t.loading[locale]}</p>}
        {state === "locked" && <p className="rounded-xl bg-capsule-400/10 px-4 py-3 text-sm text-vault-900">{t.locked[locale]}</p>}
        {state === "idle" && message && <p className="rounded-xl bg-vault-50 px-4 py-3 text-sm text-ink">{message}</p>}

        {state === "idle" &&
          result?.generics.map((g) => (
            <section key={g.genericCode + g.titleEn} className="overflow-hidden rounded-card border border-line bg-white">
              <header className="border-b border-line bg-vault-50 px-4 py-3">
                <h3 className="font-bold text-vault-900">{g.titleFa || g.titleEn}</h3>
                {g.titleEn && g.titleFa && (
                  <p className="mt-0.5 text-xs text-muted" dir="ltr" style={{ textAlign: "start" }}>
                    {g.titleEn}
                  </p>
                )}
                <p className="mt-1 flex flex-wrap gap-x-3 text-xs font-semibold text-molecule-700">
                  {g.genericCode && <span>{t.generic[locale].replace("{code}", n(Number(g.genericCode), locale))}</span>}
                  <span>{t.products[locale].replace("{n}", n(g.products.length, locale))}</span>
                </p>
              </header>
              <div className="overflow-x-auto">
                <table className="db">
                  <thead>
                    <tr>
                      <th>{t.cols.brand[locale]}</th>
                      <th>{t.cols.licence[locale]}</th>
                      <th>{t.cols.pack[locale]}</th>
                      <th>{t.cols.price[locale]}</th>
                      <th>{t.cols.code[locale]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.products.map((p) => (
                      <tr key={p.productCode || p.brandOwner + p.pack}>
                        <td className="font-semibold text-vault-900">{p.brandOwner}</td>
                        <td>{p.licenseHolder !== p.brandOwner ? p.licenseHolder : "—"}</td>
                        <td dir="ltr" className="text-xs" style={{ textAlign: "start" }}>
                          {p.pack}
                        </td>
                        <td className="whitespace-nowrap">
                          {p.priceRial !== null ? (
                            <>
                              {n(p.priceRial, locale)} {t.rial[locale]}
                              <span className="block text-xs text-muted">
                                {n(Math.round(p.priceRial / 10), locale)} {t.toman[locale]}
                              </span>
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="font-mono text-xs" dir="ltr">
                          {p.productCode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

        {result && state === "idle" && (
          <a
            href={result.source || registerUrl(result.term)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-molecule-700 hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            {t.openRegister[locale]}
          </a>
        )}
      </div>
      <p className="text-xs leading-relaxed text-muted">{t.source[locale]}</p>
    </div>
  );
}
