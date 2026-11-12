/*
 * Review of a supplier's Certificate of Analysis against a reference
 * specification: the user's own specification library, a monograph they
 * paste from their own pharmacopoeia, and the openly citable general
 * requirements (ICH Q3A/Q3C/Q3D, microbial limits of Ph. Eur. 5.1.4 and
 * USP <1111>, the general chapter of each method). Runs in the browser;
 * the certificate text is not sent or stored.
 */
import { bi, type Bi } from "@/i18n/bi";
import { coaTests, publicSpecs, type Pharmacopoeia } from "@/content/coa-builder";
import { conformity, parseSpec, toNum } from "./coa-doc";
import { q3cOption1Ppm, q3cSolvents } from "./ich-limits";

export type CheckRow = { name: string; method: string; spec: string; result: string };
export type RefRow = { name: string; method: string; spec: string; from: "lib" | "mono" | "general"; note?: Bi };
export type Level = "ok" | "info" | "warn" | "fail";
export type Finding = { level: Level; text: Bi };
export type RowReport = {
  row: CheckRow;
  kind: string;
  ref?: RefRow;
  spec: "same" | "stricter" | "looser" | "manual" | "noref";
  result: "ok" | "fail" | "open";
  findings: Finding[];
};
export type DocCheck = { id: string; label: Bi; found: boolean; level: Level; note?: Bi };
export type CheckReport = { rows: RowReport[]; missing: RefRow[]; doc: DocCheck[]; counts: Record<Level, number> };

// ---------- reading the certificate ----------

const clean = (s: string) =>
  s
    .replace(/[⟨〈]/g, "<")
    .replace(/[⟩〉]/g, ">")
    .replace(/ /g, " ")
    .replace(/[‐‑‒−]/g, "-")
    .replace(/[ \t]+$/gm, "");

const HEADER = /^(tests?|test items?|parameters?|items?|analysis|characteristics?)$/i;
const SPEC_HEAD = /^(specifications?|limits?|acceptance criteria|requirements?|standards?|spec\.?)$/i;
const RESULT_HEAD = /^(results?|observations?|found|test results?|analytical results?)$/i;
const METHOD_HEAD = /^(methods?|test methods?|references?|ref\.?|procedures?)$/i;

/**
 * The test table of a pasted certificate. Copying a PDF table gives one row
 * per line with cells split by tabs or runs of spaces; a header line ("Test,
 * Specification, Result", with or without "Method") tells which cell is which.
 */
export function readCertificate(text: string): CheckRow[] {
  const lines = clean(text).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  let cols: { test: number; spec: number; result: number; method: number } | null = null;
  const rows: CheckRow[] = [];
  for (const line of lines) {
    const cells = line.split(/\t+|\s{2,}|\s*\|\s*/).map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 2 && cells.some((c) => SPEC_HEAD.test(c)) && cells.some((c) => RESULT_HEAD.test(c))) {
      const at = (re: RegExp) => cells.findIndex((c) => re.test(c));
      cols = { test: Math.max(0, at(HEADER)), spec: at(SPEC_HEAD), result: at(RESULT_HEAD), method: at(METHOD_HEAD) };
      continue;
    }
    if (cells.length < 2 || cells.length > 6) continue;
    // a label line of the certificate header ("Batch No.: 123") is not a test
    if (/^(batch|lot|product|mfg|manufactur|exp|retest|date|quantity|packing|supplier|customer|report|certificate|page|storage|approved|checked|analy[sz]ed|signature|conclusion|remarks?)\b/i.test(cells[0])) continue;
    let row: CheckRow;
    if (cols && cells.length >= Math.max(cols.spec, cols.result) + 1) {
      row = { name: cells[cols.test] ?? "", spec: cells[cols.spec] ?? "", result: cells[cols.result] ?? "", method: cols.method >= 0 ? (cells[cols.method] ?? "") : "" };
    } else if (cells.length >= 4) {
      row = { name: cells[0], method: cells[1], spec: cells[cells.length - 2], result: cells[cells.length - 1] };
    } else if (cells.length === 3) {
      row = { name: cells[0], method: "", spec: cells[1], result: cells[2] };
    } else continue;
    // drop a leading row number ("1", "2.")
    row.name = row.name.replace(/^\d{1,2}[.)]?\s+/, "");
    if (!/[A-Za-z]/.test(row.name) || !(row.spec || row.result)) continue;
    rows.push(row);
  }
  return rows;
}

// ---------- what each test is ----------

const KINDS: [string, RegExp][] = [
  ["hm", /heavy metals?/i],
  ["sol", /solubility/i],
  ["idIr", /ident.*\b(ir|infra-?red|ftir)\b|\b(ir|ftir) (spectrum|identification)/i],
  ["idHplc", /ident.*(hplc|retention|liquid chrom)|retention time/i],
  ["idIon", /ident.*(chloride|sodium|sulfate|sulphate|potassium|calcium|counter|ion\b)/i],
  ["id", /^ident|identification|identity/i],
  ["clarity", /clarity|completeness of solution|appearance of solution|solution appearance/i],
  ["colour", /colou?r of solution/i],
  ["desc", /description|appearance|characters|colou?r\b|odou?r/i],
  ["rot", /optical rotation|specific rotation/i],
  ["ph", /\bph\b/i],
  ["mp", /melting/i],
  ["lod", /loss on drying|\blod\b/i],
  ["roi", /residue on ignition|sulph?ated ash|\broi\b|ash\b/i],
  ["water", /water|karl fischer|\bk\.?f\.?\b|moisture/i],
  ["ei", /elemental impurit|\b(lead|arsenic|cadmium|mercury|nickel|cobalt|vanadium|palladium)\b/i],
  ["ei", /\b(Pb|As|Cd|Hg|Ni|Co|Pd)\b/],
  ["rsolv", /residual solvent|organic volatile|\bovi\b/i],
  ["rsUnsp", /unspecified|any (other )?(individual |single |unknown )?impurit|any (other )?(individual|single)|single (max|largest|unknown)|largest (unknown|individual|single)|max(imum)? (individual|single|unknown)/i],
  ["rsTotal", /total (impurit|related|degrad|unknown)/i],
  ["rsSpec", /impurit|related (substance|compound)|degradation|chromatographic purity/i],
  ["chl", /chlorides?\b/i],
  ["sulf", /sulph?ates?\b/i],
  ["potency", /potency/i],
  ["assay", /assay|content|purity/i],
  ["bet", /endotoxin|\bbet\b|\blal\b/i],
  ["sterility", /sterility/i],
  ["tamc", /tamc|total aerobic|total (viable|plate)|aerobic (microbial|bacteria)|bacterial count/i],
  ["tymc", /tymc|yeasts?|moulds?|molds?|fung/i],
  ["path", /e\.?\s?coli|escherichia|salmonella|pseudomonas|staphylococcus|bile-tolerant|candida|clostridi/i],
  ["psd", /particle size|\bd\s?\(?(10|50|90)\)?|sieve|mesh|psd\b/i],
  ["density", /density/i],
  ["visc", /viscosity/i],
  ["xrpd", /xrpd|x-ray|polymorph/i],
];

const SOLVENTS: [RegExp, string, number][] = [
  // ICH Q3C(R9) Table 1, class 1 (ppm)
  [/\bbenzene\b/i, "Benzene", 2],
  [/carbon tetrachloride/i, "Carbon tetrachloride", 4],
  [/1,2-dichloroethane/i, "1,2-Dichloroethane", 5],
  [/1,1-dichloroethene/i, "1,1-Dichloroethene", 8],
  [/1,1,1-trichloroethane/i, "1,1,1-Trichloroethane", 1500],
  // class 3, 5000 ppm under option 1
  [/\b(ethanol|acetone|ethyl acetate|2-propanol|isopropanol|isopropyl alcohol|ipa|heptane|1-propanol|1-butanol|2-butanol|butyl acetate|methyl ethyl ketone|mek|isopropyl acetate|methyl acetate|acetic acid|anisole|pentane|tert-butyl methyl ether|mtbe|dimethyl sulfoxide|dmso|ethyl ether|diethyl ether|formic acid|methyl isobutyl ketone|propyl acetate|2-methyl-1-propanol|3-methyl-1-butanol|1-pentanol)\b/i, "Class 3", 5000],
];

/** ICH Q3C option 1 limit (ppm) for a solvent named in a test, or null. */
export function solventLimit(name: string): { solvent: string; ppm: number } | null {
  for (const [re, label, ppm] of SOLVENTS) if (re.test(name)) return { solvent: label === "Class 3" ? name : label, ppm };
  for (const [en, , pde] of q3cSolvents) {
    if (pde >= 50) continue;
    if (new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(name)) return { solvent: en, ppm: q3cOption1Ppm(pde) };
  }
  return null;
}

export function kindOf(name: string): string {
  if (solventLimit(name) && !/assay|content/i.test(name)) return "rsolv";
  return KINDS.find(([, re]) => re.test(name))?.[0] ?? "other";
}

// ---------- reference rows ----------

/** The openly citable requirement for a kind of test, when there is one. */
function generalRef(kind: string, name: string): RefRow | undefined {
  if (kind === "tamc") return { name: "TAMC", method: "", spec: publicSpecs.tamc.spec, from: "general", note: publicSpecs.tamc.source };
  if (kind === "tymc") return { name: "TYMC", method: "", spec: publicSpecs.tymc.spec, from: "general", note: publicSpecs.tymc.source };
  if (kind === "rsolv") {
    const s = solventLimit(name);
    if (s) return { name: `Residual solvent: ${s.solvent}`, method: "", spec: `≤ ${s.ppm} ppm`, from: "general", note: bi("ICH Q3C(R9) Option 1 concentration limit.", "حد غلظت روش 1 در ICH Q3C(R9).") };
  }
  return undefined;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** The reference row for a certificate row: same kind, and for impurities and solvents the same name. */
function findRef(row: CheckRow, kind: string, refs: RefRow[], used: Set<RefRow>): RefRow | undefined {
  const same = refs.filter((r) => kindOf(r.name) === kind && !used.has(r));
  if (kind === "rsSpec" || kind === "rsolv" || kind === "other" || kind === "id") {
    const n = norm(row.name);
    const letter = (s: string) => s.match(/\b(?:impurity|compound|related compound)\s+([a-z0-9]{1,3})\b/i)?.[1]?.toLowerCase();
    return (
      same.find((r) => norm(r.name) === n) ??
      same.find((r) => letter(r.name) && letter(r.name) === letter(row.name)) ??
      same.find((r) => kind === "rsolv" && solventLimit(r.name)?.solvent === solventLimit(row.name)?.solvent) ??
      (kind === "id" || kind === "other" ? same.find((r) => n.includes(norm(r.name)) || norm(r.name).includes(n)) : undefined)
    );
  }
  return same[0];
}

// ---------- comparing limits ----------

type Lim = { min?: number; max?: number; unit: string };

function limits(spec: string): Lim | null {
  const p = parseSpec(spec.replace(/\bmax(imum)?\b/i, "NMT").replace(/\bmin(imum)?\b/i, "NLT"));
  if (!p) return null;
  const unit = /ppm/i.test(spec) ? "ppm" : /%/.test(spec) ? "%" : /cfu/i.test(spec) ? "cfu" : /eu\b/i.test(spec) ? "eu" : /°|deg/i.test(spec) ? "deg" : "";
  return { ...p, unit };
}

/** Both limits in the same unit (% and ppm convert); null when they cannot be compared. */
function sameUnit(a: Lim, b: Lim): [Lim, Lim] | null {
  if (a.unit === b.unit || !a.unit || !b.unit) return [a, b];
  const f = (l: Lim, k: number): Lim => ({ unit: "ppm", min: l.min === undefined ? undefined : l.min * k, max: l.max === undefined ? undefined : l.max * k });
  if (a.unit === "%" && b.unit === "ppm") return [f(a, 10000), b];
  if (a.unit === "ppm" && b.unit === "%") return [a, f(b, 10000)];
  return null;
}

const close = (x: number, y: number) => Math.abs(x - y) <= Math.max(Math.abs(x), Math.abs(y)) * 1e-6 + 1e-12;

export function compareSpec(coa: string, ref: string): "same" | "stricter" | "looser" | "manual" {
  if (norm(coa) === norm(ref)) return "same";
  const a0 = limits(coa);
  const b0 = limits(ref);
  if (!a0 || !b0) return "manual";
  const u = sameUnit(a0, b0);
  if (!u) return "manual";
  const [a, b] = u;
  let looser = false;
  let stricter = false;
  if (b.max !== undefined) {
    if (a.max === undefined) looser = true;
    else if (!close(a.max, b.max)) {
      if (a.max > b.max) looser = true;
      else stricter = true;
    }
  }
  if (b.min !== undefined) {
    if (a.min === undefined) looser = true;
    else if (!close(a.min, b.min)) {
      if (a.min < b.min) looser = true;
      else stricter = true;
    }
  }
  if (looser) return "looser";
  if (stricter) return "stricter";
  if ((a.max !== undefined) !== (b.max !== undefined) || (a.min !== undefined) !== (b.min !== undefined)) return "stricter";
  return "same";
}

const verdict = (spec: string, result: string) => (spec && result ? conformity({ key: "", name: "", method: "", spec, result, conf: "auto" }) : null);

/** A result exactly on a numeric limit. */
function atLimit(spec: string, result: string): boolean {
  const l = limits(spec);
  const r = toNum(result);
  if (!l || r.length !== 1 || /[<>≤≥]/.test(result)) return false;
  return (l.max !== undefined && close(r[0], l.max)) || (l.min !== undefined && close(r[0], l.min));
}

// ---------- methods ----------

const uspChapters = (s: string) => [...s.matchAll(/<\s*(\d{2,4})\s*[A-Z]?\s*>/g)].map((m) => m[1]);
const eurChapters = (s: string) => [...s.matchAll(/\b(\d\.\d{1,2}\.\d{1,2})\b/g)].map((m) => m[1]);

function methodFindings(row: CheckRow, kind: string, ph: Pharmacopoeia): Finding[] {
  const out: Finding[] = [];
  const text = `${row.name} ${row.method}`;
  const usp = uspChapters(text);
  const eur = eurChapters(text);
  const test = coaTests[kind];
  if (kind === "hm" || usp.includes("231")) {
    out.push({
      level: "warn",
      text: bi(
        "Heavy metals (USP <231>, colour comparison with sulfide) was omitted from USP–NF in 2018 and Ph. Eur. 2.4.8 is no longer required in most monographs: elemental impurities are now controlled by ICH Q3D through USP <232>/<233> or Ph. Eur. 5.20/2.4.20. Ask for the ICH Q3D risk assessment or results.",
        `آزمون Heavy metals با روش USP <231> (مقایسه رنگ با سولفید) از سال 2018 از USP–NF حذف شده و Ph. Eur. 2.4.8 نیز در بیشتر مونوگراف‌ها دیگر الزامی نیست: ناخالصی‌های عنصری اکنون طبق ICH Q3D و با USP <232>/<233> یا Ph. Eur. 5.20 و 2.4.20 کنترل می‌شوند. ارزیابی ریسک یا نتایج ICH Q3D را درخواست کنید.`,
      ),
    });
  }
  if (/in[- ]?house|\bihs\b|internal method|company method|\bstp\b/i.test(row.method)) {
    out.push({
      level: "info",
      text: bi(
        "In-house method: the supplier should show it is validated and gives results equivalent to the pharmacopoeial method (USP General Notices 6.30; Ph. Eur. General Notices, alternative methods).",
        "روش داخلی (In-house): تأمین‌کننده باید نشان دهد روش Validate شده و نتایج آن با روش فارماکوپه هم‌ارز است (USP General Notices 6.30؛ General Notices در Ph. Eur.، روش‌های جایگزین).",
      ),
    });
  }
  if (!test) return out;
  const want = ph === "usp" ? test.usp : test.eur;
  if (!want) return out;
  const wanted = ph === "usp" ? uspChapters(want) : eurChapters(want);
  const cited = ph === "usp" ? usp : eur;
  const other = ph === "usp" ? eur : usp;
  if (cited.length && !cited.some((c) => wanted.includes(c))) {
    out.push({
      level: "info",
      text: bi(
        `The method cited (${cited.join(", ")}) is not the general chapter usually referred to for this test (${want}); check it against the monograph.`,
        `روش ذکرشده ${cited.join(", ")} فصل عمومی معمول برای این آزمون نیست (فصل معمول: ${want})؛ آن را با مونوگراف تطبیق دهید.`,
      ),
    });
  } else if (!cited.length && other.length) {
    const label = ph === "usp" ? "USP–NF" : "Ph. Eur./BP";
    out.push({
      level: "info",
      text: bi(
        `The certificate cites the other pharmacopoeia's chapter (${other.join(", ")}) for a ${label} grade; the ${label} method is ${want}. Harmonised chapters are interchangeable; for others, equivalence must be shown.`,
        `برگه برای گرید ${label} به فصل فارماکوپه دیگر، ${other.join(", ")}، ارجاع داده است؛ روش ${label} برابر ${want} است. فصل‌های هماهنگ‌شده (Harmonised) قابل جایگزینی‌اند؛ برای سایر فصل‌ها هم‌ارزی باید نشان داده شود.`,
      ),
    });
  }
  return out;
}

// ---------- the review ----------

const SOURCE: Record<RefRow["from"], Bi> = {
  lib: bi("your specification library", "کتابخانه Specification شما"),
  mono: bi("the pasted monograph", "مونوگراف واردشده"),
  general: bi("general requirements", "الزامات عمومی"),
};

export function reviewCertificate(rows: CheckRow[], refs: RefRow[], ph: Pharmacopoeia, text: string, today = new Date()): CheckReport {
  const used = new Set<RefRow>();
  const report: RowReport[] = rows.map((row) => {
    const kind = kindOf(row.name);
    const ref = findRef(row, kind, refs, used) ?? generalRef(kind, row.name);
    if (ref && refs.includes(ref)) used.add(ref);
    const findings: Finding[] = [];
    let spec: RowReport["spec"] = "noref";
    if (ref) {
      spec = row.spec ? compareSpec(row.spec, ref.spec) : "looser";
      const from = SOURCE[ref.from];
      if (!row.spec) {
        findings.push({ level: "warn", text: bi("The certificate gives no acceptance criterion for this test.", "برگه برای این آزمون حد پذیرش ذکر نکرده است.") });
      } else if (spec === "looser") {
        findings.push({
          level: "fail",
          text: bi(`The certificate limit (${row.spec}) is wider than the reference (${ref.spec}, ${from.en}).`, `حد برگه ${row.spec} از حد مرجع ${ref.spec} گسترده‌تر است (مرجع: ${from.fa}).`),
        });
      } else if (spec === "stricter") {
        findings.push({ level: "info", text: bi(`The certificate limit is tighter than the reference (${ref.spec}).`, `حد برگه از حد مرجع ${ref.spec} سخت‌گیرانه‌تر است.`) });
      } else if (spec === "manual") {
        findings.push({ level: "info", text: bi(`Compare with the reference by hand: ${ref.spec} (${from.en}).`, `با مرجع به‌صورت دستی مقایسه کنید: ${ref.spec}؛ مرجع: ${from.fa}.`) });
      }
      if (ref.note) findings.push({ level: "info", text: ref.note });
    }
    // the result, against the certificate's own limit and against the reference
    const own = verdict(row.spec, row.result);
    const vsRef = ref ? verdict(ref.spec, row.result) : null;
    let result: RowReport["result"] = "open";
    if (!row.result.trim()) {
      findings.push({ level: "warn", text: bi("No result is given.", "نتیجه‌ای ذکر نشده است.") });
    } else if (own === "fail" || vsRef === "fail") {
      result = "fail";
      findings.push(
        own === "fail"
          ? { level: "fail", text: bi("The result is outside the certificate's own limit.", "نتیجه خارج از حد خود برگه است.") }
          : { level: "fail", text: bi(`The result complies with the certificate limit but not with the reference (${ref?.spec}).`, `نتیجه با حد برگه منطبق است اما با حد مرجع ${ref?.spec ?? ""} منطبق نیست.`) },
      );
    } else if (own === "ok" || vsRef === "ok") {
      result = "ok";
      if (atLimit(row.spec, row.result)) findings.push({ level: "warn", text: bi("The result is exactly at the limit.", "نتیجه دقیقاً روی حد است.") });
    }
    if (/^(n\/?a|not applicable|-+|nil)$/i.test(row.result.trim()) && ["assay", "rsTotal", "rsUnsp", "water", "lod", "ei", "rsolv"].includes(kind)) {
      findings.push({ level: "fail", text: bi("“N/A” for a test the material needs.", "عبارت «N/A» برای آزمونی که برای این ماده لازم است.") });
    }
    if (/^(complies|conforms|passes|ok)$/i.test(row.result.trim()) && /\d/.test(row.spec) && kind !== "desc" && !kind.startsWith("id")) {
      findings.push({ level: "warn", text: bi("Only “complies” for a numeric limit: ask for the actual value.", "برای حد عددی فقط «Complies» آمده است: مقدار واقعی را درخواست کنید.") });
    }
    findings.push(...methodFindings(row, kind, ph));
    return { row, kind, ref, spec, result, findings };
  });

  const missing = refs.filter((r) => !used.has(r));
  const doc = documentChecks(text, rows, ph, today);
  const counts: Record<Level, number> = { ok: 0, info: 0, warn: 0, fail: 0 };
  for (const r of report) {
    const worst = r.findings.some((f) => f.level === "fail") ? "fail" : r.findings.some((f) => f.level === "warn") ? "warn" : r.result === "ok" ? "ok" : "info";
    counts[worst] += 1;
  }
  counts.warn += missing.length;
  for (const d of doc) if (d.level === "fail" || d.level === "warn") counts[d.level] += 1;
  return { rows: report, missing, doc, counts };
}

// ---------- the certificate as a document ----------

const MONTHS: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

/** The first date after a label: 2026-03-01, 01/03/2026, 01.03.2026, Mar 2026, 03/2026 (day-first, as most certificates). */
export function dateAfter(text: string, label: RegExp): Date | null {
  const m = text.match(new RegExp(`${label.source}[^\\n\\d]{0,25}([^\\n]{0,24})`, "i"));
  if (!m) return null;
  const s = m[m.length - 1];
  let d: RegExpMatchArray | null;
  if ((d = s.match(/(\d{4})[-/.](\d{1,2})(?:[-/.](\d{1,2}))?/))) return new Date(+d[1], +d[2] - 1, +(d[3] ?? 1));
  if ((d = s.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/))) {
    const y = +d[3] < 100 ? 2000 + +d[3] : +d[3];
    return new Date(y, +d[2] - 1, +d[1]);
  }
  if ((d = s.match(/(?:(\d{1,2})[\s-]*)?([A-Za-z]{3})[a-z]*[\s.,-]*(\d{2,4})/))) {
    const mo = MONTHS[d[2].toLowerCase()];
    if (mo) return new Date(+d[3] < 100 ? 2000 + +d[3] : +d[3], mo - 1, +(d[1] ?? 1));
  }
  if ((d = s.match(/\b(\d{1,2})[-/.](\d{4})\b/))) return new Date(+d[2], +d[1] - 1, 1);
  return null;
}

function documentChecks(text: string, rows: CheckRow[], ph: Pharmacopoeia, today: Date): DocCheck[] {
  const t = clean(text);
  const has = (re: RegExp) => re.test(t);
  const out: DocCheck[] = [];
  const add = (id: string, label: Bi, found: boolean, missingLevel: Level = "warn", note?: Bi) => out.push({ id, label, found, level: found ? "ok" : missingLevel, note });

  add("batch", bi("Batch / lot number", "شماره بچ"), has(/\b(batch|lot)\s*(no\.?|number|#)?\s*[:：]?\s*[A-Z0-9][A-Z0-9/-]{2,}/i));
  add("mfg", bi("Date of manufacture", "تاریخ ساخت"), has(/\b(mfg|mfd|manufactur\w*|production|prod)\.?\s*(date|dt|on)\b|date of (manufacture|production)/i));
  const expLabel = /\b(exp\w*|retest|re-test|re-evaluation|use before|best before)\b\.?\s*(date|dt|on)?/i;
  add("exp", bi("Retest or expiry date", "تاریخ Retest یا انقضا"), has(expLabel));
  add("maker", bi("Manufacturer named", "نام تولیدکننده"), has(/\b(manufacturer|manufactured by|mfr\.?|made by|producer)\b/i));
  const phMention = has(/\b(USP|NF|BP|Ph\.?\s?Eur\.?|EP|JP|pharmacopoeia)\b/i);
  const edition = has(/\b(USP|BP|EP|Ph\.?\s?Eur\.?|JP)\s?-?\s?(\d{2,4}|NF\s?\d{2})\b|\b(\d{1,2}(st|nd|rd|th)?\s*(ed\.?|edition))|current (edition|monograph|version)/i);
  add(
    "edition",
    bi("Pharmacopoeia and edition", "فارماکوپه و ویرایش آن"),
    phMention && edition,
    "warn",
    phMention && !edition ? bi("The pharmacopoeia is named without an edition.", "نام فارماکوپه بدون ویرایش آمده است.") : undefined,
  );
  if (phMention && ph === "usp" && !has(/\b(USP|NF)\b/) && has(/\b(BP|Ph\.?\s?Eur\.?|EP)\b/i)) {
    out.push({ id: "phmismatch", label: bi("Grade of the certificate", "گرید برگه"), found: false, level: "warn", note: bi("You chose USP–NF, but the certificate refers to Ph. Eur./BP.", "شما USP–NF را انتخاب کرده‌اید، اما برگه به Ph. Eur. یا BP ارجاع داده است.") });
  }
  if (phMention && ph !== "usp" && !has(/\b(BP|Ph\.?\s?Eur\.?|EP)\b/i) && has(/\b(USP|NF)\b/)) {
    out.push({ id: "phmismatch", label: bi("Grade of the certificate", "گرید برگه"), found: false, level: "warn", note: bi("You chose Ph. Eur./BP, but the certificate refers to USP–NF.", "شما Ph. Eur. یا BP را انتخاب کرده‌اید، اما برگه به USP–NF ارجاع داده است.") });
  }
  add("approval", bi("Approval by the quality unit (QA)", "تأیید واحد کیفیت (QA)"), has(/\b(approved|released|authori[sz]ed|qa\b|quality assurance)\b/i));
  add("conclusion", bi("Conclusion statement", "جمع‌بندی (Conclusion)"), has(/\b(conclusion|complies with|conforms to|meets the requirements|released|passed)\b/i), "info");
  add("numeric", bi("Numerical results for quantitative tests", "نتایج عددی برای آزمون‌های کمّی"), rows.some((r) => /\d/.test(r.result)), "warn");

  if (has(/research (use )?only|for r\s?&\s?d|not for (human|drug|pharmaceutical|medicinal) use|technical grade|industrial grade|reagent grade|laboratory reagent/i)) {
    out.push({
      id: "grade",
      label: bi("Grade of the material", "گرید ماده"),
      found: false,
      level: "fail",
      note: bi("The certificate says research, technical or reagent grade: not acceptable for medicines.", "برگه گرید پژوهشی، صنعتی یا آزمایشگاهی ذکر کرده است: برای دارو قابل قبول نیست."),
    });
  }
  const exp = dateAfter(t, expLabel);
  if (exp && exp < today) {
    out.push({ id: "expired", label: bi("Retest / expiry date", "تاریخ Retest یا انقضا"), found: false, level: "fail", note: bi("The retest or expiry date has passed.", "تاریخ Retest یا انقضا گذشته است.") });
  }
  const mfg = dateAfter(t, /\b(mfg|mfd|manufactur\w*|production)\b\.?\s*(date|dt|on)\b/i);
  if (mfg && exp && mfg >= exp) {
    out.push({ id: "dates", label: bi("Dates", "تاریخ‌ها"), found: false, level: "warn", note: bi("The date of manufacture is not before the retest/expiry date.", "تاریخ ساخت پیش از تاریخ Retest یا انقضا نیست.") });
  }
  const edge = rows.filter((r) => atLimit(r.spec, r.result)).length;
  if (edge >= 2) {
    out.push({ id: "edge", label: bi("Results at the limit", "نتایج روی حد"), found: false, level: "warn", note: bi(`${edge} results are exactly at their limit; ask for the raw data.`, `${edge} نتیجه دقیقاً روی حد هستند؛ داده خام را درخواست کنید.`) });
  }
  return out;
}
