"use client";

import { useState } from "react";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";

const { pricing: p, estimator: t, currency, perMonth } = copy.plans;

/** Monthly cost estimate for both plans, from the published prices. */
export function PriceEstimator({ locale }: { locale: Locale }) {
  const [sections, setSections] = useState(p.sections);
  const [users, setUsers] = useState(String(p.teamUsers));
  const fmt = (n: number) => `${Math.round(n).toLocaleString(locale === "fa" ? "fa-IR" : "en-US")} ${currency[locale]}`;

  const individual = sections >= p.sections ? p.full : sections * p.section;
  const fullCheaper = sections < p.sections && sections * p.section > p.full;
  const n = Math.max(p.teamUsers, Math.floor(Number(users)) || p.teamUsers);
  const team = p.team + (n - p.teamUsers) * p.extraUser;

  return (
    <div className="mt-10 rounded-card border border-line bg-paper p-6 sm:p-8">
      <p className="text-lg font-bold text-vault-900">{t.title[locale]}</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-white p-5">
          <p className="font-semibold text-vault-900">{t.individual[locale]}</p>
          <label htmlFor="est-sections" className="mt-4 block text-sm text-muted">
            {t.sections[locale]}
          </label>
          <select
            id="est-sections"
            className="field-input mt-1.5"
            value={sections}
            onChange={(e) => setSections(Number(e.target.value))}
          >
            {Array.from({ length: p.sections }, (_, i) => i + 1).map((k) => (
              <option key={k} value={k}>
                {k === p.sections ? t.all[locale] : k.toLocaleString(locale === "fa" ? "fa-IR" : "en-US")}
              </option>
            ))}
          </select>
          <p className="mt-4 text-sm text-muted">{t.total[locale]}</p>
          <p className="text-2xl font-bold text-vault-900">
            {fmt(individual)} <span className="text-sm font-normal text-muted">{perMonth[locale]}</span>
          </p>
          {fullCheaper && <p className="mt-2 text-sm font-medium text-molecule-700">{t.fullCheaper[locale]}</p>}
        </div>

        <div className="rounded-xl border border-molecule-400 bg-white p-5">
          <p className="font-semibold text-vault-900">{t.team[locale]}</p>
          <label htmlFor="est-users" className="mt-4 block text-sm text-muted">
            {t.users[locale]}
          </label>
          <input
            id="est-users"
            type="number"
            min={p.teamUsers}
            step={1}
            className="field-input mt-1.5"
            value={users}
            onChange={(e) => setUsers(e.target.value)}
          />
          <p className="mt-4 text-sm text-muted">{t.total[locale]}</p>
          <p className="text-2xl font-bold text-vault-900">
            {fmt(team)} <span className="text-sm font-normal text-muted">{perMonth[locale]}</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            {fmt(team / n)} {t.perUser[locale]}
          </p>
        </div>
      </div>
    </div>
  );
}
