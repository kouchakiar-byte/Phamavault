"use client";

import { useMemo, useState } from "react";
import type { rawMaterials as RawMaterialData } from "@/data";
import { copy } from "@/content/site";
import { pages } from "@/content/pages";
import type { Locale } from "@/i18n/config";
import { normalize } from "@/i18n/bi";
import { formatNumber } from "@/lib/format";
import { Count, Field, FilterBar, TableWrap } from "./filters";
import { Chip } from "./ui";

/** C16H25N3O8S or C10H13NO4·1.5H2O: atom counts as subscripts, hydrate coefficients inline. */
function Formula({ value }: { value: string }) {
  return (
    <small className="block text-xs text-muted" dir="ltr">
      {value.split(/(?<=[A-Za-z)])(\d+)/).map((part, i) => (i % 2 ? <sub key={i}>{part}</sub> : part))}
    </small>
  );
}

/** Each synonym isolated, so Latin names with brackets or signs keep their order in Persian text. */
function Synonyms({ value, locale }: { value: string; locale: Locale }) {
  const list = value.split(/,\s*/).filter(Boolean);
  return (
    <small className="block text-xs leading-relaxed text-muted">
      {list.map((name, i) => (
        <span key={i}>
          <bdi>{name}</bdi>
          {i < list.length - 1 && (locale === "fa" ? "، " : ", ")}
        </span>
      ))}
    </small>
  );
}

type Props = { locale: Locale; data: typeof RawMaterialData };

/** Rows rendered at a time; the rest follow with "show more". */
const PAGE = 50;

export function MaterialTable({ locale, data }: Props) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [limit, setLimit] = useState(PAGE);
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
          <input id="r-q" type="search" className="field-input" value={query} onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE);
            }} />
        </Field>
        <Field label={t.group[locale]} htmlFor="r-grp">
          <select id="r-grp" className="field-input" value={group} onChange={(e) => {
              setGroup(e.target.value);
              setLimit(PAGE);
            }}>
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
            {rows.slice(0, limit).map((r) => (
              <tr key={r.cas}>
                <td>
                  <span className="font-medium text-vault-900" dir="ltr">
                    {r.name}
                  </span>
                  <Synonyms value={r.synonyms} locale={locale} />
                </td>
                <td className="num">{r.cas}</td>
                <td>
                  <Chip>{data.groups[r.group]?.[locale] ?? r.group}</Chip>
                </td>
                <td className="num">
                  {r.mw}
                  {r.formula && <Formula value={r.formula} />}
                </td>
                <td>{r.note[locale]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      {rows.length > limit && (
        <button type="button" className="mx-auto mt-4 flex rounded-lg border border-line px-5 py-2 text-sm font-medium text-vault-900 hover:border-molecule-500" onClick={() => setLimit((n) => n + PAGE)}>
          {t.showMore[locale].replace("{n}", formatNumber(Math.min(PAGE, rows.length - limit), locale))}
        </button>
      )}
    </>
  );
}
