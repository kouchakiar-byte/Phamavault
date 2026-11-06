"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { referralCopy as t } from "@/content/referrals";
import type { Locale } from "@/i18n/config";

/** The reader's referral link, with copy and (where the browser offers it) share. */
const noop = () => () => {};

export function ReferralLink({ url, locale }: { url: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);
  // Known only in the browser; false on the server so the first render matches.
  const canShare = useSyncExternalStore(noop, () => "share" in navigator, () => false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  const share = async () => {
    try {
      await navigator.share({ title: "PharmaVault", text: t.shareText[locale], url });
    } catch {}
  };
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input readOnly value={url} dir="ltr" aria-label={t.link[locale]} className="field-input flex-1 font-mono text-sm" onFocus={(e) => e.currentTarget.select()} />
      <div className="flex gap-2">
        <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full bg-vault-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-vault-800">
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copied ? t.copied[locale] : t.copy[locale]}
        </button>
        {canShare && (
          <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-vault-900 hover:border-molecule-500">
            <Share2 className="size-4" aria-hidden="true" />
            {t.share[locale]}
          </button>
        )}
      </div>
    </div>
  );
}
