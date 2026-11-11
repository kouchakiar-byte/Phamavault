/*
 * Reads the text of a monograph that the user copies from their own USP–NF,
 * Ph. Eur. or BP subscription, and turns it into CoA rows: test, method and
 * acceptance criterion. Runs in the browser; nothing is sent or stored, and the
 * rows are a draft the user checks against the monograph before use.
 */

export type ImportedRow = { name: string; method: string; spec: string };
export type ImportResult = { style: "usp" | "eur" | "unknown"; rows: ImportedRow[] };

const clean = (s: string) =>
  s
    .replace(/[⟨〈]/g, "<")
    .replace(/[⟩〉]/g, ">")
    .replace(/ /g, " ")
    .replace(/[‐‑‒–—−]/g, (c) => (c === "−" ? "-" : "–"))
    .replace(/\s+/g, " ")
    .trim();

/** Pharmacopoeial wording to the short CoA form: "maximum 0.5 per cent" → "NMT 0.5%". */
export function normaliseSpec(raw: string): string {
  const s = clean(raw)
    .replace(/\bper cent\b/gi, "%")
    .replace(/\s+%/g, "%")
    .replace(/\bnot more than\b/gi, "NMT")
    .replace(/\bnot less than\b/gi, "NLT")
    .replace(/^maximum\b/i, "NMT")
    .replace(/^minimum\b/i, "NLT")
    .replace(/\s*[,;]\s*(determined|calculated|using|on \d|by drying|in an oven).*$/i, "")
    .replace(/[.;,]+$/, "")
    .trim();
  return s.replace(/([+–-])\s+(\d)/g, "$1$2");
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- USP–NF ----------

/** "Water Determination <921>, Method I: NMT 0.5%" and the "Acceptance criteria:" that follow a test. */
function parseUsp(text: string): ImportedRow[] {
  const rows: ImportedRow[] = [];
  const t = clean(text);
  // Content limits from the definition: "contains NLT 98.0% and NMT 102.0% of …, calculated on the anhydrous basis".
  const def = t.match(/contains? NLT (\d+(?:\.\d+)?)% and NMT (\d+(?:\.\d+)?)% of [^.]*?(?:calculated on the ([a-z-]+(?: [a-z-]+)?) basis)?[.,]/i);
  // Split into bullet items; the section heads (IDENTIFICATION, ASSAY, IMPURITIES, SPECIFIC TESTS) mark where we are.
  const parts = t.split(/(?=•)|(?=\b(?:IDENTIFICATION|ASSAY|IMPURITIES|SPECIFIC TESTS|ADDITIONAL REQUIREMENTS)\b)/);
  let section = "";
  let idLetter = "";
  let assaySeen = false;
  for (const raw of parts) {
    const p = raw.replace(/^•\s*/, "").trim();
    const head = p.match(/^(IDENTIFICATION|ASSAY|IMPURITIES|SPECIFIC TESTS|ADDITIONAL REQUIREMENTS)\b/);
    if (head) {
      section = head[1];
      continue;
    }
    if (!p || section === "ADDITIONAL REQUIREMENTS") continue;
    const ch = p.match(/<(\d{2,4})[A-Z]?>/)?.[1];
    const accept = p.match(/Acceptance criteria:?\s*([^•]+?)(?=(?:\s[A-Z][a-z]+ solution:|\s(?:Analysis|Calculate|System suitability|Samples)\b|$))/i)?.[1];
    if (section === "IDENTIFICATION") {
      const letter = p.match(/^([A-H])\.\s*/)?.[1];
      if (letter) idLetter = letter;
      const body = p.replace(/^[A-H]\.\s*/, "");
      const ir = /Infrared|IR\b|197[A-Z]/i.test(body);
      const hplc = /retention time/i.test(body);
      const what = ir ? "IR" : hplc ? "HPLC retention time" : ch === "191" ? cap((body.split(":")[0].split(",").pop() ?? "").trim()) : cap(body.split(/[,:<.]/)[0].trim()).slice(0, 60);
      const name = `Identification ${idLetter ? `${idLetter} ` : ""}(${what})`;
      rows.push({ name, method: ch ? `USP <${ch}>` : hplc ? "USP <621>" : "USP–NF monograph", spec: ir ? "Conforms to the reference spectrum" : "Conforms" });
      continue;
    }
    // "Name <chapter>[, variant]: criterion" on one line.
    const inline = p.match(/^([A-Za-z][A-Za-z ,/()-]+?)\s*<(\d{2,4})[A-Z]?>([^:]*):\s*([^•]+)$/);
    if (inline && !/Acceptance criteria/i.test(inline[4])) {
      let name = inline[1].replace(/\s+Determination$/i, "").trim();
      if (/specific rotation/i.test(inline[3])) name = "Specific rotation";
      const variant = inline[3].match(/Method [IVX]+[a-z]?/)?.[0];
      const crit = inline[4].replace(/\s*(?:Analysis|Sample|Standard|Calculate)\b.*$/, "").replace(/,\s*in a solution.*$/i, "");
      rows.push({ name: name === "Water" ? "Water (Karl Fischer)" : name, method: `USP <${inline[2]}>${variant ? `, ${variant}` : ""}`, spec: normaliseSpec(crit) });
      continue;
    }
    if (accept) {
      const title = p.split(/[:.]/)[0].replace(/^Procedure\s*\d*$/i, "").trim();
      const sec = section === "ASSAY" ? "Assay" : title || "Test";
      const name = section === "ASSAY" ? "Assay" : section === "IMPURITIES" && /organic|related/i.test(p) ? "Organic impurities" : sec.replace(/<\d+>.*/, "").trim();
      if (section === "ASSAY") assaySeen = true;
      const crit = normaliseSpec(accept);
      if (/see table/i.test(crit)) {
        const unsp = p.match(/(?:Any )?(?:individual )?unspecified (?:impurity|degradation product)[^\d]{0,40}?(\d+(?:\.\d+)?)/i);
        const total = p.match(/Total (?:impurities|degradation products)[^\d]{0,40}?(\d+(?:\.\d+)?)/i);
        if (unsp) rows.push({ name: "Any individual unspecified impurity", method: "USP <621>", spec: `NMT ${unsp[1]}%` });
        if (total) rows.push({ name: "Total impurities", method: "USP <621>", spec: `NMT ${total[1]}%` });
        if (!unsp && !total) rows.push({ name, method: ch ? `USP <${ch}>` : "USP <621>", spec: crit });
        continue;
      }
      rows.push({ name, method: ch ? `USP <${ch}>` : section === "ASSAY" ? "USP <621>" : "USP–NF monograph", spec: crit });
    }
  }
  if (def && !assaySeen) {
    rows.push({ name: "Assay", method: "USP–NF monograph", spec: `${def[1]}%–${def[2]}%${def[3] ? ` (${def[3]} basis)` : ""}` });
  } else if (def) {
    const a = rows.find((r) => r.name === "Assay");
    if (a && !/\d/.test(a.spec)) a.spec = `${def[1]}%–${def[2]}%${def[3] ? ` (${def[3]} basis)` : ""}`;
  }
  return rows;
}

// ---------- Ph. Eur. / BP ----------

/** "Loss on drying (2.2.32): maximum 0.5 per cent, determined on 1.000 g …" and the related-substances limits. */
function parseEur(text: string, bp: boolean): ImportedRow[] {
  const rows: ImportedRow[] = [];
  const t = clean(text);
  const ref = (n: string) => (bp ? `BP (Ph. Eur. ${n})` : `Ph. Eur. ${n}`);
  const content = t.match(/Content:?\s*(\d+(?:\.\d+)?)\s*per cent to (\d+(?:\.\d+)?)\s*per cent(?:\s*\(([^)]+)\))?/i);
  const appearance = t.match(/Appearance:\s*([^.]+)\./i);
  if (appearance) rows.push({ name: "Appearance", method: bp ? "BP monograph" : "Ph. Eur. monograph", spec: cap(clean(appearance[1])) });
  const solubility = t.match(/Solubility:\s*([^.]+)\./i);
  if (solubility) rows.push({ name: "Solubility", method: bp ? "BP monograph" : "Ph. Eur. monograph", spec: cap(clean(solubility[1]).replace(/\bper cent\b/gi, "%").replace(/\s+%/g, "%")) });

  // Identification: "A. Infrared absorption spectrophotometry (2.2.24)."
  const idPart = t.match(/IDENTIFICATION(.*?)(?:TESTS|ASSAY|$)/)?.[1] ?? "";
  const idItems = idPart.replace(/(?:First|Second) identification:[^.]*\./gi, "").split(/(?:^|\s)(?=[A-F]\.\s)/);
  for (const item of idItems) {
    const m = item.match(/^([A-F])\.\s+(.+)$/);
    if (!m) continue;
    const body = m[2];
    const refN = body.match(/\((2\.\d+\.\d+)/)?.[1];
    const what = /infrared/i.test(body) ? "IR" : /liquid chromatography|retention/i.test(body) ? "HPLC" : /thin-layer/i.test(body) ? "TLC" : /chlorides?/i.test(body) ? "Chlorides" : /sodium/i.test(body) ? "Sodium" : /sulfates?/i.test(body) ? "Sulfates" : /potassium/i.test(body) ? "Potassium" : cap(body.split(/[.(]/)[0].trim()).slice(0, 50);
    rows.push({ name: `Identification ${m[1]} (${what})`, method: refN ? ref(refN) : bp ? "BP monograph" : "Ph. Eur. monograph", spec: "Conforms" });
  }

  const tests = t.match(/TESTS(.*?)(?:ASSAY|STORAGE|IMPURITIES|LABELLING|$)/)?.[1] ?? "";
  // "Name (2.x.y[, …]): limit."
  for (const m of tests.matchAll(/(?<=^|\.\s)([A-Za-z][A-Za-z ,-]{1,60}?)\s*\((2\.\d+\.\d+)[^)]*\)\s*:?\s*((?:maximum|minimum|not more than|not less than|[+–-]?\s?\d)(?:[^.]|\.\d)*)\./g)) {
    const name = m[1].trim();
    if (/^Related substances|^Liquid chromatography|^Gas chromatography/i.test(name)) continue;
    rows.push({ name: name === "Water" ? "Water (Karl Fischer)" : name, method: ref(m[2]), spec: normaliseSpec(m[3]) });
  }
  // Appearance of solution: "The solution is clear (2.2.1) and colourless (2.2.2, Method II)."
  const aos = tests.replace(/\s*\(2\.\d+\.\d+[^)]*\)/g, "").match(/Appearance of solution\.\s*([^.]*?(?:clear|colourless|not more intensely coloured)[^.]*)\./i);
  if (aos) rows.push({ name: "Appearance of solution", method: ref("2.2.1, 2.2.2"), spec: cap(clean(aos[1]).replace(/^The solution is\s+/i, "")) });
  // Related substances limits: "— impurity A: not more than 0.2 per cent; — unspecified impurities: for each impurity, not more than 0.10 per cent; — total: …"
  const lim = tests.match(/Related substances\..*?Limits?:\s*(.*?)(?:\.\s[A-Z][a-z]+(?: [a-z]+)*\s*[.(]|$)/i)?.[1];
  if (lim) {
    for (const item of lim.split(/\s*[–—-]\s+(?=[a-z])/)) {
      const m = item.match(/^([^:]+):\s*(.*)$/);
      if (!m || /disregard/i.test(m[1])) continue;
      const label = m[1].trim();
      const crit = normaliseSpec(m[2].replace(/for each impurity,?\s*/i, "").replace(/;?\s*$/, ""));
      const name = /unspecified/i.test(label) ? "Unspecified impurities (each)" : /^total$/i.test(label) ? "Total impurities" : cap(label);
      rows.push({ name: `Related substances: ${name}`, method: ref("2.2.29"), spec: crit });
    }
  }
  if (content) rows.push({ name: "Assay", method: bp ? "BP monograph" : "Ph. Eur. monograph", spec: `${content[1]}%–${content[2]}%${content[3] ? ` (${content[3]})` : ""}` });
  return rows;
}

/** Old-style BP monographs: "Loss on drying When dried …, loses not more than 0.5% of its weight. Appendix IX D." */
function parseBpAppendix(text: string): ImportedRow[] {
  const rows: ImportedRow[] = [];
  const t = clean(text);
  for (const m of t.matchAll(/(?<=^|[.…]\s)([A-Z][A-Za-z ,-]{2,50}?)\s+((?:When [^,]*,\s*)?(?:loses |contains )?not (?:more|less) than (?:[^.]|\.\d)*?)[.,]?\s*Appendix ([IVX]+ ?[A-Z]?\d?)/gi)) {
    const crit = m[2].replace(/^When [^,]*,\s*/i, "").replace(/^(loses|contains)\s+/i, "").replace(/\s+of its weight$/i, "");
    rows.push({ name: m[1].trim(), method: `BP Appendix ${m[3].trim()}`, spec: normaliseSpec(crit) });
  }
  return rows;
}

/** Reads a pasted monograph; the style is told from its chapter references. */
export function importMonograph(text: string, ph: "usp" | "eur" | "bp"): ImportResult {
  const t = clean(text);
  if (!t) return { style: "unknown", rows: [] };
  const looksUsp = /<\d{2,4}[A-Z]?>|Acceptance criteria/i.test(t);
  const looksEur = /\(2\.\d+\.\d+/.test(t) || /per cent/i.test(t);
  let rows: ImportedRow[] = [];
  let style: ImportResult["style"] = "unknown";
  if (looksUsp && (ph === "usp" || !looksEur)) {
    rows = parseUsp(text);
    style = "usp";
  } else if (looksEur) {
    rows = parseEur(text, ph === "bp");
    style = "eur";
  }
  if (ph === "bp" && /Appendix [IVX]+/.test(t)) rows = [...rows, ...parseBpAppendix(text)];
  // One row per test name and criterion.
  const seen = new Set<string>();
  rows = rows.filter((r) => {
    const k = `${r.name}|${r.spec}`.toLowerCase();
    if (seen.has(k) || !r.spec) return false;
    seen.add(k);
    return true;
  });
  return { style, rows };
}
