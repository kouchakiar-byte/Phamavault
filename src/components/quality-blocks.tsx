import { Check } from "lucide-react";
import { TableWrap } from "@/components/filters";
import { BiTitle } from "@/components/ui";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";

/*
 * Building blocks of the QA and QC reference pages: section titles with an
 * anchor, tables, check-mark lists, cards and numbered steps.
 */

const num = (n: number, locale: Locale) => n.toLocaleString(locale === "fa" ? "fa-IR-u-nu-latn" : "en-US");

export function SubTitle({ id, text, locale, lead }: { id?: string; text: Bi; locale: Locale; lead?: Bi }) {
  return (
    <div id={id} className="mb-5 mt-14 scroll-mt-24 first:mt-0">
      <BiTitle as="h2" text={text} locale={locale} className="text-2xl font-bold text-vault-900" />
      {lead && <p className="mt-2 max-w-3xl text-sm text-muted">{lead[locale]}</p>}
    </div>
  );
}

/** Links to the sections of a long page. */
export function JumpNav({ items, locale, label }: { items: { id: string; label: Bi }[]; locale: Locale; label: string }) {
  return (
    <nav className="mb-10 flex flex-wrap gap-2" aria-label={label}>
      {items.map((j) => (
        <a
          key={j.id}
          href={`#${j.id}`}
          className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm text-vault-900 hover:border-molecule-400 hover:text-molecule-700"
        >
          {j.label[locale]}
        </a>
      ))}
    </nav>
  );
}

/** A table from column labels and rows of cells (strings, or bilingual text). */
export function DataTable({ cols, rows, locale, mono = [] }: { cols: Bi[]; rows: (string | Bi)[][]; locale: Locale; mono?: number[] }) {
  return (
    <TableWrap>
      <table className="db">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c.en}>{c[locale]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) =>
                typeof cell === "string" ? (
                  <td key={j} className={j === 0 ? "font-bold text-vault-900" : mono.includes(j) ? "num" : ""} dir="ltr" style={{ textAlign: locale === "fa" ? "right" : "left" }}>
                    {cell}
                  </td>
                ) : (
                  <td key={j} className={j === 0 ? "font-medium text-vault-900" : "min-w-56 leading-relaxed"}>
                    {cell[locale]}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

export function Bullets({ items, locale, numbered = false }: { items: Bi[]; locale: Locale; numbered?: boolean }) {
  return (
    <ul className="space-y-2.5 rounded-card border border-line bg-white p-5">
      {items.map((b, i) => (
        <li key={b.en} className="flex gap-2.5 text-sm leading-relaxed text-ink">
          {numbered ? (
            <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-molecule-50 font-mono text-xs font-semibold text-molecule-700">
              {num(i + 1, locale)}
            </span>
          ) : (
            <Check className="mt-0.5 size-4 shrink-0 text-molecule-600" aria-hidden="true" />
          )}
          <span>{b[locale]}</span>
        </li>
      ))}
    </ul>
  );
}

export function Cards({ items, locale }: { items: { k: string; v: Bi; f?: string }[]; locale: Locale }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <div key={c.k} className="rounded-card border border-line bg-white p-5">
          <p className="font-bold text-vault-900" dir="auto" style={{ textAlign: "start" }}>
            {c.k}
          </p>
          {c.f && (
            <p className="mt-2 rounded-lg bg-vault-50 px-3 py-1.5 font-mono text-sm text-molecule-700" dir="ltr">
              {c.f}
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-muted">{c.v[locale]}</p>
        </div>
      ))}
    </div>
  );
}

/** Numbered steps of a procedure, as cards. */
export function Steps({ items, locale }: { items: { title: Bi; text: Bi }[]; locale: Locale }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((step, i) => (
        <li key={step.title.en} className="rounded-card border border-line bg-white p-6">
          <span className="flex size-9 items-center justify-center rounded-full bg-vault-900 font-mono text-sm font-semibold text-molecule-400">
            {num(i + 1, locale)}
          </span>
          <p className="mt-4 font-bold text-vault-900">{step.title[locale]}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{step.text[locale]}</p>
        </li>
      ))}
    </ol>
  );
}
