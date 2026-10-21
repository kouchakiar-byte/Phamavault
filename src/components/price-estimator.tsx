"use client";

import { useState } from "react";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";

const { pricing: p, estimator: t, currency, perMonth } = copy.plans;

const digits = (n: number, locale: Locale) => Math.round(n).toLocaleString(locale === "fa" ? "fa-IR-u-nu-latn" : "en-US");
const money = (n: number, locale: Locale) => `${digits(n, locale)} ${currency[locale]}`;

/** Full price struck through with the discount, shown above a discounted total. */
function Was({ price, list, locale }: { price: number; list: number; locale: Locale }) {
  if (list <= price) return null;
  return (
    <p className="mt-1 flex flex-wrap items-center gap-2">
      <span className="text-lg text-muted line-through decoration-red-500/80 decoration-2">{money(list, locale)}</span>
      <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
        {t.off[locale].replace("{n}", digits(((list - price) / list) * 100, locale))}
      </span>
    </p>
  );
}

/** Monthly cost estimate for both plans, from the published prices. */
export function PriceEstimator({ locale }: { locale: Locale }) {
  const [users, setUsers] = useState(String(p.teamUsers));
  const fmt = (n: number) => money(n, locale);

  const n = Math.max(p.teamUsers, Math.floor(Number(users)) || p.teamUsers);
  const team = p.team + (n - p.teamUsers) * p.extraUser;
  const teamList = p.teamList + (n - p.teamUsers) * p.extraUser;
  return (
    <div className="mt-10 rounded-card border border-line bg-paper p-6 sm:p-8">
      <p className="text-lg font-bold text-vault-900">{t.title[locale]}</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-line bg-white p-5">
          <p className="font-bold text-vault-900">{t.individual[locale]}</p>
          <p className="mt-4 text-sm text-muted">{t.includes[locale]}</p>
          <p className="mt-4 text-sm text-muted">{t.total[locale]}</p>
          <Was price={p.full} list={p.fullList} locale={locale} />
          <p className="text-2xl font-bold text-vault-900">
            {fmt(p.full)} <span className="text-sm font-normal text-muted">{perMonth[locale]}</span>
          </p>
        </div>

        <div className="rounded-xl border border-molecule-400 bg-white p-5">
          <p className="font-bold text-vault-900">{t.team[locale]}</p>
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
          <Was price={team} list={teamList} locale={locale} />
          <p className="text-2xl font-bold text-vault-900">
            {fmt(team)} <span className="text-sm font-normal text-muted">{perMonth[locale]}</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            {fmt(team / n)} {t.perUser[locale]}
          </p>
        </div>

        <div className="rounded-xl border border-line bg-white p-5">
          <p className="font-bold text-vault-900">{t.pharmacy[locale]}</p>
          <p className="mt-4 text-sm text-muted">{t.pharmacyIncludes[locale]}</p>
          <p className="mt-4 text-sm text-muted">{t.total[locale]}</p>
          <Was price={p.pharmacy} list={p.pharmacyList} locale={locale} />
          <p className="text-2xl font-bold text-vault-900">
            {fmt(p.pharmacy)} <span className="text-sm font-normal text-muted">{perMonth[locale]}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
