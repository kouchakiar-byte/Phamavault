import { coaBuilderCopy as t, coaTests, optionTests, pharmacopoeias, profiles, publicSpecs, type CoaMaterialType, type CoaTest, type Pharmacopoeia } from "@/content/coa-builder";
import type { Locale } from "@/i18n/config";
import { isolateLatin, isolateText } from "./bidi";
import type { DocBlock, DocModel } from "./docx";
import { q3cOption1Ppm, q3cSolvents, q3dClass, q3dElements, q3dOption1 } from "./ich-limits";

/** "ok" or "fail" set by hand; "auto" compares the result with the specification when both are numbers. */
export type Conformity = "auto" | "ok" | "fail";
export type CoaRow = { key: string; name: string; method: string; spec: string; result: string; conf: Conformity; source?: string };
export type Route = "oral" | "par" | "inh";
export type CoaOptions = { salt: boolean; hydrate: boolean; chiral: boolean; sterile: boolean; micro: boolean; potency: boolean };
export type CoaDetails = {
  company: string; reportNo: string; batch: string; manufacturer: string; supplier: string; quantity: string;
  mfgDate: string; retestDate: string; analysisDate: string; storage: string; cas: string; formula: string; mw: string;
};
export type Sign = { name: string; date: string };
export type CoaState = {
  material: string;
  ph: Pharmacopoeia;
  type: CoaMaterialType;
  options: CoaOptions;
  route: Route;
  solvents: string[];
  extra: string[];
  details: CoaDetails;
  rows: CoaRow[];
  remarks: string;
  signs: { analysed: Sign; checked: Sign; approved: Sign };
};

export const emptyDetails: CoaDetails = {
  company: "", reportNo: "", batch: "", manufacturer: "", supplier: "", quantity: "", mfgDate: "", retestDate: "", analysisDate: "", storage: "", cas: "", formula: "", mw: "",
};

export const methodLabel = (test: CoaTest, ph: Pharmacopoeia): string => {
  if (ph === "usp") return test.usp ? `USP ${test.usp}` : "USP–NF monograph";
  const eur = test.eur ? `Ph. Eur. ${test.eur}` : "Ph. Eur. monograph";
  return ph === "bp" ? `BP (${eur})` : eur;
};

const testName = (test: CoaTest, ph: Pharmacopoeia, locale: Locale) => ((ph !== "usp" && test.nameEur) || test.name)[locale];

/** Class 1 and 2A elements at ICH Q3D Option 1 for the route. */
export function elementalSpec(route: Route): string {
  const col = route === "oral" ? 3 : route === "par" ? 4 : 5;
  return q3dElements
    .filter(([s]) => q3dClass[s] === "1" || q3dClass[s] === "2A")
    .map((e) => `${e[0]} ≤ ${+q3dOption1(e[col] as number).toFixed(2)}`)
    .join("; ") + " µg/g";
}

export function solventSpec(name: string): string {
  const s = q3cSolvents.find((x) => x[0] === name);
  if (!s) return "";
  return s[2] >= 50 ? "≤ 5000 ppm" : `≤ ${q3cOption1Ppm(s[2])} ppm`;
}

/** The rows for the material and options, keeping what the user already typed in rows that stay. */
export function buildRows(s: Omit<CoaState, "rows" | "details" | "remarks" | "signs">, previous: CoaRow[], locale: Locale): CoaRow[] {
  const ids = [...profiles[s.type]];
  const add = (id: string, after?: string) => {
    if (ids.includes(id)) return;
    const at = after ? ids.indexOf(after) : -1;
    if (at >= 0) ids.splice(at + 1, 0, id);
    else ids.push(id);
  };
  if (s.options.salt) add(optionTests.salt, ids.includes("idHplc") ? "idHplc" : "idIr");
  if (s.options.chiral) add(optionTests.chiral, ids.includes("colour") ? "colour" : ids.includes("ph") ? "ph" : "idHplc");
  if (s.options.hydrate) {
    const i = ids.indexOf("lod");
    if (i >= 0) ids[i] = "water";
    else add("water");
  }
  for (const e of s.extra) add(e, "assay");
  if (s.options.potency) add(optionTests.potency, "assay");
  // Microbial limits apply to non-sterile grades; a sterile grade is tested for sterility instead.
  let list = ids.filter((id) => !(s.options.sterile && (id === "tamc" || id === "tymc")));
  if (!s.options.micro && !s.options.sterile) list = list.filter((id) => id !== "tamc" && id !== "tymc");
  if (s.options.micro && !s.options.sterile) for (const id of optionTests.micro) if (!list.includes(id)) list.push(id);
  if (s.options.sterile) list.push(...optionTests.sterile.filter((id) => !list.includes(id)));

  const prev = new Map(previous.map((r) => [r.key, r]));
  const rows: CoaRow[] = [];
  for (const id of list) {
    const test = coaTests[id];
    if (!test) continue;
    if (id === "rsolv" && !s.solvents.length) {
      const p = prev.get(id);
      rows.push({ key: id, name: testName(test, s.ph, locale), method: methodLabel(test, s.ph), spec: p?.spec ?? "", result: p?.result ?? "", conf: p?.conf ?? "auto" });
      continue;
    }
    if (id === "rsolv") {
      for (const sol of s.solvents) {
        const key = `rsolv:${sol}`;
        const p = prev.get(key);
        const label = q3cSolvents.find((x) => x[0] === sol);
        rows.push({
          key,
          name: `${testName(test, s.ph, locale)}: ${label ? (locale === "fa" ? label[1] : label[0]) : sol}`,
          method: methodLabel(test, s.ph),
          spec: p?.spec ?? solventSpec(sol),
          result: p?.result ?? "",
          conf: p?.conf ?? "auto",
          source: "rsolv",
        });
      }
      continue;
    }
    const p = prev.get(id);
    const pub = id === "ei" ? elementalSpec(s.route) : (publicSpecs as Record<string, { spec?: string }>)[id]?.spec ?? "";
    rows.push({
      key: id,
      name: testName(test, s.ph, locale),
      method: methodLabel(test, s.ph),
      spec: p?.spec ?? pub,
      result: p?.result ?? "",
      conf: p?.conf ?? "auto",
      source: pub ? id : undefined,
    });
  }
  // Custom rows the user added stay at the end.
  for (const r of previous) if (r.key.startsWith("custom:")) rows.push(r);
  return rows;
}

const SUP: Record<string, string> = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };

/** The numbers in a text, reading Persian digits, thousands separators and powers of ten ("10³", "10^3"). */
const toNum = (s: string) => {
  const latin = s
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/٫/g, ".")
    .replace(/(\d),(\d{3})/g, "$1$2")
    .replace(/10\s*(?:\^\s*(\d+)|([⁰¹²³⁴⁵⁶⁷⁸⁹]+))/g, (_, p: string, q: string) => String(10 ** Number(p ?? [...q].map((c) => SUP[c]).join(""))));
  const m = latin.match(/-?\d+(?:\.\d+)?/g);
  return m ? m.map(Number) : [];
};

/** The numeric limits of a specification: "≤ 0.5%", "NMT 0.5", "98.0–102.0%", "NLT 99.0", "≤ 10³ CFU/g"; null for text or several limits. */
export function parseSpec(spec: string): { min?: number; max?: number } | null {
  const s = spec.trim();
  if (!s || s.includes(";")) return null;
  const n = toNum(s);
  if (!n.length) return null;
  if (/^(≤|<=|<|NMT|not more than|max)/i.test(s) || /^حداکثر/.test(s)) return { max: n[0] };
  if (/^(≥|>=|>|NLT|not less than|min)/i.test(s) || /^حداقل/.test(s)) return { min: n[0] };
  if (n.length >= 2 && /\d\s*(?:[–—-]|to|and|تا)\s*\d/i.test(s)) return { min: Math.min(n[0], n[1]), max: Math.max(n[0], n[1]) };
  return null;
}

/** The conformity of a row: set by hand, or worked out from a numeric result and specification. */
export function conformity(row: CoaRow): "ok" | "fail" | null {
  if (row.conf !== "auto") return row.conf;
  const lim = parseSpec(row.spec);
  const r = toNum(row.result);
  if (!lim || r.length !== 1 || /[<>≤≥]/.test(row.result)) {
    // "< 0.05%" or "Not detected" against a maximum complies.
    if (lim?.max !== undefined && /^\s*(<|≤|ND|not detected|BQL|BDL|کمتر از)/i.test(row.result)) {
      const v = r[0];
      return v === undefined || v <= lim.max ? "ok" : null;
    }
    return null;
  }
  const v = r[0];
  if (lim.min !== undefined && v < lim.min) return "fail";
  if (lim.max !== undefined && v > lim.max) return "fail";
  return "ok";
}

const phLabel = (ph: Pharmacopoeia) => pharmacopoeias.find((p) => p.value === ph)?.label.en ?? ph;

export function conclusion(state: CoaState, locale: Locale): string {
  const ph = phLabel(state.ph);
  const fails = state.rows.filter((r) => conformity(r) === "fail").map((r) => r.name);
  const open = state.rows.filter((r) => !r.result.trim()).map((r) => r.name);
  if (fails.length) return t.conclusionFail[locale].replace("{ph}", ph).replace("{tests}", fails.join(locale === "fa" ? "، " : ", "));
  if (open.length) return t.conclusionOpen[locale].replace("{tests}", open.join(locale === "fa" ? "، " : ", "));
  return t.conclusionOk[locale].replace("{ph}", ph);
}

/** The certificate as a document, shared by the preview, the print view and the Word file. */
export function coaDocument(state: CoaState, locale: Locale): DocModel {
  const rtl = locale === "fa";
  const tx = (s: string) => (rtl ? isolateText(s) : isolateLatin(s));
  const L = (b: { en: string; fa: string }) => tx(b[locale]);
  const d = state.details;
  const blocks: DocBlock[] = [];
  const info: [string, string][] = [
    [L(t.docMaterial), tx(state.material)],
    [L(t.pharmacopoeia), tx(phLabel(state.ph))],
    [L(t.cas), tx(d.cas)], [L(t.formula), tx(d.formula)], [L(t.mw), tx(d.mw)],
    [L(t.batch), tx(d.batch)], [L(t.quantity), tx(d.quantity)],
    [L(t.manufacturer), tx(d.manufacturer)], [L(t.supplier), tx(d.supplier)],
    [L(t.mfgDate), tx(d.mfgDate)], [L(t.retestDate), tx(d.retestDate)],
    [L(t.analysisDate), tx(d.analysisDate)], [L(t.storage), tx(d.storage)],
  ];
  const filled = info.filter(([, v]) => v.trim());
  const half = Math.ceil(filled.length / 2);
  const pairs: string[][] = [];
  for (let i = 0; i < half; i++) pairs.push([filled[i][0], filled[i][1], filled[i + half]?.[0] ?? "", filled[i + half]?.[1] ?? ""]);
  blocks.push({ kind: "table", rows: pairs, widths: [1.1, 1.6, 1.1, 1.6], labelColumn: true });

  blocks.push({ kind: "heading", text: L(t.step3) });
  const confText = (r: CoaRow) => {
    const c = conformity(r);
    return c === "ok" ? L(t.complies) : c === "fail" ? L(t.notComplies) : "";
  };
  blocks.push({
    kind: "table",
    columns: [L(t.colNo), L(t.colTest), L(t.colMethod), L(t.colSpec), L(t.colResult), L(t.colConf)],
    rows: state.rows.map((r, i) => [String(i + 1), tx(r.name), tx(r.method), tx(r.spec), tx(r.result), confText(r)]),
    widths: [0.65, 2.5, 1.45, 2, 1.35, 1.05],
  });
  const sources = [...new Set(state.rows.map((r) => r.source).filter(Boolean))] as string[];
  if (sources.length) {
    const lines = sources.map((k) => (publicSpecs as Record<string, { source: { en: string; fa: string } }>)[k]?.source).filter(Boolean);
    blocks.push({ kind: "para", label: L(t.sourceTitle), text: lines.map((b) => `• ${L(b)}`).join("\n") });
  }
  blocks.push({ kind: "heading", text: L(t.step4) });
  blocks.push({ kind: "para", text: tx(conclusion(state, locale)), boxed: true });
  if (state.remarks.trim()) blocks.push({ kind: "para", label: L(t.remarks), text: tx(state.remarks) });
  const s = state.signs;
  blocks.push({
    kind: "table",
    columns: ["", L(t.name), L(t.signature), L(t.date)],
    rows: [
      [L(t.analysedBy), tx(s.analysed.name), "", tx(s.analysed.date)],
      [L(t.checkedBy), tx(s.checked.name), "", tx(s.checked.date)],
      [L(t.approvedBy), tx(s.approved.name), "", tx(s.approved.date)],
    ],
    widths: [1.3, 2, 1.6, 1.2],
    labelColumn: true,
    tall: true,
  });
  return {
    rtl,
    header: {
      company: tx(d.company),
      title: L(t.docTitle),
      meta: [
        [L(t.reportNo), tx(d.reportNo)],
        [L(t.batch), tx(d.batch)],
        [L(t.analysisDate), tx(d.analysisDate)],
      ],
    },
    blocks,
  };
}
