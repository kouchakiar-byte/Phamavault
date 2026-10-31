import { pages } from "@/content/pages";
import { getCatalog, type Catalog } from "./catalog";
import { norm, prepare, search, type Filters, type MatchKind, type SortKey, type Supplier } from "./supplier-search";

/** Results per request: the bank is read a page at a time, never shipped whole to the browser. */
export const SUPPLIER_PAGE = 20;

/** One company as the browser receives it. Phone, email and address only reach signed-in readers. */
export type SupplierView = {
  n: string;
  e: string;
  t: "m" | "t";
  c: string[];
  prov: string;
  city: string;
  site?: string;
  note?: string;
  partial?: number;
  web?: string;
  webDown?: boolean;
  src: string;
  via?: number;
  /** How many phone numbers are on record, also when they are hidden. */
  telCount: number;
  tel: string[];
  mail?: string;
  addr?: string;
  hasMail: boolean;
  products: { fa: string; en: string; hit: boolean }[];
  match?: MatchKind;
};

export type SupplierPage = {
  results: SupplierView[];
  total: number;
  withTel: number;
  totalProducts: number;
  page: number;
  pages: number;
  /** False when contact details were left out because the reader is not signed in. */
  contacts: boolean;
};

const categoryLabels = Object.fromEntries(Object.entries(pages.suppliers.categories).map(([key, label]) => [key, [norm(label.fa), norm(label.en)]]));
const SORTS: SortKey[] = ["cred", "rel", "site", "type", "name"];

/** The search's preparation is kept per catalog version, since the catalog itself is cached for minutes. */
const prepared = new WeakMap<Catalog, { suppliers: Supplier[]; synonyms: string[][]; totalProducts: number }>();
function prepare_(catalog: Catalog) {
  let p = prepared.get(catalog);
  if (!p) {
    const suppliers = prepare(catalog.companies);
    p = { suppliers, synonyms: catalog.synonyms.map((g) => g.map(norm)), totalProducts: suppliers.reduce((n, s) => n + s.products.length, 0) };
    prepared.set(catalog, p);
  }
  return p;
}

/** Filters from a query string (?q=&type=&cat=&sort=&tel=1), with anything unknown set back to its default. */
export function filtersFrom(params: URLSearchParams): Filters {
  const type = params.get("type");
  const cat = params.get("cat") ?? "all";
  const sort = params.get("sort") as SortKey;
  return {
    query: (params.get("q") ?? "").slice(0, 100),
    type: type === "m" || type === "t" ? type : "all",
    cat: cat in pages.suppliers.categories ? cat : "all",
    sort: SORTS.includes(sort) ? sort : "cred",
    telOnly: params.get("tel") === "1",
  };
}

export async function querySuppliers(filters: Filters, page: number, contacts: boolean): Promise<SupplierPage> {
  const catalog = await getCatalog();
  const { suppliers, synonyms, totalProducts } = prepare_(catalog);
  const rows = search(suppliers, filters, synonyms, catalog.provinceOrder, categoryLabels);
  const pages = Math.max(1, Math.ceil(rows.length / SUPPLIER_PAGE));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  const results = rows.slice((current - 1) * SUPPLIER_PAGE, current * SUPPLIER_PAGE).map(({ s, hits, match }): SupplierView => ({
    n: s.n,
    e: s.e,
    t: s.t,
    c: s.c,
    prov: s.prov,
    city: s.city,
    site: s.site,
    note: s.note,
    partial: s.partial,
    web: s.web,
    webDown: s.webDown,
    src: s.src,
    via: s.via,
    telCount: s.tel.length,
    tel: contacts ? s.tel : [],
    mail: contacts ? s.mail : undefined,
    addr: contacts ? s.addr : undefined,
    hasMail: Boolean(s.mail),
    products: s.products.map((p) => ({ fa: p.fa, en: p.en, hit: hits.includes(p) })),
    match,
  }));
  return {
    results,
    total: rows.length,
    withTel: rows.filter((r) => r.s.tel.length).length,
    totalProducts,
    page: current,
    pages,
    contacts,
  };
}
