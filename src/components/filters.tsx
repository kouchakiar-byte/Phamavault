import type { ReactNode } from "react";

export function FilterBar({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex flex-wrap gap-4">{children}</div>;
}

export function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-[1_1_200px] flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TableWrap({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto rounded-card border border-line">{children}</div>;
}

export function Count({ shown, total, of, unit }: { shown: number; total: number; of: string; unit: string }) {
  return (
    <p className="mb-2 text-sm text-muted" aria-live="polite">
      {shown} {of} {total} {unit}
    </p>
  );
}
