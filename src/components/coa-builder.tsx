"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { BookmarkPlus, ClipboardPaste, Download, FileDown, FilePlus2, FileSearch, FileUp, FolderOpen, ImagePlus, Lock, Plus, Printer, RotateCcw, Trash2, X } from "lucide-react";
import { coaBuilderCopy as t, coaTests, materialTypes, optionTests, pharmacopoeias, publicSpecs, type CoaMaterialType, type Pharmacopoeia } from "@/content/coa-builder";
import { coaCheckCopy } from "@/content/coa-check";
import type { Locale } from "@/i18n/config";
import { isolateText } from "@/lib/bidi";
import { buildRows, coaDocument, conclusion, conformity, emptyDetails, type CoaOptions, type CoaRow, type CoaState, type Route } from "@/lib/coa-doc";
import { deleteCoaSpec, listCoaSpecs, saveCoaSpec, type SavedSpec } from "@/lib/coa-spec-actions";
import { loadLogo, pngBytes, printHtml, saveBlob, type LogoImage } from "@/lib/doc-export";
import { buildDocx } from "@/lib/docx";
import { documentHtml } from "@/lib/form-doc";
import { q3cSolvents } from "@/lib/ich-limits";
import { importMonograph, type ImportedRow } from "@/lib/monograph-import";
import { CoaCheck } from "./coa-check";

/** A material of the site's databases: name, CAS, formula, MW and its group (excipients are "exc"). */
export type CoaMaterial = { n: string; c?: string; f?: string; w?: string; g: string };

const DRAFT = "pv-coa:draft2";
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
const PH_GRADE: Record<Pharmacopoeia, string> = { usp: "USP", eur: "Ph. Eur.", bp: "BP" };

const fresh = (): CoaState => {
  const base = { material: "", ph: "usp" as Pharmacopoeia, type: "api" as CoaMaterialType, options: baseOptions, route: "oral" as Route, solvents: [] as string[], extra: [] as string[] };
  return { ...base, details: emptyDetails, rows: buildRows(base, []), remarks: "", signs: { analysed: { name: "", date: "" }, checked: { name: "", date: "" }, approved: { name: "", date: "" } } };
};

const inputClass = "field-input w-full text-sm";
const cell = "w-full rounded-md border border-transparent bg-transparent px-2 py-1.5 text-[13px] outline-none transition hover:border-line focus:border-molecule-500 focus:bg-white";
const noSubscribe = () => () => {};

export function CoaBuilder(props: { locale: Locale; materials: CoaMaterial[]; allowed: boolean; signedIn: boolean; buyHref: string }) {
  // Drafts live in this browser's storage, so the builder renders in the browser only.
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  return mounted ? <Tabs {...props} /> : <div className="min-h-[60vh]" aria-busy="true" />;
}

/** "Build a certificate" and "Check a supplier's certificate"; ?mode=check opens the second. */
function Tabs(props: { locale: Locale; materials: CoaMaterial[]; allowed: boolean; signedIn: boolean; buyHref: string }) {
  const [mode, setMode] = useState<"build" | "check">(() => (new URLSearchParams(window.location.search).get("mode") === "check" ? "check" : "build"));
  const choose = (m: "build" | "check") => {
    setMode(m);
    const url = new URL(window.location.href);
    if (m === "check") url.searchParams.set("mode", "check");
    else url.searchParams.delete("mode");
    window.history.replaceState(null, "", url);
  };
  const tab = (m: "build" | "check", label: { en: string; fa: string }, icon: React.ReactNode) => (
    <button
      type="button"
      role="tab"
      aria-selected={mode === m}
      onClick={() => choose(m)}
      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition sm:flex-none ${mode === m ? "bg-vault-900 text-capsule-400" : "text-vault-900 hover:bg-vault-50"}`}
    >
      {icon}
      {label[props.locale]}
    </button>
  );
  return (
    <div className="space-y-6">
      <div role="tablist" className="flex gap-1 rounded-full border border-line bg-white p-1">
        {tab("build", coaCheckCopy.tabBuild, <FilePlus2 className="size-4" aria-hidden="true" />)}
        {tab("check", coaCheckCopy.tabCheck, <FileSearch className="size-4" aria-hidden="true" />)}
      </div>
      {mode === "build" ? <Builder {...props} /> : <CoaCheck locale={props.locale} allowed={props.allowed} signedIn={props.signedIn} buyHref={props.buyHref} />}
    </div>
  );
}

function Section({ n, title, children, tone = "plain" }: { n?: number; title: string; children: React.ReactNode; tone?: "plain" | "accent" }) {
  return (
    <section className={`rounded-card border p-5 ${tone === "accent" ? "border-molecule-400/60 bg-molecule-50/40" : "border-line bg-white"}`}>
      <h2 className="flex items-center gap-2.5 font-bold text-vault-900">
        {n && <span className="flex size-6 items-center justify-center rounded-full bg-vault-900 text-xs text-capsule-400">{n}</span>}
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Builder({ locale, materials, allowed, signedIn, buyHref }: { locale: Locale; materials: CoaMaterial[]; allowed: boolean; signedIn: boolean; buyHref: string }) {
  const L = (b: { en: string; fa: string }) => b[locale];
  const [state, setState] = useState<CoaState>(() => read<CoaState>(DRAFT) ?? fresh());
  const [logo, setLogo] = useState<LogoImage | undefined>(() => read<{ logo?: LogoImage }>(META)?.logo);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState(false);
  const [specName, setSpecName] = useState("");
  const [specs, setSpecs] = useState<SavedSpec[] | null>(null);
  const [libMsg, setLibMsg] = useState("");
  const [paste, setPaste] = useState("");
  const [imported, setImported] = useState<{ style: string; rows: ImportedRow[] } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const libFileRef = useRef<HTMLInputElement>(null);

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
      return { ...next, rows: buildRows(next, s.rows) };
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
      const type = typeOf(m.g);
      const next: CoaState = {
        ...s,
        material: m.n,
        type,
        options: { ...baseOptions, salt: SALT.test(m.n), hydrate: HYDRATE.test(m.n) || HYDRATE.test(m.f ?? ""), micro: ["excipient", "vitamin", "mineral"].includes(type) },
        solvents: [],
        extra: [],
        details: { ...s.details, cas: m.c ?? "", formula: m.f ?? "", mw: m.w ?? "" },
      };
      return { ...next, rows: buildRows(next, []) };
    });
  };

  const setRow = (key: string, patch: Partial<CoaRow>) => setState((s) => ({ ...s, rows: s.rows.map((r) => (r.key === key ? { ...r, ...patch } : r)) }));
  const removeRow = (key: string) =>
    setState((s) => ({
      ...s,
      extra: s.extra.filter((e) => e !== key),
      solvents: key.startsWith("rsolv:") ? s.solvents.filter((x) => `rsolv:${x}` !== key) : s.solvents,
      rows: s.rows.filter((r) => r.key !== key),
    }));
  const addCustom = () => setState((s) => ({ ...s, rows: [...s.rows, { key: `custom:${Date.now()}`, name: "", method: "", spec: "", result: "", conf: "auto" }] }));

  const applyImport = (mode: "replace" | "append") => {
    if (!imported) return;
    const stamp = Date.now();
    const rows: CoaRow[] = imported.rows.map((r, i) => ({ key: `custom:${stamp}-${i}`, name: r.name, method: r.method, spec: r.spec, result: "", conf: "auto" }));
    setState((s) => ({ ...s, solvents: mode === "replace" ? [] : s.solvents, extra: mode === "replace" ? [] : s.extra, rows: mode === "replace" ? rows : [...s.rows, ...rows] }));
    setImported(null);
    setPaste("");
  };

  const doc = useMemo(() => {
    const d = coaDocument(state);
    return logo ? { ...d, logo: { png: pngBytes(logo.dataUrl), width: logo.width, height: logo.height } } : d;
  }, [state, logo]);
  const html = useMemo(() => documentHtml(doc, logo?.dataUrl), [doc, logo]);
  const fileName = `CoA-${(state.material || "material").replace(/[^\w.-]+/g, "_")}-${(state.details.batch || "batch").replace(/[^\w.-]+/g, "_")}`;
  const guard = (action: () => void) => () => (allowed ? action() : setNotice(true));
  const downloadWord = guard(() => saveBlob(buildDocx(doc), `${fileName}.docx`));
  const print = guard(() => printHtml(html, fileName));

  const specData = () => ({
    ph: state.ph, type: state.type, options: state.options, route: state.route, solvents: state.solvents, extra: state.extra,
    rows: state.rows.map(({ key, name, method, spec, source }) => ({ key, name, method, spec, source })),
    details: { cas: state.details.cas, formula: state.details.formula, mw: state.details.mw, storage: state.details.storage, grade: state.details.grade },
  });
  const saveSpec = async () => {
    setLibMsg("");
    const r = await saveCoaSpec(specName.trim() || state.material, state.material || specName.trim(), specData());
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
  const exportLibrary = () => {
    const body = JSON.stringify({ format: "pharmavault-coa-specs", version: 1, specs: (specs ?? []).map(({ name, material, data }) => ({ name, material, data })) }, null, 1);
    saveBlob(new Blob([body], { type: "application/json" }), "pharmavault-coa-specifications.json");
  };
  const importLibrary = async (file: File) => {
    setLibMsg("");
    try {
      const json = JSON.parse(await file.text()) as { specs?: { name: string; material: string; data: unknown }[] };
      let n = 0;
      for (const sp of json.specs ?? []) {
        const r = await saveCoaSpec(sp.name, sp.material, sp.data);
        if (!r.ok) {
          setLibMsg(L(r.error === "full" ? t.libFull : r.error === "signin" ? t.libSignIn : t.libError));
          break;
        }
        n++;
        setSpecs(r.specs);
      }
      if (n) setLibMsg(L(t.libImported).replace("{n}", String(n)));
    } catch {
      setLibMsg(L(t.libError));
    }
  };

  const presentKeys = new Set(state.rows.map((r) => r.key));
  const extraChoices = [...new Set(optionTests.extra)].filter((id) => !presentKeys.has(id));
  const solventChoices = q3cSolvents.filter(([en]) => !state.solvents.includes(en));
  const sources = [...new Set(state.rows.map((r) => r.source).filter(Boolean))] as string[];
  const counts = state.rows.reduce((a, r) => ((a[conformity(r) ?? "open"] += 1), a), { ok: 0, fail: 0, open: 0 } as Record<"ok" | "fail" | "open", number>);

  const check = (key: keyof CoaOptions, label: { en: string; fa: string }) => (
    <label className="flex items-center gap-2 text-sm text-vault-900">
      <input type="checkbox" checked={state.options[key]} onChange={(e) => reshape({ options: { ...state.options, [key]: e.target.checked } })} className="size-4 accent-molecule-600" />
      {L(label)}
    </label>
  );
  const detail = (key: keyof CoaState["details"], label: { en: string; fa: string }, ltr = false, placeholder = "") => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-vault-900">{L(label)}</span>
      <input dir={ltr ? "ltr" : "auto"} placeholder={placeholder} value={state.details[key]} onChange={(e) => setState((s) => ({ ...s, details: { ...s.details, [key]: e.target.value } }))} className={`${inputClass} ${ltr ? "text-start" : ""}`} />
    </label>
  );

  return (
    <div className="space-y-6">
      {/* Export bar */}
      <div className="sticky top-16 z-20 flex flex-wrap items-center gap-2 rounded-card border border-line bg-white/95 p-3 shadow-sm backdrop-blur">
        <button type="button" onClick={downloadWord} className="inline-flex items-center gap-2 rounded-full bg-vault-900 px-5 py-2.5 text-sm font-bold text-capsule-400 hover:bg-vault-800">
          {allowed ? <Download className="size-4" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
          {L(t.word)}
        </button>
        <button type="button" onClick={print} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-vault-900 hover:border-molecule-400">
          {allowed ? <Printer className="size-4" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
          {L(t.print)}
        </button>
        <span className="ms-auto flex items-center gap-1.5 text-xs" dir="ltr">
          <span className="rounded-full bg-molecule-100 px-2.5 py-1 font-bold text-molecule-700">{counts.ok} complies</span>
          <span className="rounded-full bg-red-100 px-2.5 py-1 font-bold text-red-800">{counts.fail} OOS</span>
          <span className="rounded-full bg-vault-50 px-2.5 py-1 font-bold text-muted">{counts.open} pending</span>
        </span>
        <button type="button" onClick={() => setState(fresh())} className="inline-flex items-center gap-1.5 px-2 text-xs text-muted hover:text-vault-900">
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 1. Material and pharmacopoeia */}
        <Section n={1} title={L(t.step1)}>
          <div className="grid gap-3 sm:grid-cols-2">
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
                className={`${inputClass} text-start font-semibold`}
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
              <select value="" onChange={(e) => e.target.value && reshape({ solvents: [...state.solvents, e.target.value] })} className={inputClass} dir="ltr">
                <option value="">{L(t.addSolvent)}</option>
                {solventChoices.map(([en]) => (
                  <option key={en} value={en}>{en}</option>
                ))}
              </select>
            </label>
          </div>
        </Section>

        {/* 2. Batch details */}
        <Section n={2} title={L(t.step2)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">{detail("company", t.company)}</div>
            <div className="sm:col-span-2 flex items-center gap-3">
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
            {detail("reportNo", t.reportNo, true)}
            {detail("batch", t.batch, true)}
            {detail("grade", t.grade, true, `${PH_GRADE[state.ph]} 2025`)}
            {detail("quantity", t.quantity, true)}
            {detail("packaging", t.packaging, true)}
            {detail("storage", t.storage, true)}
            {detail("manufacturer", t.manufacturer, true)}
            {detail("supplier", t.supplier, true)}
            {detail("mfgDate", t.mfgDate, true)}
            {detail("retestDate", t.retestDate, true)}
            {detail("analysisDate", t.analysisDate, true)}
            {detail("cas", t.cas, true)}
            {detail("formula", t.formula, true)}
            {detail("mw", t.mw, true)}
          </div>
        </Section>
      </div>

      {/* Import from monograph */}
      <Section title={L(t.importTitle)} tone="accent">
        <p className="text-sm leading-relaxed text-muted">{isolateText(L(t.importLead))}</p>
        <textarea dir="ltr" rows={5} value={paste} placeholder={L(t.importPlaceholder)} aria-label={L(t.importPlaceholder)} onChange={(e) => setPaste(e.target.value)} className={`${inputClass} mt-3 font-mono text-xs`} />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setImported(importMonograph(paste, state.ph))}
            disabled={!paste.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-molecule-600 px-4 py-2 text-sm font-bold text-white hover:bg-molecule-700 disabled:opacity-50"
          >
            <ClipboardPaste className="size-4" aria-hidden="true" />
            {L(t.importRead)}
          </button>
          {imported && (
            <span className="text-sm text-vault-900" aria-live="polite">
              {imported.rows.length
                ? L(t.importFound).replace("{n}", String(imported.rows.length)).replace("{style}", imported.style === "usp" ? "USP–NF" : "Ph. Eur./BP")
                : L(t.importNone)}
            </span>
          )}
        </div>
        {imported && imported.rows.length > 0 && (
          <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-white" dir="ltr">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead className="bg-vault-50 text-vault-900">
                <tr><th className="px-3 py-2">Test</th><th className="px-3 py-2">Method</th><th className="px-3 py-2">Specification</th></tr>
              </thead>
              <tbody>
                {imported.rows.map((r, i) => (
                  <tr key={i} className="border-t border-line/70"><td className="px-3 py-1.5 font-semibold">{r.name}</td><td className="px-3 py-1.5 font-mono">{r.method}</td><td className="px-3 py-1.5">{r.spec}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-wrap gap-2 border-t border-line p-3" dir={locale === "fa" ? "rtl" : "ltr"}>
              <button type="button" onClick={() => applyImport("replace")} className="rounded-full bg-vault-900 px-4 py-1.5 text-xs font-bold text-capsule-400">{L(t.importReplace)}</button>
              <button type="button" onClick={() => applyImport("append")} className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-vault-900 hover:border-molecule-400">{L(t.importAppend)}</button>
            </div>
          </div>
        )}
      </Section>

      {/* 3. Tests: a worksheet in English, as the certificate is */}
      <Section n={3} title={L(t.step3)}>
        <div className="overflow-x-auto rounded-xl border border-line" dir="ltr">
          <table className="w-full min-w-[860px] border-collapse text-left">
            <thead className="bg-vault-900 text-[12px] uppercase tracking-wide text-capsule-400">
              <tr>
                <th className="w-10 px-2 py-2.5">#</th>
                <th className="px-2 py-2.5">Test</th>
                <th className="w-52 px-2 py-2.5">Method</th>
                <th className="px-2 py-2.5">Specification</th>
                <th className="w-36 px-2 py-2.5">Result</th>
                <th className="w-40 px-2 py-2.5">Status</th>
                <th className="w-9" />
              </tr>
            </thead>
            <tbody>
              {state.rows.map((r, i) => {
                const c = conformity(r);
                return (
                  <tr key={r.key} className={`border-t border-line/70 align-top ${c === "fail" ? "bg-red-50/70" : i % 2 ? "bg-vault-50/40" : "bg-white"}`}>
                    <td className="px-2 py-2 font-mono text-xs text-muted">{i + 1}</td>
                    <td className="px-1 py-1"><input aria-label="Test" value={r.name} onChange={(e) => setRow(r.key, { name: e.target.value })} className={`${cell} font-semibold text-vault-900`} /></td>
                    <td className="px-1 py-1"><input aria-label="Method" value={r.method} onChange={(e) => setRow(r.key, { method: e.target.value })} className={`${cell} font-mono text-[12px]`} /></td>
                    <td className="px-1 py-1"><input aria-label="Specification" placeholder="Enter from the current monograph" value={r.spec} onChange={(e) => setRow(r.key, { spec: e.target.value })} className={cell} /></td>
                    <td className="px-1 py-1"><input aria-label="Result" placeholder="Result" value={r.result} onChange={(e) => setRow(r.key, { result: e.target.value })} className={`${cell} font-semibold`} /></td>
                    <td className="px-1 py-1">
                      <select aria-label="Status" value={r.conf} onChange={(e) => setRow(r.key, { conf: e.target.value as CoaRow["conf"] })} className={`${cell} font-bold ${c === "ok" ? "text-molecule-700" : c === "fail" ? "text-red-700" : "text-muted"}`}>
                        <option value="auto">{c === "ok" ? "✓ Complies (auto)" : c === "fail" ? "✗ Does not comply (auto)" : "— Auto"}</option>
                        <option value="ok">✓ Complies</option>
                        <option value="fail">✗ Does not comply</option>
                      </select>
                    </td>
                    <td className="py-1">
                      <button type="button" onClick={() => removeRow(r.key)} aria-label="Remove" className="rounded-full p-1.5 text-muted hover:bg-red-50 hover:text-red-700">
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2" dir="ltr">
          <select value="" onChange={(e) => e.target.value && reshape({ extra: [...state.extra, e.target.value] })} className={`${inputClass} w-auto`} aria-label="Add test">
            <option value="">+ Add test…</option>
            {extraChoices.map((id) => (
              <option key={id} value={id}>{(state.ph !== "usp" && coaTests[id].nameEur) || coaTests[id].name}</option>
            ))}
          </select>
          <button type="button" onClick={addCustom} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-1.5 text-sm hover:border-molecule-400">
            <Plus className="size-4" aria-hidden="true" />
            Custom test
          </button>
        </div>
        {sources.length > 0 && (
          <div className="mt-4 rounded-xl bg-vault-50 p-3 text-xs leading-relaxed text-muted" dir="ltr">
            <p className="font-bold text-vault-900">Limits filled from guidelines</p>
            <ul className="mt-1 list-disc space-y-0.5 ps-5">
              {sources.map((k) => (
                <li key={k}>{(publicSpecs as Record<string, { source: { en: string } }>)[k].source.en}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 4. Conclusion and signatures */}
        <Section n={4} title={L(t.step4)}>
          <p className={`rounded-xl border px-3 py-2 text-sm font-semibold ${counts.fail ? "border-red-200 bg-red-50 text-red-800" : counts.open ? "border-line bg-vault-50 text-muted" : "border-molecule-200 bg-molecule-50 text-molecule-800"}`} dir="ltr">
            {conclusion(state)}
          </p>
          <label className="mt-3 block">
            <span className="mb-1 block text-xs font-semibold text-vault-900">{L(t.remarks)}</span>
            <textarea dir="auto" rows={2} value={state.remarks} onChange={(e) => setState((s) => ({ ...s, remarks: e.target.value }))} className={inputClass} />
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-3" dir="ltr">
            {(["analysed", "checked", "approved"] as const).map((k) => (
              <div key={k} className="space-y-2">
                <span className="block text-xs font-semibold text-vault-900">{k === "analysed" ? "Analysed by (QC)" : k === "checked" ? "Checked by (QC)" : "Approved by (QA)"}</span>
                <input placeholder="Name" aria-label={`${k}: Name`} value={state.signs[k].name} onChange={(e) => setState((s) => ({ ...s, signs: { ...s.signs, [k]: { ...s.signs[k], name: e.target.value } } }))} className={inputClass} />
                <input placeholder="Date" aria-label={`${k}: Date`} value={state.signs[k].date} onChange={(e) => setState((s) => ({ ...s, signs: { ...s.signs, [k]: { ...s.signs[k], date: e.target.value } } }))} className={inputClass} />
              </div>
            ))}
          </div>
        </Section>

        {/* Specification library */}
        <Section title={L(t.libTitle)} tone="accent">
          <p className="text-sm text-muted">{L(t.libLead)}</p>
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
                <ul className="mt-3 max-h-72 divide-y divide-line overflow-auto rounded-xl border border-line bg-white text-sm">
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
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={exportLibrary} disabled={!specs?.length} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs hover:border-molecule-400 disabled:opacity-50">
                  <FileDown className="size-3.5" aria-hidden="true" />
                  {L(t.libExport)}
                </button>
                <button type="button" onClick={() => libFileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs hover:border-molecule-400">
                  <FileUp className="size-3.5" aria-hidden="true" />
                  {L(t.libImport)}
                </button>
                <input
                  ref={libFileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f) importLibrary(f);
                  }}
                />
              </div>
            </>
          )}
        </Section>
      </div>

      {/* Preview */}
      <Section title={L(t.preview)}>
        <iframe title={L(t.preview)} srcDoc={html} className="h-[85vh] w-full rounded-xl border border-line bg-white" />
      </Section>

      <p className="text-xs leading-relaxed text-muted">{isolateText(L(t.note))}</p>
    </div>
  );
}
