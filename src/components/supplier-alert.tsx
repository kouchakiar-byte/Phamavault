"use client";

import { useActionState } from "react";
import Link from "next/link";
import { BellRing, CheckCircle2 } from "lucide-react";
import { alertCopy as t } from "@/content/supplier-alerts";
import type { Locale } from "@/i18n/config";
import { requestSupplierAlert, type AlertState } from "@/lib/supplier-alert-actions";

const fill = (s: string, q: string) => s.replace("{q}", q);

/** Offered when a search of the supplier bank finds nothing: watch for the material. */
export function SupplierAlert({ locale, query, signedIn, loginHref }: { locale: Locale; query: string; signedIn: boolean; loginHref: string }) {
  const [state, action, pending] = useActionState<AlertState, FormData>(requestSupplierAlert, {});
  const q = query.trim();
  if (q.length < 2) return null;

  if (state.ok) {
    return (
      <div className="flex items-start gap-3 rounded-card border border-molecule-400/50 bg-molecule-50 p-5" role="status">
        <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-molecule-600" aria-hidden="true" />
        <p className="font-semibold text-vault-900">{fill(t.saved[locale], q)}</p>
      </div>
    );
  }

  return (
    <div className="rounded-card border border-capsule-400/50 bg-gradient-to-br from-capsule-50 to-white p-5">
      <p className="flex items-center gap-2 font-bold text-vault-900">
        <BellRing className="size-5 text-capsule-600" aria-hidden="true" />
        {t.title[locale]}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{fill(t.lead[locale], q)}</p>
      {signedIn ? (
        <form action={action} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <input type="hidden" name="q" value={q} />
          <input type="hidden" name="locale" value={locale} />
          <label className="block flex-1 text-xs font-semibold text-muted">
            {t.email[locale]}
            <input name="email" type="email" dir="ltr" maxLength={160} autoComplete="email" className="field-input mt-1" />
            <span className="mt-1 block font-normal">{t.emailHint[locale]}</span>
          </label>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-vault-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-vault-800 disabled:opacity-60 sm:mb-6"
          >
            <BellRing className="size-4" aria-hidden="true" />
            {t.submit[locale]}
          </button>
        </form>
      ) : (
        <Link href={loginHref} className="mt-4 inline-flex font-semibold text-molecule-700 hover:underline">
          {t.signIn[locale]}
        </Link>
      )}
      {state.error && (
        <p className="mt-3 text-sm font-medium text-red-700" role="alert">
          {t.errors[state.error][locale]}
        </p>
      )}
    </div>
  );
}
