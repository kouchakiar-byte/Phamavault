"use client";

import { useState } from "react";
import { copy } from "@/content/site";
import { pages } from "@/content/pages";
import type { Locale } from "@/i18n/config";
import { Field, FilterBar, TableWrap } from "./filters";

type Props = { locale: Locale; rows: { code: string; en: string; fa: string }[] };

export function IchTable({ locale, rows }: Props) {
  const [query, setQuery] = useState("");
  const t = pages.regulatory;
  const q = query.trim().toLowerCase();
  const shown = rows.filter((r) => !q || `${r.code} ${r.en} ${r.fa}`.toLowerCase().includes(q));

  return (
    <>
      <FilterBar>
        <Field label={copy.common.search[locale]} htmlFor="g-q">
          <input id="g-q" type="search" className="field-input" value={query} onChange={(e) => setQuery(e.target.value)} />
        </Field>
      </FilterBar>
      <TableWrap>
        <table className="db">
          <thead>
            <tr>
              <th>{t.code[locale]}</th>
              <th>{t.subject[locale]}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.code}>
                <td className="num">{r.code}</td>
                <td>{r[locale]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
    </>
  );
}
