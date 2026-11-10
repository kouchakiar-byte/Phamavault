/*
 * Molecular formulas → molecular weight, with the IUPAC standard atomic
 * weights (CIAAW 2021, conventional/abridged values). Accepts parentheses,
 * dotted parts with a leading count and charges: "C17H18FN3O3·HCl·H2O",
 * "(C33H34FN2O5)2Ca·3H2O", "C8H15NaO2". Safe for the browser.
 */

export const atomicWeights: Record<string, number> = {
  H: 1.008, C: 12.011, N: 14.007, O: 15.999, S: 32.06, P: 30.973762, Cl: 35.45, Br: 79.904, I: 126.90447,
  F: 18.998403163, Na: 22.98976928, K: 39.0983, Ca: 40.078, Mg: 24.305, Zn: 65.38, Sr: 87.62, Li: 6.94,
  Al: 26.9815384, B: 10.81, Se: 78.971, Fe: 55.845, Si: 28.085, Bi: 208.9804, Pt: 195.084, Gd: 157.25,
  Co: 58.933194, Cu: 63.546, Mn: 54.938043, As: 74.921595, Au: 196.96657, Ag: 107.8682, Ga: 69.723,
  Ba: 137.327, Sb: 121.76, Ti: 47.867, Cr: 51.9961, La: 138.90547, Hg: 200.592, Sn: 118.71, Mo: 95.95, W: 183.84,
};

type Counts = Record<string, number>;

function merge(into: Counts, add: Counts, k: number) {
  for (const [el, n] of Object.entries(add)) into[el] = (into[el] ?? 0) + n * k;
}

/** Element counts of one dot-free part, with nested parentheses. Throws on anything else. */
function parsePart(s: string): Counts {
  const stack: Counts[] = [{}];
  let i = 0;
  const count = () => {
    const m = /^\d+(\.\d+)?/.exec(s.slice(i));
    if (!m) return 1;
    i += m[0].length;
    return Number(m[0]);
  };
  while (i < s.length) {
    const ch = s[i];
    if (ch === "(" || ch === "[") {
      stack.push({});
      i++;
    } else if (ch === ")" || ch === "]") {
      i++;
      const group = stack.pop();
      if (!group || !stack.length) throw new Error("bracket");
      merge(stack[stack.length - 1], group, count());
    } else {
      const m = /^[A-Z][a-z]?/.exec(s.slice(i));
      if (!m || !(m[0] in atomicWeights)) throw new Error("element");
      i += m[0].length;
      merge(stack[stack.length - 1], { [m[0]]: 1 }, count());
    }
  }
  if (stack.length !== 1) throw new Error("bracket");
  return stack[0];
}

/** Element counts of a formula, or null when it cannot be read. */
export function parseFormula(formula: string): Counts | null {
  const s = formula
    .replace(/[₀-₉]/g, (d) => String(d.charCodeAt(0) - 0x2080))
    .replace(/\s+/g, "")
    .replace(/[+-]\d*$/, "");
  if (!s) return null;
  try {
    const total: Counts = {};
    // A "." separates parts, except inside a leading count such as "0.5H2O".
    const parts: string[] = [];
    let cur = "";
    for (const ch of s) {
      if ("·•*".includes(ch) || (ch === "." && !/^\d+$/.test(cur))) {
        parts.push(cur);
        cur = "";
      } else cur += ch;
    }
    parts.push(cur);
    for (const raw of parts) {
      if (!raw) continue;
      const m = /^(\d+(?:\.\d+)?)?(.*)$/.exec(raw)!;
      if (!m[2]) return null;
      merge(total, parsePart(m[2]), m[1] ? Number(m[1]) : 1);
    }
    return Object.keys(total).length ? total : null;
  } catch {
    return null;
  }
}

/** Molecular weight of a formula (g/mol), or NaN. */
export function formulaWeight(formula: string): number {
  const c = parseFormula(formula);
  if (!c) return NaN;
  return Object.entries(c).reduce((sum, [el, n]) => sum + atomicWeights[el] * n, 0);
}

/** A number typed as is, or the molecular weight of a typed formula. */
export function weightOrFormula(s: string | undefined): number {
  const t = (s ?? "").trim().replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0)).replace(/٫/g, ".");
  if (/^\d+(\.\d+)?$/.test(t)) return Number(t);
  return formulaWeight(t);
}
