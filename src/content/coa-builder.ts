import { bi, type Bi } from "@/i18n/bi";

/*
 * CoA builder: the structure of a Certificate of Analysis for a pharmacopoeial
 * raw material. Each test names the general chapter of its method in USP–NF and
 * in Ph. Eur. (whose methods BP reproduces). Monograph acceptance criteria are
 * not reproduced: the user enters them from the current monograph. Only limits
 * from openly citable texts (ICH Q3A/Q3C/Q3D, the general microbial acceptance
 * criteria of Ph. Eur. 5.1.4 and USP <1111>) are filled in, with their source.
 */

export type Pharmacopoeia = "usp" | "eur" | "bp";
export type CoaMaterialType = "api" | "antibiotic" | "vitamin" | "mineral" | "excipient";

export const pharmacopoeias: { value: Pharmacopoeia; label: Bi }[] = [
  { value: "usp", label: bi("USP–NF", "USP–NF") },
  { value: "eur", label: bi("Ph. Eur.", "Ph. Eur.") },
  { value: "bp", label: bi("BP (Ph. Eur. methods)", "BP (روش‌های Ph. Eur.)") },
];

export const materialTypes: { value: CoaMaterialType; label: Bi }[] = [
  { value: "api", label: bi("Active ingredient (API)", "ماده مؤثره (API)") },
  { value: "antibiotic", label: bi("Antibiotic API", "ماده مؤثره آنتی‌بیوتیک") },
  { value: "vitamin", label: bi("Vitamin", "ویتامین") },
  { value: "mineral", label: bi("Mineral salt", "نمک معدنی") },
  { value: "excipient", label: bi("Excipient", "ماده جانبی (Excipient)") },
];

/** A test of the catalogue: its English name (CoAs are issued in English) and its method chapter in each pharmacopoeia. */
export type CoaTest = {
  id: string;
  /** Name as USP–NF words it. */
  name: string;
  /** Name as Ph. Eur. and BP word it, when different. */
  nameEur?: string;
  /** USP–NF general chapter, e.g. "<921>". */
  usp?: string;
  /** Ph. Eur. general chapter, e.g. "2.5.12". */
  eur?: string;
};

export const coaTests: Record<string, CoaTest> = {
  desc: { id: "desc", name: "Description", nameEur: "Appearance" },
  sol: { id: "sol", name: "Solubility" },
  idIr: { id: "idIr", name: "Identification (IR)", usp: "<197>", eur: "2.2.24" },
  idHplc: { id: "idHplc", name: "Identification (HPLC retention time)", usp: "<621>", eur: "2.2.29" },
  idIon: { id: "idIon", name: "Identification (Counter-ion)", usp: "<191>", eur: "2.3.1" },
  clarity: { id: "clarity", name: "Completeness of solution", nameEur: "Appearance of solution (Clarity)", usp: "<641>", eur: "2.2.1" },
  colour: { id: "colour", name: "Color of solution", nameEur: "Appearance of solution (Colour)", usp: "<631>", eur: "2.2.2" },
  ph: { id: "ph", name: "pH", usp: "<791>", eur: "2.2.3" },
  rot: { id: "rot", name: "Specific rotation", nameEur: "Specific optical rotation", usp: "<781>", eur: "2.2.7" },
  mp: { id: "mp", name: "Melting range", nameEur: "Melting point", usp: "<741>", eur: "2.2.14" },
  water: { id: "water", name: "Water (Karl Fischer)", nameEur: "Water", usp: "<921>", eur: "2.5.12" },
  lod: { id: "lod", name: "Loss on drying", usp: "<731>", eur: "2.2.32" },
  roi: { id: "roi", name: "Residue on ignition", nameEur: "Sulfated ash", usp: "<281>", eur: "2.4.14" },
  chl: { id: "chl", name: "Chloride", nameEur: "Chlorides", usp: "<221>", eur: "2.4.4" },
  sulf: { id: "sulf", name: "Sulfate", nameEur: "Sulfates", usp: "<221>", eur: "2.4.13" },
  ei: { id: "ei", name: "Elemental impurities", usp: "<232>, <233>", eur: "5.20, 2.4.20" },
  rsUnsp: { id: "rsUnsp", name: "Organic impurities: Any individual unspecified impurity", nameEur: "Related substances: Unspecified impurities (each)", usp: "<621>", eur: "2.2.29" },
  rsSpec: { id: "rsSpec", name: "Organic impurities: Specified impurities", nameEur: "Related substances: Specified impurities", usp: "<621>", eur: "2.2.29" },
  rsTotal: { id: "rsTotal", name: "Organic impurities: Total impurities", nameEur: "Related substances: Total", usp: "<621>", eur: "2.2.29" },
  rsolv: { id: "rsolv", name: "Residual solvents", usp: "<467>", eur: "2.4.24, 5.4" },
  assay: { id: "assay", name: "Assay", usp: "<621> / <541>", eur: "2.2.29 / 2.2.20" },
  potency: { id: "potency", name: "Potency (Microbial assay)", usp: "<81>", eur: "2.7.2" },
  tamc: { id: "tamc", name: "Microbial limits: TAMC", usp: "<61>, <1111>", eur: "2.6.12, 5.1.4" },
  tymc: { id: "tymc", name: "Microbial limits: TYMC", usp: "<61>, <1111>", eur: "2.6.12, 5.1.4" },
  bet: { id: "bet", name: "Bacterial endotoxins", usp: "<85>", eur: "2.6.14" },
  sterility: { id: "sterility", name: "Sterility", usp: "<71>", eur: "2.6.1" },
  psd: { id: "psd", name: "Particle size distribution", usp: "<429> / <786>", eur: "2.9.31 / 2.9.38" },
  density: { id: "density", name: "Bulk and tapped density", usp: "<616>", eur: "2.9.34" },
  visc: { id: "visc", name: "Viscosity", usp: "<911> / <912>", eur: "2.2.9 / 2.2.10" },
  xrpd: { id: "xrpd", name: "Polymorphic form (XRPD)", usp: "<941>", eur: "2.9.33" },
};

/** The tests a CoA of each kind of material usually carries, in order; options add the rest. */
export const profiles: Record<CoaMaterialType, string[]> = {
  api: ["desc", "sol", "idIr", "idHplc", "clarity", "colour", "water", "roi", "ei", "rsUnsp", "rsSpec", "rsTotal", "rsolv", "assay"],
  antibiotic: ["desc", "sol", "idIr", "idHplc", "ph", "water", "roi", "ei", "rsUnsp", "rsSpec", "rsTotal", "rsolv", "assay"],
  vitamin: ["desc", "sol", "idIr", "idHplc", "water", "roi", "ei", "rsSpec", "assay", "tamc", "tymc"],
  mineral: ["desc", "sol", "idIon", "clarity", "ph", "lod", "chl", "sulf", "ei", "assay", "tamc", "tymc"],
  excipient: ["desc", "sol", "idIr", "ph", "lod", "roi", "ei", "rsolv", "assay", "tamc", "tymc"],
};

/** Tests the options add. */
export const optionTests = {
  salt: "idIon",
  chiral: "rot",
  sterile: ["bet", "sterility"],
  micro: ["tamc", "tymc"],
  potency: "potency",
  extra: ["mp", "psd", "density", "visc", "xrpd", "ph", "lod", "water", "clarity", "colour"],
};

/** Limits from openly citable texts, with the text named beside the value. */
export const publicSpecs = {
  rsUnsp: {
    spec: "≤ 0.10%",
    source: bi(
      "ICH Q3A(R2) identification threshold for a maximum daily dose ≤ 2 g (0.10% or 1.0 mg/day, whichever is lower); also the default of the Ph. Eur. general monograph 2034 (substances for human use). Use the monograph limit when it sets one.",
      "آستانه Identification در ICH Q3A(R2) برای حداکثر دوز روزانه تا 2 g (0.10% یا 1.0 mg در روز، هر کدام کمتر باشد)؛ همان حد پیش‌فرض مونوگراف عمومی Ph. Eur. 2034 برای مواد مصرف انسانی. اگر مونوگراف حد دیگری تعیین کرده، حد مونوگراف ملاک است.",
    ),
  },
  tamc: { spec: "≤ 10³ CFU/g", source: bi("Ph. Eur. 5.1.4 and USP <1111>, non-sterile substances for pharmaceutical use.", "Ph. Eur. 5.1.4 و USP <1111>، مواد غیراستریل برای مصرف دارویی.") },
  tymc: { spec: "≤ 10² CFU/g", source: bi("Ph. Eur. 5.1.4 and USP <1111>, non-sterile substances for pharmaceutical use.", "Ph. Eur. 5.1.4 و USP <1111>، مواد غیراستریل برای مصرف دارویی.") },
  sterility: { spec: "Sterile", source: bi("USP <71> / Ph. Eur. 2.6.1.", "USP <71> / Ph. Eur. 2.6.1.") },
  ei: { source: bi("ICH Q3D(R2) Option 1 (10 g/day), class 1 and 2A elements, for the route chosen.", "ICH Q3D(R2) روش 1 (10 g در روز)، عناصر کلاس 1 و 2A، برای راه مصرف انتخاب‌شده.") },
  rsolv: { source: bi("ICH Q3C(R9) Option 1 (10 g/day); class 3: 5000 ppm.", "ICH Q3C(R9) روش 1 (10 g در روز)؛ کلاس 3: 5000 ppm.") },
};

export const coaBuilderCopy = {
  title: bi("CoA builder", "طراح برگه آنالیز (CoA)"),
  lead: bi(
    "Build the Certificate of Analysis of a pharmacopoeial raw material: choose the material and the pharmacopoeia, and the tool lays out the tests with the general chapter of each method. Enter the monograph acceptance criteria once, keep them in your specification library, record the results, and print or download the certificate as Word.",
    "برگه آنالیز (CoA) ماده اولیه فارماکوپه‌ای را طراحی کنید: ماده و فارماکوپه را انتخاب کنید تا ابزار آزمون‌ها را همراه با فصل عمومی روش هر کدام بچیند. حدود پذیرش مونوگراف را یک بار وارد و در کتابخانه Specification خود ذخیره کنید، نتایج را ثبت کنید و برگه را چاپ یا به صورت Word دریافت کنید.",
  ),
  back: bi("CoA review checklist", "بررسی برگه آنالیز (CoA)"),
  step1: bi("Material and pharmacopoeia", "ماده و فارماکوپه"),
  material: bi("Material (search the API and excipient databases)", "ماده (جست‌وجو در پایگاه داده مواد مؤثره و Excipientها)"),
  docMaterial: bi("Material", "ماده"),
  grade: bi("Grade (e.g. USP 2025)", "Grade (مثلاً USP 2025)"),
  packaging: bi("Packaging", "بسته‌بندی"),
  importTitle: bi("Import from monograph", "Import from monograph (ورود از مونوگراف)"),
  importLead: bi(
    "Paste the monograph text from your own USP–NF, Ph. Eur. or BP subscription. The tool picks out each test, its method chapter and its acceptance criterion and builds the table. Nothing is sent or stored; check every row against the monograph before use.",
    "متن مونوگراف را از اشتراک USP–NF، Ph. Eur. یا BP خودتان اینجا کپی کنید. ابزار هر آزمون، فصل روش و حد پذیرش آن را تشخیص می‌دهد و جدول را می‌سازد. متن به جایی ارسال یا ذخیره نمی‌شود؛ پیش از استفاده هر ردیف را با مونوگراف تطبیق دهید.",
  ),
  importPlaceholder: bi("Paste the full monograph here…", "متن کامل مونوگراف را اینجا قرار دهید…"),
  importRead: bi("Read monograph", "خواندن مونوگراف"),
  importFound: bi("{n} tests found ({style} layout). Review them, then use them.", "{n} آزمون پیدا شد (قالب {style}). آن‌ها را بررسی و سپس استفاده کنید."),
  importNone: bi("No tests recognised. Check that the whole monograph was pasted.", "آزمونی تشخیص داده نشد. مطمئن شوید متن کامل مونوگراف کپی شده است."),
  importReplace: bi("Replace the table", "جایگزینی جدول"),
  importAppend: bi("Add to the table", "افزودن به جدول"),
  libExport: bi("Export library (file)", "خروجی کتابخانه (فایل)"),
  libImport: bi("Import library file", "ورود فایل کتابخانه"),
  libImported: bi("{n} specifications imported.", "{n} Specification وارد شد."),
  materialHint: bi("Not listed? Type its name and fill the details yourself.", "در فهرست نیست؟ نام را بنویسید و مشخصات را خودتان وارد کنید."),
  pharmacopoeia: bi("Pharmacopoeia", "فارماکوپه"),
  type: bi("Kind of material", "نوع ماده"),
  options: bi("Options", "گزینه‌ها"),
  optSalt: bi("Salt (identify the counter-ion)", "نمک (شناسایی Counter-ion)"),
  optHydrate: bi("Hydrate (water by Karl Fischer)", "هیدرات (آب با Karl Fischer)"),
  optChiral: bi("Chiral (specific optical rotation)", "کایرال (چرخش نوری ویژه)"),
  optSterile: bi("Sterile grade (endotoxins, sterility)", "گرید استریل (Endotoxin و Sterility)"),
  optMicro: bi("Microbial limits", "حدود میکروبی"),
  optPotency: bi("Potency by microbiological assay", "Potency با روش میکروبی"),
  route: bi("Route for elemental impurity limits (ICH Q3D)", "راه مصرف برای حدود ناخالصی عنصری (ICH Q3D)"),
  routes: { oral: bi("Oral", "خوراکی"), par: bi("Parenteral", "تزریقی"), inh: bi("Inhalation", "استنشاقی") },
  solvents: bi("Residual solvents used in the process (ICH Q3C)", "حلال‌های باقیمانده فرایند (ICH Q3C)"),
  addSolvent: bi("Add solvent", "افزودن حلال"),
  step2: bi("Batch details", "مشخصات بچ"),
  company: bi("Company (issuer of the certificate)", "شرکت (صادرکننده برگه)"),
  logo: bi("Logo", "لوگو"),
  reportNo: bi("Certificate no.", "شماره برگه"),
  batch: bi("Batch / lot no.", "شماره بچ"),
  manufacturer: bi("Manufacturer", "سازنده"),
  supplier: bi("Supplier", "تأمین‌کننده"),
  quantity: bi("Quantity", "مقدار"),
  mfgDate: bi("Manufacturing date", "تاریخ ساخت"),
  retestDate: bi("Retest / expiry date", "تاریخ Retest یا انقضا"),
  analysisDate: bi("Date of analysis", "تاریخ آنالیز"),
  storage: bi("Storage", "شرایط نگهداری"),
  cas: bi("CAS no.", "شماره CAS"),
  formula: bi("Molecular formula", "فرمول مولکولی"),
  mw: bi("Molecular weight", "وزن مولکولی"),
  step3: bi("Tests, specifications and results", "آزمون‌ها، Specification و نتایج"),
  colNo: bi("No.", "ردیف"),
  colTest: bi("Test", "آزمون"),
  colMethod: bi("Method", "روش"),
  colSpec: bi("Specification", "Specification"),
  colResult: bi("Result", "نتیجه"),
  colConf: bi("Conformity", "انطباق"),
  specPlaceholder: bi("From the current monograph", "از مونوگراف جاری وارد کنید"),
  resultPlaceholder: bi("Result", "نتیجه"),
  auto: bi("Auto", "خودکار"),
  complies: bi("Complies", "منطبق"),
  notComplies: bi("Does not comply", "نامنطبق"),
  pending: bi("—", "—"),
  addTest: bi("Add test", "افزودن آزمون"),
  addCustom: bi("Custom test", "آزمون دلخواه"),
  remove: bi("Remove", "حذف"),
  sourceTitle: bi("Where the filled limits come from", "منبع حدودی که خودکار پر شده‌اند"),
  step4: bi("Conclusion and signatures", "نتیجه‌گیری و امضاها"),
  remarks: bi("Remarks", "توضیحات"),
  analysedBy: bi("Analysed by", "آنالیست"),
  checkedBy: bi("Checked by", "بازبین"),
  approvedBy: bi("Approved by (QA)", "تأیید (QA)"),
  name: bi("Name", "نام"),
  signature: bi("Signature", "امضا"),
  date: bi("Date", "تاریخ"),
  docTitle: bi("Certificate of Analysis", "برگه آنالیز (Certificate of Analysis)"),
  conclusionOk: bi("The batch complies with the specification of {ph}.", "بچ با Specification فارماکوپه {ph} منطبق است."),
  conclusionFail: bi("The batch does not comply with the specification of {ph}: {tests}.", "بچ با Specification فارماکوپه {ph} منطبق نیست: {tests}."),
  conclusionOpen: bi("Results pending for: {tests}.", "نتیجه این آزمون‌ها هنوز ثبت نشده است: {tests}."),
  word: bi("Download Word", "دانلود Word"),
  print: bi("Print / PDF", "چاپ یا PDF"),
  preview: bi("Preview", "پیش‌نمایش"),
  reset: bi("Start again", "شروع دوباره"),
  libTitle: bi("My specification library", "کتابخانه Specification من"),
  libLead: bi(
    "Save the specification of a material once (tests and acceptance criteria) and load it for every new batch. Saved in your account.",
    "Specification هر ماده (آزمون‌ها و حدود پذیرش) را یک بار ذخیره کنید و برای هر بچ جدید بارگذاری کنید. در حساب کاربری شما نگهداری می‌شود.",
  ),
  libName: bi("Specification name (e.g. internal code and version)", "نام Specification (مثلاً کد داخلی و ویرایش)"),
  libSave: bi("Save to library", "ذخیره در کتابخانه"),
  libSaved: bi("Saved.", "ذخیره شد."),
  libLoad: bi("Load", "بارگذاری"),
  libDelete: bi("Delete", "حذف"),
  libEmpty: bi("No saved specifications yet.", "هنوز Specificationی ذخیره نشده است."),
  libSignIn: bi("Sign in to keep a specification library.", "برای داشتن کتابخانه Specification وارد حساب شوید."),
  libFull: bi("The library is full (200 specifications).", "کتابخانه پر است (200 Specification)."),
  libError: bi("Could not save; try again.", "ذخیره نشد؛ دوباره تلاش کنید."),
  exportLocked: bi(
    "Printing and Word export are for subscribers to the QC or QA section.",
    "چاپ و دریافت Word برای مشترکین بخش QC یا QA فعال است.",
  ),
  buy: bi("See plans", "مشاهده اشتراک‌ها"),
  note: bi(
    "Monograph acceptance criteria are not reproduced here: they belong to the pharmacopoeia and change with each edition, so enter them from the current monograph you hold. Each test shows the general chapter of its method; BP uses the Ph. Eur. method texts. Limits filled in automatically come from ICH Q3A(R2), Q3C(R9), Q3D(R2) and the general microbial criteria of Ph. Eur. 5.1.4 and USP <1111>, as named under the table. A specification in the monograph always takes precedence.",
    "حدود پذیرش مونوگراف‌ها در اینجا بازتولید نمی‌شوند؛ این حدود متعلق به فارماکوپه هستند و با هر ویرایش تغییر می‌کنند، پس آن‌ها را از مونوگراف جاری در اختیار خود وارد کنید. برای هر آزمون فصل عمومی روش آن آمده است؛ BP از متن روش‌های Ph. Eur. استفاده می‌کند. حدودی که خودکار پر می‌شوند از ICH Q3A(R2)، Q3C(R9)، Q3D(R2) و معیارهای عمومی میکروبی Ph. Eur. 5.1.4 و USP <1111> گرفته شده‌اند و منبع هر کدام زیر جدول آمده است. حد مونوگراف همیشه مقدم است.",
  ),
};
