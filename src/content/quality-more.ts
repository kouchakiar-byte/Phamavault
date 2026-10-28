import { bi, type Bi } from "@/i18n/bi";

/*
 * Further reference content for the quality sections: the QA topics shown
 * above the SOP library (deviations, CAPA, change control, validation,
 * cleaning, release, PQR, suppliers, recalls, inspections, metrics, SPC,
 * contamination control, documentation) and more QC topics (specifications,
 * particulate matter, mutagenic impurities and nitrosamines, stability
 * conditions, techniques, reference standards, OOT).
 * Figures are taken from the named guidelines and chapters; the explanations
 * are PharmaVault's own.
 */

/** Wrap a Latin run so it keeps its order inside Persian text. */
const ltr = (s: string) => `⁦${s}⁩`;

type Card = { k: string; v: Bi; f?: string };

export const qaMore = {
  // ---------- EU GMP Part I ----------
  gmpTitle: bi("EU GMP Part I at a glance", `ساختار ${ltr("EU GMP Part I")} در یک نگاه`),
  gmpLead: bi(
    "The nine chapters of the basic requirements for medicinal products (EudraLex Vol. 4; the PIC/S GMP Guide PE 009 follows the same structure).",
    `نه فصل الزامات پایه فرآورده‌های دارویی ${ltr("(EudraLex Vol. 4)")}؛ راهنمای ${ltr("PIC/S PE 009")} نیز همین ساختار را دارد.`,
  ),
  gmpCols: [bi("Chapter", "فصل"), bi("Subject", "موضوع"), bi("What inspectors look for", "محور اصلی بازرسی")],
  gmp: [
    ["1", bi("Pharmaceutical quality system", "سیستم کیفیت دارویی"), bi("PQS per ICH Q10, management responsibility, PQR, QRM, CAPA and change management working in practice.", `استقرار ${ltr("PQS")} مطابق ${ltr("ICH Q10")}، مسئولیت مدیریت، ${ltr("PQR")}، مدیریت ریسک کیفیت، ${ltr("CAPA")} و مدیریت تغییر به‌صورت عملی و اثربخش.`)],
    ["2", bi("Personnel", "کارکنان"), bi("Organisation chart, defined responsibilities of the heads of Production and QC and of the QP, training records and hygiene.", `چارت سازمانی، شرح وظایف مدیران تولید، کنترل کیفیت و ${ltr("QP")}، سوابق آموزش و بهداشت فردی.`)],
    ["3", bi("Premises and equipment", "ساختمان و تجهیزات"), bi("Layout that prevents mix-ups and cross-contamination, cleaning, maintenance, calibration and qualification status.", "طراحی و چیدمانی که از اشتباه و آلودگی متقاطع جلوگیری کند، نظافت، نگهداری، کالیبراسیون و وضعیت Qualification.")],
    ["4", bi("Documentation", "مستندسازی"), bi("Specifications, manufacturing formulae, batch records, SOPs, logbooks; control of templates and of electronic records.", "مشخصات، دستور ساخت، سوابق بچ، SOPها و دفاتر ثبت؛ کنترل فرم‌های خام و سوابق الکترونیکی.")],
    ["5", bi("Production", "تولید"), bi("Line clearance, segregation, prevention of cross-contamination (HBEL-based), supplier approval and starting-material controls.", `Line clearance، جداسازی، پیشگیری از آلودگی متقاطع بر پایه ${ltr("HBEL")}، تأیید تأمین‌کنندگان و کنترل مواد اولیه.`)],
    ["6", bi("Quality control", "کنترل کیفیت"), bi("Sampling, testing, OOS and trend handling, reference standards, stability programme and technical transfer of methods.", "نمونه‌برداری، آزمون، رسیدگی به OOS و روندها، استانداردهای مرجع، برنامه پایداری و انتقال روش‌ها.")],
    ["7", bi("Outsourced activities", "فعالیت‌های برون‌سپاری‌شده"), bi("Assessment of the contract acceptor and a written quality agreement that defines who does what.", "ارزیابی پیمانکار و قرارداد کیفیت مکتوب که مسئولیت هر طرف را مشخص می‌کند.")],
    ["8", bi("Complaints and product recall", "شکایات و فراخوان محصول"), bi("Complaint investigation with root cause, decision on recall, timely notification of authorities and effectiveness of recall.", "بررسی شکایت تا علت ریشه‌ای، تصمیم‌گیری درباره فراخوان، اطلاع‌رسانی به‌موقع به مرجع رگولاتوری و اثربخشی فراخوان.")],
    ["9", bi("Self-inspection", "خودبازرسی"), bi("Planned, independent internal audits of every GMP area, recorded, with CAPA followed to closure.", "ممیزی داخلی برنامه‌ریزی‌شده و مستقل از همه حوزه‌های GMP، با ثبت یافته‌ها و پیگیری CAPA تا بسته شدن.")],
  ] as [string, Bi, Bi][],

  // ---------- Deviations ----------
  devTitle: bi("Deviation management", "مدیریت انحراف (Deviation)"),
  devLead: bi(
    "GMP requires every departure from an approved procedure or specification to be recorded, investigated in proportion to its risk, and closed with CAPA. The classification below is the one most companies define in their own procedure.",
    "طبق GMP هر انحراف از دستورالعمل یا مشخصات تأییدشده باید ثبت شود، متناسب با ریسک آن بررسی شود و با CAPA بسته شود. طبقه‌بندی زیر همان طبقه‌بندی رایجی است که بیشتر شرکت‌ها در دستورالعمل داخلی خود تعریف می‌کنند.",
  ),
  devClasses: [
    { k: "Critical", v: bi("Could affect patient safety or product efficacy, or the identity, strength or purity of a released batch. Immediate escalation to QA head and QP; batch on hold.", "می‌تواند ایمنی بیمار، اثربخشی یا هویت، قدرت و خلوص بچ آزادشده را تحت تأثیر قرار دهد. ارجاع فوری به مدیر QA و QP و توقف بچ (Hold).") },
    { k: "Major", v: bi("Could affect product quality or GMP compliance but not directly the patient; needs a formal root cause investigation and CAPA.", "می‌تواند بر کیفیت محصول یا انطباق با GMP اثر بگذارد ولی مستقیماً بیمار را درگیر نمی‌کند؛ بررسی رسمی علت ریشه‌ای و CAPA لازم است.") },
    { k: "Minor", v: bi("No impact on product quality or validated state; documented, corrected and trended so that repeats are noticed.", "اثری بر کیفیت محصول یا وضعیت Validated ندارد؛ ثبت، اصلاح و روندیابی می‌شود تا تکرار آن دیده شود.") },
  ] as Card[],
  devSteps: [
    { title: bi("Detect and record", "شناسایی و ثبت"), text: bi("Record the event at once, with what, where, when, which batches; take immediate containment action (hold, segregate).", "ثبت فوری رویداد: چه چیزی، کجا، چه زمانی و کدام بچ‌ها؛ اقدام فوری مهار (Hold و جداسازی).") },
    { title: bi("Classify and assess impact", "طبقه‌بندی و ارزیابی اثر"), text: bi("QA classifies the deviation by risk and lists every batch, product and system it may affect.", "QA انحراف را بر اساس ریسک طبقه‌بندی می‌کند و همه بچ‌ها، محصولات و سیستم‌هایی را که ممکن است متأثر شوند فهرست می‌کند.") },
    { title: bi("Investigate the root cause", "بررسی علت ریشه‌ای"), text: bi("Use a structured tool (5 Whys, Ishikawa, Is / Is not). \"Human error\" is accepted only after the system causes behind it are ruled out.", `با ابزار ساختاریافته (${ltr("5 Whys")}، Ishikawa، ${ltr("Is / Is not")}). «خطای انسانی» فقط وقتی پذیرفته می‌شود که علت‌های سیستمی پشت آن رد شده باشند.`) },
    { title: bi("CAPA and batch decision", "CAPA و تصمیم درباره بچ"), text: bi("Define corrective and preventive actions with owners and dates; QA/QP decides on the affected batches.", "تعریف اقدامات اصلاحی و پیشگیرانه با مسئول و تاریخ؛ تصمیم QA و QP درباره بچ‌های متأثر.") },
    { title: bi("Close and trend", "بستن و روندیابی"), text: bi("Close within the target set in the procedure (commonly 30 days, extensions justified); trend deviations for the PQR and management review.", "بستن در مهلت تعیین‌شده در دستورالعمل (معمولاً 30 روز، با توجیه برای تمدید)؛ روندیابی انحرافات برای PQR و بازنگری مدیریت.") },
  ],

  // ---------- Root cause and CAPA ----------
  rcaTitle: bi("Root cause analysis tools", "ابزارهای تحلیل علت ریشه‌ای (RCA)"),
  rca: [
    { k: "5 Whys", v: bi("Ask \"why\" repeatedly (often about five times) until the answer is a cause the system can control. Simple; best for single-path problems.", "پرسیدن «چرا» به‌صورت پیاپی (معمولاً حدود پنج بار) تا رسیدن به علتی که سیستم بتواند آن را کنترل کند. ساده؛ مناسب مسائل تک‌مسیری.") },
    { k: "Ishikawa (6M)", v: bi("Fishbone diagram with Man, Machine, Method, Material, Measurement and Mother nature (environment) as the bones; good for team brainstorming.", "نمودار استخوان ماهی با شاخه‌های Man، Machine، Method، Material، Measurement و Mother nature (محیط)؛ مناسب طوفان فکری تیمی.") },
    { k: "Is / Is not", v: bi("Compares where, when and in what the problem occurs with where it could but does not; narrows the cause quickly (Kepner-Tregoe).", "مقایسه جایی، زمانی و چیزی که مشکل در آن رخ داده با جایی که می‌توانست رخ دهد ولی نداده؛ علت را سریع محدود می‌کند (روش Kepner-Tregoe).") },
    { k: "Pareto", v: bi("Ranks causes or deviation categories by frequency; the few causes behind most events (the 80/20 rule) get CAPA first.", `رتبه‌بندی علت‌ها یا دسته‌های انحراف بر اساس فراوانی؛ چند علتی که بیشتر رویدادها را می‌سازند (قاعده ${ltr("80/20")}) اولویت CAPA می‌گیرند.`) },
    { k: "Fault tree analysis", v: bi("Top-down tree of causes joined by AND/OR gates; suits complex failures with several contributing causes.", "درخت علت‌ها از بالا به پایین با دروازه‌های «و / یا»؛ مناسب خرابی‌های پیچیده با چند علت همزمان.") },
    { k: "Change analysis", v: bi("Asks what changed before the event: material lot, operator, equipment, method, supplier. Changes are the commonest trigger.", "بررسی اینکه پیش از رویداد چه چیزی تغییر کرده است: لات ماده، اپراتور، تجهیز، روش یا تأمین‌کننده. تغییر رایج‌ترین عامل آغازگر است.") },
  ] as Card[],
  capaTitle: bi("A CAPA that works", "ویژگی‌های یک CAPA اثربخش"),
  capa: [
    bi("Correction fixes the event; corrective action removes the root cause; preventive action stops a potential problem elsewhere. Record which is which.", "Correction خود رویداد را رفع می‌کند؛ Corrective action علت ریشه‌ای را حذف می‌کند؛ Preventive action از وقوع مشکل بالقوه در جای دیگر جلوگیری می‌کند. نوع هر اقدام ثبت شود."),
    bi("Every action is specific, has one owner and a due date, and is linked to the root cause it addresses.", "هر اقدام مشخص است، یک مسئول و یک تاریخ سررسید دارد و به علت ریشه‌ای مربوط به خود پیوند خورده است."),
    bi("\"Retrain the operator\" alone is rarely enough: look at the procedure, the design of the task and the workload behind the error.", "«آموزش مجدد اپراتور» به‌تنهایی به‌ندرت کافی است؛ دستورالعمل، طراحی کار و بار کاری پشت خطا بررسی شود."),
    bi("Effectiveness check with a measurable criterion and a period fixed in advance (e.g. no recurrence in the next 20 batches or 6 months).", "بررسی اثربخشی با معیار قابل اندازه‌گیری و دوره‌ای که از پیش تعیین شده است؛ مثلاً عدم تکرار در 20 بچ یا 6 ماه بعد."),
    bi("Changes made by a CAPA go through change control; overdue CAPAs are escalated and reported in management review.", "تغییرات ناشی از CAPA از مسیر کنترل تغییر انجام می‌شوند؛ CAPAهای معوق به مدیریت ارجاع و در بازنگری مدیریت گزارش می‌شوند."),
  ],

  // ---------- Change control ----------
  changeTitle: bi("Change control and regulatory categories", "کنترل تغییر و طبقه‌بندی رگولاتوری تغییرات"),
  changeLead: bi(
    "Internally every change is assessed for its effect on quality, validation and the marketing authorisation. If the dossier is affected, the change is filed in the category the authority defines before (or after) it is implemented.",
    "در داخل شرکت، اثر هر تغییر بر کیفیت، وضعیت Validation و پروانه محصول ارزیابی می‌شود. اگر پرونده ثبت متأثر شود، تغییر در طبقه‌ای که مرجع رگولاتوری تعیین کرده، پیش یا پس از اجرا، ارسال می‌شود.",
  ),
  changeCols: [bi("Category", "طبقه"), bi("Region", "منطقه"), bi("Meaning", "مفهوم")],
  change: [
    ["Type IA / IAIN", "EU", bi("Minor change with minimal or no impact: \"do and tell\". IA within 12 months, IAIN immediately after implementation.", "تغییر جزئی با اثر حداقلی یا بدون اثر: «اجرا و اطلاع». IA ظرف 12 ماه و IAIN بلافاصله پس از اجرا اعلام می‌شود.")],
    ["Type IB", "EU", bi("Minor change that must be notified before implementation: \"tell, wait and do\" (30 days).", "تغییر جزئی که پیش از اجرا اعلام می‌شود: «اطلاع، انتظار، اجرا» (30 روز).")],
    ["Type II", "EU", bi("Major change that may significantly affect quality, safety or efficacy; needs prior approval.", "تغییر عمده که می‌تواند بر کیفیت، ایمنی یا اثربخشی اثر چشمگیر داشته باشد؛ تأیید قبلی لازم است.")],
    ["Annual Report", "US · 21 CFR 314.70(d)", bi("Minor change, reported in the next annual report.", "تغییر جزئی، در گزارش سالانه بعدی اعلام می‌شود.")],
    ["CBE-0 / CBE-30", "US · 21 CFR 314.70(c)", bi("Moderate change: distribution on receipt of the supplement (CBE-0) or 30 days after it (CBE-30).", "تغییر متوسط: توزیع پس از دریافت Supplement (CBE-0) یا 30 روز پس از آن (CBE-30).")],
    ["PAS", "US · 21 CFR 314.70(b)", bi("Major change: prior approval supplement, distribution only after FDA approval.", "تغییر عمده: Prior Approval Supplement؛ توزیع فقط پس از تأیید FDA.")],
  ] as [string, string, Bi][],
  changeNote: bi(
    "ICH Q12 adds tools to plan changes in advance: Established Conditions (ECs) and the Post-Approval Change Management Protocol (PACMP). Iran FDA applies its own variation procedure; confirm the category with the authority.",
    `${ltr("ICH Q12")} ابزارهایی برای برنامه‌ریزی تغییرات از پیش اضافه می‌کند: ${ltr("Established Conditions (ECs)")} و ${ltr("PACMP")}. سازمان غذا و دارو روال تغییرات خود را دارد؛ طبقه تغییر با مرجع رگولاتوری تأیید شود.`,
  ),

  // ---------- Validation ----------
  pvTitle: bi("Process validation lifecycle (FDA 2011 · EU GMP Annex 15)", `چرخه عمر Process Validation ${ltr("(FDA 2011 · EU GMP Annex 15)")}`),
  pv: [
    { k: "Stage 1 — Process design", v: bi("Commercial process defined from development and scale-up knowledge: CQAs, CPPs, design space and the control strategy (ICH Q8–Q11).", `تعریف فرایند تجاری بر پایه دانش توسعه و Scale-up: ${ltr("CQA")}ها، ${ltr("CPP")}ها، Design space و راهبرد کنترل ${ltr("(ICH Q8–Q11)")}.`) },
    { k: "Stage 2 — Process qualification", v: bi("Qualified facility, utilities and equipment, then process performance qualification (PPQ) batches under a protocol with predefined acceptance criteria and increased sampling.", "تأسیسات، سیستم‌های پشتیبانی و تجهیزات Qualify‌شده، سپس بچ‌های PPQ طبق پروتکل با معیار پذیرش از پیش تعیین‌شده و نمونه‌برداری گسترده‌تر.") },
    { k: "Stage 3 — Continued process verification", v: bi("Ongoing collection and statistical evaluation of process data during routine production to show the process stays in control.", "جمع‌آوری مستمر و ارزیابی آماری داده‌های فرایند در تولید روتین برای نشان دادن اینکه فرایند در وضعیت کنترل باقی می‌ماند.") },
  ] as Card[],
  pvNotes: [
    bi("Annex 15 accepts traditional validation (a number of batches under routine conditions, generally at least three consecutive batches unless otherwise justified), continuous process verification, or a hybrid of the two.", "Annex 15 سه رویکرد را می‌پذیرد: Validation سنتی (تعدادی بچ در شرایط روتین، به‌طور کلی دست‌کم سه بچ متوالی مگر با توجیه)، Continuous process verification یا ترکیبی از هر دو."),
    bi("Concurrent validation is an exception, justified by a strong benefit to patients, with QP awareness of the higher risk.", "Concurrent validation استثناست و فقط با منفعت روشن برای بیمار توجیه می‌شود، با آگاهی QP از ریسک بالاتر."),
    bi("A validation master plan (VMP) lists the systems, the approach, responsibilities and the schedule.", "Validation Master Plan (VMP) سیستم‌ها، رویکرد، مسئولیت‌ها و زمان‌بندی را فهرست می‌کند."),
    bi("Ongoing process verification and the PQR together confirm the validated state; requalification is periodic or triggered by change.", "Ongoing process verification و PQR در کنار هم وضعیت Validated را تأیید می‌کنند؛ Requalification دوره‌ای یا در پی تغییر انجام می‌شود."),
  ],
  qualTitle: bi("Equipment qualification stages", "مراحل Qualification تجهیزات"),
  qual: [
    { k: "URS", v: bi("User requirement specification: what the equipment must do, its capacity, materials of construction and GMP requirements.", "مشخصات نیاز کاربر: کارکرد مورد انتظار تجهیز، ظرفیت، جنس قطعات و الزامات GMP.") },
    { k: "DQ", v: bi("Design qualification: documented proof that the chosen design meets the URS.", "Design Qualification: اثبات مستند اینکه طراحی انتخاب‌شده URS را برآورده می‌کند.") },
    { k: "FAT / SAT", v: bi("Factory and site acceptance tests; results can support IQ/OQ when the conditions are equivalent.", "آزمون پذیرش در کارخانه سازنده و در محل؛ در صورت یکسان بودن شرایط می‌تواند پشتوانه IQ و OQ باشد.") },
    { k: "IQ", v: bi("Installation qualification: installed as designed, with drawings, certificates, calibration of instruments and utilities connected.", "Installation Qualification: نصب مطابق طراحی، با نقشه‌ها، گواهی‌ها، کالیبراسیون ابزارها و اتصال سیستم‌های پشتیبانی.") },
    { k: "OQ", v: bi("Operational qualification: works across its operating ranges, including upper and lower limits and alarms (worst case).", "Operational Qualification: عملکرد درست در محدوده کاری، از جمله حد بالا و پایین و آلارم‌ها (بدترین حالت).") },
    { k: "PQ", v: bi("Performance qualification: performs reproducibly with the actual product or a representative material under routine conditions.", "Performance Qualification: عملکرد تکرارپذیر با محصول واقعی یا ماده معرف در شرایط روتین.") },
  ] as Card[],

  // ---------- Cleaning validation ----------
  cleanTitle: bi("Cleaning validation limits", "حدود Cleaning Validation"),
  cleanLead: bi(
    "In shared facilities, carry-over limits are set from health-based exposure limits (HBEL, as a PDE) per EU GMP Chapters 3 and 5, Annex 15 and the EMA guideline on HBELs (2014).",
    `در تأسیسات مشترک، حدود Carry-over بر پایه حد مواجهه مبتنی بر سلامت (HBEL، به‌صورت PDE) طبق فصل‌های 3 و 5 ${ltr("EU GMP")}، ${ltr("Annex 15")} و راهنمای ${ltr("EMA")} درباره ${ltr("HBEL")} (2014) تعیین می‌شود.`,
  ),
  clean: [
    { k: "PDE", f: "PDE = NOAEL × BW / (F1 × F2 × F3 × F4 × F5)", v: bi("NOAEL in mg/kg/day; BW = 50 kg; F1 species (2–12), F2 inter-individual (10), F3 duration (up to 10), F4 severe toxicity (1–10), F5 when only a LOAEL is known (up to 10).", "NOAEL بر حسب mg/kg/day؛ BW = 50 kg؛ F1 تفاوت گونه (2 تا 12)، F2 تفاوت بین افراد (10)، F3 مدت مطالعه (تا 10)، F4 سمیت شدید (1 تا 10)، F5 وقتی فقط LOAEL در دست است (تا 10).") },
    { k: "MACO", f: "MACO = PDE × MBS / TDD", v: bi("Maximum allowable carry-over of the previous product into the next: MBS = minimum batch size of the next product, TDD = its maximum daily dose.", "حداکثر انتقال مجاز محصول قبلی به محصول بعدی: MBS حداقل اندازه بچ محصول بعدی و TDD حداکثر دوز روزانه آن است.") },
    { k: "Swab limit", f: "Limit = MACO × A(swab) / A(total)", v: bi("Divides the MACO over the shared product-contact surface; corrected for the recovery factor established for each surface material.", "MACO بر کل سطح تماس مشترک تقسیم می‌شود؛ با Recovery factor به‌دست‌آمده برای هر جنس سطح اصلاح می‌شود.") },
    { k: "Legacy criteria", v: bi("0.1% of the minimum daily dose (1/1000) or 10 ppm in the next product were used historically; they can still serve as extra checks, but the HBEL is the scientific basis.", "معیارهای قدیمی 0.1% حداقل دوز روزانه (1/1000) یا 10 ppm در محصول بعدی بودند؛ هنوز می‌توانند کنترل تکمیلی باشند، ولی مبنای علمی HBEL است.") },
  ] as Card[],
  cleanNotes: [
    bi("Visually clean is a precondition for every cleaning; visual inspection alone is not a limit.", "Visually clean پیش‌شرط هر نظافت است؛ بازرسی چشمی به‌تنهایی حد پذیرش محسوب نمی‌شود."),
    bi("Choose the worst case by solubility, toxicity (lowest PDE) and hardest-to-clean equipment parts; justify product grouping.", "بدترین حالت بر اساس انحلال‌پذیری، سمیت (کمترین PDE) و سخت‌ترین قسمت‌های تجهیز برای نظافت انتخاب شود؛ گروه‌بندی محصولات توجیه شود."),
    bi("Include detergent residues and microbial (and, where relevant, endotoxin) limits, not only the active substance.", "علاوه بر ماده مؤثره، باقیمانده Detergent و حدود میکروبی (و در صورت لزوم اندوتوکسین) نیز لحاظ شود."),
    bi("Validate the dirty hold time (end of use to cleaning) and the clean hold time (cleaning to next use).", "Dirty hold time (از پایان استفاده تا نظافت) و Clean hold time (از نظافت تا استفاده بعدی) Validate شوند."),
    bi("Analytical methods for residues are validated at the limit, with recovery studies by swab and by rinse.", "روش‌های آنالیز باقیمانده در سطح حد Validate می‌شوند، همراه با مطالعه Recovery به روش Swab و Rinse."),
  ],

  // ---------- Batch release ----------
  releaseTitle: bi("Batch certification and release (EU GMP Annex 16)", `تأیید و آزادسازی بچ ${ltr("(EU GMP Annex 16)")}`),
  release: [
    bi("The batch was made and tested in line with the marketing authorisation and GMP, at authorised sites.", "بچ در سایت‌های مجاز و مطابق پروانه محصول و GMP ساخته و آزمون شده است."),
    bi("The supply chain of the active substance and key materials is documented and the sites have been audited.", "زنجیره تأمین ماده مؤثره و مواد کلیدی مستند است و سایت‌ها ممیزی شده‌اند."),
    bi("All deviations, OOS results and complaints related to the batch are investigated and assessed for impact.", "همه انحرافات، نتایج OOS و شکایات مربوط به بچ بررسی و اثر آن‌ها ارزیابی شده است."),
    bi("All changes affecting the batch were approved through change control and, where needed, by the authority.", "همه تغییرات مؤثر بر بچ از مسیر کنترل تغییر و در صورت لزوم با تأیید مرجع رگولاتوری اعمال شده‌اند."),
    bi("Batch records are complete and reviewed; in-process controls and finished product results meet specification.", "سوابق بچ کامل و بازبینی شده‌اند؛ نتایج کنترل‌های حین فرایند و محصول نهایی منطبق با مشخصات است."),
    bi("Ongoing stability, validation status and qualification of the equipment used support the batch.", "پایداری جاری، وضعیت Validation و Qualification تجهیزات استفاده‌شده پشتیبان بچ هستند."),
    bi("Only then does the QP (in Iran, the technical manager in charge) certify the batch in a register before release.", "فقط پس از این موارد، QP (در ایران، مسئول فنی) بچ را پیش از آزادسازی در دفتر ثبت تأیید می‌کند."),
  ],

  // ---------- PQR ----------
  pqrTitle: bi("Product quality review (EU GMP 1.10)", `بازنگری کیفیت محصول ${ltr("(PQR · EU GMP 1.10)")}`),
  pqrLead: bi(
    "A yearly review of each product (the US equivalent is the annual product review, 21 CFR 211.180(e)) that checks the process is consistent and the specifications remain appropriate.",
    `بازنگری سالانه هر محصول (معادل آمریکایی آن ${ltr("Annual Product Review، 21 CFR 211.180(e)")}) برای اطمینان از ثبات فرایند و مناسب بودن مشخصات.`,
  ),
  pqr: [
    bi("Starting and packaging materials, especially new sources and the traceability of the active substance supply chain.", "مواد اولیه و بسته‌بندی، به‌ویژه منابع جدید و ردیابی زنجیره تأمین ماده مؤثره."),
    bi("Critical in-process controls and finished product results.", "نتایج کنترل‌های بحرانی حین فرایند و محصول نهایی."),
    bi("Batches that failed specification and their investigations.", "بچ‌های خارج از مشخصات و بررسی‌های آن‌ها."),
    bi("Significant deviations, their investigations and the effectiveness of the CAPA taken.", "انحرافات مهم، بررسی آن‌ها و اثربخشی CAPAهای انجام‌شده."),
    bi("Changes to processes or analytical methods.", "تغییرات فرایند یا روش‌های آنالیز."),
    bi("Variations to the marketing authorisation submitted, granted or refused.", "Variationهای پروانه محصول که ارسال، تأیید یا رد شده‌اند."),
    bi("Results of the stability monitoring programme and any adverse trends.", "نتایج برنامه پایش پایداری و هر روند نامطلوب."),
    bi("Quality-related returns, complaints and recalls and their investigations.", "مرجوعی‌ها، شکایات و فراخوان‌های مرتبط با کیفیت و بررسی آن‌ها."),
    bi("Adequacy of earlier corrective actions on the process or equipment.", "کفایت اقدامات اصلاحی قبلی روی فرایند یا تجهیزات."),
    bi("Post-marketing commitments for new authorisations and variations.", "تعهدات پس از ورود به بازار برای پروانه‌ها و Variationهای جدید."),
    bi("Qualification status of equipment and utilities (HVAC, water, compressed gases).", "وضعیت Qualification تجهیزات و سیستم‌های پشتیبانی (HVAC، آب، گازهای فشرده)."),
    bi("Technical (quality) agreements, kept up to date.", "به‌روز بودن قراردادهای فنی (کیفیت)."),
  ],

  // ---------- Suppliers ----------
  supplierTitle: bi("Supplier qualification", "ارزیابی و تأیید تأمین‌کنندگان"),
  supplier: [
    { title: bi("Risk assessment", "ارزیابی ریسک"), text: bi("Rank materials and suppliers by criticality (API, excipient, primary packaging, printed material) and by the supplier's history.", "رتبه‌بندی مواد و تأمین‌کنندگان بر اساس بحرانی بودن (API، Excipient، بسته‌بندی اولیه، مواد چاپی) و سابقه تأمین‌کننده.") },
    { title: bi("Questionnaire and audit", "پرسشنامه و ممیزی"), text: bi("Desk review of documents and certificates, then an on-site audit for critical materials (APIs to ICH Q7), repeated at a risk-based frequency.", `بررسی مدارک و گواهی‌ها، سپس ممیزی حضوری برای مواد بحرانی (API بر اساس ${ltr("ICH Q7")})، با تکرار متناسب با ریسک.`) },
    { title: bi("Quality agreement", "قرارداد کیفیت"), text: bi("Written responsibilities for specifications, change notification, deviations, testing, CoA and audit rights.", "مسئولیت‌های مکتوب درباره مشخصات، اطلاع‌رسانی تغییر، انحرافات، آزمون‌ها، CoA و حق ممیزی.") },
    { title: bi("Reduced testing", "آزمون کاهش‌یافته"), text: bi("Full analysis of at least three batches before relying on the supplier's CoA (ICH Q7 §7.3), with full analysis repeated at intervals and identity tested on every receipt.", `آنالیز کامل دست‌کم سه بچ پیش از اتکا به CoA تأمین‌کننده ${ltr("(ICH Q7 §7.3)")}، با تکرار دوره‌ای آنالیز کامل و آزمون هویت در هر ورود.`) },
    { title: bi("Approved supplier list", "فهرست تأمین‌کنندگان تأییدشده"), text: bi("Only approved manufacturer–site combinations are used; status is reviewed with complaints, rejections and audit results.", "فقط ترکیب‌های تأییدشده سازنده و سایت استفاده می‌شوند؛ وضعیت با شکایات، مرجوعی‌ها و نتایج ممیزی بازنگری می‌شود.") },
  ],

  // ---------- Recalls ----------
  recallTitle: bi("Quality defects and recall classes", "نقص کیفی و طبقات فراخوان"),
  recallCols: [bi("Class", "طبقه"), bi("System", "مرجع"), bi("Meaning", "مفهوم")],
  recall: [
    ["Class I", "FDA", bi("Reasonable probability that use of the product will cause serious adverse health consequences or death.", "احتمال معقول که مصرف محصول به پیامد جدی سلامت یا مرگ منجر شود.")],
    ["Class II", "FDA", bi("Use may cause temporary or medically reversible adverse health consequences, or serious harm is remote.", "مصرف ممکن است پیامد موقت یا قابل‌برگشت پزشکی ایجاد کند، یا احتمال آسیب جدی کم است.")],
    ["Class III", "FDA", bi("Use is not likely to cause adverse health consequences (e.g. a labelling error without risk).", "مصرف احتمالاً پیامد نامطلوب سلامتی ندارد؛ مثلاً خطای برچسب بدون ریسک.")],
    ["Class 1", "EU · Rapid Alert", bi("Potentially life-threatening or serious risk to health; rapid alert to all authorities, recall usually to patient level.", "خطر بالقوه تهدیدکننده حیات یا خطر جدی برای سلامت؛ هشدار سریع به همه مراجع و فراخوان معمولاً تا سطح بیمار.")],
    ["Class 2", "EU · Rapid Alert", bi("Could cause illness or mistreatment, but not Class 1.", "می‌تواند به بیماری یا درمان نادرست منجر شود، ولی در حد طبقه 1 نیست.")],
    ["Class 3", "EU", bi("May not pose a significant hazard to health; withdrawal may be for other reasons.", "احتمالاً خطر قابل توجهی برای سلامت ندارد؛ جمع‌آوری ممکن است به دلایل دیگر باشد.")],
  ] as [string, string, Bi][],
  recallNote: bi(
    "Every complaint is assessed for a possible quality defect; recall decisions, notification of the authority and mock recalls follow EU GMP Chapter 8.",
    `هر شکایت از نظر احتمال نقص کیفی ارزیابی می‌شود؛ تصمیم فراخوان، اطلاع به مرجع رگولاتوری و فراخوان آزمایشی ${ltr("(Mock recall)")} طبق فصل 8 ${ltr("EU GMP")} انجام می‌شود.`,
  ),

  // ---------- Inspections ----------
  inspTitle: bi("GMP inspections: how findings are graded", "بازرسی GMP: درجه‌بندی یافته‌ها"),
  insp: [
    { k: "Critical (PIC/S)", v: bi("Has produced, or leads to a significant risk of producing, a product harmful to patients; or fraud, falsification of data.", "به تولید محصول زیان‌آور برای بیمار منجر شده یا ریسک قابل توجه آن را دارد؛ یا تقلب و جعل داده.") },
    { k: "Major (PIC/S)", v: bi("Non-critical, but has produced or may produce a product not complying with its authorisation, or a major departure from GMP; several related \"other\" findings may add up to a major.", "بحرانی نیست، ولی به محصول نامنطبق با پروانه منجر شده یا ممکن است بشود، یا انحراف عمده از GMP است؛ چند یافته «Other» مرتبط می‌توانند Major محسوب شوند.") },
    { k: "Other (PIC/S)", v: bi("A departure from GMP that cannot be classed as critical or major.", "انحراف از GMP که در طبقه Critical یا Major قرار نمی‌گیرد.") },
    { k: "FDA Form 483", v: bi("Inspectional observations handed over at the close of an inspection. A written response within 15 business days is considered before further action.", "مشاهدات بازرسی که در پایان بازرسی تحویل داده می‌شود. پاسخ مکتوب ظرف 15 روز کاری پیش از اقدام بعدی بررسی می‌شود.") },
    { k: "NAI · VAI · OAI", v: bi("FDA's final classification: No Action Indicated, Voluntary Action Indicated, Official Action Indicated (may lead to a Warning Letter or import alert).", "طبقه‌بندی نهایی FDA: No Action Indicated، Voluntary Action Indicated و Official Action Indicated (ممکن است به Warning Letter یا Import alert برسد).") },
    { k: "Readiness", v: bi("Self-inspection programme, a front/back room, trained subject-matter experts, documents retrievable in minutes and honest, data-based answers.", "برنامه خودبازرسی، اتاق جلو و پشت (Front / Back room)، کارشناسان آموزش‌دیده، دسترسی به مستندات در چند دقیقه و پاسخ صادقانه و مبتنی بر داده.") },
  ] as Card[],
  inspNote: bi("Sources: PIC/S PI 040 (classification of GMP deficiencies); FDA Investigations Operations Manual.", `منابع: ${ltr("PIC/S PI 040")} (طبقه‌بندی نواقص GMP)؛ ${ltr("FDA Investigations Operations Manual")}.`),

  // ---------- Metrics and SPC ----------
  metricsTitle: bi("Quality metrics and statistical process control", "شاخص‌های کیفیت و کنترل آماری فرایند"),
  metricsLead: bi(
    "Indicators that show whether the quality system works, based on FDA's quality metrics draft guidance (2016) and common SPC practice for PQR trending.",
    `شاخص‌هایی که نشان می‌دهند سیستم کیفیت کار می‌کند؛ بر پایه پیش‌نویس راهنمای ${ltr("Quality Metrics")} سازمان ${ltr("FDA")} (2016) و روش‌های رایج ${ltr("SPC")} برای روندیابی در ${ltr("PQR")}.`,
  ),
  metrics: [
    { k: "Lot acceptance rate", f: "LAR = accepted lots / lots started", v: bi("Share of the lots started that are accepted; falls with rejections and reprocessing.", "سهم بچ‌های شروع‌شده که پذیرفته می‌شوند؛ با رد شدن یا بازفراوری بچ کاهش می‌یابد.") },
    { k: "Complaint rate", f: "PQCR = quality complaints / released lots", v: bi("Product quality complaints per lot released; trended by product and type.", "شکایات کیفی به ازای هر بچ آزادشده؛ به تفکیک محصول و نوع شکایت روندیابی می‌شود.") },
    { k: "Invalidated OOS rate", f: "IOOSR = invalidated OOS / total OOS", v: bi("A high rate suggests weak laboratory control or results being invalidated without a proven assignable cause.", "نرخ بالا نشانه کنترل ضعیف آزمایشگاه یا ابطال نتایج بدون علت قابل انتساب اثبات‌شده است.") },
    { k: "Cp · Cpk", f: "Cpk = min(USL − μ, μ − LSL) / 3σ", v: bi("Process capability against the specification. Cpk ≥ 1.33 is generally regarded as capable; below 1.0 the process cannot meet specification reliably.", "توانایی فرایند نسبت به مشخصات. Cpk ≥ 1.33 به‌طور معمول توانمند شمرده می‌شود؛ زیر 1.0 فرایند نمی‌تواند به‌طور قابل اعتماد مشخصات را برآورده کند.") },
    { k: "Control limits", f: "UCL / LCL = mean ± 3σ", v: bi("Shewhart chart limits come from the process itself, not from the specification; points beyond them signal a special cause.", "حدود نمودار Shewhart از خود فرایند به‌دست می‌آید نه از مشخصات؛ نقطه خارج از آن‌ها نشانه علت ویژه است.") },
    { k: "Run rules", v: bi("Western Electric: 1 point beyond 3σ; 2 of 3 beyond 2σ on one side; 4 of 5 beyond 1σ on one side; 8 in a row on one side of the centre line. Nelson adds 6 in a row rising or falling.", "قواعد Western Electric: یک نقطه خارج از 3σ؛ 2 از 3 نقطه فراتر از 2σ در یک سمت؛ 4 از 5 نقطه فراتر از 1σ در یک سمت؛ 8 نقطه پیاپی در یک سمت خط مرکزی. Nelson قاعده 6 نقطه پیاپی صعودی یا نزولی را اضافه می‌کند.") },
  ] as Card[],

  // ---------- Sterile ----------
  ccsTitle: bi("Contamination control strategy and aseptic process simulation (Annex 1, 2022)", `راهبرد کنترل آلودگی و شبیه‌سازی فرایند آسپتیک ${ltr("(Annex 1, 2022)")}`),
  ccs: [
    bi("The CCS is one documented strategy covering design of plant and process, premises, equipment, personnel, utilities, raw materials, containers and closures, suppliers and outsourcing.", "CCS یک راهبرد مستند واحد است که طراحی کارخانه و فرایند، ساختمان، تجهیزات، کارکنان، سیستم‌های پشتیبانی، مواد اولیه، ظروف و درپوش‌ها، تأمین‌کنندگان و برون‌سپاری را پوشش می‌دهد."),
    bi("It also covers validation of sterilisation, cleaning and disinfection, preventive maintenance, environmental and process monitoring, and trend analysis with CAPA.", "همچنین Validation استریلیزاسیون، نظافت و ضدعفونی، نگهداری پیشگیرانه، پایش محیط و فرایند و تحلیل روند همراه با CAPA را در بر می‌گیرد."),
    bi("Aseptic process simulation (media fill): three consecutive successful runs per shift for initial qualification, then twice a year for each process, line and shift.", "Aseptic process simulation (Media fill): سه اجرای موفق متوالی برای هر شیفت در Qualification اولیه، سپس دو بار در سال برای هر فرایند، خط و شیفت."),
    bi("APS covers the worst-case interventions and the longest permitted duration; filled units are incubated for at least 14 days.", "APS بدترین مداخلات و طولانی‌ترین مدت مجاز را پوشش می‌دهد؛ واحدهای پرشده دست‌کم 14 روز انکوبه می‌شوند."),
    bi("The target is zero growth: any contaminated unit means a failed run, an investigation and, as a rule, repeat simulations.", "هدف، صفر واحد آلوده است: هر واحد آلوده یعنی اجرای ناموفق، بررسی کامل و معمولاً تکرار شبیه‌سازی."),
    bi("Annex 1 expects PUPSIT (pre-use post-sterilisation integrity testing) of sterilising filters unless justified by risk assessment.", "Annex 1 انجام PUPSIT (آزمون Integrity فیلتر استریل‌کننده پس از استریلیزاسیون و پیش از استفاده) را انتظار دارد، مگر با توجیه ارزیابی ریسک."),
  ],

  // ---------- Documentation ----------
  gdpTitle: bi("Good documentation practice", "مستندسازی صحیح (GDocP)"),
  gdp: [
    bi("Write entries at the time of the activity, in indelible ink, legibly; never in pencil and never on loose paper.", "ثبت در زمان انجام کار، با جوهر پاک‌نشدنی و خوانا؛ هرگز با مداد یا روی کاغذ جداگانه."),
    bi("Correct with a single line so the original stays readable, with initials, date and reason; no correction fluid, no overwriting.", "اصلاح با یک خط به‌طوری که متن اصلی خوانا بماند، همراه با امضای کوتاه، تاریخ و دلیل؛ بدون لاک غلط‌گیر و بدون نوشتن روی متن."),
    bi("No blank fields: unused spaces are lined through or marked N/A.", "هیچ فیلدی خالی نماند: فضاهای استفاده‌نشده خط زده یا با N/A مشخص شوند."),
    bi("Never back-date or pre-date; the person who did the work signs, and a second person verifies critical steps.", "هیچ تاریخی عقب یا جلو ثبت نشود؛ انجام‌دهنده کار امضا می‌کند و مراحل بحرانی را نفر دوم تأیید می‌کند."),
    bi("Forms and logbooks are issued and reconciled under control; obsolete versions are withdrawn.", "فرم‌ها و دفاتر ثبت به‌صورت کنترل‌شده صادر و تطبیق داده می‌شوند؛ نسخه‌های منسوخ جمع‌آوری می‌شوند."),
    bi("A signature list links each signature and initials to a named person.", "فهرست امضاها هر امضا و امضای کوتاه را به فرد مشخصی مرتبط می‌کند."),
  ],
};

export const qcMore = {
  // ---------- Specifications ----------
  specTitle: bi("What a finished-product specification contains (ICH Q6A)", `اجزای مشخصات محصول نهایی ${ltr("(ICH Q6A)")}`),
  specLead: bi(
    "Universal tests apply to every new drug product: description, identification, assay and impurities. Specific tests depend on the dosage form.",
    "آزمون‌های عمومی برای همه فرآورده‌های جدید لازم است: Description، Identification، Assay و Impurities. آزمون‌های اختصاصی به شکل دارویی بستگی دارند.",
  ),
  specCols: [bi("Dosage form", "شکل دارویی"), bi("Specific tests to consider", "آزمون‌های اختصاصی")],
  spec: [
    [bi("Tablets and capsules", "قرص و کپسول"), bi("Dissolution (or disintegration), hardness / friability, uniformity of dosage units, water content, microbial limits.", "Dissolution (یا Disintegration)، سختی و Friability، یکنواختی واحدهای دارویی، مقدار آب، حدود میکروبی.")],
    [bi("Oral liquids", "مایعات خوراکی"), bi("Uniformity of dosage units, pH, microbial limits, preservative and antioxidant content, extractables, alcohol content, dissolution and particle size (suspensions), redispersibility, rheology, reconstitution time.", "یکنواختی واحدهای دارویی، pH، حدود میکروبی، مقدار Preservative و Antioxidant، Extractables، مقدار الکل، Dissolution و اندازه ذره (سوسپانسیون)، قابلیت بازپراکنش، رئولوژی و زمان بازسازی.")],
    [bi("Parenterals", "فرآورده‌های تزریقی"), bi("Sterility, bacterial endotoxins, particulate matter, pH, uniformity of dosage units, water content (powders), preservative and antioxidant content, extractables, osmolality, functionality of the delivery system, reconstitution time.", "استریلیتی، اندوتوکسین باکتریایی، Particulate matter، pH، یکنواختی واحدهای دارویی، مقدار آب (پودرها)، مقدار Preservative و Antioxidant، Extractables، اسمولالیته، عملکرد سیستم تجویز و زمان بازسازی.")],
  ] as [Bi, Bi][],

  // ---------- Particulate matter ----------
  partTitle: bi("Sub-visible particles in injections (USP <788> · Ph. Eur. 2.9.19)", `ذرات زیرمرئی در تزریقی‌ها ${ltr("(USP <788> · Ph. Eur. 2.9.19)")}`),
  partCols: [bi("Method", "روش"), bi("Particle size", "اندازه ذره"), bi("Volume ≤ 100 mL (per container)", `حجم ${ltr("≤ 100 mL")} (در هر ظرف)`), bi("Volume > 100 mL (per mL)", `حجم ${ltr("> 100 mL")} (در هر ${ltr("mL")})`)],
  part: [
    ["Light obscuration", "≥ 10 µm", "6000", "25"],
    ["Light obscuration", "≥ 25 µm", "600", "3"],
    ["Microscopic count", "≥ 10 µm", "3000", "12"],
    ["Microscopic count", "≥ 25 µm", "300", "2"],
  ],
  partNote: bi(
    "Light obscuration is the first method; the microscopic count is used when the product cannot be tested by it or fails it. Visible particles are covered by USP <790> (100% inspection plus an AQL check) and container closure integrity by USP <1207>.",
    `روش اول Light obscuration است؛ اگر فرآورده با این روش قابل آزمون نباشد یا مردود شود، شمارش میکروسکوپی انجام می‌شود. ذرات مرئی در ${ltr("USP <790>")} (بازرسی 100% به‌علاوه کنترل AQL) و سلامت سیستم بسته‌بندی در ${ltr("USP <1207>")} پوشش داده می‌شوند.`,
  ),

  // ---------- Mutagenic impurities ----------
  m7Title: bi("Mutagenic impurities (ICH M7(R2))", `ناخالصی‌های جهش‌زا ${ltr("(ICH M7(R2))")}`),
  m7: [
    { k: "Class 1", v: bi("Known mutagenic carcinogens: control at or below a compound-specific acceptable intake.", "کارسینوژن‌های جهش‌زای شناخته‌شده: کنترل در حد یا کمتر از Acceptable intake اختصاصی همان ترکیب.") },
    { k: "Class 2", v: bi("Known mutagens with unknown carcinogenic potential: control at or below the TTC (or LTL).", "جهش‌زاهای شناخته‌شده با پتانسیل سرطان‌زایی نامعلوم: کنترل در حد یا کمتر از TTC (یا LTL).") },
    { k: "Class 3", v: bi("Alerting structure without mutagenicity data: control at the TTC, or run a bacterial mutagenicity (Ames) test.", "دارای ساختار هشداردهنده و بدون داده جهش‌زایی: کنترل در حد TTC یا انجام آزمون Ames.") },
    { k: "Class 4", v: bi("Alert shared with the drug substance or related compounds that tested negative: treat as a non-mutagenic impurity.", "ساختار هشداردهنده مشترک با ماده مؤثره یا ترکیبات مرتبطی که آزمون منفی داشته‌اند: مانند ناخالصی غیرجهش‌زا رفتار می‌شود.") },
    { k: "Class 5", v: bi("No structural alert, or Ames negative: treat as a non-mutagenic impurity (ICH Q3A/Q3B).", `بدون ساختار هشداردهنده یا Ames منفی: ناخالصی غیرجهش‌زا ${ltr("(ICH Q3A/Q3B)")}.`) },
  ] as Card[],
  ltlTitle: bi("Acceptable intake by duration of treatment (single impurity)", "Acceptable intake بر حسب مدت درمان (یک ناخالصی)"),
  ltlCols: [bi("Duration", "مدت درمان"), bi("Daily intake (µg/day)", "مصرف روزانه (µg/day)")],
  ltl: [
    ["≤ 1 month", "120"],
    ["> 1–12 months", "20"],
    ["> 1–10 years", "10"],
    ["> 10 years to lifetime", "1.5 (TTC)"],
  ],

  // ---------- Nitrosamines ----------
  nitroTitle: bi("Nitrosamine impurities", "ناخالصی‌های نیتروزآمین"),
  nitroLead: bi(
    "Acceptable intakes published by EMA and FDA. For nitrosamine drug substance-related impurities (NDSRIs) without data, the Carcinogenic Potency Categorisation Approach (CPCA) assigns a limit by structure.",
    `Acceptable intake منتشرشده توسط ${ltr("EMA")} و ${ltr("FDA")}. برای نیتروزآمین‌های مرتبط با ماده مؤثره ${ltr("(NDSRI)")} که داده ندارند، روش ${ltr("CPCA")} بر اساس ساختار، حد تعیین می‌کند.`,
  ),
  nitroCols: [bi("Nitrosamine or CPCA category", "نیتروزآمین یا طبقه CPCA"), bi("Acceptable intake (ng/day)", "Acceptable intake (ng/day)")],
  nitro: [
    ["NDMA", "96"],
    ["NDEA", "26.5"],
    ["NMBA", "96"],
    ["NEIPA · NDIPA", "26.5"],
    ["CPCA category 1", "18"],
    ["CPCA category 2", "100"],
    ["CPCA category 3", "400"],
    ["CPCA category 4 · 5", "1500"],
  ],
  nitroFormula: "Limit (ppm) = AI (ng/day) / MDD (mg/day)",
  nitroNote: bi(
    "MDD = maximum daily dose of the drug product. The limits change as new data are assessed; check the current EMA Q&A and FDA tables before use.",
    "MDD حداکثر دوز روزانه فرآورده است. این حدود با ارزیابی داده‌های جدید تغییر می‌کنند؛ پیش از استفاده جدول‌های جاری EMA و FDA بررسی شوند.",
  ),

  // ---------- Stability storage conditions ----------
  condTitle: bi("Stability storage conditions (ICH Q1A(R2))", `شرایط نگهداری مطالعات پایداری ${ltr("(ICH Q1A(R2))")}`),
  condCols: [bi("Study", "مطالعه"), bi("Storage condition", "شرایط نگهداری"), bi("Minimum period at submission", "حداقل مدت هنگام ارسال پرونده")],
  cond: [
    [bi("Long-term (general case)", "بلندمدت (حالت عمومی)"), "25 °C ± 2 °C / 60% RH ± 5% RH  or  30 °C ± 2 °C / 65% RH ± 5% RH", "12 months"],
    [bi("Intermediate", "میانی"), "30 °C ± 2 °C / 65% RH ± 5% RH", "6 months"],
    [bi("Accelerated", "تسریع‌شده"), "40 °C ± 2 °C / 75% RH ± 5% RH", "6 months"],
    [bi("Refrigerated: long-term", "یخچالی: بلندمدت"), "5 °C ± 3 °C", "12 months"],
    [bi("Refrigerated: accelerated", "یخچالی: تسریع‌شده"), "25 °C ± 2 °C / 60% RH ± 5% RH", "6 months"],
    [bi("Frozen: long-term", "منجمد: بلندمدت"), "−20 °C ± 5 °C", "12 months"],
  ] as [Bi, string, string][],
  zonesTitle: bi("Climatic zones (WHO)", "مناطق اقلیمی (WHO)"),
  zonesCols: [bi("Zone", "منطقه"), bi("Climate", "اقلیم"), bi("Long-term condition", "شرایط بلندمدت")],
  zones: [
    ["I", bi("Temperate", "معتدل"), "21 °C / 45% RH"],
    ["II", bi("Subtropical and Mediterranean", "نیمه‌گرمسیری و مدیترانه‌ای"), "25 °C / 60% RH"],
    ["III", bi("Hot and dry", "گرم و خشک"), "30 °C / 35% RH"],
    ["IVa", bi("Hot and humid", "گرم و مرطوب"), "30 °C / 65% RH"],
    ["IVb", bi("Hot and very humid", "گرم و بسیار مرطوب"), "30 °C / 75% RH"],
  ] as [string, Bi, string][],
  condNote: bi(
    "Products in semi-permeable containers are tested at low humidity (e.g. 25 °C / 40% RH). ICH is consolidating Q1A–Q1F into a single revised Q1 guideline; check its status.",
    `فرآورده‌های داخل ظروف نیمه‌تراوا در رطوبت پایین آزمون می‌شوند (مثلاً ${ltr("25 °C / 40% RH")}). ${ltr("ICH")} در حال ادغام ${ltr("Q1A–Q1F")} در یک راهنمای بازنگری‌شده ${ltr("Q1")} است؛ وضعیت آن بررسی شود.`,
  ),

  // ---------- Techniques ----------
  techTitle: bi("Analytical techniques and their pharmacopoeial chapters", "روش‌های آنالیز و فصل‌های فارماکوپه‌ای آن‌ها"),
  techCols: [bi("Technique", "روش"), bi("Typical QC use", "کاربرد رایج در QC"), bi("USP", "USP"), bi("Ph. Eur.", ltr("Ph. Eur."))],
  tech: [
    ["HPLC / UHPLC", bi("Assay, related substances, dissolution samples", "Assay، ناخالصی‌های مرتبط، نمونه‌های انحلال"), "<621>", "2.2.29 · 2.2.46"],
    ["GC (headspace)", bi("Residual solvents, volatile impurities", "حلال‌های باقیمانده، ناخالصی‌های فرار"), "<621> · <467>", "2.2.28 · 2.4.24"],
    ["UV-Vis", bi("Assay, dissolution, identification", "Assay، انحلال، شناسایی"), "<857>", "2.2.25"],
    ["FT-IR (ATR)", bi("Identification of APIs and excipients", "شناسایی API و Excipient"), "<854>", "2.2.24"],
    ["NIR · Raman", bi("Identity of each container at receipt, PAT", "شناسایی هر ظرف هنگام ورود، PAT"), "<856> · <858>", "2.2.40 · 2.2.48"],
    ["Karl Fischer", bi("Water content (volumetric; coulometric for low levels)", "مقدار آب (حجمی؛ کولومتری برای مقادیر کم)"), "<921>", "2.5.12 · 2.5.32"],
    ["Loss on drying", bi("Volatile matter including water", "مواد فرار از جمله آب"), "<731>", "2.2.32"],
    ["XRPD", bi("Polymorphic form, crystallinity", "شکل پلی‌مورفی، درجه بلورینگی"), "<941>", "2.9.33"],
    ["DSC · TGA", bi("Melting, polymorphs, solvates, compatibility", "ذوب، پلی‌مورف‌ها، سالوات‌ها، سازگاری"), "<891>", "2.2.34"],
    ["Laser diffraction", bi("Particle size distribution of APIs", "توزیع اندازه ذرات API"), "<429>", "2.9.31"],
    ["ICP-OES · ICP-MS", bi("Elemental impurities", "ناخالصی‌های عنصری"), "<233>", "2.2.57 · 2.2.58"],
    ["TOC · conductivity", bi("Pharmaceutical water, cleaning rinse samples", "آب دارویی، نمونه‌های Rinse نظافت"), "<643> · <645>", "2.2.44 · 2.2.38"],
    ["pH · optical rotation", bi("Solutions, chiral identity and purity", "محلول‌ها، شناسایی و خلوص کایرال"), "<791> · <781>", "2.2.3 · 2.2.7"],
  ] as [string, Bi, string, string][],

  // ---------- Reference standards ----------
  stdTitle: bi("Reference standards", "استانداردهای مرجع (Reference standards)"),
  std: [
    { k: "Primary", v: bi("Official pharmacopoeial standards (USP RS, EDQM CRS, BP CRS) used without further characterisation for their intended use; or an in-house substance fully characterised for identity and purity.", "استانداردهای رسمی فارماکوپه (USP RS، EDQM CRS، BP CRS) که برای کاربرد تعیین‌شده بدون تعیین ویژگی بیشتر استفاده می‌شوند؛ یا ماده داخلی که هویت و خلوص آن کامل تعیین شده است.") },
    { k: "Secondary (working)", v: bi("Qualified against the primary standard with a documented protocol; potency assigned, traceable, with an expiry or requalification date (ICH Q7 §11.1).", `در برابر استاندارد اولیه طبق پروتکل مستند Qualify می‌شود؛ قدرت (Potency) تعیین‌شده، قابل ردیابی، با تاریخ انقضا یا Requalification ${ltr("(ICH Q7 §11.1)")}.`) },
    { k: "Handling", v: bi("Store as labelled, record each use, check the current lot is valid (pharmacopoeial \"valid use date\"), and never use a standard for a purpose it was not assigned.", "نگهداری طبق برچسب، ثبت هر استفاده، بررسی اعتبار لات جاری (Valid use date فارماکوپه) و عدم استفاده از استاندارد برای کاربردی که برای آن تعیین نشده است.") },
  ] as Card[],

  // ---------- OOT ----------
  ootTitle: bi("Out-of-trend (OOT) results", "نتایج خارج از روند (OOT)"),
  oot: [
    bi("An OOT result is within specification but does not follow the expected trend of earlier results (stability time points, batch history).", "نتیجه OOT داخل مشخصات است ولی از روند مورد انتظار نتایج قبلی (نقاط زمانی پایداری یا سابقه بچ‌ها) پیروی نمی‌کند."),
    bi("Define detection methods in advance: regression with prediction intervals for stability, control charts for release data, by-time-point limits.", "روش تشخیص از پیش تعریف شود: رگرسیون با Prediction interval برای پایداری، نمودار کنترل برای داده‌های آزادسازی و حدود به تفکیک نقطه زمانی."),
    bi("Investigate like an OOS (laboratory check first), but the outcome is often a closer watch or an earlier time point, not batch rejection.", "مانند OOS بررسی شود (ابتدا بررسی آزمایشگاهی)، ولی نتیجه اغلب پایش دقیق‌تر یا افزودن نقطه زمانی است نه رد بچ."),
    bi("A confirmed adverse stability trend can shorten the shelf life and must be reported in the PQR and, where required, to the authority.", "روند نامطلوب تأییدشده در پایداری می‌تواند عمر مفید را کوتاه کند و باید در PQR و در صورت لزوم به مرجع رگولاتوری گزارش شود."),
  ],
};
