"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { BookmarkPlus, Download, FolderOpen, ImagePlus, Lock, Plus, Printer, RotateCcw, Trash2, X } from "lucide-react";
import { coaBuilderCopy as t, coaTests, materialTypes, optionTests, pharmacopoeias, publicSpecs, type CoaMaterialType, type Pharmacopoeia } from "@/content/coa-builder";
import type { Locale } from "@/i18n/config";
import { isolateText } from "@/lib/bidi";
import { buildRows, coaDocument, conformity, emptyDetails, methodLabel, type CoaOptions, type CoaRow, type CoaState, type Route } from "@/lib/coa-doc";
import { deleteCoaSpec, listCoaSpecs, saveCoaSpec, type SavedSpec } from "@/lib/coa-spec-actions";
import { loadLogo, pngBytes, printHtml, saveBlob, type LogoImage } from "@/lib/doc-export";
import { buildDocx } from "@/lib/docx";
import { documentHtml } from "@/lib/form-doc";
import { q3cSolvents } from "@/lib/ich-limits";

/** A material of the site's databases: name, CAS, formula, MW and its group (excipients are "exc"). */
export type CoaMaterial = { n: string; c?: string; f?: string; w?: string; g: string };

const DRAFT = "pv-coa:draft";
const META = "pv-coa:meta";
const read = <T,>(key: string): T | null => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
};
const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: the certificate still works, it just is not kept
  }
};

const SALT = /\b(hydrochloride|hydrobromide|sodium|potassium|calcium|magnesium|zinc|sulfate|sulphate|maleate|fumarate|tartrate|citrate|mesylate|mesilate|besylate|besilate|tosylate|succinate|acetate|phosphate|lactate|gluconate|nitrate|bromide|chloride|hyclate|meglumine|tromethamine|oxalate|pamoate|malate)\b/i;
const HYDRATE = /hydrate|·\s*\d*\s*H2O/i;

const typeOf = (g: string): CoaMaterialType => (g === "exc" ? "excipient" : g === "abx" ? "antibiotic" : g === "vit" ? "vitamin" : g === "min" ? "mineral" : "api");

const baseOptions: CoaOptions = { salt: false, hydrate: false, chiral: false, sterile: false, micro: false, potency: false };

const fresh = (locale: Locale): CoaState => {
  const base = { material: "", ph: "usp" as Pharmacopoeia, type: "api" as CoaMaterialType, options: baseOptions, route: "oral" as Route, solvents: [] as string[], extra: [] as string[] };
  return { ...base, details: emptyDetails, rows: buildRows(base, [], locale), remarks: "", signs: { analysed: { name: "", date: "" }, checked: { name: "", date: "" }, approved: { name: "", date: "" } } };
};

const inputClass = "field-input w-full text-sm";
const noSubscribe = () => () => {};

export function CoaBuilder(props: { locale: Locale; materials: CoaMaterial[]; allowed: boolean; signedIn: boolean; buyHref: string }) {
  // Drafts live in this browser's storage, so the builder renders in the browser only.
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  return mounted ? <Builder {...props} /> : <div className="min-h-[60vh]" aria-busy="true" />;
}

function Builder({ locale, materials, allowed, signedIn, buyHref }: { locale: Locale; materials: CoaMaterial[]; allowed: boolean; signedIn: boolean; buyHref: string }) {
  const L = (b: { en: string; fa: string }) => b[locale];
  const [state, setState] = useState<CoaState>(() => read<CoaState>(DRAFT) ?? fresh(locale));
  const [logo, setLogo] = useState<LogoImage | undefined>(() => read<{ logo?: LogoImage }>(META)?.logo);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState(false);
  const [specName, setSpecName] = useState("");
  const [specs, setSpecs] = useState<SavedSpec[] | null>(null);
  const [libMsg, setLibMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => write(DRAFT, state), [state]);
  useEffect(() => write(META, { logo }), [logo]);
  useEffect(() => {
    if (!signedIn) return;
    let live = true;
    listCoaSpecs().then((r) => live && r.ok && setSpecs(r.specs));
    return () => {
      live = false;
    };
  }, [signedIn]);

  /** Changes the material, pharmacopoeia or options and rebuilds the rows, keeping what was typed. */
  const reshape = (patch: Partial<CoaState>) =>
    setState((s) => {
      const next = { ...s, ...patch };
      return { ...next, rows: buildRows(next, s.rows, locale) };
    });

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return materials
      .filter((m) => m.n.toLowerCase().includes(q) || (m.c ?? "").includes(q))
      .sort((a, b) => Number(!a.n.toLowerCase().startsWith(q)) - Number(!b.n.toLowerCase().startsWith(q)) || a.n.length - b.n.length)
      .slice(0, 8);
  }, [materials, query]);

  const pick = (m: CoaMaterial) => {
    setQuery("");
    setState((s) => {
      const next: CoaState = {
        ...s,
        material: m.n,
        type: typeOf(m.g),
        options: { ...s.options, salt: SALT.test(m.n), hydrate: HYDRATE.test(m.n) || HYDRATE.test(m.f ?? ""), potency: false, micro: ["excipient", "vitamin", "mineral"].includes(typeOf(m.g)) },
        details: { ...s.details, cas: m.c ?? "", formula: m.f ?? "", mw: m.w ?? "" },
      };
      return { ...next, rows: buildRows(next, [], locale) };
    });
  };

  const setRow = (key: string, patch: Partial<CoaRow>) => setState((s) => ({ ...s, rows: s.rows.map((r) => (r.key === key ? { ...r, ...patch } : r)) }));
  const removeRow = (key: string) =>
    setState((s) => {
      const extra = s.extra.filter((e) => e !== key);
      const solvents = key.startsWith("rsolv:") ? s.solvents.filter((x) => `rsolv:${x}` !== key) : s.solvents;
      return { ...s, extra, solvents, rows: s.rows.filter((r) => r.key !== key) };
    });

  const doc = useMemo(() => {
    const d = coaDocument(state, locale);
    return logo ? { ...d, logo: { png: pngBytes(logo.dataUrl), width: logo.width, height: logo.height } } : d;
  }, [state, locale, logo]);
  const html = useMemo(() => documentHtml(doc, logo?.dataUrl), [doc, logo]);
  const fileName = `CoA-${(state.material || "material").replace(/[^\w.-]+/g, "_")}-${(state.details.batch || "batch").replace(/[^\w.-]+/g, "_")}`;
  const guard = (action: () => void) => () => (allowed ? action() : setNotice(true));
  const downloadWord = guard(() => saveBlob(buildDocx(doc), `${fileName}.docx`));
  const print = guard(() => printHtml(html, fileName));

  const saveSpec = async () => {
    setLibMsg("");
    const name = specName.trim() || state.material;
    const data = { ph: state.ph, type: state.type, options: state.options, route: state.route, solvents: state.solvents, extra: state.extra, rows: state.rows.map(({ key, name, method, spec, source }) => ({ key, name, method, spec, source })), details: { cas: state.details.cas, formula: state.details.formula, mw: state.details.mw, storage: state.details.storage } };
    const r = await saveCoaSpec(name, state.material || name, data);
    if (r.ok) {
      setSpecs(r.specs);
      setLibMsg(L(t.libSaved));
    } else setLibMsg(L(r.error === "signin" ? t.libSignIn : r.error === "full" ? t.libFull : t.libError));
  };
  const loadSpec = (sp: SavedSpec) => {
    const d = sp.data as Partial<CoaState> & { rows?: CoaRow[]; details?: Partial<CoaState["details"]> };
    setState((s) => ({
      ...s,
      material: sp.material,
      ph: d.ph ?? s.ph,
      type: d.type ?? s.type,
      options: { ...baseOptions, ...d.options },
      route: d.route ?? s.route,
      solvents: d.solvents ?? [],
      extra: d.extra ?? [],
      rows: (d.rows ?? []).map((r) => ({ ...r, result: "", conf: "auto" as const })),
      details: { ...s.details, ...d.details },
    }));
    setSpecName(sp.name);
  };
  const removeSpec = async (sp: SavedSpec) => {
    const r = await deleteCoaSpec(sp.id);
    if (r.ok) setSpecs(r.specs);
  };

  const presentKeys = new Set(state.rows.map((r) => r.key));
  const extraChoices = [...new Set(optionTests.extra)].filter((id) => !presentKeys.has(id));
  const solventChoices = q3cSolvents.filter(([en]) => !state.solvents.includes(en));
  const sources = [...new Set(state.rows.map((r) => r.source).filter(Boolean))] as string[];

  const check = (key: keyof CoaOptions, label: { en: string; fa: string }) => (
    <label className="flex items-center gap-2 text-sm text-vault-900">
      <input type="checkbox" checked={state.options[key]} onChange={(e) => reshape({ options: { ...state.options, [key]: e.target.checked } })} className="size-4 accent-molecule-600" />
      {L(label)}
    </label>
  );
  const detail = (key: keyof CoaState["details"], label: { en: string; fa: string }, ltr = false) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-vault-900">{L(label)}</span>
      <input dir={ltr ? "ltr" : "auto"} value={state.details[key]} onChange={(e) => setState((s) => ({ ...s, details: { ...s.details, [key]: e.target.value } }))} className={`${inputClass} ${ltr ? "text-start" : ""}`} />
    </label>
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-5">
        {/* 1. Material and pharmacopoeia */}
        <section className="rounded-card border border-line bg-white p-5">
          <h2 className="font-bold text-vault-900">{L(t.step1)}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="coa-mat" className="mb-1 block text-xs font-semibold text-vault-900">
                {L(t.material)}
              </label>
              <input
                id="coa-mat"
                dir="ltr"
                autoComplete="off"
                value={query || state.material}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setState((s) => ({ ...s, material: e.target.value }));
                }}
                className={`${inputClass} text-start`}
              />
              {hits.length > 0 && (
                <ul className="mt-1 max-h-64 overflow-auto rounded-xl border border-line bg-white text-sm shadow-sm" role="listbox">
                  {hits.map((m) => (
                    <li key={m.n}>
                      <button type="button" onClick={() => pick(m)} className="flex w-full flex-wrap items-baseline justify-between gap-2 px-3 py-2 text-start hover:bg-molecule-50">
                        <bdi dir="ltr" className="font-semibold text-vault-900">{m.n}</bdi>
                        <bdi dir="ltr" className="font-mono text-xs text-muted">{m.c}</bdi>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-1 text-xs text-muted">{L(t.materialHint)}</p>
            </div>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.pharmacopoeia)}</span>
              <select value={state.ph} onChange={(e) => reshape({ ph: e.target.value as Pharmacopoeia })} className={inputClass}>
                {pharmacopoeias.map((p) => (
                  <option key={p.value} value={p.value}>{L(p.label)}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.type)}</span>
              <select value={state.type} onChange={(e) => reshape({ type: e.target.value as CoaMaterialType })} className={inputClass}>
                {materialTypes.map((p) => (
                  <option key={p.value} value={p.value}>{L(p.label)}</option>
                ))}
              </select>
            </label>
            <fieldset className="sm:col-span-2">
              <legend className="mb-1 text-xs font-semibold text-vault-900">{L(t.options)}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {check("salt", t.optSalt)}
                {check("hydrate", t.optHydrate)}
                {check("chiral", t.optChiral)}
                {check("micro", t.optMicro)}
                {check("sterile", t.optSterile)}
                {check("potency", t.optPotency)}
              </div>
            </fieldset>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.route)}</span>
              <select value={state.route} onChange={(e) => reshape({ route: e.target.value as Route })} className={inputClass}>
                {(["oral", "par", "inh"] as Route[]).map((r) => (
                  <option key={r} value={r}>{L(t.routes[r])}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.solvents)}</span>
              <select
                value=""
                onChange={(e) => e.target.value && reshape({ solvents: [...state.solvents, e.target.value] })}
                className={inputClass}
              >
                <option value="">{L(t.addSolvent)}</option>
                {solventChoices.map(([en, fa]) => (
                  <option key={en} value={en}>{locale === "fa" ? fa : en}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* 2. Batch details */}
        <section className="rounded-card border border-line bg-white p-5">
          <h2 className="font-bold text-vault-900">{L(t.step2)}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">{detail("company", t.company)}</div>
            <div className="sm:col-span-2">
              <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.logo)}</span>
              <div className="flex items-center gap-3">
                {logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logo.dataUrl} alt="" width={logo.width} height={logo.height} className="rounded border border-line" />
                )}
                <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 text-sm hover:border-molecule-400">
                  <ImagePlus className="size-4" aria-hidden="true" />
                  {L(t.logo)}
                </button>
                {logo && (
                  <button type="button" onClick={() => setLogo(undefined)} aria-label={L(t.remove)} className="text-muted hover:text-red-700">
                    <X className="size-4" aria-hidden="true" />
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) setLogo(await loadLogo(file).catch(() => undefined));
                  }}
                />
              </div>
            </div>
            {detail("reportNo", t.reportNo, true)}
            {detail("batch", t.batch, true)}
            {detail("manufacturer", t.manufacturer)}
            {detail("supplier", t.supplier)}
            {detail("quantity", t.quantity)}
            {detail("storage", t.storage)}
            {detail("mfgDate", t.mfgDate)}
            {detail("retestDate", t.retestDate)}
            {detail("analysisDate", t.analysisDate)}
            {detail("cas", t.cas, true)}
            {detail("formula", t.formula, true)}
            {detail("mw", t.mw, true)}
          </div>
        </section>

        {/* 3. Tests */}
        <section className="rounded-card border border-line bg-white p-5">
          <h2 className="font-bold text-vault-900">{L(t.step3)}</h2>
          <ol className="mt-3 space-y-3">
            {state.rows.map((r, i) => {
              const c = conformity(r);
              return (
                <li key={r.key} className="rounded-xl border border-line p-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-2 w-6 shrink-0 text-center font-mono text-xs text-muted">{i + 1}</span>
                    <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                      <input aria-label={L(t.colTest)} dir="auto" value={r.name} onChange={(e) => setRow(r.key, { name: e.target.value })} className={`${inputClass} font-semibold sm:col-span-2`} />
                      <input aria-label={L(t.colMethod)} dir="ltr" value={r.method} onChange={(e) => setRow(r.key, { method: e.target.value })} className={`${inputClass} text-start font-mono text-xs`} />
                      <input aria-label={L(t.colSpec)} dir="auto" placeholder={L(t.specPlaceholder)} value={r.spec} onChange={(e) => setRow(r.key, { spec: e.target.value })} className={inputClass} />
                      <input aria-label={L(t.colResult)} dir="auto" placeholder={L(t.resultPlaceholder)} value={r.result} onChange={(e) => setRow(r.key, { result: e.target.value })} className={inputClass} />
                      <div className="flex items-center gap-2">
                        <select aria-label={L(t.colConf)} value={r.conf} onChange={(e) => setRow(r.key, { conf: e.target.value as CoaRow["conf"] })} className={`${inputClass} w-auto`}>
                          <option value="auto">{L(t.auto)}</option>
                          <option value="ok">{L(t.complies)}</option>
                          <option value="fail">{L(t.notComplies)}</option>
                        </select>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${c === "ok" ? "bg-molecule-100 text-molecule-700" : c === "fail" ? "bg-red-100 text-red-800" : "bg-vault-50 text-muted"}`}
                        >
                          {c === "ok" ? L(t.complies) : c === "fail" ? L(t.notComplies) : L(t.pending)}
                        </span>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeRow(r.key)} aria-label={L(t.remove)} className="mt-1 rounded-full p-1.5 text-muted hover:bg-red-50 hover:text-red-700">
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <select
              value=""
              onChange={(e) => e.target.value && reshape({ extra: [...state.extra, e.target.value] })}
              className={`${inputClass} w-auto`}
              aria-label={L(t.addTest)}
            >
              <option value="">{L(t.addTest)}</option>
              {extraChoices.map((id) => (
                <option key={id} value={id}>{L(coaTests[id].name)}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                setState((s) => ({ ...s, rows: [...s.rows, { key: `custom:${Date.now()}`, name: "", method: methodLabel({ id: "x", name: t.addCustom }, s.ph), spec: "", result: "", conf: "auto" }] }))
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 text-sm hover:border-molecule-400"
            >
              <Plus className="size-4" aria-hidden="true" />
              {L(t.addCustom)}
            </button>
          </div>
          {sources.length > 0 && (
            <div className="mt-4 rounded-xl bg-vault-50 p-3 text-xs leading-relaxed text-muted">
              <p className="font-bold text-vault-900">{L(t.sourceTitle)}</p>
              <ul className="mt-1 list-disc space-y-0.5 ps-5">
                {sources.map((k) => (
                  <li key={k}>{isolateText(L((publicSpecs as Record<string, { source: { en: string; fa: string } }>)[k].source))}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* 4. Conclusion and signatures */}
        <section className="rounded-card border border-line bg-white p-5">
          <h2 className="font-bold text-vault-900">{L(t.step4)}</h2>
          <label className="mt-3 block">
            <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.remarks)}</span>
            <textarea dir="auto" rows={2} value={state.remarks} onChange={(e) => setState((s) => ({ ...s, remarks: e.target.value }))} className={inputClass} />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {(["analysed", "checked", "approved"] as const).map((k) => (
              <div key={k} className="space-y-2">
                <span className="block text-xs font-semibold text-vault-900">{L(k === "analysed" ? t.analysedBy : k === "checked" ? t.checkedBy : t.approvedBy)}</span>
                <input dir="auto" placeholder={L(t.name)} value={state.signs[k].name} onChange={(e) => setState((s) => ({ ...s, signs: { ...s.signs, [k]: { ...s.signs[k], name: e.target.value } } }))} className={inputClass} />
                <input dir="auto" placeholder={L(t.date)} value={state.signs[k].date} onChange={(e) => setState((s) => ({ ...s, signs: { ...s.signs, [k]: { ...s.signs[k], date: e.target.value } } }))} className={inputClass} />
              </div>
            ))}
          </div>
        </section>

        {/* Specification library */}
        <section className="rounded-card border border-molecule-400/60 bg-molecule-50/40 p-5">
          <h2 className="font-bold text-vault-900">{L(t.libTitle)}</h2>
          <p className="mt-1 text-sm text-muted">{L(t.libLead)}</p>
          {!signedIn ? (
            <p className="mt-3 text-sm font-semibold text-vault-900">{L(t.libSignIn)}</p>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap items-end gap-2">
                <label className="block min-w-0 flex-1">
                  <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.libName)}</span>
                  <input dir="auto" value={specName} placeholder={state.material} onChange={(e) => setSpecName(e.target.value)} className={inputClass} />
                </label>
                <button type="button" onClick={saveSpec} className="inline-flex items-center gap-2 rounded-full bg-molecule-600 px-4 py-2 text-sm font-bold text-white hover:bg-molecule-700">
                  <BookmarkPlus className="size-4" aria-hidden="true" />
                  {L(t.libSave)}
                </button>
              </div>
              {libMsg && <p className="mt-2 text-xs text-molecule-700" aria-live="polite">{libMsg}</p>}
              {specs && specs.length === 0 && <p className="mt-3 text-xs text-muted">{L(t.libEmpty)}</p>}
              {specs && specs.length > 0 && (
                <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-white text-sm">
                  {specs.map((sp) => (
                    <li key={sp.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                      <span className="min-w-0">
                        <bdi dir="auto" className="font-semibold text-vault-900">{sp.name}</bdi>
                        <bdi dir="ltr" className="ms-2 text-xs text-muted">{sp.material}</bdi>
                      </span>
                      <span className="flex gap-1">
                        <button type="button" onClick={() => loadSpec(sp)} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs hover:border-molecule-400">
                          <FolderOpen className="size-3.5" aria-hidden="true" />
                          {L(t.libLoad)}
                        </button>
                        <button type="button" onClick={() => removeSpec(sp)} aria-label={L(t.libDelete)} className="rounded-full p-1.5 text-muted hover:text-red-700">
                          <Trash2 className="size-3.5" aria-hidden="true" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

        <p className="text-xs leading-relaxed text-muted">{isolateText(L(t.note))}</p>
      </div>

      {/* Preview and export */}
      <div className="min-w-0 space-y-3 xl:sticky xl:top-24 xl:self-start">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={downloadWord} className="inline-flex items-center gap-2 rounded-full bg-vault-900 px-5 py-2.5 text-sm font-bold text-capsule-400 hover:bg-vault-800">
            {allowed ? <Download className="size-4" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
            {L(t.word)}
          </button>
          <button type="button" onClick={print} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-vault-900 hover:border-molecule-400">
            {allowed ? <Printer className="size-4" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
            {L(t.print)}
          </button>
          <button type="button" onClick={() => setState(fresh(locale))} className="inline-flex items-center gap-1.5 px-2 text-xs text-muted hover:text-vault-900">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {L(t.reset)}
          </button>
        </div>
        {notice && (
          <div role="alert" className="relative rounded-2xl border border-capsule-400/70 bg-capsule-50 p-4 pe-10 text-sm text-vault-900">
            <button type="button" onClick={() => setNotice(false)} aria-label={L(t.remove)} className="absolute end-3 top-3 rounded-full p-1 text-muted hover:text-vault-900">
              <X className="size-4" aria-hidden="true" />
            </button>
            <p className="flex items-center gap-2 font-bold">
              <Lock className="size-4 text-capsule-700" aria-hidden="true" />
              {L(t.exportLocked)}
            </p>
            <Link href={buyHref} className="mt-3 inline-block rounded-full bg-vault-900 px-4 py-1.5 text-xs font-bold text-capsule-400">
              {L(t.buy)}
            </Link>
          </div>
        )}
        <p className="text-xs text-muted">{L(t.preview)}</p>
        <iframe title={L(t.preview)} srcDoc={html} className="h-[80vh] w-full rounded-card border border-line bg-white shadow-sm" />
      </div>
    </div>
  );
}
