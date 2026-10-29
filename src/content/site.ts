import { bi } from "@/i18n/bi";

export const siteConfig = {
  name: "PharmaVault",
  domain: "pharmavault.ir",
  url: "https://pharmavault.ir",
  email: "info@pharmavault.ir",
  /**
   * Owner details for the contact page (required by e-Namad). Each line
   * appears on the site once it is filled in; they must match the e-Namad file.
   */
  contact: {
    owner: null as string | null,
    address: "تهران، بلوار نلسون ماندلا، کوچه اول" as string | null,
    postalCode: null as string | null,
    phone: "0938 941 1123" as string | null,
    hours: bi("Saturday to Wednesday, 9:00–17:00", "شنبه تا چهارشنبه، ساعت 9 تا 17"),
  },
  /** e-Namad trust seal: the id and code from the e-Namad panel; null hides the badge. */
  enamad: { id: "8206119", code: "cRoMXWmJrmcqg8byEKpKdBNXXvYg9sQ5" } as { id: string; code: string } | null,
  /** e-Namad domain check: the number e-Namad gives for its <meta name="enamad"> tag; null leaves it out. */
  enamadVerify: null as string | null,
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
  rights: bi(
    "All rights reserved. The content, databases and design of this site belong to the PharmaVault platform. Copying or republishing any of it without crediting PharmaVault (pharmavault.ir) as the source is prohibited and will be pursued under the law.",
    "تمامی حقوق مادی و معنوی این سایت متعلق به پلتفرم PharmaVault (گنجینه اطلاعات داروسازی) است. هرگونه کپی‌برداری یا بازنشر محتوا، پایگاه‌های داده و طراحی سایت بدون ذکر منبع PharmaVault (pharmavault.ir) ممنوع است و پیگرد قانونی دارد.",
  ),

  nav: {
    home: bi("Home", "صفحه اصلی"),
    sections: bi("Sections", "بخش‌ها"),
    services: bi("Services", "خدمات"),
    tools: bi("Calculations", "محاسبات"),
    plans: bi("Plans", "اشتراک"),
    enterprise: bi("Enterprise", "راهکار سازمانی"),
    menu: bi("Menu", "منو"),
    close: bi("Close menu", "بستن منو"),
    language: bi("Language", "زبان"),
    skipToContent: bi("Skip to content", "رفتن به محتوای اصلی"),
    allSections: bi("All sections", "همه بخش‌ها"),
  },

  hero: {
    stats: {
      suppliers: bi("suppliers & makers", "تأمین‌کننده و تولیدکننده"),
      products: bi("products in the supplier bank", "محصول در بانک تأمین"),
      materials: bi("raw materials with specs", "ماده اولیه با مشخصات"),
      sections: bi("specialised sections", "بخش تخصصی"),
    },
    popular: bi("Popular searches:", "جستجوهای پرتکرار:"),
    popularQueries: ["لاکتوز", "منیزیم استئارات", "آویسل", "متفورمین", "ویتامین C", "کولین کلراید"],
    headline: bi(
      "Integrated knowledge, sharper decisions, smarter drug development",
      "دانش یکپارچه، تصمیم‌گیری دقیق‌تر، توسعه هوشمندانه‌تر\u00a0دارو",
    ),
    audience: bi(
      "For professionals in research and development (R&D), procurement and supply chain, quality control (QC), quality assurance (QA) and regulatory affairs (RA); faculty and students of pharmacy and pharmaceutical sciences; everyone working in the pharmaceutical sector; and pharmacies.",
      "ویژه متخصصان تحقیق و توسعه (R&D)، بازرگانی و زنجیره تأمین (Supply Chain)، کنترل کیفیت (QC)، تضمین کیفیت (QA) و امور رگولاتوری (RA)، اساتید و دانشجویان داروسازی و علوم دارویی، فعالان حوزه دارو و داروخانه‌ها.",
    ),
    browse: bi("Browse the sections", "مرور بخش‌ها"),
    supplierSearch: bi("Search the supplier bank", "جستجو در بانک تأمین‌کنندگان"),
    seePlans: bi("See subscription plans", "مشاهده طرح‌های اشتراک"),
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

  tour: {
    label: bi("A two-minute tour of the twelve PharmaVault sections", "تور دودقیقه‌ای دوازده بخش فارماوالت"),
    pause: bi("Pause the tour", "توقف تور"),
    play: bi("Play the tour", "پخش تور"),
  },
  statement: {
    photoAlt: bi("Two pharmaceutical researchers examining a sample through a magnifying glass", "دو پژوهشگر دارویی در حال بررسی نمونه با ذره‌بین"),
    title: bi(
      "The specialist reference for pharmaceutical knowledge, information and tools",
      "مرجع تخصصی دانش، اطلاعات و ابزارهای داروسازی",
    ),
    text: bi(
      "From raw material sourcing and formulation development to technical calculations and quality and regulatory requirements — compiled by the PharmaVault expert team from authoritative, citable scientific sources.",
      "از تأمین مواد اولیه و توسعه فرمولاسیون تا محاسبات فنی، الزامات کیفی و رگولاتوری؛ تدوین‌شده توسط تیم تخصصی فارماوالت بر پایه منابع علمی معتبر و قابل استناد.",
    ),
  },

  departments: {
    eyebrow: bi("Who it is for", "برای چه کسانی"),
    title: bi("Built for industry, students and pharmacies", "طراحی‌شده برای صنعت دارو، دانشجویان و داروخانه‌ها"),
    lead: bi(
      "Every department of a pharmaceutical company — and students and pharmacists — gets the references and tools they use every day, in one subscription.",
      "هر واحد شرکت داروسازی، و همچنین دانشجویان و داروسازان داروخانه، مراجع و ابزارهایی را که هر روز به\u00a0آن‌ها\u00a0نیاز\u00a0دارند در یک اشتراک در\u00a0اختیار\u00a0دارند.",
    ),
    items: [
      {
        key: "rnd",
        title: bi("Research & Development (R&D)", "تحقیق و توسعه (R&D)"),
        points: [
          bi("Smart formulation design: route, unit weight and % w/w of every excipient within monograph ranges", "طراحی هوشمند فرمولاسیون: روش ساخت، وزن واحد و درصد هر ماده جانبی داخل محدوده مونوگراف"),
          bi("Manufacturing plan, drug–excipient compatibility, DoE and ICH Q9 risk assessment for each product", "Manufacturing plan، سازگاری دارو و ماده جانبی، DoE و Risk assessment طبق ICH Q9 برای هر فرآورده"),
          bi("Reference brand (RLD) by molecule from the Orange Book; a Q1 formula from the brand label", "یافتن برند مرجع (RLD) با نام مولکول از Orange Book و ساخت فرمول Q1 از برچسب برند"),
          bi("Data sheets of 272 excipients and 857 APIs with MW and BCS class", "برگه اطلاعات 272 ماده جانبی و 857 ماده مؤثره همراه با MW و کلاس BCS"),
        ],
      },
      {
        key: "qc",
        title: bi("Quality Control (QC)", "کنترل کیفیت (QC)"),
        points: [
          bi("Free applied HPLC handbook: system suitability, method transfer, troubleshooting and worked calculations", "هندبوک کاربردی رایگان HPLC: System suitability، انتقال روش، Troubleshooting و مسائل محاسباتی حل‌شده"),
          bi("QC laboratory and microbiology SOPs: sampling, calibration, water and environmental monitoring", "دستورالعمل‌های آزمایشگاه کنترل کیفیت و میکروبیولوژی: نمونه‌برداری، کالیبراسیون، آب و پایش محیطی"),
          bi("Pharmacopoeial acceptance criteria, microbial limits, ICH Q2(R2) method validation and OOS investigation", "معیارهای پذیرش فارماکوپه‌ای، حدود میکروبی، اعتبارسنجی روش طبق ICH Q2(R2) و بررسی نتایج OOS"),
          bi("Analytical calculators: HPLC and UV assay, linearity, dissolution and f2, content uniformity, Karl Fischer", "ماشین‌حساب‌های آنالیز: Assay به روش HPLC و UV، خطی‌بودن، انحلال و f2، یکنواختی محتوا و Karl Fischer"),
        ],
      },
      {
        key: "qa",
        title: bi("Quality Assurance (QA)", "تضمین کیفیت (QA)"),
        points: [
          bi("157 full-text SOPs: change control, deviation, CAPA and quality risk management", "157 دستورالعمل با متن کامل: کنترل تغییرات، مدیریت انحراف، CAPA و مدیریت ریسک کیفیت"),
          bi("Validation master plan, process and cleaning validation, self-inspection", "برنامه جامع اعتبارسنجی، اعتبارسنجی فرآیند و تمیزکاری و خودبازرسی"),
          bi("Nitrosamine, elemental impurity (ICH Q3D) and PDE-based cross-contamination risk assessments", "ارزیابی ریسک نیتروزآمین، ناخالصی‌های عنصری (ICH Q3D) و آلودگی متقاطع بر پایه PDE"),
          bi("Pharmaceutical quality system (ICH Q10) and quality risk management tools (ICH Q9)", "سیستم کیفیت دارویی (ICH Q10) و ابزارهای مدیریت ریسک کیفیت (ICH Q9)"),
        ],
      },
      {
        key: "prd",
        title: bi("Production", "تولید (Production)"),
        points: [
          bi("Production SOPs from dispensing and granulation to tablet coating and line clearance", "دستورالعمل‌های تولید از توزین و گرانولاسیون تا روکش‌دهی قرص و ترخیص خط"),
          bi("Dispensing formula corrected for assay, water and overage", "Dispensing formula اصلاح‌شده بر اساس Assay، رطوبت و مقدار اضافی (Overage)"),
          bi("Process parameters, tooling, breaking force, IPCs and scale-up notes for each route", "پارامترهای فرایند، Tooling، Breaking force، IPC و نکات Scale-up برای هر روش ساخت"),
          bi("Handbook chapters on critical process parameters and technology transfer", "فصل‌های هندبوک درباره پارامترهای بحرانی فرآیند و انتقال فناوری"),
        ],
      },
      {
        key: "reg",
        title: bi("Regulatory Affairs (RA)", "امور رگولاتوری (RA)"),
        points: [
          bi("CTD Modules 1–5 with the Module 3 structure (3.2.S and 3.2.P), and CTD compilation by the PharmaVault team", "ماژول‌های 1 تا 5 CTD شامل بخش‌های \u20663.2.S\u2069 و \u20663.2.P\u2069، و تدوین CTD توسط تیم فارماوالت"),
          bi("Searchable ICH quality (Q1–Q14) and multidisciplinary (M4, M7, M9, M10) guidelines", "راهنماهای کیفیت ICH از \u2066Q1\u2069 تا \u2066Q14\u2069 و راهنماهای چندرشته‌ای \u2066M4\u2069، \u2066M7\u2069، \u2066M9\u2069 و \u2066M10\u2069، با امکان جستجو"),
          bi("Orange Book: RLD, reference standard, TE codes and generic holders of every product", "Orange Book: فرآورده مرجع (RLD)، Reference standard، کد TE و دارندگان ژنریک هر فرآورده"),
          bi("Pharmacopoeias and regulators: the edition in force, the latest edition and official links", "فارماکوپه‌ها و مراجع رگولاتوری: ویرایش لازم‌الاجرا، آخرین ویرایش و لینک رسمی"),
        ],
      },
      {
        key: "sup",
        title: bi("Supply Chain & procurement", "تأمین و بازرگانی (Supply Chain)"),
        points: [
          bi("Domestic manufacturers and importers of pharmaceutical, supplement and cosmetic raw materials", "تولیدکنندگان و واردکنندگان داخلی مواد اولیه دارویی، مکمل و آرایشی‌بهداشتی"),
          bi("Synonym-aware search by Persian or English name, salt form or trade name", "جستجوی هوشمند با نام فارسی یا انگلیسی، فرم نمکی یا نام تجاری"),
          bi("Credibility-ranked results with the source of every record, updated daily", "نتایج رتبه‌بندی‌شده بر اساس اعتبار، همراه با منبع هر رکورد و به‌روزرسانی روزانه"),
          bi("Phone, email and website of each supplier, filtered by province and material category", "تلفن، ایمیل و وب‌سایت هر تأمین‌کننده، با فیلتر استان و دسته ماده"),
        ],
      },
      {
        key: "stu",
        title: bi("Students", "دانشجویان (Students)"),
        points: [
          bi("Free weekly technical handbook (PDF), starting with applied HPLC", "هندبوک تخصصی رایگان هفتگی (PDF)، با شروع از HPLC کاربردی"),
          bi("Calculators that show each equation: HLB, isotonicity, buffer and displacement factor", "ماشین‌حساب‌هایی که معادله هر محاسبه را نشان می‌دهند: HLB، ایزوتونیسیته، بافر و ضریب جابه‌جایی"),
          bi("Formulation advisor that explains every choice: route, excipient levels, process and controls", "مشاور فرمولاسیون که دلیل هر انتخاب را توضیح می‌دهد: روش ساخت، غلظت مواد جانبی، فرایند و کنترل‌ها"),
          bi("Full-text SOPs to learn how GMP works in a manufacturing site before an internship or first job", "متن کامل SOPها برای آشنایی با الزامات GMP در واحد تولیدی پیش از کارآموزی یا ورود به صنعت"),
        ],
      },
      {
        key: "pha",
        title: bi("Pharmacies", "داروخانه‌ها (Pharmacy)"),
        points: [
          bi("Drug interaction checker: severity, mechanism and clinical management of each pair", "بررسی تداخلات دارویی: شدت، مکانیسم و مدیریت بالینی هر تداخل"),
          bi("Iranian licensed medicines and generic substitution, with the brand and generic products of the Orange Book", "داروهای دارای مجوز ایران و جایگزینی ژنریک، همراه با فرآورده‌های برند و ژنریک Orange Book"),
          bi("Non-sterile compounding guide and USP <795> beyond-use date calculator", "راهنمای ساخت فرآورده‌های غیراستریل (Compounding) و محاسبه BUD طبق USP <795>"),
          bi("Compounding calculations: isotonicity, dilution, suppository base and mg ⇄ mmol ⇄ mEq conversions", "محاسبات Compounding: ایزوتونیسیته، رقیق‌سازی، پایه شیاف و تبدیل میلی‌گرم، میلی‌مول و میلی‌اکی‌والان"),
        ],
      },
    ],
  },

  sectionsIntro: {
    eyebrow: bi("Inside the vault", "بخش‌های پلتفرم"),
    title: bi("Twelve specialised sections, one integrated platform", "دوازده بخش تخصصی در یک پلتفرم یکپارچه"),
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
      "پیدا کنید چه شرکتی یک ماده اولیه را در ایران تولید یا وارد می‌کند — مواد مؤثره، مواد جانبی، ویتامین‌ها، مینرال‌ها و مواد اولیه مکمل و آرایشی‌بهداشتی — همراه با تلفن، ایمیل، وب‌سایت و منبع هر رکورد.",
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
      materials: bi("APIs, vitamins and mineral salts", "ماده مؤثره، ویتامین و مینرال"),
      qa: bi("standard operating procedures", "دستورالعمل استاندارد"),
    },
  },

  toolsShowcase: {
    eyebrow: bi("Pharmaceutical calculations", "محاسبات داروسازی"),
    title: bi("{n} calculators for formulation calculations, physical pharmacy and analysis", "{n} ماشین‌حساب برای محاسبات فرمولاسیون، فیزیکال فارماسی و آنالیز"),
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
          "Individual or Team / Organisation — according to the number of users and the sections your work needs.",
          "فردی یا تیمی / سازمانی — بر اساس تعداد کاربران و بخش‌هایی که کار شما به آن نیاز دارد.",
        ),
      },
      {
        title: bi("Sign up and pay", "ثبت‌نام و پرداخت"),
        text: bi(
          "Create an account with your mobile number and pay online; companies can also ask for a pro-forma invoice.",
          "با شماره موبایل ثبت‌نام کنید و آنلاین پرداخت کنید؛ برای شرکت‌ها صدور پیش‌فاکتور هم ممکن است.",
        ),
      },
      {
        title: bi("Start working", "شروع کار"),
        text: bi(
          "Your sections open as soon as the payment is confirmed; the end date and renewal are in your account.",
          "بلافاصله پس از تأیید پرداخت، بخش‌های طرح شما باز می‌شود و تاریخ پایان و تمدید آن در حساب کاربری‌تان دیده می‌شود.",
        ),
      },
    ],
  },

  plans: {
    eyebrow: bi("Plans", "اشتراک"),
    title: bi("Monthly subscription plans", "طرح‌های اشتراک ماهانه"),
    lead: bi(
      "Three ways to subscribe: an individual licence for one user on one IP, a team licence for six or more users, or the pharmacy licence. Prices are in Toman per month.",
      "سه روش اشتراک: فردی برای یک کاربر روی یک IP، تیمی و سازمانی برای شش کاربر و بیشتر، و اشتراک ویژه داروخانه. قیمت‌ها به تومان و ماهانه است.",
    ),
    /** Prices in Toman per month; each `…List` is the price before that plan's discount. */
    pricing: {
      /** Individual: the ten core sections for one user, 10% off. */
      full: 2_210_000,
      fullList: 2_455_000,
      /** Team: the ten core sections for six users, 20% off. */
      team: 11_934_000,
      teamList: 14_917_500,
      teamUsers: 6,
      extraUser: 1_000_000,
      /** Pharmacy: all eleven subscription sections (the pharmacy section only opens with this plan) for one user, 15% off. */
      pharmacy: 8_700_000,
      pharmacyList: 10_235_000,
    },
    currency: bi("Toman", "تومان"),
    perMonth: bi("per month", "در ماه"),
    items: [
      {
        id: "individual",
        name: bi("Individual", "فردی"),
        who: bi("For specialists, formulators and students", "برای کارشناسان، فرمولاتورها و دانشجویان"),
        priceFor: bi("Full access to all 10 sections · 1 user on 1 IP", "دسترسی کامل به هر 10 بخش · یک کاربر روی یک IP"),
        saving: bi("10% off", "10% تخفیف"),
        savingNote: bi("on the full monthly price", "نسبت به قیمت پایه ماهانه"),
        extra: bi("Monthly, or 3, 6 or 12 months at once", "ماهانه، یا 3، 6 و 12 ماهه"),
        features: [
          bi("One user on one IP", "یک کاربر روی یک IP"),
          bi("All 10 specialised sections", "هر 10 بخش تخصصی"),
          bi("Supplier & manufacturer bank", "بانک تأمین‌کنندگان و تولیدکنندگان"),
          bi("Formulation, physical pharmacy and analytical calculators", "ماشین‌حساب‌های فرمولاسیون، فیزیکال فارماسی و آنالیز"),
          bi("SOP library and QA, QC and regulatory references", "کتابخانه SOP و مراجع QA، QC و رگولاتوری"),
        ],
        cta: bi("Subscribe", "خرید اشتراک"),
        style: "ghost",
      },
      {
        id: "enterprise",
        name: bi("Team / Organisation", "تیمی / سازمانی"),
        who: bi("For R&D, QC, QA, regulatory and supply teams of pharmaceutical companies", "برای واحدهای R&D، QC، QA، رگولاتوری و تأمین شرکت‌های دارویی"),
        priceFor: bi("6 users on different IPs · all 10 sections", "6 کاربر با IPهای مختلف · هر 10 بخش"),
        saving: bi("20% off", "20% تخفیف"),
        savingNote: bi("on the full monthly price for six users", "نسبت به قیمت پایه ماهانه شش کاربر"),
        extra: bi("Each additional user from the 7th: {extraUser} Toman per month", "هر کاربر اضافه از کاربر هفتم: {extraUser} تومان در ماه"),
        features: [
          bi("Six users on different IPs, expandable", "شش کاربر با IPهای مختلف، قابل افزایش"),
          bi("Full access to all 10 sections for every user", "دسترسی کامل به هر 10 بخش برای همه کاربران"),
          bi("User management by the head of the unit", "مدیریت کاربران توسط مدیر واحد"),
          bi("Official quotation for the company", "پیش‌فاکتور رسمی برای شرکت"),
          bi("Dedicated support", "پشتیبانی اختصاصی"),
        ],
        cta: bi("Subscribe or request an invoice", "خرید یا صدور پیش‌فاکتور"),
        badge: bi("Recommended for companies", "پیشنهاد برای شرکت‌ها"),
        style: "primary",
      },
      {
        id: "pharmacy",
        name: bi("Pharmacy", "داروخانه"),
        who: bi("For community and hospital pharmacies", "ویژه داروخانه‌های شهری و بیمارستانی"),
        priceFor: bi("Full access to all 11 sections · 1 user on 1 IP", "دسترسی کامل به هر 11 بخش · یک کاربر روی یک IP"),
        saving: bi("15% off", "15% تخفیف"),
        savingNote: bi("on the full monthly price", "نسبت به قیمت پایه ماهانه"),
        extra: bi("The pharmacy section opens only with this plan", "بخش داروخانه فقط با این اشتراک باز می‌شود"),
        features: [
          bi("One user on one IP", "یک کاربر روی یک IP"),
          bi("All 11 sections, the pharmacy section included", "هر 11 بخش، همراه با بخش داروخانه"),
          bi("Orange Book generics and brands with the Iranian manufacturers", "داروهای ژنریک و برند Orange Book همراه با تولیدکنندگان داخلی"),
          bi("Non-sterile compounding and beyond-use dates (USP <795>)", "ساخت فرآورده‌های غیراستریل و تاریخ مصرف پس از ساخت \u2066(USP <795>)\u2069"),
          bi("Clinical and compounding calculators", "ماشین‌حساب‌های بالینی و ساخت داروهای ترکیبی"),
        ],
        cta: bi("Subscribe as a pharmacy", "خرید اشتراک داروخانه"),
        style: "ghost",
      },
    ],
    compareTitle: bi("Compare plans", "مقایسه طرح‌ها"),
    compareRows: {
      users: bi("Users", "تعداد کاربران"),
      usersValues: [
        bi("1 user on 1 IP", "یک کاربر روی یک IP"),
        bi("6 or more, on different IPs", "6 کاربر و بیشتر، با IPهای مختلف"),
        bi("1 user on 1 IP", "یک کاربر روی یک IP"),
      ],
      price: bi("Monthly price", "هزینه ماهانه"),
      priceIndividual: bi("{full} (10 sections)", "{full} (10 بخش)"),
      priceTeam: bi("{team} (6 users)", "{team} (6 کاربر)"),
      pricePharmacy: bi("{pharmacy} (11 sections)", "{pharmacy} (11 بخش)"),
      extraUsers: bi("Additional users", "کاربر اضافه"),
      extraUsersValue: bi("{extraUser} per user", "{extraUser} برای هر کاربر"),
    },
    compare: [
      { label: bi("The 10 specialised sections", "10 بخش تخصصی"), values: [true, true, true] },
      { label: bi("References and pharmacopoeias in pharmacy", "رفرنس‌ها و فارماکوپه‌ها در داروسازی"), values: [true, true, true] },
      { label: bi("Pharmacy section", "بخش داروخانه"), values: [false, false, true] },
      { label: bi("Supplier & manufacturer bank", "بانک تأمین‌کنندگان و تولیدکنندگان"), values: [true, true, true] },
      { label: bi("Pharmaceutical calculators and formulation tools", "ماشین‌حساب‌های داروسازی و ابزارهای فرمولاسیون"), values: [true, true, true] },
      { label: bi("SOP library, QA and QC references", "کتابخانه SOP و مراجع QA و QC"), values: [true, true, true] },
      { label: bi("CTD and ICH regulatory references", "مرجع رگولاتوری CTD و ICH"), values: [true, true, true] },
      { label: bi("User management by the unit head", "مدیریت کاربران توسط مدیر واحد"), values: [false, true, false] },
      { label: bi("Official quotation for the company", "پیش‌فاکتور رسمی برای شرکت"), values: [false, true, false] },
      { label: bi("Dedicated support", "پشتیبانی اختصاصی"), values: [false, true, false] },
    ],
    estimator: {
      title: bi("Estimate your monthly cost", "برآورد هزینه ماهانه"),
      individual: bi("Individual", "فردی"),
      includes: bi("One user · all 10 sections", "یک کاربر · هر 10 بخش"),
      pharmacy: bi("Pharmacy", "داروخانه"),
      pharmacyIncludes: bi("One user · all 11 sections", "یک کاربر · هر 11 بخش"),
      team: bi("Team / Organisation", "تیمی / سازمانی"),
      users: bi("Number of users (6 or more)", "تعداد کاربران (6 یا بیشتر)"),
      perUser: bi("per user", "برای هر کاربر"),
      total: bi("Monthly total", "جمع ماهانه"),
      off: bi("{n}% off", "{n}% تخفیف"),
    },
    ordersTitle: bi("Ordered separately from a subscription", "سفارش جدا از اشتراک"),
    orders: [
      {
        title: bi("Custom handbook", "هندبوک اختصاصی"),
        text: bi(
          "A handbook written by the PharmaVault expert team around your products, production lines and procedures.",
          "هندبوکی که تیم تخصصی فارماوالت برای محصولات، خطوط تولید و رویه‌های شرکت شما می‌نویسد.",
        ),
      },
      {
        title: bi("Company-specific software", "نرم‌افزار ویژه شرکت"),
        text: bi(
          "A calculation or formulation tool the PharmaVault expert team builds on your data and your way of working.",
          "ابزار محاسبه یا فرمولاسیون که تیم تخصصی فارماوالت با داده‌ها و روش کار شرکت شما می‌سازد.",
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

  ctdService: {
    eyebrow: bi("CTD dossier compilation", "تدوین CTD"),
    title: bi("Your project's CTD in just 5 working days", "تدوین CTD پروژه شما فقط در 5 روز کاری"),
    lead: bi(
      "The PharmaVault expert team compiles your registration dossier in the Common Technical Document format (ICH M4), ready for submission to the Iran Food and Drug Administration.",
      "تیم تخصصی فارماوالت پرونده ثبت فرآورده شما را در قالب سند فنی مشترک (CTD) بر اساس ICH M4 و آماده ارائه به سازمان غذا و دارو تدوین می‌کند.",
    ),
    points: [
      bi("Module 1: regional administrative documents for the IFDA", "ماژول 1: مدارک اداری و منطقه‌ای مطابق الزامات سازمان غذا و دارو"),
      bi("Module 2: quality overall summary and overviews", "ماژول 2: خلاصه کلی کیفیت (QOS) و مرورها"),
      bi("Module 3: drug substance (3.2.S) and drug product (3.2.P), stability included", "ماژول 3: ماده مؤثره (⁦3.2.S⁩) و فرآورده (⁦3.2.P⁩) همراه با پایداری"),
      bi("Review against ICH Q-series guidelines and the current pharmacopoeias", "بازبینی بر اساس راهنماهای سری ICH Q و آخرین ویرایش فارماکوپه‌ها"),
    ],
    days: bi("working days", "روز کاری"),
    cta: bi("Request CTD compilation", "درخواست تدوین CTD"),
    form: {
      name: bi("Full name", "نام و نام خانوادگی"),
      phone: bi("Mobile or phone", "شماره موبایل یا تلفن"),
      company: bi("Company", "شرکت"),
      email: bi("Email", "ایمیل"),
      product: bi("Product", "فرآورده"),
      productHint: bi("Name, dosage form and strength", "نام، شکل دارویی و قدرت"),
      message: bi("Details", "توضیحات"),
      messageHint: bi("Modules needed, deadline or anything else", "ماژول‌های موردنیاز، زمان تحویل یا هر توضیح دیگر"),
      submit: bi("Send request", "ثبت درخواست"),
      sending: bi("Sending…", "در حال ثبت…"),
      sent: bi("Your request has been received", "درخواست شما ثبت شد"),
      sentNote: bi(
        "The PharmaVault expert team will call you on the number you entered.",
        "تیم تخصصی فارماوالت با شماره‌ای که وارد کردید با شما تماس می‌گیرد.",
      ),
      orContact: bi("Or contact us directly:", "یا مستقیم با ما در تماس باشید:"),
      copyEmail: bi("Copy email", "کپی ایمیل"),
      copied: bi("Copied", "کپی شد"),
      errors: {
        missing: bi("Enter your name and phone number.", "نام و شماره تماس را وارد کنید."),
        phone: bi("The phone number looks too short.", "شماره تماس کامل نیست."),
        unavailable: bi(
          "The request could not be saved right now. Please call us or email the address below.",
          "ثبت درخواست در حال حاضر ممکن نشد. لطفاً تماس بگیرید یا به ایمیل زیر پیام دهید.",
        ),
      },
    },
    subject: bi("PharmaVault — CTD compilation request", "PharmaVault — درخواست تدوین CTD"),
    body: bi(
      "Name:\nCompany:\nProduct (name, dosage form, strength):\nModules needed:\nPhone:\n",
      "نام و نام خانوادگی:\nشرکت:\nفرآورده (نام، شکل دارویی، قدرت):\nماژول‌های موردنیاز:\nشماره تماس:\n",
    ),
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
          "An individual subscription is for one user on one IP. For several people, the Team / Organisation plan starts at six users on different IPs, managed by the head of the unit, and more users can be added.",
          "اشتراک فردی برای یک کاربر روی یک IP است. برای استفاده چند نفر، طرح تیمی / سازمانی از شش کاربر با IPهای مختلف و با مدیریت مدیر واحد شروع می‌شود و می‌توان کاربر اضافه کرد.",
        ),
      },
      {
        q: bi("Can we order company-specific handbooks, SOPs or software?", "آیا امکان سفارش هندبوک، SOP یا نرم‌افزار اختصاصی شرکت وجود دارد؟"),
        a: bi(
          "Yes. The PharmaVault expert team prepares custom handbooks, company-specific software, database licences and CTD dossiers (compiled in 5 working days), ordered separately from a subscription or together with the Team / Organisation plan.",
          "بله. تیم تخصصی فارماوالت هندبوک اختصاصی، نرم‌افزار ویژه شرکت، مجوز استفاده از پایگاه داده و تدوین CTD (در 5 روز کاری) را جدا از اشتراک یا همراه با طرح تیمی / سازمانی آماده می‌کند.",
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
      "Request access for yourself, or ask for a Team / Organisation quotation for your department or company.",
      "برای خودتان درخواست دسترسی دهید، یا برای واحد یا شرکتتان پیش‌فاکتور طرح تیمی / سازمانی بخواهید.",
    ),
    access: bi("Subscribe now", "خرید اشتراک"),
    quote: bi("Request a team quotation", "درخواست پیش‌فاکتور تیمی / سازمانی"),
  },

  lastUpdate: {
    label: bi("Last updated", "آخرین به‌روزرسانی"),
    at: bi("{date}, {time}", "{date}، ساعت {time}"),
    daily: bi("Updated every day at 18:00 Tehran time", "به‌روزرسانی روزانه، هر روز ساعت 18:00 به وقت تهران"),
  },

  /** Pre-filled email used by every request button. */
  requestEmail: {
    subject: bi("PharmaVault — {plan} plan request", "PharmaVault — درخواست طرح {plan}"),
    body: bi(
      "Name:\nCompany / university / pharmacy:\nDepartment or field of study:\nPlan (individual or team):\nNumber of users:\nPhone:\n",
      "نام و نام خانوادگی:\nشرکت / دانشگاه / داروخانه:\nواحد یا رشته تحصیلی:\nطرح موردنظر (فردی یا تیمی):\nتعداد کاربران:\nشماره تماس:\n",
    ),
  },

  enamad: {
    title: bi("Electronic Trust Seal (e-Namad)", "نماد اعتماد الکترونیکی (اینماد)"),
    text: bi(
      "Licensed for online business and sales by the Center for E-Commerce Development, Ministry of Industry, Mine and Trade.",
      "دارای مجوز کسب‌وکار و فروش اینترنتی از مرکز توسعه تجارت الکترونیکی، وزارت صنعت، معدن و تجارت.",
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
    backHome: bi("Back to home", "بازگشت به صفحه اصلی"),
  },
};
