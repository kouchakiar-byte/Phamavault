import { bi } from "@/i18n/bi";

/*
 * Community-pharmacy section: generic and brand products (FDA Orange Book) with
 * non-sterile compounding. Every table and rule names its source; reviewed
 * October 2026 (Mehr 1405).
 */

const ltr = (s: string) => `⁦${s}⁩`;

export type Ref = { label: string; url?: string };

/** The drug–drug interaction checker: a box on the pharmacy page and its own results page. */
export const interactionsCopy = {
  key: "interactions",
  title: bi("Drug interaction checker", "بررسی تداخلات دارویی"),
  lead: bi(
    "Type two or more medicines, or a question such as “warfarin with ibuprofen”, to see each interaction with its severity, effect, mechanism and what to do.",
    "دو یا چند دارو را وارد کنید، یا بپرسید «تداخل وارفارین با ایبوپروفن»، تا هر تداخل با شدت، اثر، سازوکار و اقدام لازم نمایش داده شود.",
  ),
  placeholder: bi("e.g. interaction of warfarin with ibuprofen", "مثلاً: تداخل وارفارین با ایبوپروفن"),
  label: bi("Medicines to check", "داروهای موردنظر"),
  check: bi("Check interactions", "بررسی تداخل"),
  add: bi("Add", "افزودن"),
  remove: bi("Remove", "حذف"),
  clear: bi("Clear all", "پاک کردن همه"),
  needTwo: bi("Add at least two medicines.", "دست‌کم دو دارو اضافه کنید."),
  unknown: bi("Not found in the database:", "در پایگاه داده پیدا نشد:"),
  maxDrugs: bi("Up to 10 medicines can be checked together.", "حداکثر 10 دارو را می‌توان همزمان بررسی کرد."),
  summary: bi("{n} interactions found among {p} pairs", "{n} تداخل در {p} جفت دارو یافت شد"),
  none: bi("No significant interaction identified", "تداخل مهمی شناسایی نشد"),
  clearPairs: bi("No significant interaction identified", "تداخل مهمی شناسایی نشد"),
  noneNote: bi(
    "Clinical monitoring appropriate to the patient's condition is recommended.",
    "پایش بالینی متناسب با شرایط بیمار توصیه می‌شود.",
  ),
  highest: bi("Highest severity", "بالاترین شدت"),
  effect: bi("Effect", "اثر بالینی"),
  mechanism: bi("Mechanism", "سازوکار"),
  management: bi("What to do", "اقدام لازم"),
  basis: bi("Based on", "بر اساس"),
  severity: {
    contraindicated: bi("Contraindicated", "منع مصرف همزمان"),
    major: bi("Major", "شدید"),
    moderate: bi("Moderate", "متوسط"),
    minor: bi("Minor", "خفیف"),
  },
  severityHint: {
    contraindicated: bi("Do not use together.", "همزمان مصرف نشوند."),
    major: bi("Avoid, or use only with close monitoring.", "پرهیز شود یا فقط با پایش دقیق."),
    moderate: bi("Use with caution and monitoring.", "با احتیاط و پایش."),
    minor: bi("Usually no action needed.", "معمولاً اقدامی لازم نیست."),
  },
  scaleTitle: bi("Severity scale", "مقیاس شدت تداخل"),
  scaleLead: bi(
    "The four levels are the ones Micromedex uses, and each matches a risk rating in Lexicomp (UpToDate):",
    "چهار سطح شدت همان سطوح Micromedex است و هر کدام با یک رتبه خطر در ⁦Lexicomp (UpToDate)⁩ هم‌ارز است:",
  ),
  scaleCols: { level: bi("Level here", "سطح در این ابزار"), micromedex: bi("Micromedex", "Micromedex"), lexicomp: bi("Lexicomp risk rating", "رتبه خطر Lexicomp") },
  lexicomp: {
    contraindicated: { letter: "X", text: bi("Avoid combination", "از مصرف همزمان پرهیز شود") },
    major: { letter: "D", text: bi("Consider therapy modification", "اصلاح درمان در نظر گرفته شود") },
    moderate: { letter: "C", text: bi("Monitor therapy", "درمان پایش شود") },
    minor: { letter: "B", text: bi("No action needed", "اقدامی لازم نیست") },
  },
  verify: bi("Check this pair in", "بررسی این جفت در"),
  studies: bi("Studies on PubMed", "مطالعات در PubMed"),
  checkersTitle: bi("Reference interaction checkers", "مراجع معتبر بررسی تداخل"),
  checkersLead: bi(
    "For a full assessment of a patient's regimen, check it in one of these references. They need a subscription; many universities and hospitals give their staff access.",
    "برای بررسی کامل رژیم دارویی یک بیمار، آن را در یکی از این مراجع هم بررسی کنید. این مراجع اشتراکی‌اند؛ بسیاری از دانشگاه‌ها و بیمارستان‌ها برای کادر خود دسترسی فراهم کرده‌اند.",
  ),
  checkers: [
    {
      name: "Micromedex Drug Interactions",
      by: "Merative",
      text: bi("Severity (contraindicated, major, moderate, minor) with the strength of documentation for each interaction.", "شدت (منع مصرف همزمان، شدید، متوسط، خفیف) همراه با میزان مستندات هر تداخل."),
      url: "https://www.micromedexsolutions.com/",
    },
    {
      name: "Lexicomp Drug Interactions",
      by: "Wolters Kluwer",
      text: bi("Risk ratings A to X with reliability rating and patient management for each pair.", "رتبه خطر A تا X، میزان اعتبار شواهد و راهکار مدیریت بیمار برای هر جفت دارو."),
      url: "https://www.uptodate.com/drug-interactions/",
    },
    {
      name: "UpToDate",
      by: "Wolters Kluwer",
      text: bi("Evidence-based clinical topics; its interaction checker is powered by Lexicomp.", "مباحث بالینی مبتنی بر شواهد؛ ابزار تداخل آن بر پایه Lexicomp است."),
      url: "https://www.uptodate.com/",
    },
  ],
  examples: bi("Try", "نمونه‌ها"),
  coverage: bi(
    "{d} medicines and {r} interaction rules between drugs and drug classes, compiled by the PharmaVault expert team.",
    "{d} دارو و {r} قاعده تداخل بین داروها و گروه‌های دارویی، گردآوری‌شده توسط تیم تخصصی فارماوالت.",
  ),
  disclaimer: bi(
    "For healthcare professionals. The checker identifies clinically important drug interactions from the official product information (FDA labels, EMA SmPCs) and Stockley's Drug Interactions, and gives the severity, mechanism and management for each. Severity follows the same levels as Micromedex and Lexicomp, and every result links to UpToDate and to the studies on PubMed. Micromedex, Lexicomp and UpToDate are subscription references; their text is not reproduced here. Use the checker alongside the product leaflet and your clinical judgement for each patient.",
    "ویژه کادر درمان. این ابزار تداخلات مهم دارویی را بر اساس اطلاعات رسمی فرآورده‌ها ⁦(FDA، EMA)⁩ و مرجع ⁦Stockley’s Drug Interactions⁩ شناسایی می‌کند و برای هر مورد، شدت، سازوکار و راهکار مدیریت را ارائه می‌دهد. سطوح شدت با Micromedex و Lexicomp هم‌راستاست و برای هر نتیجه، پیوند بررسی در UpToDate و مطالعات PubMed آمده است. Micromedex، Lexicomp و UpToDate مراجع اشتراکی‌اند و متن آن‌ها در این سایت بازنشر نمی‌شود. برای تصمیم درباره هر بیمار، این ابزار را در کنار بروشور دارو و قضاوت بالینی خود به کار ببرید.",
  ),
  refs: [
    { label: "Stockley's Drug Interactions (Pharmaceutical Press)" },
    { label: "Micromedex (Merative)", url: "https://www.micromedexsolutions.com/" },
    { label: "Lexicomp Drug Interactions (Wolters Kluwer)", url: "https://www.uptodate.com/drug-interactions/" },
    { label: "UpToDate", url: "https://www.uptodate.com/" },
    { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/" },
    { label: "FDA, Drug Development and Drug Interactions: Table of Substrates, Inhibitors and Inducers", url: "https://www.fda.gov/drugs/drug-interactions-labeling/healthcare-professionals-fdas-examples-drugs-interact-cyp-enzymes-and-transporter-systems" },
    { label: "CredibleMeds QTdrugs list", url: "https://crediblemeds.org/" },
    { label: "DailyMed (FDA labels)", url: "https://dailymed.nlm.nih.gov/dailymed/" },
    { label: "EMA product information (SmPC)", url: "https://www.ema.europa.eu/en/medicines" },
  ] as Ref[],
  open: bi("Open the full checker", "باز کردن صفحه کامل بررسی تداخل"),
};

export const pharmacyPage = {
  title: bi("Pharmacy", "داروخانه (Pharmacy)"),
  lead: bi(
    "Practical, referenced tools for the pharmacist: generic and brand products from the FDA Orange Book with the Iranian manufacturers, and non-sterile compounding with USP <795> beyond-use dating.",
    `ابزارهای کاربردی و مستند برای داروساز داروخانه: داروهای ژنریک و برند بر اساس Orange Book همراه با تولیدکنندگان داخلی، و ساخت فرآورده‌های غیراستریل در داروخانه با تعیین تاریخ مصرف پس از ساخت (BUD) طبق ${ltr("USP <795>")}.`,
  ),
  disclaimer: bi(
    "For professional use. Substituting one product for another follows the Iran FDA rules and the prescriber; always check the current product information (SmPC) of the product actually dispensed.",
    "ویژه استفاده حرفه‌ای. جایگزینی یک فرآورده با فرآورده دیگر تابع ضوابط سازمان غذا و دارو و نظر پزشک است؛ همیشه اطلاعات فرآورده (SmPC یا بروشور) همان فرآورده‌ای را که تحویل می‌دهید بررسی کنید.",
  ),
  reviewed: bi("Content reviewed {month}.", "آخرین بازبینی محتوا: {month}."),
  refsLabel: bi("References", "رفرنس‌ها"),
  toc: bi("In this section", "در این بخش"),
  quick: {
    title: bi("Quick access", "دسترسی سریع"),
    compounding: bi("Compounding: go straight to", "ساخت فرآورده؛ دسترسی مستقیم به"),
    facts: bi("Key numbers", "اعدادی که هر سازنده باید بداند"),
    bud: bi("Beyond-use date (BUD)", "تاریخ مصرف پس از ساخت (BUD)"),
    record: bi("Master formulation record", "سوابق فرمولاسیون اصلی"),
    excipients: bi("Excipients to watch in neonates and children", "مواد جانبی حساس در نوزادان و کودکان"),
    counsel: bi("Labelling and counselling checklist", "چک‌لیست برچسب و مشاوره"),
    formulas: bi("Validated formula sources", "منابع فرمول‌های معتبر"),
    calcs: bi("Related calculators", "ماشین‌حساب‌های مرتبط"),
  },
};

// ---------- 1. Generic and brand products (Orange Book) ----------

export const orangeBook = {
  key: "orange-book",
  title: bi("Generic and brand products: Orange Book and Iranian manufacturers", "داروهای ژنریک و برند: Orange Book و تولیدکنندگان داخلی"),
  lead: bi(
    "Search by active ingredient or brand name to see every FDA-approved product of that ingredient — the brand (reference listed drug) and its generics, with strength, dosage form, applicant and therapeutic-equivalence code — and the Iranian manufacturers of the same medicine.",
    "با جستجوی ماده مؤثره یا نام تجاری، همه فرآورده‌های تأییدشده FDA برای آن ماده را ببینید — برند (داروی مرجع، RLD) و ژنریک‌های آن با قدرت، شکل دارویی، شرکت صاحب مجوز و کد هم‌ارزی درمانی (TE) — و تولیدکنندگان داخلی همان دارو.",
  ),
  search: bi("Active ingredient or brand name (English)", "ماده مؤثره یا نام تجاری (انگلیسی)"),
  placeholder: bi("e.g. atorvastatin, Lipitor, metformin", "مثلاً atorvastatin، Lipitor، metformin"),
  discontinued: bi("Include discontinued products", "نمایش فرآورده‌های متوقف‌شده"),
  minChars: bi("Type at least 3 letters.", "دست‌کم 3 حرف وارد کنید."),
  loading: bi("Searching…", "در حال جستجو…"),
  none: bi("No product found. Try the generic (INN/USAN) name in English.", "فرآورده‌ای پیدا نشد. نام ژنریک انگلیسی (INN یا USAN) را امتحان کنید."),
  noData: bi(
    "The Orange Book data has not been loaded yet; it is downloaded from the FDA automatically every month.",
    "داده Orange Book هنوز بارگذاری نشده است؛ این داده هر ماه به‌صورت خودکار از FDA دریافت می‌شود.",
  ),
  updated: bi("Orange Book data from", "داده Orange Book به‌روز شده در"),
  more: bi("{n} more products — refine the search", "{n} فرآورده دیگر — جستجو را دقیق‌تر کنید"),
  ingredients: bi("{n} ingredients found; showing the first {m}", "{n} ماده مؤثره پیدا شد؛ {m} مورد اول نمایش داده می‌شود"),
  cols: {
    trade: bi("Trade name", "نام تجاری"),
    applicant: bi("Applicant", "شرکت صاحب مجوز"),
    strength: bi("Strength", "قدرت"),
    form: bi("Dosage form; route", "شکل دارویی؛ راه مصرف"),
    appl: bi("Application", "نوع مجوز"),
    te: bi("TE code", "کد TE"),
    status: bi("Status", "وضعیت"),
  },
  badges: {
    rld: bi("RLD", "RLD"),
    rs: bi("RS", "RS"),
    nda: bi("NDA (brand)", "NDA (برند)"),
    anda: bi("ANDA (generic)", "ANDA (ژنریک)"),
    rx: bi("Rx", "نسخه‌ای"),
    otc: bi("OTC", "بدون نسخه"),
    discn: bi("Discontinued", "متوقف‌شده"),
  },
  iranTitle: bi("Iranian manufacturers", "تولیدکنندگان داخلی"),
  iranLoading: bi("Looking up the Iran FDA register…", "در حال جستجو در سامانه سازمان غذا و دارو…"),
  iranNone: bi(
    "No Iranian licensed product with this exact active ingredient or combination was found. Search by INN in “Iranian licensed medicines” above.",
    "فرآورده داخلی دارای مجوز با همین ماده یا ترکیب مؤثره یافت نشد. با نام ژنریک بین‌المللی (INN) در بخش «داروهای دارای مجوز ایران» در بالای همین صفحه جستجو کنید.",
  ),
  iranFailed: bi("The Iran FDA register is not answering right now; try again in a few minutes.", "سامانه سازمان غذا و دارو در حال حاضر پاسخ نمی‌دهد؛ چند دقیقه دیگر دوباره امتحان کنید."),
  iranLocked: bi("Iranian manufacturers are part of the pharmacy plan.", "تولیدکنندگان داخلی بخشی از اشتراک داروخانه است."),
  iranCount: bi("{n} licensed products", "{n} فرآورده دارای مجوز"),
  iranCodes: bi("IRC {p} · generic code {g}", "کد \u2066IRC\u2069 {p} · کد ژنریک {g}"),
  iranSource: bi("Source: Iran FDA product register (irc.fda.gov.ir); approved prices per pack.", "منبع: سامانه فرآورده‌های دارای مجوز سازمان غذا و دارو (irc.fda.gov.ir)؛ قیمت مصوب هر بسته."),
  toman: bi("Toman", "تومان"),
  iranCols: {
    company: bi("Manufacturer (brand owner)", "تولیدکننده (صاحب برند)"),
    pack: bi("Pack", "بسته‌بندی"),
    price: bi("Price per pack", "قیمت هر بسته"),
  },
  note: bi(
    "TE codes beginning with A are therapeutically equivalent to the reference product (e.g. AB: bioequivalence demonstrated); codes beginning with B are not considered equivalent; a blank code means no multisource comparison (single source or OTC monograph). RLD = reference listed drug, the product generics are compared with; RS = reference standard for bioequivalence studies. Orange Book equivalence is a US regulatory status: substitution in Iran follows the Iran FDA list and the prescriber.",
    "کدهای TE که با A شروع می‌شوند از نظر درمانی با فرآورده مرجع هم‌ارزند (مثلاً AB: هم‌ارزی زیستی اثبات‌شده)؛ کدهای B هم‌ارز محسوب نمی‌شوند؛ کد خالی یعنی مقایسه چندمنبعی وجود ندارد (تک‌منبع یا OTC). RLD = داروی مرجع که ژنریک‌ها با آن مقایسه می‌شوند؛ RS = استاندارد مرجع برای مطالعه هم‌ارزی زیستی. هم‌ارزی Orange Book وضعیت قانونی آمریکاست: جایگزینی در ایران تابع فهرست سازمان غذا و دارو و نظر پزشک است.",
  ),
  refs: [
    { label: "FDA – Orange Book (Approved Drug Products with Therapeutic Equivalence Evaluations)", url: "https://www.fda.gov/drugs/drug-approvals-and-databases/approved-drug-products-therapeutic-equivalence-evaluations-orange-book" },
    { label: "FDA – Orange Book data files", url: "https://www.fda.gov/drugs/drug-approvals-and-databases/orange-book-data-files" },
  ] as Ref[],
  links: [
    { label: "Iran FDA", url: "https://www.fda.gov.ir/", note: bi("National drug list and licences", "فهرست رسمی داروهای کشور و پروانه‌ها") },
    { label: "Orange Book", url: "https://www.fda.gov/drugs/drug-approvals-and-databases/approved-drug-products-therapeutic-equivalence-evaluations-orange-book", note: bi("FDA search, patents and exclusivity", "جستجوی FDA، پتنت‌ها و انحصارها") },
    { label: "BNF", url: "https://bnf.nice.org.uk/", note: bi("British National Formulary", "فرمولاری ملی بریتانیا") },
    { label: "emc", url: "https://www.medicines.org.uk/emc", note: bi("SmPCs by brand or active ingredient", "SmPC بر اساس نام تجاری یا ماده مؤثره") },
    { label: "DailyMed", url: "https://dailymed.nlm.nih.gov/dailymed/", note: bi("US package inserts", "بروشورهای رسمی آمریکا") },
  ],
};

// ---------- 2. Compounding ----------

export const compounding = {
  key: "compounding",
  title: bi("Non-sterile compounding in the pharmacy", "ساخت فرآورده‌های غیراستریل در داروخانه (Compounding)"),
  lead: bi(
    "Compound only when no suitable licensed product is available, from a documented formula with published stability, and label every preparation with a beyond-use date.",
    "فقط وقتی فرآورده تجاری مناسب در دسترس نیست، از روی فرمول مستند با داده پایداری منتشرشده بسازید و برای هر فرآورده تاریخ مصرف پس از ساخت (BUD) روی برچسب بنویسید.",
  ),
  budTitle: bi("Beyond-use date calculator (USP <795>)", `محاسبه تاریخ مصرف پس از ساخت ${ltr("(USP <795>)")}`),
  budNote: bi(
    "USP <795> (revision official 1 November 2023), default BUDs when there is no USP–NF compounded preparation monograph and no formulation-specific stability study. A monograph's BUD takes precedence; with stability data the BUD may be extended but not beyond 180 days, and preserved aqueous preparations extended beyond the default need antimicrobial-effectiveness testing (USP <51>). The BUD may never exceed the earliest expiry date of any ingredient. Water activity (aw) ≥ 0.60 counts as aqueous.",
    `${ltr("USP <795>")} (ویرایش رسمی از 10 آبان 1402): BUD پیش‌فرض وقتی مونوگراف فرآورده ساختنی در USP–NF و مطالعه پایداری اختصاصی وجود ندارد. BUD مونوگراف مقدم است؛ با داده پایداری می‌توان BUD را افزایش داد ولی نه بیش از 180 روز، و برای فرآورده‌های آبی نگهدارنده‌دار با BUD بیشتر از پیش‌فرض، آزمون کارایی نگهدارنده ${ltr("(USP <51>)")} لازم است. BUD هرگز نباید از زودترین تاریخ انقضای اجزا بیشتر شود. فعالیت آبی ${ltr("aw ≥ 0.60")} آبی محسوب می‌شود.`,
  ),
  budTypes: [
    {
      value: "aq-np",
      days: 14,
      label: bi("Aqueous, without preservative (aw ≥ 0.60)", "آبی، بدون نگهدارنده (aw ≥ 0.60)"),
      storage: bi("Refrigerator (2–8 °C)", "یخچال (2 تا 8 درجه)"),
    },
    {
      value: "aq-p",
      days: 35,
      label: bi("Aqueous, preserved (aw ≥ 0.60)", "آبی، دارای نگهدارنده (aw ≥ 0.60)"),
      storage: bi("Controlled room temperature or refrigerator", "دمای کنترل‌شده اتاق یا یخچال"),
    },
    {
      value: "naq-oral",
      days: 90,
      label: bi("Non-aqueous oral liquid (aw < 0.60)", "مایع خوراکی غیرآبی (aw < 0.60)"),
      storage: bi("Controlled room temperature or refrigerator", "دمای کنترل‌شده اتاق یا یخچال"),
    },
    {
      value: "naq-other",
      days: 180,
      label: bi(
        "Other non-aqueous (capsules, tablets, powders, non-aqueous topicals, suppositories, troches; aw < 0.60)",
        "سایر غیرآبی‌ها (کپسول، قرص، پودر، فرآورده موضعی غیرآبی، شیاف، تروش؛ aw < 0.60)",
      ),
      storage: bi("Controlled room temperature or refrigerator", "دمای کنترل‌شده اتاق یا یخچال"),
    },
  ],
  bud: {
    type: bi("Type of preparation", "نوع فرآورده"),
    date: bi("Date compounded", "تاریخ ساخت"),
    expiry: bi("Earliest expiry date among the ingredients (optional)", "زودترین تاریخ انقضای اجزا (اختیاری)"),
    days: bi("Default BUD", "BUD پیش‌فرض"),
    result: bi("Beyond-use date", "تاریخ مصرف پس از ساخت"),
    storage: bi("Storage", "شرایط نگهداری"),
    limited: bi("Limited by the expiry of an ingredient", "محدودشده با تاریخ انقضای یکی از اجزا"),
    pick: bi("Choose the date compounded.", "تاریخ ساخت را انتخاب کنید."),
    daysUnit: bi("days", "روز"),
  },
  recordTitle: bi("Master formulation record — what it must contain", "سوابق فرمولاسیون اصلی (Master Formulation Record) — محتوای الزامی"),
  record: [
    bi("Name, strength or activity, and dosage form of the preparation", "نام، قدرت یا فعالیت و شکل دارویی فرآورده"),
    bi("Identity and amount of every ingredient, with their source or grade where relevant", "نام و مقدار هر جزء و در صورت لزوم منبع یا گرید آن"),
    bi("Container–closure system", "نوع ظرف و درب"),
    bi("Complete compounding instructions, including equipment and the order of mixing", "دستور کامل ساخت، شامل تجهیزات و ترتیب مخلوط کردن"),
    bi("Physical description of the finished preparation", "توصیف ظاهری فرآورده نهایی"),
    bi("Beyond-use date and storage requirements, with the source of the BUD", "BUD و شرایط نگهداری، همراه با منبع BUD"),
    bi("Labelling requirements and any quality-control checks", "الزامات برچسب‌گذاری و کنترل‌های کیفی"),
    bi("Reference for the formulation (published formula or stability study)", "رفرنس فرمولاسیون (فرمول منتشرشده یا مطالعه پایداری)"),
  ],
  recordNote: bi(
    "USP <795> also requires a compounding record for each batch: date, lot numbers and expiry of the ingredients, quantities weighed, the compounder and verifier, the assigned BUD and any deviations.",
    `${ltr("USP <795>")} برای هر بار ساخت هم سابقه ساخت (Compounding Record) می‌خواهد: تاریخ، شماره سری و انقضای اجزا، مقادیر توزین‌شده، سازنده و تأییدکننده، BUD تعیین‌شده و هر انحراف از دستور.`,
  ),
  formulasTitle: bi("Where to find validated formulas", "منابع فرمول‌های معتبر ساخت"),
  formulas: [
    {
      label: "USP Compounded Preparation Monographs",
      url: "https://www.uspnf.com/",
      note: bi("Official formulas with assigned BUDs, in USP–NF (subscription)", "فرمول‌های رسمی با BUD تعیین‌شده در USP–NF (با اشتراک)"),
    },
    {
      label: "SickKids – Compounding Service",
      url: "https://www.sickkids.ca/en/care-services/for-health-care-providers/compounding-service/",
      note: bi("Hospital for Sick Children, Toronto: paediatric oral suspensions (free)", "بیمارستان کودکان تورنتو: سوسپانسیون‌های خوراکی کودکان (رایگان)"),
    },
    {
      label: "Nationwide Children's – Compounding Formulas",
      url: "https://www.nationwidechildrens.org/specialties/pharmacy-services/compounding-formulas",
      note: bi("Nationwide Children's Hospital, Ohio: oral compounding formulas (free, informational)", "بیمارستان کودکان نیشن‌واید، اوهایو: فرمول‌های ساخت خوراکی (رایگان، جنبه اطلاع‌رسانی)"),
    },
  ],
  calcsTitle: bi("Related calculators", "ماشین‌حساب‌های مرتبط"),
  calcs: [
    { key: "dil", label: bi("Dilution and alligation", "رقیق‌سازی و آلیگیشن") },
    { key: "conc", label: bi("Concentration units", "تبدیل واحد غلظت") },
    { key: "pot", label: bi("Potency and salt factor", "پوتنسی و ضریب نمک") },
    { key: "bsa", label: bi("BSA and body weight", "سطح بدن و وزن بدن") },
  ],
  refs: [
    { label: "USP–NF 2026 <795> Pharmaceutical Compounding—Nonsterile Preparations", url: "https://www.uspnf.com/" },
    { label: "USP–NF 2026 <51> Antimicrobial Effectiveness Testing", url: "https://www.uspnf.com/" },
  ] as Ref[],
};

/** Practical guide to compounding: key numbers, technique cards and paediatric excipients. */
export const compoundingGuide = {
  factsTitle: bi("Numbers every compounder should know", "اعدادی که هر سازنده باید بداند"),
  facts: [
    { value: "180", unit: bi("days", "روز"), text: bi("Maximum BUD for a non-sterile preparation, even with stability data (USP <795>)", `سقف BUD فرآورده غیراستریل، حتی با داده پایداری ${ltr("(USP <795>)")}`) },
    { value: "120", unit: bi("mg", "میلی‌گرم"), text: bi("Smallest quantity on a Class A prescription balance (sensitivity 6 mg) for an error of 5% or less", "کمترین مقدار قابل توزین با ترازوی نسخه‌پیچی کلاس A (حساسیت 6 میلی‌گرم) برای خطای حداکثر 5%") },
    { value: "1:1", unit: bi("ratio", "نسبت"), text: bi("Ora-Plus : Ora-Sweet, the most studied vehicle for oral suspensions in children", "Ora-Plus به Ora-Sweet، پرمطالعه‌ترین حامل سوسپانسیون‌های خوراکی کودکان") },
    { value: "0.60", unit: bi("aw", "aw"), text: bi("Water activity at or above which a preparation counts as aqueous and gets a short BUD", "فعالیت آبی که از آن به بالا فرآورده آبی محسوب می‌شود و BUD کوتاهی برای آن تعیین می‌شود") },
  ],
  topicsTitle: bi("Compounding step by step", "ساخت فرآورده، گام به گام"),
  topics: [
    {
      key: "when",
      title: bi("When compounding is justified", "چه زمانی ساخت فرآورده توجیه دارد"),
      points: [
        bi("No licensed product in the strength or dosage form the patient needs, e.g. an oral liquid for an infant or a patient who cannot swallow.", "فرآورده دارای مجوز با قدرت یا شکل دارویی موردنیاز بیمار وجود ندارد؛ مثلاً شربت برای شیرخوار یا بیماری که نمی‌تواند قرص ببلعد."),
        bi("The patient is allergic or intolerant to an excipient of the commercial product (dye, lactose, gluten, preservative).", "بیمار به یکی از مواد جانبی فرآورده تجاری (رنگ، لاکتوز، گلوتن، نگهدارنده) حساسیت یا عدم تحمل دارد."),
        bi("The product is discontinued or in shortage.", "تولید فرآورده متوقف شده یا با کمبود مواجه است."),
        bi("Do not compound essential copies of a commercially available product.", "از ساخت نسخه مشابه فرآورده‌ای که در بازار موجود است خودداری شود."),
      ],
      refs: ["USP–NF 2026 <795>", "FDA, Human Drug Compounding (Section 503A)"],
    },
    {
      key: "technique",
      title: bi("Core techniques", "تکنیک‌های پایه"),
      points: [
        bi("Trituration: reduce particle size in a mortar before mixing; a finer powder disperses and dissolves better.", "تریتوراسیون (Trituration): پیش از مخلوط کردن، اندازه ذرات را در هاون کاهش دهید؛ پودر ریزتر بهتر پراکنده و حل می‌شود."),
        bi("Geometric dilution: mix a small amount of potent drug with an equal volume of diluent, then keep doubling, so the drug is spread evenly.", "رقیق‌سازی هندسی: مقدار کم داروی قوی را با هم‌حجم خود رقیق‌کننده مخلوط کنید و هر بار دو برابر کنید تا دارو به‌طور یکنواخت توزیع شود."),
        bi("Levigation: wet the powder into a smooth paste first — mineral oil for oily bases, glycerin or propylene glycol for water-miscible ones.", "لویگیشن (Levigation): ابتدا پودر را به خمیر یکنواخت تبدیل کنید؛ با روغن معدنی برای پایه‌های چرب و با گلیسرین یا پروپیلن گلیکول برای پایه‌های آب‌دوست."),
        bi("Add the vehicle in portions with constant mixing, and check the final weight or volume.", "حامل را به‌تدریج و با هم زدن مداوم اضافه کنید و وزن یا حجم نهایی را کنترل کنید."),
      ],
      refs: ["Remington, 23rd ed. (2020)", "Allen LV, The Art, Science, and Technology of Pharmaceutical Compounding (APhA)"],
    },
    {
      key: "oral",
      title: bi("Oral liquids for children", "مایعات خوراکی برای کودکان"),
      points: [
        bi("Most published paediatric suspensions are made from crushed tablets in Ora-Plus : Ora-Sweet (1:1) or 1% methylcellulose : simple syrup (1:1).", "بیشتر سوسپانسیون‌های منتشرشده کودکان از قرص خردشده در Ora-Plus و Ora-Sweet (1 به 1) یا متیل‌سلولز 1% و شربت ساده (1 به 1) ساخته می‌شوند."),
        bi("Use exactly the formula, container (usually amber plastic or glass) and storage of the published study; a different vehicle needs its own data.", "دقیقاً همان فرمول، ظرف (معمولاً پلاستیک یا شیشه کهربایی) و شرایط نگهداری مطالعه منتشرشده را به کار ببرید؛ حامل متفاوت به داده پایداری مختص خود نیاز دارد."),
        bi("Label “Shake well”, the BUD and the storage temperature, and use an oral syringe for measuring.", "روی برچسب «قبل از مصرف تکان دهید»، BUD و دمای نگهداری را بنویسید و برای اندازه‌گیری، سرنگ خوراکی تحویل دهید."),
        bi("Watch the excipients in the table below for neonates and young children.", "مواد جانبی جدول زیر را در نوزادان و کودکان خردسال در نظر داشته باشید."),
      ],
      refs: ["Nahata MC, Pai VB, Pediatric Drug Formulations (Harvey Whitney Books)", "Trissel's Stability of Compounded Formulations (APhA)"],
    },
    {
      key: "capsules",
      title: bi("Capsules", "کپسول"),
      points: [
        bi("Choose the size from the fill volume (weight ÷ tapped density) and make up the volume with a diluent such as microcrystalline cellulose or lactose.", "اندازه کپسول را بر اساس حجم پرکردن (وزن ÷ دانسیته ضربه‌ای) انتخاب کنید و حجم باقی‌مانده را با رقیق‌کننده‌ای مانند میکروکریستالین سلولز یا لاکتوز پر کنید."),
        bi("Blend by geometric dilution, fill by the punch method or a capsule-filling plate, and prepare one or two extra capsules for losses.", "با رقیق‌سازی هندسی مخلوط کنید، به روش پانچ یا با صفحه پرکن کپسول پر کنید و یک یا دو کپسول اضافی برای جبران اتلاف در نظر بگیرید."),
        bi("Check weight: weigh each capsule (or a sample) against the theoretical fill weight.", "کنترل وزن: هر کپسول (یا نمونه‌ای از آن‌ها) را با وزن تئوری مقایسه کنید."),
      ],
      refs: ["Remington, 23rd ed. (2020)", "USP–NF 2026 <795>"],
    },
    {
      key: "topical",
      title: bi("Creams and ointments", "کرم و پماد"),
      points: [
        bi("Pick the base by its class: hydrocarbon (white petrolatum, occlusive), absorption (lanolin, takes up water), water-removable (creams) or water-soluble (PEG).", "پایه را بر اساس نوع انتخاب کنید: هیدروکربنی (وازلین سفید، انسدادی)، جذبی (لانولین، جاذب آب)، قابل شست‌وشو با آب (کرم‌ها) یا محلول در آب (PEG)."),
        bi("Levigate powders before incorporation, or dissolve them in a little compatible liquid; an ointment mill gives a smooth, uniform product.", "پودرها را پیش از افزودن لویگیت کنید یا در کمی مایع سازگار حل کنید؛ آسیاب پماد (Ointment mill) محصول یکنواخت و نرم می‌دهد."),
        bi("Do not dilute a commercial cream with another base unless compatibility is known: emulsifiers, preservatives and pH may clash.", "کرم تجاری را با پایه دیگر رقیق نکنید مگر سازگاری آن‌ها شناخته شده باشد؛ امولسیفایر، نگهدارنده و pH ممکن است ناسازگار باشند."),
      ],
      refs: ["USP–NF 2026, Ointment bases (Pharmaceutical dosage forms <1151>)", "Allen LV, The Art, Science, and Technology of Pharmaceutical Compounding (APhA)"],
    },
    {
      key: "suppositories",
      title: bi("Suppositories", "شیاف"),
      points: [
        bi("Fatty bases (cocoa butter, hard fat) melt at body temperature; overheating cocoa butter forms unstable polymorphs that set poorly, so melt it gently below about 35 °C.", "پایه‌های چرب (کره کاکائو، چربی سخت) در دمای بدن ذوب می‌شوند؛ حرارت‌دادن بیش از حد کره کاکائو موجب تشکیل پلی‌مورف‌های ناپایداری می‌شود که به‌خوبی جامد نمی‌شوند؛ از این رو آن را به‌آرامی و در دمای کمتر از حدود 35 درجه ذوب کنید."),
        bi("PEG bases dissolve in body fluids, do not need refrigeration, but can irritate: moisten before insertion.", "پایه‌های PEG در مایعات بدن حل می‌شوند و به نگهداری در یخچال نیاز ندارند، ولی ممکن است تحریک‌کننده باشند؛ پیش از مصرف مرطوب شوند."),
        bi("Calibrate the mould with the base and correct for the drug's displacement factor.", "قالب را با پایه کالیبره کنید و ضریب جابه‌جایی دارو را اعمال کنید."),
      ],
      refs: ["Remington, 23rd ed. (2020)"],
    },
    {
      key: "weighing",
      title: bi("Weighing accuracy", "دقت توزین"),
      points: [
        bi("Know the balance's minimum weight: for a Class A prescription balance (sensitivity requirement 6 mg) weigh at least 120 mg for an error of 5% or less.", "حداقل وزن ترازو را بدانید: با ترازوی کلاس A (حساسیت 6 میلی‌گرم) برای خطای حداکثر 5% دست‌کم 120 میلی‌گرم توزین کنید."),
        bi("For smaller amounts make an aliquot: weigh a larger quantity, dilute it with an inert powder or liquid and take the fraction that contains the dose.", "برای مقادیر کمتر از روش آلیکوت استفاده کنید: مقدار بیشتری توزین، با پودر یا مایع بی‌اثر رقیق و کسری که دوز لازم را دارد برداشته شود."),
        bi("Check and calibrate electronic balances regularly with certified weights.", "ترازوهای الکترونیکی را به‌طور منظم با وزنه‌های استاندارد کنترل و کالیبره کنید."),
      ],
      refs: ["USP–NF 2026 <41> Balances", "USP–NF 2026 <1251> Weighing on an Analytical Balance"],
    },
    {
      key: "hazardous",
      title: bi("Hazardous drugs", "داروهای خطرناک (Hazardous drugs)"),
      points: [
        bi("Drugs on the NIOSH hazardous-drug list (e.g. methotrexate, tamoxifen, estradiol, testosterone, valganciclovir) need containment, protective equipment and dedicated tools.", "داروهای فهرست داروهای خطرناک NIOSH (مانند متوترکسات، تاموکسیفن، استرادیول، تستوسترون، والگان‌سیکلوویر) به محیط مهارشده (Containment)، تجهیزات حفاظت فردی و ابزار اختصاصی نیاز دارند."),
        bi("Crushing tablets or opening capsules of these drugs on an open bench exposes staff to dust.", "خرد کردن قرص یا باز کردن کپسول این داروها روی میز باز، کارکنان را در معرض گرد و غبار دارو قرار می‌دهد."),
        bi("Pregnant staff should not compound hazardous drugs without risk assessment.", "کارکنان باردار بدون ارزیابی ریسک داروهای خطرناک را نسازند."),
      ],
      refs: ["USP–NF 2026 <800> Hazardous Drugs—Handling in Healthcare Settings", "NIOSH List of Hazardous Drugs in Healthcare Settings (2024)"],
    },
  ],
  excipientsTitle: bi("Excipients to watch in neonates and young children", "مواد جانبی حساس در نوزادان و کودکان خردسال"),
  excipientCols: {
    name: bi("Excipient", "ماده جانبی"),
    risk: bi("Risk", "خطر"),
    advice: bi("Advice", "توصیه"),
  },
  excipients: [
    {
      name: bi("Benzyl alcohol", "بنزیل الکل"),
      risk: bi("“Gasping syndrome” (metabolic acidosis, respiratory distress) in neonates", "«سندرم گاسپینگ» (اسیدوز متابولیک، دیسترس تنفسی) در نوزادان"),
      advice: bi("Avoid in neonates; prefer preservative-free products", "در نوزادان مصرف نشود؛ فرآورده بدون نگهدارنده ترجیح دارد"),
    },
    {
      name: bi("Propylene glycol", "پروپیلن گلیکول"),
      risk: bi("CNS depression, hyperosmolality and lactic acidosis; neonates cannot clear it well", "تضعیف CNS، هیپراسمولالیتی و اسیدوز لاکتیک؛ نوزادان آن را به‌خوبی دفع نمی‌کنند"),
      advice: bi("EMA thresholds: 1 mg/kg/day in neonates, 50 mg/kg/day under 5 years", "آستانه‌های EMA: 1 میلی‌گرم/کیلوگرم/روز در نوزادان و 50 میلی‌گرم/کیلوگرم/روز زیر 5 سال"),
    },
    {
      name: bi("Ethanol", "اتانول"),
      risk: bi("CNS depression and hypoglycaemia in young children", "تضعیف CNS و هیپوگلیسمی در کودکان خردسال"),
      advice: bi("Keep to the minimum needed for solubility; prefer alcohol-free vehicles", "به حداقل لازم برای انحلال محدود شود؛ حامل بدون الکل ترجیح دارد"),
    },
    {
      name: bi("Sodium benzoate / benzoic acid", "سدیم بنزوات / بنزوئیک اسید"),
      risk: bi("May increase jaundice in newborns (bilirubin displacement)", "ممکن است زردی نوزاد را تشدید کند (جابه‌جایی بیلی‌روبین)"),
      advice: bi("Use with caution in neonates", "در نوزادان با احتیاط"),
    },
    {
      name: bi("Sorbitol, fructose, sucrose", "سوربیتول، فروکتوز، ساکارز"),
      risk: bi("Osmotic diarrhoea at high doses; dangerous in hereditary fructose intolerance; dental caries with long use", "اسهال اسموتیک در دوز بالا؛ خطرناک در عدم تحمل ارثی فروکتوز؛ پوسیدگی دندان در مصرف طولانی"),
      advice: bi("Ask about fructose intolerance; consider sugar-free vehicles for chronic use", "درباره عدم تحمل فروکتوز بپرسید؛ در مصرف مزمن حامل بدون قند در نظر گرفته شود"),
    },
    {
      name: bi("Aspartame", "آسپارتام"),
      risk: bi("Source of phenylalanine", "منبع فنیل‌آلانین"),
      advice: bi("Avoid in phenylketonuria", "در فنیل‌کتونوری مصرف نشود"),
    },
  ],
  excipientRefs: ["EMA, Excipients in the labelling and package leaflet of medicinal products for human use (EMA/CHMP/302620/2017, current revision)", "FDA, Benzyl alcohol toxicity in neonates (MMWR 1982;31:290–1)"],
  counselTitle: bi("Labelling and counselling checklist", "چک‌لیست برچسب و مشاوره"),
  counsel: [
    bi("Patient name, drug, strength, dose and directions", "نام بیمار، دارو، قدرت، دوز و دستور مصرف"),
    bi("Beyond-use date and storage temperature", "تاریخ مصرف پس از ساخت (BUD) و دمای نگهداری"),
    bi("“Shake well before use” for suspensions; “For external use only” for topicals", "«قبل از مصرف تکان دهید» برای سوسپانسیون و «فقط مصرف خارجی» برای فرآورده‌های موضعی"),
    bi("A statement that this is a compounded preparation", "ذکر اینکه فرآورده در داروخانه ساخته شده است"),
    bi("Oral syringe and a demonstration of how to measure the dose", "سرنگ خوراکی و آموزش اندازه‌گیری دوز"),
  ],
};

/** Live search of the Iran FDA product register, with the alternatives of each generic. */
export const iranDrugs = {
  key: "iran-drugs",
  title: bi("Iranian licensed medicines and generic substitution", "داروهای دارای مجوز ایران و جایگزینی ژنریک"),
  lead: bi(
    "Search by INN or brand name. Products are grouped by generic code — identical active pharmaceutical ingredient (API), dosage form and strength — so every licensed equivalent of a product appears together, ordered by approved price, with the brand owner, marketing authorisation holder and pack presentation: the basis for generic substitution when a brand is unavailable.",
    "با نام ژنریک \u2066(INN)\u2069 یا نام تجاری جستجو کنید. فرآورده‌ها بر اساس کد ژنریک، یعنی ماده مؤثره \u2066(API)\u2069، شکل دارویی \u2066(Dosage form)\u2069 و قدرت \u2066(Strength)\u2069 یکسان، گروه‌بندی و به ترتیب قیمت مصوب مرتب می‌شوند؛ همراه با صاحب برند، دارنده پروانه \u2066(MAH)\u2069 و نوع بسته‌بندی. به این ترتیب همه معادل‌های دارای مجوز یک فرآورده یکجا دیده می‌شوند و مبنای جایگزینی ژنریک \u2066(Generic substitution)\u2069 هنگام کمبود یک برند است.",
  ),
  placeholder: bi("e.g. Metformin, Amoxicillin, Atorvastatin", "مثلاً Metformin، Amoxicillin، Atorvastatin"),
  search: bi("Search", "جستجو"),
  loading: bi("Searching…", "در حال جستجو…"),
  hint: bi(
    "At least 3 characters. The INN in English (e.g. Metformin) returns the most complete results; then choose the single ingredient or the fixed-dose combination you need.",
    "دست‌کم 3 حرف. نام ژنریک بین‌المللی \u2066(INN)\u2069 به انگلیسی، مثلاً Metformin، کامل‌ترین نتیجه را می‌دهد؛ سپس تک‌جزئی یا ترکیب ثابت \u2066(FDC)\u2069 موردنظر را انتخاب کنید.",
  ),
  none: bi("No licensed product found for “{q}”.", "فرآورده دارای مجوزی برای «{q}» پیدا نشد."),
  unavailable: bi(
    "The Iran FDA register is not answering right now. Try again in a few minutes, or open the search on the register itself.",
    "سامانه سازمان غذا و دارو در حال حاضر پاسخ نمی‌دهد. چند دقیقه دیگر دوباره امتحان کنید، یا جستجو را در خود سامانه باز کنید.",
  ),
  unreadable: bi(
    "The register answered, but its page could not be read. Open the search on the register itself.",
    "سامانه پاسخ داد اما صفحه آن خوانده نشد. جستجو را در خود سامانه باز کنید.",
  ),
  locked: bi("This search is part of the pharmacy plan.", "این جستجو در اشتراک داروخانه در دسترس است."),
  generic: bi("Generic code {code}", "کد ژنریک {code}"),
  products: bi("{n} licensed products", "{n} فرآورده دارای مجوز"),
  cols: {
    brand: bi("Brand owner", "صاحب برند"),
    licence: bi("Marketing authorisation holder", "دارنده پروانه"),
    pack: bi("Pack presentation", "بسته‌بندی"),
    price: bi("Approved price per pack", "قیمت مصوب هر بسته"),
    code: bi("IRC", "کد \u2066IRC\u2069"),
    brandName: bi("Brand name", "نام تجاری"),
    genericCode: bi("Generic code", "کد ژنریک"),
  },
  genericOnly: bi("Sold under the generic name", "با نام ژنریک"),
  which: bi(
    "Select the medicine: each option is one active ingredient or one fixed-dose combination (FDC), with all its strengths.",
    "انتخاب دارو: هر گزینه یک ماده مؤثره تک‌جزئی یا یک ترکیب ثابت \u2066(FDC)\u2069 است، با همه قدرت‌های موجود.",
  ),
  optionCount: bi("{d} strengths · {n} products", "{d} قدرت · {n} فرآورده"),
  stored: bi(
    "The register is not answering right now; these are the results saved at its last update.",
    "سامانه سازمان غذا و دارو در این لحظه پاسخ نمی‌دهد؛ نتایج زیر از آخرین به‌روزرسانی ذخیره‌شده است.",
  ),
  updated: bi("Updated daily at 18:00 \u2066(Tehran)\u2069 · last update: {date}", "به‌روزرسانی روزانه ساعت 18 · آخرین به‌روزرسانی این نتیجه: {date}"),
  rial: bi("Rial", "ریال"),
  toman: bi("Toman", "تومان"),
  source: bi(
    "Source: Iran Food and Drug Administration — register of licensed finished products (irc.fda.gov.ir), updated daily at 18:00 (Tehran). Prices are the approved consumer prices recorded in the register. Substitution remains subject to the prescriber and current Iran FDA regulations.",
    "منبع: سازمان غذا و دارو، سامانه فرآورده‌های نهایی دارای مجوز \u2066(irc.fda.gov.ir)\u2069؛ به‌روزرسانی روزانه ساعت 18. قیمت‌ها قیمت مصوب مصرف‌کننده ثبت‌شده در سامانه است. جایگزینی دارو تابع نظر پزشک معالج و ضوابط جاری سازمان غذا و دارو است.",
  ),
};
