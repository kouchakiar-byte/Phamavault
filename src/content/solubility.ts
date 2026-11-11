import { bi } from "@/i18n/bi";

/** The solubility finder in the API and raw material database section. */
export const solubilityCopy = {
  title: bi("Solubility of APIs and excipients", "حلالیت مواد مؤثره و Excipientها (Solubility)"),
  lead: bi(
    "Search an active ingredient or excipient by name or CAS number and see its solubility in water and other solvents, word for word from the Hazardous Substances Data Bank (US National Library of Medicine), NIOSH and the International Chemical Safety Cards, or from the PharmaVault excipient monographs, with the source of every statement. A water value in mg/mL is placed in the pharmacopoeial descriptive term (Freely soluble, Sparingly soluble …).",
    "ماده مؤثره یا Excipient را با نام یا شماره CAS جست‌وجو کنید و حلالیت آن را در آب و سایر حلال‌ها ببینید؛ عین عبارت منبع از Hazardous Substances Data Bank (کتابخانه ملی پزشکی آمریکا)، NIOSH و International Chemical Safety Cards، یا از مونوگراف‌های Excipient فارماوالت، همراه با منبع هر عبارت. مقدار عددی حلالیت در آب (mg/mL) به عبارت توصیفی فارماکوپه (مانند Freely soluble و Sparingly soluble) تبدیل می‌شود.",
  ),
  back: bi("API and raw material database", "پایگاه داده مواد مؤثره و مواد اولیه"),
  /** Badge on an API database row that has solubility statements. */
  badge: bi("Solubility", "حلالیت"),
  search: bi("Name, Persian name or CAS number", "نام انگلیسی، نام فارسی یا شماره CAS"),
  searchHint: bi(
    "For example: Paracetamol, ایبوپروفن or 50-78-2",
    "برای مثال: Paracetamol، ایبوپروفن یا 50-78-2",
  ),
  results: bi("{n} materials", "{n} ماده"),
  noMatch: bi("No material in the databases matches this search.", "هیچ ماده‌ای در پایگاه‌های داده با این جست‌وجو مطابقت ندارد."),
  api: bi("API", "ماده مؤثره"),
  excipient: bi("Excipient", "Excipient"),
  noData: bi(
    "No solubility statement from the sources used here (HSDB, NIOSH, ICSC) is available for this material. Use the supplier's CoA or the monograph of your pharmacopoeia.",
    "برای این ماده عبارتی درباره حلالیت در منابع مورد استفاده (HSDB، NIOSH، ICSC) موجود نیست. از CoA تأمین‌کننده یا مونوگراف فارماکوپه خود استفاده کنید.",
  ),
  water: bi("Solubility in water", "حلالیت در آب"),
  term: bi("Pharmacopoeial term", "عبارت توصیفی فارماکوپه"),
  at: bi("at {t} °C", "در {t} °C"),
  noTemp: bi("temperature not stated", "دما ذکر نشده"),
  estimated: bi("estimated, not measured", "تخمینی، اندازه‌گیری نشده"),
  statements: bi("Statements from the sources", "عبارت‌های منبع"),
  statementsNote: bi(
    "Quoted as published (English). Statements about another salt, ester or hydrate of the substance are left out.",
    "عین متن منبع (انگلیسی). عبارت‌های مربوط به نمک، استر یا هیدرات دیگری از همین ماده حذف شده‌اند.",
  ),
  monograph: bi("From the PharmaVault excipient monograph", "از مونوگراف Excipient فارماوالت"),
  openMonograph: bi("Open the excipient monograph", "مشاهده مونوگراف کامل Excipient"),
  pubchem: bi("PubChem record", "رکورد PubChem"),
  bcs: bi("BCS class {c}", "BCS کلاس {c}"),
  sources: bi("Sources", "منابع"),
  sourceList: {
    HSDB: "Hazardous Substances Data Bank (HSDB), U.S. National Library of Medicine, via PubChem.",
    NIOSH: "NIOSH Pocket Guide to Chemical Hazards, U.S. National Institute for Occupational Safety and Health, via PubChem.",
    ICSC: "ILO-WHO International Chemical Safety Cards (ICSC), CC BY 4.0, via PubChem.",
  } as Record<string, string>,
  accessed: bi("Retrieved from PubChem on {d}.", "دریافت از PubChem در تاریخ {d}."),
  termsTitle: bi("Pharmacopoeial descriptive terms of solubility", "عبارت‌های توصیفی حلالیت در فارماکوپه"),
  termsNote: bi(
    "Parts of solvent needed to dissolve 1 part of solute, as defined in the General Notices of USP and Ph. Eur. (15–25 °C). The mg/mL column is the approximate equivalent for water, taking 1 mL of water as 1 g.",
    "مقدار حلال لازم (بر حسب Part) برای حل کردن 1 Part از ماده، طبق General Notices در USP و Ph. Eur. (دمای 15 تا 25 °C). ستون mg/mL معادل تقریبی برای آب است، با فرض اینکه 1 mL آب برابر 1 g است.",
  ),
  colTerm: bi("Descriptive term", "عبارت توصیفی"),
  colParts: bi("Parts of solvent per 1 part of solute", "Part حلال برای 1 Part ماده"),
  colMg: bi("Approx. mg/mL", "تقریباً mg/mL"),
  converter: bi("mg/mL to pharmacopoeial term", "تبدیل mg/mL به عبارت فارماکوپه"),
  converterLabel: bi("Solubility (mg/mL)", "حلالیت (mg/mL)"),
  converterResult: bi("≈ {p} parts of solvent per part of solute", "≈ {p} Part حلال برای هر Part ماده"),
};

/** USP / Ph. Eur. descriptive terms, by parts of solvent per part of solute (upper bound exclusive). */
export const solubilityTerms = [
  { en: "Very soluble", fa: "بسیار محلول", parts: "< 1", mg: "> 1000", max: 1 },
  { en: "Freely soluble", fa: "به‌آسانی محلول", parts: "1 – 10", mg: "100 – 1000", max: 10 },
  { en: "Soluble", fa: "محلول", parts: "10 – 30", mg: "33 – 100", max: 30 },
  { en: "Sparingly soluble", fa: "نسبتاً محلول", parts: "30 – 100", mg: "10 – 33", max: 100 },
  { en: "Slightly soluble", fa: "کم‌محلول", parts: "100 – 1000", mg: "1 – 10", max: 1000 },
  { en: "Very slightly soluble", fa: "بسیار کم‌محلول", parts: "1000 – 10 000", mg: "0.1 – 1", max: 10000 },
  { en: "Practically insoluble", fa: "عملاً نامحلول", parts: "≥ 10 000", mg: "< 0.1", max: Infinity },
];

/** The descriptive term for a water solubility in mg/mL (1 mL of water taken as 1 g). */
export function termFor(mgPerMl: number) {
  const parts = 1000 / mgPerMl;
  return { parts, term: solubilityTerms.find((t) => parts < t.max) ?? solubilityTerms[solubilityTerms.length - 1] };
}
