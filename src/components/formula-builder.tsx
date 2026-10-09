"use client";

import { useState } from "react";
import type { formulation as FormulationData } from "@/data";
import { copy } from "@/content/site";
import { pages } from "@/content/pages";
import type { Locale } from "@/i18n/config";
import { Field, FilterBar, TableWrap } from "./filters";
import { fixed } from "./calc-format";

type Props = { locale: Locale; data: typeof FormulationData };

/** Starting-formula builder: the null-percentage row is q.s. to 100%. */
export function FormulaBuilder({ locale, data }: Props) {
  const t = pages.formulation;
  const [index, setIndex] = useState(0);
  const [pcts, setPcts] = useState(() => data.templates[0].rows.map((r) => r.pct));
  const [batch, setBatch] = useState("100");

  const rows = data.templates[index].rows;
  const b = parseFloat(batch);
  const fixedPcts = rows.flatMap((r, j) => (r.pct === null ? [] : [pcts[j] ?? NaN]));
  const ok = b >= 0 && fixedPcts.every((p) => p >= 0);
  const sum = fixedPcts.reduce((s, p) => s + (p >= 0 ? p : 0), 0);
  const qs = 100 - sum;
  const valid = ok && qs >= 0;
  const message = !ok ? copy.common.badInput[locale] : qs < 0 ? t.over[locale] : "";

  function selectTemplate(i: number) {
    setIndex(i);
    setPcts(data.templates[i].rows.map((r) => r.pct));
  }

  return (
    <div className="rounded-card border border-line bg-white p-6">
      <FilterBar>
        <Field label={t.form[locale]} htmlFor="f-tpl">
          <select id="f-tpl" className="field-input" value={index} onChange={(e) => selectTemplate(Number(e.target.value))}>
            {data.templates.map((tpl, i) => (
              <option key={tpl.name.en} value={i}>
                {tpl.name[locale]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.batch[locale]} htmlFor="f-batch">
          <input
            id="f-batch"
            type="number"
            step="any"
            min="0"
            className="field-input"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
          />
        </Field>
      </FilterBar>
      <TableWrap>
        <table className="db">
          <thead>
            <tr>
              <th>{t.fn[locale]}</th>
              <th>{t.material[locale]}</th>
              <th>% w/w</th>
              <th>{t.kg[locale]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, j) => {
              const pc = r.pct === null ? qs : pcts[j];
              return (
                <tr key={`${index}-${j}`}>
                  <td>{data.functions[r.fn]?.[locale] ?? r.fn}</td>
                  <td dir={r.material ? "ltr" : undefined} className={r.material ? "text-start" : ""}>
                    {r.material ?? data.api[locale]}
                  </td>
                  <td className="num">
                    {r.pct === null ? (
                      <b>{valid ? `q.s.  ${fixed(qs)}%` : "–"}</b>
                    ) : (
                      <input
                        type="number"
                        step="any"
                        min="0"
                        aria-label="% w/w"
                        className="field-input max-w-28"
                        value={Number.isNaN(pcts[j]) ? "" : (pcts[j] ?? "")}
                        onChange={(e) =>
                          setPcts((prev) => prev.map((p, k) => (k === j ? parseFloat(e.target.value) : p)))
                        }
                      />
                    )}
                  </td>
                  <td className="num">{valid && pc !== null ? fixed((pc * b) / 100, 3) : "–"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>
      <p className="mt-3 min-h-5 text-sm text-warn" aria-live="polite">
        {message}
      </p>
      <p className="mt-2 text-sm text-muted">{t.note[locale]}</p>
    </div>
  );
}
