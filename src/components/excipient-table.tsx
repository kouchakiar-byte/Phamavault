"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, FileText } from "lucide-react";
import type { excipients as ExcipientData } from "@/data";
import { copy } from "@/content/site";
import { pages } from "@/content/pages";
import { excipientSheet } from "@/content/excipient-sheet";
import { excipientSlug } from "@/lib/excipient-slug";
import { href } from "@/lib/paths";
import { useUrlParam } from "@/lib/use-url-param";
import type { Locale } from "@/i18n/config";
import { normalize } from "@/i18n/bi";
import { Count, Field, FilterBar, TableWrap } from "./filters";
import { Chip } from "./ui";

type Props = { locale: Locale; data: typeof ExcipientData };
type Item = (typeof ExcipientData)["items"][number];

/** Where to read the full monograph and check the data, for one excipient. */
function sources(r: Item) {
  const t = pages.excipients.detail;
  return [
    {
      label: "Pharmaceutical Excipients (MedicinesComplete)",
      url: "https://www.medicinescomplete.com/",
      note: t.monograph,
    },
    {
      label: "Handbook of Pharmaceutical Excipients, 9th ed. (2020)",
      url: "https://pharmaceuticalpress.com/?p=2003",
      note: t.print,
    },
    {
      label: "WorldCat · ISBN 978-0-85711-375-7",
      url: "https://search.worldcat.org/search?q=bn%3A9780857113757",
      note: t.library,
    },
    {
      label: "PubChem",
      url: `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(/^\d{2,7}-\d{2}-\d$/.test(r.cas) ? r.cas : r.name)}`,
      note: t.pubchem,
    },
    {
      label: "FDA Inactive Ingredient Database",
      url: "https://www.accessdata.fda.gov/scripts/cder/iig/",
      note: t.iid,
    },
  ];
}

/** Links to the full monograph and data for one excipient. */
function SourceList({ r, locale, wide = false }: { r: Item; locale: Locale; wide?: boolean }) {
  return (
          <ul className={`mt-2 grid gap-2 ${wide ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
            {sources(r).map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 rounded-xl border border-line bg-white px-3 py-2 transition hover:border-molecule-500 hover:bg-molecule-50"
                >
                  <ExternalLink
                    className="mt-0.5 size-4 shrink-0 text-molecule-500"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-vault-900">
                      <bdi>{s.label}</bdi>
                    </span>
                    <span className="block text-xs leading-relaxed text-muted">
                      {s.note[locale].replace("{name}", r.name)}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
  );
}

function Detail({
  r,
  data,
  locale,
}: {
  r: Item;
  data: Props["data"];
  locale: Locale;
}) {
  const t = pages.excipients.detail;
  const rows = [
    {
      k: t.functions,
      v: r.functions.map((f) => data.functions[f]?.[locale] ?? f).join(locale === "fa" ? "، " : ", "),
    },
    { k: pages.excipients.useLevel, v: blank(r.useLevel) },
    {
      k: pages.excipients.form,
      v: r.forms.map((f) => data.forms[f]?.[locale] ?? f).join(locale === "fa" ? "، " : ", "),
    },
    { k: t.cas, v: blank(r.cas) },
    { k: t.synonyms, v: r.synonyms },
  ];
  return (
    <div className="grid gap-5 p-4 md:grid-cols-2">
      <dl className="space-y-2 text-sm">
        {rows.map(({ k, v }) => (
          <div key={k.en} className="flex gap-3">
            <dt className="w-36 shrink-0 font-bold text-vault-900">
              {k[locale]}
            </dt>
            <dd className="leading-relaxed text-ink">
              <bdi>{v}</bdi>
            </dd>
          </div>
        ))}
      </dl>
      <div>
        <Link
          href={href(locale, `excipients/${excipientSlug(r.name)}`)}
          className="mb-4 flex items-start gap-2.5 rounded-xl bg-vault-900 px-3.5 py-2.5 text-white transition hover:bg-vault-800"
        >
          <FileText className="mt-0.5 size-5 shrink-0 text-capsule-400" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-sm font-bold">{excipientSheet.open[locale]}</span>
            <span className="block text-xs leading-relaxed text-vault-100/75">{excipientSheet.openNote[locale]}</span>
          </span>
        </Link>
        <p className="text-sm font-bold text-vault-900">{t.read[locale]}</p>
        <SourceList r={r} locale={locale} />
      </div>
    </div>
  );
}

/** Empty cells stay empty rather than showing a dash. */
const blank = (v: string) => (v === "—" ? "" : v);

export function ExcipientTable({ locale, data }: Props) {
  const urlQuery = useUrlParam("q");
  const [typed, setQuery] = useState<string | null>(null);
  const query = typed ?? urlQuery;
  const [fn, setFn] = useState("");
  const [form, setForm] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [srcOpen, setSrcOpen] = useState<string | null>(null);
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
          <input
            id="e-q"
            type="search"
            className="field-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Field>
        <Field label={t.fn[locale]} htmlFor="e-fn">
          <select
            id="e-fn"
            className="field-input"
            value={fn}
            onChange={(e) => setFn(e.target.value)}
          >
            <option value="">{t.allFunctions[locale]}</option>
            {Object.entries(data.functions).map(([k, v]) => (
              <option key={k} value={k}>
                {v[locale]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.form[locale]} htmlFor="e-form">
          <select
            id="e-form"
            className="field-input"
            value={form}
            onChange={(e) => setForm(e.target.value)}
          >
            <option value="">{t.allForms[locale]}</option>
            {Object.entries(data.forms).map(([k, v]) => (
              <option key={k} value={k}>
                {v[locale]}
              </option>
            ))}
          </select>
        </Field>
      </FilterBar>
      <Count
        shown={rows.length}
        total={data.items.length}
        of={c.of[locale]}
        unit={c.records[locale]}
      />
      <TableWrap>
        <table className="db">
          <thead>
            <tr>
              <th>{c.name[locale]}</th>
              <th>CAS</th>
              <th>{t.fn[locale]}</th>
              <th>{t.useLevel[locale]}</th>
              <th>{t.form[locale]}</th>
              <th>{excipientSheet.column[locale]}</th>
              <th>{t.detail.read[locale]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7}>{c.noMatch[locale]}</td>
              </tr>
            )}
            {rows.map((r) => {
              const id = `${r.name}-${r.cas}`;
              const isOpen = open === id;
              return (
                <Fragment key={id}>
                  <tr>
                    <td>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : id)}
                        aria-expanded={isOpen}
                        className="inline-flex items-center gap-1 text-start font-medium text-molecule-700 underline-offset-2 hover:underline"
                      >
                        <bdi>{r.name}</bdi>
                        <ChevronDown
                          className={`size-4 shrink-0 transition ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                      <small className="block text-xs leading-relaxed text-muted">
                        {r.synonyms}
                      </small>
                    </td>
                    <td className="num text-[0.8rem]">{blank(r.cas)}</td>
                    <td>
                      {r.functions.map((k) => (
                        <Chip key={k}>{data.functions[k]?.[locale] ?? k}</Chip>
                      ))}
                    </td>
                    <td className="text-center text-xs leading-relaxed text-ink" dir="ltr" style={{ minWidth: "9rem" }}>
                      {blank(r.useLevel)}
                    </td>
                    <td>
                      {r.forms.map((k) => (
                        <Chip key={k}>{data.forms[k]?.[locale] ?? k}</Chip>
                      ))}
                    </td>
                    <td>
                      <Link
                        href={href(locale, `excipients/${excipientSlug(r.name)}`)}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-vault-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-vault-800"
                      >
                        <FileText className="size-3.5 text-capsule-400" aria-hidden="true" />
                        {excipientSheet.cell[locale]}
                      </Link>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSrcOpen(srcOpen === id ? null : id)}
                        aria-expanded={srcOpen === id}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-molecule-500/60 bg-molecule-50 px-3 py-1.5 text-xs font-semibold text-molecule-700 transition hover:bg-molecule-100"
                      >
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                        {excipientSheet.sourcesCell[locale]}
                        <ChevronDown className={`size-3.5 transition ${srcOpen === id ? "rotate-180" : ""}`} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                  {srcOpen === id && !isOpen && (
                    <tr>
                      <td colSpan={7} className="bg-vault-50 p-4">
                        <p className="text-sm font-bold text-vault-900">
                          <bdi>{r.name}</bdi> — {t.detail.read[locale]}
                        </p>
                        <SourceList r={r} locale={locale} wide />
                      </td>
                    </tr>
                  )}
                  {isOpen && (
                    <tr>
                      <td colSpan={7} className="bg-vault-50">
                        <Detail r={r} data={data} locale={locale} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </TableWrap>
    </>
  );
}
