"use client";

import { useActionState, useState } from "react";
import { addUser, deleteUser, grant, resetPassword, traceCopy, type AdminState } from "@/app/[lang]/admin/actions";
import { account } from "@/content/account";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { monthOptions } from "@/lib/pricing";

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
          <option value="pharmacy">{copy.plans.items[2].name[locale]}</option>
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
      {plan === "team" && (
        <div>
          <label className={label} htmlFor="g-seats">{t.seats[locale]}</label>
          <input id="g-seats" name="seats" type="number" min={6} defaultValue={6} dir="ltr" className="field-input mt-1" />
        </div>
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

export function TraceForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(traceCopy, {});
  const tr = t.trace;
  return (
    <form action={action} className="space-y-3">
      <label className={label} htmlFor="tr-text">
        {tr.label[locale]}
      </label>
      <textarea id="tr-text" name="text" required rows={5} className="field-input" />
      <button type="submit" disabled={pending} className="rounded-full bg-vault-900 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
        {tr.button[locale]}
      </button>
      {state.user && (
        <p className="text-sm text-vault-900">
          {tr.found[locale]}: <b>{state.user.name}</b> ·{" "}
          <span className="font-mono" dir="ltr">
            {state.user.mobile}
          </span>
        </p>
      )}
      {state.none && <p className="text-sm text-muted">{tr.none[locale]}</p>}
    </form>
  );
}

export function AddUserForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(addUser, {});
  const [kind, setKind] = useState<"individual" | "company" | "pharmacy">("individual");
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <label className={label} htmlFor="a-kind">{auth.kind[locale]}</label>
        <select id="a-kind" name="kind" value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="field-input mt-1">
          {(["individual", "company", "pharmacy"] as const).map((k) => (
            <option key={k} value={k}>{auth.kinds[k][locale]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={label} htmlFor="a-name">{auth.name[locale]}</label>
        <input id="a-name" name="name" required maxLength={120} className="field-input mt-1" />
      </div>
      <div>
        <label className={label} htmlFor="a-org">{auth.org[kind][locale]}</label>
        <input id="a-org" name="org" required={kind !== "individual"} maxLength={160} className="field-input mt-1" />
      </div>
      <div>
        <label className={label} htmlFor="a-mobile">{auth.mobile[locale]}</label>
        <input id="a-mobile" name="mobile" dir="ltr" required className="field-input mt-1" placeholder="09xxxxxxxxx" />
      </div>
      <div>
        <label className={label} htmlFor="a-email">{auth.email[locale]}</label>
        <input id="a-email" name="email" type="email" dir="ltr" maxLength={160} className="field-input mt-1" />
      </div>
      <div>
        <label className={label} htmlFor="a-password">{auth.password[locale]}</label>
        <input id="a-password" name="password" dir="ltr" required minLength={8} className="field-input mt-1" autoComplete="off" />
      </div>
      <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-3">
        <button type="submit" disabled={pending} className="rounded-full bg-vault-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-vault-800 disabled:opacity-60">
          {t.usersList.add[locale]}
        </button>
        <Result state={state} locale={locale} />
      </div>
    </form>
  );
}

export function DeleteUserButton({ id, locale }: { id: string; locale: Locale }) {
  const [state, action, pending] = useActionState(deleteUser, {});
  const [confirm, setConfirm] = useState(false);
  if (state.error) return <p className="max-w-48 text-xs text-red-700">{account.errors[state.error][locale]}</p>;
  if (!confirm)
    return (
      <button type="button" onClick={() => setConfirm(true)} className="rounded-md px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">
        {t.usersList.remove[locale]}
      </button>
    );
  return (
    <form action={action} className="flex items-center gap-1">
      <input type="hidden" name="id" value={id} />
      <button type="submit" disabled={pending} className="rounded-md bg-red-700 px-2.5 py-1 text-xs font-semibold text-white">
        {t.usersList.confirmRemove[locale]}
      </button>
      <button type="button" onClick={() => setConfirm(false)} className="rounded-md px-2 py-1 text-xs text-muted">
        {t.usersList.cancel[locale]}
      </button>
    </form>
  );
}
