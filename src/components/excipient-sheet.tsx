"use client";

import { useEffect, type ReactNode } from "react";
import { LogoMark } from "./logo";
import { VaultWord } from "./brand";

/**
 * A data sheet laid out like a printed A4 page, for viewing on the site only:
 * text cannot be selected or copied, the context menu, saving and printing
 * are blocked, and a faint PharmaVault mark sits under the content.
 */
export function SheetPage({ children, locale, printBlocked }: { children: ReactNode; locale: "fa" | "en"; printBlocked: string }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "c", "a", "x"].includes(k)) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const block = (e: { preventDefault: () => void }) => e.preventDefault();
  return (
    <>
      <p className="pv-sheet-print-note hidden">{printBlocked}</p>
      <article
        className="pv-sheet relative mx-auto w-full max-w-[210mm] select-none overflow-hidden rounded-sm bg-white text-ink shadow-xl shadow-vault-900/15 ring-1 ring-line"
        lang={locale}
        onContextMenu={block}
        onCopy={block}
        onCut={block}
        onDragStart={block}
      >
        {/* Watermark: a faint tiled mark with a larger one in the middle */}
        <div aria-hidden="true" className="pv-sheet-watermark pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
          <LogoMark className="size-[60%] max-h-[26rem] opacity-[0.045]" />
        </div>
        <div className="relative">{children}</div>
      </article>
    </>
  );
}

export function SheetHeader({ docTitle }: { docTitle: string }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b-2 border-molecule-500 px-6 py-4 sm:px-10" dir="ltr">
      <div className="flex items-center gap-3">
        <LogoMark tight className="h-14 w-auto shrink-0" />
        <div className="leading-tight">
          <p className="text-xl font-bold tracking-tight text-vault-900" style={{ fontFamily: "var(--font-plex-sans)" }}>
            Pharma
            <VaultWord onLight />
          </p>
          <p className="text-sm font-bold text-molecule-700" dir="rtl" style={{ textAlign: "left" }}>
            گنجینه اطلاعات داروسازی
          </p>
          <p className="text-[0.7rem] font-semibold text-vault-800" style={{ fontFamily: "var(--font-plex-sans)" }}>
            The Pharmaceutical Information Vault
          </p>
        </div>
      </div>
      <div className="text-end text-xs">
        <p className="hidden font-semibold text-vault-900 sm:block">{docTitle}</p>
        <p className="mt-1 font-mono text-molecule-700">pharmavault.ir</p>
      </div>
    </header>
  );
}
