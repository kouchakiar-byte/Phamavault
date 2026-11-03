"use client";

import { createContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { Check, Copy, Lock, X } from "lucide-react";
import { copySop } from "@/app/[lang]/qa/actions";
import { watermark } from "@/lib/watermark";

type Labels = { copy: string; copied: string; title: string; text: string; buy: string; plans: string; close: string };
type QuotaLabels = { count: string; again: string; full: string; failed: string };

/** What a subscriber may copy: the reader's account id for the watermark and this month's SOP allowance. */
type Unlock = { mark: number; code: string; used: number; limit: number };

/** Documents the signed-in reader may copy, by target id. Filled by <CopyUnlock>, which streams in after the page. */
const unlocked = new Map<string, Unlock>();
const UNLOCK_EVENT = "pv-copy-unlock";
const subscribe = (cb: () => void) => {
  window.addEventListener(UNLOCK_EVENT, cb);
  return () => window.removeEventListener(UNLOCK_EVENT, cb);
};

/** Page text is never copyable (sheets nested in a document read this; it stays false). */
export const CopyableContext = createContext(false);

/**
 * Rendered (inside Suspense) only for subscribers who may copy SOPs. The document itself is
 * rendered once, locked, in the static page; this enables its copy button.
 */
export function CopyUnlock({ targetId, ...unlock }: { targetId: string } & Unlock) {
  const { mark, code, used, limit } = unlock;
  useEffect(() => {
    unlocked.set(targetId, { mark, code, used, limit });
    window.dispatchEvent(new Event(UNLOCK_EVENT));
  }, [targetId, mark, code, used, limit]);
  return null;
}

const fill = (text: string, used: number, limit: number) => text.replace("{used}", String(used)).replaceAll("{limit}", String(limit));

/**
 * Wraps an SOP document (or, with `button={false}`, any other sheet). The text cannot be
 * selected or copied by hand; subscribers copy an SOP whole with its button, which takes one
 * copy from the month's allowance on the server first and adds the reader's invisible code.
 */
export function SopCopyLock({
  targetId,
  buyHref,
  plansHref,
  labels,
  quota,
  button = true,
  children,
}: {
  locked?: boolean;
  targetId: string;
  buyHref: string;
  plansHref: string;
  labels: Labels;
  quota?: QuotaLabels;
  button?: boolean;
  children: ReactNode;
}) {
  const [notice, setNotice] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const opened = useSyncExternalStore(subscribe, () => unlocked.get(targetId), () => undefined);

  // Page-wide guard: a selection that reaches into the document (Ctrl+A, long-press on a phone,
  // keyboard shortcuts) is cleared and the copy is cancelled.
  useEffect(() => {
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
      if (button) setNotice(true);
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
  }, [button]);

  const block = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (button) setNotice(true);
  };
  const doc = (
    <div
      ref={box}
      className="select-none"
      style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
      onCopy={block}
      onCut={block}
      onContextMenu={block}
      onDragStart={block}
    >
      <CopyableContext.Provider value={false}>{children}</CopyableContext.Provider>
    </div>
  );
  if (!button) return doc;
  if (opened && quota) {
    return (
      <>
        {doc}
        <QuotaCopyButton targetId={targetId} unlock={opened} labels={labels} quota={quota} />
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

function QuotaCopyButton({ targetId, unlock, labels, quota }: { targetId: string; unlock: Unlock; labels: Labels; quota: QuotaLabels }) {
  const [used, setUsed] = useState(unlock.used);
  const [state, setState] = useState<"idle" | "busy" | "done" | "full" | "failed">("idle");

  async function run() {
    const el = document.getElementById(targetId);
    if (!el || state === "busy") return;
    setState("busy");
    const text = el.innerText.trim();
    // The allowance is checked on the server before the text reaches the clipboard. The
    // clipboard write starts inside the click (Safari needs that) and waits for the answer.
    let answer: Awaited<ReturnType<typeof copySop>> | null = null;
    const blob = copySop(unlock.code).then((r) => {
      answer = r;
      if (r.limit) setUsed(r.used);
      if (!r.ok) {
        // Shown at once: some browsers never settle a clipboard write whose data was refused.
        setState(r.error ? "failed" : "full");
        throw new Error("quota");
      }
      return new Blob([watermark(text, unlock.mark)], { type: "text/plain" });
    });
    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })]);
      } else {
        await navigator.clipboard.writeText(await (await blob).text());
      }
      setState("done");
    } catch {
      await blob.catch(() => null);
      const r = answer as Awaited<ReturnType<typeof copySop>> | null;
      if (!r || r.ok) setState("failed");
    }
  }

  return (
    <div className="mt-6 space-y-2">
      <button
        type="button"
        onClick={run}
        disabled={state === "busy"}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-vault-900 transition hover:border-molecule-500 hover:text-molecule-700 disabled:opacity-60"
      >
        {state === "done" ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
        {state === "done" ? labels.copied : labels.copy}
      </button>
      <p className="text-xs text-muted">
        {fill(quota.count, used, unlock.limit)} · {quota.again}
      </p>
      {state === "full" && <p className="text-sm font-semibold text-red-700">{fill(quota.full, used, unlock.limit)}</p>}
      {state === "failed" && <p className="text-sm text-red-700">{quota.failed}</p>}
    </div>
  );
}
