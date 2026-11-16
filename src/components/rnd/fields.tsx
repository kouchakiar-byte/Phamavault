"use client";

/* Shared building blocks of the R&D workspace screens: fields that save on leaving them, panels and tags. */
import { useState, type ReactNode } from "react";
import { fromJalali, maskJalali, toJalali } from "@/lib/rnd/jalali";
import { T, UNITS, type Item, type Project, type Role, type Stage, type Unit } from "@/lib/rnd/model";
import type { Op } from "@/lib/rnd/server";
import { fmt } from "./charts";

export type Viewer = { role: Role; unit: Unit | null; name: string };

export const pill = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold";
export const btn = "inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-vault-900 transition hover:border-molecule-500 disabled:opacity-50";
export const inp = "w-full rounded-md border border-line bg-white px-2 py-1 text-sm focus:border-molecule-500 focus:outline-none disabled:bg-vault-50 disabled:text-muted";
export const panel = "min-w-0 rounded-card border border-line bg-white p-4 sm:p-5";
export const when = (d: number) => (d === 0 ? "امروز" : d < 0 ? `${-d} روز گذشته` : `${d} روز دیگر`);
export const tone = (d: number) => (d < 0 ? "border-red-300 bg-red-50" : d <= 3 ? "border-amber-300 bg-amber-50" : "border-line bg-white");

/**
 * A date, read and typed in the Solar Hijri calendar (1405/08/29) and stored as a Gregorian ISO date.
 * It saves when the field is left; a value that is not a real date is marked and not saved.
 */
export function DateCell({ value, onSave, disabled, label, className = "" }: { value: unknown; onSave: (v: string) => void; disabled?: boolean; label: string; className?: string }) {
  const iso = value ? String(value) : "", shown = toJalali(iso);
  const [bad, setBad] = useState(false);
  return (
    <input key={shown} className={`${inp} font-mono ${bad ? "!border-red-400 !text-red-700" : ""} ${className}`} dir="ltr" inputMode="numeric" defaultValue={shown} disabled={disabled}
      placeholder="تاریخ شمسی" aria-label={`${label} (تاریخ شمسی)`} aria-invalid={bad} title={bad ? "تاریخ معتبر نیست. نمونه: 1405/08/29" : "تاریخ شمسی: سال/ماه/روز"}
      onChange={(e) => { e.target.value = maskJalali(e.target.value); if (bad) setBad(false); }}
      onBlur={(e) => {
        const t = e.target.value.trim();
        if (t === shown) return;
        if (!t) return onSave("");
        const g = fromJalali(t);
        if (!g) return setBad(true);
        if (g === iso) e.target.value = shown; else onSave(g);
      }}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()} />
  );
}

/** A text field that saves when it loses focus (or on Enter), and only when its value changed. */
export function Cell({ value, onSave, type = "text", ltr, disabled, label, placeholder, className = "" }: { value: unknown; onSave: (v: string) => void; type?: string; ltr?: boolean; disabled?: boolean; label: string; placeholder?: string; className?: string }) {
  if (type === "date") return <DateCell value={value} onSave={onSave} disabled={disabled} label={label} className={className} />;
  const v = value == null ? "" : String(value);
  return (
    <input key={v} className={`${inp} ${className}`} type={type} dir={ltr || type === "number" ? "ltr" : undefined} defaultValue={v} disabled={disabled} aria-label={label} placeholder={placeholder}
      step={type === "number" ? "any" : undefined}
      onBlur={(e) => e.target.value !== v && onSave(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()} />
  );
}
/** A choice that saves on change. Options as a list keep their order (an object puts number-like keys first). */
export function Select({ value, options, onSave, disabled, label, className = "" }: { value: unknown; options: Record<string, string> | [string, string][]; onSave: (v: string) => void; disabled?: boolean; label: string; className?: string }) {
  return (
    <select className={`${inp} ${className}`} value={String(value ?? "")} disabled={disabled} aria-label={label} onChange={(e) => onSave(e.target.value)}>
      {(Array.isArray(options) ? options : Object.entries(options)).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
    </select>
  );
}
export function Panel({ title, aside, children, className = "" }: { title: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`${panel} ${className}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-vault-900">{title}</h2>
        {aside && <div className="text-xs text-muted">{aside}</div>}
      </div>
      {children}
    </section>
  );
}
export const UnitTag = ({ u }: { u: Unit }) => <span className={`${pill} bg-vault-50 text-vault-800`}>{UNITS[u]}</span>;

export type Ctx = { p: Project; viewer: Viewer; mine: (u: Unit) => boolean; send: (ops: Op[]) => Promise<void>; gateHref?: (stage: string) => string };

export function Comments({ it, s, ctx }: { it: Item; s: Stage; ctx: Ctx }) {
  const [text, setText] = useState("");
  const can = ctx.viewer.role !== "member" || ctx.viewer.unit === it.unit;
  return (
    <div className="mt-2 rounded-md bg-paper p-2">
      {(it.comments ?? []).map((c, i) => (
        <p key={i} className="mb-1.5 text-xs"><b>{T(c.name)}</b> <span className="text-muted">({c.unit} · {fmt(new Date(c.at).toISOString().slice(0, 10))})</span>: {T(c.text)}</p>
      ))}
      {!(it.comments ?? []).length && <p className="mb-1.5 text-xs text-muted">یادداشتی ثبت نشده است.</p>}
      {can && (
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { ctx.send([{ op: "comment", stage: s.key, item: it.id, text }]); setText(""); } }}>
          <input className={inp} value={text} onChange={(e) => setText(e.target.value)} placeholder="یادداشت، نتیجه یا مشکل این کار…" aria-label="یادداشت" />
          <button className={btn} type="submit">ثبت</button>
        </form>
      )}
    </div>
  );
}

