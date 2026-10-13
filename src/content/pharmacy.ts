import { bi, type Bi } from "@/i18n/bi";

/*
 * Community-pharmacy section: therapeutic substitution during shortages and
 * non-sterile compounding. Every table and rule names its source; reviewed
 * October 2026 (Mehr 1405).
 */

const ltr = (s: string) => `⁦${s}⁩`;

/** "20 mg once daily" / "40 mg twice daily" in both languages. */
const od = (dose: string) => bi(`${dose} once daily`, `${ltr(dose)} یک بار در روز`);
const bd = (dose: string) => bi(`${dose} twice daily`, `${ltr(dose)} دو بار در روز`);

export type Ref = { label: string; url?: string };
export type DoseTable = {
  key: string;
  title: Bi;
  intro: Bi;
  columns: Bi[];
  /** First cell is the drug name (Latin); the rest are doses or labels. */
  rows: (string | Bi)[][];
  note: Bi;
  refs: Ref[];
};

export const pharmacyPage = {
  title: bi("Community pharmacy", "داروخانه (Community Pharmacy)"),
  lead: bi(
    "Practical, referenced tools for the community pharmacist: therapeutic substitution when a medicine is in short supply, and non-sterile compounding with USP <795> beyond-use dating.",
    `ابزارهای کاربردی و مستند برای داروساز داروخانه: جایگزینی درمانی در زمان کمبود دارو، و ساخت فرآورده‌های غیراستریل در داروخانه با تعیین تاریخ مصرف پس از ساخت (BUD) طبق ${ltr("USP <795>")}.`,
  ),
  disclaimer: bi(
    "For professional use. Substituting one medicine for another needs the prescriber's agreement; the final decision on dose and therapy rests with the pharmacist and the prescriber. Always check the current product information (SmPC) of the product actually dispensed.",
    "ویژه استفاده حرفه‌ای. جایگزینی یک دارو با داروی دیگر نیازمند موافقت پزشک تجویزکننده است و تصمیم نهایی درباره دوز و درمان با داروساز و پزشک است. همیشه اطلاعات فرآورده (SmPC یا بروشور) همان فرآورده‌ای را که تحویل می‌دهید بررسی کنید.",
  ),
  reviewed: bi("Content reviewed October 2026.", "آخرین بازبینی محتوا: مهر ۱۴۰۵."),
  refsLabel: bi("References", "رفرنس‌ها"),
  toc: bi("In this section", "در این بخش"),
};

// ---------- 1. Therapeutic substitution ----------

export const substitution = {
  key: "substitution",
  title: bi("Therapeutic substitution during shortages", "جایگزینی درمانی در زمان کمبود دارو"),
  lead: bi(
    "When a medicine is unavailable, work from the safest option to the least safe, and document every change.",
    "وقتی دارویی در دسترس نیست، از امن‌ترین گزینه به سمت گزینه‌های بعدی بروید و هر تغییر را ثبت کنید.",
  ),
  steps: [
    bi(
      "Same active ingredient, same strength and dosage form from another manufacturer (generic substitution) — check the national drug list of the Iran FDA.",
      "همان ماده مؤثره، با همان قدرت و شکل دارویی از تولیدکننده دیگر (جایگزینی ژنریک) — فهرست رسمی داروهای کشور در سازمان غذا و دارو را بررسی کنید.",
    ),
    bi(
      "Same active ingredient in another salt or strength — convert by the amount of active moiety (salt factor) and adjust the number of units.",
      "همان ماده مؤثره با نمک یا قدرت دیگر — بر اساس مقدار بخش فعال (ضریب نمک) تبدیل و تعداد واحدها را تنظیم کنید.",
    ),
    bi(
      "Same active ingredient in another dosage form (e.g. tablet → oral liquid) — check bioequivalence, excipients (sugar, alcohol) and the dosing device; compound only when no licensed product exists.",
      "همان ماده مؤثره در شکل دارویی دیگر (مثلاً قرص به مایع خوراکی) — هم‌ارزی زیستی، مواد جانبی (قند، الکل) و وسیله دوزدهی را بررسی کنید؛ ساخت در داروخانه فقط وقتی که فرآورده تجاری وجود ندارد.",
    ),
    bi(
      "Another medicine of the same class (therapeutic substitution) — only with the prescriber's agreement, using the equivalence tables below as a starting point and considering indication, renal and hepatic function, interactions and comorbidities.",
      "داروی دیگری از همان رده (جایگزینی درمانی) — فقط با موافقت پزشک، با استفاده از جدول‌های معادل زیر به‌عنوان نقطه شروع و با در نظر گرفتن اندیکاسیون، عملکرد کلیه و کبد، تداخلات و بیماری‌های همراه.",
    ),
    bi(
      "Counsel the patient on the change (appearance, dose, timing) and monitor the response.",
      "درباره تغییر (ظاهر دارو، دوز و زمان مصرف) به بیمار مشاوره دهید و پاسخ درمانی را پیگیری کنید.",
    ),
  ],
  links: [
    { label: "Iran FDA", url: "https://www.fda.gov.ir/", note: bi("National drug list and licences", "فهرست رسمی داروهای کشور و پروانه‌ها") },
    { label: "BNF", url: "https://bnf.nice.org.uk/", note: bi("British National Formulary (free in the UK)", "فرمولاری ملی بریتانیا") },
    { label: "emc", url: "https://www.medicines.org.uk/emc", note: bi("SmPCs by brand or active ingredient", "SmPC بر اساس نام تجاری یا ماده مؤثره") },
    { label: "DailyMed", url: "https://dailymed.nlm.nih.gov/dailymed/", note: bi("US package inserts", "بروشورهای رسمی آمریکا") },
  ],
};

export const doseTables: DoseTable[] = [
  {
    key: "corticosteroids",
    title: bi("Systemic corticosteroids: equivalent anti-inflammatory doses", "کورتیکواستروئیدهای سیستمیک: دوزهای معادل ضدالتهابی"),
    intro: bi("Oral or intravenous doses with approximately the same glucocorticoid (anti-inflammatory) effect.", "دوزهای خوراکی یا وریدی با اثر گلوکوکورتیکوئیدی (ضدالتهابی) تقریباً برابر."),
    columns: [bi("Medicine", "دارو"), bi("Equivalent dose", "دوز معادل"), bi("Duration of action", "طول اثر")],
    rows: [
      ["Hydrocortisone", "20 mg", bi("Short (8–12 h)", "کوتاه (۸ تا ۱۲ ساعت)")],
      ["Cortisone acetate", "25 mg", bi("Short (8–12 h)", "کوتاه (۸ تا ۱۲ ساعت)")],
      ["Prednisolone", "5 mg", bi("Intermediate (12–36 h)", "متوسط (۱۲ تا ۳۶ ساعت)")],
      ["Prednisone", "5 mg", bi("Intermediate (12–36 h)", "متوسط (۱۲ تا ۳۶ ساعت)")],
      ["Methylprednisolone", "4 mg", bi("Intermediate (12–36 h)", "متوسط (۱۲ تا ۳۶ ساعت)")],
      ["Triamcinolone", "4 mg", bi("Intermediate (12–36 h)", "متوسط (۱۲ تا ۳۶ ساعت)")],
      ["Deflazacort", "6 mg", bi("Intermediate", "متوسط")],
      ["Dexamethasone", "0.75 mg", bi("Long (36–72 h)", "طولانی (۳۶ تا ۷۲ ساعت)")],
      ["Betamethasone", "0.75 mg", bi("Long (36–72 h)", "طولانی (۳۶ تا ۷۲ ساعت)")],
    ],
    note: bi(
      "The table ignores mineralocorticoid activity (marked for hydrocortisone and cortisone, negligible for dexamethasone and betamethasone) and differences in duration; it is not valid for replacement therapy in adrenal insufficiency or for topical and inhaled products.",
      "این جدول اثر مینرالوکورتیکوئیدی (قابل توجه در هیدروکورتیزون و کورتیزون و ناچیز در دگزامتازون و بتامتازون) و تفاوت طول اثر را در نظر نمی‌گیرد؛ برای درمان جایگزینی در نارسایی آدرنال و برای فرآورده‌های موضعی و استنشاقی معتبر نیست.",
    ),
    refs: [
      { label: "Liu D et al. Allergy Asthma Clin Immunol 2013;9:30", url: "https://doi.org/10.1186/1710-1492-9-30" },
      { label: "BNF – Glucocorticoid therapy", url: "https://bnf.nice.org.uk/" },
    ],
  },
  {
    key: "statins",
    title: bi("Statins: intensity of LDL-C lowering", "استاتین‌ها: شدت کاهش LDL-C"),
    intro: bi(
      "Daily doses grouped by the expected fall in LDL cholesterol: high ≥ 50%, moderate 30–49%, low < 30%.",
      "دوزهای روزانه بر اساس میزان مورد انتظار کاهش کلسترول LDL: شدت بالا ۵۰٪ یا بیشتر، متوسط ۳۰ تا ۴۹٪، کم کمتر از ۳۰٪.",
    ),
    columns: [bi("Medicine", "دارو"), bi("High intensity", "شدت بالا"), bi("Moderate intensity", "شدت متوسط"), bi("Low intensity", "شدت کم")],
    rows: [
      ["Atorvastatin", "40–80 mg", "10–20 mg", "—"],
      ["Rosuvastatin", "20–40 mg", "5–10 mg", "—"],
      ["Simvastatin", "—", "20–40 mg", "10 mg"],
      ["Pravastatin", "—", "40–80 mg", "10–20 mg"],
      ["Lovastatin", "—", "40–80 mg", "20 mg"],
      ["Fluvastatin", "—", bi("80 mg (XL) or 40 mg twice daily", `${ltr("80 mg")} (پیوسته‌رهش) یا ${ltr("40 mg")} دو بار در روز`), "20–40 mg"],
      ["Pitavastatin", "—", "1–4 mg", "—"],
    ],
    note: bi(
      "Switch within the same intensity band. Percentages are population averages; individual response varies. Simvastatin 80 mg is not recommended because of myopathy risk.",
      "جایگزینی را در همان سطح شدت انجام دهید. درصدها میانگین جمعیتی‌اند و پاسخ فردی متفاوت است. سیمواستاتین ۸۰ میلی‌گرم به دلیل خطر میوپاتی توصیه نمی‌شود.",
    ),
    refs: [
      { label: "Grundy SM et al. 2018 AHA/ACC Guideline on the Management of Blood Cholesterol. Circulation 2019;139:e1082–e1143", url: "https://doi.org/10.1161/CIR.0000000000000625" },
    ],
  },
  {
    key: "ppi",
    title: bi("Proton-pump inhibitors: equivalent doses", "مهارکننده‌های پمپ پروتون: دوزهای معادل"),
    intro: bi("Oral daily doses for gastro-oesophageal reflux disease and dyspepsia.", "دوزهای خوراکی روزانه در ریفلاکس معده به مری و سوءهاضمه."),
    columns: [bi("Medicine", "دارو"), bi("Full dose", "دوز کامل"), bi("Low dose (on demand)", "دوز کم (در صورت نیاز)"), bi("Double dose", "دوز دوبرابر")],
    rows: [
      ["Omeprazole", od("20 mg"), od("10 mg"), od("40 mg")],
      ["Esomeprazole", od("20 mg"), "—", od("40 mg")],
      ["Lansoprazole", od("30 mg"), od("15 mg"), bd("30 mg")],
      ["Pantoprazole", od("40 mg"), od("20 mg"), bd("40 mg")],
      ["Rabeprazole", od("20 mg"), od("10 mg"), bd("20 mg")],
    ],
    note: bi(
      "Esomeprazole 20 mg is classed as equivalent to omeprazole 20 mg. Doses for severe oesophagitis and for Helicobacter pylori eradication differ — see the NICE appendix. Some double doses are outside the licence for reflux.",
      "اسومپرازول ۲۰ میلی‌گرم معادل امپرازول ۲۰ میلی‌گرم در نظر گرفته می‌شود. دوزهای ازوفاژیت شدید و ریشه‌کنی هلیکوباکتر پیلوری متفاوت‌اند — به پیوست NICE مراجعه کنید. برخی دوزهای دوبرابر خارج از اندیکاسیون ثبت‌شده برای ریفلاکس‌اند.",
    ),
    refs: [
      { label: "NICE CG184, Appendix A: Dosage information on proton pump inhibitors", url: "https://www.nice.org.uk/guidance/cg184/chapter/Appendix-A-Dosage-information-on-proton-pump-inhibitors" },
    ],
  },
  {
    key: "arb",
    title: bi("Angiotensin II receptor blockers: usual adult doses in hypertension", "مسدودکننده‌های گیرنده آنژیوتانسین II: دوز معمول بزرگسالان در پرفشاری خون"),
    intro: bi(
      "Usual starting dose and daily dose range. These are licensed dose ranges, not exact equivalents: start the new ARB at its usual starting dose and titrate to blood pressure.",
      "دوز شروع معمول و محدوده دوز روزانه. این‌ها محدوده‌های دوز ثبت‌شده‌اند، نه معادل دقیق: داروی جدید را با دوز شروع معمولش آغاز و بر اساس فشار خون تنظیم کنید.",
    ),
    columns: [bi("Medicine", "دارو"), bi("Usual starting dose", "دوز شروع معمول"), bi("Daily dose range", "محدوده دوز روزانه")],
    rows: [
      ["Losartan potassium", "50 mg", "25–100 mg"],
      ["Valsartan", "80 mg", "80–320 mg"],
      ["Irbesartan", "150 mg", "150–300 mg"],
      ["Candesartan cilexetil", "8 mg", "4–32 mg"],
      ["Telmisartan", "40 mg", "20–80 mg"],
      ["Olmesartan medoxomil", "10–20 mg", "10–40 mg"],
    ],
    note: bi(
      "Lower starting doses apply in volume depletion, hepatic impairment and the elderly; check the SmPC of the product dispensed. Do not combine an ARB with an ACE inhibitor or aliskiren.",
      "در کم‌آبی، نارسایی کبد و سالمندان دوز شروع کمتر است؛ SmPC فرآورده تحویلی را بررسی کنید. ARB را با مهارکننده ACE یا آلیسکیرن ترکیب نکنید.",
    ),
    refs: [
      { label: "BNF – Angiotensin-II receptor antagonists", url: "https://bnf.nice.org.uk/" },
      { label: "emc – Summaries of Product Characteristics", url: "https://www.medicines.org.uk/emc" },
    ],
  },
];

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
    { key: "sup", label: bi("Suppository displacement", "ضریب جابه‌جایی شیاف") },
    { key: "iso", label: bi("Isotonicity", "ایزوتونیسیته") },
    { key: "bsa", label: bi("BSA and body weight", "سطح بدن و وزن بدن") },
  ],
  refs: [
    { label: "USP–NF 2026 <795> Pharmaceutical Compounding—Nonsterile Preparations", url: "https://www.uspnf.com/" },
    { label: "USP–NF 2026 <51> Antimicrobial Effectiveness Testing", url: "https://www.uspnf.com/" },
  ] as Ref[],
};
