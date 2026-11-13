import type { ReactNode } from "react";
import { PrintButton } from "@/components/account/print-button";

/**
 * Print rules shared by the project report and the weekly summary: only the sheet is printed,
 * on A4, with its colours (bars, health marks) kept. On screen the sheet is shown at A4 width.
 */
export function PrintStyle() {
  return (
    <style>{`.rnd-sheet { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
@media print {
  @page { size: A4; margin: 10mm; }
  html, body, main { min-height: 0 !important; height: auto !important; display: block !important; background: #fff !important; }
  body > *:not(main), .no-print { display: none !important; }
  .rnd-shell, .rnd-shell > div, .rnd-sheet-wrap { padding: 0 !important; margin: 0 !important; max-width: none !important; background: none !important; overflow: visible !important; }
  .rnd-sheet { border: 0 !important; border-radius: 0 !important; padding: 0 !important; max-width: none !important; width: auto !important; box-shadow: none !important; }
  .rnd-keep { break-inside: avoid; }
}`}</style>
  );
}

/** The bar above a sheet: where to go back to, optional choices, and the print button. */
export function SheetBar({ back, backLabel, children }: { back: string; backLabel: string; children?: ReactNode }) {
  return (
    <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
      <a href={back} className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-vault-900 hover:border-molecule-500">→ {backLabel}</a>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        <PrintButton label="چاپ یا ذخیره PDF" />
      </div>
    </div>
  );
}

/** An A4-wide sheet. `wide` is for a summary that may run over several pages. */
export function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="rnd-sheet-wrap overflow-x-auto">
      <article className="rnd-sheet mx-auto w-[794px] max-w-none rounded-card border border-line bg-white p-9 text-[11px] leading-[17px] text-ink shadow-sm">{children}</article>
    </div>
  );
}

export function SheetTitle({ children, aside }: { children: ReactNode; aside?: ReactNode }) {
  return (
    <h2 className="mb-1 flex items-baseline justify-between gap-2 border-b border-vault-900/20 pb-1 text-[12.5px] font-bold text-vault-900">
      <span>{children}</span>
      {aside && <span className="text-[10px] font-normal text-muted">{aside}</span>}
    </h2>
  );
}

export function Stat({ label, value, sub, tone = "" }: { label: string; value: ReactNode; sub?: ReactNode; tone?: "" | "ok" | "warn" | "bad" }) {
  const c = tone === "bad" ? "text-red-700" : tone === "warn" ? "text-amber-700" : tone === "ok" ? "text-emerald-700" : "text-vault-900";
  return (
    <div className="rounded-lg border border-line px-2.5 py-1">
      <div className="text-[10px] text-muted">{label}</div>
      <div className={`font-mono text-[16px] font-extrabold leading-5 ${c}`} dir="ltr" style={{ textAlign: "right" }}>{value}</div>
      {sub && <div className="text-[10px] text-muted">{sub}</div>}
    </div>
  );
}

export const when = (d: number) => (d === 0 ? "امروز" : d < 0 ? `${-d} روز گذشته` : `${d} روز دیگر`);
