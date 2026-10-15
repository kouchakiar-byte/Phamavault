/*
 * Live search of the Iran FDA product register (irc.fda.gov.ir/nfi). The
 * register is reachable from servers inside Iran only, so the site's own
 * server asks it one query at a time — no bulk copy — keeps each answer for a
 * day, and caps how often it asks, so the public register is never loaded.
 * Server only.
 */

import { ircGet } from "./irc-http";

export const IRC_ORIGIN = "https://irc.fda.gov.ir";
export const ircSearchUrl = (term: string, page = 1, size = 10) =>
  `${IRC_ORIGIN}/nfi/Search?Term=${encodeURIComponent(term)}&PageNumber=${page}&PageSize=${size}`;

export type IranDrug = {
  titleFa: string;
  titleEn: string;
  brandOwner: string;
  licenseHolder: string;
  /** Price per pack in Rial as the register shows it, or null. */
  priceRial: number | null;
  pack: string;
  productCode: string;
  genericCode: string;
};

/** Products of one generic (same generic code): the alternatives to each other. */
export type IranGeneric = { genericCode: string; titleFa: string; titleEn: string; products: IranDrug[] };

export type IranDrugResult = {
  term: string;
  /** "ok", "empty" (no products), "unreadable" (page fetched but not understood) or "unavailable" (register not reachable). */
  status: "ok" | "empty" | "unreadable" | "unavailable";
  generics: IranGeneric[];
  total: number;
  fetchedAt: string;
  source: string;
};

const PAGE_SIZE = 100;
const DAY = 24 * 60 * 60 * 1000;
const cache = new Map<string, { at: number; result: IranDrugResult }>();

// At most 20 requests to the register per minute from the whole site.
const window: number[] = [];
const allowRequest = () => {
  const now = Date.now();
  while (window.length && now - window[0] > 60_000) window.shift();
  if (window.length >= 20) return false;
  window.push(now);
  return true;
};

const latinDigits = (s: string) =>
  s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)));

/** The page as lines of visible text, in reading order. */
export function textLines(html: string): string[] {
  return decode(
    html
      .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr|td|th|span|a|b|strong|label|button|section|article)>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .split("\n")
    .map((l) => l.replace(/[‌‎‏]/g, " ").replace(/\s+/g, " ").trim())
    .filter((l) => l && l !== ":");
}

const LABELS = {
  brandOwner: /^صاحب\s*برند/,
  licenseHolder: /^صاحب\s*پروانه/,
  price: /^قیمت\s*هر\s*بسته/,
  pack: /^بسته\s*بندی/,
  productCode: /^کد\s*فرآورده/,
  genericCode: /^کد\s*ژنریک/,
} as const;
type Field = keyof typeof LABELS;
const fieldOf = (line: string) => (Object.keys(LABELS) as Field[]).find((k) => LABELS[k].test(line));
const NOISE = /^(نتیجه جستجو|عنوان دارو|جستجو|صفحه|بعدی|قبلی|«|»|\d+)$/;

/** Reads the product cards of a register search page. */
export function parseIrc(html: string): IranDrug[] {
  const lines = textLines(html);
  const out: IranDrug[] = [];
  let card: Partial<Record<Field, string>> & { title: string[] } = { title: [] };
  let pending: string[] = [];

  const valueAt = (i: number, field: Field): [string, number] => {
    const rest = lines[i].replace(LABELS[field], "").replace(/^\s*:\s*/, "").trim();
    if (rest) return [rest, i];
    const next = (lines[i + 1] ?? "").replace(/^\s*:\s*/, "").trim();
    return [next, i + 1];
  };

  for (let i = 0; i < lines.length; i++) {
    const field = fieldOf(lines[i]);
    if (!field) {
      if (!NOISE.test(lines[i])) pending.push(lines[i]);
      continue;
    }
    if (field === "brandOwner") {
      // A new card: what came before its first field is its title.
      card = { title: pending.slice(-4) };
      pending = [];
    }
    const [value, end] = valueAt(i, field);
    card[field] = value;
    i = end;
    if (field === "genericCode") {
      // The card's own title: the last Persian line and the last Latin line before its fields.
      const fa = card.title.filter((t) => /[؀-ۿ]/.test(t)).at(-1) ?? "";
      const en = card.title.filter((t) => !/[؀-ۿ]/.test(t) && /[A-Za-z]/.test(t)).at(-1) ?? "";
      const price = latinDigits(card.price ?? "").replace(/[^\d]/g, "");
      out.push({
        titleFa: fa,
        // "(SALT FORM … )BASE FORM …" as the register prints it → "BASE FORM … (SALT FORM …)"
        titleEn: en.replace(/^\((.+?)\s*\)\s*(.+)$/, "$2 ($1)"),
        brandOwner: card.brandOwner ?? "",
        licenseHolder: card.licenseHolder ?? "",
        priceRial: price ? Number(price) : null,
        pack: card.pack ?? "",
        productCode: latinDigits(card.productCode ?? "").replace(/\s/g, ""),
        genericCode: latinDigits(card.genericCode ?? "").replace(/\s/g, ""),
      });
      card = { title: [] };
      pending = [];
    }
  }
  return out;
}

export function groupByGeneric(drugs: IranDrug[]): IranGeneric[] {
  const groups = new Map<string, IranGeneric>();
  const seen = new Set<string>();
  for (const d of drugs) {
    // Pages can overlap (or repeat when the register ignores the page number): one row per product.
    const id = d.productCode || `${d.brandOwner}|${d.titleEn}|${d.pack}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const key = d.genericCode || d.titleEn || d.titleFa;
    const g = groups.get(key) ?? { genericCode: d.genericCode, titleFa: d.titleFa, titleEn: d.titleEn, products: [] };
    g.products.push(d);
    groups.set(key, g);
  }
  for (const g of groups.values()) g.products.sort((a, b) => (a.priceRial ?? Infinity) - (b.priceRial ?? Infinity));
  return [...groups.values()];
}

/** Fetches one register search page; throws when the register cannot be reached. */
export async function fetchIrcPage(term: string, page = 1): Promise<string> {
  const res = await ircGet(ircSearchUrl(term, page, PAGE_SIZE));
  if (res.status < 200 || res.status >= 300) throw new Error(`IRC ${res.status}`);
  return res.body;
}

export async function searchIranDrugs(raw: string): Promise<IranDrugResult> {
  const term = raw.trim().replace(/\s+/g, " ").slice(0, 60);
  const key = term.toLowerCase();
  const base = { term, generics: [], total: 0, fetchedAt: new Date().toISOString(), source: ircSearchUrl(term) };
  if (term.length < 3) return { ...base, status: "empty" };

  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < DAY) return hit.result;
  if (!allowRequest()) return hit?.result ?? { ...base, status: "unavailable" };

  let html: string;
  try {
    html = await fetchIrcPage(term);
  } catch {
    return hit?.result ?? { ...base, status: "unavailable" };
  }
  const drugs = parseIrc(html);
  // A full page means there may be more: read up to 4 further pages while the rate allows.
  for (let page = 2; drugs.length === (page - 1) * PAGE_SIZE && page <= 5 && allowRequest(); page++) {
    try {
      drugs.push(...parseIrc(await fetchIrcPage(term, page)));
    } catch {
      break;
    }
  }
  const looksLikeResults = /صاحب\s*برند|کد\s*ژنریک/.test(textLines(html).join(" "));
  const result: IranDrugResult = {
    ...base,
    status: drugs.length ? "ok" : looksLikeResults ? "unreadable" : "empty",
    generics: groupByGeneric(drugs),
    total: 0,
  };
  result.total = result.generics.reduce((n, g) => n + g.products.length, 0);
  if (result.status !== "unreadable") {
    if (cache.size > 1000) cache.delete(cache.keys().next().value!);
    cache.set(key, { at: Date.now(), result });
  }
  return result;
}
