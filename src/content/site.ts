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
      "PharmaVault — Pharmaceutical Knowledge & Intelligence Platform",
      "PharmaVault — پلتفرم دانش و اطلاعات هوشمند دارویی",
    ),
    description: bi(
      "Handbooks, supplier records, excipient and raw material data, calculators, formulation tools and regulatory references, all in one place.",
      "هندبوک‌ها، بانک تأمین‌کنندگان، بانک اکسیپیان و مواد اولیه، ماشین‌حساب‌های دارویی، ابزار فرمولاسیون و منابع رگولاتوری، همه در یک جا.",
    ),
  },
  platform: bi("Pharmaceutical Knowledge & Intelligence Platform", "پلتفرم دانش و اطلاعات هوشمند دارویی"),

  nav: {
    sections: bi("Sections", "بخش‌ها"),
    tools: bi("Tools", "ابزارها"),
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
    eyebrow: bi("Pharmaceutical Knowledge & Intelligence Platform", "پلتفرم دانش و اطلاعات هوشمند دارویی"),
    title: bi("Everything a pharmaceutical company looks for", "هر چیزی که یک شرکت داروسازی دنبالش می‌گردد"),
    departments: [
      bi("R&D", "تحقیق و توسعه"),
      bi("Quality Control", "کنترل کیفیت"),
      bi("Quality Assurance", "تضمین کیفیت"),
      bi("Commercial", "بازرگانی"),
      bi("Production", "تولید"),
      bi("Regulatory Affairs", "رگولاتوری"),
    ],
    lead: bi(
      "Handbooks, supplier records, excipient and raw material data, calculators, formulation tools and regulatory references, all in one place.",
      "هندبوک‌ها، بانک تأمین‌کنندگان، بانک اکسیپیان و مواد اولیه، ماشین‌حساب‌های دارویی، ابزار فرمولاسیون و منابع رگولاتوری، همه در یک جا.",
    ),
    seePlans: bi("See plans", "مشاهده اشتراک‌ها"),
    browse: bi("Browse the sections", "مرور بخش‌ها"),
    sampleRecord: bi("Sample record", "رکورد نمونه"),
  },

  sectionsIntro: {
    eyebrow: bi("Inside the vault", "بخش‌های سایت"),
    title: bi("Nine sections, one login", "نه بخش، یک حساب کاربری"),
    lead: bi(
      "Records link to each other: from an excipient you reach its suppliers, the calculator that uses it and the regulatory requirement that covers it.",
      "رکوردها به هم وصل‌اند: از یک اکسیپیان به تأمین‌کننده‌هایش، به ماشین‌حساب مرتبط و به الزام رگولاتوری آن می‌رسید.",
    ),
  },

  plans: {
    eyebrow: bi("Plans", "اشتراک"),
    title: bi("Subscribe monthly or yearly", "اشتراک ماهانه یا سالانه"),
    lead: bi(
      "All three plans open the nine sections. They differ in the number of users and the level of data access.",
      "هر سه پلن به نه بخش دسترسی دارند؛ تفاوت در تعداد کاربر و سطح دسترسی به داده است.",
    ),
    items: [
      {
        id: "individual",
        name: bi("Individual", "فردی"),
        who: bi("For one formulator or specialist", "برای یک فرمولاتور یا کارشناس"),
        price: bi("Price set at launch", "قیمت: زمان راه‌اندازی اعلام می‌شود"),
        features: [
          bi("One user", "یک کاربر"),
          bi("Handbook library", "کتابخانه هندبوک‌ها"),
          bi("Calculators and formulation tools", "ماشین‌حساب‌ها و ابزار فرمولاسیون"),
          bi("Search in the excipient and raw material databases", "جستجو در بانک اکسیپیان و مواد اولیه"),
          bi("Regulatory resources", "منابع رگولاتوری"),
        ],
        cta: bi("Request access", "درخواست دسترسی"),
        style: "ghost",
      },
      {
        id: "team",
        name: bi("Team", "تیمی"),
        who: bi("For a company's R&D or QC unit", "برای واحد R&D یا QC یک شرکت"),
        price: bi("Price set at launch", "قیمت: زمان راه‌اندازی اعلام می‌شود"),
        features: [
          bi("Several users on one subscription", "چند کاربر با یک اشتراک"),
          bi("Everything in Individual", "همه امکانات پلن فردی"),
          bi("Supplier Database", "بانک تأمین‌کنندگان"),
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
          bi("Access levels by role and department", "سطوح دسترسی بر اساس نقش و واحد"),
          bi("Database delivered with restricted access", "دریافت دیتابیس با دسترسی محدود"),
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
        title: bi("Database licence", "لایسنس دیتابیس"),
        text: bi(
          "A copy of the databases with restricted access, for use inside the organisation.",
          "نسخه‌ای از بانک‌های داده با دسترسی محدود، برای استفاده داخل سازمان.",
        ),
      },
    ],
  },

  contact: {
    eyebrow: bi("Contact", "تماس"),
    title: bi("Request access or a quote", "درخواست دسترسی یا پیش‌فاکتور"),
    lead: bi(
      "Send your request by email: the plan you need, the number of users and your company's name.",
      "درخواست خود را ایمیل کنید: پلن موردنیاز، تعداد کاربران و نام شرکت.",
    ),
    email: bi("Email us", "ارسال ایمیل"),
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
