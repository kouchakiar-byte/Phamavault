/*
 * Search and ranking for the supplier bank, ported unchanged from the approved
 * design: Persian/Arabic normalisation, synonym groups (B1 = thiamine = تیامین),
 * digit-aware matching (B1 never matches B12) and credibility tiers.
 */

export type SupplierRecord = {
  n: string; // Persian name
  e: string; // English name
  t: "m" | "t"; // domestic manufacturer | importer/trader
  c: string[]; // categories
  prov: string;
  city: string;
  tel: string[];
  mail?: string;
  web?: string;
  addr?: string;
  site?: string;
  note?: string;
  src: string;
  p: string[]; // "فارسی|English|tag"
  via?: number; // listed from a product-page title in web search
  top?: number; // force tier A
  hi?: number; // force tier B
  partial?: number; // incomplete entry
  gv?: number; // general vitamin supplier: matches any vitamin query
};

export type Product = { fa: string; en: string; tag: string; key: string };
export type Tier = "A" | "B" | "C" | "D";
export type Supplier = SupplierRecord & { products: Product[]; nameKey: string; tier: Tier };
export type SortKey = "cred" | "rel" | "site" | "type" | "name";
export type Filters = { query: string; type: "all" | "m" | "t"; cat: string; sort: SortKey; telOnly: boolean };
export type Result = { s: Supplier; hits: Product[] };

export const norm = (s: string | undefined) =>
  (s || "")
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ی")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[‌‏‎]/g, " ")
    .replace(/کلراید/g, "کلرید")
    .replace(/اکساید/g, "اکسید")
    .replace(/گلایکول/g, "گلیکول")
    .replace(/[‌\-_،,.()٪%]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Whole-ish match: a needle ending in a digit must not be followed by another digit (B1 vs B12). */
export function has(hay: string, needle: string): boolean {
  let i = hay.indexOf(needle);
  while (i > -1) {
    const nx = hay[i + needle.length] || "";
    const pv = hay[i - 1] || "";
    const okEnd = !(/\d$/.test(needle) && /\d/.test(nx));
    const okShort = needle.length > 3 || ((pv === "" || pv === " ") && (nx === "" || nx === " "));
    if (okEnd && okShort) return true;
    i = hay.indexOf(needle, i + 1);
  }
  return false;
}

const STOP_WORDS = ["ویتامین", "vitamin", "ماده", "اولیه", "b", "ب"];

/** Each query word (or a synonym phrase inside the query) becomes a set of alternatives; all sets must match. */
export function terms(q: string, synonyms: string[][]): string[][] {
  let rest = ` ${q} `;
  const sets: string[][] = [];
  synonyms.forEach((g) => {
    const hit = g.filter((a) => rest.includes(` ${a} `)).sort((a, b) => b.length - a.length)[0];
    if (hit) {
      sets.push(g);
      rest = rest.replace(` ${hit} `, "  ");
    }
  });
  rest
    .trim()
    .split(" ")
    .filter((w) => w && !STOP_WORDS.includes(w))
    .forEach((w) => {
      if (w.length > 1 || /\d/.test(w)) sets.push([w]);
    });
  return sets;
}

const matchProduct = (key: string, sets: string[][]) => sets.every((s) => s.some((a) => has(key, a)));

/** A = syndicate member with phone, B = contact from own site, C = website only, D = marketplace/ads/retail. */
function tier(d: SupplierRecord): Tier {
  const note = d.note || "";
  const hasTel = d.tel.length > 0 && !d.tel.join("").includes("ناقص");
  if (d.top) return "A";
  if (d.hi) return "B";
  if (
    d.partial ||
    (d.web || "").includes("chemibazar") ||
    note.includes("آگهی") ||
    note.includes("فروش خرد") ||
    note.includes("آزمایشگاهی")
  )
    return "D";
  if (d.t === "m" && d.src.includes("cppsynd") && hasTel) return "A";
  if (hasTel && (d.t === "m" || d.addr || d.site)) return "B";
  if (d.t === "m" && d.src.includes("cppsynd")) return "B";
  return "C";
}

export function prepare(records: SupplierRecord[]): Supplier[] {
  return records.map((d) => ({
    ...d,
    products: d.p.map((s) => {
      const [fa, en = "", tag = ""] = s.split("|");
      return { fa, en, tag, key: norm(`${fa} ${en}`) };
    }),
    nameKey: norm(`${d.n} ${d.e}`),
    tier: tier(d),
  }));
}

export function search(
  suppliers: Supplier[],
  f: Filters,
  synonyms: string[][],
  provinceOrder: string[],
): Result[] {
  const q = norm(f.query);
  const sets = q ? terms(q, synonyms) : [];
  const vitaminQuery = /ویتامین|vitamin/.test(q) || sets.some((g) => g.some((x) => /ویتامین|vitamin/.test(x)));

  const rows = suppliers
    .map((s) => {
      const hits = sets.length ? s.products.filter((p) => matchProduct(p.key, sets)) : [];
      const nameHit = Boolean(q) && (has(s.nameKey, q) || (Boolean(s.gv) && vitaminQuery));
      return { s, hits, nameHit };
    })
    .filter(
      (r) =>
        (!q || r.hits.length || r.nameHit) &&
        (f.type === "all" || r.s.t === f.type) &&
        (f.cat === "all" || r.s.c.includes(f.cat)) &&
        (!f.telOnly || r.s.tel.length),
    );

  const province = (r: Result) => {
    const i = provinceOrder.indexOf(r.s.prov);
    return i < 0 ? 99 : i;
  };
  const tel = (r: Result) => (r.s.tel.length ? 1 : 0);
  const rel = (a: Result, b: Result) =>
    (a.s.partial ? 1 : 0) - (b.s.partial ? 1 : 0) ||
    tel(b) - tel(a) ||
    b.hits.length - a.hits.length ||
    b.s.products.length - a.s.products.length;
  const compare: Record<SortKey, (a: Result, b: Result) => number> = {
    rel,
    cred: (a, b) =>
      a.s.tier.localeCompare(b.s.tier) ||
      tel(b) - tel(a) ||
      b.hits.length - a.hits.length ||
      b.s.products.length - a.s.products.length,
    site: (a, b) => province(a) - province(b) || a.s.n.localeCompare(b.s.n, "fa"),
    type: (a, b) => a.s.t.localeCompare(b.s.t) || rel(a, b),
    name: (a, b) => a.s.n.localeCompare(b.s.n, "fa"),
  };

  return rows.map(({ s, hits }) => ({ s, hits })).sort(compare[f.sort]);
}
