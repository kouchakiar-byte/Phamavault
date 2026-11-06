import { bi, type Bi } from "@/i18n/bi";

/**
 * "Case of the week" on the home page: one common shop-floor or laboratory problem,
 * what it looks like, its usual causes and what to check first. PharmaVault's own
 * wording; the references name where the requirement comes from.
 */
export type WeeklyCase = {
  id: string;
  area: Bi;
  title: Bi;
  symptom: Bi;
  causes: Bi[];
  checks: Bi[];
  refs: string;
  /** Section the reader goes to for the full treatment. */
  more: { path: string; label: Bi };
};

export const weeklyCaseCopy = {
  eyebrow: bi("Case of the week", "مورد هفته"),
  lead: bi("A real problem from the lab or the shop floor, and where to look first. A new case every Saturday.", "یک مشکل واقعی آزمایشگاه یا خط تولید و اینکه اول کجا را باید بررسی کرد؛ هر شنبه یک مورد تازه."),
  symptom: bi("What you see", "آنچه مشاهده می‌شود"),
  causes: bi("Usual causes", "علت‌های رایج"),
  checks: bi("Check first", "اول این‌ها را بررسی کنید"),
  refs: bi("References", "مراجع"),
  of: bi("Case {n} of {total}", "مورد {n} از {total}"),
};

export const weeklyCases: WeeklyCase[] = [
  {
    id: "coning",
    area: bi("QC · Dissolution", "QC · انحلال"),
    title: bi("Dissolution stops at 82%", "انحلال روی 82% متوقف می‌شود"),
    symptom: bi(
      "The profile flattens below Q and jumps when the Paddle is spun at 250 rpm at the end of the run (infinity point).",
      "پروفایل زیر Q صاف می‌شود و وقتی در پایان آزمون Paddle با 250 rpm می‌چرخد (Infinity point)، ناگهان بالا می‌رود.",
    ),
    causes: [
      bi("Coning: undissolved particles collect in the low-flow zone under the Paddle.", "Coning: ذرات حل‌نشده در ناحیه کم‌جریان زیر Paddle جمع می‌شوند."),
      bi("Dense or poorly wetted excipients that settle faster than they disperse.", "Excipientهای سنگین یا با Wettability کم که زودتر از پخش شدن ته‌نشین می‌شوند."),
      bi("50 rpm is too gentle for this formulation's particle size and density.", "سرعت 50 rpm برای اندازه ذره و دانسیته این فرمولاسیون کافی نیست."),
    ],
    checks: [
      bi("Watch the Vessel bottom during the run: a mound under the Paddle confirms Coning.", "کف Vessel را در طول آزمون نگاه کنید؛ تپه ذرات زیر Paddle یعنی Coning."),
      bi("Add an infinity point to tell incomplete release from incomplete dissolution of the label claim.", "یک Infinity point اضافه کنید تا آزادسازی ناقص از کمبود واقعی ماده مؤثر جدا شود."),
      bi("Justify any change (75 rpm, Apparatus 1) with discriminating data before it enters the method.", "هر تغییر روش (75 rpm یا Apparatus 1) را پیش از ورود به Method با داده‌های Discriminating توجیه کنید."),
    ],
    refs: "USP <711>, USP <1092>",
    more: { path: "free-handbooks", label: bi("Dissolution handbook", "هندبوک انحلال") },
  },
  {
    id: "capping",
    area: bi("Production · Compression", "تولید · پرس قرص"),
    title: bi("Tablets cap after compression", "قرص‌ها پس از پرس Capping می‌شوند"),
    symptom: bi(
      "The top of the tablet splits off as a cap, at ejection or during the friability test.",
      "لایه بالایی قرص هنگام خروج از Die یا در آزمون Friability به شکل یک کلاهک جدا می‌شود.",
    ),
    causes: [
      bi("Air trapped in the granules at high turret speed (short dwell time).", "هوای محبوس در گرانول در سرعت بالای دستگاه (Dwell time کوتاه)."),
      bi("Over-dried granules or too many fines, so particles do not bond.", "گرانول بیش از حد خشک یا Fines زیاد که پیوند کافی بین ذرات ایجاد نمی‌کند."),
      bi("Worn punches or dies, or no pre-compression.", "فرسودگی Punch و Die یا استفاده نکردن از Pre-compression."),
    ],
    checks: [
      bi("Granule LOD against the validated range.", "LOD گرانول در مقایسه با محدوده صحه‌گذاری‌شده."),
      bi("Particle size distribution: the fines fraction against earlier good batches.", "توزیع اندازه ذره؛ درصد Fines در مقایسه با بچ‌های موفق قبلی."),
      bi("Pre-compression force, turret speed and punch tip wear.", "نیروی Pre-compression، سرعت Turret و سایش نوک Punch."),
    ],
    refs: "USP <1216>",
    more: { path: "formulation", label: bi("Formulation section", "بخش فرمولاسیون") },
  },
  {
    id: "sticking",
    area: bi("Production · Compression", "تولید · پرس قرص"),
    title: bi("Powder sticks to the punch faces", "پودر به سطح Punch می‌چسبد"),
    symptom: bi(
      "A film builds up on the punch faces and the embossing fills in (sticking and picking).",
      "لایه‌ای از پودر روی سطح Punch جمع می‌شود و حروف حک‌شده پر می‌شوند (Sticking و Picking).",
    ),
    causes: [
      bi("Granules or room humidity above the usual level.", "رطوبت گرانول یا رطوبت محیط بالاتر از حد معمول."),
      bi("Too little Lubricant, or Magnesium stearate blended too briefly.", "مقدار کم Lubricant یا زمان اختلاط ناکافی Magnesium stearate."),
      bi("A low-melting API (for example ibuprofen) softening under compression heat.", "API با نقطه ذوب پایین (مثلاً ایبوپروفن) که با گرمای پرس نرم می‌شود."),
    ],
    checks: [
      bi("LOD of the blend and the room's relative humidity at the time.", "LOD مخلوط و رطوبت نسبی اتاق در زمان پرس."),
      bi("Lubricant level and blending time against the batch record.", "مقدار Lubricant و زمان اختلاط در مقایسه با Batch record."),
      bi("Punch surface (coating, polish) and the depth and angle of the embossing.", "سطح Punch (پوشش و پولیش) و عمق و زاویه حروف حک‌شده."),
    ],
    refs: "USP <1062>",
    more: { path: "formulation", label: bi("Formulation section", "بخش فرمولاسیون") },
  },
  {
    id: "tailing",
    area: bi("QC · HPLC", "QC · HPLC"),
    title: bi("Peak tailing fails system suitability", "Tailing پیک، System suitability را رد می‌کند"),
    symptom: bi(
      "The Tailing factor of the main peak rises above the method limit and integration becomes uncertain.",
      "Tailing factor پیک اصلی از حد Method بالاتر می‌رود و Integration قابل اطمینان نیست.",
    ),
    causes: [
      bi("Basic analytes interacting with free silanols on the stationary phase.", "برهم‌کنش آنالیت‌های بازی با Silanolهای آزاد فاز ساکن."),
      bi("Mobile-phase pH close to the analyte's pKa.", "pH فاز متحرک نزدیک به pKa آنالیت."),
      bi("A void at the column inlet, a blocked frit or extra-column volume in the fittings.", "Void در ورودی ستون، Frit مسدود یا Extra-column volume در اتصالات."),
    ],
    checks: [
      bi("Run the column's test mix and compare with its certificate.", "مخلوط تست ستون را تزریق و با گواهی ستون مقایسه کنید."),
      bi("Buffer pH about 2 units away from the pKa, within what the method allows.", "pH بافر حدود 2 واحد دورتر از pKa، در محدوده‌ای که Method اجازه می‌دهد."),
      bi("Guard column, inlet frit and tubing connections.", "Guard column، Frit ورودی و اتصالات لوله‌ها."),
    ],
    refs: "USP <621>",
    more: { path: "qc", label: bi("QC section", "بخش QC") },
  },
  {
    id: "rt-drift",
    area: bi("QC · HPLC", "QC · HPLC"),
    title: bi("Retention times drift through the sequence", "زمان بازداری در طول Sequence جابه‌جا می‌شود"),
    symptom: bi(
      "Peaks come out steadily earlier or later from one injection to the next.",
      "پیک‌ها از یک تزریق به تزریق بعد به‌تدریج زودتر یا دیرتر خارج می‌شوند.",
    ),
    causes: [
      bi("Column temperature not controlled, or the room temperature changing.", "کنترل نشدن دمای ستون یا تغییر دمای اتاق."),
      bi("Mobile phase changing: evaporation of the organic part or poor mixing.", "تغییر فاز متحرک؛ تبخیر جزء آلی یا اختلاط نامناسب."),
      bi("Too short an equilibration, a small leak or an unstable pump flow.", "Equilibration کوتاه، نشتی جزئی یا جریان ناپایدار پمپ."),
    ],
    checks: [
      bi("Column oven set and stable.", "Column oven روشن و دمای آن پایدار باشد."),
      bi("Freshly prepared, covered mobile phase.", "فاز متحرک تازه و با درِ بسته."),
      bi("Pressure trace for ripple or a slow fall, and every fitting for leaks.", "نمودار فشار از نظر نوسان یا افت تدریجی، و همه اتصالات از نظر نشتی."),
    ],
    refs: "USP <621>",
    more: { path: "qc", label: bi("QC section", "بخش QC") },
  },
  {
    id: "oos-assay",
    area: bi("QC · QA", "QC · QA"),
    title: bi("An Assay result is out of specification", "نتیجه Assay خارج از Specification است"),
    symptom: bi("One Assay result falls below the release specification.", "یک نتیجه Assay کمتر از Specification آزادسازی است."),
    causes: [
      bi("A laboratory error: dilution, standard preparation, weighing or integration.", "خطای آزمایشگاهی؛ رقیق‌سازی، تهیه Standard، توزین یا Integration."),
      bi("A sampling problem that does not represent the batch.", "نمونه‌برداری‌ای که نماینده کل بچ نیست."),
      bi("A real failure of the product.", "مشکل واقعی در خود محصول."),
    ],
    checks: [
      bi("Phase I laboratory investigation before any retest: keep every solution and the raw data.", "پیش از هر آزمون مجدد، تحقیق مرحله اول آزمایشگاهی؛ همه محلول‌ها و داده‌های خام نگه داشته شوند."),
      bi("Calculations, standard certificate, balance and instrument logs.", "محاسبات، گواهی Standard، دفتر ترازو و دستگاه."),
      bi("No assignable lab cause: a full Phase II investigation with production, never testing into compliance.", "اگر علت آزمایشگاهی پیدا نشد، تحقیق کامل مرحله دوم با تولید؛ هرگز آزمون مکرر تا رسیدن به نتیجه قبول."),
    ],
    refs: "FDA Guidance: Investigating OOS Test Results (2022)",
    more: { path: "qa", label: bi("QA section", "بخش QA") },
  },
  {
    id: "uniformity",
    area: bi("Production · Blending", "تولید · اختلاط"),
    title: bi("Content uniformity fails", "یکنواختی محتوا رد می‌شود"),
    symptom: bi("The Acceptance Value is above the limit, or the tablet results spread widely.", "Acceptance Value از حد مجاز بالاتر است یا نتایج قرص‌ها پراکندگی زیادی دارند."),
    causes: [
      bi("Segregation during transfer, from a large particle-size difference between API and excipients.", "Segregation هنگام انتقال، به دلیل اختلاف زیاد اندازه ذره API و Excipientها."),
      bi("A low-dose API that was never spread evenly (no geometric dilution or pre-blend).", "API کم‌دوز که از ابتدا یکنواخت پخش نشده است (بدون Geometric dilution یا Pre-blend)."),
      bi("Funnel flow in the hopper, emptying the centre first.", "Funnel flow در Hopper که اول وسط آن را خالی می‌کند."),
    ],
    checks: [
      bi("Stratified sampling of the blend and of tablets across the run.", "نمونه‌برداری لایه‌ای (Stratified) از مخلوط و از قرص‌ها در طول پرس."),
      bi("PSD of the API against the main excipients.", "PSD ماده مؤثر در مقایسه با Excipientهای اصلی."),
      bi("Where in the run the high and low results fall: start, middle or end.", "محل نتایج بالا و پایین در طول پرس؛ ابتدا، وسط یا انتها."),
    ],
    refs: "USP <905>",
    more: { path: "formulation", label: bi("Formulation section", "بخش فرمولاسیون") },
  },
  {
    id: "crosslinking",
    area: bi("QC · Stability", "QC · پایداری"),
    title: bi("Capsules dissolve slower on stability", "انحلال کپسول در پایداری کند می‌شود"),
    symptom: bi("Gelatin capsules pass at release but fail dissolution at the accelerated time points.", "کپسول‌های ژلاتینی در آزادسازی قبول‌اند ولی در نقاط Accelerated در انحلال رد می‌شوند."),
    causes: [
      bi("Cross-linking of the gelatin shell, driven by heat, humidity and aldehydes.", "Cross-linking پوسته ژلاتینی بر اثر گرما، رطوبت و آلدهیدها."),
      bi("Aldehyde traces from excipients or packaging.", "آلدهید به‌جامانده از Excipientها یا بسته‌بندی."),
      bi("Moisture uptake through packaging that protects too little.", "جذب رطوبت از بسته‌بندی با محافظت ناکافی."),
    ],
    checks: [
      bi("Repeat with enzymes in the Medium, as the dissolution chapter allows for gelatin capsules.", "تکرار آزمون با Enzyme در Medium، طبق اجازه‌ای که فصل انحلال برای کپسول ژلاتینی می‌دهد."),
      bi("Peroxide and aldehyde content of the fill excipients.", "مقدار Peroxide و آلدهید در Excipientهای پرکننده."),
      bi("Moisture permeability of the blister or bottle.", "نفوذپذیری بلیستر یا بطری نسبت به رطوبت."),
    ],
    refs: "USP <711>, ICH Q1A(R2)",
    more: { path: "free-handbooks", label: bi("Dissolution handbook", "هندبوک انحلال") },
  },
  {
    id: "karl-fischer",
    area: bi("QC · Water content", "QC · تعیین آب"),
    title: bi("Karl Fischer results are high or erratic", "نتایج Karl Fischer بالا یا نامنظم است"),
    symptom: bi("Water content scatters between replicates or rises with no change in the sample.", "مقدار آب بین تکرارها پراکنده است یا بدون تغییر نمونه بالا می‌رود."),
    causes: [
      bi("Atmospheric moisture getting in: a worn septum or exhausted desiccant, shown by a high drift.", "ورود رطوبت هوا از Septum فرسوده یا Desiccant اشباع؛ نشانه آن Drift بالاست."),
      bi("A sample that does not dissolve and releases its water slowly.", "نمونه‌ای که حل نمی‌شود و آب خود را آهسته آزاد می‌کند."),
      bi("Ketones or aldehydes reacting with the methanol reagent.", "واکنش کتون‌ها یا آلدهیدها با معرف متانولی."),
    ],
    checks: [
      bi("Drift before each determination, and the titer against a water standard.", "Drift پیش از هر اندازه‌گیری و Titer با Water standard."),
      bi("A KF oven for insoluble or reactive samples.", "استفاده از KF oven برای نمونه‌های نامحلول یا واکنش‌پذیر."),
      bi("Reagents made for ketones and aldehydes where the sample needs them.", "معرف مخصوص کتون و آلدهید در صورت نیاز نمونه."),
    ],
    refs: "USP <921>",
    more: { path: "qc", label: bi("QC section", "بخش QC") },
  },
  {
    id: "orange-peel",
    area: bi("Production · Film coating", "تولید · روکش فیلمی"),
    title: bi("The film coat looks like orange peel", "سطح روکش شبیه پوست پرتقال است"),
    symptom: bi("The coated surface is rough and dull instead of smooth and glossy.", "سطح قرص روکش‌دار به‌جای صاف و براق، زبر و مات است."),
    causes: [
      bi("A coating suspension too viscous or too high in solids to atomise well.", "سوسپانسیون روکش با Viscosity یا Solid content بالا که خوب Atomize نمی‌شود."),
      bi("Atomising air pressure too low, giving large droplets.", "فشار Atomizing air پایین که قطره‌های درشت می‌سازد."),
      bi("A bed so hot that droplets dry before they spread (spray drying).", "بستر بسیار گرم که قطره پیش از پخش شدن خشک می‌شود (Spray drying)."),
    ],
    checks: [
      bi("Viscosity and solids of the suspension against the batch record.", "Viscosity و Solid content سوسپانسیون در مقایسه با Batch record."),
      bi("Atomising air, spray rate and gun-to-bed distance.", "Atomizing air، Spray rate و فاصله Spray gun تا بستر."),
      bi("Inlet, exhaust and bed temperatures over the run.", "دمای Inlet، Exhaust و بستر در طول فرایند."),
    ],
    refs: "USP <1151>",
    more: { path: "formulation", label: bi("Formulation section", "بخش فرمولاسیون") },
  },
  {
    id: "cleaning",
    area: bi("QA · Cleaning validation", "QA · صحه‌گذاری نظافت"),
    title: bi("A swab result is above the cleaning limit", "نتیجه Swab بالاتر از حد نظافت است"),
    symptom: bi("After changeover, one swab location exceeds the acceptance limit for the previous product.", "پس از تعویض محصول، یک نقطه Swab از حد پذیرش محصول قبلی بالاتر است."),
    causes: [
      bi("A hard-to-clean location: a gasket, valve or dead leg.", "نقطه سخت‌نظافت؛ Gasket، Valve یا Dead leg."),
      bi("A swab recovery factor that was never established for that surface.", "Recovery factor که برای آن جنس سطح تعیین نشده است."),
      bi("Dirty hold time exceeded, so residue dried on.", "گذشتن از Dirty hold time و خشک شدن باقیمانده روی سطح."),
    ],
    checks: [
      bi("The worst-case location map and whether this point is on it.", "نقشه نقاط Worst-case و اینکه این نقطه در آن هست یا نه."),
      bi("Recovery study for the surface material and the swab solvent.", "مطالعه Recovery برای جنس سطح و حلال Swab."),
      bi("The limit itself: MACO from health-based exposure limits (PDE).", "خود حد؛ MACO بر پایه حدود مواجهه مبتنی بر سلامت (PDE)."),
    ],
    refs: "EU GMP Annex 15, EMA HBEL guideline",
    more: { path: "tools", label: bi("Calculators", "ماشین‌حساب‌ها") },
  },
  {
    id: "oot-impurity",
    area: bi("QC · Stability", "QC · پایداری"),
    title: bi("A degradant grows faster than before", "یک محصول تخریب سریع‌تر از قبل رشد می‌کند"),
    symptom: bi(
      "A degradation product is still within specification but rising faster than in earlier batches (out of trend).",
      "یک محصول تخریب هنوز در Specification است ولی سریع‌تر از بچ‌های قبلی بالا می‌رود (Out of trend).",
    ),
    causes: [
      bi("Reactive impurities in an excipient: peroxides in povidone or PEG.", "ناخالصی واکنش‌پذیر در Excipient؛ Peroxide در Povidone یا PEG."),
      bi("A reducing sugar such as lactose reacting with an amine API (Maillard).", "قند احیاکننده مثل لاکتوز در واکنش با API آمینی (Maillard)."),
      bi("A new API source or a change in packaging.", "منبع جدید API یا تغییر بسته‌بندی."),
    ],
    checks: [
      bi("Trend against earlier batches with the same packaging.", "روند در مقایسه با بچ‌های قبلی با همان بسته‌بندی."),
      bi("Peroxide value and supplier of the excipient lot used.", "Peroxide value و تأمین‌کننده Lot مصرفی Excipient."),
      bi("Identify the degradant once it nears the identification threshold.", "شناسایی محصول تخریب وقتی به Identification threshold نزدیک می‌شود."),
    ],
    refs: "ICH Q3B(R2), ICH Q1E",
    more: { path: "excipients", label: bi("Excipients database", "پایگاه مواد جانبی") },
  },
];

/** Index of this week's case: the week starts on Saturday, Tehran time. */
export function weeklyCaseIndex(now = new Date()): number {
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const day = Math.floor(Date.parse(`${ymd}T00:00:00Z`) / 86_400_000); // 0 = Thursday 1970-01-01
  const week = Math.floor((day - 2) / 7); // weeks counted from Saturday 1970-01-03
  return ((week % weeklyCases.length) + weeklyCases.length) % weeklyCases.length;
}
