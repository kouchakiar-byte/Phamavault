"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Lock, Search, X } from "lucide-react";
import { pages } from "@/content/pages";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/paths";
import type { SupplierPage, SupplierView } from "@/lib/supplier-api";
import { norm, type Filters, type SortKey } from "@/lib/supplier-search";
import { BiTitle } from "./ui";

const t = pages.suppliers;

/** The bank is searched on the server (/api/suppliers) a page at a time; the whole list never reaches the browser. */
export type SupplierData = {
  /** The first page for the default filters, rendered on the server so the page has content before any search. */
  first: SupplierPage;
  /** The last daily update, already written out on the server ("27 Mehr 1405, 18:00"). */
  updated?: string | null;
};

const queryString = (f: Filters, page: number) =>
  new URLSearchParams({ q: f.query, type: f.type, cat: f.cat, sort: f.sort, ...(f.telOnly ? { tel: "1" } : {}), page: String(page) }).toString();

const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));

/** Like `fill`, but isolates the query so mixed Persian/Latin text keeps its order. */
function fillQuery(template: string, query: string, vars: Record<string, string | number> = {}): ReactNode[] {
  return template.split(/(\{q\})/).map((part, i) => (part === "{q}" ? <bdi key={i}>{query}</bdi> : fill(part, vars)));
}

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];

/** Only http(s) links from the data become anchors. */
const safeUrl = (url: string | undefined) => (url && /^https?:\/\//.test(url) ? url : undefined);

const defaults: Filters = { query: "", type: "all", cat: "all", sort: "cred", telOnly: false };

/** Reads `?q=`, `?cat=` and `?type=` so the home-page search lands on results. */
export function filtersFromParams(params: URLSearchParams): Partial<Filters> {
  const cat = params.get("cat") ?? "";
  const type = params.get("type") ?? "";
  return {
    query: params.get("q") ?? "",
    cat: cat in t.categories ? cat : "all",
    type: type === "m" || type === "t" ? type : "all",
  };
}

export function SupplierBank({ locale, data, initial }: { locale: Locale; data: SupplierData; initial?: Partial<Filters> }) {
  const [filters, setFilters] = useState<Filters>({ ...defaults, ...initial });
  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));
  const [page, setPage] = useState<SupplierPage>(data.first);
  const [rows, setRows] = useState<SupplierView[]>(data.first.results);
  const [state, setState] = useState<"idle" | "loading" | "rate" | "error">("idle");
  const latest = useRef(0);

  async function load(f: Filters, n: number, append: boolean) {
    const id = ++latest.current;
    setState("loading");
    try {
      const res = await fetch(`/api/suppliers?${queryString(f, n)}`, { cache: "no-store" });
      if (id !== latest.current) return;
      if (res.status === 429) return setState("rate");
      if (!res.ok) return setState("error");
      const next = (await res.json()) as SupplierPage;
      if (id !== latest.current) return;
      setPage(next);
      setRows((r) => (append ? [...r, ...next.results] : next.results));
      setState("idle");
    } catch {
      if (id === latest.current) setState("error");
    }
  }

  // A new search after a short pause in typing. The server-rendered first page is fetched once more
  // on arrival, since it was rendered without contact details and the reader may be signed in.
  useEffect(() => {
    const timer = setTimeout(() => load(filters, 1, false), 250);
    return () => clearTimeout(timer);
  }, [filters]);

  const q = norm(filters.query);
  const loginHref = `${href(locale, "account/login")}?next=${encodeURIComponent(href(locale, "suppliers"))}`;

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
          <label className="flex max-w-full items-center gap-2 text-sm text-muted">
            {t.category[locale]}
            <select className="field-input w-auto min-w-0 max-w-full py-1 text-sm" value={filters.cat} onChange={(e) => set({ cat: e.target.value })}>
              {Object.entries(t.categories).map(([k, v]) => (
                <option key={k} value={k}>
                  {v[locale]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex max-w-full items-center gap-2 text-sm text-muted">
            {t.sort[locale]}
            <select
              className="field-input w-auto min-w-0 max-w-full py-1 text-sm"
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
          <label className="flex max-w-full items-center gap-2 text-sm text-muted">
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
          ? fillQuery(t.countQuery[locale], filters.query, { n: page.total, t: page.withTel })
          : fill(t.countAll[locale], { n: page.total, p: page.totalProducts })}
        {state === "loading" && <span className="ms-2">{t.loading[locale]}</span>}
      </p>

      {state === "rate" && <p className="rounded-card bg-capsule-50 px-4 py-3 text-sm text-capsule-700">{t.tooMany[locale]}</p>}
      {state === "error" && <p className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">{t.loadError[locale]}</p>}

      {!page.contacts && (
        <p className="flex flex-wrap items-center gap-2 rounded-card border border-molecule-400/50 bg-molecule-50 px-4 py-3 text-sm text-vault-900">
          <Lock className="size-4 shrink-0 text-molecule-700" aria-hidden="true" />
          {t.contactsLocked[locale]}
          <Link href={loginHref} className="font-semibold text-molecule-700 hover:underline">
            {t.signIn[locale]}
          </Link>
        </p>
      )}

      {page.total === 0 ? (
        <p className="rounded-card border border-dashed border-line bg-white p-6 text-muted">
          {fillQuery(t.empty[locale], filters.query)}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((s) => (
            <SupplierCard key={s.n} s={s} locale={locale} query={q ? filters.query : ""} contacts={page.contacts} loginHref={loginHref} />
          ))}
          {page.page < page.pages && (
            <button
              type="button"
              disabled={state === "loading"}
              onClick={() => load(filters, page.page + 1, true)}
              className="mx-auto rounded-full border border-line bg-white px-6 py-2.5 text-sm font-semibold text-vault-900 hover:border-molecule-500 disabled:opacity-50"
            >
              {fill(t.showMore[locale], { n: page.total - rows.length })}
            </button>
          )}
        </div>
      )}

      <section className="mt-4 border-t border-line pt-6 text-sm leading-relaxed text-muted">
        <BiTitle as="h2" text={t.orderTitle} locale={locale} className="mb-1 text-base font-bold text-ink" />
        <p>{t.orderText[locale]}</p>
        <BiTitle as="h2" text={t.aboutTitle} locale={locale} className="mb-1 mt-4 text-base font-bold text-ink" />
        <ul className="list-disc space-y-1 ps-5">
          {data.updated && (
            <li>
              {copy.lastUpdate.label[locale]}: {data.updated} · {copy.lastUpdate.daily[locale]}
            </li>
          )}
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

function ProductChip({ p, hit = false }: { p: { fa: string; en: string }; hit?: boolean }) {
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

function SupplierCard({
  s,
  locale,
  query,
  contacts,
  loginHref,
}: {
  s: SupplierView;
  locale: Locale;
  query: string;
  contacts: boolean;
  loginHref: string;
}) {
  const match = s.match;
  const hitList = s.products.filter((p) => p.hit);
  const others = s.products.filter((p) => !p.hit);
  const shown = hitList.length ? hitList : others.slice(0, 8);
  const more = hitList.length ? others : others.slice(8);
  const web = safeUrl(s.web);
  const dt = "whitespace-nowrap text-muted";
  const dd = "m-0 min-w-0 [overflow-wrap:anywhere]";
  const locked = (
    <Link href={loginHref} className="inline-flex items-center gap-1 text-sm text-molecule-700 hover:underline">
      <Lock className="size-3.5" aria-hidden="true" />
      {t.signInToSee[locale]}
    </Link>
  );

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
          !s.telCount && <Pill tone="warn">{t.noPhone[locale]}</Pill>
        )}
        {s.c.map((c) => (
          <Pill key={c} tone="cat">
            {t.categories[c]?.[locale] ?? c}
          </Pill>
        ))}
      </div>

      {query && (match === "category" || match === "general") && (
        <p className="rounded-lg bg-capsule-50 px-3 py-1.5 text-sm text-capsule-700">
          {(match === "category" ? t.matchCategory : t.matchGeneral)[locale]}
        </p>
      )}
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[0.92rem]">
        <dt className={dt}>{t.phone[locale]}</dt>
        <dd className={dd}>
          {!contacts && s.telCount ? (
            locked
          ) : s.tel.length ? (
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
        {s.hasMail && (
          <>
            <dt className={dt}>{t.email[locale]}</dt>
            <dd className={dd}>
              {s.mail ? (
                <bdi className="font-mono text-sm select-all" dir="ltr">
                  {s.mail}
                </bdi>
              ) : (
                locked
              )}
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
              {s.webDown && <span className="ms-2 text-xs text-warn">{t.webDown[locale]}</span>}
            </dd>
          </>
        )}
      </dl>

      {s.note && <p className="text-sm text-warn">{s.note}</p>}

      {shown.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {shown.map((p, i) => (
            <ProductChip key={i} p={p} hit={p.hit} />
          ))}
        </div>
      )}
      {more.length > 0 && (
        <details>
          <summary className="w-fit cursor-pointer text-sm text-molecule-700">
            {(hitList.length ? t.otherProducts : t.moreProducts)[locale]} ({more.length})
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
    </article>
  );
}
