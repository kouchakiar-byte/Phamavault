"use client";

import { useState } from "react";
import { supplementRules, supplementsCopy as t } from "@/content/pharmacy-tools";
import type { Locale } from "@/i18n/config";

const tone = {
  major: "bg-red-100 text-red-800",
  moderate: "bg-capsule-400/20 text-capsule-700",
  minor: "bg-molecule-50 text-molecule-700",
} as const;

const norm = (s: string) => s.toLowerCase().replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[‌\s]+/g, " ").trim();

export function SupplementInteractions({ locale }: { locale: Locale }) {
  const [q, setQ] = useState("");
  const query = norm(q);
  const rows = supplementRules.filter(
    (r) => !query || [r.supplement.fa, r.supplement.en, r.drugs.fa, r.drugs.en].some((s) => norm(s).includes(query)),
  );
  return (
    <div className="space-y-4">
      <label className="block text-xs font-medium text-muted">
        {t.search[locale]}
        <input className="field-input mt-1" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.placeholder[locale]} />
      </label>
      {rows.length === 0 && <p className="text-muted">{t.none[locale]}</p>}
      <div className="grid gap-3 lg:grid-cols-2">
        {rows.map((r) => (
          <article key={r.id} className="rounded-card border border-line bg-white p-4 text-sm leading-7">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-vault-900">{r.supplement[locale]}</h3>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone[r.severity]}`}>{t.severity[r.severity][locale]}</span>
            </div>
            <p className="text-ink">
              <span className="font-semibold text-muted">{t.with[locale]}: </span>
              {r.drugs[locale]}
            </p>
            <p>
              <span className="font-semibold text-muted">{t.effect[locale]}: </span>
              {r.effect[locale]}
            </p>
            <p>
              <span className="font-semibold text-muted">{t.action[locale]}: </span>
              {r.action[locale]}
            </p>
            <p className="mt-1 flex flex-wrap gap-2 text-xs">
              {r.refs.map((ref) => (
                <a key={ref.label} href={ref.url} target="_blank" rel="noopener noreferrer" dir="ltr" className="text-molecule-700 hover:underline">
                  {ref.label} ↗
                </a>
              ))}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
