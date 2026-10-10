"use client";

import type { ReactNode } from "react";
import { bi, type Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { copy } from "@/content/site";
import { BiTitle } from "../ui";

/* Shared building blocks for every calculator panel. */

export type Values = Record<string, string>;
export type Ctx = { locale: Locale; v: Values; set: (key: string, value: string) => void };

export const num = (s: string | undefined) => parseFloat(s ?? "");

// ---------- shared building blocks ----------

export function NumberInput({ ctx, id, label, readOnly = false }: { ctx: Ctx; id: string; label: Bi; readOnly?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted">
        {label[ctx.locale]}
      </label>
      <input
        id={id}
        type="number"
        step="any"
        className="field-input"
        value={ctx.v[id] ?? ""}
        readOnly={readOnly}
        onChange={(e) => ctx.set(id, e.target.value)}
      />
    </div>
  );
}

export type Preset = { label: Bi; values: string[] };

/** A select whose options fill (and lock) a set of number inputs, plus "custom". */
export function PresetSelect({ ctx, id, label, presets, targets }: { ctx: Ctx; id: string; label: Bi; presets: Preset[]; targets: string[] }) {
  const value = ctx.v[id] ?? "0";
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted">
        {label[ctx.locale]}
      </label>
      <select
        id={id}
        className="field-input"
        value={value}
        onChange={(e) => {
          ctx.set(id, e.target.value);
          const preset = presets[Number(e.target.value)];
          if (preset) targets.forEach((t, i) => ctx.set(t, preset.values[i]));
        }}
      >
        {presets.map((p, i) => (
          <option key={i} value={i}>
            {p.label[ctx.locale]}
          </option>
        ))}
        <option value="custom">{copy.common.custom[ctx.locale]}</option>
      </select>
    </div>
  );
}

export const isLocked = (ctx: Ctx, id: string) => (ctx.v[id] ?? "0") !== "custom";

export function Select({ ctx, id, label, options }: { ctx: Ctx; id: string; label: Bi; options: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted">
        {label[ctx.locale]}
      </label>
      <select id={id} className="field-input" value={ctx.v[id]} onChange={(e) => ctx.set(id, e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

/** A select with bilingual option labels. */
export function Choice({ ctx, id, label, options }: { ctx: Ctx; id: string; label: Bi; options: { value: string; label: Bi }[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted">
        {label[ctx.locale]}
      </label>
      <select id={id} className="field-input" value={ctx.v[id]} onChange={(e) => ctx.set(id, e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label[ctx.locale]}
          </option>
        ))}
      </select>
    </div>
  );
}

export type Result = { label: Bi; value: string; hidden?: boolean };

export function Panel({ ctx, title, form, results, message, note, children }: {
  ctx: Ctx;
  title: Bi;
  form: ReactNode;
  results: Result[];
  message?: string;
  note: Bi;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-card border border-line bg-white p-6">
      <BiTitle as="h2" text={title} locale={ctx.locale} className="text-xl font-bold text-vault-900" />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">{form}</div>
        <div className="flex h-fit flex-col gap-3 rounded-xl bg-vault-50 p-5">
          {results
            .filter((r) => !r.hidden)
            .map((r) => (
              <div key={r.label.en} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-2.5 text-sm text-muted">
                <span>{r.label[ctx.locale]}</span>
                <b className="font-mono text-base font-medium text-ink tabular-nums" dir="ltr">
                  {r.value}
                </b>
              </div>
            ))}
          <p className="min-h-5 text-sm text-warn" aria-live="polite">
            {message}
          </p>
        </div>
      </div>
      {children}
      <p className="text-sm text-muted">{note[ctx.locale]}</p>
    </div>
  );
}

export const DASH = "–";
export const bad = (ctx: Ctx) => copy.common.badInput[ctx.locale];

/** Parse a list of numbers typed with spaces, commas or new lines; Persian and Arabic digits are accepted. */
export function parseList(s: string | undefined): number[] {
  const latin = (s ?? "")
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/٫/g, ".");
  return latin
    .split(/[\s,;،]+/)
    .filter(Boolean)
    .map(Number);
}

/** A text area for a list of numbers. */
export function ListInput({ ctx, id, label, rows = 2 }: { ctx: Ctx; id: string; label: Bi; rows?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-muted">
        {label[ctx.locale]}
      </label>
      <textarea
        id={id}
        rows={rows}
        dir="ltr"
        className="field-input font-mono text-sm"
        value={ctx.v[id] ?? ""}
        onChange={(e) => ctx.set(id, e.target.value)}
      />
    </div>
  );
}

export const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** Sample standard deviation (n − 1). */
export function sd(xs: number[]) {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
}

export const listNote = bi(
  "Separate values with spaces, commas or new lines.",
  "مقادیر را با فاصله، ویرگول یا خط جدید از هم جدا کنید.",
);

/** Keep a Latin formula in left-to-right order inside Persian text. */
export const ltr = (s: string) => `⁦${s}⁩`;
