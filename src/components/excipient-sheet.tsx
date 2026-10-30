"use client";

import { useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { EyeOff } from "lucide-react";
import { excipientSheet as copy } from "@/content/excipient-sheet";
import { LogoMark } from "./logo";
import { VaultWord } from "./brand";
import { CopyableContext } from "./sop-copy-lock";

const stamp = () =>
  new Date().toLocaleString("fa-IR-u-nu-latn", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });

/** Tiled diagonal text: the site, the viewer's account code and the time of viewing. */
function viewerWatermark(text: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='340' height='200'><text x='170' y='100' transform='rotate(-24 170 100)' text-anchor='middle' font-family='Arial' font-size='13' font-weight='700' fill='#0b1f3a' fill-opacity='0.075'>${text}</text></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * A data sheet laid out like a printed A4 page, for viewing on the site only:
 * text cannot be selected or copied, the context menu, saving and printing
 * are blocked, and a faint PharmaVault mark sits under the content.
 *
 * Screenshots cannot be blocked by any web page, so the sheet makes them
 * hard and traceable instead: it blurs the moment a screenshot shortcut
 * starts (Win/⌘ key, PrintScreen), when the window loses focus (Snipping
 * Tool, app switcher, another window) or when the page is hidden, and every
 * view carries the viewer's account code and the time.
 *
 * `copyable` lets a subscriber select and copy the text; the shield, the
 * watermarks and the print block stay on.
 */
export function SheetPage({
  children,
  locale,
  printBlocked,
  copyable: copyableProp = false,
}: {
  children: ReactNode;
  locale: "fa" | "en";
  printBlocked: string;
  copyable?: boolean;
}) {
  // A sheet inside an unlocked <SopCopyLock> (subscriber) can be copied too.
  const copyable = useContext(CopyableContext) || copyableProp;
  const [shielded, setShielded] = useState(false);
  const [mark, setMark] = useState(`pharmavault.ir · ${stamp()}`);
  const article = useRef<HTMLElement>(null);

  useEffect(() => {
    let release: ReturnType<typeof setTimeout> | undefined;
    // Toggle the class at once (a capture may start before React re-renders), then sync state.
    const shield = (on: boolean) => {
      article.current?.classList.toggle("pv-shielded", on);
      setShielded(on);
    };
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (copyable ? ["s", "p"] : ["s", "p", "c", "a", "x"]).includes(k)) e.preventDefault();
      // Win+Shift+S, ⌘+Shift+3/4/5 and PrintScreen all start with one of these keys.
      if (e.key === "Meta" || e.key === "OS" || e.key === "PrintScreen" || (e.metaKey && e.shiftKey)) {
        clearTimeout(release);
        shield(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        // Windows copies the screen to the clipboard: replace it.
        navigator.clipboard?.writeText("pharmavault.ir").catch(() => {});
      }
      if (e.key === "Meta" || e.key === "OS" || e.key === "PrintScreen") {
        clearTimeout(release);
        release = setTimeout(() => document.hasFocus() && shield(false), 1500);
      }
    };
    const onBlur = () => shield(true);
    const onVisibility = () => document.visibilityState === "hidden" && shield(true);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);

    // The viewer's account code, when signed in.
    fetch("/api/viewer")
      .then((r) => r.json() as Promise<{ tag: string | null }>)
      .then(({ tag }) => tag && setMark(`pharmavault.ir · ${tag} · ${stamp()}`))
      .catch(() => {});

    return () => {
      clearTimeout(release);
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [copyable]);

  const unshield = () => {
    article.current?.classList.remove("pv-shielded");
    setShielded(false);
  };
  const block = (e: { preventDefault: () => void }) => e.preventDefault();
  return (
    <>
      <p className="pv-sheet-print-note hidden">{printBlocked}</p>
      <article
        ref={article}
        className={`pv-sheet relative mx-auto w-full max-w-[210mm] overflow-hidden rounded-sm bg-white text-ink shadow-xl shadow-vault-900/15 ring-1 ring-line ${copyable ? "pv-sheet-copyable" : "select-none"}`}
        lang={locale}
        onContextMenu={copyable ? undefined : block}
        onCopy={copyable ? undefined : block}
        onCut={copyable ? undefined : block}
        onDragStart={block}
      >
        {/* Watermark: a faint tiled mark with a larger one in the middle */}
        <div aria-hidden="true" className="pv-sheet-watermark pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
          <LogoMark className="size-[60%] max-h-[26rem] opacity-[0.045]" />
        </div>
        <div className="pv-sheet-content relative">{children}</div>
        {/* The viewer's own mark, above the text so it shows in any capture */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10" style={{ backgroundImage: viewerWatermark(mark) }} />
        {shielded && (
          <button
            type="button"
            onClick={unshield}
            className="absolute inset-0 z-20 flex flex-col items-center justify-start gap-3 bg-white/40 px-6 pt-40 text-center text-sm font-bold text-vault-900"
          >
            <EyeOff className="size-8 text-molecule-600" aria-hidden="true" />
            {copy.shield[locale]}
          </button>
        )}
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
        <p className="hidden font-bold text-vault-900 sm:block">{docTitle}</p>
        <p className="mt-1 font-mono text-molecule-700">pharmavault.ir</p>
      </div>
    </header>
  );
}
