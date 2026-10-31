"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { watermark } from "@/lib/watermark";

/** `mark`: the reader's account id, hidden in the copied text (see lib/watermark). */
type Props = { targetId: string; label: string; doneLabel: string; mark?: number };

/** Copies the text content of the element with `targetId`. */
export function CopyButton({ targetId, label, doneLabel, mark }: Props) {
  const [done, setDone] = useState(false);

  async function copyText() {
    const el = document.getElementById(targetId);
    if (!el) return;
    try {
      const text = el.innerText.trim();
      await navigator.clipboard.writeText(mark === undefined ? text : watermark(text, mark));
      setDone(true);
    } catch {
      // Clipboard blocked: select the text so the reader can copy it manually.
      const range = document.createRange();
      range.selectNodeContents(el);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  return (
    <button
      type="button"
      onClick={copyText}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-vault-900 transition hover:border-molecule-500 hover:text-molecule-700"
    >
      {done ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      {done ? doneLabel : label}
    </button>
  );
}
