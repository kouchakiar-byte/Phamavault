"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeftRight, CheckCircle2, ClipboardCheck, FlaskConical, Search, ShieldAlert, X } from "lucide-react";
import { classNames, drugs, rules, type ClassId, type Drug, type Ref, type Severity } from "@/data/interactions";
import { interactionsCopy as t } from "@/content/pharmacy";
import type { Locale } from "@/i18n/config";
import { checkAll, drugById, parseQuery, suggest, worst } from "@/lib/interactions";
import { href } from "@/lib/paths";
import { useUrlParam } from "@/lib/use-url-param";

const MAX = 10;

const tone: Record<Severity, { pill: string; band: string; ring: string; icon: string }> = {
  contraindicated: { pill: "bg-red-700 text-white", band: "bg-red-700", ring: "border-red-300", icon: "text-red-700" },
  major: { pill: "bg-red-500 text-white", band: "bg-red-500", ring: "border-red-200", icon: "text-red-600" },
  moderate: { pill: "bg-amber-400 text-vault-950", band: "bg-amber-400", ring: "border-amber-200", icon: "text-amber-600" },
  minor: { pill: "bg-sky-100 text-sky-800", band: "bg-sky-300", ring: "border-sky-200", icon: "text-sky-600" },
};

const examples = [
  ["warfarin", "ibuprofen"],
  ["sertraline", "tramadol"],
  ["clarithromycin", "simvastatin"],
  ["sildenafil", "nitroglycerin"],
];

const fmt = (s: string, values: Record<string, number>, locale: Locale) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => values[k].toLocaleString(locale === "fa" ? "fa-IR" : "en-US"));

const name = (drug: Drug, locale: Locale) => (locale === "fa" ? drug.fa : drug.en);

/** "NSAIDs" for a class, the drug's name for a single drug. */
function refLabel(ref: Ref, drug: Drug, locale: Locale) {
  return ref.startsWith("c:") ? classNames[ref.slice(2) as ClassId][locale] : name(drug, locale);
}

export function SeverityPill({ severity, locale }: { severity: Severity; locale: Locale }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${tone[severity].pill}`}>
      {severity === "contraindicated" ? <ShieldAlert className="size-3.5" aria-hidden="true" /> : <AlertTriangle className="size-3.5" aria-hidden="true" />}
      {t.severity[severity][locale]}
    </span>
  );
}

/** The search box: free text with suggestions; chosen medicines become chips. */
function DrugInput({ locale, chosen, setChosen, onSubmit }: { locale: Locale; chosen: Drug[]; setChosen: (d: Drug[]) => void; onSubmit: (d: Drug[]) => void }) {
  const [text, setText] = useState("");
  const [unknown, setUnknown] = useState<string[]>([]);
  const [focus, setFocus] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const last = text.split(/\s+(?:با|و|and|with)\s+|[+،,]/).pop() ?? "";
  const list = useMemo(
    () => (last.trim().length >= 2 ? suggest(last).filter((d) => !chosen.some((c) => c.id === d.id)) : []),
    [last, chosen],
  );

  const add = (drug: Drug) => {
    if (chosen.length >= MAX || chosen.some((c) => c.id === drug.id)) return;
    setChosen([...chosen, drug]);
    setText("");
    setUnknown([]);
    setFocus(-1);
    inputRef.current?.focus();
  };

  const submit = () => {
    let next = chosen;
    if (text.trim()) {
      const { found, unknown: missing } = parseQuery(text);
      next = [...chosen, ...found.filter((f) => !chosen.some((c) => c.id === f.id))].slice(0, MAX);
      setChosen(next);
      setUnknown(missing);
      setText(missing.join(" + "));
    }
    onSubmit(next);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (focus >= 0 && list[focus]) add(list[focus]);
            else submit();
          }}
          className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-line bg-white p-2 shadow-sm transition focus-within:border-capsule-400 focus-within:shadow-lg focus-within:shadow-capsule-500/10"
        >
          <Search className="ms-2 size-5 shrink-0 text-muted" aria-hidden="true" />
          {chosen.map((d) => (
            <span key={d.id} className="inline-flex items-center gap-1.5 rounded-full bg-vault-900 py-1 ps-3 pe-1.5 text-sm font-medium text-white">
              {name(d, locale)}
              <button
                type="button"
                onClick={() => setChosen(chosen.filter((c) => c.id !== d.id))}
                aria-label={`${t.remove[locale]} ${name(d, locale)}`}
                className="rounded-full p-0.5 text-vault-100/70 hover:bg-white/15 hover:text-white"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          ))}
          <input
            id="ddi-input"
            ref={inputRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setFocus(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setFocus((f) => Math.min(f + 1, list.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocus((f) => Math.max(f - 1, -1));
              } else if (e.key === "Backspace" && !text && chosen.length) setChosen(chosen.slice(0, -1));
            }}
            placeholder={chosen.length ? "" : t.placeholder[locale]}
            aria-label={t.label[locale]}
            autoComplete="off"
            className="min-w-[12rem] flex-1 bg-transparent px-1 py-2 text-base text-ink outline-none placeholder:text-muted/50"
          />
          <button type="submit" className="rounded-xl bg-capsule-400 bg-gradient-to-l from-capsule-400 to-capsule-500 px-5 py-2.5 text-sm font-bold text-vault-950 shadow-sm transition hover:scale-[0.97]">
            {t.check[locale]}
          </button>
        </form>
        {list.length > 0 && (
          <ul role="listbox" className="absolute inset-x-0 top-full z-20 mt-1.5 overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
            {list.map((d, i) => (
              <li key={d.id} role="option" aria-selected={i === focus}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => add(d)}
                  className={`flex w-full items-baseline justify-between gap-3 px-4 py-2.5 text-start text-sm hover:bg-capsule-50 ${i === focus ? "bg-capsule-50" : ""}`}
                >
                  <span className="font-semibold text-vault-900">{name(d, locale)}</span>
                  <span className="truncate text-xs text-muted" dir={locale === "fa" ? "ltr" : "rtl"}>
                    {locale === "fa" ? d.en : d.fa}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {unknown.length > 0 && (
        <p className="text-sm text-warn">
          {t.unknown[locale]} <b>{unknown.join("، ")}</b>
        </p>
      )}
      {chosen.length >= MAX && <p className="text-sm text-muted">{t.maxDrugs[locale]}</p>}
    </div>
  );
}

function Examples({ locale, pick }: { locale: Locale; pick: (ids: string[]) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted">{t.examples[locale]}:</span>
      {examples.map((ids) => (
        <button
          key={ids.join()}
          type="button"
          onClick={() => pick(ids)}
          className="rounded-full border border-line bg-white px-3 py-1 text-vault-900 transition hover:border-capsule-400 hover:bg-capsule-50"
        >
          {ids.map((id) => name(drugById(id)!, locale)).join(locale === "fa" ? " با " : " + ")}
        </button>
      ))}
    </div>
  );
}

/** Compact box for the pharmacy page; opens the results page. */
export function InteractionSearchBox({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [chosen, setChosen] = useState<Drug[]>([]);
  const go = (list: Drug[]) => {
    if (list.length >= 2) router.push(`${href(locale, "pharmacy/interactions")}?d=${list.map((d) => d.id).join(",")}`);
  };
  return (
    <div className="space-y-3">
      <DrugInput locale={locale} chosen={chosen} setChosen={setChosen} onSubmit={go} />
      <Examples locale={locale} pick={(ids) => go(ids.map((id) => drugById(id)!))} />
      <p className="text-xs text-muted">{fmt(t.coverage[locale], { d: drugs.length, r: rules.length }, locale)}</p>
    </div>
  );
}

/** The full checker: reads ?d=id,id or ?q=text and shows every interaction. */
export function InteractionChecker({ locale }: { locale: Locale }) {
  const d = useUrlParam("d");
  const q = useUrlParam("q");
  const [chosen, setChosen] = useState<Drug[]>([]);
  const [checked, setChecked] = useState<Drug[]>([]);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    const fromIds = d
      .split(",")
      .map((id) => drugById(id.trim()))
      .filter((x): x is Drug => Boolean(x));
    const list = fromIds.length ? fromIds : q ? parseQuery(q).found : [];
    if (list.length) {
      setChosen(list.slice(0, MAX));
      setChecked(list.slice(0, MAX));
      setTried(true);
    }
  }, [d, q]);

  const run = (list: Drug[]) => {
    setTried(true);
    setChecked(list);
    const url = list.length ? `?d=${list.map((x) => x.id).join(",")}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  };

  const result = useMemo(() => checkAll(checked), [checked]);
  const top = worst(result.pairs);
  const count = result.pairs.reduce((n, p) => n + p.rules.length, 0);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <DrugInput locale={locale} chosen={chosen} setChosen={setChosen} onSubmit={run} />
        <Examples
          locale={locale}
          pick={(ids) => {
            const list = ids.map((id) => drugById(id)!);
            setChosen(list);
            run(list);
          }}
        />
      </div>

      {tried && checked.length < 2 && <p className="rounded-xl bg-paper px-4 py-3 text-sm text-muted">{t.needTwo[locale]}</p>}

      {checked.length >= 2 && (
        <section aria-live="polite" className="space-y-6">
          {/* Summary */}
          <div className="relative overflow-hidden rounded-3xl bg-vault-900 p-6 text-white sm:p-8">
            <div className="absolute -top-24 end-[-4rem] size-72 rounded-full bg-capsule-500/15 blur-3xl" aria-hidden="true" />
            <div className="flex flex-wrap items-center gap-2">
              {checked.map((x, i) => (
                <span key={x.id} className="flex items-center gap-2">
                  {i > 0 && <span className="text-capsule-400">+</span>}
                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">{name(x, locale)}</span>
                </span>
              ))}
            </div>
            {top ? (
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <p className="text-2xl font-bold sm:text-3xl">{fmt(t.summary[locale], { n: count, p: result.pairs.length }, locale)}</p>
                <span className="flex items-center gap-2 text-sm text-vault-100/80">
                  {t.highest[locale]}: <SeverityPill severity={top} locale={locale} />
                </span>
              </div>
            ) : (
              <div className="mt-5 flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-7 shrink-0 text-molecule-400" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-bold">{t.none[locale]}</p>
                  <p className="mt-1 text-sm text-vault-100/80">{t.noneNote[locale]}</p>
                </div>
              </div>
            )}
          </div>

          {/* One block per interacting pair */}
          {result.pairs.map(({ a, b, rules: found }) => (
            <article key={`${a.id}-${b.id}`} className={`overflow-hidden rounded-3xl border-2 bg-white shadow-sm ${tone[found[0].severity].ring}`}>
              <div className={`h-1.5 ${tone[found[0].severity].band}`} aria-hidden="true" />
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
                <h3 className="flex flex-wrap items-center gap-2.5 text-lg font-bold text-vault-900">
                  {name(a, locale)}
                  <ArrowLeftRight className="size-4 text-capsule-500" aria-hidden="true" />
                  {name(b, locale)}
                </h3>
                <SeverityPill severity={found[0].severity} locale={locale} />
              </header>
              <div className="divide-y divide-line">
                {found.map((rule) => {
                  const aFirst = rule.a.startsWith("d:") ? rule.a.slice(2) === a.id : (a.classes as string[]).includes(rule.a.slice(2));
                  const [ra, rb] = aFirst ? [rule.a, rule.b] : [rule.b, rule.a];
                  return (
                    <div key={rule.id} className="space-y-4 px-6 py-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                        {found.length > 1 && <SeverityPill severity={rule.severity} locale={locale} />}
                        <span>{t.severityHint[rule.severity][locale]}</span>
                        <span className="ms-auto rounded-full bg-paper px-2.5 py-1">
                          {t.basis[locale]}: {refLabel(ra, a, locale)} × {refLabel(rb, b, locale)}
                        </span>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        {(
                          [
                            [AlertTriangle, t.effect, rule.effect, tone[rule.severity].icon],
                            [FlaskConical, t.mechanism, rule.mechanism, "text-molecule-600"],
                            [ClipboardCheck, t.management, rule.management, "text-capsule-600"],
                          ] as const
                        ).map(([Icon, label, text, color]) => (
                          <div key={label.en} className="rounded-2xl bg-paper p-4">
                            <p className={`flex items-center gap-2 text-sm font-bold ${color}`}>
                              <Icon className="size-4" aria-hidden="true" />
                              {label[locale]}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-ink">{text[locale]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}

          {result.clear.length > 0 && result.pairs.length > 0 && (
            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-vault-900">
                <CheckCircle2 className="size-4 text-molecule-600" aria-hidden="true" />
                {t.clearPairs[locale]}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                {result.clear.map(([x, y]) => (
                  <li key={`${x.id}-${y.id}`} className="rounded-full bg-paper px-3 py-1 text-muted">
                    {name(x, locale)} + {name(y, locale)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">{t.noneNote[locale]}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
