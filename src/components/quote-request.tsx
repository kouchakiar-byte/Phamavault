"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { quoteCopy as t } from "@/content/lab-brands";
import type { Locale } from "@/i18n/config";
import { requestQuote, type ServiceRequestState } from "@/lib/service-actions";

const input = "field-input mt-1";
const label = "block text-xs font-semibold text-muted";

/** A price enquiry saved on the site; it appears in the admin panel with the other service requests. */
export function QuoteRequest({ locale, defaultItem = "", startOpen = false }: { locale: Locale; defaultItem?: string; startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen);
  const [state, action, pending] = useActionState<ServiceRequestState, FormData>(requestQuote, {});

  if (state.ok) {
    return (
      <div className="flex items-start gap-3 rounded-card border border-molecule-400/50 bg-molecule-50 p-5" role="status">
        <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-molecule-600" aria-hidden="true" />
        <div>
          <p className="font-bold text-vault-900">{t.sent[locale]}</p>
          <p className="mt-1 text-sm text-muted">{t.sentNote[locale]}</p>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-capsule-400 bg-gradient-to-l from-capsule-400 to-capsule-500 px-6 py-3 text-sm font-bold text-vault-950 shadow-lg shadow-capsule-500/25 transition duration-300 hover:scale-[0.97]"
      >
        <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {t.open[locale]}
      </button>
    );
  }

  return (
    <form action={action} className="grid gap-3 rounded-card border border-line bg-white p-5 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className={`${label} sm:col-span-2`}>
        {t.item[locale]} *
        <input name="product" required maxLength={300} defaultValue={defaultItem} className={input} placeholder={t.itemHint[locale]} />
      </label>
      <label className={label}>
        {t.name[locale]} *
        <input name="name" required maxLength={120} className={input} autoComplete="name" />
      </label>
      <label className={label}>
        {t.phone[locale]} *
        <input name="phone" required inputMode="tel" dir="ltr" maxLength={40} className={input} autoComplete="tel" placeholder="09xx xxx xxxx" />
      </label>
      <label className={label}>
        {t.company[locale]}
        <input name="company" maxLength={160} className={input} autoComplete="organization" />
      </label>
      <label className={label}>
        {t.email[locale]}
        <input name="email" type="email" dir="ltr" maxLength={160} className={input} autoComplete="email" />
      </label>
      <label className={`${label} sm:col-span-2`}>
        {t.message[locale]}
        <textarea name="message" rows={2} maxLength={2000} className={input} />
      </label>
      {state.error && (
        <p className="text-sm font-medium text-red-700 sm:col-span-2" role="alert">
          {t.errors[state.error][locale]}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-vault-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-vault-800 disabled:opacity-60"
        >
          <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          {pending ? t.sending[locale] : t.submit[locale]}
        </button>
      </div>
    </form>
  );
}
