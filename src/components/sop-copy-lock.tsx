"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Lock, X } from "lucide-react";
import { CopyButton } from "./copy-button";

type Labels = { copy: string; copied: string; title: string; text: string; buy: string; plans: string; close: string };

/**
 * Wraps an SOP document. For readers without a subscription, selecting and
 * copying the text is blocked and the copy button explains how to get access.
 */
export function SopCopyLock({
  locked,
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
  if (!locked) {
    return (
      <>
        {children}
        <div className="mt-6">
          <CopyButton targetId={targetId} label={labels.copy} doneLabel={labels.copied} />
        </div>
      </>
    );
  }
  const block = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setNotice(true);
  };
  return (
    <>
      <div className="select-none" onCopy={block} onCut={block} onContextMenu={block} onDragStart={block}>
        {children}
      </div>
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
