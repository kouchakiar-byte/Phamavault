"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Atom,
  CheckCircle2,
  ClipboardCopy,
  ClipboardList,
  Cog,
  FileText,
  FlaskConical,
  GitCompareArrows,
  Plus,
  Printer,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import {
  adjustmentText,
  advisorCatalogue,
  advisorCopy as t,
  capsuleRouteLabels,
  cqaLabels,
  findingText,
  flagLabels,
  formLabels,
  ipcList,
  levelLabels,
  processText,
  riskWhy,
  roleLabels,
  routeLabels,
  routeNotes,
  specText,
} from "@/content/formulation-advisor";
import { challengeText, planCopy as pc, planNotes, planParams, planSteps, planTips } from "@/content/formulation-plan";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { excipientSlug } from "@/lib/excipient-slug";
import {
  advise,
  baseName,
  componentsFromLabel,
  noFlags,
  parseLabel,
  rankRoutes,
  suggestComponents,
  type Component,
  type DosageForm,
  type Flags,
  type Input,
  type Level,
  type Note,
  type Role,
  type Route,
} from "@/lib/formulation-advisor";
import { buildPlan } from "@/lib/formulation-plan";
import type { ObResult } from "@/lib/orange-book";
import { href } from "@/lib/paths";
import { fixed } from "./calc-format";
import { Field, TableWrap } from "./filters";

/** One API from the raw-materials database: name, molecular weight, BCS class. */
export type ApiEntry = [string, string, string];

type Props = { locale: Locale; incompatibilities: Record<string, Bi>; apis: ApiEntry[] };

const fmt = (s: string, values: Record<string, string | number> = {}) => s.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ""));
const say = (map: Record<string, Bi>, n: Note, locale: Locale) => fmt(map[n.code]?.[locale] ?? n.code, n.values);
const byKey = new Map(advisorCatalogue.map((c) => [c.key, c]));
const ROLES = Object.keys(roleLabels) as Role[];
const FORMS = Object.keys(formLabels) as DosageForm[];
const FLAGS = Object.keys(flagLabels) as (keyof Flags)[];
const RULES = Object.keys(findingText).length + Object.keys(routeNotes).length + Object.keys(riskWhy).length + Object.keys(processText).length;
type Tab = keyof typeof t.tabs;
const TABS: { key: Tab; icon: typeof FlaskConical }[] = [
  { key: "formula", icon: FlaskConical },
  { key: "batch", icon: Scale },
  { key: "process", icon: Cog },
  { key: "risk", icon: ShieldCheck },
  { key: "routes", icon: GitCompareArrows },
  { key: "specs", icon: FileText },
];

let nextId = 1;
const withId = (c: Omit<Component, "id">): Component => ({ ...c, id: `c${nextId++}` });
const num = (x: number, d = 2) => fixed(x, d);
const numIn = (v: string) => {
  const x = parseFloat(v);
  return Number.isFinite(x) ? x : undefined;
};

const levelStyle: Record<Level, string> = {
  high: "bg-red-50 text-red-700 ring-red-200",
  medium: "bg-amber-50 text-amber-800 ring-amber-200",
  low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function LevelChip({ level, locale }: { level: Level; locale: Locale }) {
  return <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${levelStyle[level]}`}>{levelLabels[level][locale]}</span>;
}

function Panel({ n, title, icon: Icon, children, className = "" }: { n: number; title: string; icon: typeof FlaskConical; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-card border border-line bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      <h3 className="mb-5 flex items-center gap-3 text-lg font-bold text-vault-900">
        <span className="grid size-9 place-items-center rounded-xl bg-vault-900 text-sm font-extrabold text-capsule-400">{n}</span>
        <Icon className="size-5 text-molecule-600" aria-hidden="true" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function Kpi({ label, value, sub, dark = false }: { label: string; value: ReactNode; sub?: ReactNode; dark?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${dark ? "bg-vault-900 text-white" : "border border-line bg-white"}`}>
      <dt className={`text-xs font-semibold ${dark ? "text-vault-100/70" : "text-muted"}`}>{label}</dt>
      <dd className={`mt-1 text-lg font-extrabold leading-snug ${dark ? "text-capsule-400" : "text-vault-900"}`} dir="ltr">
        {value}
      </dd>
      {sub && <dd className={`mt-0.5 text-xs ${dark ? "text-vault-100/70" : "text-muted"}`}>{sub}</dd>}
    </div>
  );
}

export function FormulationAdvisor({ locale, incompatibilities, apis }: Props) {
  const [api, setApi] = useState("");
  const [strength, setStrength] = useState("");
  const [form, setForm] = useState<DosageForm>("ir");
  const [use, setUse] = useState("");
  const [units, setUnits] = useState("100000");
  const [density, setDensity] = useState("0.6");
  const [coatGain, setCoatGain] = useState("3");
  const [routeSel, setRouteSel] = useState<Route | "">("");
  const [saltFactor, setSaltFactor] = useState("1");
  const [assay, setAssay] = useState("100");
  const [water, setWater] = useState("0");
  const [overage, setOverage] = useState("0");
  const [brand, setBrand] = useState("");
  const [brandWeight, setBrandWeight] = useState("");
  const [labelText, setLabelText] = useState("");
  const [flags, setFlags] = useState<Flags>(noFlags);
  const [components, setComponents] = useState<Component[]>([]);
  const [ob, setOb] = useState<ObResult | null>(null);
  const [obBusy, setObBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("formula");
  const [copied, setCopied] = useState(false);

  const s = numIn(strength) ?? 0;
  const input: Input = {
    form,
    strength: s,
    saltFactor: numIn(saltFactor),
    assay: numIn(assay),
    water: numIn(water),
    overage: numIn(overage),
    brandWeight: (numIn(brandWeight) ?? 0) > 0 ? numIn(brandWeight) : null,
    flags,
    components,
    units: (numIn(units) ?? 0) > 0 ? (numIn(units) as number) : 0,
    density: numIn(density),
    coatGain: numIn(coatGain) ?? 3,
    route: routeSel || null,
  };
  const result = s > 0 ? advise(input, advisorCatalogue) : null;

  // API from the database: BCS class and a salt factor when the base is listed too.
  const apiEntry = apis.find((a) => a[0].toLowerCase() === api.trim().toLowerCase());
  const base = apiEntry && baseName(apiEntry[0]) !== apiEntry[0].toLowerCase() ? apis.find((a) => a[0].toLowerCase() === baseName(apiEntry[0])) : undefined;
  const saltHint = apiEntry && base && parseFloat(apiEntry[1]) > 0 && parseFloat(base[1]) > 0 ? { base: base[0], f: (parseFloat(apiEntry[1]) / parseFloat(base[1])).toFixed(4), a: apiEntry[1], b: base[1] } : null;
  // BCS I / III: highly soluble (narrow liquid window in Wet Granulation).
  const plan = result ? buildPlan({ ...input, soluble: apiEntry?.[2] === "1" || apiEntry?.[2] === "3" }, result) : null;

  function chooseApi(v: string) {
    setApi(v);
    const e = apis.find((a) => a[0].toLowerCase() === v.trim().toLowerCase());
    if (e?.[2] === "2" || e?.[2] === "4") setFlags((f) => ({ ...f, poorlySoluble: true }));
  }

  function suggest() {
    if (!(s > 0)) return;
    const route = routeSel || rankRoutes(input)[0].route;
    setComponents(suggestComponents(form, route, flags).map(withId));
  }

  const labelMatches = labelText.trim() ? parseLabel(labelText, advisorCatalogue) : [];
  function buildFromLabel() {
    const route = routeSel || (s > 0 ? rankRoutes(input)[0].route : "wg");
    const list = componentsFromLabel(labelMatches, advisorCatalogue, form, route);
    if (list.length) setComponents(list.map(withId));
  }

  /** Orange Book by molecule (generic name) or, without an API, by brand: every brand and generic of the single-ingredient product. */
  async function findBrands() {
    const molecule = api.trim();
    const q = molecule.length >= 3 ? baseName(molecule) || molecule : brand.trim();
    if (q.length < 3) return;
    setObBusy(true);
    try {
      const res = await fetch(`/api/orange-book?q=${encodeURIComponent(q)}&discn=1&all=1`);
      setOb((await res.json()) as ObResult);
    } catch {
      setOb({ updated: null, iranUpdated: null, groups: [], total: 0 });
    } finally {
      setObBusy(false);
    }
  }

  const update = (id: string, patch: Partial<Component>) => setComponents((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const label = (key?: string, name?: string) => (key ? byKey.get(key)?.label : name) ?? name ?? "";
  const chosen = [...new Set(components.map((c) => c.key).filter(Boolean) as string[])];
  const brands = ob ? obBrands(ob, api, brand, form, s) : null;
  const dailymed = `https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(brand || api)}`;
  const routeName = (r: Route) => (form === "cap" ? capsuleRouteLabels : routeLabels)[r][locale];
  const apiName = api || t.apiRow[locale];

  function copyTable() {
    if (!result) return;
    const lines = [["Component", "Function", "% w/w", "mg/unit", "kg/batch"].join("\t")];
    for (const r of result.rows) lines.push([r.role === "api" ? apiName : label(r.key, r.name), r.role === "api" ? "API" : roleLabels[r.role].en, num(r.pct), num(r.mg), num(r.kg, 3)].join("\t"));
    navigator.clipboard?.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const scoreColor = !result ? "" : result.score >= 80 ? "text-emerald-400" : result.score >= 60 ? "text-capsule-400" : "text-red-400";

  return (
    <div className="space-y-6" id="advisor">
      {/* Hero */}
      <div className="relative isolate overflow-hidden rounded-3xl bg-vault-900 px-6 py-9 text-white shadow-2xl shadow-vault-900/20 sm:px-10">
        <div className="absolute -top-28 end-[-5rem] -z-10 size-80 rounded-full bg-capsule-500/25 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 start-[-4rem] -z-10 size-80 rounded-full bg-molecule-500/25 blur-3xl" aria-hidden="true" />
        <p className="inline-flex items-center gap-2 rounded-full border border-capsule-400/40 bg-capsule-400/10 px-3.5 py-1.5 text-sm font-bold text-capsule-400">
          <Sparkles className="size-4" aria-hidden="true" />
          {t.badge[locale]}
        </p>
        <h2 className="pv-gold-text mt-4 text-3xl font-extrabold sm:text-4xl">{t.title[locale]}</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-vault-100/85">{t.lead[locale]}</p>
        <dl className="mt-6 grid max-w-2xl grid-cols-3 gap-3">
          {[
            [advisorCatalogue.length, t.stats.excipients],
            [apis.length, t.stats.apis],
            [RULES, t.stats.rules],
          ].map(([n, l]) => (
            <div key={(l as Bi).en} className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3 text-center">
              <dd className="text-2xl font-extrabold text-capsule-400" dir="ltr">
                {n as number}
              </dd>
              <dt className="mt-1 text-xs font-semibold text-vault-100/75">{(l as Bi)[locale]}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel n={1} title={t.step1[locale]} icon={FlaskConical}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.api[locale]} htmlFor="fa-api">
              <input id="fa-api" dir="ltr" list="fa-apis" className="field-input" placeholder={t.apiPh[locale]} value={api} onChange={(e) => chooseApi(e.target.value)} />
              <datalist id="fa-apis">
                {apis.map((a) => (
                  <option key={a[0]} value={a[0]} />
                ))}
              </datalist>
            </Field>
            <Field label={t.strength[locale]} htmlFor="fa-str">
              <input id="fa-str" type="number" min="0" step="any" className="field-input" value={strength} onChange={(e) => setStrength(e.target.value)} />
            </Field>
            {apiEntry && (
              <p className="flex flex-wrap items-center gap-2 text-xs text-muted sm:col-span-2">
                <span className="rounded-full bg-molecule-50 px-2.5 py-0.5 font-semibold text-molecule-700">{t.apiInfo[locale]}</span>
                <span dir="ltr">
                  {t.mw[locale]} {apiEntry[1]}
                </span>
                {apiEntry[2] && <span className="rounded-full bg-capsule-50 px-2.5 py-0.5 font-semibold text-capsule-700">{fmt(t.bcsAuto[locale], { c: apiEntry[2] })}</span>}
              </p>
            )}
            <Field label={t.form[locale]} htmlFor="fa-form">
              <select id="fa-form" className="field-input" value={form} onChange={(e) => setForm(e.target.value as DosageForm)}>
                {FORMS.map((f) => (
                  <option key={f} value={f}>
                    {formLabels[f][locale]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t.routeSel[locale]} htmlFor="fa-route">
              <select id="fa-route" className="field-input" value={routeSel} onChange={(e) => setRouteSel(e.target.value as Route | "")}>
                <option value="">{t.routeAuto[locale]}</option>
                {(["dc", "wg", "dg"] as Route[]).map((r) => (
                  <option key={r} value={r}>
                    {routeName(r)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t.use[locale]} htmlFor="fa-use">
              <input id="fa-use" className="field-input" placeholder={t.usePh[locale]} value={use} onChange={(e) => setUse(e.target.value)} />
            </Field>
            <Field label={t.units[locale]} htmlFor="fa-units">
              <input id="fa-units" type="number" min="0" step="1" className="field-input" value={units} onChange={(e) => setUnits(e.target.value)} />
            </Field>
            {form === "fc" && (
              <Field label={t.coatGain[locale]} htmlFor="fa-coat">
                <input id="fa-coat" type="number" min="0" step="0.5" className="field-input" value={coatGain} onChange={(e) => setCoatGain(e.target.value)} />
              </Field>
            )}
            {form === "cap" && (
              <Field label={t.density[locale]} htmlFor="fa-den">
                <input id="fa-den" type="number" min="0" step="0.05" className="field-input" value={density} onChange={(e) => setDensity(e.target.value)} />
              </Field>
            )}
          </div>
        </Panel>

        <Panel n={2} title={t.step2[locale]} icon={Scale}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t.saltFactor[locale]} htmlFor="fa-salt">
              <input id="fa-salt" type="number" min="1" step="0.0001" className="field-input" value={saltFactor} onChange={(e) => setSaltFactor(e.target.value)} />
            </Field>
            <Field label={t.assay[locale]} htmlFor="fa-assay">
              <input id="fa-assay" type="number" min="1" max="110" step="0.1" className="field-input" value={assay} onChange={(e) => setAssay(e.target.value)} />
            </Field>
            <Field label={t.water[locale]} htmlFor="fa-water">
              <input id="fa-water" type="number" min="0" max="50" step="0.1" className="field-input" value={water} onChange={(e) => setWater(e.target.value)} />
            </Field>
            <Field label={t.overage[locale]} htmlFor="fa-over">
              <input id="fa-over" type="number" min="0" max="20" step="0.5" className="field-input" value={overage} onChange={(e) => setOverage(e.target.value)} />
            </Field>
          </div>
          {saltHint && (
            <p className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-molecule-50 px-4 py-3 text-sm text-vault-900">
              <span>{fmt(t.saltHint[locale], saltHint)}</span>
              <button type="button" onClick={() => setSaltFactor(saltHint.f)} className="rounded-full bg-molecule-600 px-3 py-1 text-xs font-bold text-white hover:bg-molecule-700">
                {t.useSalt[locale]}
              </button>
            </p>
          )}
        </Panel>
      </div>

      <Panel n={3} title={t.step3[locale]} icon={Search}>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <Field label={t.brand[locale]} htmlFor="fa-brand">
              <div className="flex gap-2">
                <input id="fa-brand" dir="ltr" className="field-input min-w-0 flex-1" placeholder={t.brandPh[locale]} value={brand} onChange={(e) => setBrand(e.target.value)} />
                <button
                  type="button"
                  onClick={findBrands}
                  disabled={obBusy}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-molecule-600 px-3 text-sm font-semibold text-white transition hover:bg-molecule-700 disabled:opacity-60"
                >
                  <Search className="size-4" aria-hidden="true" />
                  {obBusy ? t.checking[locale] : t.findBrands[locale]}
                </button>
              </div>
            </Field>
            <Field label={t.brandWeight[locale]} htmlFor="fa-bw">
              <input id="fa-bw" type="number" min="0" step="any" className="field-input" value={brandWeight} onChange={(e) => setBrandWeight(e.target.value)} />
            </Field>
            <p className="text-sm text-muted">{t.brandWeightHint[locale]}</p>
            {brands && (
              <div className="rounded-xl border border-line bg-vault-50 p-4 text-sm">
                {brands.ingredient ? (
                  <>
                    <p className="mb-1 font-bold text-vault-900" dir="ltr">
                      {brands.ingredient}
                    </p>
                    <p className="mb-3 text-xs text-muted">{fmt(t.obSummary[locale], { n: brands.nda.length, g: brands.generics.length, f: brands.formLabel })}</p>
                    <ul className="space-y-2" dir="ltr">
                      {brands.nda.map((b) => (
                        <li key={`${b.trade}-${b.applicant}`} className="flex flex-wrap items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-line">
                          <b className="text-vault-900">{b.trade}</b>
                          {b.rld && <span className="rounded bg-capsule-400 px-1.5 text-[10px] font-extrabold text-vault-900">RLD</span>}
                          {b.rs && <span className="rounded bg-molecule-600 px-1.5 text-[10px] font-extrabold text-white">RS</span>}
                          {b.discontinued && <span className="text-[11px] text-muted">(discontinued)</span>}
                          <span className="text-xs text-muted">{b.applicant}</span>
                          <span className="flex flex-wrap gap-1">
                            {b.strengths.map((st) => (
                              <span key={st.label} className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.match ? "bg-emerald-600 text-white" : "bg-vault-50 text-vault-900"}`}>
                                {st.label}
                              </span>
                            ))}
                          </span>
                          <button type="button" onClick={() => setBrand(titleCase(b.trade))} className="ms-auto rounded-full border border-line px-2.5 py-0.5 text-xs font-bold text-molecule-700 hover:border-molecule-400">
                            {t.pickBrand[locale]}
                          </button>
                        </li>
                      ))}
                    </ul>
                    {brands.generics.length > 0 && (
                      <>
                        <p className="mb-1.5 mt-4 text-xs font-bold text-vault-900">{fmt(t.obGenerics[locale], { g: brands.generics.length })}</p>
                        <p className="flex flex-wrap gap-1.5" dir="ltr">
                          {brands.generics.slice(0, 18).map((g) => (
                            <span key={g} className="rounded-full bg-white px-2 py-0.5 text-[11px] text-muted ring-1 ring-line">
                              {g}
                            </span>
                          ))}
                          {brands.generics.length > 18 && <span className="text-[11px] text-muted">+{brands.generics.length - 18}</span>}
                        </p>
                      </>
                    )}
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
          </div>
          <div className="space-y-3">
            <Field label={t.label[locale]} htmlFor="fa-label">
              <textarea id="fa-label" dir="ltr" rows={5} className="field-input min-h-32 resize-y" placeholder={t.labelPh[locale]} value={labelText} onChange={(e) => setLabelText(e.target.value)} />
            </Field>
            {labelMatches.length > 0 && (
              <>
                <ul className="flex flex-wrap gap-2" dir="ltr">
                  {labelMatches.map((m, i) => (
                    <li
                      key={`${m.text}-${i}`}
                      title={m.key ? t.labelCore[locale] : m.coating ? t.labelCoat[locale] : t.labelUnknown[locale]}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${m.key ? "bg-molecule-50 text-molecule-700 ring-molecule-200" : m.coating ? "bg-capsule-50 text-capsule-700 ring-capsule-100" : "bg-vault-50 text-muted ring-line"}`}
                    >
                      {m.key ? byKey.get(m.key)?.label : m.text}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={buildFromLabel}
                  className="inline-flex items-center gap-2 rounded-full bg-vault-900 px-5 py-2.5 text-sm font-bold text-capsule-400 transition hover:bg-vault-800"
                >
                  <Wand2 className="size-4" aria-hidden="true" />
                  {t.fromLabel[locale]}
                </button>
              </>
            )}
          </div>
        </div>
      </Panel>

      <Panel n={4} title={t.step4[locale]} icon={Atom}>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {FLAGS.map((k) => (
            <label
              key={k}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition ${flags[k] ? "border-molecule-500 bg-molecule-50 text-vault-900" : "border-line hover:border-molecule-300"}`}
            >
              <input type="checkbox" className="size-4 accent-molecule-600" checked={flags[k]} onChange={(e) => setFlags((f) => ({ ...f, [k]: e.target.checked }))} />
              {flagLabels[k][locale]}
            </label>
          ))}
        </div>
      </Panel>

      <Panel n={5} title={t.step5[locale]} icon={ClipboardList}>
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
          {components.length > 0 && (
            <button type="button" onClick={() => setComponents([])} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-muted hover:text-red-600">
              <Trash2 className="size-4" aria-hidden="true" />
              {t.clear[locale]}
            </button>
          )}
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
                      dir="ltr"
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
                          {x.label}
                        </option>
                      ))}
                      <option value="__custom">{t.custom[locale]}</option>
                    </select>
                    {!c.key && <input className="field-input" dir="ltr" placeholder={t.customPh[locale]} value={c.custom ?? ""} onChange={(e) => update(c.id, { custom: e.target.value })} />}
                  </div>
                  <select aria-label={t.role[locale]} dir="ltr" className="field-input" value={c.role} onChange={(e) => update(c.id, { role: e.target.value as Role, pct: undefined })}>
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
      </Panel>

      {!result ? (
        <p className="rounded-card border border-dashed border-line p-8 text-center text-muted">{t.empty[locale]}</p>
      ) : (
        <section className="space-y-6 rounded-3xl border border-capsule-400/50 bg-gradient-to-b from-capsule-400/10 to-white p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="flex items-center gap-2 text-2xl font-extrabold text-vault-900">
                <FlaskConical className="size-6 text-molecule-600" aria-hidden="true" />
                {t.result[locale]}
              </h3>
              <p className="mt-1 text-sm text-muted">
                <span dir="ltr">{[api, `${s} mg`, formLabels[form].en, brand && `(ref. ${brand})`].filter(Boolean).join(" · ")}</span>
                {use && ` · ${use}`}
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button type="button" onClick={copyTable} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-vault-900 transition hover:border-molecule-400">
                {copied ? <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" /> : <ClipboardCopy className="size-4" aria-hidden="true" />}
                {copied ? t.copied[locale] : t.copy[locale]}
              </button>
              <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-vault-900 transition hover:border-molecule-400">
                <Printer className="size-4" aria-hidden="true" />
                {t.print[locale]}
              </button>
            </div>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Kpi dark label={t.route[locale]} value={routeName(result.route)} sub={result.auto ? t.routeAuto[locale] : undefined} />
            <Kpi
              label={t.weight[locale]}
              value={`${num(result.weight, 1)} mg`}
              sub={
                result.coatMg > 0 ? (
                  <>
                    {t.core[locale]} <bdi>{num(result.coreWeight, 1)} mg</bdi> + {t.coat[locale]} <bdi>{num(result.coatMg, 1)} mg</bdi>
                  </>
                ) : undefined
              }
            />
            <Kpi label={t.apiLoad[locale]} value={`${num(result.apiPct, 1)}%`} sub={<bdi>{num(result.apiMg)} mg API</bdi>} />
            {result.capsule ? (
              <Kpi label={t.capsuleSize[locale]} value={`#${result.capsule.size}`} sub={fmt(t.capsuleNote[locale], { v: result.capsule.volume, s: result.capsule.size, f: result.capsule.fill })} />
            ) : result.tooling ? (
              <Kpi
                label={t.tooling[locale]}
                value={result.tooling.shape === "round" ? `Ø ${result.tooling.size} mm` : `${result.tooling.size} mm`}
                sub={<bdi>{result.tooling.force ? `Breaking force ${result.tooling.force[0]}–${result.tooling.force[1]} N` : "Caplet"}</bdi>}
              />
            ) : null}
            <div className="rounded-2xl bg-vault-900 p-4 text-white">
              <dt className="text-xs font-semibold text-vault-100/70">{t.scoreLabel[locale]}</dt>
              <dd className={`mt-1 text-3xl font-extrabold ${scoreColor}`} dir="ltr">
                {result.score}
                <span className="text-sm text-vault-100/60">/100</span>
              </dd>
              <dd className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <span className="block h-full rounded-full bg-gradient-to-r from-capsule-400 to-emerald-400" style={{ width: `${result.score}%` }} />
              </dd>
            </div>
          </dl>

          {!result.feasible && (
            <p className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
              <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              {say(findingText, result.findings.find((f) => f.code === "infeasible")!, locale)}
            </p>
          )}

          <div role="tablist" className="flex gap-1 overflow-x-auto rounded-2xl border border-line bg-white p-1.5 print:hidden">
            {TABS.map(({ key, icon: Icon }) => (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${tab === key ? "bg-vault-900 text-capsule-400 shadow" : "text-vault-900 hover:bg-vault-50"}`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {t.tabs[key][locale]}
              </button>
            ))}
          </div>

          {tab === "formula" && (
            <div className="space-y-5">
              <TableWrap>
                <table className="db bg-white">
                  <thead>
                    <tr>
                      <th>{t.component[locale]}</th>
                      <th>{t.role[locale]}</th>
                      <th>{t.grade[locale]}</th>
                      <th>% w/w</th>
                      <th>{t.mg[locale]}</th>
                      <th>{t.kg[locale]}</th>
                      <th>{t.range[locale]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r) => {
                      const item = r.key ? byKey.get(r.key) : undefined;
                      const name = r.role === "api" ? apiName : label(r.key, r.name);
                      return (
                        <tr key={r.id} className={r.out ? "bg-amber-50" : r.role === "api" ? "bg-molecule-50/60 font-semibold" : ""}>
                          <td className="text-start" dir="ltr">
                            {item ? (
                              <Link href={href(locale, `excipients/${excipientSlug(item.name)}`)} className="text-molecule-700 hover:underline">
                                {name}
                              </Link>
                            ) : (
                              name
                            )}
                          </td>
                          <td dir="ltr">
                            {r.role === "api" ? "API" : roleLabels[r.role][locale]}
                            {r.switched && <span className="ms-1 rounded bg-capsule-50 px-1.5 text-[10px] font-bold text-capsule-700">{t.switchedTag[locale]}</span>}
                          </td>
                          <td className="text-xs text-muted" dir="ltr">
                            {r.grade && r.grade !== "—" ? r.grade : "–"}
                          </td>
                          <td className="num">
                            {r.qs && <span className="me-1 text-xs text-muted">{t.qs[locale]}</span>}
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
                      <td colSpan={3}>
                        {t.total[locale]} ({t.core[locale]})
                      </td>
                      <td className="num">{num(result.sum)}</td>
                      <td className="num">{num(result.coreWeight)}</td>
                      <td className="num">{input.units ? num((result.coreWeight * input.units) / 1e6, 3) : "–"}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </TableWrap>
              {result.adjustments.length > 0 && (
                <div className="rounded-2xl border border-molecule-100 bg-molecule-50/60 p-5">
                  <h4 className="mb-2 flex items-center gap-2 font-bold text-vault-900">
                    <Cog className="size-5 text-molecule-600" aria-hidden="true" />
                    {t.adjustments[locale]}
                  </h4>
                  <ul className="space-y-1.5 text-sm leading-relaxed">
                    {result.adjustments.map((a, i) => (
                      <li key={`${a.code}-${i}`} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-molecule-500" aria-hidden="true" />
                        {say(adjustmentText, a, locale)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Findings result={result} locale={locale} />
            </div>
          )}

          {tab === "batch" && (
            <div className="space-y-3">
              <TableWrap>
                <table className="db bg-white">
                  <thead>
                    <tr>
                      <th>{t.component[locale]}</th>
                      <th>{t.role[locale]}</th>
                      <th>{t.kg[locale]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.batch.rows.map((b) => (
                      <tr key={b.id} className={b.role === "api" ? "bg-molecule-50/60 font-semibold" : ""}>
                        <td className="text-start" dir="ltr">
                          {b.role === "api" ? apiName : label(b.key, b.name)}
                        </td>
                        <td dir="ltr">{b.role === "api" ? "API" : roleLabels[b.role][locale]}</td>
                        <td className="num">{num(b.kg, 3)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td colSpan={2}>{t.total[locale]}</td>
                      <td className="num">{num(result.batch.total, 3)}</td>
                    </tr>
                  </tfoot>
                </table>
              </TableWrap>
              <p className="text-sm text-muted">{fmt(t.batchNote[locale], { f: result.batch.apiFactor })}</p>
            </div>
          )}

          {tab === "process" && plan && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-line bg-white p-5">
                <h4 className="mb-4 flex flex-wrap items-center gap-2 font-bold text-vault-900">
                  <Cog className="size-5 text-molecule-600" aria-hidden="true" />
                  {pc.plan[locale]} — <span dir="ltr">{routeName(result.route)}</span>
                </h4>
                <ol className="space-y-4">
                  {plan.steps.map((st, i) => {
                    const meta = planSteps[st.code];
                    return (
                      <li key={`${st.code}-${i}`} className="relative rounded-2xl border border-line p-4 ps-14">
                        <span className="absolute start-4 top-4 grid size-8 place-items-center rounded-full bg-vault-900 text-xs font-extrabold text-capsule-400" dir="ltr">
                          {i + 1}
                        </span>
                        <p className="font-bold text-vault-900">{meta.title[locale]}</p>
                        <p className="mt-1 text-sm leading-relaxed text-ink">{meta.purpose[locale]}</p>
                        <p className="mt-1 text-xs text-muted">
                          <b>{pc.equipment[locale]}:</b> {meta.equipment[locale]}
                        </p>
                        {st.params.length > 0 && (
                          <ul className="mt-3 space-y-1.5 text-sm leading-relaxed">
                            {st.params.map((p, k) => (
                              <li key={`${p.code}-${k}`} className="flex gap-2">
                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-molecule-500" aria-hidden="true" />
                                {say(planParams, p, locale)}
                              </li>
                            ))}
                          </ul>
                        )}
                        {st.tips.length > 0 && (
                          <div className="mt-3 rounded-xl bg-capsule-50 p-3">
                            <p className="mb-1 text-xs font-bold text-capsule-700">{pc.tips[locale]}</p>
                            <ul className="space-y-1.5 text-sm leading-relaxed">
                              {st.tips.map((tp, k) => (
                                <li key={`${tp.code}-${k}`} className="flex gap-2">
                                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-capsule-600" aria-hidden="true" />
                                  {say(planTips, tp, locale)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5">
                <h4 className="mb-3 font-bold text-vault-900">{pc.challenges[locale]}</h4>
                {plan.challenges.length ? (
                  <TableWrap>
                    <table className="db">
                      <thead>
                        <tr>
                          <th>{pc.challenge[locale]}</th>
                          <th>{pc.formula[locale]}</th>
                          <th>{pc.process[locale]}</th>
                          <th>{pc.monitor[locale]}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {plan.challenges.map((c) => {
                          const ct = challengeText[c.code];
                          return (
                            <tr key={c.code}>
                              <td className="text-start font-semibold">{fmt(ct.title[locale], c.values)}</td>
                              <td className="text-start text-sm">{ct.formula[locale]}</td>
                              <td className="text-start text-sm">{ct.process[locale]}</td>
                              <td className="text-start text-sm">{ct.monitor[locale]}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </TableWrap>
                ) : (
                  <p className="text-sm text-muted">{pc.noChallenges[locale]}</p>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <h4 className="mb-3 font-bold text-vault-900">{pc.doe[locale]}</h4>
                  <ul className="space-y-2 text-sm leading-relaxed">
                    {plan.doe.map((d) => (
                      <li key={d.code} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-capsule-500" aria-hidden="true" />
                        {say(planNotes, d, locale)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <h4 className="mb-3 font-bold text-vault-900">{pc.scaleUp[locale]}</h4>
                    <ul className="space-y-2 text-sm leading-relaxed">
                      {plan.scaleUp.map((d) => (
                        <li key={d.code} className="flex gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-molecule-500" aria-hidden="true" />
                          {say(planNotes, d, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <h4 className="mb-3 font-bold text-vault-900">{pc.packaging[locale]}</h4>
                    <ul className="space-y-2 text-sm leading-relaxed">
                      {plan.packaging.map((d) => (
                        <li key={d.code} className="flex gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-molecule-500" aria-hidden="true" />
                          {say(planNotes, d, locale)}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-line bg-white p-5">
                    <h4 className="mb-3 font-bold text-vault-900">{t.ipc[locale]}</h4>
                    <ul className="list-disc space-y-2 ps-5 text-sm leading-relaxed">
                      {ipcList.map((c) => (
                        <li key={c.en}>{c[locale]}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "risk" && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-line bg-white p-5">
                <h4 className="mb-3 font-bold text-vault-900">{t.risk[locale]}</h4>
                <TableWrap>
                  <table className="db">
                    <thead>
                      <tr>
                        <th>{t.cqa[locale]}</th>
                        <th>{t.level[locale]}</th>
                        <th>{t.why[locale]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.risks.map((r) => (
                        <tr key={r.cqa}>
                          <td className="text-start font-semibold" dir="ltr">
                            {cqaLabels[r.cqa][locale]}
                          </td>
                          <td>
                            <LevelChip level={r.level} locale={locale} />
                          </td>
                          <td className="text-start text-sm">{r.why.map((w) => riskWhy[w.code][locale]).join("؛ ") || "–"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TableWrap>
              </div>
              <Findings result={result} locale={locale} />
              {chosen.some((k) => incompatibilities[k]) && (
                <details className="rounded-2xl border border-line bg-white p-5">
                  <summary className="cursor-pointer font-bold text-vault-900">{t.incompat[locale]}</summary>
                  <dl className="mt-3 space-y-3 text-sm leading-relaxed">
                    {chosen
                      .filter((k) => incompatibilities[k])
                      .map((k) => (
                        <div key={k}>
                          <dt className="font-semibold text-vault-900" dir="ltr">
                            {byKey.get(k)?.label}
                          </dt>
                          <dd className="text-muted">{incompatibilities[k][locale]}</dd>
                        </div>
                      ))}
                  </dl>
                </details>
              )}
            </div>
          )}

          {tab === "routes" && (
            <div className="grid gap-4 lg:grid-cols-3">
              {result.routes.map((r) => {
                const active = r.route === result.route;
                return (
                  <div key={r.route} className={`flex flex-col rounded-2xl border p-5 ${active ? "border-capsule-400 bg-white shadow-lg shadow-capsule-500/10" : "border-line bg-white"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-vault-900" dir="ltr">
                        {routeName(r.route)}
                      </h4>
                      <span className="text-2xl font-extrabold text-vault-900" dir="ltr">
                        {r.score}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-vault-50">
                      <span className="block h-full rounded-full bg-gradient-to-r from-molecule-500 to-capsule-400" style={{ width: `${r.score}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-muted" dir="ltr">
                      {num(r.weight, 0)} mg · {t.load[locale]} {num(r.load, 1)}%
                    </p>
                    <p className="mt-4 text-xs font-bold text-emerald-700">{t.pros[locale]}</p>
                    <ul className="mt-1 space-y-1 text-sm leading-relaxed">
                      {r.pros.map((n) => (
                        <li key={n.code}>+ {say(routeNotes, n, locale)}</li>
                      ))}
                    </ul>
                    {r.cons.length > 0 && (
                      <>
                        <p className="mt-3 text-xs font-bold text-red-700">{t.cons[locale]}</p>
                        <ul className="mt-1 space-y-1 text-sm leading-relaxed">
                          {r.cons.map((n) => (
                            <li key={n.code}>− {say(routeNotes, n, locale)}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    <div className="mt-auto pt-4">
                      {active ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-vault-900 px-3 py-1.5 text-xs font-bold text-capsule-400">
                          <CheckCircle2 className="size-4" aria-hidden="true" />
                          {t.chosen[locale]}
                        </span>
                      ) : (
                        <button type="button" onClick={() => setRouteSel(r.route)} className="rounded-full border border-line px-3 py-1.5 text-xs font-bold text-vault-900 hover:border-molecule-400">
                          {t.useRoute[locale]}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "specs" && (
            <div className="rounded-2xl border border-line bg-white p-5">
              <ul className="space-y-2.5 text-sm leading-relaxed">
                {result.specs.map((sp, i) => (
                  <li key={`${sp.code}-${i}`} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-molecule-600" aria-hidden="true" />
                    {say(specText, sp, locale)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs leading-relaxed text-muted">{t.disclaimer[locale]}</p>
        </section>
      )}
    </div>
  );
}

/* Orange Book brands of one molecule ---------------------------------- */

const SALT_ALIAS: [RegExp, string][] = [
  [/BESILATE/g, "BESYLATE"],
  [/MESILATE/g, "MESYLATE"],
  [/TOSILATE/g, "TOSYLATE"],
  [/SULPHATE/g, "SULFATE"],
];
const obNorm = (x: string) => SALT_ALIAS.reduce((v, [re, to]) => v.replace(re, to), x.toUpperCase()).replace(/[^A-Z0-9]+/g, " ").trim();
const titleCase = (x: string) => x.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());

/** Orange Book dosage-form text for the advisor's forms (immediate release only). */
const OB_FORM: Record<DosageForm, { re: RegExp; label: string }> = {
  ir: { re: /^TABLET(, FILM COATED)?;ORAL$/, label: "TABLET;ORAL" },
  fc: { re: /^TABLET(, FILM COATED)?;ORAL$/, label: "TABLET;ORAL" },
  chew: { re: /CHEWABLE/, label: "TABLET, CHEWABLE" },
  odt: { re: /ORALLY DISINTEGRATING/, label: "TABLET, ORALLY DISINTEGRATING" },
  cap: { re: /^CAPSULE;ORAL$/, label: "CAPSULE;ORAL" },
};

type ObBrand = { trade: string; applicant: string; rld: boolean; rs: boolean; discontinued: boolean; strengths: { label: string; match: boolean }[] };

/**
 * The single-ingredient product that matches the molecule (exact name first,
 * then the base name), restricted to the dosage form: NDA brands with their
 * strengths (the entered strength highlighted) and the ANDA generic holders.
 */
function obBrands(ob: ObResult, api: string, brand: string, form: DosageForm, strength: number) {
  const single = ob.groups.filter((g) => !g.ingredient.includes(";"));
  const want = obNorm(api);
  const base = obNorm(baseName(api));
  const trade = obNorm(brand);
  const group =
    single.find((g) => api && obNorm(g.ingredient) === want) ??
    single.find((g) => api && base && obNorm(g.ingredient).startsWith(base)) ??
    single.find((g) => trade && g.products.some((p) => obNorm(p.trade) === trade)) ??
    single[0];
  const { re, label } = OB_FORM[form];
  const empty = { ingredient: "", nda: [] as ObBrand[], generics: [] as string[], formLabel: label };
  if (!group) return empty;
  let products = group.products.filter((p) => re.test(p.form));
  if (!products.length) products = group.products.filter((p) => !/EXTENDED|DELAYED|INJECT|SOLUTION|SUSPENSION/.test(p.form));
  const mg = (x: string) => parseFloat((x.match(/([\d.]+)\s*MG/) ?? [])[1] ?? "NaN");
  const nda = new Map<string, ObBrand>();
  const generics = new Set<string>();
  for (const p of products) {
    if (p.applType === "A") {
      generics.add(titleCase(p.applicant));
      continue;
    }
    const k = `${p.trade}|${p.applicant}`;
    const b = nda.get(k) ?? { trade: p.trade, applicant: titleCase(p.applicant), rld: false, rs: false, discontinued: true, strengths: [] };
    b.rld ||= p.rld;
    b.rs ||= p.rs;
    if (p.type !== "D") b.discontinued = false;
    const st = p.strength.replace(/\s*\*\*.*$/, "");
    if (!b.strengths.some((x) => x.label === st)) b.strengths.push({ label: st, match: strength > 0 && Math.abs(mg(st) - strength) < 1e-6 });
    nda.set(k, b);
  }
  const list = [...nda.values()].sort(
    (a, b) => Number(b.trade === trade || obNorm(b.trade) === trade) - Number(obNorm(a.trade) === trade) || Number(b.rld) - Number(a.rld) || Number(a.discontinued) - Number(b.discontinued) || a.trade.localeCompare(b.trade),
  );
  return { ingredient: group.ingredient, nda: list.slice(0, 10), generics: [...generics].sort(), formLabel: label };
}

function Findings({ result, locale }: { result: NonNullable<ReturnType<typeof advise>>; locale: Locale }) {
  const list = result.findings.filter((f) => f.code !== "infeasible");
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <h4 className="mb-3 flex items-center gap-2 font-bold text-vault-900">
        <AlertTriangle className="size-5 text-capsule-600" aria-hidden="true" />
        {t.findings[locale]}
      </h4>
      {list.length ? (
        <ul className="space-y-2.5 text-sm leading-relaxed">
          {list.map((f, i) => (
            <li key={`${f.code}-${i}`} className="flex items-start gap-3">
              <LevelChip level={f.level} locale={locale} />
              <span>{say(findingText, f, locale)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          {t.noFindings[locale]}
        </p>
      )}
    </div>
  );
}
