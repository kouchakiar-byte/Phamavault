"use client";

import { useState } from "react";
import { compounding } from "@/content/pharmacy";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/lib/format";

const t = compounding.bud;

/** Midday UTC of a yyyy-mm-dd input, so adding days never crosses a time-zone edge. */
const parse = (s: string) => (/^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T12:00:00Z`) : null);

export function BudCalculator({ locale }: { locale: Locale }) {
  const [type, setType] = useState(compounding.budTypes[0].value);
  const [made, setMade] = useState("");
  const [expiry, setExpiry] = useState("");
  const kind = compounding.budTypes.find((k) => k.value === type) ?? compounding.budTypes[0];
  const start = parse(made);
  const limit = parse(expiry);
  let bud: Date | null = null;
  let limited = false;
  if (start) {
    bud = new Date(start.getTime() + kind.days * 86_400_000);
    if (limit && limit < bud) {
      bud = limit;
      limited = true;
    }
  }
  const show = (d: Date) =>
    locale === "fa" ? `${formatDate(d, "fa", "UTC")} (\u2066${formatDate(d, "en", "UTC")}\u2069)` : formatDate(d, "en", "UTC");

  return (
    <div className="grid gap-6 rounded-card border border-line bg-white p-5 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          {t.type[locale]}
          <select className="field-input" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            {compounding.budTypes.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label[locale]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          {t.date[locale]}
          <input type="date" className="field-input" value={made} onChange={(e) => setMade(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          {t.expiry[locale]}
          <input type="date" className="field-input" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        </label>
      </div>
      <dl className="flex h-fit flex-col gap-3 rounded-xl bg-vault-50 p-5 text-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-2.5 text-muted">
          <dt>{t.days[locale]}</dt>
          <dd className="font-bold text-ink">
            {kind.days.toLocaleString(locale === "fa" ? "fa-IR-u-nu-latn" : "en-US")} {t.daysUnit[locale]}
          </dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-2.5 text-muted">
          <dt>{t.storage[locale]}</dt>
          <dd className="font-bold text-ink">{kind.storage[locale]}</dd>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-2.5 text-muted">
          <dt>{t.result[locale]}</dt>
          <dd className="text-base font-bold text-molecule-700">{bud ? show(bud) : "–"}</dd>
        </div>
        <p className="min-h-5 text-sm text-warn" aria-live="polite">
          {!start ? t.pick[locale] : limited ? t.limited[locale] : ""}
        </p>
      </dl>
    </div>
  );
}
