"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, FlaskConical, Search, X } from "lucide-react";
import { apiCatalogue, apiGroups, compat as t, excipientCatalogue, rules, type ApiGroup } from "@/content/compatibility";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { isolateText } from "@/lib/bidi";
import { excipientSlug } from "@/lib/excipient-slug";
import { href } from "@/lib/paths";

const known = new Map(apiCatalogue.map((a) => [a.name.toLowerCase(), a.groups]));
const levelOrder = { high: 0, moderate: 1, low: 2 } as const;
const levelStyle = {
  high: "bg-red-50 text-red-700 ring-red-200",
  moderate: "bg-capsule-400/15 text-capsule-700 ring-capsule-400/40",
  low: "bg-molecule-50 text-molecule-700 ring-molecule-400/40",
} as const;

/** Picks an API and excipients and lists the known interactions between their reactive groups and traits. */
export function CompatibilityChecker({ locale, apis }: { locale: Locale; apis: string[] }) {
  const tx = (b: Bi) => (locale === "fa" ? isolateText(b.fa) : b.en);
  const [query, setQuery] = useState("");
  const [api, setApi] = useState<string | null>(null);
  const [groups, setGroups] = useState<Set<ApiGroup>>(new Set());
  const [chosen, setChosen] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState("");

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2 || q === api?.toLowerCase()) return [];
    return apis.filter((n) => n.toLowerCase().includes(q)).sort((a, b) => Number(!a.toLowerCase().startsWith(q)) - Number(!b.toLowerCase().startsWith(q))).slice(0, 8);
  }, [query, api, apis]);

  const pick = (name: string) => {
    setApi(name);
    setQuery(name);
    setGroups(new Set(known.get(name.toLowerCase()) ?? []));
  };
  const toggle = <T,>(set: Set<T>, value: T, update: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    update(next);
  };

  const hits = useMemo(() => {
    const exc = excipientCatalogue.filter((e) => chosen.has(e.name));
    return rules
      .map((r) => ({
        rule: r,
        groups: r.groups.filter((g) => groups.has(g)),
        excipients: exc.filter((e) => e.traits.some((tr) => r.traits.includes(tr))).map((e) => e.name),
      }))
      .filter((h) => h.groups.length && h.excipients.length)
      .sort((a, b) => levelOrder[a.rule.level] - levelOrder[b.rule.level]);
  }, [groups, chosen]);

  const visibleExcipients = excipientCatalogue.filter((e) => !filter.trim() || e.name.toLowerCase().includes(filter.trim().toLowerCase()));
  const ready = groups.size > 0 && chosen.size > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
      <div className="space-y-5">
        {/* API */}
        <section className="rounded-card border border-line bg-white p-5">
          <h2 className="font-bold text-vault-900">{tx(t.api)}</h2>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setApi(null);
              }}
              placeholder={t.apiPlaceholder[locale]}
              aria-label={t.api[locale]}
              dir="ltr"
              className="field-input w-full ps-9 text-start"
            />
            {suggestions.length > 0 && (
              <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-line bg-white shadow-lg" role="listbox">
                {suggestions.map((n) => (
                  <li key={n}>
                    <button type="button" onClick={() => pick(n)} className="flex w-full items-center justify-between gap-2 px-3 py-2 text-start text-sm hover:bg-vault-50" dir="ltr">
                      <span>{n}</span>
                      {known.has(n.toLowerCase()) && <Check className="size-4 text-molecule-600" aria-hidden="true" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="mt-4 text-sm font-semibold text-vault-900">{tx(t.groups)}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{tx(t.groupsHint)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(apiGroups) as ApiGroup[]).map((g) => {
              const on = groups.has(g);
              return (
                <button
                  key={g}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(groups, g, setGroups)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${on ? "border-molecule-500 bg-molecule-600 font-semibold text-white" : "border-line bg-white text-vault-800 hover:border-molecule-400"}`}
                >
                  {tx(apiGroups[g])}
                </button>
              );
            })}
          </div>
        </section>

        {/* Excipients */}
        <section className="rounded-card border border-line bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-vault-900">{tx(t.excipients)}</h2>
            {chosen.size > 0 && (
              <button type="button" onClick={() => setChosen(new Set())} className="inline-flex items-center gap-1 text-xs text-muted hover:text-vault-900">
                <X className="size-3.5" aria-hidden="true" />
                {chosen.size}
              </button>
            )}
          </div>
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            dir="ltr"
            aria-label={t.excipients[locale]}
            placeholder="Lactose, Magnesium stearate…"
            className="field-input mt-3 w-full text-start"
          />
          <div className="mt-3 flex max-h-80 flex-wrap gap-2 overflow-y-auto">
            {visibleExcipients.map((e) => {
              const on = chosen.has(e.name);
              return (
                <button
                  key={e.name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(chosen, e.name, setChosen)}
                  dir="ltr"
                  className={`rounded-full border px-3 py-1 text-xs transition ${on ? "border-vault-900 bg-vault-900 font-semibold text-capsule-400" : "border-line bg-white text-vault-800 hover:border-vault-400"}`}
                >
                  {e.name}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Results */}
      <section aria-live="polite" className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-vault-900">
          <FlaskConical className="size-5 text-molecule-600" aria-hidden="true" />
          {tx(t.results)}
          {ready && <span className="rounded-full bg-vault-900 px-2.5 py-0.5 text-xs font-bold text-capsule-400">{hits.length}</span>}
        </h2>
        {!ready && <p className="rounded-card border border-dashed border-line bg-white p-5 text-sm text-muted">{tx(t.empty)}</p>}
        {ready && hits.length === 0 && (
          <p className="flex gap-2 rounded-card border border-molecule-400/50 bg-molecule-50 p-5 text-sm leading-relaxed text-molecule-700">
            <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {tx(t.none)}
          </p>
        )}
        {hits.map(({ rule, groups: g, excipients }) => (
          <article key={rule.id} className="rounded-card border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 font-bold text-vault-900">
                <AlertTriangle className="size-4 text-capsule-600" aria-hidden="true" />
                {tx(rule.title)}
              </h3>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${levelStyle[rule.level]}`}>{tx(t.level[rule.level])}</span>
            </div>
            <p className="mt-3 text-xs font-semibold text-muted">{tx(t.involved)}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {g.map((x) => (
                <span key={x} className="rounded-md bg-molecule-50 px-2 py-0.5 text-xs text-molecule-700">
                  {tx(apiGroups[x])}
                </span>
              ))}
              {excipients.map((name) => (
                <Link key={name} href={href(locale, `excipients/${excipientSlug(name)}`)} title={t.sheet[locale]} dir="ltr" className="rounded-md bg-vault-50 px-2 py-0.5 text-xs text-vault-900 hover:text-molecule-700 hover:underline">
                  {name}
                </Link>
              ))}
            </div>
            <dl className="mt-4 space-y-3 text-sm leading-relaxed">
              {(
                [
                  [t.mechanism, rule.mechanism],
                  [t.consequence, rule.consequence],
                  [t.examples, rule.examples],
                  [t.mitigation, rule.mitigation],
                ] as const
              ).map(([label, text]) => (
                <div key={label.en}>
                  <dt className="font-semibold text-vault-900">{tx(label)}</dt>
                  <dd className="mt-0.5 text-ink">{tx(text)}</dd>
                </div>
              ))}
              <div>
                <dt className="font-semibold text-vault-900">{tx(t.refs)}</dt>
                <dd className="mt-0.5 space-y-0.5 text-xs text-muted" dir="ltr" style={{ textAlign: "start" }}>
                  {rule.refs.map((r) => (
                    <p key={r}>{r}</p>
                  ))}
                </dd>
              </div>
            </dl>
          </article>
        ))}
        {ready && (
          <p className="text-xs leading-relaxed text-muted">
            {tx(t.disclaimer)}
          </p>
        )}
      </section>
    </div>
  );
}
