"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Mail, Phone, Send } from "lucide-react";
import { copy, siteConfig } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { requestCtd, type ServiceRequestState } from "@/lib/service-actions";
import { CopyButton } from "./copy-button";

const t = copy.ctdService;

const input =
  "w-full rounded-xl border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-vault-100/40 focus:border-capsule-400";

/**
 * The CTD request: a form that saves the request on the site (so it never depends
 * on the visitor having an email app), with the phone number and the PharmaVault address as fallbacks.
 */
export function CtdRequest({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ServiceRequestState, FormData>(requestCtd, {});
  const f = t.form;
  const phone = siteConfig.contact.phone;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-capsule-400 to-capsule-500 px-6 py-3 text-sm font-bold text-vault-950 shadow-lg shadow-capsule-500/30 transition duration-300 hover:scale-[0.97]"
      >
        <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        {t.cta[locale]}
      </button>
    );
  }

  if (state.ok) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-capsule-400/50 bg-capsule-400/10 p-5" role="status">
        <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-capsule-400" aria-hidden="true" />
        <div>
          <p className="font-bold text-white">{f.sent[locale]}</p>
          <p className="mt-1 text-sm text-vault-100/85">{f.sentNote[locale]}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <form action={action} className="grid gap-3 rounded-2xl border border-white/10 bg-vault-950/40 p-5 sm:grid-cols-2">
        <input type="hidden" name="locale" value={locale} />
        {/* Honeypot: hidden from people, filled by bots */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
        <label className="grid gap-1.5 text-xs font-semibold text-vault-100/80">
          {f.name[locale]} *
          <input id="ctd-name" name="name" required maxLength={120} className={input} autoComplete="name" />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-vault-100/80">
          {f.phone[locale]} *
          <input id="ctd-phone" name="phone" required inputMode="tel" dir="ltr" maxLength={40} className={input} autoComplete="tel" placeholder="09xx xxx xxxx" />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-vault-100/80">
          {f.company[locale]}
          <input id="ctd-company" name="company" maxLength={160} className={input} autoComplete="organization" />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-vault-100/80">
          {f.email[locale]}
          <input id="ctd-email" name="email" type="email" dir="ltr" maxLength={160} className={input} autoComplete="email" />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-vault-100/80 sm:col-span-2">
          {f.product[locale]}
          <input id="ctd-product" name="product" maxLength={300} className={input} placeholder={f.productHint[locale]} />
        </label>
        <label className="grid gap-1.5 text-xs font-semibold text-vault-100/80 sm:col-span-2">
          {f.message[locale]}
          <textarea id="ctd-message" name="message" rows={3} maxLength={2000} className={input} placeholder={f.messageHint[locale]} />
        </label>
        {state.error && (
          <p className="text-sm font-medium text-red-300 sm:col-span-2" role="alert">
            {f.errors[state.error][locale]}
          </p>
        )}
        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-capsule-400 to-capsule-500 px-6 py-3 text-sm font-bold text-vault-950 shadow-lg shadow-capsule-500/30 transition duration-300 hover:scale-[0.97] disabled:opacity-60"
          >
            <Send className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            {pending ? f.sending[locale] : f.submit[locale]}
          </button>
        </div>
      </form>

      <div className="text-sm text-vault-100/80">
        <p className="mb-2.5">{f.orContact[locale]}</p>
        <div className="flex flex-wrap items-center gap-2">
          {phone && (
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-semibold text-white hover:border-capsule-400">
              <Phone className="size-4" aria-hidden="true" />
              <span dir="ltr">{phone}</span>
            </a>
          )}
          <span id="ctd-email-address" dir="ltr" className="inline-flex select-all items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 font-mono text-xs text-white">
            <Mail className="size-4" aria-hidden="true" />
            {siteConfig.email}
          </span>
          <CopyButton targetId="ctd-email-address" label={f.copyEmail[locale]} doneLabel={f.copied[locale]} />
        </div>
      </div>
    </div>
  );
}
