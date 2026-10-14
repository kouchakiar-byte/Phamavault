"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Lock, Search, X } from "lucide-react";
import { searchCopy as t } from "@/content/search";
import type { Locale } from "@/i18n/config";
import type { SearchResult } from "@/lib/site-search";

const fa = (n: number, locale: Locale) => n.toLocaleString(locale === "fa" ? "fa-IR" : "en-US");

/** Grouped results; `active` highlights one hit (palette keyboard navigation). */
export function SearchResults({
  result,
  locale,
  active = -1,
  onPick,
}: {
  result: SearchResult;
  locale: Locale;
  active?: number;
  onPick?: () => void;
}) {
  // Index of each group's first hit in the flat list the keyboard moves through.
  const starts = result.groups.map((_, gi) => result.groups.slice(0, gi).reduce((n, g) => n + g.items.length, 0));
  return (
    <div className="space-y-5">
      {result.fuzzy && <p className="text-sm text-muted">{t.fuzzy[locale].replace("{q}", result.query)}</p>}
      {result.groups.map((g, gi) => (
        <section key={g.key}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 px-1">
            <h3 className="text-xs font-bold tracking-wide text-molecule-700">
              {g.label} <span className="font-normal text-muted">({fa(g.total, locale)})</span>
            </h3>
            {g.more && g.total > g.items.length && (
              <Link href={g.more} onClick={onPick} className="text-xs font-semibold text-molecule-700 hover:underline">
                {t.allIn[locale]}
              </Link>
            )}
          </div>
          <ul className="overflow-hidden rounded-xl border border-line bg-white">
            {g.items.map((hit, hi) => {
              const i = starts[gi] + hi;
              const on = i === active;
              return (
                <li key={hit.href + hit.title} className="border-b border-line last:border-b-0">
                  <Link
                    href={hit.href}
                    onClick={onPick}
                    data-hit={i}
                    aria-selected={on || undefined}
                    className={`group flex items-start gap-3 px-3.5 py-2.5 transition ${on ? "bg-molecule-50" : "hover:bg-vault-50"}`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-vault-900">{hit.title}</span>
                      {hit.sub && <span className="mt-0.5 block truncate text-xs text-muted">{hit.sub}</span>}
                    </span>
                    {hit.locked ? (
                      <span className="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-capsule-400/15 px-2 py-0.5 text-[0.7rem] font-semibold text-vault-800">
                        <Lock className="size-3" aria-hidden="true" />
                        {t.locked[locale]}
                      </span>
                    ) : (
                      <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-muted transition group-hover:text-molecule-600 rtl:-scale-x-100" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Example queries that open the search for that word. */
export function SearchExamples({ locale, onPick }: { locale: Locale; onPick: (q: string) => void }) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
      {t.examples[locale]}:
      {t.exampleQueries.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onPick(q)}
          className="rounded-full border border-line bg-white px-2.5 py-0.5 text-xs font-medium text-vault-800 hover:border-molecule-400 hover:text-molecule-700"
        >
          <bdi>{q}</bdi>
        </button>
      ))}
    </p>
  );
}

/** Header search: a button that opens the search palette (also Ctrl+K or “/”). */
export function SiteSearch({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.label[locale]}
        title={`${t.label[locale]} (Ctrl+K)`}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-2 text-sm text-muted transition hover:border-molecule-400 hover:text-molecule-700"
      >
        <Search className="size-4" aria-hidden="true" />
      </button>
      {open && <Palette locale={locale} onClose={() => setOpen(false)} />}
    </>
  );
}

function Palette({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const q = query.trim();
  const page = `/${locale}/search?q=${encodeURIComponent(q)}`;

  useEffect(() => {
    if (q.length < 2) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(q)}&lang=${locale}&n=5`, { signal: ctrl.signal })
        .then((r) => r.json() as Promise<SearchResult>)
        .then((r) => {
          setResult(r);
          setActive(0);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 160);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [q, locale]);

  // Keep the page behind still while the palette is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const shown = q.length >= 2 ? result : null;
  const hits = shown?.groups.flatMap((g) => g.items) ?? [];

  const move = (to: number) => {
    const next = (to + hits.length) % hits.length;
    setActive(next);
    list.current?.querySelector(`[data-hit="${next}"]`)?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown" && hits.length) {
      e.preventDefault();
      move(active + 1);
    } else if (e.key === "ArrowUp" && hits.length) {
      e.preventDefault();
      move(active - 1);
    } else if (e.key === "Enter" && q.length >= 2) {
      e.preventDefault();
      router.push(hits[active]?.href ?? page);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-vault-950/50 p-3 pt-[8vh] backdrop-blur-sm sm:p-6 sm:pt-[10vh]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.label[locale]}
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-card border border-line bg-paper shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line bg-white px-4">
          <Search className="size-5 shrink-0 text-molecule-600" aria-hidden="true" />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder[locale]}
            aria-label={t.label[locale]}
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-vault-900 outline-none placeholder:text-muted/70 pv-bare-input [&::-webkit-search-cancel-button]:hidden"
          />
          <button type="button" onClick={onClose} aria-label={t.close[locale]} className="rounded-lg p-1.5 text-muted hover:bg-vault-50">
            <X className="size-5" />
          </button>
        </div>

        <div ref={list} className="min-h-0 flex-1 overflow-y-auto p-4" aria-live="polite">
          {!shown ? (
            <SearchExamples locale={locale} onPick={setQuery} />
          ) : shown.total === 0 ? (
            <p className="text-sm text-muted">{loading ? t.loading[locale] : t.none[locale].replace("{q}", shown.query)}</p>
          ) : (
            <SearchResults result={shown} locale={locale} active={active} onPick={onClose} />
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-2.5 text-xs text-muted">
          <span className="hidden sm:inline">{t.hint[locale]}</span>
          {shown && shown.total > 0 ? (
            <Link href={page} onClick={onClose} className="font-semibold text-molecule-700 hover:underline">
              {t.all[locale]} ({fa(shown.total, locale)})
            </Link>
          ) : (
            <span>{loading ? t.loading[locale] : ""}</span>
          )}
        </div>
      </div>
    </div>
  );
}
