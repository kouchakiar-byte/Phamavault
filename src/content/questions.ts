import { bi, type Bi } from "@/i18n/bi";

/*
 * Short expert answers to questions QC, QA and R&D staff search for. Each answer is PharmaVault's own
 * text, points to the handbook or tool that covers it in depth and names its sources.
 * Written Aban 1405 (November 2026).
 */

const ltr = (s: string) => `⁦${s}⁩`;

export type Topic = "hplc" | "dissolution" | "validation" | "coa";

export type Question = {
  slug: string;
  topic: Topic;
  q: Bi;
  /** One- or two-sentence answer, also used as the page description. */
  short: Bi;
  points: Bi[];
  refs: string[];
  /** Free handbook or tool that covers the subject in depth. */
  more?: { handbook?: string; path?: string };
};

export const questionsCopy = {
  title: bi("Questions and answers", "پرسش و پاسخ تخصصی"),
  lead: bi(
    "Short, sourced answers to the questions QC, QA and R&D teams ask most, with a link to the handbook or tool that goes further.",
    "پاسخ کوتاه و مستند به پرسش‌های پرتکرار واحدهای کنترل کیفیت، تضمین کیفیت و تحقیق و توسعه، همراه با لینک هندبوک یا ابزاری که موضوع را کامل‌تر بررسی می‌کند.",
  ),
  topics: {
    hplc: bi("HPLC", "HPLC"),
    dissolution: bi("Dissolution", "آزمون انحلال"),
    validation: bi("Method validation", "صحه‌گذاری روش"),
    coa: bi("Certificates of analysis", "برگه آنالیز (CoA)"),
  } satisfies Record<Topic, Bi>,
  answer: bi("Short answer", "پاسخ کوتاه"),
  details: bi("In practice", "در عمل"),
  refs: bi("Sources", "منابع"),
  more: bi("Read more", "مطالعه بیشتر"),
  handbook: bi("Free handbook", "هندبوک رایگان"),
  tool: bi("Open the tool", "باز کردن ابزار"),
  related: bi("Other questions", "پرسش‌های دیگر"),
  all: bi("All questions", "همه پرسش‌ها"),
  note: bi(
    "For professional information. Your SOPs, the current pharmacopoeia and the guidelines take precedence.",
    "برای اطلاع‌رسانی تخصصی. SOPهای سازمان و متن جاری فارماکوپه و گایدلاین‌ها ملاک عمل است.",
  ),
};

export const questions: Question[] = [
  {
    slug: "hplc-peak-tailing",
    topic: "hplc",
    q: bi("What causes peak tailing in HPLC and how is it fixed?", "علت Tailing پیک در HPLC چیست و چگونه برطرف می‌شود؟"),
    short: bi(
      "Most often secondary interaction of basic analytes with residual silanols, a column void or blocked frit, or extra-column volume. Lower the mobile-phase pH or use a base-deactivated column; if all peaks tail, look at the column and connections.",
      "بیشتر به برهمکنش ثانویه ترکیبات بازی با سیلانول‌های آزاد ستون، ایجاد فضای خالی (Void) یا انسداد Frit ستون، یا حجم مرده اتصالات مربوط است. کاهش pH فاز متحرک یا استفاده از ستون Base-deactivated کمک می‌کند؛ اگر همه پیک‌ها Tailing دارند، ستون و اتصالات را بررسی کنید.",
    ),
    points: [
      bi("Only basic compounds tail: silanol interaction. Use pH ≤ 3, a high-purity end-capped column or a buffer of adequate strength.", `فقط ترکیبات بازی Tailing دارند: برهمکنش سیلانول. از ${ltr("pH ≤ 3")}، ستون End-capped با سیلیکای خالص یا بافر با غلظت کافی استفاده کنید.`),
      bi("All peaks tail, early ones most: extra-column volume or a void at the column inlet. Check fittings and tubing; reverse-flush or replace the column.", "همه پیک‌ها، به‌ویژه پیک‌های ابتدایی، Tailing دارند: حجم مرده یا Void در ورودی ستون. اتصالات و لوله‌ها را بررسی کنید؛ ستون را شستشوی معکوس دهید یا تعویض کنید."),
      bi("Tailing grows with injected amount: column overload. Inject less or dilute the sample.", "Tailing با افزایش مقدار تزریق بیشتر می‌شود: Overload ستون. مقدار تزریق را کم یا نمونه را رقیق کنید."),
      bi("Sample solvent stronger than the mobile phase distorts early peaks; dissolve the sample in mobile phase when possible.", "حلال نمونه قوی‌تر از فاز متحرک، پیک‌های ابتدایی را تغییر شکل می‌دهد؛ در صورت امکان نمونه را در فاز متحرک حل کنید."),
      bi("Pharmacopoeial limit: Ph. Eur. symmetry factor 0.8–1.8 unless the monograph states otherwise; USP applies the tailing factor stated in the monograph.", `حد فارماکوپه: Symmetry factor در ${ltr("Ph. Eur.")} بین ${ltr("0.8")} تا ${ltr("1.8")} مگر مونوگراف حد دیگری ذکر کند؛ در USP حد Tailing factor مونوگراف ملاک است.`),
    ],
    refs: ["USP <621> Chromatography", "Ph. Eur. 2.2.46", "Snyder, Kirkland, Dolan. Introduction to Modern Liquid Chromatography, 3rd ed."],
    more: { handbook: "hplc" },
  },
  {
    slug: "hplc-retention-time-drift",
    topic: "hplc",
    q: bi("Why does the retention time drift?", "چرا زمان بازداری در HPLC جابه‌جا می‌شود؟"),
    short: bi(
      "Usually a change in mobile-phase composition or pH, column temperature, flow rate, or an unequilibrated column. Gradual drift in one direction points to the mobile phase or column ageing; sudden jumps point to the pump or a leak.",
      "معمولاً به تغییر ترکیب یا pH فاز متحرک، دمای ستون، سرعت جریان یا تعادل ناکافی ستون مربوط است. جابه‌جایی تدریجی در یک جهت نشانه تغییر فاز متحرک یا فرسودگی ستون، و جهش ناگهانی نشانه مشکل پمپ یا نشتی است.",
    ),
    points: [
      bi("Use a column oven: about 1–2% change in retention per °C is common in reversed phase.", `از Column oven استفاده کنید: در فاز معکوس، تغییر حدود ${ltr("1")} تا ${ltr("2%")} زمان بازداری به ازای هر درجه سانتی‌گراد رایج است.`),
      bi("Evaporation of the organic component from an open reservoir lengthens retention over the day.", "تبخیر حلال آلی از مخزن باز، زمان بازداری را در طول روز افزایش می‌دهد."),
      bi("For ionisable analytes, a pH change of 0.1 unit can move peaks noticeably; prepare buffers by weighing and measure pH before adding the organic solvent.", `برای ترکیبات یونیزه‌شونده، تغییر ${ltr("0.1")} واحد pH می‌تواند پیک‌ها را محسوس جابه‌جا کند؛ بافر را با وزن‌کشی تهیه و pH را پیش از افزودن حلال آلی اندازه بگیرید.`),
      bi("Check the pump: a stuck check valve or air bubble shows as pressure ripple and irregular retention.", "پمپ را بررسی کنید: گیر کردن Check valve یا حباب هوا به‌صورت نوسان فشار و زمان بازداری نامنظم دیده می‌شود."),
      bi("Equilibrate with at least 10–20 column volumes, longer for ion-pair methods.", `ستون را دست‌کم با ${ltr("10")} تا ${ltr("20")} برابر حجم ستون به تعادل برسانید؛ برای روش‌های Ion-pair بیشتر.`),
    ],
    refs: ["USP <621> Chromatography", "Dolan J.W. LCGC troubleshooting columns"],
    more: { handbook: "hplc" },
  },
  {
    slug: "hplc-ghost-peaks",
    topic: "hplc",
    q: bi("Where do ghost peaks come from?", "پیک‌های شبح (Ghost peak) از کجا می‌آیند؟"),
    short: bi(
      "Peaks that appear in blanks: carry-over from the autosampler, impurities in water or solvents that concentrate on the column during a gradient, or late eluters from a previous injection.",
      "پیک‌هایی که در Blank هم دیده می‌شوند: Carry-over از Autosampler، ناخالصی آب یا حلال‌ها که در گرادیان روی ستون تغلیظ می‌شوند، یا ترکیبات دیرشوی تزریق قبلی.",
    ),
    points: [
      bi("Inject a blank after a high standard: a peak at the analyte's time is carry-over; improve needle wash.", "پس از استاندارد غلیظ یک Blank تزریق کنید: پیک در زمان بازداری Analyte نشانه Carry-over است؛ شستشوی سوزن را بهبود دهید."),
      bi("Run the gradient with no injection: peaks that remain come from the mobile phase or system.", "گرادیان را بدون تزریق اجرا کنید: پیک‌های باقی‌مانده از فاز متحرک یا سیستم‌اند."),
      bi("Broad peaks that wander between runs are late eluters; extend the run or add a wash step.", "پیک‌های پهن که بین Runها جابه‌جا می‌شوند ترکیبات دیرشو هستند؛ زمان آنالیز را افزایش دهید یا مرحله شستشو اضافه کنید."),
      bi("Use HPLC-grade solvents and fresh water; plastics and filters can leach compounds.", "از حلال‌های گرید HPLC و آب تازه استفاده کنید؛ ظروف پلاستیکی و فیلترها ممکن است ترکیباتی آزاد کنند."),
    ],
    refs: ["USP <621> Chromatography", "Snyder, Kirkland, Dolan, 3rd ed."],
    more: { handbook: "hplc" },
  },
  {
    slug: "hplc-high-pressure",
    topic: "hplc",
    q: bi("The HPLC pressure is too high. What should I check?", "فشار HPLC بالا رفته است؛ چه چیزی را بررسی کنم؟"),
    short: bi(
      "Find the blockage by working backwards: disconnect the column and see whether pressure falls. Usual causes are a blocked inlet frit or guard column, buffer precipitation and blocked in-line filters.",
      "محل انسداد را از انتهای مسیر به ابتدا پیدا کنید: ستون را جدا کنید و ببینید فشار پایین می‌آید یا نه. علت‌های رایج انسداد Frit ورودی یا Guard column، رسوب بافر و انسداد فیلترهای مسیر است.",
    ),
    points: [
      bi("Pressure falls without the column: the column or guard is blocked; replace the guard, reverse-flush the column if the maker allows.", "بدون ستون فشار پایین می‌آید: ستون یا Guard مسدود است؛ Guard را تعویض و در صورت مجاز بودن، ستون را شستشوی معکوس دهید."),
      bi("Buffer precipitates when the organic fraction is high; never switch directly from buffer to 100% organic. Flush with water first.", `بافر در درصد بالای حلال آلی رسوب می‌کند؛ هرگز مستقیم از بافر به ${ltr("100%")} حلال آلی نروید. ابتدا با آب شستشو دهید.`),
      bi("Filter samples (0.45 or 0.22 µm) and mobile phases; particles collect on the inlet frit.", `نمونه‌ها و فاز متحرک را فیلتر کنید (${ltr("0.45")} یا ${ltr("0.22 µm")})؛ ذرات روی Frit ورودی جمع می‌شوند.`),
      bi("A gradual rise over weeks is normal ageing; record pressure in the system suitability log to see the trend.", "افزایش تدریجی در طول چند هفته فرسودگی طبیعی است؛ فشار را در سوابق System suitability ثبت کنید تا روند آن دیده شود."),
    ],
    refs: ["USP <621> Chromatography", "Column manufacturers' care and use guides"],
    more: { handbook: "hplc" },
  },
  {
    slug: "dissolution-low-variable-results",
    topic: "dissolution",
    q: bi("Why are dissolution results low or variable?", "چرا نتایج آزمون انحلال پایین یا پرنوسان است؟"),
    short: bi(
      "Common causes: dissolved air in the medium, coning under the paddle, tablets sticking to the vessel, vibration, wrong vessel centring or paddle height, filter adsorption and degradation of the drug in the medium.",
      "علت‌های رایج: هوای محلول در Medium، تشکیل Cone زیر Paddle، چسبیدن قرص به دیواره Vessel، لرزش، تنظیم نادرست مرکزیت Vessel یا ارتفاع Paddle، جذب ماده روی فیلتر و تخریب ماده مؤثره در Medium.",
    ),
    points: [
      bi("Deaerate the medium; bubbles on the tablet or basket slow dissolution and raise variability.", "Medium را Degas کنید؛ حباب روی قرص یا Basket سرعت انحلال را کم و نوسان را زیاد می‌کند."),
      bi("A mound of powder under the paddle (coning) gives low, plateaued profiles; consider a different speed or apparatus with justification.", "توده پودر زیر Paddle (Coning) پروفایل پایین و Plateau می‌دهد؛ با توجیه، سرعت یا Apparatus دیگر را بررسی کنید."),
      bi("Check paddle height (25 ± 2 mm above the vessel bottom), centring and wobble during mechanical qualification.", `ارتفاع Paddle (${ltr("25 ± 2 mm")} از کف Vessel)، مرکزیت و لنگی را در Mechanical qualification بررسی کنید.`),
      bi("Run a filter study: compare filtered with centrifuged samples and fix a discard volume.", "مطالعه فیلتر انجام دهید: نمونه فیلترشده را با سانتریفیوژشده مقایسه و حجم دورریز را تعیین کنید."),
      bi("Check sink conditions: if solubility is low, the profile plateaus below 100%.", `شرط Sink را بررسی کنید: اگر Solubility کم باشد، پروفایل زیر ${ltr("100%")} ثابت می‌ماند.`),
    ],
    refs: ["USP <711> Dissolution", "USP <1092> The Dissolution Procedure", "Ph. Eur. 2.9.3"],
    more: { handbook: "dissolution" },
  },
  {
    slug: "dissolution-sink-condition",
    topic: "dissolution",
    q: bi("What is the sink condition in dissolution testing?", "شرط Sink در آزمون انحلال چیست؟"),
    short: bi(
      "The medium volume should be at least about three times the volume needed to saturate it with the dose, so that dissolved drug does not slow further dissolution.",
      "حجم Medium باید دست‌کم حدود سه برابر حجمی باشد که برای اشباع شدن با کل دوز لازم است، تا ماده حل‌شده سرعت انحلال بقیه دوز را کم نکند.",
    ),
    points: [
      bi("Sink index = (solubility × volume) / dose; a value of 3 or more is the usual target.", `شاخص Sink برابر است با ${ltr("(Solubility × Volume) / Dose")}؛ مقدار 3 یا بیشتر هدف رایج است.`),
      bi("For poorly soluble drugs, a surfactant such as SLS is added at the lowest concentration that gives sink conditions.", "برای مواد کم‌محلول، Surfactantی مانند SLS در کمترین غلظتی که شرط Sink را برقرار کند اضافه می‌شود."),
      bi("Too much surfactant can hide real formulation differences and weaken the discriminating power.", "Surfactant بیش از حد می‌تواند تفاوت‌های واقعی فرمولاسیون را پنهان و Discriminating power را کم کند."),
    ],
    refs: ["USP <1092> The Dissolution Procedure: Development and Validation"],
    more: { handbook: "dissolution" },
  },
  {
    slug: "dissolution-f2-similarity",
    topic: "dissolution",
    q: bi("What is the f2 similarity factor and when can it be used?", "فاکتور تشابه f2 چیست و چه زمانی قابل استفاده است؟"),
    short: bi(
      "f2 compares two dissolution profiles; 50 to 100 means similar. It needs at least three time points (zero excluded), 12 units per product, CVs within limits and no more than one point above 85% for both products.",
      "f2 دو پروفایل انحلال را مقایسه می‌کند؛ مقدار 50 تا 100 به معنای تشابه است. شرط استفاده: دست‌کم سه نقطه زمانی (بدون زمان صفر)، 12 واحد از هر فرآورده، CV در حد مجاز و حداکثر یک نقطه بالای 85 درصد برای هر دو فرآورده.",
    ),
    points: [
      bi("If both products release 85% or more within 15 minutes, the profiles are considered similar without f2.", `اگر هر دو فرآورده در ${ltr("15")} دقیقه ${ltr("85%")} یا بیشتر آزاد کنند، پروفایل‌ها بدون محاسبه f2 مشابه در نظر گرفته می‌شوند.`),
      bi("Variability limits (EMA): CV no more than 20% at early points and 10% at later points; otherwise use a bootstrap or multivariate method.", `حدود نوسان (EMA): CV در نقاط ابتدایی حداکثر ${ltr("20%")} و در نقاط بعدی حداکثر ${ltr("10%")}؛ در غیر این صورت از Bootstrap یا روش چندمتغیره استفاده می‌شود.`),
      bi("Use the same time points for both products; adding many points after the plateau inflates f2.", "برای هر دو فرآورده از نقاط زمانی یکسان استفاده کنید؛ افزودن نقاط زیاد پس از Plateau مقدار f2 را به‌طور کاذب بالا می‌برد."),
    ],
    refs: ["FDA Guidance: Dissolution Testing of IR Solid Oral Dosage Forms (1997)", "EMA Guideline on the Investigation of Bioequivalence (2010)", "ICH M9"],
    more: { handbook: "dissolution" },
  },
  {
    slug: "validation-vs-verification",
    topic: "validation",
    q: bi("What is the difference between method validation and verification?", "تفاوت Validation و Verification روش آنالیز چیست؟"),
    short: bi(
      "Validation proves a new or changed procedure is fit for its purpose. Verification shows that an already validated procedure, such as a pharmacopoeial method, works in your laboratory and for your product.",
      "Validation اثبات می‌کند روش جدید یا تغییریافته برای هدف خود مناسب است. Verification نشان می‌دهد روشی که قبلاً صحه‌گذاری شده (مانند روش فارماکوپه) در آزمایشگاه شما و برای محصول شما درست کار می‌کند.",
    ),
    points: [
      bi("Validation: ICH Q2(R2) and USP <1225>; verification: USP <1226>; transfer between laboratories: USP <1224>.", `Validation طبق ${ltr("ICH Q2(R2)")} و ${ltr("USP <1225>")}؛ Verification طبق ${ltr("USP <1226>")}؛ انتقال بین آزمایشگاه‌ها طبق ${ltr("USP <1224>")}.`),
      bi("Verification of a product method usually includes specificity against your own placebo, precision and, for impurities, the quantitation limit.", "Verification روش فرآورده معمولاً شامل Specificity در برابر Placebo خود شما، Precision و برای ناخالصی‌ها، QL است."),
      bi("Instrument qualification (USP <1058>) comes before either.", `Qualification دستگاه (${ltr("USP <1058>")}) پیش از هر دو انجام می‌شود.`),
    ],
    refs: ["ICH Q2(R2) (2023)", "USP <1225>, <1226>, <1224>, <1058>"],
    more: { handbook: "validation" },
  },
  {
    slug: "lod-loq-calculation",
    topic: "validation",
    q: bi("How are the detection limit and quantitation limit calculated?", "حد تشخیص (LOD) و حد اندازه‌گیری (LOQ) چگونه محاسبه می‌شود؟"),
    short: bi(
      "By signal-to-noise (about 3:1 for DL and 10:1 for QL) or from the standard deviation of the response and the slope: DL = 3.3σ/S and QL = 10σ/S. The QL must then be confirmed with independent preparations.",
      "با نسبت سیگنال به نویز (حدود 3 به 1 برای DL و 10 به 1 برای QL) یا از انحراف معیار پاسخ و شیب منحنی: DL برابر 3.3σ/S و QL برابر 10σ/S. سپس QL باید با آماده‌سازی‌های مستقل تأیید شود.",
    ),
    points: [
      bi("σ can come from blank responses, the residual standard deviation of a calibration line near the limit, or the standard error of the intercept.", "σ می‌تواند از پاسخ Blank، انحراف معیار Residualهای منحنی کالیبراسیون نزدیک حد، یا خطای استاندارد عرض از مبدأ به دست آید."),
      bi("Confirm the QL with about six preparations: acceptable RSD (often 10–20%) and recovery.", `QL را با حدود شش آماده‌سازی تأیید کنید: RSD قابل قبول (اغلب ${ltr("10")} تا ${ltr("20%")}) و Recovery مناسب.`),
      bi("For impurity methods the QL must be at or below the reporting threshold (ICH Q3A/Q3B).", `در روش‌های ناخالصی، QL باید برابر یا کمتر از Reporting threshold باشد (${ltr("ICH Q3A/Q3B")}).`),
    ],
    refs: ["ICH Q2(R2) (2023)", "USP <621> (signal-to-noise)"],
    more: { handbook: "validation" },
  },
  {
    slug: "forced-degradation-how-much",
    topic: "validation",
    q: bi("How much degradation is needed in a forced degradation study?", "در مطالعه Forced degradation چه مقدار تخریب لازم است؟"),
    short: bi(
      "A target of about 5 to 20% degradation of the active substance is widely used: enough to form the relevant degradants, not so much that secondary products appear that would never form in real storage.",
      "هدف رایج، تخریب حدود 5 تا 20 درصد ماده مؤثره است: به اندازه‌ای که محصولات تخریب مرتبط تشکیل شوند، ولی نه آن‌قدر که محصولات ثانویه‌ای پدید آیند که در نگهداری واقعی هرگز تشکیل نمی‌شوند.",
    ),
    points: [
      bi("Typical stresses: acid and base hydrolysis, oxidation (hydrogen peroxide), heat, humidity and light (ICH Q1B).", `تنش‌های متداول: هیدرولیز اسیدی و بازی، اکسیداسیون (هیدروژن پراکسید)، حرارت، رطوبت و نور (${ltr("ICH Q1B")}).`),
      bi("Check peak purity and mass balance; low mass balance needs an explanation.", "Peak purity و Mass balance را بررسی کنید؛ Mass balance پایین نیاز به توضیح دارد."),
      bi("If a substance does not degrade under reasonable stress, record the conditions; that is also a result.", "اگر ماده در تنش معقول تخریب نشد، شرایط را ثبت کنید؛ این هم یک نتیجه است."),
    ],
    refs: ["ICH Q1A(R2), Q1B", "ICH Q2(R2)"],
    more: { handbook: "validation" },
  },
  {
    slug: "acceptable-rsd-repeatability",
    topic: "validation",
    q: bi("What RSD is acceptable for repeatability?", "RSD قابل قبول برای Repeatability چقدر است؟"),
    short: bi(
      "ICH Q2(R2) sets no fixed number. Common practice for an HPLC assay of a finished product is RSD ≤ 2.0% for six independent preparations (≤ 1.0% for a drug substance); impurity methods accept more, rising as the level falls.",
      `${ltr("ICH Q2(R2)")} عدد ثابتی تعیین نمی‌کند. عرف رایج برای Assay فرآورده با HPLC، ${ltr("RSD ≤ 2.0%")} برای شش آماده‌سازی مستقل (برای ماده مؤثره ${ltr("≤ 1.0%")}) است؛ برای ناخالصی‌ها حد بالاتر است و با کاهش غلظت افزایش می‌یابد.`,
    ),
    points: [
      bi("Six injections of one solution show injection precision (system suitability), not repeatability.", "شش تزریق از یک محلول Injection precision (بخشی از System suitability) را نشان می‌دهد، نه Repeatability روش را."),
      bi("The criterion should follow from the specification width: a ±5% specification needs a much tighter method.", "معیار باید از عرض Specification استخراج شود: Specification با عرض ±5 درصد روشی بسیار دقیق‌تر لازم دارد."),
      bi("Expected precision worsens at low concentration (Horwitz relationship).", "دقت قابل انتظار در غلظت‌های پایین کاهش می‌یابد (رابطه Horwitz)."),
    ],
    refs: ["ICH Q2(R2) (2023)", "Horwitz W. Anal. Chem. 54 (1982) 67A"],
    more: { handbook: "validation" },
  },
  {
    slug: "coa-what-to-check",
    topic: "coa",
    q: bi("What should a valid certificate of analysis contain?", "یک برگه آنالیز (CoA) معتبر چه اطلاعاتی باید داشته باشد؟"),
    short: bi(
      "The actual manufacturer, product and grade, batch, dates of manufacture and retest, the specification and its version, numerical results for every test, and approval signed and dated by the quality unit.",
      "نام و نشانی تولیدکننده واقعی، نام و گرید ماده، شماره بچ، تاریخ تولید و Retest، Specification و نسخه آن، نتایج عددی همه آزمون‌ها، و تأیید امضا و تاریخ‌دار واحد کیفیت.",
    ),
    points: [
      bi("A distributor must pass on the original manufacturer's CoA (ICH Q7, chapter 17).", "توزیع‌کننده باید CoA اصلی تولیدکننده را ارائه دهد (ICH Q7، فصل 17)."),
      bi("Warning signs: “for research use only”, “N/A” for the retest date or assay, no QA approval, numbers that do not match.", "نشانه‌های هشدار: عبارت «For research use only»، «N/A» برای Retest یا Assay، نبود تأیید QA و ناهمخوانی شماره‌ها."),
      bi("The test list depends on the material: API, synthetic peptide or excipient. Use the PharmaVault CoA checklist.", "فهرست آزمون‌ها به نوع ماده بستگی دارد: API، پپتید سنتتیک یا ماده جانبی. از چک‌لیست بررسی CoA فارماوالت استفاده کنید."),
    ],
    refs: ["ICH Q7", "ICH Q6A", "IPEC Certificate of Analysis Guide"],
    more: { path: "coa-review" },
  },
];
