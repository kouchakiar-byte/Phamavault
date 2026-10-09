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
      "PharmaVault — Pharmaceutical Knowledge & Formulation Intelligence",
      "PharmaVault — دانش دارویی و هوشمندی فرمولاسیون",
    ),
    description: bi(
      "A knowledge platform for pharmaceutical R&D, quality and regulatory teams: excipient and API databases, a raw material supplier directory, pharmaceutical calculations, GMP-aligned SOPs and CTD/ICH references.",
      "پلتفرم دانش تخصصی برای تیم‌های تحقیق و توسعه، کیفیت و امور رگولاتوری: پایگاه‌های داده مواد جانبی و مواد مؤثره، فهرست تأمین‌کنندگان مواد اولیه، محاسبات داروسازی، دستورالعمل‌های منطبق بر GMP و مرجع CTD و ICH.",
    ),
  },
  platform: bi("Pharmaceutical Knowledge & Formulation Intelligence", "دانش دارویی و هوشمندی فرمولاسیون"),
  slogan: bi("Your Gateway to Pharmaceutical Development", "دروازه شما به توسعه دارو"),

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
    eyebrow: bi("Pharmaceutics · R&D · Formulation Science", "داروسازی · تحقیق و توسعه · علم فرمولاسیون"),
    lead: bi(
      "A professional knowledge platform for pharmaceutical R&D, quality and regulatory teams — from pre-formulation and excipient selection to GMP documentation and the CTD dossier.",
      "پلتفرم دانش تخصصی برای تیم‌های تحقیق و توسعه، کیفیت و امور رگولاتوری — از پیش‌فرمولاسیون و انتخاب مواد جانبی تا مستندسازی GMP و پرونده CTD.",
    ),
    browse: bi("Browse the sections", "مرور بخش‌ها"),
    supplierSearch: bi("Search the supplier bank", "جستجو در بانک تأمین‌کنندگان"),
    seePlans: bi("See plans", "مشاهده اشتراک‌ها"),
    pillars: [
      {
        title: bi("Evidence-based", "مستند و علمی"),
        text: bi("Grounded in pharmacopoeias (USP–NF, Ph. Eur.) and ICH guidelines", "مبتنی بر فارماکوپه‌ها (USP–NF، Ph. Eur.) و راهنماهای ICH"),
      },
      {
        title: bi("Development-oriented", "توسعه‌محور"),
        text: bi("From pre-formulation to scale-up and technology transfer", "از پیش‌فرمولاسیون تا افزایش مقیاس و انتقال فناوری"),
      },
      {
        title: bi("GMP & regulatory-ready", "منطبق بر GMP و الزامات رگولاتوری"),
        text: bi("Structured around CTD, the ICH Q series and PIC/S GMP", "ساختاریافته بر پایه CTD، راهنماهای سری Q ICH و PIC/S GMP"),
      },
    ],
  },

  audience: {
    title: bi("Built for every function of a pharmaceutical company", "برای همه واحدهای یک شرکت داروسازی"),
    items: [
      bi("Research & Development (R&D)", "تحقیق و توسعه (R&D)"),
      bi("Quality Control (QC)", "کنترل کیفیت (QC)"),
      bi("Quality Assurance (QA)", "تضمین کیفیت (QA)"),
      bi("Production", "تولید"),
      bi("Regulatory Affairs", "امور رگولاتوری"),
      bi("Supply chain & procurement", "تأمین و بازرگانی"),
    ],
  },

  sectionsIntro: {
    eyebrow: bi("Inside the vault", "بخش‌های پلتفرم"),
    title: bi("Nine specialised sections, one integrated platform", "نُه بخش تخصصی در یک پلتفرم یکپارچه"),
    lead: bi(
      "Records are cross-linked: from an excipient you reach its suppliers, the relevant calculation and the regulatory requirement that applies.",
      "اطلاعات به هم پیوسته‌اند: از هر ماده جانبی به تأمین‌کنندگان آن، محاسبه مرتبط و الزام رگولاتوری مربوط می‌رسید.",
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
      "Searchable in Persian and English, by trade name or CAS number.",
      "قابل جستجو به فارسی و انگلیسی، با نام تجاری یا شماره CAS.",
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
    title: bi("Eight calculators built on standard pharmaceutical equations", "هشت ماشین‌حساب بر پایه معادلات استاندارد داروسازی"),
    lead: bi(
      "Results update as you type, with the governing equation shown under each calculator.",
      "نتیجه هم‌زمان با ورود داده محاسبه می‌شود و معادله مبنا زیر هر ماشین‌حساب آمده است.",
    ),
    open: bi("Open calculations", "ورود به محاسبات"),
  },

  plans: {
    eyebrow: bi("Plans", "اشتراک"),
    title: bi("Subscription plans — monthly or annual", "طرح‌های اشتراک — ماهانه یا سالانه"),
    lead: bi(
      "All three plans give access to the nine sections; they differ in the number of users and the level of data access.",
      "هر سه طرح به نُه بخش دسترسی دارند؛ تفاوت آن‌ها در تعداد کاربران و سطح دسترسی به داده‌هاست.",
    ),
    items: [
      {
        id: "individual",
        name: bi("Individual", "فردی"),
        who: bi("For one formulator or specialist", "برای یک فرمولاتور یا کارشناس"),
        price: bi("Price set at launch", "قیمت: زمان راه‌اندازی اعلام می‌شود"),
        features: [
          bi("One user", "یک کاربر"),
          bi("Technical handbook library", "کتابخانه هندبوک‌های تخصصی"),
          bi("Pharmaceutical calculations and formulation design tools", "محاسبات داروسازی و ابزارهای طراحی فرمولاسیون"),
          bi("Excipient and API databases", "پایگاه‌های داده مواد جانبی و مواد مؤثره"),
          bi("CTD and ICH regulatory references", "مرجع رگولاتوری CTD و ICH"),
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
          bi("Raw material supplier directory", "پایگاه داده تأمین‌کنندگان مواد اولیه"),
          bi("Shared saved formulas and calculations", "فرمول‌ها و محاسبات ذخیره‌شده مشترک"),
          bi("User management by the unit head", "مدیریت کاربران توسط مدیر واحد"),
        ],
        cta: bi("Request access", "درخواست دسترسی"),
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

  contact: {
    eyebrow: bi("Contact", "تماس"),
    title: bi("Have a formulation, quality or regulatory question?", "پرسشی در زمینه فرمولاسیون، کیفیت یا امور رگولاتوری دارید؟"),
    lead: bi(
      "To request access or a quote, email us the plan you need, the number of users and your company's name.",
      "برای درخواست دسترسی یا پیش‌فاکتور، طرح موردنیاز، تعداد کاربران و نام شرکت را ایمیل کنید.",
    ),
  },

  footer: {
    about: bi(
      "A knowledge and R&D platform for pharmaceutical formulation, quality and regulatory affairs.",
      "پلتفرم دانش و تحقیق و توسعه در حوزه فرمولاسیون دارویی، کیفیت و امور رگولاتوری.",
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
