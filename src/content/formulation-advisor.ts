import { bi, type Bi } from "@/i18n/bi";
import type { CatalogueItem, DosageForm, Role, Route } from "@/lib/formulation-advisor";

/*
 * Excipients offered by the formulation advisor, with the concentration ranges
 * stated in their monographs on this site ([min, max, suggested start] % w/w).
 * null: the monograph gives no range for that use (q.s. or set by the user).
 */
export const advisorCatalogue: (CatalogueItem & { fa: string })[] = [
  { key: "mcc", name: "Microcrystalline cellulose", fa: "سلولز میکروکریستالی (MCC)", roles: { dil: [20, 90, 30], dis: [5, 15, 10] }, dc: true },
  { key: "smcc", name: "Cellulose, silicified microcrystalline", fa: "سلولز میکروکریستالی سیلیکونه (SMCC)", roles: { dil: [20, 90, 30] }, dc: true },
  { key: "lactose", name: "Lactose monohydrate", fa: "لاکتوز مونوهیدرات", roles: { dil: null }, reducing: true, dc: false },
  { key: "lactose-sd", name: "Lactose, spray-dried", fa: "لاکتوز اسپری‌درای", roles: { dil: null }, reducing: true, dc: true },
  { key: "lactose-an", name: "Lactose, anhydrous", fa: "لاکتوز بی‌آب", roles: { dil: null }, reducing: true, dc: true },
  { key: "mannitol", name: "Mannitol", fa: "مانیتول", roles: { dil: [10, 90, 40] }, dc: true },
  { key: "sorbitol", name: "Sorbitol", fa: "سوربیتول", roles: { dil: [25, 90, 40] }, dc: true, hygroscopic: true },
  { key: "dcp", name: "Calcium phosphate, dibasic anhydrous", fa: "دی‌کلسیم فسفات بی‌آب (DCP)", roles: { dil: null }, dc: true },
  { key: "maltodextrin", name: "Maltodextrin", fa: "مالتودکسترین", roles: { bin: [3, 10, 5] }, reducing: true },
  { key: "pvp", name: "Povidone K30", fa: "پوویدون K30 (PVP)", roles: { bin: [0.5, 5, 3] } },
  { key: "copovidone", name: "Copovidone", fa: "کوپوویدون", roles: { bin: [2, 5, 4] } },
  { key: "hpmc", name: "Hypromellose (HPMC)", fa: "هیپروملوز (HPMC)", roles: { bin: [2, 5, 3] } },
  { key: "hpc", name: "Hydroxypropyl cellulose", fa: "هیدروکسی‌پروپیل سلولز (HPC)", roles: { bin: [2, 6, 3] } },
  { key: "mc", name: "Methylcellulose", fa: "متیل‌سلولز", roles: { bin: [1, 5, 3], dis: [2, 10, 5] } },
  { key: "cmcna", name: "Carboxymethylcellulose sodium", fa: "کربوکسی‌متیل‌سلولز سدیم", roles: { bin: [1, 6, 3] } },
  { key: "pgs", name: "Pregelatinized starch", fa: "نشاسته پیش‌ژلاتینه", roles: { dil: [5, 75, 20], bin: [5, 10, 7], dis: [5, 10, 7] }, dc: true },
  { key: "starch", name: "Starch, maize", fa: "نشاسته ذرت", roles: { dis: [3, 25, 8], bin: [5, 25, 8] }, dc: false },
  { key: "ccs", name: "Croscarmellose sodium", fa: "کروس‌کارملوز سدیم (CCS)", roles: { dis: [0.5, 5, 3] } },
  { key: "ssg", name: "Sodium starch glycolate", fa: "سدیم استارچ گلیکولات (SSG)", roles: { dis: [2, 8, 4] } },
  { key: "crospovidone", name: "Crospovidone", fa: "کروس‌پوویدون", roles: { dis: [2, 5, 4] } },
  { key: "lhpc", name: "Hydroxypropyl cellulose, low-substituted", fa: "هیدروکسی‌پروپیل سلولز کم‌جانشین (L-HPC)", roles: { dis: [2, 10, 5] } },
  { key: "mgst", name: "Magnesium stearate", fa: "منیزیم استئارات", roles: { lub: [0.25, 5, 1] } },
  { key: "cast", name: "Calcium stearate", fa: "کلسیم استئارات", roles: { lub: [0.1, 1, 0.5] } },
  { key: "ssf", name: "Sodium stearyl fumarate", fa: "سدیم استئاریل فومارات (SSF)", roles: { lub: [0.5, 2, 1.5] } },
  { key: "gb", name: "Glyceryl behenate", fa: "گلیسریل بهنات", roles: { lub: [1, 3, 2] } },
  { key: "stearic", name: "Stearic acid", fa: "استئاریک اسید", roles: { lub: [1, 3, 2] } },
  { key: "talc", name: "Talc", fa: "تالک", roles: { gli: [1, 10, 2], lub: [1, 10, 2] } },
  { key: "silica", name: "Colloidal silicon dioxide", fa: "سیلیکون دی‌اکسید کلوئیدی (Aerosil)", roles: { gli: [0.1, 1, 0.5] } },
  { key: "sls", name: "Sodium lauryl sulfate", fa: "سدیم لوریل سولفات (SLS)", roles: { wet: [1, 2, 1], lub: [1, 2, 1] } },
  { key: "ps80", name: "Polysorbate 80", fa: "پلی‌سوربات 80", roles: { wet: [0.1, 3, 0.5] } },
  { key: "poloxamer", name: "Poloxamer", fa: "پلوکسامر", roles: { wet: [0.01, 5, 1] } },
  { key: "sucralose", name: "Sucralose", fa: "سوکرالوز", roles: { swe: [0.05, 0.5, 0.2] } },
  { key: "acek", name: "Acesulfame potassium", fa: "آسه‌سولفام پتاسیم", roles: { swe: [0.02, 0.5, 0.2] } },
];

export const roleLabels: Record<Role, Bi> = {
  dil: bi("Diluent (filler)", "رقیق‌کننده (Filler)"),
  bin: bi("Binder", "چسباننده (Binder)"),
  dis: bi("Disintegrant", "باززا (Disintegrant)"),
  lub: bi("Lubricant", "روان‌کننده (Lubricant)"),
  gli: bi("Glidant", "تسهیل‌کننده جریان (Glidant)"),
  wet: bi("Wetting agent", "عامل ترکننده (Wetting agent)"),
  swe: bi("Sweetener", "شیرین‌کننده"),
  fla: bi("Flavour", "طعم‌دهنده"),
  col: bi("Colourant", "رنگ‌دهنده"),
  oth: bi("Other", "سایر"),
};

export const formLabels: Record<DosageForm, Bi> = {
  ir: bi("Tablet, immediate release (uncoated)", "قرص رهش فوری (بدون روکش)"),
  fc: bi("Film-coated tablet", "قرص روکش‌دار فیلمی"),
  chew: bi("Chewable tablet", "قرص جویدنی"),
  odt: bi("Orally disintegrating tablet (ODT)", "قرص باززا در دهان (ODT)"),
  cap: bi("Hard capsule", "کپسول سخت"),
};

export const routeLabels: Record<Route, Bi> = {
  dc: bi("Direct compression", "پرس مستقیم (Direct compression)"),
  wg: bi("Wet granulation", "گرانولاسیون مرطوب (Wet granulation)"),
  dg: bi("Dry granulation (roller compaction)", "گرانولاسیون خشک (Roller compaction)"),
  cap: bi("Blending and capsule filling", "اختلاط و پرکردن کپسول (Capsule filling)"),
};

/** Why the route was chosen. */
export const reasonText: Record<string, Bi> = {
  capsule: bi("Capsule: the blend is filled directly; granulate first only if it does not flow.", "کپسول: مخلوط پودری مستقیماً پر می‌شود؛ تنها در صورت جریان‌پذیری (Flowability) نامطلوب، ابتدا گرانولاسیون انجام می‌شود."),
  capPoorFlow: bi("Poor flow: a wet granulation step before filling improves weight uniformity.", "جریان‌پذیری نامطلوب: گرانولاسیون مرطوب پیش از پرکردن، یکنواختی وزن (Weight uniformity) را بهبود می‌دهد."),
  capPoorFlowSensitive: bi("Poor flow with a moisture- or heat-sensitive drug: use dry granulation (roller compaction) before filling.", "جریان‌پذیری نامطلوب با ماده مؤثره حساس به رطوبت یا حرارت: پیش از پرکردن از گرانولاسیون خشک (Roller compaction) استفاده شود."),
  brandLoad: bi("With the reference product's weight the drug load is {load}% of the unit.", "با وزن فرآورده مرجع، سهم ماده مؤثره {load}% وزن واحد است."),
  highDose: bi("High dose: direct compression at a typical 30% maximum drug load would need about {w} mg per unit.", "دوز بالا: پرس مستقیم با حداکثر متداول 30% ماده مؤثره، به حدود {w} میلی‌گرم در هر واحد نیاز دارد."),
  poorFlow: bi("The drug flows poorly, so a granulation step is preferred.", "ماده مؤثره جریان‌پذیری نامطلوبی دارد؛ بنابراین مرحله گرانولاسیون ترجیح داده می‌شود."),
  dcOk: bi("Moderate drug load and acceptable flow: direct compression is the simplest route (fewest steps, no water or heat).", "سهم متوسط ماده مؤثره و جریان‌پذیری قابل قبول: پرس مستقیم کم‌مرحله‌ترین روش است (بدون حلال و بدون مرحله خشک‌کردن)."),
  odtDc: bi("ODT: direct compression with a superdisintegrant and mannitol is the usual route.", "ODT: پرس مستقیم با Superdisintegrant و مانیتول روش متداول است."),
  sensitiveDg: bi("The drug is moisture- or heat-sensitive, so dry granulation avoids water and drying.", "ماده مؤثره به رطوبت یا حرارت حساس است؛ در گرانولاسیون خشک، مواجهه با حلال و مرحله خشک‌کردن حذف می‌شود."),
  wgOk: bi("Wet granulation tolerates high drug loads and poor flow and gives dense, free-flowing granules.", "گرانولاسیون مرطوب برای سهم بالای ماده مؤثره و جریان‌پذیری نامطلوب مناسب است و گرانول متراکم با جریان‌پذیری مطلوب تولید می‌کند."),
};

export const warningText: Record<string, Bi> = {
  over: bi("The fixed components already add up to {sum}%; reduce them or increase the unit weight.", "مجموع اجزای ثابت به {sum}% رسیده است؛ مقدار آن‌ها را کاهش دهید یا وزن واحد را افزایش دهید."),
  noDiluent: bi("{rest}% of the unit is unassigned: add a diluent (filler).", "{rest}% از وزن واحد به جزئی اختصاص نیافته است؛ رقیق‌کننده (Filler) افزوده شود."),
  outOfRange: bi("{name}: {pct}% is outside the monograph range for this use ({min}–{max}%).", "{name}: مقدار {pct}% خارج از محدوده مونوگراف برای این کاربرد ({min} تا {max}%) است."),
  needDis: bi("No disintegrant: tablets need one for disintegration and dissolution.", "باززا (Disintegrant) انتخاب نشده است؛ وجود آن برای باززایی (Disintegration) و انحلال (Dissolution) قرص ضروری است."),
  needLub: bi("No lubricant: ejection and punch sticking problems are likely.", "روان‌کننده (Lubricant) انتخاب نشده است؛ احتمال افزایش نیروی خروج (Ejection force) و چسبیدن به پانچ (Sticking) وجود دارد."),
  needBin: bi("Wet granulation without a binder: add one (for example povidone K30 2–5%).", "گرانولاسیون مرطوب بدون چسباننده (Binder) انجام نمی‌شود؛ برای نمونه پوویدون K30 با غلظت 2 تا 5% افزوده شود."),
  needGli: bi("Consider a glidant (for example colloidal silicon dioxide 0.1–1%) for flow and weight uniformity.", "برای بهبود جریان‌پذیری و یکنواختی وزن، Glidant در نظر گرفته شود (برای نمونه سیلیکون دی‌اکسید کلوئیدی 0.1 تا 1%)."),
  needSwe: bi("Chewable tablets and ODTs normally need a sweetener and a flavour.", "در قرص جویدنی و ODT، شیرین‌کننده (Sweetener) و طعم‌دهنده (Flavour) برای پوشاندن طعم (Taste masking) لازم است."),
  needWet: bi("Poorly soluble drug: consider a wetting agent (SLS 1–2% or polysorbate 80 0.1–3%) and a small drug particle size.", "ماده مؤثره کم‌محلول: عامل ترکننده (SLS با 1 تا 2% یا پلی‌سوربات 80 با 0.1 تا 3%) و کاهش اندازه ذره (Micronization) ماده مؤثره در نظر گرفته شود."),
  maillard: bi("{name} is a reducing sugar: Maillard reaction with primary/secondary amine drugs. Prefer a non-reducing filler (MCC, mannitol, DCP).", "{name} قند احیاکننده (Reducing sugar) است و با داروهای دارای آمین نوع اول یا دوم واکنش میلارد (Maillard reaction) می‌دهد؛ Filler غیراحیاکننده (MCC، مانیتول، DCP) ارجح است."),
  hygroscopic: bi("{name} is hygroscopic; with a moisture-sensitive drug control humidity and packaging.", "{name} رطوبت‌گیر (Hygroscopic) است؛ با ماده مؤثره حساس به رطوبت، رطوبت محیط و بسته‌بندی کنترل شود."),
  notDc: bi("{name} is not a direct-compression grade; use a DC grade (for example spray-dried lactose) or granulate.", "{name} گرید پرس مستقیم نیست؛ از گرید DC (برای نمونه لاکتوز اسپری‌درای) استفاده شود یا گرانولاسیون انجام شود."),
  cu: bi("Dose below 25 mg or below 25% of the unit: content uniformity (not weight variation) applies (USP <905>); use geometric dilution and verify blend uniformity.", "دوز کمتر از 25 میلی‌گرم یا کمتر از 25% وزن واحد: آزمون یکنواختی محتوا (Content uniformity) الزامی است (USP <905>)؛ اختلاط به روش رقیق‌سازی هندسی (Geometric dilution) و بررسی Blend uniformity انجام شود."),
  big: bi("A {w} mg tablet is large to swallow; consider a capsule, two units per dose or a higher drug load.", "قرص {w} میلی‌گرمی از نظر قابلیت بلع (Swallowability) بزرگ است؛ کپسول، دو واحد در هر دوز یا افزایش سهم ماده مؤثره بررسی شود."),
  sizeRld: bi("A generic tablet should not be larger than the reference product (FDA guidance on size and shape of generic tablets).", "قرص ژنریک نباید از فرآورده مرجع بزرگ‌تر باشد (راهنمای FDA درباره اندازه و شکل قرص‌های ژنریک)."),
  splitDis: bi("In wet granulation the disintegrant is usually split, about half in the granules and half added extragranularly.", "در گرانولاسیون مرطوب باززا معمولاً تقسیم می‌شود: حدود نیمی به‌صورت داخل‌گرانولی (Intragranular) و نیمی به‌صورت خارج‌گرانولی (Extragranular)."),
  capTooBig: bi("The fill ({v} mL) does not fit a size 000 capsule; split the dose or densify the blend.", "حجم پرشدن ({v} میلی‌لیتر) از ظرفیت کپسول سایز 000 بیشتر است؛ تقسیم دوز یا افزایش دانسیته مخلوط (Densification) بررسی شود."),
};

/** Manufacturing steps and in-process controls for each route. */
export const processSteps: Record<Route, Bi[]> = {
  dc: [
    bi("Sieve the drug and excipients (e.g. 30–40 mesh); deagglomerate cohesive powders.", "الک‌کردن (Sieving) ماده مؤثره و مواد جانبی (برای نمونه مش 30 تا 40) و رفع تجمع ذرات (Deagglomeration) در پودرهای چسبنده."),
    bi("Blend the drug with part of the diluent (geometric dilution for low doses), then add the rest of the diluent, disintegrant and glidant; blend.", "اختلاط ماده مؤثره با بخشی از رقیق‌کننده (برای دوز پایین به روش رقیق‌سازی هندسی)، سپس افزودن باقی رقیق‌کننده، باززا و Glidant و اختلاط."),
    bi("Add the sieved lubricant last and blend briefly (about 2–5 min) to avoid over-lubrication.", "افزودن روان‌کننده الک‌شده در انتها و اختلاط کوتاه‌مدت (حدود 2 تا 5 دقیقه) برای جلوگیری از Over-lubrication."),
    bi("Compress to the target weight and hardness.", "پرس قرص (Compression) مطابق وزن و سختی (Hardness) هدف."),
  ],
  wg: [
    bi("Sieve and dry-mix the drug, diluent and the intragranular part of the disintegrant.", "الک‌کردن و اختلاط خشک (Dry mixing) ماده مؤثره، رقیق‌کننده و بخش داخل‌گرانولی باززا."),
    bi("Granulate with the binder solution (binder dissolved in water or a hydroalcoholic solvent) to a suitable end point.", "گرانولاسیون با محلول چسباننده (Binder حل‌شده در آب یا حلال هیدروالکلی) تا رسیدن به نقطه پایان (End point) گرانولاسیون."),
    bi("Wet-screen, then dry (fluid-bed or tray) to the target loss on drying.", "الک‌کردن گرانول مرطوب (Wet screening)، سپس خشک‌کردن (Fluid bed dryer یا Tray dryer) تا LOD هدف."),
    bi("Dry-screen (size the granules), add the extragranular disintegrant and glidant and blend.", "کالیبره‌کردن گرانول خشک (Dry screening / Sizing)، افزودن باززای خارج‌گرانولی و Glidant و اختلاط."),
    bi("Add the lubricant last, blend briefly and compress.", "افزودن روان‌کننده در انتها، اختلاط کوتاه‌مدت و پرس."),
  ],
  dg: [
    bi("Sieve and blend the drug, diluent, binder and part of the disintegrant, with a small part of the lubricant.", "الک‌کردن و اختلاط ماده مؤثره، رقیق‌کننده، چسباننده و بخشی از باززا همراه با بخشی از روان‌کننده."),
    bi("Compact (roller compactor or slugging) and mill the ribbons to granules.", "فشرده‌سازی (Roller compactor یا Slugging) و آسیاب‌کردن (Milling) نوارهای فشرده (Ribbons) به گرانول."),
    bi("Add the extragranular disintegrant and glidant, blend, then the rest of the lubricant.", "افزودن باززای خارج‌گرانولی و Glidant، اختلاط و سپس باقی روان‌کننده."),
    bi("Compress to the target weight and hardness.", "پرس قرص (Compression) مطابق وزن و سختی (Hardness) هدف."),
  ],
  cap: [
    bi("Sieve the drug and excipients; blend the drug with the filler (geometric dilution for low doses).", "الک‌کردن ماده مؤثره و مواد جانبی و اختلاط ماده مؤثره با پرکننده (برای دوز پایین به روش رقیق‌سازی هندسی)."),
    bi("Add the glidant, blend, then the lubricant briefly.", "افزودن Glidant و اختلاط، سپس افزودن روان‌کننده و اختلاط کوتاه‌مدت."),
    bi("Fill the capsules (dosator or tamping-disc machine) to the target fill weight.", "پرکردن کپسول‌ها (دستگاه Dosator یا Tamping-disc) تا وزن پرشدن هدف."),
  ],
};

export const coatingStep = bi(
  "Film-coat the cores with an HPMC-based coating (about 3% weight gain, typically 2–4%) in a perforated pan.",
  "روکش فیلمی هسته‌ها با پوشش پایه HPMC (افزایش وزن حدود 3%، معمولاً 2 تا 4%) در دستگاه Perforated coating pan.",
);

export const controls: Bi[] = [
  bi("Blend uniformity; content uniformity or weight variation (USP <905>, Ph. Eur. 2.9.40).", "یکنواختی مخلوط (Blend uniformity)؛ یکنواختی محتوا یا تغییرات وزن (USP <905>، Ph. Eur. 2.9.40)."),
  bi("Hardness and friability: weight loss of not more than 1% (USP <1216>).", "سختی (Hardness) و فرسایش‌پذیری (Friability): کاهش وزن حداکثر 1% (USP <1216>)."),
  bi("Disintegration: uncoated tablets within 15 min, film-coated within 30 min (Ph. Eur. 2.9.1); ODT within 3 min (Ph. Eur.).", "باززایی: قرص بدون روکش حداکثر 15 دقیقه و قرص روکش‌دار فیلمی حداکثر 30 دقیقه (Ph. Eur. 2.9.1)؛ ODT حداکثر 3 دقیقه (Ph. Eur.)."),
  bi("Dissolution against the monograph or the reference product (comparable profiles, f2 ≥ 50).", "انحلال (Dissolution) طبق مونوگراف یا در مقایسه با فرآورده مرجع (مشابهت پروفایل‌ها با f2 ≥ 50)."),
  bi("Loss on drying of granules (wet granulation) and assay.", "LOD گرانول (در گرانولاسیون مرطوب) و آزمون تعیین مقدار (Assay)."),
];

export const advisorCopy = {
  title: bi("Formulation advisor", "مشاور هوشمند فرمولاسیون"),
  lead: bi(
    "Enter the drug, its strength and dosage form, the reference brand and the excipients you want to use. The advisor proposes the manufacturing route, the unit weight and a starting % w/w for every component, with the monograph ranges, warnings and the manufacturing steps.",
    "ماده مؤثره، قدرت دارویی، شکل دارویی، برند مرجع و اجزای فرمولاسیون موردنظرتان را وارد کنید. مشاور، روش ساخت، وزن هر واحد و درصد وزنی پیشنهادی هر جزء را همراه با محدوده‌های مونوگراف، هشدارها و مراحل ساخت ارائه می‌دهد.",
  ),
  step1: bi("Product", "مشخصات فرآورده"),
  api: bi("Active ingredient", "ماده مؤثره"),
  apiPh: bi("e.g. Metformin hydrochloride", "برای نمونه Metformin hydrochloride"),
  strength: bi("Strength (mg per unit)", "قدرت دارویی (میلی‌گرم در هر واحد)"),
  form: bi("Dosage form", "شکل دارویی"),
  use: bi("Indication / use (optional)", "کاربرد درمانی (اختیاری)"),
  usePh: bi("e.g. type 2 diabetes", "برای نمونه دیابت نوع 2"),
  brand: bi("Reference brand (optional)", "برند مرجع (اختیاری)"),
  brandPh: bi("e.g. Glucophage", "برای نمونه Glucophage"),
  brandWeight: bi("Brand unit weight (mg, optional)", "وزن هر واحد برند (میلی‌گرم، اختیاری)"),
  brandWeightHint: bi(
    "Weigh 20 tablets of the brand and divide by 20 (average weight). Leave empty and the advisor computes a target weight.",
    "وزن متوسط (Average weight) از توزین 20 قرص برند و تقسیم بر 20 به دست می‌آید. در صورت عدم ورود این مقدار، مشاور وزن هدف را محاسبه می‌کند.",
  ),
  check: bi("Check in the Orange Book", "بررسی در Orange Book"),
  checking: bi("Searching…", "در حال جستجو…"),
  noMatch: bi("No match in the Orange Book.", "موردی در Orange Book یافت نشد."),
  rld: bi("Reference listed drug (RLD)", "فرآورده مرجع (RLD)"),
  obNote: bi(
    "The Orange Book gives strength and dosage form but not unit weight; the brand's excipients are listed in its label (DailyMed).",
    "Orange Book قدرت و شکل دارویی را ارائه می‌کند اما وزن واحد را نه؛ مواد جانبی برند در برچسب آن (DailyMed) آمده است.",
  ),
  dailymed: bi("Open the brand label on DailyMed", "مشاهده برچسب (Label) برند در DailyMed"),
  units: bi("Batch size (units)", "اندازه بچ (Batch size، تعداد واحد)"),
  density: bi("Blend tapped density (g/mL)", "دانسیته ضربه‌ای مخلوط (Tapped density، g/mL)"),
  step2: bi("Drug properties", "ویژگی‌های ماده مؤثره"),
  flags: {
    poorFlow: bi("Poor flow / cohesive", "جریان‌پذیری نامطلوب / چسبندگی (Cohesive)"),
    moisture: bi("Moisture-sensitive", "حساس به رطوبت (Moisture-sensitive)"),
    heat: bi("Heat-sensitive", "حساس به حرارت (Heat-sensitive)"),
    poorlySoluble: bi("Poorly soluble (BCS II/IV)", "کم‌محلول (BCS II/IV)"),
    amine: bi("Has a primary or secondary amine", "دارای گروه آمین نوع اول یا دوم"),
  },
  step3: bi("Formulation components", "اجزای فرمولاسیون"),
  suggest: bi("Suggest components", "پیشنهاد خودکار اجزا"),
  add: bi("Add component", "افزودن جزء"),
  custom: bi("Other (type the name)", "سایر (ورود نام)"),
  customPh: bi("Component name", "نام جزء"),
  role: bi("Role", "نقش"),
  pct: bi("% (optional)", "درصد (اختیاری)"),
  pctAuto: bi("auto", "خودکار"),
  remove: bi("Remove", "حذف"),
  result: bi("Suggested formula", "فرمول پیشنهادی"),
  route: bi("Manufacturing route", "روش ساخت پیشنهادی"),
  weight: bi("Unit weight", "وزن هر واحد"),
  core: bi("core", "هسته"),
  coat: bi("film coat", "روکش فیلمی"),
  apiLoad: bi("Drug load", "سهم ماده مؤثره"),
  component: bi("Component", "جزء"),
  mg: bi("mg / unit", "میلی‌گرم در واحد"),
  kg: bi("kg / batch", "کیلوگرم در بچ"),
  range: bi("Monograph range", "محدوده مونوگراف"),
  total: bi("Total", "مجموع"),
  capsuleSize: bi("Capsule size", "سایز کپسول"),
  capsuleNote: bi("{v} mL of blend; size {s} holds about {f} mg at this density.", "حجم مخلوط {v} میلی‌لیتر؛ سایز {s} در این دانسیته حدود {f} میلی‌گرم ظرفیت دارد."),
  warnings: bi("Checks and warnings", "بررسی‌ها و هشدارها"),
  steps: bi("Manufacturing steps", "مراحل ساخت"),
  ipc: bi("In-process and finished-product controls", "کنترل‌های حین تولید و فرآورده نهایی"),
  incompat: bi("Incompatibilities (from the monographs)", "ناسازگاری‌ها (از مونوگراف‌ها)"),
  empty: bi("Enter the strength to see the suggested formula.", "برای مشاهده فرمول پیشنهادی، قدرت دارویی را وارد کنید."),
  disclaimer: bi(
    "A starting formula for development, not a validated formulation. Drug–excipient compatibility, stability, dissolution and bioequivalence must be established for every product; concentration ranges come from the excipient monographs and the route and weight rules are common formulation practice.",
    "این یک فرمول شروع برای توسعه است، نه فرمولاسیون اعتبارسنجی‌شده. سازگاری دارو و مواد جانبی، پایداری، انحلال و هم‌ارزی زیستی باید برای هر فرآورده اثبات شود؛ محدوده‌های غلظت از مونوگراف مواد جانبی و قواعد روش ساخت و وزن از رویه متداول فرمولاسیون گرفته شده‌اند.",
  ),
  print: bi("Print formula", "چاپ فرمول"),
  templates: bi("Typical starting compositions", "ترکیب‌های پایه متداول"),
};
