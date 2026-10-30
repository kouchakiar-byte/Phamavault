"use client";

import { createContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { Lock, X } from "lucide-react";
import { CopyButton } from "./copy-button";

type Labels = { copy: string; copied: string; title: string; text: string; buy: string; plans: string; close: string };

/** Documents the signed-in reader may copy, by target id. Filled by <CopyUnlock>, which streams in after the page. */
const unlocked = new Set<string>();
const UNLOCK_EVENT = "pv-copy-unlock";
const subscribe = (cb: () => void) => {
  window.addEventListener(UNLOCK_EVENT, cb);
  return () => window.removeEventListener(UNLOCK_EVENT, cb);
};

/** True inside an unlocked document, so nested sheets (SheetPage) can allow copying too. */
export const CopyableContext = createContext(false);

/**
 * Rendered (inside Suspense) only for readers who may copy. The document itself is rendered
 * once, locked, in the static page; this unlocks it, so the text is not sent twice.
 */
export function CopyUnlock({ targetId }: { targetId: string }) {
  useEffect(() => {
    unlocked.add(targetId);
    window.dispatchEvent(new Event(UNLOCK_EVENT));
  }, [targetId]);
  return null;
}

/**
 * Wraps an SOP document. For readers without a subscription, selecting and
 * copying the text is blocked and the copy button explains how to get access.
 */
export function SopCopyLock({
  locked: lockedByDefault,
  targetId,
  buyHref,
  plansHref,
  labels,
  children,
}: {
  locked: boolean;
  targetId: string;
  buyHref: string;
  plansHref: string;
  labels: Labels;
  children: ReactNode;
}) {
  const [notice, setNotice] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const opened = useSyncExternalStore(subscribe, () => unlocked.has(targetId), () => false);
  const locked = lockedByDefault && !opened;

  // Page-wide guard: a selection that reaches into the SOP (Ctrl+A, long-press on a phone,
  // keyboard shortcuts) is cleared and the copy is cancelled.
  useEffect(() => {
    if (!locked) return;
    const inside = () => {
      const sel = window.getSelection();
      const el = box.current;
      if (!sel || !el || sel.rangeCount === 0) return false;
      for (let i = 0; i < sel.rangeCount; i++) if (sel.getRangeAt(i).intersectsNode(el)) return true;
      return false;
    };
    const onCopy = (e: ClipboardEvent) => {
      if (!inside()) return;
      e.preventDefault();
      e.clipboardData?.setData("text/plain", "");
      window.getSelection()?.removeAllRanges();
      setNotice(true);
    };
    const onSelect = () => {
      if (inside()) window.getSelection()?.removeAllRanges();
    };
    const onStart = (e: Event) => {
      if (box.current && e.target instanceof Node && box.current.contains(e.target)) e.preventDefault();
    };
    document.addEventListener("copy", onCopy, true);
    document.addEventListener("cut", onCopy, true);
    document.addEventListener("selectionchange", onSelect);
    document.addEventListener("selectstart", onStart, true);
    return () => {
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("cut", onCopy, true);
      document.removeEventListener("selectionchange", onSelect);
      document.removeEventListener("selectstart", onStart, true);
    };
  }, [locked]);

  const block = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setNotice(true);
  };
  // One wrapper in both states, so unlocking does not remount the document.
  const guard = locked
    ? { className: "select-none", style: { WebkitUserSelect: "none", WebkitTouchCallout: "none" } as const, onCopy: block, onCut: block, onContextMenu: block, onDragStart: block }
    : {};
  const doc = (
    <div ref={box} {...guard}>
      <CopyableContext.Provider value={!locked}>{children}</CopyableContext.Provider>
    </div>
  );
  if (!locked) {
    return (
      <>
        {doc}
        <div className="mt-6">
          <CopyButton targetId={targetId} label={labels.copy} doneLabel={labels.copied} />
        </div>
      </>
    );
  }
  return (
    <>
      {doc}
      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={() => setNotice(true)}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-vault-900 transition hover:border-molecule-500 hover:text-molecule-700"
        >
          <Lock className="size-4" aria-hidden="true" />
          {labels.copy}
        </button>
        {notice && (
          <div role="alert" className="relative max-w-xl rounded-card border border-molecule-400/60 bg-molecule-50 p-5 pe-10">
            <button
              type="button"
              onClick={() => setNotice(false)}
              aria-label={labels.close}
              className="absolute end-3 top-3 rounded-full p-1 text-muted hover:text-vault-900"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <p className="flex items-center gap-2 font-bold text-vault-900">
              <Lock className="size-4 text-molecule-600" aria-hidden="true" />
              {labels.title}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink">{labels.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={buyHref}
                className="inline-flex items-center rounded-full bg-molecule-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-molecule-700"
              >
                {labels.buy}
              </Link>
              <Link
                href={plansHref}
                className="inline-flex items-center rounded-full border border-line bg-white px-5 py-2 text-sm font-semibold text-vault-900 transition hover:border-molecule-500"
              >
                {labels.plans}
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
