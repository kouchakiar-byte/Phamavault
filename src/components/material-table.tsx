"use client";

import { useMemo, useState } from "react";
import type { rawMaterials as RawMaterialData } from "@/data";
import { copy } from "@/content/site";
import { pages } from "@/content/pages";
import type { Locale } from "@/i18n/config";
import { normalize } from "@/i18n/bi";
import { Count, Field, FilterBar, TableWrap } from "./filters";
import { Chip } from "./ui";

type Props = { locale: Locale; data: typeof RawMaterialData };

export function MaterialTable({ locale, data }: Props) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const t = pages.materials;
  const c = copy.common;

  const rows = useMemo(() => {
    const q = normalize(query);
    return data.items.filter(
      (r) => (!q || normalize(`${r.name} ${r.cas} ${r.synonyms}`).includes(q)) && (!group || r.group === group),
    );
  }, [data, query, group]);

  return (
    <>
      <FilterBar>
        <Field label={c.search[locale]} htmlFor="r-q">
          <input id="r-q" type="search" className="field-input" value={query} onChange={(e) => setQuery(e.target.value)} />
        </Field>
        <Field label={t.group[locale]} htmlFor="r-grp">
          <select id="r-grp" className="field-input" value={group} onChange={(e) => setGroup(e.target.value)}>
            <option value="">{t.allGroups[locale]}</option>
            {Object.entries(data.groups).map(([k, v]) => (
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
              <th>{t.group[locale]}</th>
              <th>{t.mw[locale]}</th>
              <th>{t.keyPoint[locale]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5}>{c.noMatch[locale]}</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.cas}>
                <td>
                  <span className="font-medium text-vault-900" dir="ltr">
                    {r.name}
                  </span>
                  <small className="block text-xs leading-relaxed text-muted">{r.synonyms}</small>
                </td>
                <td className="num">{r.cas}</td>
                <td>
                  <Chip>{data.groups[r.group]?.[locale] ?? r.group}</Chip>
                </td>
                <td className="num">{r.mw}</td>
                <td>{r.note[locale]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
    </>
  );
}
