import { bi, type Bi } from "@/i18n/bi";

/**
 * "Case of the week" on the home page: one common shop-floor or laboratory problem,
 * what it looks like, the mechanism behind it, its usual root causes, what to check
 * first (with the criterion to judge it by) and the corrective and preventive actions.
 * PharmaVault's own wording; the references name where the requirement comes from.
 */
export type WeeklyCase = {
  id: string;
  area: Bi;
  title: Bi;
  symptom: Bi;
  /** Why it happens: the physical or chemical mechanism in one short paragraph. */
  mechanism: Bi;
  causes: Bi[];
  checks: Bi[];
  /** Corrective and preventive actions (CAPA). */
  actions: Bi[];
  refs: string;
  /** Section the reader goes to for the full treatment. */
  more: { path: string; label: Bi };
};

export const weeklyCaseCopy = {
  eyebrow: bi("Case of the week", "مورد هفته"),
  lead: bi(
    "A real problem from the lab or the shop floor: the mechanism behind it, the root causes, what to check first and how to stop it coming back. A new case every Saturday.",
    "یک مشکل واقعی آزمایشگاه یا خط تولید: سازوکار آن، علت‌های ریشه‌ای، آنچه باید اول بررسی شود و راه جلوگیری از تکرار آن؛ هر شنبه یک مورد تازه.",
  ),
  symptom: bi("What you see", "آنچه مشاهده می‌شود"),
  mechanism: bi("Mechanism", "سازوکار"),
  causes: bi("Root causes", "علت‌های ریشه‌ای"),
  checks: bi("Check first", "اول این‌ها را بررسی کنید"),
  actions: bi("Corrective and preventive actions (CAPA)", "اقدام اصلاحی و پیشگیرانه (CAPA)"),
  refs: bi("References", "مراجع"),
  of: bi("Case {n} of {total}", "مورد {n} از {total}"),
};

export const weeklyCases: WeeklyCase[] = [
  {
    id: "coning",
    area: bi("QC · Dissolution", "QC · Dissolution"),
    title: bi("Dissolution stops at 82%", "Dissolution روی 82% متوقف می‌شود"),
    symptom: bi(
      "With Apparatus 2 at 50 rpm the profile reaches a plateau below Q; when the Paddle is run at 250 rpm at the end of the test (infinity point) the result jumps close to 100%.",
      "در Apparatus 2 با 50 rpm، پروفایل زیر Q به Plateau می‌رسد؛ وقتی در پایان آزمون Paddle با 250 rpm می‌چرخد (Infinity point)، نتیجه ناگهان به نزدیک 100% می‌رسد.",
    ),
    mechanism: bi(
      "Directly under the Paddle, at the centre of the hemispherical Vessel bottom, is a zone of very low shear. Disintegrated particles that are dense or poorly wetted settle there as a cone (Coning); only its surface is in contact with the Medium, so the dissolution rate falls and the profile flattens even though the drug is fully present.",
      "درست زیر Paddle، در مرکز کف نیم‌کره‌ای Vessel، ناحیه‌ای با Shear بسیار کم وجود دارد. ذرات حاصل از Disintegration که سنگین یا با Wettability کم هستند، در این ناحیه به شکل یک مخروط ته‌نشین می‌شوند (Coning). فقط سطح این مخروط با Medium در تماس است؛ بنابراین سرعت انحلال افت می‌کند و پروفایل صاف می‌شود، در حالی که ماده مؤثره به‌طور کامل در قرص وجود دارد.",
    ),
    causes: [
      bi(
        "Hydrodynamic dead zone under the Paddle, aggravated by a low rotation speed for this particle size and density.",
        "ناحیه مرده هیدرودینامیکی زیر Paddle که با سرعت چرخش پایین نسبت به اندازه ذره و دانسیته فرمولاسیون تشدید می‌شود.",
      ),
      bi(
        "Dense, insoluble Excipients (for example Dibasic calcium phosphate) or a high level of hydrophobic Lubricant that slows wetting of the granules.",
        "Excipientهای سنگین و نامحلول (مثلاً Dibasic calcium phosphate) یا مقدار زیاد Lubricant آب‌گریز که Wetting گرانول‌ها را کند می‌کند.",
      ),
      bi(
        "Apparatus outside its mechanical limits: Paddle height (25 ± 2 mm above the Vessel bottom), shaft centring, wobble or a damaged Vessel.",
        "خروج دستگاه از حدود مکانیکی: ارتفاع Paddle (25 ± 2 mm از کف Vessel)، هم‌محوری شفت، Wobble یا Vessel آسیب‌دیده.",
      ),
      bi(
        "Air bubbles from a Medium that was not deaerated, adhering to the particles and the Vessel wall.",
        "حباب‌های هوای Medium هوازدایی‌نشده که به ذرات و دیواره Vessel می‌چسبند.",
      ),
    ],
    checks: [
      bi(
        "Watch the Vessel bottom throughout the run: a mound of particles under the Paddle confirms Coning.",
        "کف Vessel را در تمام طول آزمون مشاهده کنید؛ تپه‌ای از ذرات زیر Paddle، Coning را تأیید می‌کند.",
      ),
      bi(
        "Add an infinity point (for example 250 rpm for 15 to 30 min): near-complete recovery separates a hydrodynamic problem from a real Assay shortfall.",
        "یک Infinity point اضافه کنید (مثلاً 250 rpm به مدت 15 تا 30 min)؛ بازیابی نزدیک به کامل، مشکل هیدرودینامیکی را از کمبود واقعی Assay جدا می‌کند.",
      ),
      bi(
        "Mechanical qualification of the apparatus against USP <711> and the Medium deaeration record.",
        "Mechanical qualification دستگاه طبق USP <711> و سابقه هوازدایی Medium.",
      ),
      bi(
        "Sink conditions: drug solubility in the Medium against the dose (usually at least three times the volume needed to dissolve the dose).",
        "شرایط Sink: حلالیت دارو در Medium نسبت به دوز (معمولاً حجم Medium دست‌کم سه برابر حجم لازم برای حل کردن دوز).",
      ),
    ],
    actions: [
      bi(
        "Change the method (75 rpm, Apparatus 1 or a Peak vessel) only with data showing it is still discriminating, and through change control and, for a registered method, a regulatory variation.",
        "تغییر Method به 75 rpm، Apparatus 1 یا Peak vessel فقط با داده‌ای که نشان دهد روش همچنان Discriminating است، از مسیر Change control و برای روش ثبت‌شده، با Variation رگولاتوری.",
      ),
      bi(
        "In development, reduce the dense insoluble filler or improve wetting (a Superdisintegrant or a Surfactant).",
        "در مرحله توسعه، کاهش پرکننده سنگین نامحلول یا بهبود Wetting (Superdisintegrant یا Surfactant).",
      ),
      bi(
        "Prevention: write visual observation of the Vessel into the dissolution SOP and keep the apparatus on a fixed mechanical calibration schedule.",
        "پیشگیری: ثبت مشاهده چشمی Vessel در SOP آزمون Dissolution و کالیبراسیون مکانیکی دوره‌ای دستگاه.",
      ),
    ],
    refs: "USP <711>, USP <1092>",
    more: { path: "free-handbooks", label: bi("Dissolution handbook", "هندبوک Dissolution") },
  },
  {
    id: "capping",
    area: bi("Production · Compression", "تولید · پرس قرص"),
    title: bi("Tablets cap after compression", "قرص‌ها پس از پرس Capping می‌شوند"),
    symptom: bi(
      "The upper crown of the tablet separates horizontally as a cap, at ejection, during dedusting or in the Friability test.",
      "تاج بالایی قرص به‌صورت افقی و به شکل یک کلاهک جدا می‌شود؛ هنگام خروج از Die، در Deduster یا در آزمون Friability.",
    ),
    mechanism: bi(
      "On decompression and ejection the compact recovers elastically. If the stored elastic energy, together with air trapped and compressed in the pores, exceeds the bonding strength between particles, a crack forms parallel to the punch face, usually at the band between the crown and the land.",
      "قرص هنگام Decompression و Ejection به‌صورت الاستیک بازگشت می‌کند. اگر انرژی الاستیک ذخیره‌شده، همراه با هوای محبوس و فشرده‌شده در منافذ، از استحکام پیوند بین ذرات بیشتر باشد، شکافی موازی با سطح Punch ایجاد می‌شود؛ معمولاً در محل اتصال تاج به لبه قرص.",
    ),
    causes: [
      bi(
        "High turret speed and short dwell time, so air cannot escape and plastic deformation is incomplete.",
        "سرعت بالای Turret و Dwell time کوتاه؛ هوا فرصت خروج ندارد و تغییر شکل پلاستیک کامل نمی‌شود.",
      ),
      bi(
        "Granules dried below the validated LOD range (water acts as a plasticiser and helps bonding) or a high Fines fraction.",
        "گرانول خشک‌شده تا زیر محدوده صحه‌گذاری‌شده LOD (آب نقش Plasticizer دارد و به پیوند کمک می‌کند) یا درصد بالای Fines.",
      ),
      bi(
        "A formulation with a high elastic component (for example a high-dose API such as paracetamol, or a lot of starch) and too little Binder.",
        "فرمولاسیون با جزء الاستیک زیاد (مثلاً API پردوز مانند Paracetamol یا نشاسته زیاد) و Binder ناکافی.",
      ),
      bi(
        "Excessive main compression force, deep-concave tooling, or a worn Die with a ring that resists ejection.",
        "نیروی Main compression بیش از حد، Punch با تقعر عمیق یا Die فرسوده با حلقه سایش که در برابر Ejection مقاومت می‌کند.",
      ),
    ],
    checks: [
      bi("Granule LOD against the validated range, and the time the granules have been held.", "LOD گرانول در مقایسه با محدوده صحه‌گذاری‌شده و مدت نگهداری گرانول."),
      bi(
        "Particle size distribution by sieve analysis: the Fines fraction against batches that compressed well.",
        "توزیع اندازه ذره با Sieve analysis؛ درصد Fines در مقایسه با بچ‌هایی که بدون مشکل پرس شده‌اند.",
      ),
      bi(
        "Pre-compression and main compression force, turret speed and ejection force from the press records.",
        "نیروی Pre-compression و Main compression، سرعت Turret و Ejection force از سوابق دستگاه.",
      ),
      bi("Tooling inspection: Die bore wear rings and punch tip condition.", "بازرسی Tooling: حلقه سایش در دیواره Die و وضعیت نوک Punch."),
      bi(
        "Tablet tensile strength against compression force (compactability profile) to see whether more force helps or makes it worse.",
        "Tensile strength قرص در برابر نیروی پرس (پروفایل Compactability) تا معلوم شود افزایش نیرو کمک می‌کند یا وضع را بدتر می‌کند.",
      ),
    ],
    actions: [
      bi(
        "Raise Pre-compression and lower turret speed to lengthen dwell time; consider tapered Dies.",
        "افزایش Pre-compression و کاهش سرعت Turret برای طولانی‌تر شدن Dwell time؛ بررسی استفاده از Tapered die.",
      ),
      bi(
        "Bring granule moisture back into its range and control the Fines fraction; in development, strengthen the Binder or add a plastic Excipient such as MCC.",
        "بازگرداندن رطوبت گرانول به محدوده آن و کنترل Fines؛ در مرحله توسعه، تقویت Binder یا افزودن Excipient پلاستیک مانند MCC.",
      ),
      bi(
        "Prevention: a tooling inspection and replacement programme, and LOD and PSD limits on the granules before compression.",
        "پیشگیری: برنامه بازرسی و تعویض Tooling، و حدود LOD و PSD برای گرانول پیش از پرس.",
      ),
    ],
    refs: "USP <1062>, USP <1216>",
    more: { path: "formulation", label: bi("Formulation section", "بخش فرمولاسیون") },
  },
  {
    id: "sticking",
    area: bi("Production · Compression", "تولید · پرس قرص"),
    title: bi("Powder sticks to the punch faces", "پودر به سطح Punch می‌چسبد"),
    symptom: bi(
      "A film of powder builds up on the punch faces over the run; the tablet surface turns dull or pitted (Sticking) and the embossing fills in, often inside letters such as A, B, O and P (Picking).",
      "لایه‌ای از پودر در طول پرس روی سطح Punch جمع می‌شود؛ سطح قرص مات یا حفره‌دار می‌شود (Sticking) و حروف حک‌شده پر می‌شوند، اغلب در فضای داخلی حروفی مانند A، B، O و P (Picking).",
    ),
    mechanism: bi(
      "Sticking happens when adhesion of the formulation to the punch steel is stronger than cohesion inside the tablet. Water forms capillary bridges between particles and the metal, a low-melting API softens with the frictional heat of the run, and fine embossing detail concentrates stress where the compact is weakest. The film grows with each cycle, so the defect usually worsens with run time.",
      "Sticking زمانی رخ می‌دهد که چسبندگی فرمولاسیون به فولاد Punch از پیوستگی داخلی قرص (Cohesion) بیشتر باشد. آب بین ذرات و سطح فلز Capillary bridge تشکیل می‌دهد، API با نقطه ذوب پایین با گرمای ناشی از اصطکاک نرم می‌شود و جزئیات ظریف Embossing تنش را در ضعیف‌ترین نقطه قرص متمرکز می‌کند. این لایه در هر سیکل رشد می‌کند؛ به همین دلیل نقص معمولاً با گذشت زمان پرس بدتر می‌شود.",
    ),
    causes: [
      bi("Blend moisture or room relative humidity above the limit set for the product.", "رطوبت مخلوط یا رطوبت نسبی اتاق بالاتر از حد تعیین‌شده برای محصول."),
      bi(
        "A low-melting API (for example Ibuprofen, which melts at about 75 to 78 °C) softening as the punches warm up.",
        "API با نقطه ذوب پایین (مثلاً Ibuprofen با نقطه ذوب حدود 75 تا 78 °C) که با گرم شدن Punch نرم می‌شود.",
      ),
      bi(
        "Too little Lubricant or too short a blend with Magnesium stearate (usually 0.5 to 1% w/w), or no Glidant or antiadherent.",
        "مقدار ناکافی Lubricant یا زمان کوتاه اختلاط با Magnesium stearate (معمولاً 0.5 تا 1% w/w)، یا نبود Glidant و Antiadherent.",
      ),
      bi(
        "Punch faces scratched, worn or without a suitable coating (chrome plating or a PVD coating such as CrN).",
        "سطح Punch خراشیده، فرسوده یا بدون پوشش مناسب (Chrome plating یا پوشش PVD مانند CrN).",
      ),
      bi(
        "Embossing design: too deep, narrow stroke angles or enclosed islands; and a low compression force that leaves the tablet weak.",
        "طراحی Embossing: عمق زیاد، زاویه باریک خطوط یا جزیره‌های بسته؛ و نیروی پرس پایین که قرص را ضعیف می‌گذارد.",
      ),
    ],
    checks: [
      bi("Blend LOD and the room's temperature and RH at the time of compression.", "LOD مخلوط و دما و RH اتاق در زمان پرس."),
      bi(
        "When the defect starts: from the first tablets (formulation or tooling) or after some time (heat and film build-up).",
        "زمان شروع نقص: از اولین قرص‌ها (فرمولاسیون یا Tooling) یا پس از مدتی (گرما و تجمع لایه).",
      ),
      bi("Lubricant level and blending time against the Batch record.", "مقدار Lubricant و زمان اختلاط در مقایسه با Batch record."),
      bi(
        "Punch faces under magnification, and punch temperature over the run.",
        "سطح Punch زیر بزرگ‌نمایی و دمای Punch در طول پرس.",
      ),
      bi("Effect of a moderate rise in compression force on the defect.", "اثر افزایش متوسط نیروی پرس روی نقص."),
    ],
    actions: [
      bi(
        "Polish or coat the punches, and redesign the embossing: shallower, wider strokes and no enclosed islands.",
        "پولیش یا پوشش‌دهی Punch و بازطراحی Embossing: عمق کمتر، خطوط پهن‌تر و بدون جزیره بسته.",
      ),
      bi(
        "Control room RH and blend moisture; in development, adjust the Lubricant or add an antiadherent such as Talc or Colloidal silicon dioxide, and for a low-melting API an adsorbent with a lower press speed.",
        "کنترل RH اتاق و رطوبت مخلوط؛ در مرحله توسعه، تنظیم Lubricant یا افزودن Antiadherent مانند Talc یا Colloidal silicon dioxide، و برای API با نقطه ذوب پایین، افزودن Adsorbent همراه با کاهش سرعت پرس.",
      ),
      bi(
        "Prevention: an RH limit in the compression area, and punch face inspection at set intervals during the run.",
        "پیشگیری: حد RH برای اتاق پرس و بازرسی سطح Punch در فواصل معین در طول پرس.",
      ),
    ],
    refs: "USP <1062>",
    more: { path: "formulation", label: bi("Formulation section", "بخش فرمولاسیون") },
  },
  {
    id: "tailing",
    area: bi("QC · HPLC", "QC · HPLC"),
    title: bi("Peak tailing fails system suitability", "Tailing پیک، System suitability را رد می‌کند"),
    symptom: bi(
      "The Tailing factor of the main peak (T = W0.05 / 2f) exceeds the method limit, often 2.0, and integration of the tail becomes uncertain.",
      "Tailing factor پیک اصلی (T = W0.05 / 2f) از حد Method، اغلب 2.0، بالاتر می‌رود و Integration دنباله پیک قابل اطمینان نیست.",
    ),
    mechanism: bi(
      "Tailing means part of the analyte is held back by a second, slower retention process. In reversed phase this is usually ion exchange between a protonated basic analyte and ionised residual silanols (Si–O⁻) on the silica; it can also be physical, from a void or extra-column volume that disperses the band after it leaves the column bed.",
      "Tailing یعنی بخشی از آنالیت با یک سازوکار بازداری دوم و کندتر عقب نگه داشته می‌شود. در Reversed phase این سازوکار معمولاً تبادل یونی بین آنالیت بازی پروتونه و Silanolهای باقی‌مانده یونیزه (Si–O⁻) روی سیلیکاست. علت می‌تواند فیزیکی هم باشد؛ Void یا Extra-column volume که باند را پس از خروج از بستر ستون پخش می‌کند.",
    ),
    causes: [
      bi("Basic analytes interacting with free silanols or trace metals in the stationary phase.", "برهم‌کنش آنالیت‌های بازی با Silanolهای آزاد یا ناخالصی فلزی فاز ساکن."),
      bi(
        "Mobile-phase pH close to the analyte's pKa, so two ionisation states coexist; or too little buffer capacity.",
        "pH فاز متحرک نزدیک به pKa آنالیت که دو حالت یونیزاسیون را هم‌زمان ایجاد می‌کند؛ یا ظرفیت بافری ناکافی.",
      ),
      bi("Column overload: too much analyte mass injected.", "Column overload؛ جرم بیش از حد آنالیت در تزریق."),
      bi(
        "A void at the column inlet, a partly blocked frit, or dead volume in the fittings and tubing.",
        "Void در ورودی ستون، Frit نیمه‌مسدود یا Dead volume در اتصالات و لوله‌ها.",
      ),
    ],
    checks: [
      bi(
        "Inject a neutral compound: if it tails too, the cause is physical (column bed or fittings); if only the base tails, it is chemical.",
        "یک ترکیب خنثی تزریق کنید؛ اگر آن هم Tailing دارد، علت فیزیکی است (بستر ستون یا اتصالات). اگر فقط ترکیب بازی Tailing دارد، علت شیمیایی است.",
      ),
      bi("Inject half the concentration: a clear fall in tailing points to overload.", "نصف غلظت را تزریق کنید؛ کاهش محسوس Tailing نشانه Overload است."),
      bi("The column's test mix against its certificate, and the column use log.", "تزریق Test mix ستون در مقایسه با گواهی آن و بررسی سابقه مصرف ستون."),
      bi(
        "Buffer pH measured before adding the organic modifier, about 2 units from the pKa where the method allows.",
        "pH بافر اندازه‌گیری‌شده پیش از افزودن حلال آلی؛ در صورت اجازه Method، حدود 2 واحد دورتر از pKa.",
      ),
    ],
    actions: [
      bi(
        "Replace the guard column or column, or fix the fittings; change pH, buffer concentration or column temperature only within the allowable adjustments of USP <621>.",
        "تعویض Guard column یا ستون، یا اصلاح اتصالات؛ تغییر pH، غلظت بافر یا دمای ستون فقط در محدوده Allowable adjustments در USP <621>.",
      ),
      bi(
        "Any change beyond those adjustments, such as a base-deactivated or hybrid column, needs revalidation.",
        "هر تغییر خارج از این محدوده، مانند ستون Base-deactivated یا Hybrid، نیاز به صحه‌گذاری مجدد دارد.",
      ),
      bi(
        "Prevention: a column log with a performance trend (T, N, back-pressure) and a guard column for samples with heavy matrices.",
        "پیشگیری: Column log با روند عملکرد شامل T، N و فشار، و استفاده از Guard column برای نمونه‌های با ماتریکس سنگین.",
      ),
    ],
    refs: "USP <621>, Ph. Eur. 2.2.46",
    more: { path: "qc", label: bi("QC section", "بخش QC") },
  },
  {
    id: "rt-drift",
    area: bi("QC · HPLC", "QC · HPLC"),
    title: bi("Retention times drift through the sequence", "زمان بازداری در طول Sequence جابه‌جا می‌شود"),
    symptom: bi(
      "Retention times move steadily earlier or later from one injection to the next, and peaks start to fall outside their identification windows.",
      "زمان بازداری از یک تزریق به تزریق بعد به‌تدریج زودتر یا دیرتر می‌شود و پیک‌ها از پنجره شناسایی خود خارج می‌شوند.",
    ),
    mechanism: bi(
      "Retention time is t0 (1 + k). If every peak and the unretained marker t0 shift by the same proportion, the flow rate has changed. If t0 stays constant but k changes, the chromatography itself has changed: temperature (often about 1 to 2% in retention per °C in reversed phase), mobile-phase composition or the stationary phase.",
      "زمان بازداری برابر t0 (1 + k) است. اگر همه پیک‌ها و نشانگر بدون بازداری (t0) به یک نسبت جابه‌جا شوند، سرعت جریان تغییر کرده است. اگر t0 ثابت بماند ولی k تغییر کند، خود کروماتوگرافی تغییر کرده است: دما (در Reversed phase اغلب حدود 1 تا 2% تغییر در بازداری به ازای هر °C)، ترکیب فاز متحرک یا فاز ساکن.",
    ),
    causes: [
      bi("Column temperature not controlled, or the room temperature changing over the day.", "کنترل نشدن دمای ستون یا تغییر دمای اتاق در طول روز."),
      bi(
        "Mobile phase changing: evaporation of the organic component, poor on-line proportioning or incomplete degassing.",
        "تغییر فاز متحرک؛ تبخیر جزء آلی، Proportioning نامناسب در اختلاط On-line یا Degassing ناقص.",
      ),
      bi(
        "Too short an equilibration, especially with ion-pair reagents or between gradient runs.",
        "Equilibration کوتاه، به‌ویژه با معرف‌های Ion-pair یا بین اجراهای Gradient.",
      ),
      bi("Unstable flow from a small leak, a worn pump seal or a sticking check valve.", "جریان ناپایدار به دلیل نشتی جزئی، Seal فرسوده پمپ یا Check valve گیرکرده."),
      bi("Stationary-phase degradation: hydrolysis of the bonded phase at low pH or silica dissolution at high pH.", "تخریب فاز ساکن؛ هیدرولیز فاز پیوندی در pH پایین یا انحلال سیلیکا در pH بالا."),
    ],
    checks: [
      bi("Compare t0 and the analyte shift: proportional (flow) or k only (chemistry).", "مقایسه جابه‌جایی t0 و آنالیت: متناسب (جریان) یا فقط k (شیمی)."),
      bi("Column oven set point and its stability over the sequence.", "Set point در Column oven و پایداری آن در طول Sequence."),
      bi("Mobile-phase preparation record: prepared by weight or volume, its age and whether the reservoir was covered.", "سابقه تهیه فاز متحرک: وزنی یا حجمی، زمان تهیه و بسته بودن مخزن."),
      bi(
        "Pressure trace for ripple or a slow fall, every fitting for leaks, and a flow-rate check (timed collection).",
        "نمودار فشار از نظر نوسان یا افت تدریجی، همه اتصالات از نظر نشتی و کنترل سرعت جریان با جمع‌آوری زمان‌دار.",
      ),
    ],
    actions: [
      bi("Repair the leak, seal or check valve, and repeat the affected part of the sequence once system suitability passes.", "رفع نشتی، Seal یا Check valve و تکرار بخش متأثر Sequence پس از قبولی System suitability."),
      bi(
        "Use a column oven, freshly prepared covered mobile phase and a set equilibration time in the method.",
        "استفاده از Column oven، فاز متحرک تازه با مخزن بسته و زمان Equilibration مشخص در Method.",
      ),
      bi(
        "Prevention: preventive maintenance of the pump under the instrument qualification programme, and trending of retention time in system suitability.",
        "پیشگیری: نگهداری پیشگیرانه پمپ در قالب برنامه Instrument qualification و روندگیری زمان بازداری در System suitability.",
      ),
    ],
    refs: "USP <621>, USP <1058>",
    more: { path: "qc", label: bi("QC section", "بخش QC") },
  },
  {
    id: "oos-assay",
    area: bi("QC · QA", "QC · QA"),
    title: bi("An Assay result is out of specification", "نتیجه Assay خارج از Specification است"),
    symptom: bi(
      "A release Assay result falls below the specification limit, while the in-process results and the other tests of the batch look normal.",
      "یک نتیجه Assay آزادسازی کمتر از حد Specification است، در حالی که نتایج حین فرایند و سایر آزمون‌های بچ عادی به نظر می‌رسند.",
    ),
    mechanism: bi(
      "An OOS result is valid until a documented investigation proves otherwise. The investigation first looks for an assignable laboratory error (Phase I); only if none is found does it extend to manufacturing (Phase II). Retesting or averaging until a passing result appears (testing into compliance) is not allowed.",
      "نتیجه OOS تا زمانی که یک تحقیق مستند خلاف آن را ثابت نکند، معتبر است. تحقیق ابتدا به دنبال خطای آزمایشگاهی قابل انتساب است (Phase I) و فقط اگر چنین خطایی پیدا نشود، به تولید گسترش می‌یابد (Phase II). تکرار آزمون یا میانگین‌گیری تا رسیدن به نتیجه قبول (Testing into compliance) مجاز نیست.",
    ),
    causes: [
      bi(
        "Laboratory error: dilution, standard preparation or its potency, weighing, or integration.",
        "خطای آزمایشگاهی: رقیق‌سازی، تهیه Standard یا Potency آن، توزین یا Integration.",
      ),
      bi("Instrument or method: system suitability at its limit, or solution stability exceeded.", "دستگاه یا روش: System suitability در مرز حد یا گذشتن از زمان پایداری محلول."),
      bi("A sample that does not represent the batch: sampling point, container or handling.", "نمونه‌ای که نماینده بچ نیست: محل نمونه‌برداری، ظرف یا نحوه جابه‌جایی."),
      bi(
        "A real product failure: dispensing error, segregation, degradation or a process deviation.",
        "مشکل واقعی محصول: خطای توزین مواد اولیه، Segregation، تخریب یا Deviation فرایندی.",
      ),
    ],
    checks: [
      bi(
        "Phase I with the analyst and supervisor before any retest; keep all solutions, preparations and raw data.",
        "Phase I با حضور آنالیست و سرپرست پیش از هر آزمون مجدد؛ نگهداری همه محلول‌ها، نمونه‌های آماده‌شده و داده‌های خام.",
      ),
      bi(
        "Calculations, chromatograms and integration, the standard's certificate and potency, balance and instrument logs.",
        "محاسبات، کروماتوگرام‌ها و Integration، گواهی و Potency استاندارد، و دفتر ترازو و دستگاه.",
      ),
      bi(
        "Hypothesis tests set out in advance in the SOP, such as re-injecting the same solution, kept separate from a retest.",
        "آزمون فرضیه‌هایی که از پیش در SOP تعریف شده‌اند، مانند تزریق مجدد همان محلول، جدا از آزمون مجدد.",
      ),
      bi(
        "With no assignable lab cause, Phase II: Batch record, deviations, yield and other batches that may be affected.",
        "در نبود علت آزمایشگاهی، Phase II: بررسی Batch record، Deviationها، Yield و سایر بچ‌هایی که ممکن است متأثر باشند.",
      ),
    ],
    actions: [
      bi(
        "Invalidate the result only with a confirmed lab cause; otherwise the batch decision rests on the OOS result.",
        "ابطال نتیجه فقط با علت آزمایشگاهی تأییدشده؛ در غیر این صورت تصمیم درباره بچ بر پایه نتیجه OOS گرفته می‌شود.",
      ),
      bi(
        "Find the root cause with a structured tool (Ishikawa, 5 Whys) and record the CAPA in the quality system.",
        "تعیین علت ریشه‌ای با ابزار ساختاریافته مانند Ishikawa یا 5 Whys و ثبت CAPA در سیستم کیفیت.",
      ),
      bi(
        "Prevention: trending of OOS and OOT results, and analyst training based on the causes found.",
        "پیشگیری: روندگیری نتایج OOS و OOT و آموزش آنالیست‌ها بر اساس علت‌های یافته‌شده.",
      ),
    ],
    refs: "FDA Guidance: Investigating OOS Test Results (Rev. 1, 2022), EU GMP Part I Chapter 6",
    more: { path: "qa", label: bi("QA section", "بخش QA") },
  },
  {
    id: "uniformity",
    area: bi("Production · Blending", "تولید · اختلاط"),
    title: bi("Content uniformity fails", "Content uniformity رد می‌شود"),
    symptom: bi(
      "The Acceptance Value exceeds L1 = 15.0 for 10 units, or the individual results spread widely even though the mean Assay is acceptable.",
      "Acceptance Value برای 10 واحد از L1 = 15.0 بیشتر است یا نتایج تک‌تک واحدها پراکندگی زیادی دارند، با اینکه میانگین Assay قابل قبول است.",
    ),
    mechanism: bi(
      "A blend can be uniform in the blender and still segregate afterwards. Differences in particle size, density and shape let fine particles sift through coarse ones, fluidise or dust during transfer and hopper discharge. A low-dose API that is cohesive or electrostatic can also form agglomerates or adhere to equipment walls.",
      "مخلوط می‌تواند در Blender یکنواخت باشد و پس از آن دچار Segregation شود. اختلاف اندازه ذره، دانسیته و شکل باعث می‌شود ذرات ریز از لابه‌لای ذرات درشت عبور کنند (Sifting)، یا هنگام انتقال و تخلیه Hopper سیال یا معلق شوند (Fluidization و Dusting). API کم‌دوزِ چسبنده یا دارای بار الکتریسیته ساکن هم می‌تواند Agglomerate تشکیل دهد یا به دیواره تجهیزات بچسبد.",
    ),
    causes: [
      bi(
        "Large difference in particle size or density between the API and the main Excipients.",
        "اختلاف زیاد اندازه ذره یا دانسیته بین API و Excipientهای اصلی.",
      ),
      bi(
        "A low-dose API never pre-dispersed (no Geometric dilution or Pre-blend), or agglomerates not broken up.",
        "API کم‌دوزی که پیش‌پخش نشده است (بدون Geometric dilution یا Pre-blend) یا Agglomerateهای شکسته‌نشده.",
      ),
      bi("Funnel flow in the hopper or IBC, emptying the centre first.", "Funnel flow در Hopper یا IBC که ابتدا مرکز آن را خالی می‌کند."),
      bi("Long free-fall drops and vibration during transfer.", "ارتفاع سقوط آزاد زیاد و لرزش هنگام انتقال."),
    ],
    checks: [
      bi(
        "Blend uniformity with a sample thief (sample about 1 to 3 times the unit weight) against the stratified tablet results.",
        "Blend uniformity با Sample thief (نمونه حدود 1 تا 3 برابر وزن واحد) در مقایسه با نتایج لایه‌ای (Stratified) قرص‌ها.",
      ),
      bi(
        "Blend uniform but tablets not: the problem is downstream (transfer, hopper, press).",
        "اگر مخلوط یکنواخت است ولی قرص‌ها نه، مشکل در مراحل بعد است: انتقال، Hopper یا پرس.",
      ),
      bi(
        "Plot results against run time: high or low results at the start or end point to segregation.",
        "رسم نتایج در برابر زمان پرس؛ نتایج بالا یا پایین در ابتدا یا انتها نشانه Segregation است.",
      ),
      bi(
        "Dose per unit weight (Assay ÷ tablet weight): if it is constant, the spread comes from weight variation, not mixing.",
        "دوز به ازای وزن (Assay تقسیم بر وزن قرص)؛ اگر ثابت باشد، پراکندگی از Weight variation است، نه از اختلاط.",
      ),
      bi("PSD of the API lot against the main Excipients.", "PSD لات API در مقایسه با Excipientهای اصلی."),
    ],
    actions: [
      bi(
        "Geometric dilution or a Pre-blend for low-dose APIs, milling or delumping of the API, and fewer and shorter drops.",
        "Geometric dilution یا Pre-blend برای API کم‌دوز، آسیاب یا De-lumping ماده مؤثره و کاهش تعداد و ارتفاع سقوط‌ها.",
      ),
      bi(
        "In development, Wet granulation to lock the API in place, or matching the PSD of the Excipients.",
        "در مرحله توسعه، Wet granulation برای قفل کردن API در گرانول یا هم‌اندازه کردن PSD با Excipientها.",
      ),
      bi(
        "Prevention: mass-flow hopper design, a PSD specification for the API, and blend monitoring (for example NIR).",
        "پیشگیری: طراحی Hopper با Mass flow، Specification برای PSD ماده مؤثره و پایش اختلاط (مثلاً با NIR).",
      ),
    ],
    refs: "USP <905>, Ph. Eur. 2.9.40",
    more: { path: "formulation", label: bi("Formulation section", "بخش فرمولاسیون") },
  },
  {
    id: "crosslinking",
    area: bi("QC · Stability", "QC · پایداری"),
    title: bi("Capsules dissolve slower on stability", "Dissolution کپسول در پایداری کند می‌شود"),
    symptom: bi(
      "Hard gelatin capsules pass at release but fail Dissolution at the accelerated (40 °C / 75% RH) time points; the shell is seen to swell without opening, with a thin film around the contents (Pellicle).",
      "کپسول‌های سخت ژلاتینی در آزادسازی قبول‌اند ولی در نقاط Accelerated (40 °C / 75% RH) در Dissolution رد می‌شوند؛ پوسته بدون باز شدن متورم می‌شود و یک لایه نازک دور محتوا دیده می‌شود (Pellicle).",
    ),
    mechanism: bi(
      "Gelatin cross-links when aldehydes, chiefly formaldehyde and furfural, react with the amino groups of lysine in its chains. The resulting network is insoluble in the Medium, so the shell does not rupture. Heat, humidity and light speed the reaction. Proteolytic enzymes can digest the network, which is why the dissolution chapter allows them for gelatin capsules.",
      "ژلاتین زمانی Cross-link می‌شود که آلدهیدها، به‌ویژه Formaldehyde و Furfural، با گروه‌های آمین لیزین در زنجیره‌های آن واکنش دهند. شبکه حاصل در Medium نامحلول است و پوسته باز نمی‌شود. گرما، رطوبت و نور این واکنش را تسریع می‌کنند. آنزیم‌های پروتئولیتیک این شبکه را هضم می‌کنند؛ به همین دلیل فصل Dissolution استفاده از آن‌ها را برای کپسول ژلاتینی مجاز می‌داند.",
    ),
    causes: [
      bi(
        "Aldehydes from Excipients that degrade by oxidation, such as PEG or Polysorbate, or from impurities in starch.",
        "آلدهید حاصل از Excipientهایی که با اکسیداسیون تخریب می‌شوند، مانند PEG یا Polysorbate، یا از ناخالصی‌های نشاسته.",
      ),
      bi(
        "Aldehydes from packaging components, for example a rayon coil in the bottle or printing inks.",
        "آلدهید ناشی از اجزای بسته‌بندی، مثلاً Rayon coil داخل بطری یا جوهر چاپ.",
      ),
      bi("High temperature and humidity, and packaging with too little moisture protection.", "دما و رطوبت بالا و بسته‌بندی با محافظت ناکافی در برابر رطوبت."),
    ],
    checks: [
      bi(
        "Repeat with enzyme in the Medium as USP <711> allows: Pepsin at pH ≤ 4.0, Papain or Bromelain between 4.0 and 6.8, Pancreatin at pH ≥ 6.8. Passing then points to cross-linking.",
        "تکرار آزمون با آنزیم در Medium طبق اجازه USP <711>: Pepsin در pH ≤ 4.0، Papain یا Bromelain بین 4.0 و 6.8 و Pancreatin در pH ≥ 6.8. قبولی در این حالت نشانه Cross-linking است.",
      ),
      bi("Peroxide and aldehyde content of the fill Excipients and the lots used.", "مقدار Peroxide و آلدهید Excipientهای پرکننده و لات‌های مصرفی."),
      bi("Every packaging component, including coil, desiccant and liner.", "همه اجزای بسته‌بندی، از جمله Coil، Desiccant و Liner."),
      bi("Visual check of the capsules in the Vessel for a pellicle.", "مشاهده کپسول‌ها در Vessel از نظر وجود Pellicle."),
    ],
    actions: [
      bi(
        "Remove the aldehyde source: a low-peroxide Excipient grade, or a packaging component without rayon.",
        "حذف منبع آلدهید: گرید Excipient با Peroxide پایین یا جزء بسته‌بندی بدون Rayon.",
      ),
      bi(
        "In development, consider HPMC capsules, which do not cross-link in this way.",
        "در مرحله توسعه، بررسی کپسول HPMC که به این شکل Cross-link نمی‌شود.",
      ),
      bi(
        "Prevention: peroxide and aldehyde limits in the Excipient specifications, and packaging with enough moisture protection (Alu-Alu blister or desiccant).",
        "پیشگیری: حد Peroxide و آلدهید در Specification مواد جانبی و بسته‌بندی با محافظت کافی در برابر رطوبت (بلیستر Alu-Alu یا Desiccant).",
      ),
    ],
    refs: "USP <711>, ICH Q1A(R2)",
    more: { path: "free-handbooks", label: bi("Dissolution handbook", "هندبوک Dissolution") },
  },
  {
    id: "karl-fischer",
    area: bi("QC · Water content", "QC · تعیین آب"),
    title: bi("Karl Fischer results are high or erratic", "نتایج Karl Fischer بالا یا نامنظم است"),
    symptom: bi(
      "Water content scatters between replicates, keeps rising without any change in the sample, or the endpoint is slow and drifting.",
      "مقدار آب بین تکرارها پراکنده است، بدون هیچ تغییری در نمونه مدام بالا می‌رود یا Endpoint کند و ناپایدار است.",
    ),
    mechanism: bi(
      "Karl Fischer is a selective titration of water with iodine and sulfur dioxide in an alcohol, with a base as buffer, and works best at about pH 5 to 7. Anything else that consumes or forms iodine or water biases the result: moisture leaking into the cell, ketones and aldehydes that form ketals and acetals with methanol and release water, or reducing agents such as ascorbic acid that consume iodine.",
      "Karl Fischer تیتراسیون انتخابی آب با ید و Sulfur dioxide در الکل، همراه با یک باز به عنوان بافر است و در pH حدود 5 تا 7 بهترین عملکرد را دارد. هر چیز دیگری که ید یا آب مصرف یا تولید کند، نتیجه را منحرف می‌کند: ورود رطوبت به سل، کتون‌ها و آلدهیدهایی که با متانول Ketal و Acetal تشکیل می‌دهند و آب آزاد می‌کنند، یا عوامل احیاکننده مانند Ascorbic acid که ید مصرف می‌کنند.",
    ),
    causes: [
      bi("Atmospheric moisture entering through a worn septum, a leaking seal or exhausted desiccant; the sign is a high drift.", "ورود رطوبت هوا از Septum فرسوده، درزبندی نامناسب یا Desiccant اشباع؛ نشانه آن Drift بالاست."),
      bi("A sample that does not dissolve in the working medium and releases its water slowly.", "نمونه‌ای که در محیط تیتراسیون حل نمی‌شود و آب خود را آهسته آزاد می‌کند."),
      bi("Side reactions: ketones, aldehydes or reducing agents in the sample.", "واکنش‌های جانبی: کتون، آلدهید یا عوامل احیاکننده در نمونه."),
      bi("Exhausted working medium or a titer that has changed since it was last determined.", "اشباع شدن محیط تیتراسیون یا تغییر Titer نسبت به آخرین تعیین."),
    ],
    checks: [
      bi("Drift before each determination, within the limit set in the SOP and stable.", "Drift پیش از هر اندازه‌گیری، در حد تعیین‌شده در SOP و پایدار."),
      bi(
        "Titer against Sodium tartrate dihydrate (15.66% water) or a certified water standard.",
        "تعیین Titer با Sodium tartrate dihydrate (15.66% آب) یا Water standard گواهی‌دار.",
      ),
      bi("Recovery of a known water spike in the sample matrix.", "Recovery مقدار مشخص آب افزوده‌شده به ماتریکس نمونه."),
      bi("Sample handling: weighing time and exposure of a hygroscopic sample to room air.", "نحوه کار با نمونه: زمان توزین و مواجهه نمونه رطوبت‌گیر با هوای اتاق."),
    ],
    actions: [
      bi("Replace the septum, seals and desiccant, and renew the working medium.", "تعویض Septum، درزبندی‌ها و Desiccant و تعویض محیط تیتراسیون."),
      bi(
        "For insoluble or reactive samples, a KF oven with the temperature chosen from a temperature ramp, or methanol-free reagents for ketones and aldehydes.",
        "برای نمونه‌های نامحلول یا واکنش‌پذیر، KF oven با دمای انتخاب‌شده از روی Temperature ramp، یا معرف بدون متانول برای کتون و آلدهید.",
      ),
      bi(
        "Prevention: a drift limit and titer frequency in the SOP, and method suitability for each new product matrix.",
        "پیشگیری: تعیین حد Drift و تناوب تعیین Titer در SOP و بررسی Method suitability برای هر ماتریکس جدید.",
      ),
    ],
    refs: "USP <921>, Ph. Eur. 2.5.12, Ph. Eur. 2.5.32",
    more: { path: "qc", label: bi("QC section", "بخش QC") },
  },
  {
    id: "orange-peel",
    area: bi("Production · Film coating", "تولید · روکش فیلمی"),
    title: bi("The film coat looks like orange peel", "سطح روکش شبیه پوست پرتقال است"),
    symptom: bi(
      "The coated surface is rough and dull, with a dimpled texture like orange peel, instead of smooth and glossy.",
      "سطح قرص روکش‌دار به‌جای صاف و براق، زبر و مات و با بافتی فرورفته شبیه پوست پرتقال است.",
    ),
    mechanism: bi(
      "A good film forms when droplets reach the tablet still fluid enough to spread, coalesce and level before the water evaporates. If the droplets are too large, too viscous or already partly dry on arrival, they set where they land and the surface keeps their shape.",
      "فیلم مناسب زمانی تشکیل می‌شود که قطره‌ها هنوز به اندازه کافی سیال به سطح قرص برسند تا پیش از تبخیر آب پخش شوند، به هم بپیوندند و سطح را صاف کنند (Leveling). اگر قطره‌ها بیش از حد درشت یا ویسکوز باشند یا هنگام رسیدن تا حدی خشک شده باشند، در همان محل برخورد ثابت می‌شوند و سطح شکل آن‌ها را حفظ می‌کند.",
    ),
    causes: [
      bi("A coating suspension with too high a viscosity or solids content to atomise well.", "سوسپانسیون روکش با Viscosity یا Solid content بالا که خوب Atomize نمی‌شود."),
      bi("Atomising air pressure too low, giving large droplets.", "فشار Atomizing air پایین که قطره‌های درشت می‌سازد."),
      bi(
        "Over-drying: inlet or exhaust temperature or airflow too high, so droplets partly dry before they spread (Spray drying).",
        "خشک شدن بیش از حد: دمای Inlet یا Exhaust یا جریان هوای بالا که قطره را پیش از پخش شدن تا حدی خشک می‌کند (Spray drying).",
      ),
      bi("Gun-to-bed distance too great, or the spray rate too low for the drying capacity.", "فاصله زیاد Spray gun تا بستر یا Spray rate پایین نسبت به ظرفیت خشک‌کردن."),
    ],
    checks: [
      bi("Viscosity and solids content of the suspension against the Batch record.", "Viscosity و Solid content سوسپانسیون در مقایسه با Batch record."),
      bi("Atomising and pattern air, spray rate and the gun-to-bed distance and angle.", "Atomizing air و Pattern air، Spray rate و فاصله و زاویه Spray gun تا بستر."),
      bi(
        "Inlet, exhaust and bed temperatures over the run (for aqueous HPMC coats the bed is often about 40 to 45 °C).",
        "دمای Inlet، Exhaust و بستر در طول فرایند (برای روکش آبی HPMC، دمای بستر اغلب حدود 40 تا 45 °C است).",
      ),
      bi("Spray pattern and nozzles for partial blockage.", "الگوی پاشش و نازل‌ها از نظر انسداد جزئی."),
    ],
    actions: [
      bi(
        "Lower the solids content or viscosity, raise atomising air, and bring the bed temperature and airflow back into range.",
        "کاهش Solid content یا Viscosity، افزایش Atomizing air و بازگرداندن دمای بستر و جریان هوا به محدوده.",
      ),
      bi("Reduce the gun-to-bed distance and balance the spray rate against drying.", "کاهش فاصله Spray gun تا بستر و تنظیم توازن Spray rate با ظرفیت خشک‌کردن."),
      bi(
        "Prevention: a defined operating range for the critical coating parameters and a viscosity check of each suspension before spraying.",
        "پیشگیری: تعریف محدوده عملیاتی برای پارامترهای بحرانی روکش و کنترل Viscosity هر سوسپانسیون پیش از پاشش.",
      ),
    ],
    refs: "USP <1151>, ICH Q8(R2)",
    more: { path: "formulation", label: bi("Formulation section", "بخش فرمولاسیون") },
  },
  {
    id: "cleaning",
    area: bi("QA · Cleaning validation", "QA · صحه‌گذاری نظافت"),
    title: bi("A swab result is above the cleaning limit", "نتیجه Swab بالاتر از حد نظافت است"),
    symptom: bi(
      "After a product changeover one swab location exceeds the acceptance limit for the previous product, while the equipment looks visually clean.",
      "پس از تعویض محصول، یک نقطه Swab از حد پذیرش محصول قبلی بالاتر است، در حالی که تجهیزات از نظر چشمی تمیز به نظر می‌رسند.",
    ),
    mechanism: bi(
      "The limit comes from a health-based exposure limit: MACO = PDE × MBS ÷ TDD of the next product, shared out over the product-contact surface area. Visual cleanliness is necessary but not enough; residue concentrates at hard-to-clean points, and the swab only reports what it recovers from the surface.",
      "حد پذیرش از حد مواجهه مبتنی بر سلامت به دست می‌آید: MACO = PDE × MBS ÷ TDD محصول بعدی، که بر سطح در تماس با محصول تقسیم می‌شود. تمیزی چشمی لازم است ولی کافی نیست؛ باقیمانده در نقاط سخت‌نظافت متمرکز می‌شود و Swab فقط مقداری را گزارش می‌کند که از سطح بازیابی می‌کند.",
    ),
    causes: [
      bi("A hard-to-clean location: gasket, valve, dead leg or a weld.", "نقطه سخت‌نظافت: Gasket، Valve، Dead leg یا محل جوش."),
      bi(
        "Cleaning parameters not followed: time, mechanical action, detergent concentration or temperature.",
        "رعایت نشدن پارامترهای نظافت: زمان، عمل مکانیکی، غلظت Detergent یا دما.",
      ),
      bi("Dirty hold time exceeded, so the residue dried on and became harder to remove.", "گذشتن از Dirty hold time که باقیمانده را خشک و جدا کردن آن را سخت‌تر می‌کند."),
      bi(
        "Sampling or analysis: swab technique, a recovery factor not established for that surface material, or an analytical error.",
        "نمونه‌برداری یا آنالیز: تکنیک Swab، Recovery factor تعیین‌نشده برای جنس آن سطح یا خطای آنالیتیکال.",
      ),
    ],
    checks: [
      bi("Whether this point is on the worst-case location map and how it was cleaned.", "حضور این نقطه در نقشه نقاط Worst-case و نحوه نظافت آن."),
      bi(
        "Recovery study for the surface material and swab solvent, against the minimum set in the protocol (often at least 50%).",
        "مطالعه Recovery برای جنس سطح و حلال Swab، در مقایسه با حداقل تعیین‌شده در Protocol (اغلب دست‌کم 50%).",
      ),
      bi("Cleaning record: dirty hold time, detergent batch and concentration, temperature and operator.", "سابقه نظافت: Dirty hold time، بچ و غلظت Detergent، دما و اپراتور."),
      bi("The limit itself: the PDE used and the MBS and TDD of the next product.", "خود حد: PDE به‌کاررفته و MBS و TDD محصول بعدی."),
    ],
    actions: [
      bi(
        "Hold the equipment, clean again and resample; assess any batch already made on it.",
        "توقف استفاده از تجهیز، نظافت مجدد و نمونه‌برداری دوباره؛ ارزیابی بچ‌هایی که روی آن ساخته شده‌اند.",
      ),
      bi(
        "Revise the cleaning procedure for that point, or make the part dedicated or disassembled for cleaning.",
        "بازنگری روش نظافت برای آن نقطه یا اختصاصی یا قابل جداسازی کردن آن قطعه برای نظافت.",
      ),
      bi(
        "Prevention: add the point to the worst-case map, set dirty and clean hold times, and review cleaning validation periodically.",
        "پیشگیری: افزودن نقطه به نقشه Worst-case، تعیین Dirty و Clean hold time و بازنگری دوره‌ای صحه‌گذاری نظافت.",
      ),
    ],
    refs: "EU GMP Annex 15, EMA Guideline on setting HBEL (2014)",
    more: { path: "tools", label: bi("Calculators", "ماشین‌حساب‌ها") },
  },
  {
    id: "oot-impurity",
    area: bi("QC · Stability", "QC · پایداری"),
    title: bi("A degradant grows faster than before", "یک محصول تخریب سریع‌تر از قبل رشد می‌کند"),
    symptom: bi(
      "A degradation product is still within specification but is rising faster than in earlier batches and falls outside the prediction interval of the historical trend (Out of trend).",
      "یک محصول تخریب هنوز در Specification است، ولی سریع‌تر از بچ‌های قبلی بالا می‌رود و از Prediction interval روند تاریخی خارج می‌شود (Out of trend).",
    ),
    mechanism: bi(
      "Degradation in the solid state is driven by reactive species and conditions in the dosage form: peroxides that oxidise the drug, reducing sugars that react with amines (Maillard), trace metals that catalyse oxidation, and water that raises molecular mobility. A small change in any of these, through a new Excipient lot, API source or packaging, can change the rate even when every material meets its specification.",
      "تخریب در حالت جامد توسط گونه‌ها و شرایط واکنش‌پذیر داخل شکل دارویی هدایت می‌شود: Peroxideهایی که دارو را اکسید می‌کنند، قندهای احیاکننده‌ای که با آمین‌ها واکنش می‌دهند (Maillard)، فلزات کمیاب که اکسیداسیون را کاتالیز می‌کنند و آبی که تحرک مولکولی را بالا می‌برد. تغییر کوچکی در هر یک از این‌ها، از طریق لات جدید Excipient، منبع جدید API یا بسته‌بندی، می‌تواند سرعت تخریب را تغییر دهد، حتی وقتی همه مواد در Specification هستند.",
    ),
    causes: [
      bi(
        "Reactive impurities in an Excipient lot: peroxides in Povidone, Crospovidone, PEG or Polysorbate.",
        "ناخالصی واکنش‌پذیر در لات Excipient: Peroxide در Povidone، Crospovidone، PEG یا Polysorbate.",
      ),
      bi("A reducing sugar such as lactose with an amine API (Maillard reaction).", "قند احیاکننده مانند Lactose همراه با API آمینی (واکنش Maillard)."),
      bi(
        "A new API source with a different impurity profile, particle size or crystal form.",
        "منبع جدید API با پروفایل ناخالصی، اندازه ذره یا فرم کریستالی متفاوت.",
      ),
      bi("More water in the product or packaging with a higher moisture vapour transmission rate.", "آب بیشتر در محصول یا بسته‌بندی با Moisture vapour transmission rate بالاتر."),
    ],
    checks: [
      bi(
        "Regression of this batch against earlier batches in the same packaging, using the OOT approach set in the SOP.",
        "Regression این بچ در مقایسه با بچ‌های قبلی در همان بسته‌بندی، با روش OOT تعریف‌شده در SOP.",
      ),
      bi("Peroxide value and supplier of the Excipient lots used, against earlier batches.", "Peroxide value و تأمین‌کننده لات‌های Excipient مصرفی در مقایسه با بچ‌های قبلی."),
      bi("The API's CoA and source, and any change in packaging material.", "CoA و منبع API و هر تغییر در جنس بسته‌بندی."),
      bi(
        "ICH Q3B(R2) thresholds: for a maximum daily dose of 10 mg to 2 g, identification at 0.2% (or 2 mg TDI, whichever is lower) and qualification at 0.3% (or 3 mg TDI).",
        "آستانه‌های ICH Q3B(R2): برای Maximum daily dose بین 10 mg و 2 g، Identification در 0.2% (یا 2 mg TDI، هر کدام کمتر) و Qualification در 0.3% (یا 3 mg TDI).",
      ),
    ],
    actions: [
      bi(
        "Identify the degradant as it approaches the identification threshold, and compare it with forced degradation results.",
        "شناسایی محصول تخریب پیش از رسیدن به Identification threshold و مقایسه آن با نتایج Forced degradation.",
      ),
      bi(
        "Assess shelf-life impact with ICH Q1E; consider a low-peroxide Excipient grade, an antioxidant, or packaging with better protection.",
        "ارزیابی اثر بر Shelf life با ICH Q1E؛ بررسی گرید Excipient با Peroxide پایین، Antioxidant یا بسته‌بندی با محافظت بیشتر.",
      ),
      bi(
        "Prevention: peroxide limits in the Excipient specification and change control for any new source of API or Excipient.",
        "پیشگیری: حد Peroxide در Specification مواد جانبی و Change control برای هر منبع جدید API یا Excipient.",
      ),
    ],
    refs: "ICH Q3B(R2), ICH Q1E, ICH Q1A(R2)",
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
