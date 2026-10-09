"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import data from "@/data/suppliers.json";
import { pages } from "@/content/pages";
import type { Locale } from "@/i18n/config";
import {
  norm,
  prepare,
  search,
  type Filters,
  type Product,
  type SortKey,
  type Supplier,
  type SupplierRecord,
} from "@/lib/supplier-search";
import { BiTitle } from "./ui";

const t = pages.suppliers;
const suppliers = prepare(data.companies as SupplierRecord[]);
const synonyms = data.synonyms.map((g) => g.map(norm));
const totalProducts = suppliers.reduce((n, s) => n + s.products.length, 0);

const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

/** Like `fill`, but isolates the query so mixed Persian/Latin text keeps its order. */
function fillQuery(template: string, query: string, vars: Record<string, string | number> = {}): ReactNode[] {
  return template.split(/(\{q\})/).map((part, i) => (part === "{q}" ? <bdi key={i}>{query}</bdi> : fill(part, vars)));
}

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];

/** Only http(s) links from the data become anchors. */
const safeUrl = (url: string | undefined) => (url && /^https?:\/\//.test(url) ? url : undefined);

export function SupplierBank({ locale }: { locale: Locale }) {
  const [filters, setFilters] = useState<Filters>({ query: "", type: "all", cat: "all", sort: "cred", telOnly: false });
  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));

  const results = useMemo(() => search(suppliers, filters, synonyms, data.provinceOrder), [filters]);
  const q = norm(filters.query);
  const withTel = results.filter((r) => r.s.tel.length).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Search bench */}
      <section aria-label={t.activity[locale]} className="flex flex-col gap-4 rounded-card border border-line bg-white p-5">
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              aria-label={t.title[locale]}
              placeholder={t.placeholder[locale]}
              autoComplete="off"
              className="field-input py-3 ps-11 text-base"
              value={filters.query}
              onChange={(e) => set({ query: e.target.value })}
            />
          </div>
          <button
            type="button"
            onClick={() => set({ query: "" })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-4 text-sm font-medium text-vault-900 hover:border-molecule-500"
          >
            <X className="size-4" aria-hidden="true" />
            {t.clear[locale]}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm text-muted">{t.examples[locale]}</span>
          {t.exampleQueries.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => set({ query: ex })}
              className="rounded-full border border-line px-3 py-0.5 text-sm text-molecule-700 hover:bg-molecule-50"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div role="group" aria-label={t.activity[locale]} className="flex flex-wrap gap-1">
            {(["all", "m", "t"] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={filters.type === k}
                onClick={() => set({ type: k })}
                className="rounded-lg border border-line px-3 py-1 text-sm text-ink transition aria-pressed:border-molecule-600 aria-pressed:bg-molecule-600 aria-pressed:text-white"
              >
                {t.types[k][locale]}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            {t.category[locale]}
            <select className="field-input w-auto py-1 text-sm" value={filters.cat} onChange={(e) => set({ cat: e.target.value })}>
              {Object.entries(t.categories).map(([k, v]) => (
                <option key={k} value={k}>
                  {v[locale]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            {t.sort[locale]}
            <select
              className="field-input w-auto py-1 text-sm"
              value={filters.sort}
              onChange={(e) => set({ sort: e.target.value as SortKey })}
            >
              {Object.entries(t.sorts).map(([k, v]) => (
                <option key={k} value={k}>
                  {v[locale]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              className="size-4 accent-molecule-600"
              checked={filters.telOnly}
              onChange={(e) => set({ telOnly: e.target.checked })}
            />
            {t.telOnly[locale]}
          </label>
        </div>
      </section>

      <p className="text-sm text-muted tabular-nums" aria-live="polite">
        {q
          ? fillQuery(t.countQuery[locale], filters.query, { n: results.length, t: withTel })
          : fill(t.countAll[locale], { n: results.length, p: totalProducts })}
      </p>

      {results.length === 0 ? (
        <p className="rounded-card border border-dashed border-line bg-white p-6 text-muted">
          {fillQuery(t.empty[locale], filters.query)}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map(({ s, hits }) => (
            <SupplierCard key={s.n} s={s} hits={hits} locale={locale} query={q ? filters.query : ""} />
          ))}
        </div>
      )}

      <section className="mt-4 border-t border-line pt-6 text-sm leading-relaxed text-muted">
        <BiTitle as="h2" text={t.orderTitle} locale={locale} className="mb-1 text-base font-bold text-ink" />
        <p>{t.orderText[locale]}</p>
        <BiTitle as="h2" text={t.aboutTitle} locale={locale} className="mb-1 mt-4 text-base font-bold text-ink" />
        <ul className="list-disc space-y-1 ps-5">
          {t.about.map((item) => (
            <li key={item.en}>{item[locale]}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Pill({ tone, children }: { tone: "maker" | "trader" | "warn" | "cat"; children: ReactNode }) {
  const tones = {
    maker: "bg-emerald-50 text-emerald-800",
    trader: "bg-amber-50 text-amber-800",
    warn: "bg-orange-50 text-warn",
    cat: "bg-molecule-50 text-molecule-700",
  };
  return <span className={`whitespace-nowrap rounded-md px-2 text-xs font-medium leading-6 ${tones[tone]}`}>{children}</span>;
}

function ProductChip({ p, hit = false }: { p: Product; hit?: boolean }) {
  return (
    <span
      className={`inline-flex flex-wrap items-baseline gap-x-1.5 rounded-md border px-2 text-[0.82rem] leading-6 ${
        hit ? "border-transparent bg-[#fff1b8] font-medium" : "border-line bg-paper"
      }`}
    >
      <bdi dir="rtl">{p.fa}</bdi>
      {p.en && (
        <i dir="ltr" className="font-mono text-[0.74rem] not-italic text-muted">
          {p.en}
        </i>
      )}
    </span>
  );
}

function PhoneLine({ tel, locale }: { tel: string; locale: Locale }) {
  const [copied, setCopied] = useState(false);
  // "021-54612000 داخلی 2" → number in mono, the Persian remark in body text.
  const [number, ...rest] = tel.split(" ");
  const extra = rest.join(" ");
  return (
    <span className="block">
      <bdi className="font-mono tabular-nums select-all" dir="ltr">
        {number}
      </bdi>
      {extra && <span className="ms-1.5 text-sm text-muted">{extra}</span>}
      <button
        type="button"
        onClick={() =>
          navigator.clipboard?.writeText(tel.replace(/[^\d]/g, "")).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          })
        }
        className="ms-2 rounded border border-line px-1.5 text-[0.74rem] text-molecule-700 hover:border-molecule-500"
      >
        {copied ? t.copied[locale] : t.copy[locale]}
      </button>
    </span>
  );
}

function SupplierCard({ s, hits, locale, query }: { s: Supplier; hits: Product[]; locale: Locale; query: string }) {
  const others = s.products.filter((p) => !hits.includes(p));
  const shown = hits.length ? hits : others.slice(0, 8);
  const more = hits.length ? others : others.slice(8);
  const web = safeUrl(s.web);
  const src = safeUrl(s.src);
  const dt = "whitespace-nowrap text-muted";
  const dd = "m-0 min-w-0 [overflow-wrap:anywhere]";

  return (
    <article className="flex flex-col gap-3 rounded-card border border-line bg-white p-5">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <BiTitle
          as="h3"
          text={{ fa: s.n, en: s.e }}
          locale={locale}
          className="me-1 text-lg font-bold text-vault-900"
          secondaryClassName="text-[0.75em]"
        />
        <Pill tone={s.t === "m" ? "maker" : "trader"}>{t.types[s.t][locale]}</Pill>
        {s.partial ? (
          <Pill tone="warn">{t.needsCompleting[locale]}</Pill>
        ) : (
          !s.tel.length && <Pill tone="warn">{t.noPhone[locale]}</Pill>
        )}
        {s.c.map((c) => (
          <Pill key={c} tone="cat">
            {t.categories[c]?.[locale] ?? c}
          </Pill>
        ))}
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[0.92rem]">
        <dt className={dt}>{t.phone[locale]}</dt>
        <dd className={dd}>
          {s.tel.length ? (
            s.tel.map((tel) => <PhoneLine key={tel} tel={tel} locale={locale} />)
          ) : (
            <span className="text-sm text-warn">{t.notRecorded[locale]}</span>
          )}
        </dd>
        {s.addr && (
          <>
            <dt className={dt}>{t.address[locale]}</dt>
            <dd className={dd}>{s.addr}</dd>
          </>
        )}
        {s.site && (
          <>
            <dt className={dt}>{t.plant[locale]}</dt>
            <dd className={dd}>{s.site}</dd>
          </>
        )}
        <dt className={dt}>{t.location[locale]}</dt>
        <dd className={dd}>
          {s.city}
          {s.prov !== "نامشخص" && !s.city.includes(s.prov) && ` — ${t.province[locale]} ${s.prov}`}
        </dd>
        {s.mail && (
          <>
            <dt className={dt}>{t.email[locale]}</dt>
            <dd className={dd}>
              <bdi className="font-mono text-sm select-all" dir="ltr">
                {s.mail}
              </bdi>
            </dd>
          </>
        )}
        {web && (
          <>
            <dt className={dt}>{t.website[locale]}</dt>
            <dd className={dd}>
              <a href={web} target="_blank" rel="noopener noreferrer" dir="ltr" className="text-molecule-700 underline-offset-2 hover:underline">
                {web.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </a>
            </dd>
          </>
        )}
      </dl>

      {s.note && <p className="text-sm text-warn">{s.note}</p>}

      {shown.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {shown.map((p, i) => (
            <ProductChip key={i} p={p} hit={hits.includes(p)} />
          ))}
        </div>
      )}
      {more.length > 0 && (
        <details>
          <summary className="w-fit cursor-pointer text-sm text-molecule-700">
            {(hits.length ? t.otherProducts : t.moreProducts)[locale]} ({more.length})
          </summary>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {more.map((p, i) => (
              <ProductChip key={i} p={p} />
            ))}
          </div>
        </details>
      )}

      {query && web && (
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(`site:${host(web)} ${query}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit text-sm text-molecule-700 hover:underline"
        >
          {fillQuery(t.searchSite[locale], query)}
        </a>
      )}
      {src && (
        <p className="text-xs text-muted">
          {t.source[locale]}
          {s.via ? t.viaSearch[locale] : ""}:{" "}
          <a href={src} target="_blank" rel="noopener noreferrer" dir="ltr" className="text-molecule-700 hover:underline">
            {host(src)}
          </a>
        </p>
      )}
    </article>
  );
}
