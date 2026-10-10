import { bi } from "@/i18n/bi";

export const siteConfig = {
  name: "PharmaVault",
  domain: "pharmavault.ir",
  url: "https://pharmavault.ir",
  email: "info@pharmavault.ir",
};

/** Site-wide copy. Every string is held in both languages. */
export const copy = {
  meta: {
    title: bi(
      "PharmaVault — The Pharmaceutical Information Vault",
      "PharmaVault — گنجینه اطلاعات داروسازی",
    ),
    description: bi(
      "A specialised pharmaceutical knowledge platform for R&D, production, quality control, quality assurance, regulatory affairs and supply chain, and for students and pharmacies: excipient and API databases, a supplier bank, pharmaceutical calculations, GMP SOPs and CTD/ICH references.",
      "پلتفرم دانش و اطلاعات تخصصی دارویی برای تحقیق و توسعه، تولید، کنترل کیفیت، تضمین کیفیت، امور رگولاتوری و زنجیره تأمین و نیز دانشجویان و داروخانه‌ها: پایگاه‌های داده مواد جانبی و مواد مؤثره، بانک تأمین‌کنندگان، محاسبات داروسازی، دستورالعمل‌های GMP و مرجع CTD و ICH.",
    ),
  },
  platform: bi("Pharmaceutical Knowledge Hub", "مرکز دانش دارویی"),
  slogan: bi("The Pharmaceutical Information Vault", "گنجینه اطلاعات داروسازی"),

  nav: {
    home: bi("Home", "خانه"),
    sections: bi("Sections", "بخش‌ها"),
    tools: bi("Calculations", "محاسبات"),
    plans: bi("Plans", "اشتراک"),
    enterprise: bi("Enterprise", "راهکار سازمانی"),
    requestAccess: bi("Request access", "درخواست دسترسی"),
    menu: bi("Menu", "منو"),
    close: bi("Close menu", "بستن منو"),
    language: bi("Language", "زبان"),
    skipToContent: bi("Skip to content", "رفتن به محتوای اصلی"),
    allSections: bi("All sections", "همه بخش‌ها"),
  },

  hero: {
    headline: bi(
      "Integrated knowledge, sharper decisions, smarter drug development",
      "دانش یکپارچه، تصمیم‌گیری دقیق‌تر، توسعه هوشمندانه‌تر دارو",
    ),
    audience: bi(
      "For professionals in research and development (R&D), quality assurance (QA) and quality control (QC), regulatory affairs (RA), pharmacy and pharmaceutical sciences students, everyone working in the pharmaceutical sector, and pharmacies.",
      "ویژه متخصصان تحقیق و توسعه (R&D)، تضمین کیفیت (QA) و کنترل کیفیت (QC)، امور رگولاتوری (RA)، دانشجویان داروسازی و علوم دارویی، فعالان حوزه دارو و داروخانه‌ها.",
    ),
    browse: bi("Browse the sections", "مرور بخش‌ها"),
    supplierSearch: bi("Search the supplier bank", "جستجو در بانک تأمین‌کنندگان"),
    seePlans: bi("See subscription plans", "مشاهده طرح‌های اشتراک"),
    referencesLabel: bi("Referenced standards", "مراجع مورد استناد"),
    references: ["USP–NF", "Ph. Eur.", "JP", "ICH Q1–Q14", "ICH M4 (CTD)", "PIC/S GMP"],
    pillars: [
      {
        title: bi("Evidence-based", "مستند و مبتنی بر مرجع"),
        text: bi(
          "Functional categories, concentration ranges and specifications traceable to compendial and ICH references",
          "طبقه‌بندی عملکردی، محدوده غلظت و مشخصات، قابل ردیابی تا مراجع فارماکوپه‌ای و راهنماهای ICH",
        ),
      },
      {
        title: bi("Development-oriented", "توسعه‌محور"),
        text: bi(
          "Covers the path from pre-formulation and excipient selection to scale-up and technology transfer",
          "پوشش مسیر پیش‌فرمولاسیون و انتخاب ماده جانبی تا افزایش مقیاس و انتقال فناوری",
        ),
      },
      {
        title: bi("GMP & regulatory-ready", "منطبق بر GMP و الزامات ثبت"),
        text: bi(
          "Procedures and references structured around PIC/S GMP, the ICH Q series and the CTD (ICH M4)",
          "دستورالعمل‌ها و مراجع ساختاریافته بر پایه \u2066PIC/S GMP\u2069، راهنماهای سری \u2066ICH Q\u2069 و ساختار \u2066CTD (ICH M4)\u2069",
        ),
      },
    ],
  },

  statement: {
    title: bi(
      "The specialist reference for pharmaceutical knowledge, information and tools",
      "مرجع تخصصی دانش، اطلاعات و ابزارهای داروسازی",
    ),
    text: bi(
      "From raw material sourcing and formulation development to technical calculations and quality and regulatory requirements — built on authoritative, citable scientific sources.",
      "از تأمین مواد اولیه و توسعه فرمولاسیون تا محاسبات فنی، الزامات کیفی و رگولاتوری؛ مبتنی بر منابع علمی معتبر و قابل استناد.",
    ),
  },

  departments: {
    eyebrow: bi("Who it is for", "برای چه کسانی"),
    title: bi("Built for industry, students and pharmacies", "طراحی‌شده برای صنعت دارو، دانشجویان و داروخانه‌ها"),
    lead: bi(
      "Every department of a pharmaceutical company — and students and pharmacists — gets the references and tools they use every day, in one subscription.",
      "هر واحد شرکت داروسازی، و همچنین دانشجویان و داروسازان داروخانه، مراجع و ابزارهایی را که هر روز به آن‌ها نیاز دارند در یک اشتراک در اختیار دارند.",
    ),
    items: [
      {
        key: "rnd",
        title: bi("Research & Development (R&D)", "تحقیق و توسعه (R&D)"),
        points: [
          bi("Excipient selection by functional category and typical concentration", "انتخاب ماده جانبی بر اساس طبقه عملکردی و غلظت متداول"),
          bi("Starting formulations and batch formulae for eight dosage forms", "فرمول پایه و فرمول بچ برای هشت شکل دارویی"),
          bi("HLB, isotonicity and Henderson–Hasselbalch buffer calculations", "محاسبات HLB، ایزوتونیسیته و بافر هندرسون–هاسلباخ"),
        ],
      },
      {
        key: "qc",
        title: bi("Quality Control (QC)", "کنترل کیفیت (QC)"),
        points: [
          bi("QC laboratory and microbiology SOPs: sampling, calibration, water and environmental monitoring", "دستورالعمل‌های آزمایشگاه کنترل کیفیت و میکروبیولوژی: نمونه‌برداری، کالیبراسیون، آب و پایش محیطی"),
          bi("Stability study conditions per ICH Q1A(R2) and validation guidance per ICH Q2(R2)", "شرایط مطالعات پایداری طبق ICH Q1A(R2) و اعتبارسنجی روش طبق ICH Q2(R2)"),
          bi("Pharmacopoeial acceptance criteria: dissolution, uniformity of dosage units, friability and microbial limits", "معیارهای پذیرش فارماکوپه‌ای: انحلال، یکنواختی واحدهای دارویی، سایش و حدود میکروبی"),
        ],
      },
      {
        key: "qa",
        title: bi("Quality Assurance (QA)", "تضمین کیفیت (QA)"),
        points: [
          bi("Full-text SOPs for change control, deviation management, CAPA and quality risk management", "متن کامل دستورالعمل‌های کنترل تغییرات، مدیریت انحراف، CAPA و مدیریت ریسک کیفیت"),
          bi("Validation master plan, process and cleaning validation, self-inspection", "برنامه جامع اعتبارسنجی، اعتبارسنجی فرآیند و تمیزکاری، خودبازرسی"),
          bi("Nitrosamine, elemental impurity (ICH Q3D) and PDE-based cross-contamination risk assessments", "ارزیابی ریسک نیتروزآمین، ناخالصی‌های عنصری (ICH Q3D) و آلودگی متقاطع بر پایه PDE"),
        ],
      },
      {
        key: "prd",
        title: bi("Production", "تولید"),
        points: [
          bi("Production SOPs from dispensing and granulation to tablet coating and line clearance", "دستورالعمل‌های تولید از توزین و گرانولاسیون تا روکش‌دهی قرص و ترخیص خط"),
          bi("Batch scale-up from unit formula to batch formula with overage", "افزایش مقیاس از فرمول واحد به فرمول بچ با احتساب اضافه‌ساخت"),
          bi("Handbook chapters on critical process parameters and technology transfer", "فصل‌های هندبوک درباره پارامترهای بحرانی فرآیند و انتقال فناوری"),
        ],
      },
      {
        key: "reg",
        title: bi("Regulatory Affairs", "امور رگولاتوری"),
        points: [
          bi("CTD Modules 1–5 with the Module 3 structure (3.2.S and 3.2.P)", "ماژول‌های ۱ تا ۵ CTD، شامل بخش‌های \u20663.2.S\u2069 و \u20663.2.P\u2069 در ماژول ۳"),
          bi("Searchable ICH quality (Q1–Q14) and multidisciplinary (M4, M7, M9, M10) guidelines", "راهنماهای کیفیت ICH از \u2066Q1\u2069 تا \u2066Q14\u2069 و راهنماهای چندرشته‌ای \u2066M4\u2069، \u2066M7\u2069، \u2066M9\u2069 و \u2066M10\u2069، با امکان جستجو"),
          bi("Long-term, intermediate and accelerated stability conditions", "شرایط مطالعات پایداری بلندمدت، میانی و تسریع‌شده"),
        ],
      },
      {
        key: "sup",
        title: bi("Supply chain & procurement", "تأمین و بازرگانی"),
        points: [
          bi("Domestic manufacturers and importers of pharmaceutical, supplement and cosmetic raw materials", "تولیدکنندگان و واردکنندگان داخلی مواد اولیه دارویی، مکمل و آرایشی‌بهداشتی"),
          bi("Synonym-aware search by Persian or English name, salt form or trade name", "جستجوی هوشمند با نام فارسی یا انگلیسی، فرم نمکی یا نام تجاری"),
          bi("Credibility-ranked results with the source of every record", "نتایج رتبه‌بندی‌شده بر اساس اعتبار، همراه با منبع هر رکورد"),
        ],
      },
      {
        key: "stu",
        title: bi("Students", "دانشجویان"),
        points: [
          bi("Calculators that show each equation: HLB, isotonicity, buffer and displacement factor", "ماشین‌حساب‌هایی که معادله هر محاسبه را نشان می‌دهند: HLB، ایزوتونیسیته، بافر و ضریب جابه‌جایی"),
          bi("Function and typical concentration of each excipient, in Persian and English", "عملکرد و غلظت متداول هر ماده جانبی، به فارسی و انگلیسی"),
          bi("Full-text SOPs to understand a GMP plant before an internship or first job", "متن کامل SOPها برای آشنایی با کارخانه GMP پیش از کارآموزی یا ورود به صنعت"),
        ],
      },
      {
        key: "pha",
        title: bi("Pharmacies", "داروخانه‌ها"),
        points: [
          bi("Extemporaneous compounding: isotonicity, dilution and suppository base calculations", "ساخت داروهای ترکیبی: محاسبات ایزوتونیسیته، رقیق‌سازی و پایه شیاف"),
          bi("mg ⇄ mmol ⇄ mEq conversions and vitamin IU conversions", "تبدیل میلی‌گرم، میلی‌مول و میلی‌اکی‌والان و واحد بین‌المللی ویتامین‌ها"),
          bi("Domestic suppliers of pharmaceutical, supplement and cosmetic raw materials", "یافتن تأمین‌کنندگان داخلی مواد اولیه دارویی، مکمل و آرایشی‌بهداشتی"),
        ],
      },
    ],
  },

  sectionsIntro: {
    eyebrow: bi("Inside the vault", "بخش‌های پلتفرم"),
    title: bi("Nine specialised sections, one integrated platform", "نُه بخش تخصصی در یک پلتفرم یکپارچه"),
    lead: bi(
      "The sections are designed to work together: from an excipient you move to its suppliers, to the calculation that uses it and to the regulatory requirement that governs it.",
      "بخش‌ها برای کار در کنار هم طراحی شده‌اند: از یک ماده جانبی به تأمین‌کنندگان آن، به محاسبه‌ای که در آن به کار می‌رود و به الزام رگولاتوری حاکم بر آن می‌رسید.",
    ),
    open: bi("Open section", "ورود به بخش"),
  },

  supplierSpotlight: {
    badge: bi("Featured", "ویژه"),
    lead: bi(
      "Find who manufactures or imports a raw material in Iran — APIs, excipients, vitamins, mineral salts, supplement and cosmetic ingredients — with phone, email, website and the source of every record.",
      "پیدا کنید چه شرکتی یک ماده اولیه را در ایران تولید یا وارد می‌کند — مواد مؤثره، مواد جانبی، ویتامین‌ها، املاح معدنی و مواد اولیه مکمل و آرایشی‌بهداشتی — همراه با تلفن، ایمیل، وب‌سایت و منبع هر رکورد.",
    ),
    search: bi("Search", "جستجو"),
    stats: {
      companies: bi("companies", "شرکت"),
      materials: bi("material entries", "قلم ماده"),
      manufacturers: bi("domestic manufacturers", "تولیدکننده داخلی"),
      importers: bi("importers and traders", "واردکننده و بازرگانی"),
    },
    byCategory: bi("Browse by category", "مرور بر اساس دسته"),
    open: bi("Open the full bank", "ورود به بانک کامل"),
  },

  databases: {
    eyebrow: bi("Databases", "پایگاه‌های داده"),
    title: bi("Curated reference data", "داده‌های مرجع گزینش‌شده"),
    lead: bi(
      "Structured records searchable in Persian and English — by INN, salt form, trade name or CAS Registry Number.",
      "رکوردهای ساختاریافته، قابل جستجو به فارسی و انگلیسی — با نام ژنریک (INN)، فرم نمکی، نام تجاری یا شماره CAS.",
    ),
    units: {
      excipients: bi("excipients", "ماده جانبی"),
      suppliers: bi("suppliers · {p} materials", "تأمین‌کننده · {p} قلم ماده"),
      materials: bi("APIs, vitamins and mineral salts", "ماده مؤثره، ویتامین و املاح معدنی"),
      qa: bi("standard operating procedures", "دستورالعمل استاندارد"),
    },
  },

  toolsShowcase: {
    eyebrow: bi("Pharmaceutical calculations", "محاسبات داروسازی"),
    title: bi("{n} calculators for formulation, physical pharmacy and analysis", "{n} ماشین‌حساب برای فرمولاسیون، داروسازی فیزیکی و آنالیز"),
    lead: bi(
      "From potency, powder flow and capsule fill to buffer capacity, stability kinetics, HPLC assay, system suitability, dissolution f2 and content uniformity. Each calculator states its governing equation and its pharmacopoeial or ICH reference.",
      "از پوتنسی، جریان‌پذیری پودر و پرکردن کپسول تا ظرفیت بافری، سینتیک پایداری، تعیین مقدار HPLC، انطباق سیستم، فاکتور f2 انحلال و یکنواختی محتوا. هر ماشین‌حساب معادله مبنا و مرجع فارماکوپه‌ای یا ICH خود را نشان می‌دهد.",
    ),
    open: bi("Open calculations", "ورود به محاسبات"),
  },

  howItWorks: {
    eyebrow: bi("Getting started", "شروع کار"),
    title: bi("Access in three steps", "دسترسی در سه گام"),
    steps: [
      {
        title: bi("Choose a plan", "انتخاب طرح"),
        text: bi(
          "Individual, Team or Enterprise — according to the number of users and the data your work needs.",
          "فردی، تیمی یا سازمانی — بر اساس تعداد کاربران و داده‌هایی که کار شما به آن نیاز دارد.",
        ),
      },
      {
        title: bi("Send your request", "ارسال درخواست"),
        text: bi(
          "Use the request button of the plan; the email opens pre-filled with the details we need.",
          "دکمه درخواست همان طرح را بزنید؛ ایمیل با اطلاعات موردنیاز به‌صورت آماده باز می‌شود.",
        ),
      },
      {
        title: bi("Start working", "شروع کار"),
        text: bi(
          "After confirmation and payment, the sections included in your plan are opened for your users.",
          "پس از تأیید و پرداخت، بخش‌های طرح شما برای کاربرانتان فعال می‌شود.",
        ),
      },
    ],
  },

  plans: {
    eyebrow: bi("Plans", "اشتراک"),
    title: bi("Subscription plans — monthly or annual", "طرح‌های اشتراک — ماهانه یا سالانه"),
    lead: bi(
      "Every plan includes all knowledge sections and the supplier & manufacturer bank. Team and Enterprise add more users, shared work and organisation-level data access.",
      "همه طرح‌ها همه بخش‌های دانش و بانک تأمین‌کنندگان و تولیدکنندگان را در بر دارند. طرح‌های تیمی و سازمانی، کاربران بیشتر، کار مشترک و دسترسی سازمانی به داده‌ها را اضافه می‌کنند.",
    ),
    items: [
      {
        id: "individual",
        name: bi("Individual", "فردی"),
        who: bi("For specialists and formulators, students and pharmacies", "برای کارشناسان و فرمولاتورها، دانشجویان و داروخانه‌ها"),
        price: bi("Price set at launch", "قیمت: زمان راه‌اندازی اعلام می‌شود"),
        features: [
          bi("One user", "یک کاربر"),
          bi("Technical handbook library", "کتابخانه هندبوک‌های تخصصی"),
          bi("Pharmaceutical calculations and formulation design tools", "محاسبات داروسازی و ابزارهای طراحی فرمولاسیون"),
          bi("Excipient and API databases", "پایگاه‌های داده مواد جانبی و مواد مؤثره"),
          bi("CTD and ICH regulatory references", "مرجع رگولاتوری CTD و ICH"),
          bi("Supplier & manufacturer bank", "بانک تأمین‌کنندگان و تولیدکنندگان"),
        ],
        cta: bi("Request access", "درخواست دسترسی"),
        style: "ghost",
      },
      {
        id: "team",
        name: bi("Team", "تیمی"),
        who: bi("For a company's R&D or QC department", "برای واحد تحقیق و توسعه یا کنترل کیفیت یک شرکت"),
        price: bi("Price set at launch", "قیمت: زمان راه‌اندازی اعلام می‌شود"),
        features: [
          bi("Several users on one subscription", "چند کاربر با یک اشتراک"),
          bi("Everything in Individual", "همه امکانات پلن فردی"),
          bi("Shared saved formulas and calculations", "فرمول‌ها و محاسبات ذخیره‌شده مشترک"),
          bi("User management by the unit head", "مدیریت کاربران توسط مدیر واحد"),
        ],
        cta: bi("Request access", "درخواست دسترسی"),
        badge: bi("Recommended for R&D and QC", "پیشنهاد برای واحدهای R&D و QC"),
        style: "primary",
      },
      {
        id: "enterprise",
        name: bi("Enterprise", "سازمانی"),
        who: bi("For a whole pharmaceutical company", "برای کل یک شرکت دارویی"),
        price: bi("Priced by contract", "قیمت: بر اساس قرارداد"),
        features: [
          bi("Organisation-wide multi-user access", "دسترسی سازمانی چندکاربره"),
          bi("Role- and department-based access control", "کنترل دسترسی بر اساس نقش و واحد سازمانی"),
          bi("Database delivery with restricted access", "تحویل پایگاه داده با دسترسی کنترل‌شده"),
          bi("Company-specific handbooks and software", "هندبوک و نرم‌افزار اختصاصی شرکت"),
          bi("Dedicated support", "پشتیبانی اختصاصی"),
        ],
        cta: bi("Request a quote", "درخواست پیش‌فاکتور"),
        style: "dark",
      },
    ],
    compareTitle: bi("Compare plans", "مقایسه طرح‌ها"),
    compare: [
      { label: bi("Users", "تعداد کاربران"), values: [bi("1", "۱"), bi("Several", "چند کاربر"), bi("Organisation-wide", "کل سازمان")] },
      { label: bi("Technical handbooks", "هندبوک‌های تخصصی"), values: [true, true, true] },
      { label: bi("Pharmaceutical calculations and formulation design", "محاسبات داروسازی و طراحی فرمولاسیون"), values: [true, true, true] },
      { label: bi("Excipient and API databases", "پایگاه‌های داده مواد جانبی و مواد مؤثره"), values: [true, true, true] },
      { label: bi("CTD and ICH regulatory references", "مرجع رگولاتوری CTD و ICH"), values: [true, true, true] },
      { label: bi("SOP library with full text", "کتابخانه SOP با متن کامل"), values: [true, true, true] },
      { label: bi("Supplier & manufacturer bank", "بانک تأمین‌کنندگان و تولیدکنندگان"), values: [true, true, true] },
      { label: bi("Shared saved formulas and calculations", "فرمول‌ها و محاسبات ذخیره‌شده مشترک"), values: [false, true, true] },
      { label: bi("User management", "مدیریت کاربران"), values: [false, bi("By the unit head", "توسط مدیر واحد"), bi("By role and department", "بر اساس نقش و واحد")] },
      { label: bi("Database delivery with controlled access", "تحویل پایگاه داده با دسترسی کنترل‌شده"), values: [false, false, true] },
      { label: bi("Company-specific handbooks and software", "هندبوک و نرم‌افزار اختصاصی شرکت"), values: [false, false, true] },
      { label: bi("Dedicated support", "پشتیبانی اختصاصی"), values: [false, false, true] },
    ],
    ordersTitle: bi("Ordered separately from a subscription", "سفارش جدا از اشتراک"),
    orders: [
      {
        title: bi("Custom handbook", "هندبوک اختصاصی"),
        text: bi(
          "A handbook written around your products, production lines and procedures.",
          "هندبوکی که برای محصولات، خطوط تولید و رویه‌های شرکت شما نوشته می‌شود.",
        ),
      },
      {
        title: bi("Company-specific software", "نرم‌افزار ویژه شرکت"),
        text: bi(
          "A calculation or formulation tool built on your data and your way of working.",
          "ابزار محاسبه یا فرمولاسیون که با داده‌ها و روش کار شرکت شما ساخته می‌شود.",
        ),
      },
      {
        title: bi("Database licence", "مجوز استفاده از پایگاه داده"),
        text: bi(
          "A copy of the databases with restricted access, for use inside the organisation.",
          "نسخه‌ای از پایگاه‌های داده با دسترسی کنترل‌شده، برای استفاده درون سازمان.",
        ),
      },
    ],
  },

  faq: {
    eyebrow: bi("Questions", "پرسش‌های متداول"),
    title: bi("Frequently asked questions", "پرسش‌های متداول"),
    items: [
      {
        q: bi("What sources is the content based on?", "محتوای پلتفرم بر چه منابعی استوار است؟"),
        a: bi(
          "Regulatory sections follow the ICH guidelines (including M4 for the CTD and Q1A(R2) for stability), and the SOPs reference PIC/S GMP and the relevant ICH guidelines. Excipient functions and concentration ranges are working guidance to be confirmed against the current pharmacopoeias and the Handbook of Pharmaceutical Excipients. Every record in the supplier bank shows its source.",
          "بخش‌های رگولاتوری بر پایه راهنماهای ICH (از جمله M4 برای CTD و \u2066Q1A(R2)\u2069 برای پایداری) تدوین شده‌اند و دستورالعمل‌ها به PIC/S GMP و راهنماهای مرتبط ICH ارجاع می‌دهند. طبقه‌بندی عملکردی و محدوده غلظت مواد جانبی، راهنمای کاری است و باید با آخرین ویرایش فارماکوپه‌ها و Handbook of Pharmaceutical Excipients تطبیق داده شود. منبع هر رکورد در بانک تأمین‌کنندگان کنار همان رکورد آمده است.",
        ),
      },
      {
        q: bi("Can it replace the official pharmacopoeias and guidelines?", "آیا جایگزین فارماکوپه‌ها و راهنماهای رسمی است؟"),
        a: bi(
          "No. PharmaVault is a working reference that shortens the search; specifications, limits and registration requirements must always be confirmed against the current official editions and the requirements of the Iran Food and Drug Administration.",
          "خیر. PharmaVault مرجعی کاربردی برای کوتاه‌کردن مسیر جستجو است؛ مشخصات، حدود پذیرش و الزامات ثبت همواره باید با آخرین ویرایش مراجع رسمی و الزامات سازمان غذا و دارو تطبیق داده شود.",
        ),
      },
      {
        q: bi("How is access activated?", "دسترسی چگونه فعال می‌شود؟"),
        a: bi(
          "Send a request with the button of the plan you need. After the request is confirmed and paid, the sections of your plan are opened for the users you named.",
          "با دکمه درخواست همان طرح، درخواست خود را بفرستید. پس از تأیید و پرداخت، بخش‌های طرح برای کاربرانی که معرفی کرده‌اید فعال می‌شود.",
        ),
      },
      {
        q: bi("Can several colleagues share one subscription?", "آیا چند همکار می‌توانند از یک اشتراک استفاده کنند؟"),
        a: bi(
          "Yes. The Team plan covers several users managed by the head of the unit; the Enterprise plan covers the whole organisation with access by role and department.",
          "بله. طرح تیمی چند کاربر را با مدیریت مدیر واحد پوشش می‌دهد و طرح سازمانی کل سازمان را با سطح دسترسی بر اساس نقش و واحد.",
        ),
      },
      {
        q: bi("Can we order company-specific handbooks, SOPs or software?", "آیا امکان سفارش هندبوک، SOP یا نرم‌افزار اختصاصی شرکت وجود دارد؟"),
        a: bi(
          "Yes. Custom handbooks, company-specific software and database licences can be ordered separately from a subscription or as part of the Enterprise plan.",
          "بله. هندبوک اختصاصی، نرم‌افزار ویژه شرکت و مجوز استفاده از پایگاه داده را می‌توان جدا از اشتراک یا در قالب طرح سازمانی سفارش داد.",
        ),
      },
      {
        q: bi("How do I add or correct a company in the supplier bank?", "چگونه شرکتی را به بانک تأمین‌کنندگان اضافه یا اطلاعاتش را اصلاح کنم؟"),
        a: bi(
          "Email us the company's name, products and a verifiable source such as its website or syndicate listing.",
          "نام شرکت، محصولات و یک منبع قابل‌راستی‌آزمایی (مانند وب‌سایت یا صفحه سندیکا) را برای ما ایمیل کنید.",
        ),
      },
    ],
  },

  contact: {
    eyebrow: bi("Contact", "تماس"),
    title: bi("Bring PharmaVault to your team", "PharmaVault را به تیم خود بیاورید"),
    lead: bi(
      "Request access for yourself or your department, or ask for an Enterprise quote with company-specific content.",
      "برای خود یا واحدتان درخواست دسترسی دهید، یا برای طرح سازمانی و محتوای اختصاصی شرکت پیش‌فاکتور بخواهید.",
    ),
    access: bi("Request access", "درخواست دسترسی"),
    quote: bi("Request an Enterprise quote", "درخواست پیش‌فاکتور سازمانی"),
  },

  /** Pre-filled email used by every request button. */
  requestEmail: {
    subject: bi("PharmaVault — {plan} plan request", "PharmaVault — درخواست طرح {plan}"),
    body: bi(
      "Name:\nCompany / university / pharmacy:\nDepartment or field of study:\nNumber of users:\nPhone:\n",
      "نام و نام خانوادگی:\nشرکت / دانشگاه / داروخانه:\nواحد یا رشته تحصیلی:\nتعداد کاربران:\nشماره تماس:\n",
    ),
  },

  footer: {
    about: bi(
      "A specialised pharmaceutical knowledge and information platform for research and development (R&D), production, quality control (QC), quality assurance (QA), regulatory affairs and supply chain.",
      "پلتفرم دانش و اطلاعات تخصصی دارویی در حوزه‌های تحقیق و توسعه (R&D)، تولید (Production)، کنترل کیفیت (QC)، تضمین کیفیت (QA)، امور رگولاتوری (Regulatory Affairs) و بازرگانی و زنجیره تأمین (Supply Chain).",
    ),
    plans: bi("Plans & enterprise", "اشتراک و راهکار سازمانی"),
  },

  common: {
    search: bi("Search", "جستجو"),
    noMatch: bi(
      "No record matches. Try another spelling, a trade name or the CAS number.",
      "رکوردی پیدا نشد. املای دیگر، نام تجاری یا شماره CAS را امتحان کنید.",
    ),
    of: bi("of", "از"),
    records: bi("records", "رکورد"),
    name: bi("Name", "نام"),
    inPreparation: bi("In preparation", "در دست تهیه"),
    badInput: bi("Enter valid numbers in every field.", "در همه خانه‌ها عدد معتبر وارد کنید."),
    custom: bi("Custom values", "مقادیر دلخواه"),
    notFoundTitle: bi("Page not found", "صفحه پیدا نشد"),
    notFoundText: bi(
      "The page you are looking for does not exist or has been moved.",
      "صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است.",
    ),
    backHome: bi("Back to home", "بازگشت به خانه"),
  },
};
