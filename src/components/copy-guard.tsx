"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, X } from "lucide-react";

/** Set once the request-time check (CopyAllowance) finds a subscriber or an admin. */
let allowed = false;
const ALLOW_EVENT = "pv-copy-allowed";

export function AllowCopy() {
  useEffect(() => {
    allowed = true;
    window.dispatchEvent(new Event(ALLOW_EVENT));
  }, []);
  return null;
}

type Labels = { title: string; text: string; buy: string; close: string };

/** Places where copying is always fine: form fields and the reader's own account pages. */
function exempt(target: EventTarget | null): boolean {
  if (/\/(account|admin)(\/|$)/.test(window.location.pathname)) return true;
  const el = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
  return Boolean(el?.closest("input, textarea, select, [contenteditable=true], [data-copy-ok]"));
}

/**
 * Site-wide: readers without a subscription cannot copy, cut or open the context menu on the
 * content; they are told how to subscribe instead. Subscribers and admins copy freely (SOPs and
 * general chapters still add the reader's invisible code, see sop-copy-lock).
 */
export function CopyGuard({ labels, buyHref }: { labels: Labels; buyHref: string }) {
  const [notice, setNotice] = useState(false);
  useEffect(() => {
    const block = (e: Event) => {
      // Already handled by a document's own lock (it shows its own notice).
      if (allowed || e.defaultPrevented || exempt(e.target)) return;
      e.preventDefault();
      if (e instanceof ClipboardEvent) e.clipboardData?.setData("text/plain", "");
      setNotice(true);
    };
    const drag = (e: DragEvent) => {
      if (allowed || exempt(e.target)) return;
      if (e.target instanceof Text || window.getSelection()?.toString()) e.preventDefault();
    };
    window.addEventListener("copy", block);
    window.addEventListener("cut", block);
    window.addEventListener("contextmenu", block);
    window.addEventListener("dragstart", drag);
    const onAllow = () => setNotice(false);
    window.addEventListener(ALLOW_EVENT, onAllow);
    return () => {
      window.removeEventListener("copy", block);
      window.removeEventListener("cut", block);
      window.removeEventListener("contextmenu", block);
      window.removeEventListener("dragstart", drag);
      window.removeEventListener(ALLOW_EVENT, onAllow);
    };
  }, []);

  if (!notice) return null;
  return (
    <div role="dialog" aria-modal="false" aria-labelledby="copy-guard-title" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-card border border-line bg-white p-5 shadow-xl">
      <button type="button" onClick={() => setNotice(false)} aria-label={labels.close} className="absolute end-3 top-3 rounded-full p-1 text-muted hover:bg-paper">
        <X className="size-4" aria-hidden="true" />
      </button>
      <p id="copy-guard-title" className="flex items-center gap-2 font-bold text-vault-900">
        <Lock className="size-4 text-capsule-600" aria-hidden="true" />
        {labels.title}
      </p>
      <p className="mt-2 text-sm leading-7 text-ink">{labels.text}</p>
      <Link
        href={buyHref}
        onClick={() => setNotice(false)}
        className="mt-4 inline-flex rounded-full bg-molecule-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-molecule-700"
      >
        {labels.buy}
      </Link>
    </div>
  );
}
