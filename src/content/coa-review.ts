import { bi, type Bi } from "@/i18n/bi";

/*
 * Certificate of Analysis review checklist. Items follow ICH Q6A (specifications), ICH Q3A/Q3C/Q3D
 * (impurities, residual solvents, elemental impurities), ICH M7 (mutagenic impurities), ICH Q7
 * (GMP for APIs: certificates of analysis), Ph. Eur. 2034 / USP <1503> (synthetic peptides) and the
 * IPEC guide for excipient certificates. Written by the PharmaVault team, Aban 1405 (November 2026).
 */

const ltr = (s: string) => `⁦${s}⁩`;

export type CoaItem = {
  id: string;
  label: Bi;
  why: Bi;
  /** What to ask the supplier for, in the English request email. */
  ask: string;
};

export type MaterialType = "api" | "peptide" | "excipient";

export const coaCopy = {
  title: bi("CoA review checklist", "بررسی برگه آنالیز (CoA)"),
  lead: bi(
    "Tick what the supplier's Certificate of Analysis shows. The tool lists what is missing, flags warning signs and writes the request email to the supplier.",
    "مواردی را که در برگه آنالیز (CoA) تأمین‌کننده وجود دارد علامت بزنید. ابزار کمبودها و نشانه‌های هشدار را فهرست می‌کند و متن ایمیل درخواست مدارک تکمیلی را آماده می‌کند.",
  ),
  type: bi("Material", "نوع ماده"),
  types: {
    api: bi("API (small molecule)", "ماده مؤثره شیمیایی (API)"),
    peptide: bi("Synthetic peptide API", "ماده مؤثره پپتیدی سنتتیک"),
    excipient: bi("Excipient", "ماده جانبی (Excipient)"),
  },
  product: bi("Product name", "نام ماده"),
  batch: bi("Batch number", "شماره بچ"),
  supplier: bi("Supplier", "تأمین‌کننده"),
  docTitle: bi("Document and traceability", "سند و قابلیت ردیابی"),
  testsTitle: bi("Tests and results", "آزمون‌ها و نتایج"),
  flagsTitle: bi("Warning signs on the certificate", "نشانه‌های هشدار در برگه"),
  flagsLead: bi("Tick any that apply.", "در صورت وجود، علامت بزنید."),
  score: bi("Completeness", "میزان کامل بودن"),
  missing: bi("Missing from the certificate", "موارد ناقص در برگه"),
  none: bi("Nothing missing among the checked items.", "در موارد بررسی‌شده، کمبودی وجود ندارد."),
  verdictTitle: bi("Assessment", "ارزیابی"),
  verdict: {
    ok: bi(
      "The certificate covers the expected items. Still verify the results against your own specification and test the material on receipt as your procedures require.",
      "برگه موارد مورد انتظار را پوشش می‌دهد. با این حال، نتایج را با Specification خودتان مقایسه کنید و ماده را طبق رویه‌های سازمان هنگام ورود آزمون کنید.",
    ),
    gaps: bi(
      "Request the missing items before accepting the batch for GMP use.",
      "پیش از پذیرش بچ برای مصرف GMP، موارد ناقص را از تأمین‌کننده درخواست کنید.",
    ),
    stop: bi(
      "Warning signs found: do not accept the batch for GMP manufacture until they are resolved with the supplier.",
      "نشانه‌های هشدار وجود دارد: تا رفع آن‌ها با تأمین‌کننده، بچ را برای تولید GMP نپذیرید.",
    ),
  },
  emailTitle: bi("Request email to the supplier (English)", "متن ایمیل درخواست از تأمین‌کننده (انگلیسی)"),
  copy: bi("Copy email", "کپی متن ایمیل"),
  copied: bi("Copied", "کپی شد"),
  print: bi("Print the review", "چاپ نتیجه بررسی"),
  disclaimer: bi(
    "A screening aid, not a substitute for supplier qualification, your specification or the current pharmacopoeia and guidelines. The final decision rests with your QA.",
    "این ابزار برای غربالگری اولیه است و جایگزین ارزیابی تأمین‌کننده (Supplier qualification)، Specification سازمان و متن جاری فارماکوپه و گایدلاین‌ها نیست. تصمیم نهایی با واحد QA است.",
  ),
  refs: [
    "ICH Q6A, Q7, Q3A(R2), Q3C, Q3D, M7",
    "Ph. Eur. 2034 Substances for pharmaceutical use",
    "USP <1503> Quality attributes of synthetic peptide drug substances",
    "IPEC Certificate of Analysis Guide for Pharmaceutical Excipients",
  ],
};

export const docItems: CoaItem[] = [
  {
    id: "maker",
    label: bi("Name and address of the actual manufacturer (not only the trader)", "نام و نشانی تولیدکننده واقعی (نه فقط بازرگان)"),
    why: bi("Traceability to the manufacturing site is required (ICH Q7, chapter 17).", "ردیابی تا محل ساخت الزامی است (ICH Q7، فصل 17)."),
    ask: "the name and full address of the manufacturing site, and the original manufacturer's CoA if you are a distributor",
  },
  {
    id: "grade",
    label: bi("Product name and grade (USP, Ph. Eur., BP)", `نام ماده و گرید (${ltr("USP")}، ${ltr("Ph. Eur.")}، ${ltr("BP")})`),
    why: bi("Industrial or technical grade is not acceptable for medicines.", "گرید صنعتی یا آزمایشگاهی برای دارو قابل قبول نیست."),
    ask: "confirmation of the pharmacopoeial grade",
  },
  {
    id: "batch",
    label: bi("Batch number, quantity and date of manufacture", "شماره بچ، مقدار و تاریخ تولید"),
    why: bi("Must match the label on the containers received.", "باید با برچسب ظروف دریافتی یکسان باشد."),
    ask: "the batch size and date of manufacture",
  },
  {
    id: "retest",
    label: bi("Retest or expiry date and storage conditions", "تاریخ Retest یا انقضا و شرایط نگهداری"),
    why: bi("Without it the material cannot be used under control; it should rest on stability data.", "بدون آن مصرف کنترل‌شده ممکن نیست؛ باید بر پایه داده‌های پایداری باشد."),
    ask: "the retest (or expiry) date with the supporting stability data, and the storage conditions",
  },
  {
    id: "spec",
    label: bi("Specification reference and version (or pharmacopoeia edition)", "مرجع و نسخه Specification (یا ویرایش فارماکوپه)"),
    why: bi("“In-house” without a number or version cannot be checked.", "عبارت «داخلی» بدون شماره و نسخه قابل بررسی نیست."),
    ask: "the specification document with its number and version",
  },
  {
    id: "numeric",
    label: bi("Actual numerical results, not only “complies”", "نتایج عددی واقعی، نه فقط «Complies»"),
    why: bi("Numbers allow trend review and comparison with your own limits.", "عدد امکان بررسی روند و مقایسه با حدود سازمان را می‌دهد."),
    ask: "the actual numerical results for all quantitative tests",
  },
  {
    id: "approval",
    label: bi("Signed and dated QC review and QA release", "امضا و تاریخ بررسی QC و تأیید QA"),
    why: bi("A certificate without the quality unit's approval is not a release document.", "برگه بدون تأیید واحد کیفیت، سند آزادسازی محسوب نمی‌شود."),
    ask: "a certificate approved and signed by the quality unit (QA)",
  },
  {
    id: "gmp",
    label: bi("GMP status of the site (certificate or statement)", "وضعیت GMP محل تولید (گواهی یا بیانیه)"),
    why: bi("Needed for supplier qualification; for APIs, ICH Q7 applies.", `برای ارزیابی تأمین‌کننده لازم است؛ برای API، ${ltr("ICH Q7")} ملاک است.`),
    ask: "the current GMP certificate (or GMP statement) for the manufacturing site",
  },
];

export const testItems: Record<MaterialType, CoaItem[]> = {
  api: [
    { id: "desc", label: bi("Description / appearance", "ظاهر (Description)"), why: bi("Basic identity and quality check.", "کنترل پایه هویت و کیفیت."), ask: "the description (appearance) result" },
    {
      id: "id",
      label: bi("Identification by at least one specific test (e.g. IR), usually two", `Identification با دست‌کم یک روش اختصاصی (مثلاً ${ltr("IR")})، معمولاً دو روش`),
      why: bi("ICH Q6A expects identification that can tell the substance from close analogues.", `${ltr("ICH Q6A")} شناسایی‌ای می‌خواهد که ماده را از ترکیبات مشابه تفکیک کند.`),
      ask: "the identification results (IR and/or HPLC retention time)",
    },
    { id: "assay", label: bi("Assay with its basis (anhydrous, as is)", "Assay با مبنای محاسبه (بدون آب یا As is)"), why: bi("Needed to calculate the quantity in each dose.", "برای محاسبه مقدار در هر دوز لازم است."), ask: "the assay result and its basis of calculation" },
    {
      id: "rs",
      label: bi("Related substances: specified, unspecified and total impurities", "ناخالصی‌ها: مشخص، نامشخص و کل (Related substances)"),
      why: bi("Thresholds per ICH Q3A; each specified impurity named with its limit.", `حدود طبق ${ltr("ICH Q3A")}؛ هر ناخالصی مشخص با نام و حد خود.`),
      ask: "individual specified and unspecified impurities and total impurities with their limits",
    },
    { id: "solv", label: bi("Residual solvents (ICH Q3C / USP <467>)", `حلال‌های باقی‌مانده (${ltr("ICH Q3C")} / ${ltr("USP <467>")})`), why: bi("Every solvent used in the last steps must be controlled.", "هر حلالی که در مراحل پایانی سنتز استفاده شده باید کنترل شود."), ask: "residual solvents results for all solvents used in the process" },
    { id: "water", label: bi("Water content (Karl Fischer) or loss on drying", "مقدار آب (Karl Fischer) یا LOD"), why: bi("Affects assay basis and stability.", "بر مبنای Assay و پایداری اثر دارد."), ask: "the water content (KF) or loss on drying result" },
    { id: "roi", label: bi("Residue on ignition / sulphated ash", "خاکستر سولفاته (Residue on ignition)"), why: bi("Inorganic impurities.", "ناخالصی‌های معدنی."), ask: "the residue on ignition (sulphated ash) result" },
    { id: "ei", label: bi("Elemental impurities (ICH Q3D risk assessment or results)", `عناصر ناخالص (ارزیابی ریسک ${ltr("ICH Q3D")} یا نتایج)`), why: bi("Catalyst metals in particular.", "به‌ویژه فلزات کاتالیزور."), ask: "the ICH Q3D elemental impurities risk assessment or results" },
    { id: "nitro", label: bi("Nitrosamine / mutagenic impurity risk assessment (ICH M7)", `ارزیابی ریسک Nitrosamine و ناخالصی‌های جهش‌زا (${ltr("ICH M7")})`), why: bi("Required by regulators for all APIs.", "مراجع نظارتی برای همه APIها می‌خواهند."), ask: "the nitrosamine risk assessment (ICH M7)" },
    { id: "psd", label: bi("Particle size / polymorph, where relevant to the dosage form", "اندازه ذرات و Polymorph، در صورت اهمیت برای فرمولاسیون"), why: bi("Can change dissolution and content uniformity.", "می‌تواند انحلال و یکنواختی محتوا را تغییر دهد."), ask: "particle size distribution and polymorphic form" },
    { id: "micro", label: bi("Microbial limits, where relevant", "حدود میکروبی، در صورت لزوم"), why: bi("For water-containing or natural-source materials and non-sterile products at risk.", "برای مواد با منشأ طبیعی یا حساس از نظر میکروبی."), ask: "microbial enumeration results (TAMC, TYMC) and specified micro-organisms" },
  ],
  peptide: [
    { id: "desc", label: bi("Appearance", "ظاهر"), why: bi("Basic check.", "کنترل پایه."), ask: "the appearance result" },
    {
      id: "id",
      label: bi("Identification: mass (MS), HPLC retention time and amino acid analysis or peptide mapping", `Identification: جرم مولکولی (${ltr("MS")})، زمان بازداری HPLC و Amino acid analysis یا Peptide mapping`),
      why: bi("Confirms sequence and structure, not only the mass.", "توالی و ساختار را تأیید می‌کند، نه فقط جرم را."),
      ask: "identification by MS, HPLC retention time and amino acid analysis or peptide mapping",
    },
    {
      id: "assay",
      label: bi("Assay (peptide content) with its basis: anhydrous and counter-ion free", "Assay (مقدار پپتید) با مبنای محاسبه: بدون آب و بدون Counter-ion"),
      why: bi("HPLC purity is not assay; the powder also holds water and counter-ions.", "خلوص HPLC همان Assay نیست؛ پودر آب و Counter-ion هم دارد."),
      ask: "the assay (peptide content) and its basis of calculation",
    },
    {
      id: "rs",
      label: bi("Related substances by HPLC with individual and total impurities", "ناخالصی‌های مرتبط با HPLC: هر ناخالصی و کل"),
      why: bi(
        "For synthetic peptides Ph. Eur. 2034 uses reporting 0.1%, identification 0.5% and qualification 1.0%.",
        `برای پپتیدهای سنتتیک، ${ltr("Ph. Eur. 2034")} حدود گزارش ${ltr("0.1%")}، شناسایی ${ltr("0.5%")} و Qualification ${ltr("1.0%")} را به کار می‌برد.`,
      ),
      ask: "individual and total related substances by HPLC with their limits",
    },
    { id: "water", label: bi("Water content (Karl Fischer)", "مقدار آب (Karl Fischer)"), why: bi("Peptides are hygroscopic; needed for the assay basis.", "پپتیدها رطوبت‌گیرند؛ برای مبنای Assay لازم است."), ask: "the water content by Karl Fischer" },
    {
      id: "counter",
      label: bi("Counter-ion content (acetate, TFA, chloride or sodium)", "مقدار Counter-ion (استات، TFA، کلرید یا سدیم)"),
      why: bi("Defines the salt form and the real peptide content.", "شکل نمک و مقدار واقعی پپتید را تعیین می‌کند."),
      ask: "the counter-ion content (acetate/TFA/chloride/sodium)",
    },
    { id: "solv", label: bi("Residual solvents", "حلال‌های باقی‌مانده"), why: bi("Solid-phase synthesis uses DMF, DCM, acetonitrile, ethers.", "سنتز فاز جامد از DMF، DCM، استونیتریل و اترها استفاده می‌کند."), ask: "residual solvents for all solvents used in synthesis and purification" },
    { id: "agg", label: bi("Aggregates / polymers (high-molecular-weight species)", "Aggregate و پلیمرها (ترکیبات با وزن مولکولی بالا)"), why: bi("Linked to immunogenicity.", "با ایمنی‌زایی (Immunogenicity) مرتبط است."), ask: "high-molecular-weight species (aggregates) by SEC" },
    { id: "endo", label: bi("Bacterial endotoxins (for injectables)", "اندوتوکسین باکتریایی (برای فرآورده تزریقی)"), why: bi("Required when the product is parenteral.", "برای فرآورده تزریقی الزامی است."), ask: "the bacterial endotoxins result" },
    { id: "micro", label: bi("Microbial limits / bioburden", "حدود میکروبی یا Bioburden"), why: bi("Peptide powders are not sterile.", "پودر پپتید استریل نیست."), ask: "microbial enumeration (TAMC, TYMC)" },
    { id: "ei", label: bi("Elemental impurities (ICH Q3D)", `عناصر ناخالص (${ltr("ICH Q3D")})`), why: bi("Risk assessment or results.", "ارزیابی ریسک یا نتایج."), ask: "the ICH Q3D elemental impurities risk assessment" },
  ],
  excipient: [
    { id: "mono", label: bi("All tests of the pharmacopoeial monograph", "همه آزمون‌های مونوگراف فارماکوپه"), why: bi("A pharmacopoeial grade must meet the whole monograph.", "گرید فارماکوپه‌ای باید کل مونوگراف را برآورده کند."), ask: "results for all tests of the pharmacopoeial monograph" },
    { id: "id", label: bi("Identification", "Identification"), why: bi("Confirms the substance.", "هویت ماده را تأیید می‌کند."), ask: "the identification results" },
    {
      id: "frc",
      label: bi("Functionality-related characteristics (e.g. particle size, viscosity, bulk density)", "ویژگی‌های مرتبط با عملکرد (FRC)، مانند اندازه ذرات، ویسکوزیته و دانسیته"),
      why: bi("They decide how the excipient behaves in your process.", "رفتار ماده جانبی در فرایند تولید را تعیین می‌کنند."),
      ask: "the functionality-related characteristics relevant to our use (particle size, viscosity, density)",
    },
    { id: "micro", label: bi("Microbial limits", "حدود میکروبی"), why: bi("Especially natural-origin excipients (starches, cellulose, gums).", "به‌ویژه مواد با منشأ طبیعی (نشاسته، سلولز، صمغ‌ها)."), ask: "microbial enumeration results" },
    { id: "solv", label: bi("Residual solvents statement", "بیانیه حلال‌های باقی‌مانده"), why: bi("ICH Q3C applies to excipients too.", `${ltr("ICH Q3C")} برای مواد جانبی هم کاربرد دارد.`), ask: "a residual solvents statement (ICH Q3C)" },
    { id: "ei", label: bi("Elemental impurities statement", "بیانیه عناصر ناخالص"), why: bi("Input to the product's ICH Q3D assessment.", `ورودی ارزیابی ${ltr("ICH Q3D")} فرآورده است.`), ask: "an elemental impurities statement" },
    {
      id: "tse",
      label: bi("TSE/BSE statement (animal-derived: lactose, gelatin, stearates)", "بیانیه TSE/BSE (برای مواد با منشأ حیوانی: لاکتوز، ژلاتین، استئارات‌ها)"),
      why: bi("Required for materials of animal origin.", "برای مواد با منشأ حیوانی الزامی است."),
      ask: "a TSE/BSE statement",
    },
  ],
};

export const redFlags: { id: string; label: Bi }[] = [
  { id: "research", label: bi("“For research use only” or “R&D” on the certificate", "عبارت «For research use only» یا «R&D» روی برگه") },
  { id: "na", label: bi("“N/A” for retest date, assay or a critical test", "عبارت «N/A» برای Retest، Assay یا یک آزمون مهم") },
  { id: "noqa", label: bi("No QA approval, or only one signature", "بدون تأیید QA یا فقط یک امضا") },
  { id: "edge", label: bi("Several results exactly at the limit", "چند نتیجه دقیقاً روی حد Specification") },
  { id: "mismatch", label: bi("Numbers that do not match (batch, document number, file name, dates)", "ناهمخوانی شماره‌ها (بچ، شماره سند، نام فایل، تاریخ‌ها)") },
  { id: "edited", label: bi("PDF edited after it was signed (file properties)", "ویرایش PDF پس از امضا (در مشخصات فایل)") },
  { id: "spec", label: bi("Specification limits that disagree with the pharmacopoeia or are internally inconsistent", "حدود Specification مغایر با فارماکوپه یا متناقض با یکدیگر") },
];
