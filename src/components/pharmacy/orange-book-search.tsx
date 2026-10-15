"use client";

import { useEffect, useState } from "react";
import { orangeBook as t } from "@/content/pharmacy";
import type { Locale } from "@/i18n/config";
import type { ObResult } from "@/lib/orange-book";
import { formatDate } from "@/lib/format";
import { IranMakers } from "./iran-makers";
import { useUrlParam } from "@/lib/use-url-param";

const n = (x: number, locale: Locale) => x.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");

/** `iran` adds the Iranian manufacturers of each ingredient (pharmacy section only). */
export function OrangeBookSearch({ locale, iran = true }: { locale: Locale; iran?: boolean }) {
  // ?ob= (from the site search) fills the box on the references page.
  const urlQuery = useUrlParam("ob");
  const [typed, setQuery] = useState<string | null>(null);
  const query = typed ?? urlQuery;
  const [discn, setDiscn] = useState(false);
  const [result, setResult] = useState<ObResult | null>(null);
  const [loading, setLoading] = useState(false);
  const q = query.trim();

  useEffect(() => {
    if (q.length < 3) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/orange-book?q=${encodeURIComponent(q)}${discn ? "&discn=1" : ""}`, { signal: ctrl.signal })
        .then((r) => r.json() as Promise<ObResult>)
        .then(setResult)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [q, discn]);

  const shown = q.length >= 3 ? result : null;
  const b = t.badges;
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-card border border-line bg-white p-4 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5 text-sm text-muted">
          {t.search[locale]}
          <input
            type="search"
            dir="ltr"
            className="field-input"
            placeholder={t.placeholder[locale]}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm text-ink">
          <input type="checkbox" checked={discn} onChange={(e) => setDiscn(e.target.checked)} />
          {t.discontinued[locale]}
        </label>
      </div>

      <p className="min-h-5 text-sm text-muted" aria-live="polite">
        {q.length < 3
          ? t.minChars[locale]
          : loading
            ? t.loading[locale]
            : shown && !shown.updated
              ? t.noData[locale]
              : shown && shown.groups.length === 0
                ? t.none[locale]
                : shown
                  ? `${t.updated[locale]} ${formatDate(new Date(`${shown.updated}T12:00:00Z`), locale, "UTC")}` +
                    (shown.total > shown.groups.length
                      ? ` · ${t.ingredients[locale].replace("{n}", n(shown.total, locale)).replace("{m}", n(shown.groups.length, locale))}`
                      : "")
                  : ""}
      </p>

      {shown?.groups.map((g) => (
        <section key={g.ingredient} className="rounded-card border border-line bg-white p-4">
          <h3 className="font-mono text-base font-bold text-vault-900" dir="ltr" style={{ textAlign: "start" }}>
            {g.ingredient}
          </h3>
          <div className="mt-3 overflow-x-auto rounded-xl border border-line">
            <table className="db">
              <thead>
                <tr>
                  <th>{t.cols.trade[locale]}</th>
                  <th>{t.cols.strength[locale]}</th>
                  <th>{t.cols.form[locale]}</th>
                  <th>{t.cols.applicant[locale]}</th>
                  <th>{t.cols.appl[locale]}</th>
                  <th>{t.cols.te[locale]}</th>
                  <th>{t.cols.status[locale]}</th>
                </tr>
              </thead>
              <tbody>
                {g.products.map((p, i) => (
                  <tr key={`${p.applNo}-${i}`} className={p.rld ? "bg-capsule-400/10" : undefined}>
                    <td className="font-medium text-vault-900">
                      <bdi>{p.trade}</bdi>
                      {p.rld && <span className="ms-1.5 rounded bg-vault-900 px-1.5 py-0.5 text-[10px] font-bold text-capsule-400">{b.rld[locale]}</span>}
                      {p.rs && <span className="ms-1 rounded bg-molecule-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{b.rs[locale]}</span>}
                    </td>
                    <td className="num">{p.strength}</td>
                    <td className="num">{p.form}</td>
                    <td className="text-xs">
                      <bdi>{p.applicant}</bdi>
                    </td>
                    <td className="text-xs">
                      {(p.applType === "N" ? b.nda : b.anda)[locale]} <bdi className="font-mono">{p.applNo}</bdi>
                    </td>
                    <td className="num font-semibold">{p.te}</td>
                    <td className="text-xs">{(p.type === "R" ? b.rx : p.type === "O" ? b.otc : b.discn)[locale]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {g.more > 0 && <p className="mt-2 text-xs text-muted">{t.more[locale].replace("{n}", n(g.more, locale))}</p>}

          {iran && <h4 className="mt-4 text-sm font-bold text-vault-900">{t.iranTitle[locale]}</h4>}
          {iran && <IranMakers locale={locale} ingredient={g.ingredient} />}
        </section>
      ))}
    </div>
  );
}
