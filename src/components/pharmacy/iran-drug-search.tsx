"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { iranDrugs as t } from "@/content/pharmacy";
import type { Locale } from "@/i18n/config";
import type { IranDrugResult, IranGeneric } from "@/lib/iran-drugs";
import { moieties, moietyKey, moietyLabel } from "@/lib/moieties";

const n = (x: number, locale: Locale) => x.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");

/** Live search of the Iran FDA register: each generic with its licensed products, cheapest first. */
export function IranDrugSearch({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<IranDrugResult | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "locked">("idle");
  const [picked, setPicked] = useState<string | null>(null);
  const q = query.trim();

  // The medicines found, by exact set of active ingredients: metformin alone, metformin + linagliptin, …
  const options = useMemo(() => {
    const byKey = new Map<string, { key: string; generics: IranGeneric[]; products: number }>();
    for (const g of result?.generics ?? []) {
      const key = moietyKey(moieties(g.titleEn || g.titleFa));
      const o = byKey.get(key) ?? { key, generics: [], products: 0 };
      o.generics.push(g);
      o.products += g.products.length;
      byKey.set(key, o);
    }
    const asked = result ? moietyKey(moieties(result.term)) : "";
    // The medicine typed comes first (metformin before its combinations), then the most products.
    return [...byKey.values()].sort((a, b) => Number(b.key === asked) - Number(a.key === asked) || b.products - a.products);
  }, [result]);
  const chosen = options.find((o) => o.key === picked) ?? options[0];

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (q.length < 3) return;
    setState("loading");
    try {
      const res = await fetch(`/api/iran-drugs?q=${encodeURIComponent(q)}`);
      if (res.status === 403) return setState("locked");
      setResult((await res.json()) as IranDrugResult);
      setPicked(null);
    } catch {
      setResult({ term: q, status: "unavailable", generics: [], total: 0, fetchedAt: "", source: "" });
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

        {state === "idle" && options.length > 1 && (
          <div className="rounded-card border border-line bg-white p-4">
            <p className="text-sm font-semibold text-vault-900">{t.which[locale]}</p>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={t.which[locale]}>
              {options.map((o) => {
                const on = o.key === chosen?.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPicked(o.key)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                      on ? "border-molecule-500 bg-molecule-600 font-semibold text-white" : "border-line bg-white text-vault-800 hover:border-molecule-400"
                    }`}
                  >
                    <bdi>{moietyLabel(o.key)}</bdi>
                    <span className={`ms-1.5 text-xs ${on ? "text-white/80" : "text-muted"}`}>
                      ({t.optionCount[locale].replace("{n}", n(o.products, locale)).replace("{d}", n(o.generics.length, locale))})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {state === "idle" &&
          chosen?.generics.map((g) => (
            <section key={g.genericCode + g.titleEn} className="overflow-hidden rounded-card border border-line bg-white">
              <header className="border-b border-line bg-vault-50 px-4 py-3">
                <h3 className="font-bold text-vault-900">{g.titleFa || g.titleEn}</h3>
                {g.titleEn && g.titleFa && (
                  <p className="mt-0.5 text-xs text-muted" dir="ltr" style={{ textAlign: "start" }}>
                    {g.titleEn}
                  </p>
                )}
                <p className="mt-1 flex flex-wrap gap-x-3 text-xs font-semibold text-molecule-700">
                  {g.genericCode && <span>{t.generic[locale].replace("{code}", g.genericCode)}</span>}
                  <span>{t.products[locale].replace("{n}", n(g.products.length, locale))}</span>
                </p>
              </header>
              {/* One row per product: works on a phone without sideways scrolling */}
              <ul className="divide-y divide-line">
                {g.products.map((p) => (
                  <li
                    key={p.productCode || p.brandOwner + p.pack}
                    className="grid gap-x-4 gap-y-1 px-4 py-3 text-sm sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto]"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-vault-900">{p.brandOwner}</p>
                      {p.licenseHolder && p.licenseHolder !== p.brandOwner && (
                        <p className="text-xs text-muted">
                          {t.cols.licence[locale]}: {p.licenseHolder}
                        </p>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs text-muted sm:hidden">{t.cols.brandName[locale]}: </span>
                      {p.brandFa || p.brandEn ? (
                        <span className="font-medium text-molecule-700">
                          {locale === "fa" ? p.brandFa || p.brandEn : p.brandEn || p.brandFa}
                          {locale === "fa" && p.brandFa && p.brandEn && (
                            <span className="ms-1.5 text-xs font-normal text-muted">
                              <bdi>{p.brandEn}</bdi>
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-muted">{t.genericOnly[locale]}</span>
                      )}
                    </div>
                    <div className="min-w-0 text-xs">
                      <p className="break-words text-ink" dir="ltr" style={{ textAlign: "start" }}>
                        {p.pack}
                      </p>
                      <p className="mt-1 text-muted">
                        {t.cols.code[locale]}: <span className="font-mono text-vault-800">{p.productCode || "—"}</span>
                      </p>
                      {p.genericCode && (
                        <p className="text-muted">
                          {t.cols.genericCode[locale]}: <span className="font-mono text-vault-800">{p.genericCode}</span>
                        </p>
                      )}
                    </div>
                    <p className="whitespace-nowrap font-semibold text-vault-900 sm:text-end">
                      {p.priceRial !== null ? (
                        <>
                          {n(Math.round(p.priceRial / 10), locale)} {t.toman[locale]}
                          <span className="block text-xs font-normal text-muted">
                            {n(p.priceRial, locale)} {t.rial[locale]}
                          </span>
                        </>
                      ) : (
                        "—"
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}

      </div>
      {result?.status === "ok" && result.fetchedAt && state === "idle" && (
        <p className="text-xs text-muted">
          {t.updated[locale].replace(
            "{date}",
            new Date(result.fetchedAt).toLocaleString(locale === "fa" ? "fa-IR" : "en-GB", {
              timeZone: "Asia/Tehran",
              dateStyle: "medium",
              timeStyle: "short",
            }),
          )}
        </p>
      )}
      <p className="text-xs leading-relaxed text-muted">{t.source[locale]}</p>
    </div>
  );
}
