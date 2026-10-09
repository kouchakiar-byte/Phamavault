"use client";

import { useMemo, useState } from "react";
import type { excipients as ExcipientData } from "@/data";
import { copy } from "@/content/site";
import { pages } from "@/content/pages";
import type { Locale } from "@/i18n/config";
import { normalize } from "@/i18n/bi";
import { Count, Field, FilterBar, TableWrap } from "./filters";
import { Chip } from "./ui";

type Props = { locale: Locale; data: typeof ExcipientData };

export function ExcipientTable({ locale, data }: Props) {
  const [query, setQuery] = useState("");
  const [fn, setFn] = useState("");
  const [form, setForm] = useState("");
  const t = pages.excipients;
  const c = copy.common;

  const rows = useMemo(() => {
    const q = normalize(query);
    return data.items.filter(
      (r) =>
        (!q || normalize(`${r.name} ${r.cas} ${r.synonyms}`).includes(q)) &&
        (!fn || r.functions.includes(fn)) &&
        (!form || r.forms.includes(form)),
    );
  }, [data, query, fn, form]);

  return (
    <>
      <FilterBar>
        <Field label={c.search[locale]} htmlFor="e-q">
          <input id="e-q" type="search" className="field-input" value={query} onChange={(e) => setQuery(e.target.value)} />
        </Field>
        <Field label={t.fn[locale]} htmlFor="e-fn">
          <select id="e-fn" className="field-input" value={fn} onChange={(e) => setFn(e.target.value)}>
            <option value="">{t.allFunctions[locale]}</option>
            {Object.entries(data.functions).map(([k, v]) => (
              <option key={k} value={k}>
                {v[locale]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.form[locale]} htmlFor="e-form">
          <select id="e-form" className="field-input" value={form} onChange={(e) => setForm(e.target.value)}>
            <option value="">{t.allForms[locale]}</option>
            {Object.entries(data.forms).map(([k, v]) => (
              <option key={k} value={k}>
                {v[locale]}
              </option>
            ))}
          </select>
        </Field>
      </FilterBar>
      <Count shown={rows.length} total={data.items.length} of={c.of[locale]} unit={c.records[locale]} />
      <TableWrap>
        <table className="db">
          <thead>
            <tr>
              <th>{c.name[locale]}</th>
              <th>CAS</th>
              <th>{t.fn[locale]}</th>
              <th>{t.useLevel[locale]}</th>
              <th>{t.form[locale]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5}>{c.noMatch[locale]}</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={`${r.name}-${r.cas}`}>
                <td>
                  <span className="font-medium text-vault-900" dir="ltr">
                    {r.name}
                  </span>
                  <small className="block text-xs leading-relaxed text-muted">{r.synonyms}</small>
                </td>
                <td className="num">{r.cas}</td>
                <td>
                  {r.functions.map((k) => (
                    <Chip key={k}>{data.functions[k]?.[locale] ?? k}</Chip>
                  ))}
                </td>
                <td className="num">{r.useLevel}</td>
                <td>
                  {r.forms.map((k) => (
                    <Chip key={k}>{data.forms[k]?.[locale] ?? k}</Chip>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
    </>
  );
}
