import { bi, type Bi } from "@/i18n/bi";

/*
 * Reference content for the quality sections: the QA knowledge blocks shown
 * above the SOP library, and the Quality Control (QC) section page.
 * Criteria are quoted from the named pharmacopoeial chapters and guidelines.
 */

/** Wrap a Latin run so it keeps its order inside Persian text. */
const ltr = (s: string) => `⁦${s}⁩`;

export const qaKnowledge = {
  pqsTitle: bi("Pharmaceutical quality system (ICH Q10)", "سیستم کیفیت دارویی (ICH Q10)"),
  pqsLead: bi(
    "Four PQS elements applied across the product lifecycle, supported by two enablers.",
    "چهار رکن سیستم کیفیت دارویی که در سراسر چرخه عمر محصول به کار می‌روند، به پشتوانه دو توانمندساز.",
  ),
  enabler: bi("Enabler", "توانمندساز"),
  pqs: [
    {
      title: bi("Process performance and product quality monitoring", "پایش عملکرد فرایند و کیفیت محصول"),
      text: bi(
        "Trending of CQAs, CPPs, in-process controls, stability and complaints to keep the process in a state of control.",
        "روندیابی ویژگی‌های بحرانی کیفیت، پارامترهای بحرانی فرایند، کنترل‌های حین فرایند، نتایج پایداری و شکایات برای حفظ فرایند در وضعیت کنترل‌شده.",
      ),
      enabler: false,
    },
    {
      title: bi("Corrective and preventive action (CAPA)", "اقدام اصلاحی و پیشگیرانه (CAPA)"),
      text: bi(
        "Root cause investigation of deviations, complaints, OOS results and audit findings, with a check of effectiveness.",
        "بررسی علت ریشه‌ای انحرافات، شکایات، نتایج خارج از مشخصات و یافته‌های ممیزی، همراه با بررسی اثربخشی اقدام.",
      ),
      enabler: false,
    },
    {
      title: bi("Change management", "مدیریت تغییر"),
      text: bi(
        "Risk-based evaluation, approval and post-implementation review of every change, including its regulatory impact.",
        "ارزیابی مبتنی بر ریسک، تأیید و بازبینی پس از اجرای هر تغییر، از جمله اثر رگولاتوری آن.",
      ),
      enabler: false,
    },
    {
      title: bi("Management review", "بازنگری مدیریت"),
      text: bi(
        "Periodic review of process performance, product quality and PQS effectiveness by senior management.",
        "بازنگری دوره‌ای عملکرد فرایند، کیفیت محصول و اثربخشی سیستم کیفیت توسط مدیریت ارشد.",
      ),
      enabler: false,
    },
    {
      title: bi("Knowledge management", "مدیریت دانش"),
      text: bi(
        "Capturing development, technology transfer and manufacturing knowledge so decisions rest on current product understanding.",
        "ثبت دانش حاصل از توسعه، انتقال فناوری و تولید تا تصمیم‌ها بر پایه شناخت به‌روز از محصول گرفته شود.",
      ),
      enabler: true,
    },
    {
      title: bi("Quality risk management (ICH Q9(R1))", `مدیریت ریسک کیفیت ${ltr("(ICH Q9(R1))")}`),
      text: bi(
        "Systematic assessment, control, communication and review of risks to quality, with formality proportional to the risk.",
        "ارزیابی، کنترل، اطلاع‌رسانی و بازنگری نظام‌مند ریسک‌های کیفیت، با سطح رسمیت متناسب با میزان ریسک.",
      ),
      enabler: true,
    },
  ],

  qrmTitle: bi("Quality risk management tools", "ابزارهای مدیریت ریسک کیفیت"),
  qrmLead: bi(
    "Tools listed in ICH Q9(R1), Annex I, and where each fits best.",
    "ابزارهای معرفی‌شده در پیوست I راهنمای ICH Q9(R1) و کاربرد مناسب هر کدام.",
  ),
  tool: bi("Tool", "ابزار"),
  use: bi("Typical use", "کاربرد متداول"),
  method: bi("How it works", "روش کار"),
  qrmTools: [
    {
      name: "FMEA",
      use: bi("Process and equipment failure modes", "حالت‌های خرابی فرایند و تجهیزات"),
      method: bi(
        "Each failure mode is scored for severity, occurrence and detectability; RPN = S × O × D ranks the risks.",
        `هر حالت خرابی از نظر شدت، احتمال وقوع و قابلیت تشخیص امتیاز می‌گیرد و ${ltr("RPN = S × O × D")} ریسک‌ها را رتبه‌بندی می‌کند.`,
      ),
    },
    {
      name: "FMECA",
      use: bi("Critical process steps and product design", "مراحل بحرانی فرایند و طراحی محصول"),
      method: bi("FMEA extended with a criticality analysis of each failure mode.", "FMEA به‌علاوه تحلیل بحرانی بودن هر حالت خرابی."),
    },
    {
      name: "FTA",
      use: bi("Root cause of complex failures and complaints", "علت ریشه‌ای خرابی‌ها و شکایات پیچیده"),
      method: bi(
        "A top event is broken down into its causes with AND/OR logic gates.",
        "رویداد اصلی با دروازه‌های منطقی «و / یا» به علت‌های تشکیل‌دهنده‌اش شکسته می‌شود.",
      ),
    },
    {
      name: "HACCP",
      use: bi("Microbiological, chemical and physical hazards", "خطرهای میکروبی، شیمیایی و فیزیکی"),
      method: bi(
        "Seven principles: hazard analysis, critical control points, critical limits, monitoring, corrective action, verification, records.",
        "هفت اصل: تحلیل خطر، نقاط کنترل بحرانی، حدود بحرانی، پایش، اقدام اصلاحی، صحه‌گذاری و مستندسازی.",
      ),
    },
    {
      name: "HAZOP",
      use: bi("Facilities, utilities and equipment design", "طراحی تأسیسات، سیستم‌های پشتیبانی و تجهیزات"),
      method: bi(
        "Guide words (no, more, less, reverse…) applied to each design parameter to find deviations from intent.",
        "واژه‌های راهنما (هیچ، بیشتر، کمتر، معکوس و …) روی هر پارامتر طراحی اعمال می‌شود تا انحراف از هدف طراحی پیدا شود.",
      ),
    },
    {
      name: "PHA",
      use: bi("Early development, when little is known", "مراحل اولیه توسعه، وقتی اطلاعات کم است"),
      method: bi("Hazards are listed and ranked by severity and likelihood.", "خطرها فهرست و بر اساس شدت و احتمال رتبه‌بندی می‌شوند."),
    },
    {
      name: "Risk ranking and filtering",
      nameFa: "رتبه‌بندی و غربال ریسک",
      use: bi("Prioritising sites, suppliers or products", "اولویت‌بندی کارخانه‌ها، تأمین‌کنندگان یا محصولات"),
      method: bi(
        "Weighted scoring of several risk factors to compare and filter many items.",
        "امتیازدهی وزن‌دار چند عامل ریسک برای مقایسه و غربال تعداد زیادی مورد.",
      ),
    },
  ] as { name: string; nameFa?: string; use: Bi; method: Bi }[],

  refsTitle: bi("Key GMP references", "مراجع کلیدی GMP"),
  refCode: bi("Reference", "مرجع"),
  refSubject: bi("Subject", "موضوع"),
  refs: [
    { code: "PIC/S PE 009", subject: bi("PIC/S GMP Guide: Part I, Part II (APIs) and annexes", "راهنمای GMP سازمان PIC/S: بخش اول، بخش دوم (مواد مؤثره) و پیوست‌ها") },
    { code: "EudraLex Vol. 4", subject: bi("EU GMP guidelines", "راهنماهای GMP اتحادیه اروپا") },
    { code: "21 CFR 210 / 211", subject: bi("US current GMP for finished pharmaceuticals", "الزامات cGMP آمریکا برای فرآورده‌های دارویی") },
    { code: "WHO TRS 986, Annex 2", subject: bi("WHO GMP: main principles", "اصول اصلی GMP سازمان جهانی بهداشت") },
    { code: "ICH Q7", subject: bi("GMP for active pharmaceutical ingredients", "GMP مواد مؤثره دارویی") },
    { code: "ICH Q9(R1) / Q10", subject: bi("Quality risk management; pharmaceutical quality system", "مدیریت ریسک کیفیت؛ سیستم کیفیت دارویی") },
    { code: "Annex 1 (2022)", subject: bi("Manufacture of sterile medicinal products", "ساخت فرآورده‌های دارویی استریل") },
    { code: "Annex 11", subject: bi("Computerised systems", "سیستم‌های رایانه‌ای") },
    { code: "Annex 15", subject: bi("Qualification and validation", "احراز کیفیت و اعتبارسنجی") },
    { code: "PIC/S PI 041", subject: bi("Data management and integrity", "مدیریت داده و تمامیت داده") },
  ],
};

export const qc = {
  title: bi("Quality Control (QC)", "کنترل کیفیت (QC)"),
  lead: bi(
    "Pharmacopoeial tests and acceptance criteria, microbiological quality of non-sterile products, pharmaceutical water, analytical method validation and OOS investigation — with the related laboratory SOPs.",
    "آزمون‌ها و معیارهای پذیرش فارماکوپه‌ای، کیفیت میکروبی فرآورده‌های غیراستریل، آب دارویی، اعتبارسنجی روش‌های آنالیز و بررسی نتایج خارج از مشخصات، همراه با دستورالعمل‌های آزمایشگاهی مرتبط.",
  ),
  growing: bi(
    "This section is being expanded with new topics and tables.",
    "این بخش در حال گسترش است و موضوعات و جدول‌های تازه به آن اضافه می‌شود.",
  ),

  areasTitle: bi("Scope of the QC laboratory", "حوزه‌های کار آزمایشگاه کنترل کیفیت"),
  areas: [
    { title: bi("Starting and packaging materials", "مواد اولیه و بسته‌بندی"), codes: ["QC-001", "QC-002", "QC-005", "QC-006"] },
    { title: bi("In-process and finished product", "حین فرایند و محصول نهایی"), codes: ["QC-003", "QC-007"] },
    { title: bi("Stability studies", "مطالعات پایداری"), codes: ["QC-022", "QC-023", "QC-024"] },
    { title: bi("Microbiology", "میکروبیولوژی"), codes: ["MIC-002", "MIC-003", "MIC-004", "MIC-005"] },
    { title: bi("Water and environment", "آب و پایش محیطی"), codes: ["QC-025", "MIC-001", "MIC-008"] },
    { title: bi("Methods and instruments", "روش‌ها و دستگاه‌ها"), codes: ["QC-010", "QC-011", "QC-014", "QC-017"] },
    { title: bi("Results and data", "نتایج و داده‌ها"), codes: ["QC-008", "QC-009", "QC-021"] },
    { title: bi("Standards and reagents", "استانداردها و معرف‌ها"), codes: ["QC-012", "QC-013"] },
  ],

  testsTitle: bi("Pharmacopoeial tests for tablets and capsules", "آزمون‌های فارماکوپه‌ای قرص و کپسول"),
  test: bi("Test", "آزمون"),
  chapter: bi("Chapter", "فصل مرجع"),
  criteria: bi("Acceptance criteria", "معیار پذیرش"),
  tests: [
    {
      test: bi("Uniformity of dosage units", "یکنواختی واحدهای دارویی"),
      chapter: "USP <905> · Ph. Eur. 2.9.40",
      criteria: bi(
        "10 units: acceptance value AV ≤ L1 (15.0). If AV > 15.0, test 20 more: AV of 30 ≤ 15.0 and no unit outside (1 ± 0.25) × M.",
        `۱۰ واحد: مقدار پذیرش ${ltr("AV ≤ L1 (15.0)")}. اگر ${ltr("AV > 15.0")} بود، ۲۰ واحد دیگر آزمون می‌شود: مقدار AV برای ۳۰ واحد ${ltr("≤ 15.0")} و هیچ واحدی خارج از ${ltr("(1 ± 0.25) × M")} نباشد.`,
      ),
    },
    {
      test: bi("Dissolution (immediate release)", "انحلال (رهش فوری)"),
      chapter: "USP <711> · Ph. Eur. 2.9.3",
      criteria: bi(
        "S1 (6 units): each ≥ Q + 5%. S2 (12): mean ≥ Q, none < Q − 15%. S3 (24): mean ≥ Q, no more than 2 units < Q − 15%, none < Q − 25%.",
        `مرحله S1 (۶ واحد): هر واحد ${ltr("≥ Q + 5%")}. مرحله S2 (۱۲ واحد): میانگین ${ltr("≥ Q")} و هیچ واحدی ${ltr("< Q − 15%")} نباشد. مرحله S3 (۲۴ واحد): میانگین ${ltr("≥ Q")}، حداکثر ۲ واحد ${ltr("< Q − 15%")} و هیچ واحدی ${ltr("< Q − 25%")} نباشد.`,
      ),
    },
    {
      test: bi("Disintegration", "زمان باز شدن (Disintegration)"),
      chapter: "USP <701> · Ph. Eur. 2.9.1",
      criteria: bi(
        "6 units disintegrate within the specified time; if 1 or 2 fail, test 12 more and at least 16 of 18 must pass. Ph. Eur. limits: uncoated tablets 15 min, film-coated tablets 30 min.",
        `۶ واحد در زمان تعیین‌شده باز شوند؛ اگر ۱ یا ۲ واحد مردود شد، ۱۲ واحد دیگر آزمون و دست‌کم ۱۶ از ۱۸ واحد باید قبول شوند. حدود ${ltr("Ph. Eur.")}: قرص بدون روکش ۱۵ دقیقه، قرص فیلم‌کوت ۳۰ دقیقه.`,
      ),
    },
    {
      test: bi("Friability", "سایش (Friability)"),
      chapter: "USP <1216> · Ph. Eur. 2.9.7",
      criteria: bi(
        "100 rotations (25 rpm, 4 min). Tablets ≤ 650 mg: whole tablets close to 6.5 g; > 650 mg: 10 tablets. Mean weight loss ≤ 1.0% and no cracked, cleaved or broken tablets.",
        `۱۰۰ دور (۲۵ دور در دقیقه به مدت ۴ دقیقه). قرص‌های ${ltr("≤ 650 mg")}: قرص کامل نزدیک به ۶٫۵ گرم؛ قرص‌های ${ltr("> 650 mg")}: ۱۰ قرص. میانگین کاهش وزن ${ltr("≤ 1.0%")} و هیچ قرص ترک‌خورده، دولایه یا شکسته‌ای نباشد.`,
      ),
    },
    {
      test: bi("Uniformity of mass", "یکنواختی وزن"),
      chapter: "Ph. Eur. 2.9.5",
      criteria: bi(
        "20 tablets: no more than 2 deviate from the mean by more than 10% (≤ 80 mg), 7.5% (80–250 mg) or 5% (> 250 mg), and none by more than twice that.",
        `۲۰ قرص: حداکثر ۲ قرص بیش از ۱۰٪ (${ltr("≤ 80 mg")})، ۷٫۵٪ (${ltr("80–250 mg")}) یا ۵٪ (${ltr("> 250 mg")}) از میانگین انحراف داشته باشند و هیچ قرصی بیش از دو برابر این حد.`,
      ),
    },
    {
      test: bi("Breaking force (hardness)", "نیروی شکست (سختی)"),
      chapter: "USP <1217> · Ph. Eur. 2.9.8",
      criteria: bi(
        "No compendial limit; the in-house specification is set from development and validation data.",
        "حد فارماکوپه‌ای ندارد؛ مشخصات داخلی از داده‌های توسعه و اعتبارسنجی تعیین می‌شود.",
      ),
    },
    {
      test: bi("Water content", "مقدار آب"),
      chapter: "USP <921> · Ph. Eur. 2.5.12",
      criteria: bi(
        "Karl Fischer titration (volumetric or coulometric) or loss on drying (USP <731>, Ph. Eur. 2.2.32), limit per monograph or specification.",
        `تیتراسیون کارل فیشر (حجمی یا کولومتری) یا افت وزن در خشک کردن ${ltr("(USP <731>, Ph. Eur. 2.2.32)")}؛ حد طبق مونوگراف یا مشخصات.`,
      ),
    },
  ],

  microTitle: bi(
    "Microbiological quality of non-sterile products (USP <1111> · Ph. Eur. 5.1.4)",
    `کیفیت میکروبی فرآورده‌های غیراستریل ${ltr("(USP <1111> · Ph. Eur. 5.1.4)")}`,
  ),
  route: bi("Route of administration", "راه مصرف"),
  tamc: bi("TAMC (CFU/g or mL)", "TAMC (CFU در گرم یا میلی‌لیتر)"),
  tymc: bi("TYMC (CFU/g or mL)", "TYMC (CFU در گرم یا میلی‌لیتر)"),
  specified: bi("Specified microorganisms (absent in 1 g or 1 mL)", "میکروارگانیسم‌های مشخص (عدم وجود در ۱ گرم یا ۱ میلی‌لیتر)"),
  micro: [
    { route: bi("Oral, non-aqueous", "خوراکی غیرآبی"), tamc: "10³", tymc: "10²", specified: "Escherichia coli" },
    { route: bi("Oral, aqueous", "خوراکی آبی"), tamc: "10²", tymc: "10¹", specified: "Escherichia coli" },
    { route: bi("Rectal", "رکتال"), tamc: "10³", tymc: "10²", specified: "—" },
    {
      route: bi("Oromucosal, gingival, cutaneous, nasal, auricular", "دهانی‌مخاطی، لثه‌ای، پوستی، بینی و گوش"),
      tamc: "10²",
      tymc: "10¹",
      specified: "Staphylococcus aureus, Pseudomonas aeruginosa",
    },
    {
      route: bi("Vaginal", "واژینال"),
      tamc: "10²",
      tymc: "10¹",
      specified: "Pseudomonas aeruginosa, Staphylococcus aureus, Candida albicans",
    },
    {
      route: bi("Inhalation", "استنشاقی"),
      tamc: "10²",
      tymc: "10¹",
      specified: "S. aureus, P. aeruginosa, bile-tolerant Gram-negative bacteria",
    },
  ],
  microNote: bi(
    "A limit of 10¹ CFU allows a maximum count of 20, 10² allows 200 and 10³ allows 2000. TAMC: total aerobic microbial count; TYMC: total combined yeasts and moulds count.",
    `حد ${ltr("10¹ CFU")} یعنی حداکثر شمارش ۲۰، حد ${ltr("10²")} یعنی ۲۰۰ و حد ${ltr("10³")} یعنی ۲۰۰۰. TAMC: شمارش کل میکروارگانیسم‌های هوازی؛ TYMC: شمارش کل مخمرها و کپک‌ها.`,
  ),

  waterTitle: bi("Pharmaceutical water", "آب دارویی"),
  parameter: bi("Parameter", "پارامتر"),
  pw: bi("Purified water", "آب تصفیه‌شده (PW)"),
  wfi: bi("Water for injections", "آب قابل تزریق (WFI)"),
  water: [
    {
      parameter: bi("Conductivity", "هدایت الکتریکی"),
      pw: "≤ 1.3 µS/cm at 25 °C (USP <645>, stage 1) · ≤ 5.1 µS/cm at 25 °C (Ph. Eur., bulk)",
      wfi: "≤ 1.3 µS/cm at 25 °C (USP <645>) · ≤ 1.1 µS/cm at 20 °C (Ph. Eur.)",
    },
    { parameter: bi("Total organic carbon", "کربن آلی کل (TOC)"), pw: "≤ 0.5 mg/L (500 ppb)", wfi: "≤ 0.5 mg/L (500 ppb)" },
    { parameter: bi("Microbial action level", "حد اقدام میکروبی"), pw: "100 CFU/mL", wfi: "10 CFU/100 mL" },
    { parameter: bi("Bacterial endotoxins", "اندوتوکسین باکتریایی"), pw: "—", wfi: "< 0.25 EU/mL" },
  ],

  validationTitle: bi(
    "Analytical method validation: characteristics by type of procedure (ICH Q2)",
    `اعتبارسنجی روش آنالیز: ویژگی‌ها بر حسب نوع روش ${ltr("(ICH Q2)")}`,
  ),
  characteristic: bi("Characteristic", "ویژگی"),
  procedures: [
    bi("Identification", "شناسایی"),
    bi("Impurities, quantitative", "ناخالصی، کمّی"),
    bi("Impurities, limit test", "ناخالصی، آزمون حد"),
    bi("Assay", "تعیین مقدار (Assay)"),
  ],
  validation: [
    { name: bi("Specificity / selectivity", "اختصاصیت / انتخاب‌پذیری"), cells: [true, true, true, true] },
    { name: bi("Accuracy", "صحت"), cells: [false, true, false, true] },
    { name: bi("Repeatability", "تکرارپذیری"), cells: [false, true, false, true] },
    { name: bi("Intermediate precision", "دقت بینابینی"), cells: [false, true, false, true] },
    { name: bi("Detection limit", "حد تشخیص"), cells: [false, false, true, false] },
    { name: bi("Quantitation limit", "حد کمّی‌سازی"), cells: [false, true, false, false] },
    { name: bi("Response (linearity)", "پاسخ (خطی بودن)"), cells: [false, true, false, true] },
    { name: bi("Range", "گستره"), cells: [false, true, false, true] },
  ],
  validationNote: bi(
    "Robustness is evaluated during development. For quantitative impurity tests the detection limit may also be needed.",
    "استحکام روش (Robustness) در مرحله توسعه ارزیابی می‌شود. برای آزمون کمّی ناخالصی ممکن است حد تشخیص هم لازم باشد.",
  ),

  oosTitle: bi("Investigating out-of-specification (OOS) results", "بررسی نتایج خارج از مشخصات (OOS)"),
  oos: [
    {
      title: bi("Phase I — laboratory investigation", "مرحله اول — بررسی آزمایشگاهی"),
      text: bi(
        "Analyst and supervisor check calculations, instrument and system suitability, standards, reagents and sample preparation, keeping the original solutions. A result is invalidated only for a documented, assignable laboratory error.",
        "آنالیست و سرپرست، محاسبات، دستگاه و انطباق سیستم، استانداردها، معرف‌ها و آماده‌سازی نمونه را بررسی می‌کنند و محلول‌های اولیه نگه داشته می‌شود. نتیجه فقط در صورت خطای آزمایشگاهی مشخص و مستند باطل می‌شود.",
      ),
    },
    {
      title: bi("Phase II — full-scale investigation", "مرحله دوم — بررسی کامل"),
      text: bi(
        "If no laboratory error is found, production records and the process are reviewed and the impact on other batches is assessed. Retesting follows a predefined protocol by a second analyst; resampling needs justification.",
        "اگر خطای آزمایشگاهی یافت نشود، سوابق تولید و فرایند بررسی و اثر آن بر سایر بچ‌ها ارزیابی می‌شود. آزمون مجدد طبق پروتکل از پیش تعیین‌شده و توسط آنالیست دوم انجام می‌شود و نمونه‌برداری مجدد به توجیه نیاز دارد.",
      ),
    },
    {
      title: bi("Conclusion and batch disposition", "نتیجه‌گیری و تصمیم درباره بچ"),
      text: bi(
        "QA decides the batch disposition and opens CAPA. Testing into compliance, averaging that hides an OOS result and outlier tests on chemical assays are not acceptable.",
        "تضمین کیفیت درباره وضعیت بچ تصمیم می‌گیرد و CAPA تعریف می‌کند. آزمون تکراری تا رسیدن به نتیجه مطلوب، میانگین‌گیری که نتیجه OOS را پنهان کند و آزمون داده پرت برای آزمون‌های شیمیایی پذیرفتنی نیست.",
      ),
    },
  ],
  oosRef: bi(
    "FDA Guidance: Investigating Out-of-Specification (OOS) Test Results for Pharmaceutical Production; MHRA OOS guidance.",
    "FDA Guidance: Investigating Out-of-Specification (OOS) Test Results for Pharmaceutical Production؛ راهنمای OOS سازمان MHRA.",
  ),

  sopsTitle: bi("QC and microbiology SOPs", "دستورالعمل‌های کنترل کیفیت و میکروبیولوژی"),
};
