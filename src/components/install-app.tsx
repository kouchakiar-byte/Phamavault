"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, Share, X } from "lucide-react";
import { installCopy as t } from "@/content/install";
import type { Locale } from "@/i18n/config";
import { LogoMark } from "./logo";

/** Chrome's install event (not in the DOM typings). */
type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

const DISMISS_KEY = "pv-install-dismissed";
const DISMISS_DAYS = 30;
const noSubscribe = () => () => {};

const standalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

/** Dismissed in the last month. */
function dismissedRecently(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY));
    return Boolean(at) && Date.now() - at < DISMISS_DAYS * 864e5;
  } catch {
    return false;
  }
}

/**
 * A small corner pill that offers to install the site as an app: Chrome and
 * Edge use their own install dialog; iPhone and iPad (no install event) get the
 * Share → Add to Home Screen steps. Hidden once installed or dismissed.
 */
export function InstallApp({ locale }: { locale: Locale }) {
  const [event, setEvent] = useState<InstallEvent | null>(null);
  const [closed, setClosed] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  // Read on the client only; the server and the first render see "hidden".
  const hidden = useSyncExternalStore(noSubscribe, () => standalone() || dismissedRecently(), () => true);
  const ios = useSyncExternalStore(noSubscribe, () => /iphone|ipad|ipod/i.test(navigator.userAgent), () => false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvent(e as InstallEvent);
    };
    const onInstalled = () => setClosed(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (hidden || closed || (!event && !ios)) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setClosed(true);
  };

  const install = async () => {
    if (!event) return setShowSteps((v) => !v);
    await event.prompt();
    const { outcome } = await event.userChoice;
    setEvent(null);
    if (outcome === "accepted") setClosed(true);
  };

  const [before, after] = t.ios[locale].split("{icon}");
  return (
    <div className="pv-step-in fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:start-5 sm:bottom-5 sm:w-[22rem]" role="region" aria-label={t.title[locale]}>
      <div className="rounded-2xl border border-white/10 bg-vault-900 p-3.5 text-white shadow-2xl shadow-vault-950/40">
        <div className="flex items-center gap-3">
          <LogoMark className="size-11 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">{t.title[locale]}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-vault-100/70">{t.sub[locale]}</p>
          </div>
          <button type="button" onClick={dismiss} aria-label={t.close[locale]} className="self-start rounded-lg p-1 text-vault-100/60 hover:bg-white/10 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
        {showSteps && (
          <p className="mt-3 rounded-xl bg-white/[0.06] px-3 py-2 text-xs leading-relaxed text-vault-100/90">
            {before}
            <Share className="mx-0.5 inline size-3.5 align-[-2px] text-molecule-400" aria-label="Share" />
            {after}
          </p>
        )}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={install}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-capsule-500 px-4 py-2 text-sm font-bold text-vault-950 transition hover:bg-capsule-400"
          >
            <Download className="size-4" aria-hidden="true" />
            {event ? t.install[locale] : t.how[locale]}
          </button>
          <button type="button" onClick={dismiss} className="rounded-full px-4 py-2 text-sm text-vault-100/70 hover:bg-white/10 hover:text-white">
            {t.close[locale]}
          </button>
        </div>
      </div>
    </div>
  );
}
