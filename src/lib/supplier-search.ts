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
  cs?: number; // specialist in cosmetic raw materials: first when the cosmetic category is chosen
  webDown?: boolean; // website failed several daily link checks in a row
};

export type Product = { fa: string; en: string; tag: string; key: string };
export type Tier = "A" | "B" | "C" | "D";
export type Supplier = SupplierRecord & { products: Product[]; nameKey: string; tier: Tier };
export type SortKey = "cred" | "rel" | "site" | "type" | "name";
export type Filters = { query: string; type: "all" | "m" | "t"; cat: string; sort: SortKey; telOnly: boolean };
/** Why a company is in the results, strongest first. */
export type MatchKind = "name" | "product" | "category" | "general";
export type Result = { s: Supplier; hits: Product[]; match?: MatchKind };

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

const isWordChar = (c: string) => /[\p{L}\p{N}]/u.test(c);

/*
 * Salt and class words that must not match inside another word: «کلرید» is not
 * «هیدروکلرید», "oxide" is not "hydroxide" or "chlordiazepoxide".
 */
const BOUND_WORDS = new Set([
  "chloride", "bromide", "iodide", "fluoride", "oxide", "dioxide", "hydroxide", "peroxide", "sulfate", "sulphate",
  "sulfide", "sulfite", "phosphate", "carbonate", "nitrate", "citrate", "acetate", "lactate", "gluconate", "tartrate",
  "stearate", "chromium", "sodium", "calcium", "potassium", "magnesium",
]);

/**
 * Word-aware match. The needle must start a word («کلرید» is not
 * «هیدروکلرید»), so typing the start of a name still finds it; a very short
 * needle must be the whole word («روی» is not «دارویی», «کروم» is not
 * «کروماتوگرافی»); and a needle ending in a digit must not run into another
 * digit (B1 vs B12). Long Latin words may still match inside a compound
 * ("paraben" in "methylparaben"), except salt and class words.
 */
const WHOLE_WORDS = new Set(["کروم", "chrome"]);

export function has(hay: string, needle: string): boolean {
  if (!needle) return false;
  const short = (needle.length <= 3 && !/\d/.test(needle)) || WHOLE_WORDS.has(needle);
  const inner = needle.length >= 7 && /^[a-z]+$/.test(needle) && !BOUND_WORDS.has(needle);
  let i = hay.indexOf(needle);
  while (i > -1) {
    const pv = hay[i - 1] || "";
    const nx = hay[i + needle.length] || "";
    const okStart = inner || !pv || !isWordChar(pv);
    const okEnd = /\d$/.test(needle) ? !/\d/.test(nx) : !short || !nx || !isWordChar(nx);
    if (okStart && okEnd) return true;
    i = hay.indexOf(needle, i + 1);
  }
  return false;
}

const STOP_WORDS = ["ویتامین", "vitamin", "ماده", "اولیه", "b", "ب"];
/** Stop words that still mean something when the query is nothing else («ویتامین» alone). */
const ALONE_WORDS = new Set(["ویتامین", "vitamin"]);

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
  if (!sets.length) {
    const alone = q.split(" ").filter((w) => ALONE_WORDS.has(w));
    if (alone.length) sets.push(["ویتامین", "vitamin"]);
  }
  return sets;
}

const matchProduct = (key: string, sets: string[][]) => sets.every((s) => s.some((a) => has(key, a)));

/** Words that say "a company" rather than which one: «شرکت داروسازی تماد» and «Temad Co.» are both Temad. */
const COMPANY_WORDS = new Set([
  "شرکت", "داروسازی", "دارویی", "صنایع", "گروه", "تولیدی", "تولید", "مواد", "اولیه", "کارخانه", "سهامی", "خاص", "عام",
  "co", "company", "corp", "ltd", "inc", "llc", "group", "industries", "industrial", "pharmaceutical", "pharmaceuticals",
]);

/**
 * A company found by its name however it is typed: with or without «شرکت» /
 * «داروسازی» / "Co.", with the words in another order, or spaced differently
 * («دارو پخش» = «داروپخش», "Cinna Gen" = "CinnaGen").
 */
export function nameMatch(nameKey: string, q: string): boolean {
  if (has(nameKey, q)) return true;
  // Spacing only: «دارو پخش» = «داروپخش». Long enough not to hit the middle of an unrelated name.
  const flat = nameKey.replace(/ /g, "");
  const qFlat = q.replace(/ /g, "");
  if (qFlat.length >= 5 && flat.includes(qFlat)) return true;
  const words = q.split(" ").filter((w) => w && !COMPANY_WORDS.has(w));
  if (!words.length || !words.some((w) => w.length >= 3)) return false;
  return words.every((w) => has(nameKey, w) || (w.length >= 5 && flat.includes(w)));
}

/** Categories whose label the query names: «بسته بندی» → packaging, «رفرنس استاندارد» → standards. */
export function categoryMatch(q: string, labels: Record<string, string[]>): string[] {
  if (q.length < 3) return [];
  return Object.entries(labels)
    .filter(([key, names]) => key !== "all" && names.some((n) => has(n, q) || (n.length >= 3 && has(q, n))))
    .map(([key]) => key);
}

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
  categoryLabels: Record<string, string[]> = {},
): Result[] {
  const q = norm(f.query);
  const sets = q ? terms(q, synonyms) : [];
  const vitaminQuery = /ویتامین|vitamin/.test(q) || sets.some((g) => g.some((x) => /ویتامین|vitamin/.test(x)));
  const cats = q ? categoryMatch(q, categoryLabels) : [];

  const kindOf = (s: Supplier, hits: Product[]): MatchKind | undefined => {
    if (!q) return undefined;
    if (nameMatch(s.nameKey, q)) return "name";
    if (hits.length) return "product";
    if (s.c.some((c) => cats.includes(c))) return "category";
    // General vitamin suppliers are listed for a vitamin they have not named, after those who did.
    if (s.gv && vitaminQuery) return "general";
    return undefined;
  };
  const rank: Record<MatchKind, number> = { name: 0, product: 1, category: 2, general: 3 };

  const rows = suppliers
    .map((s) => {
      const hits = sets.length ? s.products.filter((p) => matchProduct(p.key, sets)) : [];
      return { s, hits, match: kindOf(s, hits) };
    })
    .filter(
      (r) =>
        (!q || r.match) &&
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

  // With the cosmetic category chosen, cosmetic specialists come first, then the chosen order.
  const cosFocus = (r: Result) => (r.s.cs ? 2 : 0) + (r.s.c[0] === "cos" ? 1 : 0);
  const chosen = f.cat === "cos" ? (a: Result, b: Result) => cosFocus(b) - cosFocus(a) || compare[f.sort](a, b) : compare[f.sort];
  // Whatever the sort, companies that actually list the searched material come before looser matches.
  const strength = (r: Result) => (r.match ? rank[r.match] : 0);
  return rows.sort((a, b) => strength(a) - strength(b) || chosen(a, b));
}
