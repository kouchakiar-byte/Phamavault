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
        "رویداد اصلی با دروازه‌های منطقی «و / یا» به علت‌های تشکیل‌دهنده‌اش تجزیه می‌شود.",
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
    "Pharmacopoeial tests and acceptance criteria, dissolution and stability, microbiology and clean-room limits, pharmaceutical water, method validation, instrument qualification, data integrity and OOS investigation — with the related laboratory SOPs.",
    "آزمون‌ها و معیارهای پذیرش فارماکوپه‌ای، انحلال و پایداری، میکروبیولوژی و حدود اتاق تمیز، آب دارویی، اعتبارسنجی روش، Qualification دستگاه‌ها، یکپارچگی داده و بررسی نتایج OOS، همراه با دستورالعمل‌های آزمایشگاهی مرتبط.",
  ),
  growing: bi(
    "Acceptance criteria and procedures are summarised from USP–NF, Ph. Eur., ICH, EU GMP and WHO texts; always confirm against the edition in force.",
    "معیارهای پذیرش و روش‌ها از متون USP–NF، Ph. Eur.، ICH، EU GMP و WHO خلاصه شده‌اند؛ همواره با ویرایش لازم‌الاجرا تطبیق داده شوند.",
  ),

  areasTitle: bi("Scope of the QC laboratory", "حوزه‌های کار آزمایشگاه کنترل کیفیت"),
  areas: [
    { title: bi("Starting and packaging materials", "مواد اولیه و بسته‌بندی"), codes: ["QC-001", "QC-002", "QC-005", "QC-006"] },
    { title: bi("In-process and finished product", "حین فرایند و محصول نهایی"), codes: ["QC-003", "QC-007"] },
    { title: bi("Stability studies", "مطالعات پایداری"), codes: ["QC-022", "QC-023", "QC-024", "QC-030"] },
    { title: bi("Microbiology", "میکروبیولوژی"), codes: ["MIC-002", "MIC-003", "MIC-004", "MIC-005", "MIC-012"] },
    { title: bi("Water and environment", "آب و پایش محیطی"), codes: ["QC-025", "MIC-001", "MIC-008"] },
    { title: bi("Methods and instruments", "روش‌ها و دستگاه‌ها"), codes: ["QC-010", "QC-011", "QC-014", "QC-017", "QC-029"] },
    { title: bi("Results and data", "نتایج و داده‌ها"), codes: ["QC-008", "QC-009", "QC-021", "QC-028"] },
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
        `10 واحد: مقدار پذیرش ${ltr("AV ≤ L1 (15.0)")}. اگر ${ltr("AV > 15.0")} بود، 20 واحد دیگر آزمون می‌شود: مقدار AV برای 30 واحد ${ltr("≤ 15.0")} و هیچ واحدی خارج از ${ltr("(1 ± 0.25) × M")} نباشد.`,
      ),
    },
    {
      test: bi("Dissolution (immediate release)", "انحلال (رهش فوری)"),
      chapter: "USP <711> · Ph. Eur. 2.9.3",
      criteria: bi(
        "S1 (6 units): each ≥ Q + 5%. S2 (12): mean ≥ Q, none < Q − 15%. S3 (24): mean ≥ Q, no more than 2 units < Q − 15%, none < Q − 25%.",
        `مرحله S1 (6 واحد): هر واحد ${ltr("≥ Q + 5%")}. مرحله S2 (12 واحد): میانگین ${ltr("≥ Q")} و هیچ واحدی ${ltr("< Q − 15%")} نباشد. مرحله S3 (24 واحد): میانگین ${ltr("≥ Q")}، حداکثر 2 واحد ${ltr("< Q − 15%")} و هیچ واحدی ${ltr("< Q − 25%")} نباشد.`,
      ),
    },
    {
      test: bi("Disintegration", "زمان Disintegration"),
      chapter: "USP <701> · Ph. Eur. 2.9.1",
      criteria: bi(
        "6 units disintegrate within the specified time; if 1 or 2 fail, test 12 more and at least 16 of 18 must pass. Ph. Eur. limits: uncoated tablets 15 min, film-coated tablets 30 min.",
        `Disintegration هر 6 واحد در زمان تعیین‌شده کامل شود؛ اگر 1 یا 2 واحد مردود شد، 12 واحد دیگر آزمون و دست‌کم 16 از 18 واحد باید منطبق باشند. حدود ${ltr("Ph. Eur.")}: قرص بدون روکش 15 دقیقه، قرص با روکش فیلم 30 دقیقه.`,
      ),
    },
    {
      test: bi("Friability", "فرسایش‌پذیری (Friability)"),
      chapter: "USP <1216> · Ph. Eur. 2.9.7",
      criteria: bi(
        "100 rotations (25 rpm, 4 min). Tablets ≤ 650 mg: whole tablets close to 6.5 g; > 650 mg: 10 tablets. Mean weight loss ≤ 1.0% and no cracked, cleaved or broken tablets.",
        `100 دور (25 دور در دقیقه به مدت 4 دقیقه). قرص‌های ${ltr("≤ 650 mg")}: قرص کامل نزدیک به 6.5 گرم؛ قرص‌های ${ltr("> 650 mg")}: 10 قرص. میانگین کاهش وزن ${ltr("≤ 1.0%")} و هیچ قرص ترک‌خورده، دولایه یا شکسته‌ای نباشد.`,
      ),
    },
    {
      test: bi("Uniformity of mass", "یکنواختی وزن"),
      chapter: "Ph. Eur. 2.9.5",
      criteria: bi(
        "20 tablets: no more than 2 deviate from the mean by more than 10% (≤ 80 mg), 7.5% (80–250 mg) or 5% (> 250 mg), and none by more than twice that.",
        `20 قرص: حداکثر 2 قرص بیش از 10% (${ltr("≤ 80 mg")})، 7.5% (${ltr("80–250 mg")}) یا 5% (${ltr("> 250 mg")}) از میانگین انحراف داشته باشند و هیچ قرصی بیش از دو برابر این حد.`,
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
  specified: bi("Specified microorganisms (absent in 1 g or 1 mL)", "میکروارگانیسم‌های مشخص (عدم وجود در 1 گرم یا 1 میلی‌لیتر)"),
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
    `حد ${ltr("10¹ CFU")} یعنی حداکثر شمارش 20، حد ${ltr("10²")} یعنی 200 و حد ${ltr("10³")} یعنی 2000. TAMC: شمارش کل میکروارگانیسم‌های هوازی؛ TYMC: شمارش کل مخمرها و کپک‌ها.`,
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

  // ---------- Impurities ----------
  impTitle: bi("Impurity thresholds (ICH Q3A(R2) · Q3B(R2))", `آستانه‌های ناخالصی ${ltr("(ICH Q3A(R2) · Q3B(R2))")}`),
  impLead: bi(
    "Above the reporting threshold an impurity is reported; above the identification threshold its structure must be identified; above the qualification threshold its safety must be established. TDI: total daily intake; MDD: maximum daily dose.",
    "بالاتر از آستانه گزارش، ناخالصی گزارش می‌شود؛ بالاتر از آستانه شناسایی، ساختار آن باید شناسایی شود؛ بالاتر از آستانه صلاحیت‌سنجی (Qualification)، ایمنی آن باید اثبات شود. TDI: دریافت کل روزانه؛ MDD: حداکثر دوز روزانه.",
  ),
  impCols: {
    scope: bi("Applies to", "حوزه"),
    mdd: bi("Maximum daily dose", "حداکثر دوز روزانه"),
    reporting: bi("Reporting", "گزارش"),
    identification: bi("Identification", "شناسایی"),
    qualification: bi("Qualification", "صلاحیت‌سنجی"),
  },
  impurities: [
    { scope: bi("Drug substance (Q3A)", "ماده مؤثره (Q3A)"), mdd: "≤ 2 g/day", reporting: "0.05%", identification: "0.10% or 1.0 mg TDI*", qualification: "0.15% or 1.0 mg TDI*" },
    { scope: bi("Drug substance (Q3A)", "ماده مؤثره (Q3A)"), mdd: "> 2 g/day", reporting: "0.03%", identification: "0.05%", qualification: "0.05%" },
    { scope: bi("Drug product (Q3B)", "فرآورده (Q3B)"), mdd: "< 1 mg", reporting: "0.1%", identification: "1.0% or 5 µg TDI*", qualification: "1.0% or 50 µg TDI*" },
    { scope: bi("Drug product (Q3B)", "فرآورده (Q3B)"), mdd: "1–10 mg", reporting: "0.1%", identification: "0.5% or 20 µg TDI*", qualification: "1.0% or 50 µg TDI*" },
    { scope: bi("Drug product (Q3B)", "فرآورده (Q3B)"), mdd: "> 10–100 mg", reporting: "0.1%", identification: "0.2% or 2 mg TDI*", qualification: "0.5% or 200 µg TDI*" },
    { scope: bi("Drug product (Q3B)", "فرآورده (Q3B)"), mdd: "> 100 mg–1 g", reporting: "0.1%", identification: "0.2% or 2 mg TDI*", qualification: "0.2% or 3 mg TDI*" },
    { scope: bi("Drug product (Q3B)", "فرآورده (Q3B)"), mdd: "> 1–2 g", reporting: "0.05%", identification: "0.2% or 2 mg TDI*", qualification: "0.2% or 3 mg TDI*" },
    { scope: bi("Drug product (Q3B)", "فرآورده (Q3B)"), mdd: "> 2 g", reporting: "0.05%", identification: "0.10%", qualification: "0.15%" },
  ],
  impNote: bi(
    "* Whichever is lower. Q3B thresholds apply to degradation products. Mutagenic impurities are controlled separately under ICH M7, at much lower limits (e.g. TTC 1.5 µg/day for lifetime exposure).",
    `* هر کدام کمتر باشد. آستانه‌های Q3B برای محصولات تخریب است. ناخالصی‌های جهش‌زا جداگانه طبق ${ltr("ICH M7")} و با حدود بسیار پایین‌تر کنترل می‌شوند (مثلاً ${ltr("TTC 1.5 µg/day")} برای مواجهه مادام‌العمر).`,
  ),

  // ---------- Residual solvents ----------
  solventsTitle: bi("Residual solvents (ICH Q3C · USP <467>)", `حلال‌های باقیمانده ${ltr("(ICH Q3C · USP <467>)")}`),
  solventCols: { cls: bi("Class", "رده"), meaning: bi("Meaning", "مفهوم"), examples: bi("Examples and concentration limits (ppm)", "نمونه‌ها و حد غلظت (ppm)") },
  solvents: [
    {
      cls: "1",
      meaning: bi("Avoid: known or suspected human carcinogens and environmental hazards.", "پرهیز شود: سرطان‌زای شناخته‌شده یا مشکوک انسانی و خطرناک برای محیط زیست."),
      examples: "Benzene 2 · Carbon tetrachloride 4 · 1,2-Dichloroethane 5 · 1,1-Dichloroethene 8 · 1,1,1-Trichloroethane 1500",
    },
    {
      cls: "2",
      meaning: bi("Limit: non-genotoxic toxicity; each solvent has a PDE.", "محدود شود: سمیت غیرژنوتوکسیک؛ هر حلال PDE مشخص دارد."),
      examples: "Acetonitrile 410 · Chloroform 60 · Dichloromethane 600 · N,N-Dimethylformamide 880 · Hexane 290 · Methanol 3000 · Tetrahydrofuran 720 · Toluene 890",
    },
    {
      cls: "3",
      meaning: bi("Low toxic potential: PDE 50 mg/day or more.", "پتانسیل سمیت کم: PDE برابر 50 میلی‌گرم در روز یا بیشتر."),
      examples: "≤ 5000 ppm (0.5%) without justification · e.g. Acetone, Ethanol, Ethyl acetate, 2-Propanol, Heptane, DMSO",
    },
  ],
  solventsNote: bi(
    "Concentration limits assume a daily intake of 10 g of drug product (Option 1); Option 2 allows the sum over all components, against the PDE.",
    `حدود غلظت بر پایه مصرف روزانه 10 گرم فرآورده است (گزینه 1)؛ در گزینه 2 مجموع همه اجزا با PDE مقایسه می‌شود.`,
  ),

  // ---------- Elemental impurities ----------
  elementsTitle: bi("Elemental impurities (ICH Q3D · USP <232>)", `ناخالصی‌های عنصری ${ltr("(ICH Q3D · USP <232>)")}`),
  elementCols: { element: bi("Element", "عنصر"), cls: bi("Class", "رده"), oral: bi("Oral PDE (µg/day)", "PDE خوراکی (میکروگرم در روز)"), parenteral: bi("Parenteral PDE (µg/day)", "PDE تزریقی (میکروگرم در روز)") },
  elements: [
    { element: "Cd", cls: "1", oral: "5", parenteral: "2" },
    { element: "Pb", cls: "1", oral: "5", parenteral: "5" },
    { element: "As", cls: "1", oral: "15", parenteral: "15" },
    { element: "Hg", cls: "1", oral: "30", parenteral: "3" },
    { element: "Co", cls: "2A", oral: "50", parenteral: "5" },
    { element: "V", cls: "2A", oral: "100", parenteral: "10" },
    { element: "Ni", cls: "2A", oral: "200", parenteral: "20" },
  ],
  elementsNote: bi(
    "Class 1 and 2A elements are assessed in every risk assessment. If the assessed level stays below 30% of the PDE (the control threshold), no additional controls are needed.",
    "عناصر رده 1 و 2A در هر ارزیابی ریسک بررسی می‌شوند. اگر مقدار برآوردشده کمتر از 30% PDE (آستانه کنترل) باشد، کنترل اضافی لازم نیست.",
  ),

  // ---------- System suitability ----------
  sstTitle: bi("Chromatographic system suitability (USP <621> · Ph. Eur. 2.2.46)", `انطباق سیستم کروماتوگرافی ${ltr("(USP <621> · Ph. Eur. 2.2.46)")}`),
  sstCols: { parameter: bi("Parameter", "پارامتر"), what: bi("What it shows", "آنچه نشان می‌دهد"), typical: bi("Typical requirement", "الزام متداول") },
  sst: [
    { parameter: bi("Repeatability (replicate injections)", "تکرارپذیری (تزریق‌های تکراری)"), what: bi("Precision of the system", "دقت سیستم"), typical: bi("RSD as the monograph states; for assays commonly ≤ 2.0% for 5 injections", "RSD طبق مونوگراف؛ برای تعیین مقدار معمولاً ≤ 2.0% برای 5 تزریق") },
    { parameter: bi("Resolution (Rs)", "قدرت تفکیک (Rs)"), what: bi("Separation of the critical pair", "جداسازی زوج بحرانی"), typical: bi("Usually ≥ 1.5 (baseline), or the monograph value", "معمولاً ≥ 1.5 (جداسازی کامل) یا مقدار مونوگراف") },
    { parameter: bi("Symmetry (tailing) factor", "فاکتور تقارن (دنباله‌دار شدن)"), what: bi("Peak shape", "شکل پیک"), typical: bi("0.8–1.8 for assay peaks unless the monograph states otherwise", "0.8 تا 1.8 برای پیک تعیین مقدار، مگر آنکه مونوگراف حد دیگری تعیین کرده باشد") },
    { parameter: bi("Signal-to-noise ratio (S/N)", "نسبت سیگنال به نویز (S/N)"), what: bi("Sensitivity at the reporting level", "حساسیت در سطح گزارش"), typical: bi("≥ 10 at the quantitation limit; about 3 at the detection limit", "≥ 10 در حد کمّی‌سازی؛ حدود 3 در حد تشخیص") },
    { parameter: bi("Plate number (N)", "تعداد بشقابک (N)"), what: bi("Column efficiency", "کارایی ستون"), typical: bi("As the monograph states", "طبق مونوگراف") },
  ],
  sstNote: bi(
    "System suitability is an integral part of the method: if it fails, no sample result from that run may be reported.",
    "انطباق سیستم بخش جدایی‌ناپذیر روش است: اگر برقرار نباشد، هیچ نتیجه نمونه‌ای از آن اجرای آنالیز (Run) قابل گزارش نیست.",
  ),

  // ---------- Dissolution ----------
  dissoTitle: bi("Dissolution apparatus and usual conditions (USP <711>)", `دستگاه‌های انحلال و شرایط متداول ${ltr("(USP <711>)")}`),
  dissoCols: { app: bi("Apparatus", "دستگاه"), use: bi("Typical use", "کاربرد متداول"), speed: bi("Usual speed", "سرعت متداول") },
  disso: [
    { app: bi("1 — Basket", "1 — Basket"), use: bi("Capsules, floating and multiparticulate forms", "کپسول، فرآورده‌های شناور و چندذره‌ای"), speed: "50–100 rpm" },
    { app: bi("2 — Paddle", "2 — Paddle"), use: bi("Tablets (most common); sinkers for capsules", "قرص (رایج‌ترین)؛ با سینکر برای کپسول"), speed: "50–75 rpm" },
    { app: bi("3 — Reciprocating cylinder", "3 — سیلندر رفت‌وبرگشتی (Reciprocating cylinder)"), use: bi("Extended release, pH-change profiles", "رهش طولانی و پروفایل با تغییر pH"), speed: "5–30 dips/min" },
    { app: bi("4 — Flow-through cell", "4 — سلول جریانی (Flow-through cell)"), use: bi("Poorly soluble drugs, implants, microspheres", "داروهای کم‌محلول، ایمپلنت و میکروسفر"), speed: "4–16 mL/min" },
  ],
  dissoNote: bi(
    "Medium usually 900 mL (500–1000 mL) at 37 ± 0.5 °C, degassed when dissolved gases affect results. Sink conditions: a medium volume at least three times that needed to saturate the dose.",
    `محیط معمولاً 900 میلی‌لیتر (500 تا 1000 میلی‌لیتر) در دمای ${ltr("37 ± 0.5 °C")} و گاززدایی‌شده اگر گازهای محلول بر نتیجه اثر بگذارند. شرایط Sink: حجم محیط دست‌کم سه برابر حجمی که دوز را اشباع می‌کند.`,
  ),

  // ---------- Sterility ----------
  sterilityTitle: bi("Sterility test (USP <71> · Ph. Eur. 2.6.1)", `آزمون استریلیتی ${ltr("(USP <71> · Ph. Eur. 2.6.1)")}`),
  sterility: [
    { title: bi("Methods", "روش‌ها"), text: bi("Membrane filtration (preferred where the product can be filtered) or direct inoculation of the media.", "فیلتراسیون غشایی (روش ترجیحی برای محصولات قابل فیلتر) یا تلقیح مستقیم به محیط کشت.") },
    { title: bi("Media and incubation", "محیط‌ها و انکوباسیون"), text: bi("Fluid thioglycollate medium at 30–35 °C (anaerobes and aerobes) and soya-bean casein digest medium at 20–25 °C (fungi and aerobes), each for at least 14 days.", "محیط تیوگلیکولات مایع در 30 تا 35 درجه (بی‌هوازی و هوازی) و محیط سویابین کازئین دایجست در 20 تا 25 درجه (قارچ و هوازی)، هر کدام دست‌کم 14 روز.") },
    { title: bi("Method suitability", "تناسب روش"), text: bi("Before routine use, show that the product does not inhibit growth: ≤ 100 CFU of each test organism must grow visibly.", "پیش از استفاده روتین ثابت شود که محصول از رشد جلوگیری نمی‌کند: ≤ 100 CFU از هر میکروارگانیسم آزمون باید رشد قابل مشاهده داشته باشد.") },
    { title: bi("Interpretation", "تفسیر"), text: bi("No growth: complies. Growth: fails, unless the test is shown to be invalid (e.g. contamination in the test environment) and repeated.", "عدم رشد: منطبق. رشد: مردود، مگر اینکه نامعتبر بودن آزمون (مثلاً آلودگی محیط آزمون) اثبات و آزمون تکرار شود.") },
  ],

  // ---------- Dissolution acceptance ----------
  dissoAccTitle: bi("Dissolution acceptance table, immediate release (USP <711>)", `جدول پذیرش انحلال برای فرآورده Immediate-release ${ltr("(USP <711>)")}`),
  dissoAccCols: { stage: bi("Stage", "مرحله"), n: bi("Units tested", "تعداد واحد"), criteria: bi("Acceptance criteria", "معیار پذیرش") },
  dissoAcc: [
    { stage: "S1", n: "6", criteria: bi("Each unit not less than Q + 5%.", "هر واحد حداقل Q + 5%.") },
    { stage: "S2", n: "6 (12 in total)", criteria: bi("Average of 12 units (S1 + S2) ≥ Q and no unit less than Q − 15%.", "میانگین 12 واحد (S1 + S2) ≥ Q و هیچ واحدی کمتر از Q − 15% نباشد.") },
    { stage: "S3", n: "12 (24 in total)", criteria: bi("Average of 24 units ≥ Q; not more than 2 units less than Q − 15%; no unit less than Q − 25%.", "میانگین 24 واحد ≥ Q؛ حداکثر 2 واحد کمتر از Q − 15% و هیچ واحدی کمتر از Q − 25% نباشد.") },
  ],
  dissoAccNote: bi(
    "Q is the amount dissolved stated in the monograph as a percentage of label claim (for example Q = 80% at 30 min).",
    "Q مقدار حل‌شده‌ای است که مونوگراف به‌صورت درصدی از مقدار برچسب تعیین می‌کند (برای نمونه Q = 80% در 30 دقیقه).",
  ),
  f2Title: bi("Comparing dissolution profiles (f2 similarity factor)", `مقایسه پروفایل‌های انحلال ${ltr("(Similarity factor f2)")}`),
  f2: [
    bi("At least 12 units of the test and the reference product, tested under the same conditions and at the same time points.", "حداقل 12 واحد از فرآورده آزمون و مرجع، در شرایط یکسان و در زمان‌های نمونه‌برداری یکسان."),
    bi("At least three time points (zero excluded) and not more than one point after 85% dissolution of either product.", "حداقل سه نقطه زمانی (بدون صفر) و حداکثر یک نقطه پس از رسیدن هر یک از دو فرآورده به 85% انحلال."),
    bi("Coefficient of variation not more than 20% at the earliest time point and not more than 10% at the others.", "ضریب تغییرات (CV) در نخستین نقطه حداکثر 20% و در سایر نقاط حداکثر 10%."),
    bi("f2 = 50 × log{[1 + (1/n) Σ(Rt − Tt)²]^−0.5 × 100}; f2 between 50 and 100 shows similar profiles.", "f2 = 50 × log{[1 + (1/n) Σ(Rt − Tt)²]^−0.5 × 100}؛ مقدار f2 بین 50 تا 100 نشانه مشابهت پروفایل‌هاست."),
    bi("When both products dissolve 85% or more within 15 min, the profiles are considered similar without f2.", "اگر هر دو فرآورده در 15 دقیقه حداقل 85% حل شوند، پروفایل‌ها بدون محاسبه f2 مشابه تلقی می‌شوند."),
  ],
  f2Ref: bi(
    "Sources: FDA Guidance, Dissolution Testing of Immediate Release Solid Oral Dosage Forms (1997); EMA Guideline on the Investigation of Bioequivalence (2010), Appendix I.",
    "منابع: FDA Guidance, Dissolution Testing of Immediate Release Solid Oral Dosage Forms (1997)؛ EMA Guideline on the Investigation of Bioequivalence (2010)، پیوست I.",
  ),

  // ---------- Stability testing ----------
  stabTitle: bi("Stability testing: frequency and significant change (ICH Q1A(R2) · Q1B)", `آزمون پایداری: تناوب آزمون و تغییر قابل توجه ${ltr("(ICH Q1A(R2) · Q1B)")}`),
  stabFreq: [
    { study: bi("Long-term", "بلندمدت (Long-term)"), when: bi("Every 3 months in the first year, every 6 months in the second year, then annually (e.g. 0, 3, 6, 9, 12, 18, 24, 36 months).", "هر 3 ماه در سال اول، هر 6 ماه در سال دوم و سپس سالانه (برای نمونه 0، 3، 6، 9، 12، 18، 24 و 36 ماه).") },
    { study: bi("Accelerated", "تسریع‌شده (Accelerated)"), when: bi("At least three points including start and end of a 6-month study (e.g. 0, 3, 6 months).", "حداقل سه نقطه شامل ابتدا و انتهای مطالعه 6 ماهه (برای نمونه 0، 3 و 6 ماه).") },
    { study: bi("Intermediate", "میانی (Intermediate)"), when: bi("At least four points including start and end of a 12-month study (e.g. 0, 6, 9, 12 months), when accelerated shows significant change.", "حداقل چهار نقطه شامل ابتدا و انتهای مطالعه 12 ماهه (برای نمونه 0، 6، 9 و 12 ماه)، هنگامی که در شرایط تسریع‌شده تغییر قابل توجه رخ دهد.") },
  ],
  stabCols: { study: bi("Study", "مطالعه"), when: bi("Testing frequency", "تناوب آزمون") },
  sigTitle: bi("Significant change for a drug product", "تغییر قابل توجه (Significant change) در فرآورده دارویی"),
  sig: [
    bi("A 5% change in assay from the initial value.", "تغییر 5% در Assay نسبت به مقدار اولیه."),
    bi("Any degradation product exceeding its acceptance criterion.", "تجاوز هر محصول تخریب از معیار پذیرش آن."),
    bi("Failure of appearance, physical attributes and functionality tests (e.g. colour, phase separation, hardness, dose delivery per actuation).", "عدم انطباق ظاهر، ویژگی‌های فیزیکی و عملکردی (مانند رنگ، جداشدن فاز، Hardness و دوز تحویلی در هر Actuation)."),
    bi("Failure of the pH criterion, as appropriate.", "عدم انطباق pH، در صورت کاربرد."),
    bi("Failure of the dissolution criterion for 12 units.", "عدم انطباق Dissolution برای 12 واحد."),
  ],
  photo: bi(
    "Photostability (ICH Q1B): expose to not less than 1.2 million lux hours of visible light and not less than 200 watt hours per square metre of near-UV energy, with a dark control wrapped in aluminium foil.",
    "Photostability (ICH Q1B): مواجهه با حداقل 1.2 میلیون lux·h نور مرئی و حداقل 200 W·h/m² انرژی UV نزدیک، همراه با نمونه شاهد تاریکی (پوشیده در فویل آلومینیوم).",
  ),

  // ---------- Bacterial endotoxins ----------
  betTitle: bi("Bacterial endotoxins: limit and maximum valid dilution (USP <85> · Ph. Eur. 2.6.14)", `اندوتوکسین باکتریایی: حد و حداکثر رقت معتبر ${ltr("(USP <85> · Ph. Eur. 2.6.14)")}`),
  bet: [
    { title: bi("Endotoxin limit", "حد اندوتوکسین"), formula: "Limit = K / M", text: bi("K = 5 EU/kg for parenteral routes other than intrathecal (0.2 EU/kg intrathecal); M = the maximum dose per kg given in one hour (a 70 kg adult is assumed).", "K = 5 EU/kg برای راه‌های تزریقی غیر از داخل نخاعی (0.2 EU/kg برای Intrathecal)؛ M = حداکثر دوز به ازای هر کیلوگرم در یک ساعت (وزن بزرگسال 70 کیلوگرم فرض می‌شود).") },
    { title: bi("Maximum valid dilution", "حداکثر رقت معتبر (MVD)"), formula: "MVD = (Limit × C) / λ", text: bi("C = concentration of the test solution; λ = the labelled sensitivity of the lysate (gel clot) or the lowest point of the standard curve (photometric).", "C = غلظت محلول آزمون؛ λ = حساسیت برچسب لیزات (روش Gel clot) یا پایین‌ترین نقطه منحنی استاندارد (روش‌های فتومتریک).") },
    { title: bi("Interference", "تداخل (Interference)"), formula: "50–200%", text: bi("Before routine testing show the product does not inhibit or enhance the reaction: recovery of the spike must be 50–200% (photometric) at a dilution not exceeding the MVD.", "پیش از آزمون روتین ثابت شود محصول واکنش را مهار یا تقویت نمی‌کند: بازیابی Spike در روش‌های فتومتریک 50 تا 200% و در رقتی نه بیشتر از MVD.") },
  ],

  // ---------- Microbiology: test strains ----------
  strainsTitle: bi("Test strains for growth promotion and method suitability (USP <61> · <62>)", `سویه‌های آزمون برای Growth promotion و تناسب روش ${ltr("(USP <61> · <62>)")}`),
  strainsCols: { organism: bi("Microorganism", "میکروارگانیسم"), strain: bi("Strain", "سویه"), use: bi("Used in", "کاربرد") },
  strains: [
    { organism: "Staphylococcus aureus", strain: "ATCC 6538", use: bi("TAMC; S. aureus test", "TAMC؛ آزمون S. aureus") },
    { organism: "Pseudomonas aeruginosa", strain: "ATCC 9027", use: bi("TAMC; P. aeruginosa test", "TAMC؛ آزمون P. aeruginosa") },
    { organism: "Bacillus subtilis", strain: "ATCC 6633", use: bi("TAMC", "TAMC") },
    { organism: "Candida albicans", strain: "ATCC 10231", use: bi("TAMC, TYMC; C. albicans test", "TAMC و TYMC؛ آزمون C. albicans") },
    { organism: "Aspergillus brasiliensis", strain: "ATCC 16404", use: bi("TAMC, TYMC", "TAMC و TYMC") },
    { organism: "Escherichia coli", strain: "ATCC 8739", use: bi("E. coli test", "آزمون E. coli") },
    { organism: "Salmonella enterica subsp. enterica serovar Typhimurium", strain: "ATCC 14028", use: bi("Salmonella test", "آزمون Salmonella") },
    { organism: "Clostridium sporogenes", strain: "ATCC 11437 / 19404", use: bi("Clostridia test", "آزمون Clostridia") },
  ],
  strainsNote: bi(
    "Inoculum not more than 100 CFU; for solid media the count recovered must be within a factor of 2 of the standardised inoculum. Use cultures not more than five passages from the reference seed lot.",
    "Inoculum حداکثر 100 CFU؛ در محیط جامد شمارش بازیابی‌شده باید در محدوده ضریب 2 از Inoculum استانداردشده باشد. کشت‌ها حداکثر پنج پاساژ از Seed lot مرجع فاصله داشته باشند.",
  ),

  // ---------- Clean-room monitoring ----------
  emTitle: bi("Clean-room limits (EU GMP Annex 1, 2022)", `حدود اتاق تمیز ${ltr("(EU GMP Annex 1, 2022)")}`),
  emCols: {
    grade: bi("Grade", "گرید"),
    restSmall: bi("At rest ≥ 0.5 µm /m³", "At rest ≥ 0.5 µm در m³"),
    restLarge: bi("At rest ≥ 5.0 µm /m³", "At rest ≥ 5.0 µm در m³"),
    opSmall: bi("In operation ≥ 0.5 µm /m³", "In operation ≥ 0.5 µm در m³"),
    opLarge: bi("In operation ≥ 5.0 µm /m³", "In operation ≥ 5.0 µm در m³"),
    air: bi("Air sample CFU/m³", "Air sample (CFU/m³)"),
    settle: bi("Settle plate CFU/4 h", "Settle plate (CFU/4 h)"),
    contact: bi("Contact plate CFU/plate", "Contact plate (CFU/plate)"),
  },
  em: [
    { grade: "A", restSmall: "3 520", restLarge: "—", opSmall: "3 520", opLarge: "29", air: "No growth", settle: "No growth", contact: "No growth" },
    { grade: "B", restSmall: "3 520", restLarge: "—", opSmall: "352 000", opLarge: "2 930", air: "10", settle: "5", contact: "5" },
    { grade: "C", restSmall: "352 000", restLarge: "2 930", opSmall: "3 520 000", opLarge: "29 300", air: "100", settle: "50", contact: "25" },
    { grade: "D", restSmall: "3 520 000", restLarge: "29 300", opSmall: "—", opLarge: "—", air: "200", settle: "100", contact: "50" },
  ],
  emNote: bi(
    "— : not specified or not predetermined (set by the manufacturer from risk assessment and routine data). Glove prints in grade A: no growth; grade B: 5 CFU/glove. Settle plates 90 mm, contact plates 55 mm.",
    "— : تعیین نشده یا از پیش تعیین نشده (بر اساس ارزیابی ریسک و داده‌های روتین توسط سازنده تعیین می‌شود). Glove print در گرید A: عدم رشد؛ در گرید B: 5 CFU در هر دستکش. Settle plate با قطر 90 میلی‌متر و Contact plate با قطر 55 میلی‌متر.",
  ),

  // ---------- Sampling ----------
  samplingTitle: bi("Sampling plans for starting materials (WHO TRS 929, Annex 4)", `طرح‌های نمونه‌برداری مواد اولیه ${ltr("(WHO TRS 929, Annex 4)")}`),
  samplingCols: { plan: bi("Plan", "طرح"), formula: bi("Containers sampled", "تعداد ظروف نمونه‌برداری"), use: bi("When", "کاربرد") },
  sampling: [
    { plan: "n", formula: "n = 1 + √N", use: bi("Uniform material from a recognised supplier; samples tested individually for identity.", "ماده یکنواخت از تأمین‌کننده شناخته‌شده؛ نمونه‌ها برای شناسایی جداگانه آزمون می‌شوند.") },
    { plan: "p", formula: "p = 0.4 √N", use: bi("Uniform material from a recognised supplier when only identity of each container is checked (e.g. NIR) and the composite sample is tested in full.", "ماده یکنواخت از تأمین‌کننده شناخته‌شده، وقتی فقط هویت هر ظرف کنترل می‌شود (مانند NIR) و نمونه مرکب آزمون کامل می‌شود.") },
    { plan: "r", formula: "r = 1.5 √N", use: bi("Material suspected of being non-uniform or from a less well-known source (e.g. herbal materials).", "ماده مشکوک به عدم یکنواختی یا از منبع کمتر شناخته‌شده (مانند مواد گیاهی).") },
  ],
  samplingNote: bi("N = number of containers in the consignment; round the result up to the next whole number.", "N = تعداد ظروف محموله؛ عدد حاصل به عدد صحیح بالاتر گرد می‌شود."),

  // ---------- Instruments ----------
  aiqTitle: bi("Analytical instrument qualification (USP <1058>)", `Qualification دستگاه‌های آنالیز ${ltr("(USP <1058>)")}`),
  aiqStages: [
    { stage: "DQ", text: bi("Design qualification: user requirements (URS) and the choice of instrument and supplier.", "Design qualification: نیازمندی‌های کاربر (URS) و انتخاب دستگاه و تأمین‌کننده.") },
    { stage: "IQ", text: bi("Installation qualification: delivery, installation and environment as specified.", "Installation qualification: تحویل، نصب و شرایط محیطی مطابق مشخصات.") },
    { stage: "OQ", text: bi("Operational qualification: the instrument works to its specifications in the user's environment.", "Operational qualification: عملکرد دستگاه مطابق مشخصات در محیط کاربر.") },
    { stage: "PQ", text: bi("Performance qualification: continued fitness for the intended use (periodic checks, system suitability).", "Performance qualification: تداوم تناسب برای کاربرد موردنظر (کنترل‌های دوره‌ای و System suitability).") },
  ],
  aiqGroups: [
    { group: "A", text: bi("Standard equipment without measurement capability or with conformance verified by observation (stirrers, vortex mixers).", "تجهیزات استاندارد بدون قابلیت اندازه‌گیری یا با انطباق قابل مشاهده (همزن، Vortex).") },
    { group: "B", text: bi("Instruments giving measured values or controlling physical parameters, with calibration (balances, pH meters, ovens, thermometers).", "دستگاه‌هایی که مقدار اندازه‌گیری می‌کنند یا پارامتر فیزیکی را کنترل می‌کنند و کالیبراسیون لازم دارند (ترازو، pH متر، آون، دماسنج).") },
    { group: "C", text: bi("Computerised analytical systems with full qualification and software validation (HPLC, GC, dissolution systems, spectrophotometers).", "سیستم‌های آنالیز رایانه‌ای با Qualification کامل و Validation نرم‌افزار (HPLC، GC، دستگاه انحلال، اسپکتروفتومتر).") },
  ],
  balanceTitle: bi("Analytical balances (USP <41> · <1251>)", `ترازوهای آنالیتیک ${ltr("(USP <41> · <1251>)")}`),
  balance: [
    bi("Repeatability: twice the standard deviation of 10 replicate weighings divided by the smallest net weight to be weighed is not more than 0.10%.", "Repeatability: دو برابر انحراف معیار 10 توزین تکراری، تقسیم بر کمترین وزن خالص قابل توزین، حداکثر 0.10% باشد."),
    bi("Accuracy: a test weight between 5% and 100% of capacity reads within 0.10% of its value.", "Accuracy: وزنه آزمون بین 5% تا 100% ظرفیت ترازو، با خطای حداکثر 0.10% از مقدار خود خوانده شود."),
    bi("Minimum weight: the smallest net weight that satisfies repeatability; do not weigh below it for quantitative work.", "Minimum weight: کمترین وزن خالصی که الزام Repeatability را برآورده می‌کند؛ توزین کمّی کمتر از آن مجاز نیست."),
    bi("Daily or before-use check with a test weight; periodic calibration by an accredited body with traceable weights.", "کنترل روزانه یا پیش از استفاده با وزنه آزمون؛ کالیبراسیون دوره‌ای توسط مرجع معتبر با وزنه‌های قابل ردیابی."),
  ],

  // ---------- Data integrity ----------
  diTitle: bi("Data integrity in the QC laboratory (ALCOA+)", `یکپارچگی داده در آزمایشگاه کنترل کیفیت ${ltr("(ALCOA+)")}`),
  di: [
    { k: "Attributable", v: bi("Who performed the action and when (unique user IDs, no shared accounts).", "مشخص بودن انجام‌دهنده و زمان هر اقدام (شناسه کاربری اختصاصی، بدون حساب مشترک).") },
    { k: "Legible", v: bi("Readable and permanent throughout the retention period.", "خوانا و ماندگار در تمام دوره نگهداری.") },
    { k: "Contemporaneous", v: bi("Recorded at the time the work is done.", "ثبت هم‌زمان با انجام کار.") },
    { k: "Original", v: bi("The first record (or a certified true copy), including electronic raw data and metadata.", "سند اولیه (یا رونوشت تأییدشده)، شامل داده خام الکترونیکی و Metadata.") },
    { k: "Accurate", v: bi("Correct, complete and free from unrecorded changes.", "درست، کامل و بدون تغییر ثبت‌نشده.") },
    { k: "Complete · Consistent · Enduring · Available", v: bi("All data including repeats and failed runs; time-stamped in sequence; on durable media; retrievable for review and inspection.", "همه داده‌ها از جمله تکرارها و Runهای ناموفق؛ ثبت زمانی به ترتیب؛ روی رسانه بادوام؛ قابل بازیابی برای بازبینی و بازرسی.") },
  ],
  diNote: bi(
    "Review the audit trail of every chromatographic run before the result is approved; manual integration only with a recorded justification and second-person approval. Sources: MHRA GXP Data Integrity Guidance (2018); PIC/S PI 041-1 (2021); WHO TRS 1033, Annex 4 (2021).",
    "Audit trail هر Run کروماتوگرافی پیش از تأیید نتیجه بازبینی شود؛ Manual integration فقط با دلیل ثبت‌شده و تأیید نفر دوم مجاز است. منابع: MHRA GXP Data Integrity Guidance (2018)؛ PIC/S PI 041-1 (2021)؛ WHO TRS 1033، پیوست 4 (2021).",
  ),

  // ---------- Reference and retention samples ----------
  retTitle: bi("Reference and retention samples (EU GMP Annex 19)", `نمونه‌های مرجع و نگهداری ${ltr("(EU GMP Annex 19)")}`),
  ret: [
    bi("Finished product: keep reference and retention samples of each batch for at least one year after its expiry date, in the final pack.", "فرآورده نهایی: نمونه مرجع و نگهداری هر بچ دست‌کم تا یک سال پس از تاریخ انقضا، در بسته‌بندی نهایی نگهداری شود."),
    bi("Starting materials (other than solvents, gases and water): at least two years after release of the product, unless their stability is shorter.", "مواد اولیه (به جز حلال‌ها، گازها و آب): دست‌کم دو سال پس از ترخیص فرآورده، مگر آنکه پایداری آن‌ها کوتاه‌تر باشد."),
    bi("Quantity: enough for at least two full analytical controls of the batch.", "مقدار: کافی برای دست‌کم دو بار آزمون کامل بچ."),
    bi("Store under the labelled conditions with controlled access and a sample register.", "نگهداری در شرایط برچسب، با دسترسی کنترل‌شده و دفتر ثبت نمونه‌ها."),
  ],

  // ---------- Method lifecycle ----------
  lifecycleTitle: bi("Validation, verification and transfer of methods", "Validation، Verification و Transfer روش‌های آنالیز"),
  lifecycle: [
    { k: "Validation", v: bi("Full validation of in-house methods per ICH Q2(R2), within the lifecycle of ICH Q14 and USP <1220>.", "Validation کامل روش‌های داخلی طبق ICH Q2(R2)، در چارچوب چرخه عمر ICH Q14 و USP <1220>.") },
    { k: "Verification", v: bi("Compendial methods are not revalidated but verified under actual conditions of use (USP <1226>): typically specificity, precision and, for impurities, LOQ.", "روش‌های فارماکوپه‌ای Validation مجدد نمی‌شوند بلکه در شرایط واقعی استفاده Verification می‌شوند (USP <1226>): معمولاً Specificity، Precision و برای ناخالصی‌ها LOQ.") },
    { k: "Transfer", v: bi("Transfer to another laboratory by comparative testing, co-validation, revalidation or waiver, with predefined acceptance criteria (USP <1224>).", "انتقال به آزمایشگاه دیگر به روش Comparative testing، Co-validation، Revalidation یا Waiver، با معیارهای پذیرش از پیش تعیین‌شده (USP <1224>).") },
  ],

  sopsTitle: bi("QC and microbiology SOPs", "دستورالعمل‌های کنترل کیفیت و میکروبیولوژی"),
};
