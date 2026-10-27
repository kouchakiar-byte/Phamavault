"use client";

import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, FileText } from "lucide-react";
import type { generalChapters as GeneralChaptersData } from "@/data";
import { copy } from "@/content/site";
import { generalChaptersPage as t } from "@/content/general-chapters";
import { chapterSlug } from "@/lib/chapter-slug";
import { href } from "@/lib/paths";
import { useUrlParam } from "@/lib/use-url-param";
import type { Locale } from "@/i18n/config";
import { normalize } from "@/i18n/bi";
import { Count, Field, FilterBar, TableWrap } from "./filters";
import { Chip } from "./ui";

/** `detailed`: keys ("USP <711>") of the chapters with a detailed PharmaVault sheet. */
type Props = { locale: Locale; data: typeof GeneralChaptersData; detailed: string[] };
type Ph = "USP" | "EP";

/** Searchable bank of USP–NF general chapters and Ph. Eur. / BP general methods. */
export function GeneralChaptersTable({ locale, data, detailed }: Props) {
  const full = useMemo(() => new Set(detailed), [detailed]);
  const urlQuery = useUrlParam("q");
  const urlPh = useUrlParam("ph");
  const [typed, setQuery] = useState<string | null>(null);
  const query = typed ?? urlQuery;
  const [pickedPh, setPh] = useState<string | null>(null);
  const ph = pickedPh ?? (urlPh === "USP" || urlPh === "EP" ? urlPh : "");
  const [cat, setCat] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const c = copy.common;

  // Only subjects that occur in the chosen pharmacopoeia are offered.
  const cats = useMemo(
    () => Object.keys(data.categories).filter((k) => data.items.some((r) => r.cat === k && (!ph || r.ph === ph))),
    [data, ph],
  );

  const rows = useMemo(() => {
    const q = normalize(query.replace(/[<>〈〉]/g, ""));
    const hits = data.items.filter((r) => (!ph || r.ph === ph) && (!cat || r.cat === cat));
    if (!q) return hits;
    // Chapter number first, then title, then a mention in another chapter's summary.
    const rank = (r: (typeof hits)[number]) => {
      const code = r.code.replace(/[<>]/g, "");
      if (code === q) return 0;
      if (code.startsWith(q)) return 1;
      if (normalize(`${r.en} ${r.fa}`).includes(q)) return 2;
      return normalize(`${r.s.en} ${r.s.fa}`).includes(q) ? 3 : -1;
    };
    return hits
      .map((r) => ({ r, k: rank(r) }))
      .filter((x) => x.k >= 0)
      .sort((a, b) => a.k - b.k)
      .map((x) => x.r);
  }, [data, query, ph, cat]);

  return (
    <>
      <FilterBar>
        <Field label={c.search[locale]} htmlFor="gc-q">
          <input
            id="gc-q"
            type="search"
            className="field-input"
            placeholder={t.placeholder[locale]}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Field>
        <Field label={t.pharmacopoeia[locale]} htmlFor="gc-ph">
          <select
            id="gc-ph"
            className="field-input"
            value={ph}
            onChange={(e) => {
              setPh(e.target.value);
              setCat("");
            }}
          >
            <option value="">{t.allPharmacopoeias[locale]}</option>
            {(Object.keys(t.ph) as Ph[]).map((k) => (
              <option key={k} value={k}>
                {t.ph[k][locale]}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.subject[locale]} htmlFor="gc-cat">
          <select id="gc-cat" className="field-input" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">{t.allSubjects[locale]}</option>
            {cats.map((k) => (
              <option key={k} value={k}>
                {data.categories[k][locale]}
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
              <th>{t.chapter[locale]}</th>
              <th>{t.titleCol[locale]}</th>
              <th>{t.subject[locale]}</th>
              <th>{t.sheet.open[locale]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4}>{c.noMatch[locale]}</td>
              </tr>
            )}
            {rows.map((r) => {
              const id = `${r.ph}${r.code}`;
              const isOpen = open === id;
              return (
                <Fragment key={id}>
                  <tr>
                    <td className="num">
                      <span className="block text-[0.7rem] font-semibold text-muted">{t.ph[r.ph][locale]}</span>
                      {r.code}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : id)}
                        aria-expanded={isOpen}
                        className="inline-flex items-start gap-1 text-start font-medium text-molecule-700 underline-offset-2 hover:underline"
                      >
                        <span dir="ltr" className="text-start">
                          {r.en}
                        </span>
                        <ChevronDown className={`mt-0.5 size-4 shrink-0 transition ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                      </button>
                      {locale === "fa" && <small className="block text-xs leading-relaxed text-muted">{r.fa}</small>}
                    </td>
                    <td>
                      <Chip>{data.categories[r.cat][locale]}</Chip>
                    </td>
                    <td>
                      <Link
                        href={href(locale, `references/general-chapters/${chapterSlug(r.ph, r.code)}`)}
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          full.has(`${r.ph} ${r.code}`)
                            ? "bg-vault-900 text-white hover:bg-vault-800"
                            : "border border-line bg-white text-vault-900 hover:border-molecule-500"
                        }`}
                      >
                        <FileText className={`size-3.5 ${full.has(`${r.ph} ${r.code}`) ? "text-capsule-400" : "text-molecule-600"}`} aria-hidden="true" />
                        {t.sheet.open[locale]}
                      </Link>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={4} className="bg-vault-50 p-4">
                        <p className="text-sm font-bold text-vault-900">
                          <bdi>
                            {t.ph[r.ph][locale]} {r.code}
                          </bdi>{" "}
                          — {r[locale === "fa" ? "fa" : "en"]}
                        </p>
                        <p className="mt-2 max-w-4xl text-sm leading-loose text-ink">{r.s[locale]}</p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          <li>
                            <Link
                              href={href(locale, `references/general-chapters/${chapterSlug(r.ph, r.code)}`)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-vault-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-vault-800"
                            >
                              <FileText className="size-3.5 text-capsule-400" aria-hidden="true" />
                              {t.sheet.openLong[locale]}
                            </Link>
                          </li>
                          {t.links[r.ph].map((l) => (
                            <li key={l.url}>
                              <a
                                href={l.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-full border border-molecule-500/60 bg-white px-3 py-1.5 text-xs font-semibold text-molecule-700 transition hover:bg-molecule-50"
                              >
                                <ExternalLink className="size-3.5" aria-hidden="true" />
                                {t.official[locale]}: <bdi>{l.label}</bdi>
                              </a>
                            </li>
                          ))}
                        </ul>
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
