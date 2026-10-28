"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Download, History, Lock, X } from "lucide-react";

export type ArchiveItem = {
  slug: string;
  /** "Issue 1 · 5th week of Mehr 1405", already in the reader's language. */
  label: string;
  title: string;
  subtitle: string;
  size: string;
  url: string;
  cover: StaticImageData;
  coverAlt: string;
};

export type ArchiveLabels = {
  button: string;
  title: string;
  lead: string;
  subscribers: string;
  download: string;
  checking: string;
  lockedTitle: string;
  lockedText: string;
  buy: string;
  login: string;
  close: string;
};

type Links = { buyHref: string; loginHref: string };

/** The subscribers-only notice shown when a reader without a subscription asks for an earlier issue. */
function LockedNotice({ labels, links, onClose }: { labels: ArchiveLabels; links: Links; onClose: () => void }) {
  return (
    <div role="alert" className="relative rounded-2xl border border-capsule-400/70 bg-capsule-50 p-5 pe-10 text-vault-900">
      <button type="button" onClick={onClose} aria-label={labels.close} className="absolute end-3 top-3 rounded-full p-1 text-muted hover:text-vault-900">
        <X className="size-4" aria-hidden="true" />
      </button>
      <p className="flex items-center gap-2 font-extrabold">
        <Lock className="size-4 text-capsule-700" aria-hidden="true" />
        {labels.lockedTitle}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed">{labels.lockedText}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={links.buyHref} className="rounded-full bg-vault-900 px-5 py-2 text-sm font-bold text-capsule-400 hover:bg-vault-800">
          {labels.buy}
        </Link>
        <Link href={links.loginHref} className="rounded-full border border-vault-900/30 px-5 py-2 text-sm font-semibold hover:border-vault-900">
          {labels.login}
        </Link>
      </div>
    </div>
  );
}

/** Download of an earlier issue: allowed for subscribers, otherwise the notice. */
function ArchiveDownload({ item, labels, onLocked }: { item: ArchiveItem; labels: ArchiveLabels; onLocked: () => void }) {
  const [busy, setBusy] = useState(false);
  const download = async () => {
    setBusy(true);
    try {
      const res = await fetch(`${item.url}${item.url.includes("?") ? "&" : "?"}check=1`, { cache: "no-store" });
      const { ok } = (await res.json()) as { ok: boolean };
      if (!ok) return onLocked();
      const a = document.createElement("a");
      a.href = item.url;
      a.download = "";
      document.body.append(a);
      a.click();
      a.remove();
    } catch {
      onLocked();
    } finally {
      setBusy(false);
    }
  };
  return (
    <button
      type="button"
      onClick={download}
      disabled={busy}
      className="inline-flex items-center gap-2 rounded-full bg-vault-900 px-5 py-2.5 text-sm font-bold text-capsule-400 transition hover:bg-vault-800 disabled:opacity-60"
    >
      <Download className="size-4" aria-hidden="true" />
      {busy ? labels.checking : labels.download}
    </button>
  );
}

/** Earlier issues in order of issue number, each with its gated download. */
export function ArchiveList({ items, labels, links }: { items: ArchiveItem[]; labels: ArchiveLabels; links: Links }) {
  const [locked, setLocked] = useState<string | null>(null);
  return (
    <ol className="space-y-4">
      {items.map((item) => (
        <li key={item.slug} className="rounded-3xl border border-line bg-white p-4 shadow-sm shadow-vault-900/5 sm:p-5">
          <div className="flex gap-4 sm:gap-5">
            <div className="relative w-20 shrink-0 self-start overflow-hidden rounded-lg shadow-lg shadow-vault-900/20 ring-1 ring-line sm:w-28">
              <Image src={item.cover} alt={item.coverAlt} sizes="112px" placeholder="blur" className="h-auto w-full" />
            </div>
            <div className="flex min-w-0 flex-col">
              <p className="text-xs font-bold text-molecule-600">{item.label}</p>
              <h3 className="mt-1 font-extrabold leading-snug text-vault-900">{item.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{item.subtitle}</p>
              <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1 rounded-full bg-capsule-400/15 px-2.5 py-0.5 font-bold text-capsule-700">
                  <Lock className="size-3" aria-hidden="true" />
                  {labels.subscribers}
                </span>
                {item.size}
              </p>
              <div className="mt-3">
                <ArchiveDownload item={item} labels={labels} onLocked={() => setLocked(item.slug)} />
              </div>
            </div>
          </div>
          {locked === item.slug && (
            <div className="mt-4">
              <LockedNotice labels={labels} links={links} onClose={() => setLocked(null)} />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

/** "Previous issues" button beside this week's handbook; opens the list of earlier issues. */
export function HandbookArchive({ items, labels, links, count }: { items: ArchiveItem[]; labels: ArchiveLabels; links: Links; count: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open]);
  if (!items.length) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
      >
        <History className="size-4" aria-hidden="true" />
        {labels.button}
        <span className="rounded-full bg-capsule-400 px-2 py-0.5 text-xs font-extrabold text-vault-900">{count}</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-vault-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={labels.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-vault-50 p-5 text-start shadow-2xl sm:rounded-3xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-vault-900">{labels.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{labels.lead}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={labels.close} className="rounded-full p-1.5 text-muted hover:bg-white hover:text-vault-900">
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-5">
              <ArchiveList items={items} labels={labels} links={links} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
