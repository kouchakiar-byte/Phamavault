import { bi, type Bi } from "@/i18n/bi";
import type { SearchScope } from "@/lib/site-search";

/**
 * Official databases that the site search hands the query to. Each URL was
 * checked to open the source's own result page for `{q}`; the two without a
 * query parameter (FDA IID, FDA guidance) open the search form itself.
 */
export type SearchSource = {
  key: string;
  name: string;
  org: Bi;
  what: Bi;
  url: string;
  /** False when the source has no query URL: the visitor types the name there. */
  takesQuery: boolean;
  scopes: Exclude<SearchScope, "all">[];
};

export const searchSources: SearchSource[] = [
  {
    key: "pubchem",
    name: "PubChem",
    org: bi("NIH · National Library of Medicine", "NIH · کتابخانه ملی پزشکی آمریکا"),
    what: bi("Structure, identifiers, properties and safety", "ساختار، شناسه‌ها، ویژگی‌ها و ایمنی"),
    url: "https://pubchem.ncbi.nlm.nih.gov/#query={q}",
    takesQuery: true,
    scopes: ["materials"],
  },
  {
    key: "cas",
    name: "CAS Common Chemistry",
    org: bi("American Chemical Society", "انجمن شیمی آمریکا (ACS)"),
    what: bi("CAS Registry Number and names", "شماره ثبت CAS و نام‌ها"),
    url: "https://commonchemistry.cas.org/results?q={q}",
    takesQuery: true,
    scopes: ["materials"],
  },
  {
    key: "gsrs",
    name: "FDA GSRS",
    org: bi("U.S. FDA · Global Substance Registration System", "FDA آمریکا · سامانه جهانی ثبت مواد"),
    what: bi("UNII codes and substance definitions, salts and grades", "کد UNII و تعریف ماده، نمک‌ها و گریدها"),
    url: "https://gsrs.ncats.nih.gov/ginas/app/beta/browse-substance?search={q}",
    takesQuery: true,
    scopes: ["materials"],
  },
  {
    key: "nist",
    name: "NIST Chemistry WebBook",
    org: bi("U.S. National Institute of Standards and Technology", "مؤسسه ملی استاندارد و فناوری آمریکا (NIST)"),
    what: bi("Thermochemical and spectral data", "داده‌های ترموشیمیایی و طیفی"),
    url: "https://webbook.nist.gov/cgi/cbook.cgi?Name={q}&Units=SI",
    takesQuery: true,
    scopes: ["materials"],
  },
  {
    key: "iid",
    name: "FDA Inactive Ingredient Database",
    org: bi("U.S. FDA", "FDA آمریکا"),
    what: bi("Maximum excipient amounts in approved products, by route and dosage form", "حداکثر مقدار ماده جانبی در فرآورده‌های تأییدشده، بر اساس راه مصرف و شکل دارویی"),
    url: "https://www.accessdata.fda.gov/scripts/cder/iig/index.cfm",
    takesQuery: false,
    scopes: ["materials"],
  },
  {
    key: "dailymed",
    name: "DailyMed",
    org: bi("NIH · National Library of Medicine", "NIH · کتابخانه ملی پزشکی آمریکا"),
    what: bi("U.S. product labels, with full inactive-ingredient lists", "بروشور رسمی فرآورده‌های آمریکا با فهرست کامل مواد جانبی"),
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query={q}",
    takesQuery: true,
    scopes: ["materials", "standards"],
  },
  {
    key: "ema",
    name: "EMA medicines",
    org: bi("European Medicines Agency", "آژانس دارویی اروپا (EMA)"),
    what: bi("EU product information and assessment reports (EPAR)", "اطلاعات فرآورده و گزارش‌های ارزیابی اتحادیه اروپا (EPAR)"),
    url: "https://www.ema.europa.eu/en/medicines?search_api_fulltext={q}",
    takesQuery: true,
    scopes: ["standards"],
  },
  {
    key: "emc",
    name: "eMC (SmPC)",
    org: bi("UK electronic Medicines Compendium", "مرجع الکترونیک داروهای بریتانیا"),
    what: bi("SmPCs and patient leaflets of UK products", "SmPC و بروشور بیمار فرآورده‌های بریتانیا"),
    url: "https://www.medicines.org.uk/emc/search?q={q}",
    takesQuery: true,
    scopes: ["standards"],
  },
  {
    key: "fdaGuidance",
    name: "FDA guidance documents",
    org: bi("U.S. FDA", "FDA آمریکا"),
    what: bi("Current FDA guidances for industry", "راهنماهای جاری FDA برای صنعت"),
    url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents",
    takesQuery: false,
    scopes: ["standards"],
  },
  {
    key: "who",
    name: "WHO publications",
    org: bi("World Health Organization", "سازمان جهانی بهداشت"),
    what: bi("WHO technical reports, guidelines and the International Pharmacopoeia notices", "گزارش‌های فنی، راهنماها و اطلاعیه‌های فارماکوپه بین‌المللی WHO"),
    url: "https://www.who.int/publications/i?healthtopics-hidden=true&publishingoffices-hidden=true&query={q}",
    takesQuery: true,
    scopes: ["standards"],
  },
  {
    key: "pubmed",
    name: "PubMed",
    org: bi("NIH · National Library of Medicine", "NIH · کتابخانه ملی پزشکی آمریکا"),
    what: bi("Peer-reviewed biomedical and pharmaceutical literature", "مقالات داوری‌شده علوم دارویی و پزشکی"),
    url: "https://pubmed.ncbi.nlm.nih.gov/?term={q}",
    takesQuery: true,
    scopes: ["materials", "standards", "tools"],
  },
  {
    key: "pmc",
    name: "PubMed Central",
    org: bi("NIH · National Library of Medicine", "NIH · کتابخانه ملی پزشکی آمریکا"),
    what: bi("Free full-text articles: methods, formulations and validation", "متن کامل رایگان مقالات: روش‌ها، فرمولاسیون و اعتبارسنجی"),
    url: "https://pmc.ncbi.nlm.nih.gov/search/?term={q}",
    takesQuery: true,
    scopes: ["tools"],
  },
];

/** Sources for a scope, each with the link for the query. */
export function sourcesFor(scope: SearchScope, query: string) {
  return searchSources
    .filter((s) => scope === "all" || s.scopes.includes(scope))
    .map((s) => ({ ...s, href: s.url.replace("{q}", encodeURIComponent(query)) }));
}
