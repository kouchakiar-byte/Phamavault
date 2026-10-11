"use client";

import { useActionState, useState, type ReactNode } from "react";
import { addTeamMember, buy, login, register, type FormState } from "@/app/[lang]/account/actions";
import { account } from "@/content/account";
import { sections } from "@/content/sections";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/lib/format";
import { listPrice, monthlyPrice, monthOptions, paidSections, type PaidSection, type PlanId } from "@/lib/pricing";

const { auth, errors, buy: t } = account;
const p = copy.plans.pricing;


/** Adds the page to return to (?next=…) at submit time, so it is never stale. */
const withNext = (action: (form: FormData) => void) => (form: FormData) => {
  form.set("next", new URLSearchParams(window.location.search).get("next") ?? "");
  action(form);
};

function Field({
  label,
  hint,
  ...input
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement> & { name: string }) {
  return (
    <div>
      <label htmlFor={`f-${input.name}`} className="block text-sm font-medium text-vault-900">
        {label}
      </label>
      <input id={`f-${input.name}`} className="field-input mt-1.5" {...input} />
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function Message({ state, locale, ok }: { state: FormState; locale: Locale; ok?: string }) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        {errors[state.error][locale]}
      </p>
    );
  }
  if (state.ok && ok) return <p className="rounded-lg bg-molecule-50 px-4 py-3 text-sm text-molecule-700">{ok}</p>;
  return null;
}

function Submit({ pending, children }: { pending: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-vault-900 px-6 py-3 font-semibold text-white transition hover:bg-vault-800 disabled:opacity-60"
    >
      {pending ? "…" : children}
    </button>
  );
}

export function LoginForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={withNext(action)} className="space-y-5">
      <input type="hidden" name="lang" value={locale} />
      <Field label={auth.mobile[locale]} hint={auth.mobileHint[locale]} name="mobile" inputMode="tel" autoComplete="tel" dir="ltr" required />
      <Field label={auth.password[locale]} name="password" type="password" autoComplete="current-password" dir="ltr" required />
      <Message state={state} locale={locale} />
      <Submit pending={pending}>{auth.login[locale]}</Submit>
    </form>
  );
}

export function RegisterForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(register, {});
  return (
    <form action={withNext(action)} className="space-y-5">
      <input type="hidden" name="lang" value={locale} />
      <Field label={auth.name[locale]} name="name" autoComplete="name" required maxLength={120} />
      <Field label={auth.mobile[locale]} hint={auth.mobileHint[locale]} name="mobile" inputMode="tel" autoComplete="tel" dir="ltr" required />
      <Field
        label={auth.password[locale]}
        hint={auth.passwordHint[locale]}
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        dir="ltr"
        required
      />
      <Field label={auth.passwordRepeat[locale]} name="passwordRepeat" type="password" autoComplete="new-password" dir="ltr" required />
      <Message state={state} locale={locale} />
      <Submit pending={pending}>{auth.register[locale]}</Submit>
    </form>
  );
}

const pill = (active: boolean) =>
  `cursor-pointer rounded-xl border px-4 py-3 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-molecule-400 ${
    active ? "border-molecule-500 bg-molecule-50 font-semibold text-vault-900" : "border-line bg-white text-vault-800 hover:border-molecule-400"
  }`;

type Renewal = { id: string; plan: PlanId; sections: PaidSection[]; seats: number; label: string };

export function BuyForm({
  locale,
  initialPlan,
  initialSections,
  renewal,
  online,
}: {
  locale: Locale;
  initialPlan: PlanId;
  initialSections: PaidSection[];
  renewal: Renewal | null;
  online: boolean;
}) {
  const [state, action, pending] = useActionState(buy, {});
  const [plan, setPlan] = useState<PlanId>(renewal?.plan ?? initialPlan);
  const [chosen, setChosen] = useState<PaidSection[]>(renewal?.sections ?? initialSections);
  const [seats, setSeats] = useState(String(renewal?.seats ?? p.teamUsers));
  const [months, setMonths] = useState<number>(1);
  const [method, setMethod] = useState<"online" | "invoice">(online ? "online" : "invoice");

  const seatCount = Math.max(p.teamUsers, Math.floor(Number(seats)) || p.teamUsers);
  const monthly = renewal
    ? monthlyPrice(renewal)
    : monthlyPrice({ plan, sections: plan === "team" ? [...paidSections] : chosen, seats: seatCount });
  const list = renewal
    ? listPrice(renewal)
    : listPrice({ plan, sections: plan === "team" ? [...paidSections] : chosen, seats: seatCount });
  const off = list > monthly ? Math.round(((list - monthly) / list) * 100) : 0;
  const valid = renewal !== null || plan === "team" || chosen.length > 0;
  const all = chosen.length === paidSections.length;
  const toggle = (s: PaidSection) => setChosen((c) => (c.includes(s) ? c.filter((x) => x !== s) : [...c, s]));
  const planName = (id: PlanId) => copy.plans.items.find((i) => i.id === (id === "team" ? "enterprise" : "individual"))!.name[locale];

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="lang" value={locale} />
      {renewal && <input type="hidden" name="renew" value={renewal.id} />}

      {renewal ? (
        <div className="rounded-xl border border-line bg-white p-5">
          <p className="font-semibold text-vault-900">{t.renewing[locale].replace("{id}", renewal.id)}</p>
          <p className="mt-1 text-sm text-muted">{renewal.label}</p>
        </div>
      ) : (
        <>
          <fieldset>
            <legend className="text-sm font-semibold text-vault-900">{t.plan[locale]}</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(["individual", "team"] as const).map((id) => (
                <label key={id} className={pill(plan === id)}>
                  <input type="radio" name="plan" value={id} checked={plan === id} onChange={() => setPlan(id)} className="sr-only" />
                  {planName(id)}
                </label>
              ))}
            </div>
          </fieldset>

          {plan === "individual" ? (
            <fieldset>
              <legend className="text-sm font-semibold text-vault-900">{t.sections[locale]}</legend>
              <label className={`${pill(all)} mt-3 flex items-center gap-3`}>
                <input
                  type="checkbox"
                  checked={all}
                  onChange={() => setChosen(all ? [] : [...paidSections])}
                  className="size-4 accent-molecule-600"
                />
                {t.all[locale]}
              </label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {sections
                  .filter((s) => s.slug !== "enterprise")
                  .map((s) => {
                    const slug = s.slug as PaidSection;
                    return (
                      <label key={slug} className={`${pill(chosen.includes(slug))} flex items-start gap-3`}>
                        <input
                          type="checkbox"
                          name="sections"
                          value={slug}
                          checked={chosen.includes(slug)}
                          onChange={() => toggle(slug)}
                          className="mt-0.5 size-4 shrink-0 accent-molecule-600"
                        />
                        <span>{s.title[locale]}</span>
                      </label>
                    );
                  })}
              </div>
            </fieldset>
          ) : (
            <div className="max-w-xs">
              <Field
                label={t.seats[locale]}
                name="seats"
                type="number"
                min={p.teamUsers}
                max={500}
                step={1}
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                dir="ltr"
              />
            </div>
          )}
        </>
      )}

      <fieldset>
        <legend className="text-sm font-semibold text-vault-900">{t.months[locale]}</legend>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {monthOptions.map((m) => (
            <label key={m} className={`${pill(months === m)} text-center`}>
              <input type="radio" name="months" value={m} checked={months === m} onChange={() => setMonths(m)} className="sr-only" />
              {m === 1 ? account.dashboard.month[locale] : account.dashboard.months[locale].replace("{n}", formatNumber(m, locale))}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-vault-900">{t.method[locale]}</legend>
        {online ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(["online", "invoice"] as const).map((m) => (
              <label key={m} className={pill(method === m)}>
                <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} className="sr-only" />
                {t[m][locale]}
              </label>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-xl border-2 border-dashed border-capsule-400 bg-capsule-400/10 px-4 py-3 text-sm text-vault-900">
            {t.onlineOff[locale]}
          </p>
        )}
      </fieldset>

      <div className="rounded-xl bg-vault-900 p-5 text-white">
        <div className="flex items-baseline justify-between gap-4 text-sm text-vault-100/80">
          <span>{t.monthly[locale]}</span>
          <span>
            {formatNumber(monthly, locale)} {copy.plans.currency[locale]}
          </span>
        </div>
        {off > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
            <span className="text-lg text-vault-100/60 line-through decoration-red-400 decoration-2">
              {formatNumber(list * months, locale)}
            </span>
            <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white">
              {t.off[locale].replace("{n}", formatNumber(off, locale))}
            </span>
          </div>
        )}
        <div className="mt-2 flex items-baseline justify-between gap-4">
          <span className="font-semibold">{t.total[locale]}</span>
          <span className="text-2xl font-bold text-capsule-400">
            {formatNumber(monthly * months, locale)} <span className="text-sm font-normal">{copy.plans.currency[locale]}</span>
          </span>
        </div>
      </div>

      <Message state={state} locale={locale} />
      <Submit pending={pending || !valid}>{online && method === "online" ? t.pay[locale] : t.order[locale]}</Submit>
      {online && method === "online" && <p className="text-center text-xs text-muted">{t.secure[locale]}</p>}
    </form>
  );
}

export function AddMemberForm({ locale, subscription }: { locale: Locale; subscription: string }) {
  const [state, action, pending] = useActionState(addTeamMember, {});
  return (
    <form action={action} className="mt-4 space-y-3">
      <input type="hidden" name="subscription" value={subscription} />
      <div className="flex gap-2">
        <input
          name="mobile"
          inputMode="tel"
          dir="ltr"
          required
          placeholder="09xxxxxxxxx"
          aria-label={auth.mobile[locale]}
          className="field-input"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-lg bg-molecule-600 px-4 text-sm font-semibold text-white hover:bg-molecule-700 disabled:opacity-60"
        >
          {account.dashboard.addMember[locale]}
        </button>
      </div>
      <Message state={state} locale={locale} ok={account.dashboard.flash.memberAdded[locale]} />
    </form>
  );
}
