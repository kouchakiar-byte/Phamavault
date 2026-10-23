"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ClipboardList, FlaskConical, Plus, Printer, Search, Sparkles, Trash2, Wand2 } from "lucide-react";
import {
  advisorCatalogue,
  advisorCopy as t,
  controls,
  coatingStep,
  formLabels,
  processSteps,
  reasonText,
  roleLabels,
  routeLabels,
  warningText,
} from "@/content/formulation-advisor";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { excipientSlug } from "@/lib/excipient-slug";
import { advise, chooseRoute, suggestComponents, type Component, type DosageForm, type Flags, type Note, type Role } from "@/lib/formulation-advisor";
import type { ObResult } from "@/lib/orange-book";
import { href } from "@/lib/paths";
import { fixed } from "./calc-format";
import { Field, TableWrap } from "./filters";

type Props = { locale: Locale; incompatibilities: Record<string, Bi> };

const fmt = (s: string, values: Record<string, string | number> = {}) => s.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));
const note = (map: Record<string, Bi>, n: Note, locale: Locale) => fmt(map[n.code]?.[locale] ?? n.code, n.values);
const byKey = new Map(advisorCatalogue.map((c) => [c.key, c]));
const ROLES = Object.keys(roleLabels) as Role[];
const FORMS = Object.keys(formLabels) as DosageForm[];
let nextId = 1;
const withId = (c: Omit<Component, "id">): Component => ({ ...c, id: `c${nextId++}` });

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-white p-5 sm:p-6">
      <h3 className="mb-4 flex items-center gap-3 text-lg font-bold text-vault-900">
        <span className="grid size-8 place-items-center rounded-full bg-vault-900 text-sm font-extrabold text-capsule-400">{n}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function FormulationAdvisor({ locale, incompatibilities }: Props) {
  const [api, setApi] = useState("");
  const [strength, setStrength] = useState("");
  const [form, setForm] = useState<DosageForm>("ir");
  const [use, setUse] = useState("");
  const [brand, setBrand] = useState("");
  const [brandWeight, setBrandWeight] = useState("");
  const [units, setUnits] = useState("100000");
  const [density, setDensity] = useState("0.6");
  const [flags, setFlags] = useState<Flags>({ poorFlow: false, moisture: false, heat: false, poorlySoluble: false, amine: false });
  const [components, setComponents] = useState<Component[]>([]);
  const [ob, setOb] = useState<ObResult | null>(null);
  const [obBusy, setObBusy] = useState(false);

  const s = parseFloat(strength);
  const bw = parseFloat(brandWeight);
  const input = {
    form,
    strength: s,
    brandWeight: bw > 0 ? bw : null,
    flags,
    components,
    units: parseFloat(units) > 0 ? parseFloat(units) : 0,
    density: parseFloat(density),
  };
  const result = s > 0 ? advise(input, advisorCatalogue) : null;

  function suggest() {
    if (!(s > 0)) return;
    const { route } = chooseRoute(input);
    setComponents(suggestComponents(form, route, flags).map(withId));
  }

  async function checkBrand() {
    const queries = [brand, api].map((x) => x.trim()).filter((x) => x.length >= 3);
    if (!queries.length) return;
    setObBusy(true);
    try {
      // The brand first, then the active ingredient; discontinued brands (often the original RLD) are included.
      let found: ObResult | null = null;
      for (const q of queries) {
        const res = await fetch(`/api/orange-book?q=${encodeURIComponent(q)}&discn=1`);
        found = (await res.json()) as ObResult;
        if (found.groups.length) break;
      }
      setOb(found);
    } catch {
      setOb({ updated: null, iranUpdated: null, groups: [], total: 0 });
    } finally {
      setObBusy(false);
    }
  }

  const update = (id: string, patch: Partial<Component>) => setComponents((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const name = (key?: string, custom?: string) => (key ? (locale === "fa" ? byKey.get(key)?.fa : byKey.get(key)?.name) : custom) ?? "";
  const num = (x: number, d = 2) => fixed(x, d);
  const chosen = [...new Set(components.map((c) => c.key).filter(Boolean) as string[])];
  // Immediate-release reference products, the searched brand first; the Federal Register note is dropped from the strength.
  const brandKey = brand.trim().toUpperCase();
  const rlds = (ob?.groups.flatMap((g) => g.products.filter((p) => p.rld && /TABLET|CAPSULE/.test(p.form) && !/EXTENDED|DELAYED/.test(p.form)).map((p) => ({ ...p, ingredient: g.ingredient, strength: p.strength.replace(/\s*\*\*.*$/, "") }))) ?? [])
    .sort((a, b) => Number(!!brandKey && b.trade.includes(brandKey)) - Number(!!brandKey && a.trade.includes(brandKey)))
    .slice(0, 8);
  const dailymed = `https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(brand || api)}`;

  return (
    <div className="space-y-6" id="advisor">
      <div className="relative overflow-hidden rounded-3xl bg-vault-900 px-6 py-8 text-white sm:px-10">
        <div className="absolute -top-24 end-[-4rem] size-72 rounded-full bg-capsule-500/20 blur-3xl" aria-hidden="true" />
        <p className="inline-flex items-center gap-2 rounded-full border border-capsule-400/40 bg-capsule-400/10 px-3 py-1 text-sm font-bold text-capsule-400">
          <Sparkles className="size-4" aria-hidden="true" />
          {t.title[locale]}
        </p>
        <p className="mt-4 max-w-3xl leading-relaxed text-vault-100/85">{t.lead[locale]}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section n={1} title={t.step1[locale]}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.api[locale]} htmlFor="fa-api">
              <input id="fa-api" dir="ltr" className="field-input" placeholder={t.apiPh[locale]} value={api} onChange={(e) => setApi(e.target.value)} />
            </Field>
            <Field label={t.strength[locale]} htmlFor="fa-str">
              <input id="fa-str" type="number" min="0" step="any" className="field-input" value={strength} onChange={(e) => setStrength(e.target.value)} />
            </Field>
            <Field label={t.form[locale]} htmlFor="fa-form">
              <select id="fa-form" className="field-input" value={form} onChange={(e) => setForm(e.target.value as DosageForm)}>
                {FORMS.map((f) => (
                  <option key={f} value={f}>
                    {formLabels[f][locale]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t.use[locale]} htmlFor="fa-use">
              <input id="fa-use" className="field-input" placeholder={t.usePh[locale]} value={use} onChange={(e) => setUse(e.target.value)} />
            </Field>
            <Field label={t.brand[locale]} htmlFor="fa-brand">
              <div className="flex gap-2">
                <input id="fa-brand" dir="ltr" className="field-input min-w-0 flex-1" placeholder={t.brandPh[locale]} value={brand} onChange={(e) => setBrand(e.target.value)} />
                <button
                  type="button"
                  onClick={checkBrand}
                  disabled={obBusy}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-molecule-600 px-3 text-sm font-semibold text-white transition hover:bg-molecule-700 disabled:opacity-60"
                >
                  <Search className="size-4" aria-hidden="true" />
                  {obBusy ? t.checking[locale] : "Orange Book"}
                </button>
              </div>
            </Field>
            <Field label={t.brandWeight[locale]} htmlFor="fa-bw">
              <input id="fa-bw" type="number" min="0" step="any" className="field-input" value={brandWeight} onChange={(e) => setBrandWeight(e.target.value)} />
            </Field>
            <Field label={t.units[locale]} htmlFor="fa-units">
              <input id="fa-units" type="number" min="0" step="1" className="field-input" value={units} onChange={(e) => setUnits(e.target.value)} />
            </Field>
            {form === "cap" && (
              <Field label={t.density[locale]} htmlFor="fa-den">
                <input id="fa-den" type="number" min="0" step="0.05" className="field-input" value={density} onChange={(e) => setDensity(e.target.value)} />
              </Field>
            )}
          </div>
          <p className="mt-3 text-sm text-muted">{t.brandWeightHint[locale]}</p>

          {ob && (
            <div className="mt-4 rounded-xl border border-line bg-vault-50 p-4 text-sm">
              {rlds.length ? (
                <>
                  <p className="mb-2 font-bold text-vault-900">{t.rld[locale]}</p>
                  <ul className="space-y-1" dir="ltr">
                    {rlds.map((p) => (
                      <li key={`${p.applNo}-${p.strength}-${p.form}`} className="text-start">
                        <b>{p.trade}</b> · {p.ingredient} · {p.strength} · {p.form} · {p.applicant}
                        {p.type === "D" && <span className="ms-1 text-xs text-muted">(discontinued)</span>}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>{t.noMatch[locale]}</p>
              )}
              <p className="mt-3 text-muted">{t.obNote[locale]}</p>
              <a href={dailymed} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-semibold text-molecule-700 underline">
                {t.dailymed[locale]} ↗
              </a>
            </div>
          )}
        </Section>

        <Section n={2} title={t.step2[locale]}>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(t.flags) as (keyof Flags)[]).map((k) => (
              <label
                key={k}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${flags[k] ? "border-molecule-500 bg-molecule-50 text-vault-900" : "border-line hover:border-molecule-300"}`}
              >
                <input type="checkbox" className="size-4 accent-molecule-600" checked={flags[k]} onChange={(e) => setFlags((f) => ({ ...f, [k]: e.target.checked }))} />
                {t.flags[k][locale]}
              </label>
            ))}
          </div>
        </Section>
      </div>

      <Section n={3} title={t.step3[locale]}>
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={suggest}
            disabled={!(s > 0)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-capsule-400 to-capsule-500 px-5 py-2.5 text-sm font-extrabold text-vault-900 shadow-md shadow-capsule-500/25 transition hover:brightness-105 disabled:opacity-50"
          >
            <Wand2 className="size-4" aria-hidden="true" />
            {t.suggest[locale]}
          </button>
          <button
            type="button"
            onClick={() => setComponents((l) => [...l, withId({ key: "mcc", role: "dil" })])}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-vault-900 transition hover:border-molecule-400"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t.add[locale]}
          </button>
        </div>
        {components.length > 0 && (
          <div className="space-y-2">
            {components.map((c) => {
              const item = c.key ? byKey.get(c.key) : undefined;
              return (
                <div key={c.id} className="grid grid-cols-[1fr_auto] gap-2 rounded-xl border border-line p-3 sm:grid-cols-[2fr_1.3fr_7rem_auto] sm:items-center">
                  <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
                    <select
                      aria-label={t.component[locale]}
                      className="field-input"
                      value={c.key ?? "__custom"}
                      onChange={(e) => {
                        const key = e.target.value === "__custom" ? undefined : e.target.value;
                        const roles = key ? (Object.keys(byKey.get(key)!.roles) as Role[]) : [];
                        update(c.id, { key, custom: key ? undefined : (c.custom ?? ""), role: roles.includes(c.role) ? c.role : (roles[0] ?? c.role), pct: undefined });
                      }}
                    >
                      {advisorCatalogue.map((x) => (
                        <option key={x.key} value={x.key}>
                          {locale === "fa" ? x.fa : x.name}
                        </option>
                      ))}
                      <option value="__custom">{t.custom[locale]}</option>
                    </select>
                    {!c.key && (
                      <input className="field-input" dir="ltr" placeholder={t.customPh[locale]} value={c.custom ?? ""} onChange={(e) => update(c.id, { custom: e.target.value })} />
                    )}
                  </div>
                  <select aria-label={t.role[locale]} className="field-input" value={c.role} onChange={(e) => update(c.id, { role: e.target.value as Role, pct: undefined })}>
                    {(item ? (Object.keys(item.roles) as Role[]) : ROLES).map((r) => (
                      <option key={r} value={r}>
                        {roleLabels[r][locale]}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    aria-label={t.pct[locale]}
                    placeholder={t.pctAuto[locale]}
                    className="field-input"
                    value={c.pct ?? ""}
                    onChange={(e) => update(c.id, { pct: e.target.value === "" ? undefined : parseFloat(e.target.value) })}
                  />
                  <button
                    type="button"
                    aria-label={t.remove[locale]}
                    title={t.remove[locale]}
                    onClick={() => setComponents((l) => l.filter((x) => x.id !== c.id))}
                    className="grid size-10 place-items-center rounded-xl text-muted transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {!result ? (
        <p className="rounded-card border border-dashed border-line p-6 text-center text-muted">{t.empty[locale]}</p>
      ) : (
        <section className="space-y-6 rounded-3xl border border-capsule-400/50 bg-gradient-to-b from-capsule-400/10 to-white p-5 sm:p-8 print:border-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-extrabold text-vault-900">
                <FlaskConical className="size-6 text-molecule-600" aria-hidden="true" />
                {t.result[locale]}
              </h3>
              {(api || brand || use) && (
                <p className="mt-1 text-sm text-muted">
                  <span dir="ltr">{[api, s ? `${s} mg` : "", brand && `(${brand})`].filter(Boolean).join(" ")}</span>
                  {use && ` · ${use}`}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-vault-900 transition hover:border-molecule-400 print:hidden"
            >
              <Printer className="size-4" aria-hidden="true" />
              {t.print[locale]}
            </button>
          </div>

          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-vault-900 p-4 text-white">
              <dt className="text-xs font-semibold text-vault-100/70">{t.route[locale]}</dt>
              <dd className="mt-1 text-lg font-extrabold text-capsule-400">{routeLabels[result.route][locale]}</dd>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <dt className="text-xs font-semibold text-muted">{t.weight[locale]}</dt>
              <dd className="mt-1 text-lg font-extrabold text-vault-900">
                {num(result.weight, 1)} mg
                {result.coatMg > 0 && (
                  <span className="ms-2 text-xs font-medium text-muted">
                    ({t.core[locale]} {num(result.coreWeight, 1)} + {t.coat[locale]} {num(result.coatMg, 1)})
                  </span>
                )}
              </dd>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <dt className="text-xs font-semibold text-muted">{result.capsule ? t.capsuleSize[locale] : t.apiLoad[locale]}</dt>
              <dd className="mt-1 text-lg font-extrabold text-vault-900">
                {result.capsule ? `#${result.capsule.size}` : `${num(result.apiPct, 1)}%`}
                {result.capsule && (
                  <span className="ms-2 text-xs font-medium text-muted">
                    {fmt(t.capsuleNote[locale], { v: result.capsule.volume, s: result.capsule.size, f: result.capsule.fill })}
                  </span>
                )}
              </dd>
            </div>
          </dl>

          <ul className="space-y-1.5 text-sm leading-relaxed text-vault-900">
            {result.reasons.map((r) => (
              <li key={r.code} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-capsule-500" aria-hidden="true" />
                {note(reasonText, r, locale)}
              </li>
            ))}
          </ul>

          <TableWrap>
            <table className="db bg-white">
              <thead>
                <tr>
                  <th>{t.component[locale]}</th>
                  <th>{t.role[locale]}</th>
                  <th>% w/w</th>
                  <th>{t.mg[locale]}</th>
                  <th>{t.kg[locale]}</th>
                  <th>{t.range[locale]}</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((r) => {
                  const label = r.role === "api" ? api || (locale === "fa" ? "ماده مؤثره" : "Active ingredient") : name(r.key, r.name);
                  const item = r.key ? byKey.get(r.key) : undefined;
                  return (
                    <tr key={r.id} className={r.out ? "bg-amber-50" : r.role === "api" ? "bg-molecule-50/60 font-semibold" : ""}>
                      <td className="text-start">
                        {item ? (
                          <Link href={href(locale, `excipients/${excipientSlug(item.name)}`)} className="text-molecule-700 hover:underline">
                            {label}
                          </Link>
                        ) : (
                          label
                        )}
                      </td>
                      <td>{r.role === "api" ? "API" : roleLabels[r.role][locale]}</td>
                      <td className="num">
                        {r.qs && <span className="me-1 text-xs text-muted">q.s.</span>}
                        {num(r.pct)}
                      </td>
                      <td className="num">{num(r.mg)}</td>
                      <td className="num">{input.units ? num(r.kg, 3) : "–"}</td>
                      <td className="num text-muted">{r.range ? `${r.range[0]}–${r.range[1]}%` : "–"}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td colSpan={2}>{t.total[locale]}</td>
                  <td className="num">{num(result.sum)}</td>
                  <td className="num">{num(result.coreWeight)}</td>
                  <td className="num">{input.units ? num((result.coreWeight * input.units) / 1e6, 3) : "–"}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </TableWrap>

          {result.warnings.length > 0 && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
              <h4 className="mb-3 flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="size-5" aria-hidden="true" />
                {t.warnings[locale]}
              </h4>
              <ul className="space-y-2 text-sm leading-relaxed text-amber-950">
                {result.warnings.map((w, i) => (
                  <li key={`${w.code}-${i}`} className="flex gap-2">
                    <span aria-hidden="true">•</span>
                    {note(warningText, w, locale)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {chosen.some((k) => incompatibilities[k]) && (
            <details className="rounded-2xl border border-line bg-white p-5">
              <summary className="cursor-pointer font-bold text-vault-900">{t.incompat[locale]}</summary>
              <dl className="mt-3 space-y-3 text-sm leading-relaxed">
                {chosen
                  .filter((k) => incompatibilities[k])
                  .map((k) => (
                    <div key={k}>
                      <dt className="font-semibold text-vault-900">{name(k)}</dt>
                      <dd className="text-muted">{incompatibilities[k][locale]}</dd>
                    </div>
                  ))}
              </dl>
            </details>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-5">
              <h4 className="mb-3 flex items-center gap-2 font-bold text-vault-900">
                <FlaskConical className="size-5 text-molecule-600" aria-hidden="true" />
                {t.steps[locale]} — {routeLabels[result.route][locale]}
              </h4>
              <ol className="list-decimal space-y-2 ps-5 text-sm leading-relaxed">
                {processSteps[result.route].map((st) => (
                  <li key={st.en}>{st[locale]}</li>
                ))}
                {form === "fc" && <li>{coatingStep[locale]}</li>}
              </ol>
            </div>
            <div className="rounded-2xl border border-line bg-white p-5">
              <h4 className="mb-3 flex items-center gap-2 font-bold text-vault-900">
                <ClipboardList className="size-5 text-molecule-600" aria-hidden="true" />
                {t.ipc[locale]}
              </h4>
              <ul className="list-disc space-y-2 ps-5 text-sm leading-relaxed">
                {controls.map((c) => (
                  <li key={c.en}>{c[locale]}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted">{t.disclaimer[locale]}</p>
        </section>
      )}
    </div>
  );
}
