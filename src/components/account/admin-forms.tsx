"use client";

import { useActionState, useState } from "react";
import { grant, resetPassword, type AdminState } from "@/app/[lang]/admin/actions";
import { account } from "@/content/account";
import { sections } from "@/content/sections";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { isPaidSection, monthOptions } from "@/lib/pricing";

const { admin: t, auth, buy } = account;

function Result({ state, locale }: { state: AdminState; locale: Locale }) {
  if (state.error) return <p className="text-sm text-red-700">{account.errors[state.error][locale]}</p>;
  if (state.ok) return <p className="text-sm text-molecule-700">{t.done[locale]}</p>;
  return null;
}

const label = "block text-xs font-medium text-muted";

export function GrantForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(grant, {});
  const [plan, setPlan] = useState("individual");
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label className={label} htmlFor="g-mobile">{auth.mobile[locale]}</label>
        <input id="g-mobile" name="mobile" dir="ltr" required className="field-input mt-1" placeholder="09xxxxxxxxx" />
      </div>
      <div>
        <label className={label} htmlFor="g-plan">{t.plan[locale]}</label>
        <select id="g-plan" name="plan" className="field-input mt-1" value={plan} onChange={(e) => setPlan(e.target.value)}>
          <option value="individual">{copy.plans.items[0].name[locale]}</option>
          <option value="team">{copy.plans.items[1].name[locale]}</option>
        </select>
      </div>
      <div>
        <label className={label} htmlFor="g-months">{buy.months[locale]}</label>
        <select id="g-months" name="months" className="field-input mt-1" defaultValue={1}>
          {monthOptions.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      {plan === "team" ? (
        <div>
          <label className={label} htmlFor="g-seats">{t.seats[locale]}</label>
          <input id="g-seats" name="seats" type="number" min={6} defaultValue={6} dir="ltr" className="field-input mt-1" />
        </div>
      ) : (
        <fieldset className="sm:col-span-2 lg:col-span-3">
          <legend className={label}>{buy.sections[locale]}</legend>
          <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2">
            {sections
              .filter((s) => isPaidSection(s.slug))
              .map((s) => (
                <label key={s.slug} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="sections" value={s.slug} defaultChecked className="accent-molecule-600" />
                  {s.title[locale]}
                </label>
              ))}
          </div>
        </fieldset>
      )}
      <div>
        <label className={label} htmlFor="g-amount">{t.amount[locale]}</label>
        <input id="g-amount" name="amount" type="number" min={0} defaultValue={0} dir="ltr" className="field-input mt-1" />
      </div>
      <div>
        <label className={label} htmlFor="g-note">{t.note[locale]}</label>
        <input id="g-note" name="note" className="field-input mt-1" maxLength={300} />
      </div>
      <div className="flex items-end gap-3">
        <button type="submit" disabled={pending} className="rounded-full bg-molecule-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-molecule-700 disabled:opacity-60">
          {t.activate[locale]}
        </button>
        <Result state={state} locale={locale} />
      </div>
    </form>
  );
}

export function ResetPasswordForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(resetPassword, {});
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-3">
      <div>
        <label className={label} htmlFor="r-mobile">{auth.mobile[locale]}</label>
        <input id="r-mobile" name="mobile" dir="ltr" required className="field-input mt-1" placeholder="09xxxxxxxxx" />
      </div>
      <div>
        <label className={label} htmlFor="r-password">{t.newPassword[locale]}</label>
        <input id="r-password" name="password" dir="ltr" required minLength={8} className="field-input mt-1" autoComplete="off" />
      </div>
      <div className="flex items-end gap-3">
        <button type="submit" disabled={pending} className="rounded-full bg-vault-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-vault-800 disabled:opacity-60">
          {t.save[locale]}
        </button>
        <Result state={state} locale={locale} />
      </div>
    </form>
  );
}
