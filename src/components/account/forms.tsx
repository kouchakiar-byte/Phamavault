"use client";

import { startTransition, useActionState, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { addTeamMember, buy, forgotPassword, login, register, setNewPassword, type FormState } from "@/app/[lang]/account/actions";
import { account } from "@/content/account";
import { sections } from "@/content/sections";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/lib/format";
import { listPrice, monthlyPrice, monthOptions, planIds, sectionsOf, type PaidSection, type PlanId } from "@/lib/pricing";
import { planItem } from "@/lib/labels";
import { withBrand } from "../brand";
import { VaultLock } from "./vault-lock";

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

type Kind = "individual" | "company" | "pharmacy";

export function RegisterForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(register, {});
  const [kind, setKind] = useState<Kind>("individual");
  return (
    <form action={withNext(action)} className="space-y-5">
      <input type="hidden" name="lang" value={locale} />
      <fieldset>
        <legend className="block text-sm font-medium text-vault-900">{auth.kind[locale]}</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {(["individual", "company", "pharmacy"] as const).map((k) => (
            <label key={k} className={`${pill(kind === k)} px-2 text-center`}>
              <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} className="sr-only" />
              {auth.kinds[k][locale]}
            </label>
          ))}
        </div>
      </fieldset>
      <Field label={auth.name[locale]} name="name" autoComplete="name" required maxLength={120} />
      {/* Company and pharmacy accounts need the organisation's name; for individuals it is optional. */}
      <Field key={kind} label={auth.org[kind][locale]} name="org" autoComplete="organization" required={kind !== "individual"} maxLength={160} />
      <Field label={auth.mobile[locale]} hint={auth.mobileHint[locale]} name="mobile" inputMode="tel" autoComplete="tel" dir="ltr" required />
      <Field label={auth.email[locale]} hint={auth.emailHint[locale]} name="email" type="email" autoComplete="email" dir="ltr" required maxLength={160} />
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

export function ForgotForm({ locale }: { locale: Locale }) {
  const [state, action, pending] = useActionState(forgotPassword, {});
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="lang" value={locale} />
      <Field label={account.reset.identifier[locale]} name="identifier" autoComplete="username" dir="ltr" required maxLength={160} />
      <Message state={state} locale={locale} ok={account.reset.sent[locale]} />
      {!state.ok && <Submit pending={pending}>{account.reset.send[locale]}</Submit>}
    </form>
  );
}

export function NewPasswordForm({ locale, token }: { locale: Locale; token: string }) {
  const [state, action, pending] = useActionState(setNewPassword, {});
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="lang" value={locale} />
      <input type="hidden" name="token" value={token} />
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
      <Submit pending={pending}>{account.reset.save[locale]}</Submit>
    </form>
  );
}

const pill = (active: boolean) =>
  `cursor-pointer rounded-xl border px-4 py-3 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-molecule-400 ${
    active ? "border-molecule-500 bg-molecule-50 font-semibold text-vault-900" : "border-line bg-white text-vault-800 hover:border-molecule-400"
  }`;

type Renewal = { id: string; plan: PlanId; sections: PaidSection[]; seats: number; label: string };

type StepId = "plan" | "scope" | "months" | "method";

export function BuyForm({
  locale,
  initialPlan,
  initialSeats,
  initialMonths,
  startAtLast,
  signedIn,
  renewal,
  online,
}: {
  locale: Locale;
  initialPlan: PlanId;
  initialSeats: number;
  initialMonths: number;
  startAtLast: boolean;
  signedIn: boolean;
  renewal: Renewal | null;
  online: boolean;
}) {
  const [state, action, pending] = useActionState(buy, {});
  const [plan, setPlan] = useState<PlanId>(renewal?.plan ?? initialPlan);
  const [seats, setSeats] = useState(String(renewal?.seats ?? initialSeats));
  const [months, setMonths] = useState<number>(initialMonths);
  const [method, setMethod] = useState<"online" | "invoice">(online ? "online" : "invoice");
  const [step, setStep] = useState(startAtLast && !renewal ? 3 : 0);
  const [turns, setTurns] = useState(0);
  const [waiting, setWaiting] = useState(false);

  const steps: StepId[] = renewal ? ["months", "method"] : ["plan", "scope", "months", "method"];
  const current = steps[step];
  const last = step === steps.length - 1;
  const opening = waiting || pending;
  const turn = () => setTurns((n) => n + 1);

  const seatCount = Math.max(p.teamUsers, Math.floor(Number(seats)) || p.teamUsers);
  const purchase = renewal ?? { plan, seats: seatCount };
  const monthly = monthlyPrice(purchase);
  const list = listPrice(purchase);
  const off = list > monthly ? Math.round(((list - monthly) / list) * 100) : 0;
  const go = (to: number) => {
    setStep(to);
    turn();
  };

  // Let the vault swing open before the browser leaves for the payment page.
  const submit = (form: FormData) => {
    setWaiting(true);
    setTimeout(() => {
      startTransition(() => {
        setWaiting(false);
        action(form);
      });
    }, 900);
  };

  const stepText = t.steps[current === "scope" && plan !== "individual" ? (plan === "team" ? "seats" : "pharmacy") : current];

  return (
    <form action={submit} className="grid gap-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10">
      <input type="hidden" name="lang" value={locale} />
      {renewal && <input type="hidden" name="renew" value={renewal.id} />}

      {/* The vault: a tumbler lights for every finished step */}
      <div className="flex flex-col items-center gap-3 md:sticky md:top-24 md:self-start">
        <VaultLock steps={steps.length} unlocked={opening ? steps.length : step} turns={turns} opening={opening} className="size-40 md:size-52" />
        <p className="text-center text-sm font-semibold text-molecule-700" aria-live="polite">
          {opening
            ? t.opening[locale]
            : t.progress[locale]
                .replace("{n}", formatNumber(step, locale))
                .replace("{total}", formatNumber(steps.length, locale))}
        </p>
      </div>

      <div className="min-w-0 space-y-6">
        <ol className="flex gap-1.5" aria-hidden="true">
          {steps.map((id, i) => (
            <li key={id} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-capsule-400" : "bg-line"}`} />
          ))}
        </ol>

        <div key={current} className="pv-step-in">
          <p className="text-xs font-bold tracking-wide text-capsule-500">
            {t.keyOf[locale].replace("{n}", formatNumber(step + 1, locale)).replace("{total}", formatNumber(steps.length, locale))}
          </p>
          <p className="mt-1 text-xl font-bold text-vault-900">{stepText.title[locale]}</p>
          <p className="mt-1 text-sm text-muted">{stepText.hint[locale]}</p>
        </div>

        {renewal && (
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="font-bold text-vault-900">{t.renewing[locale].replace("{id}", renewal.id)}</p>
            <p className="mt-1 text-sm text-muted">{renewal.label}</p>
          </div>
        )}

        {!renewal && (
          <>
            <fieldset hidden={current !== "plan"} className="pv-step-in">
              <legend className="sr-only">{t.plan[locale]}</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {planIds.map((id) => (
                  <label key={id} className={pill(plan === id)}>
                    <input
                      type="radio"
                      name="plan"
                      value={id}
                      checked={plan === id}
                      onChange={() => {
                        setPlan(id);
                        turn();
                      }}
                      className="sr-only"
                    />
                    <span className="block text-base">{planItem(id).name[locale]}</span>
                    <span className="mt-1 block text-xs font-normal text-muted">{planItem(id).priceFor[locale]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div hidden={current !== "scope"} className="pv-step-in">
              {plan !== "team" ? (
                <div>
                  <p className={`${pill(true)} flex items-center gap-3`}>
                    <Check className="size-4 shrink-0 text-molecule-600" aria-hidden="true" />
                    {(plan === "pharmacy" ? t.allPharmacy : t.all)[locale]}
                  </p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {sections
                      .filter((s) => sectionsOf(plan).includes(s.slug as PaidSection))
                      .map((s) => (
                        <li key={s.slug} className="flex items-start gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm text-vault-800">
                          <Check className="mt-0.5 size-4 shrink-0 text-molecule-600" aria-hidden="true" />
                          <span>{s.title[locale]}</span>
                        </li>
                      ))}
                  </ul>
                </div>
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
                    onChange={(e) => {
                      setSeats(e.target.value);
                      turn();
                    }}
                    dir="ltr"
                  />
                </div>
              )}
            </div>
          </>
        )}

        <fieldset hidden={current !== "months"} className="pv-step-in">
          <legend className="sr-only">{t.months[locale]}</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {monthOptions.map((m) => (
              <label key={m} className={`${pill(months === m)} text-center`}>
                <input
                  type="radio"
                  name="months"
                  value={m}
                  checked={months === m}
                  onChange={() => {
                    setMonths(m);
                    turn();
                  }}
                  className="sr-only"
                />
                {m === 1 ? account.dashboard.month[locale] : account.dashboard.months[locale].replace("{n}", formatNumber(m, locale))}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset hidden={current !== "method"} className="pv-step-in">
          <legend className="sr-only">{t.method[locale]}</legend>
          {online ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {(["online", "invoice"] as const).map((m) => (
                <label key={m} className={pill(method === m)}>
                  <input
                    type="radio"
                    name="method"
                    value={m}
                    checked={method === m}
                    onChange={() => {
                      setMethod(m);
                      turn();
                    }}
                    className="sr-only"
                  />
                  {t[m][locale]}
                </label>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border-2 border-dashed border-capsule-400 bg-capsule-400/10 px-4 py-3 text-sm text-vault-900">
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

        <div className="flex items-center gap-3">
          {step > 0 && !opening && (
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-vault-900 hover:border-molecule-500"
            >
              {t.back[locale]}
            </button>
          )}
          {/* Distinct keys: reusing one element would turn the "next" click into a submit */}
          {last ? (
            <button
              key="submit"
              type="submit"
              disabled={opening}
              className="pv-shine flex-1 rounded-full bg-capsule-500 px-6 py-3 font-bold text-vault-950 shadow-lg shadow-capsule-500/30 transition hover:bg-capsule-400 disabled:opacity-70"
            >
              {opening
                ? t.opening[locale]
                : !signedIn
                  ? t.unlockSignUp[locale]
                  : online && method === "online"
                    ? t.unlockPay[locale]
                    : t.unlockOrder[locale]}
            </button>
          ) : (
            <button
              key="next"
              type="button"
              onClick={() => go(step + 1)}
              className="flex-1 rounded-full bg-vault-900 px-6 py-3 font-semibold text-white transition hover:bg-vault-800 disabled:opacity-50"
            >
              {t.next[locale]}
            </button>
          )}
        </div>
        {last && online && method === "online" && <p className="text-center text-xs text-muted">{withBrand(t.secure[locale])}</p>}
        {last && (
          <p className="text-center text-xs text-muted">
            {t.acceptTerms[locale]}{" "}
            <a href={`/${locale}/terms`} target="_blank" className="font-semibold text-molecule-700 hover:underline">
              {t.terms[locale]}
            </a>
          </p>
        )}
      </div>
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
