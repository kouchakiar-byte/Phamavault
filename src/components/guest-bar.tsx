"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserPlus, X } from "lucide-react";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/paths";

const t = copy.guestBar;
const KEY = "pv-guest-bar-closed";

/**
 * Phones only: once a reader who is not signed in has scrolled a little, a slim bar at the
 * bottom offers a free account. Closed for the rest of the visit; never over the install banner.
 */
export function GuestBar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [guest, setGuest] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/viewer", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { tag: string | null }) => alive && setGuest(!d.tag))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (!guest) return;
    const update = () => {
      let closed = false;
      try {
        closed = sessionStorage.getItem(KEY) === "1";
      } catch {}
      setShow(!closed && window.scrollY > 480 && !document.querySelector("[data-pv-install]"));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [guest, pathname]);

  if (!guest || !show || /\/(account|admin)(\/|$)/.test(pathname)) return null;
  const close = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    setShow(false);
  };
  return (
    <div className="pv-step-in fixed inset-x-3 bottom-3 z-30 md:hidden" role="region" aria-label={t.cta[locale]}>
      <div className="flex items-center gap-2 rounded-2xl border border-capsule-400/40 bg-vault-900/95 p-2 ps-4 text-white shadow-2xl shadow-vault-950/40 backdrop-blur">
        <p className="min-w-0 flex-1 text-xs font-semibold leading-snug">{t.text[locale]}</p>
        <Link
          href={`${href(locale, "account/register")}?next=${encodeURIComponent(pathname)}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-capsule-400 px-3.5 py-2 text-sm font-bold text-vault-950"
        >
          <UserPlus className="size-4" aria-hidden="true" />
          {t.cta[locale]}
        </Link>
        <button type="button" onClick={close} aria-label={t.close[locale]} className="shrink-0 rounded-lg p-1.5 text-vault-100/60 hover:bg-white/10 hover:text-white">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
