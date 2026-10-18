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
  maxDrugs: bi("Up to 10 medicines can be checked together.", "حداکثر ۱۰ دارو را می‌توان همزمان بررسی کرد."),
  summary: bi("{n} interactions found among {p} pairs", "{n} تداخل در {p} جفت دارو یافت شد"),
  none: bi("No interaction recorded for these medicines", "برای این داروها تداخل ثبت‌شده‌ای یافت نشد"),
  clearPairs: bi("No interaction recorded", "تداخل ثبت‌شده‌ای ندارد"),
  noneNote: bi(
    "This means no interaction is recorded in the PharmaVault database, not that none exists. Check the product information of both medicines.",
    "یعنی در پایگاه داده فارماوالت تداخلی ثبت نشده است، نه اینکه قطعاً تداخلی وجود ندارد. اطلاعات فرآورده هر دو دارو را بررسی کنید.",
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
  examples: bi("Try", "نمونه‌ها"),
  coverage: bi(
    "{d} medicines and {r} interaction rules between drugs and drug classes, compiled by the PharmaVault expert team.",
    "{d} دارو و {r} قاعده تداخل بین داروها و گروه‌های دارویی، گردآوری‌شده توسط تیم تخصصی فارماوالت.",
  ),
  disclaimer: bi(
    "For healthcare professionals. The checker covers clinically important interactions but cannot list every interaction; always confirm with the product information (SmPC or label) and clinical judgement.",
    "ویژه کادر درمان. این ابزار تداخلات مهم بالینی را پوشش می‌دهد اما نمی‌تواند همه تداخلات را فهرست کند؛ همیشه با اطلاعات فرآورده (SmPC یا بروشور) و قضاوت بالینی تأیید کنید.",
  ),
  refs: [
    { label: "Stockley's Drug Interactions (Pharmaceutical Press)" },
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
  reviewed: bi("Content reviewed October 2026.", "آخرین بازبینی محتوا: مهر ۱۴۰۵."),
  refsLabel: bi("References", "رفرنس‌ها"),
  toc: bi("In this section", "در این بخش"),
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
  minChars: bi("Type at least 3 letters.", "دست‌کم ۳ حرف وارد کنید."),
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
  iranFailed: bi("The Iran FDA register is not answering right now; try again in a few minutes.", "سامانه سازمان غذا و دارو الان پاسخ نمی‌دهد؛ چند دقیقه دیگر دوباره امتحان کنید."),
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
    `${ltr("USP <795>")} (ویرایش رسمی از ۱۰ آبان ۱۴۰۲): BUD پیش‌فرض وقتی مونوگراف فرآورده ساختنی در USP–NF و مطالعه پایداری اختصاصی وجود ندارد. BUD مونوگراف مقدم است؛ با داده پایداری می‌توان BUD را افزایش داد ولی نه بیش از ۱۸۰ روز، و برای فرآورده‌های آبی نگهدارنده‌دار با BUD بیشتر از پیش‌فرض، آزمون کارایی نگهدارنده ${ltr("(USP <51>)")} لازم است. BUD هرگز نباید از زودترین تاریخ انقضای اجزا بیشتر شود. فعالیت آبی ${ltr("aw ≥ 0.60")} آبی محسوب می‌شود.`,
  ),
  budTypes: [
    {
      value: "aq-np",
      days: 14,
      label: bi("Aqueous, without preservative (aw ≥ 0.60)", "آبی، بدون نگهدارنده (aw ≥ 0.60)"),
      storage: bi("Refrigerator (2–8 °C)", "یخچال (۲ تا ۸ درجه)"),
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
  recordTitle: bi("Master formulation record — what it must contain", "سوابق فرمولاسیون اصلی (Master Formulation Record) — چه باید داشته باشد"),
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
    "دست‌کم ۳ حرف. نام ژنریک بین‌المللی \u2066(INN)\u2069 به انگلیسی، مثلاً Metformin، کامل‌ترین نتیجه را می‌دهد؛ سپس تک‌جزئی یا ترکیب ثابت \u2066(FDC)\u2069 موردنظر را انتخاب کنید.",
  ),
  none: bi("No licensed product found for “{q}”.", "فرآورده دارای مجوزی برای «{q}» پیدا نشد."),
  unavailable: bi(
    "The Iran FDA register is not answering right now. Try again in a few minutes, or open the search on the register itself.",
    "سامانه سازمان غذا و دارو الان پاسخ نمی‌دهد. چند دقیقه دیگر دوباره امتحان کنید، یا جستجو را در خود سامانه باز کنید.",
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
  updated: bi("Updated daily at 18:00 \u2066(Tehran)\u2069 · last update: {date}", "به‌روزرسانی روزانه ساعت ۱۸ · آخرین به‌روزرسانی این نتیجه: {date}"),
  rial: bi("Rial", "ریال"),
  toman: bi("Toman", "تومان"),
  source: bi(
    "Source: Iran Food and Drug Administration — register of licensed finished products (irc.fda.gov.ir), updated daily at 18:00 (Tehran). Prices are the approved consumer prices recorded in the register. Substitution remains subject to the prescriber and current Iran FDA regulations.",
    "منبع: سازمان غذا و دارو، سامانه فرآورده‌های نهایی دارای مجوز \u2066(irc.fda.gov.ir)\u2069؛ به‌روزرسانی روزانه ساعت ۱۸. قیمت‌ها قیمت مصوب مصرف‌کننده ثبت‌شده در سامانه است. جایگزینی دارو تابع نظر پزشک معالج و ضوابط جاری سازمان غذا و دارو است.",
  ),
};
