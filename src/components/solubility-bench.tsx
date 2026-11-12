"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { solubilityCopy as t, solubilityTerms, termFor } from "@/content/solubility";
import type { Bi } from "@/i18n/bi";
import { normalize } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { isolateText } from "@/lib/bidi";
import { formatNumber } from "@/lib/format";
import { href } from "@/lib/paths";
import { useGuestGate } from "@/lib/use-guest-use";
import { useUrlParam } from "@/lib/use-url-param";
import { Field } from "./filters";
import { GuestLimit } from "./guest-limit";

export type SolubilityEntry = {
  name: string;
  cas: string;
  syn: string;
  kind: "api" | "exc";
  bcs?: string;
  cid?: number;
  /** Water solubility parsed from statement s[w.i]. */
  w?: { mg: number; t: number | null; est: boolean; src: string; i: number };
  /** [statement, source code] pairs, quoted as published. */
  s?: [string, string][];
  /** Solubility from the excipient monograph, and its page. */
  mono?: Bi;
  slug?: string;
};

const LIMIT = 30;

/** mg/mL with three significant figures; very small values in scientific notation. */
function mgText(v: number) {
  if (v === 0) return "0";
  if (v < 0.001) {
    const [m, e] = v.toExponential(2).split("e");
    return `${m} × 10^${Number(e)}`;
  }
  return String(Number(v.toPrecision(3)));
}

export function SolubilityBench({ locale, entries, accessed }: { locale: Locale; entries: SolubilityEntry[]; accessed: string }) {
  const initial = useUrlParam("q");
  const [query, setQuery] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const q = query ?? initial;

  const keyed = useMemo(() => entries.map((e) => ({ e, key: normalize(`${e.name} ${e.cas} ${e.syn}`) })), [entries]);
  const matches = useMemo(() => {
    const n = normalize(q);
    if (n.length < 2) return [];
    const hits = keyed.filter((k) => k.key.includes(n)).map((k) => k.e);
    // names that start with the query first, then materials with data
    const starts = (e: SolubilityEntry) => (normalize(e.name).startsWith(n) ? 0 : 1);
    const has = (e: SolubilityEntry) => (e.s?.length || e.mono ? 0 : 1);
    return hits.sort((a, b) => starts(a) - starts(b) || has(a) - has(b) || a.name.localeCompare(b.name));
  }, [keyed, q]);

  // the one the user picked; else a single match, or one whose name (or a synonym) is exactly the query
  const exact = (e: SolubilityEntry) => [e.name, e.cas, ...e.syn.split(/[,،]\s*/)].some((x) => x && normalize(x) === normalize(q));
  const selected =
    matches.find((e) => e.name === picked) ?? (matches.length === 1 ? matches[0] : matches.filter(exact).length === 1 ? matches.find(exact) : undefined);
  const gate = useGuestGate("materials", selected ? `solubility:${selected.name}` : null);

  return (
    <div className="space-y-10">
      <section>
        <Field label={t.search[locale]} htmlFor="sol-q">
          <input
            id="sol-q"
            type="search"
            className="field-input"
            value={q}
            placeholder={t.searchHint[locale]}
            onChange={(e) => {
              setQuery(e.target.value);
              setPicked(null);
            }}
          />
        </Field>
        {normalize(q).length >= 2 && (
          <div className="mt-4">
            {matches.length === 0 ? (
              <p className="text-sm text-muted">{t.noMatch[locale]}</p>
            ) : (
              <>
                <p className="mb-2 text-sm text-muted">{t.results[locale].replace("{n}", formatNumber(matches.length, locale))}</p>
                {matches.length > 1 && (
                  <ul className="flex flex-wrap gap-2">
                    {matches.slice(0, LIMIT).map((e) => (
                      <li key={`${e.kind}:${e.name}`}>
                        <button
                          type="button"
                          onClick={() => setPicked(e.name)}
                          className={`rounded-full border px-3 py-1.5 text-sm transition ${
                            selected?.name === e.name
                              ? "border-molecule-500 bg-molecule-50 font-semibold text-molecule-700"
                              : "border-line text-vault-900 hover:border-molecule-500"
                          } ${e.s?.length || e.mono ? "" : "opacity-60"}`}
                        >
                          <bdi>{e.name}</bdi>
                          <span className="ms-1.5 text-xs text-muted">{e.kind === "api" ? t.api[locale] : t.excipient[locale]}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}
        {selected && (gate === "blocked" ? <div className="mt-6"><GuestLimit locale={locale} /></div> : gate === "open" && <Card entry={selected} locale={locale} />)}
      </section>
      <Terms locale={locale} />
      <Sources locale={locale} accessed={accessed} />
    </div>
  );
}

function Card({ entry: e, locale }: { entry: SolubilityEntry; locale: Locale }) {
  const term = e.w ? termFor(e.w.mg) : null;
  const empty = !e.s?.length && !e.mono;
  return (
    <article className="mt-6 rounded-card border border-molecule-400/60 bg-white p-5 shadow-sm sm:p-6">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-xl font-bold text-vault-900">
          <bdi>{e.name}</bdi>
        </h2>
        {e.cas && (
          <span className="font-mono text-sm text-muted" dir="ltr">
            CAS {e.cas}
          </span>
        )}
        <span className="rounded-full bg-vault-50 px-2.5 py-0.5 text-xs font-semibold text-vault-800">{e.kind === "api" ? t.api[locale] : t.excipient[locale]}</span>
        {e.bcs && <span className="rounded-full bg-capsule-50 px-2.5 py-0.5 text-xs font-semibold text-capsule-700">{isolateText(t.bcs[locale].replace("{c}", e.bcs))}</span>}
      </header>

      {empty && <p className="mt-4 text-sm leading-relaxed text-muted">{t.noData[locale]}</p>}

      {e.w && term && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-vault-50 p-4">
            <p className="text-sm text-muted">{t.water[locale]}</p>
            <p className="mt-1 text-2xl font-bold text-vault-900" dir="ltr" style={{ textAlign: locale === "fa" ? "right" : "left" }}>
              {mgText(e.w.mg)} mg/mL
            </p>
            <p className="mt-1 text-xs text-muted">
              {e.w.t !== null ? isolateText(t.at[locale].replace("{t}", String(e.w.t))) : t.noTemp[locale]}
              {" · "}
              {e.w.src}
              {e.w.est && ` · ${t.estimated[locale]}`}
            </p>
          </div>
          <div className="rounded-lg bg-molecule-50 p-4">
            <p className="text-sm text-muted">{t.term[locale]}</p>
            <p className="mt-1 text-2xl font-bold text-molecule-700">
              <bdi>{term.term.en}</bdi>
            </p>
            <p className="mt-1 text-xs text-muted">
              {term.term.fa}
              {" · "}
              {isolateText(t.converterResult[locale].replace("{p}", formatParts(term.parts)))}
            </p>
          </div>
        </div>
      )}

      {e.mono && (
        <div className="mt-5">
          <h3 className="text-sm font-bold text-vault-900">{t.monograph[locale]}</h3>
          <p className="mt-2 leading-relaxed text-ink">{isolateText(e.mono[locale])}</p>
          {e.slug && (
            <a href={href(locale, `excipients/${e.slug}`)} className="mt-2 inline-block text-sm font-semibold text-molecule-700 hover:underline">
              {t.openMonograph[locale]}
            </a>
          )}
        </div>
      )}

      {!!e.s?.length && (
        <div className="mt-5">
          <h3 className="text-sm font-bold text-vault-900">{t.statements[locale]}</h3>
          <p className="mt-1 text-xs text-muted">{t.statementsNote[locale]}</p>
          <ul className="mt-3 space-y-2" dir="ltr">
            {e.s.map(([text, src], i) => (
              <li
                key={i}
                className={`rounded-lg border px-3 py-2 text-sm leading-relaxed text-ink ${e.w?.i === i ? "border-molecule-400 bg-molecule-50/50" : "border-line"}`}
              >
                {text} <span className="ms-1 text-xs font-semibold text-muted">[{src}]</span>
              </li>
            ))}
          </ul>
          {e.cid && (
            <a
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${e.cid}#section=Solubility`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-molecule-700 hover:underline"
            >
              {t.pubchem[locale]} <bdi dir="ltr">CID {e.cid}</bdi>
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}

function formatParts(p: number) {
  if (p >= 100) return Math.round(p).toLocaleString("en-US");
  return String(Number(p.toPrecision(2)));
}

function Terms({ locale }: { locale: Locale }) {
  const [mg, setMg] = useState("");
  const v = Number(mg);
  const hit = mg.trim() && v > 0 && Number.isFinite(v) ? termFor(v) : null;
  return (
    <section>
      <h2 className="text-lg font-bold text-vault-900">{t.termsTitle[locale]}</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">{t.termsNote[locale]}</p>
      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="w-56">
          <Field label={t.converterLabel[locale]} htmlFor="sol-mg">
            <input id="sol-mg" type="number" min="0" step="any" inputMode="decimal" dir="ltr" className="field-input" value={mg} onChange={(e) => setMg(e.target.value)} />
          </Field>
        </div>
        {hit && (
          <p className="pb-2 text-sm text-ink">
            <bdi className="font-bold text-molecule-700">{hit.term.en}</bdi> ({hit.term.fa}) · {isolateText(t.converterResult[locale].replace("{p}", formatParts(hit.parts)))}
          </p>
        )}
      </div>
      <div className="mt-4 overflow-x-auto rounded-card border border-line">
        <table className="w-full text-sm">
          <thead className="bg-vault-50 text-start text-vault-900">
            <tr>
              <th className="px-4 py-2.5 text-start font-semibold">{t.colTerm[locale]}</th>
              <th className="px-4 py-2.5 text-start font-semibold">{t.colParts[locale]}</th>
              <th className="px-4 py-2.5 text-start font-semibold">{t.colMg[locale]}</th>
            </tr>
          </thead>
          <tbody>
            {solubilityTerms.map((s) => (
              <tr key={s.en} className={`border-t border-line ${hit?.term.en === s.en ? "bg-molecule-50" : ""}`}>
                <td className="px-4 py-2.5">
                  <bdi className="font-semibold text-vault-900">{s.en}</bdi>
                  <span className="ms-2 text-muted">{s.fa}</span>
                </td>
                <td className="px-4 py-2.5 font-mono" dir="ltr" style={{ textAlign: locale === "fa" ? "right" : "left" }}>
                  {s.parts}
                </td>
                <td className="px-4 py-2.5 font-mono" dir="ltr" style={{ textAlign: locale === "fa" ? "right" : "left" }}>
                  {s.mg}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Sources({ locale, accessed }: { locale: Locale; accessed: string }) {
  return (
    <section className="text-sm text-muted">
      <h2 className="font-bold text-vault-900">{t.sources[locale]}</h2>
      <ul className="mt-2 list-disc space-y-1 ps-5" dir="ltr">
        {Object.values(t.sourceList).map((s) => (
          <li key={s}>{s}</li>
        ))}
        <li>United States Pharmacopeia, General Notices 5.30 (Description and Solubility); European Pharmacopoeia, General Notices 1.4 (Monographs, Solubility).</li>
      </ul>
      <p className="mt-2">{isolateText(t.accessed[locale].replace("{d}", accessed))}</p>
    </section>
  );
}
