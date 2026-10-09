"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Bi } from "@/i18n/bi";
import { normalize } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { copy } from "@/content/site";
import { pages } from "@/content/pages";
import { href } from "@/lib/paths";
import { Count, Field, FilterBar, TableWrap } from "./filters";

export type SopRow = { code: string; dep: string; title: Bi; covers: Bi; hasText: boolean };

type Props = { locale: Locale; rows: SopRow[]; departments: Record<string, Bi> };

export function SopTable({ locale, rows, departments }: Props) {
  const [query, setQuery] = useState("");
  const [dep, setDep] = useState("");
  const t = pages.qa;
  const c = copy.common;

  const shown = useMemo(() => {
    const q = normalize(query);
    return rows.filter(
      (r) =>
        (!dep || r.dep === dep) &&
        (!q || normalize(`${r.code} ${r.title.en} ${r.title.fa} ${r.covers.en} ${r.covers.fa}`).includes(q)),
    );
  }, [rows, query, dep]);

  return (
    <>
      <FilterBar>
        <Field label={c.search[locale]} htmlFor="q-q">
          <input id="q-q" type="search" className="field-input" value={query} onChange={(e) => setQuery(e.target.value)} />
        </Field>
        <Field label={t.department[locale]} htmlFor="q-dep">
          <select id="q-dep" className="field-input" value={dep} onChange={(e) => setDep(e.target.value)}>
            <option value="">{t.allDepartments[locale]}</option>
            {Object.entries(departments).map(([k, v]) => (
              <option key={k} value={k}>
                {v[locale]}
              </option>
            ))}
          </select>
        </Field>
      </FilterBar>
      <Count shown={shown.length} total={rows.length} of={c.of[locale]} unit={t.sops[locale]} />
      <TableWrap>
        <table className="db">
          <thead>
            <tr>
              <th>{t.code[locale]}</th>
              <th>{t.sopTitle[locale]}</th>
              <th>{t.covers[locale]}</th>
              <th>{t.department[locale]}</th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 && (
              <tr>
                <td colSpan={4}>{c.noMatch[locale]}</td>
              </tr>
            )}
            {shown.map((r) => (
              <tr key={r.code}>
                <td className="num">{r.code}</td>
                <td>
                  <span className="font-medium text-vault-900">{r.title[locale]}</span>
                  {r.hasText && (
                    <Link
                      href={href(locale, `qa/${r.code.toLowerCase()}`)}
                      className="mt-1 block text-xs font-semibold text-molecule-700 underline underline-offset-2 hover:text-molecule-600"
                    >
                      {t.fullText[locale]}
                    </Link>
                  )}
                </td>
                <td className="text-muted">{r.covers[locale]}</td>
                <td className="whitespace-nowrap">{departments[r.dep]?.[locale]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
    </>
  );
}
