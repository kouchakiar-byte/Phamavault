import type { StaticImageData } from "next/image";
import { bi, type Bi } from "@/i18n/bi";
import dissolutionCover from "@/assets/handbooks/dissolution-cover.webp";
import dissolutionPage1 from "@/assets/handbooks/dissolution-page-1.webp";
import dissolutionPage2 from "@/assets/handbooks/dissolution-page-2.webp";
import dissolutionPage3 from "@/assets/handbooks/dissolution-page-3.webp";
import hplcCover from "@/assets/handbooks/hplc-cover.webp";
import hplcPage1 from "@/assets/handbooks/hplc-page-1.webp";
import hplcPage2 from "@/assets/handbooks/hplc-page-2.webp";
import hplcPage3 from "@/assets/handbooks/hplc-page-3.webp";

export type FreeHandbook = {
  slug: string;
  issue: number;
  /** Publication day (YYYY-MM-DD); the label shows the week of the Persian month. */
  published: string;
  title: Bi;
  subtitle: Bi;
  /** File name of the PDF under private/handbooks/, served by /api/free-handbooks/[slug]. */
  pdf: string;
  /** Raised when the PDF is replaced, so browsers fetch the new edition. */
  edition?: number;
  sizeMb: number;
  pages: number;
  cover: StaticImageData;
  coverAlt: Bi;
  samples: StaticImageData[];
  stats: { value: number; label: Bi; plus?: boolean }[];
  chapters: Bi[];
};

/** Weekly handbooks, newest first. Only the newest is free; earlier issues are for subscribers. */
export const freeHandbooks: FreeHandbook[] = [
  {
    slug: "dissolution",
    issue: 2,
    published: "2026-10-26",
    title: bi("Dissolution testing — an applied handbook", "راهنمای کاربردی آزمون انحلال (Dissolution)"),
    subtitle: bi(
      "From dissolution fundamentals and apparatus qualification to troubleshooting and profile comparison: media, discriminating methods, USP acceptance tables for IR, ER and DR, f2 and biowaivers, case studies and worked calculations.",
      "از مبانی انحلال و Qualification دستگاه تا Troubleshooting و مقایسه پروفایل: Dissolution medium، روش Discriminating، جدول‌های پذیرش USP برای IR، ER و DR، f2 و Biowaiver، مطالعات موردی و مسائل محاسباتی حل‌شده.",
    ),
    pdf: "pharmavault-dissolution-handbook.pdf",
    sizeMb: 1.9,
    pages: 59,
    cover: dissolutionCover,
    coverAlt: bi("Cover of the PharmaVault dissolution handbook", "جلد هندبوک آزمون انحلال فارماوالت"),
    samples: [dissolutionPage1, dissolutionPage2, dissolutionPage3],
    stats: [
      { value: 59, label: bi("pages", "صفحه") },
      { value: 10, label: bi("chapters", "فصل") },
      { value: 18, label: bi("figures", "شکل و نمودار") },
      { value: 10, label: bi("case studies", "مطالعه موردی") },
    ],
    chapters: [
      bi("Dissolution fundamentals: Noyes–Whitney, solubility, BCS, sink", "مبانی انحلال: Noyes–Whitney، Solubility، BCS و Sink condition"),
      bi("Apparatus 1 to 7", "Apparatus 1 تا 7"),
      bi("Mechanical qualification, PVT and maintenance", "Mechanical qualification، PVT و نگهداری دستگاه"),
      bi("Dissolution media: selection, degassing, surfactants", "Dissolution medium: انتخاب، Degassing و Surfactant"),
      bi("Method development, discriminating power and validation", "توسعه روش، Discriminating power و Validation"),
      bi("Acceptance tables for IR, ER and DR; two-tier test", "جدول‌های پذیرش IR، ER و DR؛ آزمون Two-tier"),
      bi("Profile comparison (f2), ICH M9 biowaivers, SUPAC and IVIVC", "مقایسه پروفایل (f2)، Biowaiver طبق ICH M9، SUPAC و IVIVC"),
      bi("Systematic troubleshooting", "Troubleshooting سیستماتیک"),
      bi("10 troubleshooting case studies", "10 مطالعه موردی Troubleshooting"),
      bi("Worked calculations", "مسائل محاسباتی حل‌شده"),
      bi("Appendices: quick matrix, 25 questions, glossary, references", "پیوست‌ها: جدول Troubleshooting سریع، 25 پرسش، واژه‌نامه اصطلاحات، رفرنس‌ها"),
    ],
  },
  {
    slug: "hplc",
    issue: 1,
    published: "2026-10-22",
    title: bi("HPLC — an applied handbook for the QC laboratory", "راهنمای کاربردی HPLC در واحد کنترل کیفیت"),
    subtitle: bi(
      "From separation fundamentals to systematic troubleshooting: columns, detectors, mobile phase, pharmacopoeial requirements, validation, data integrity, case studies and worked calculations.",
      "از مبانی جداسازی تا Troubleshooting سیستماتیک: ستون‌ها، Detectorها، فاز متحرک، الزامات فارماکوپه، صحه‌گذاری، یکپارچگی داده، مطالعات موردی و مسائل محاسباتی حل‌شده.",
    ),
    pdf: "pharmavault-hplc-handbook.pdf",
    edition: 2,
    sizeMb: 2.9,
    pages: 74,
    cover: hplcCover,
    coverAlt: bi("Cover of the PharmaVault HPLC handbook", "جلد هندبوک HPLC فارماوالت"),
    samples: [hplcPage1, hplcPage2, hplcPage3],
    stats: [
      { value: 74, label: bi("pages", "صفحه") },
      { value: 11, label: bi("chapters", "فصل") },
      { value: 40, label: bi("figures", "شکل و نمودار"), plus: true },
      { value: 12, label: bi("case studies", "مطالعه موردی") },
    ],
    chapters: [
      bi("Separation fundamentals and chromatographic parameters", "مبانی جداسازی و پارامترهای کروماتوگرافی"),
      bi("Instrument components and flow path", "اجزای دستگاه و مسیر جریان"),
      bi("Columns: chemistry, morphology and care", "ستون‌ها: شیمی، ساختار و نگهداری"),
      bi("Detectors", "Detectorها"),
      bi("Mobile phase and method considerations", "فاز متحرک و ملاحظات روش"),
      bi("Pharmacopoeial requirements and system suitability", "الزامات فارماکوپه و System Suitability"),
      bi("Validation, verification and transfer", "صحه‌گذاری، تأیید و انتقال روش"),
      bi("Routine operation, qualification and data integrity", "عملیات روزمره، Qualification دستگاه و یکپارچگی داده"),
      bi("Systematic troubleshooting", "Troubleshooting سیستماتیک"),
      bi("12 troubleshooting case studies", "12 مطالعه موردی Troubleshooting"),
      bi("Worked calculations", "مسائل محاسباتی حل‌شده"),
      bi("Appendices: quick matrix, 25 questions, glossary, references", "پیوست‌ها: جدول Troubleshooting سریع، 25 پرسش، واژه‌نامه اصطلاحات، رفرنس‌ها"),
    ],
  },
];

/** Where the PDF is downloaded from. */
export const handbookUrl = (h: FreeHandbook) => `/api/free-handbooks/${h.slug}${h.edition ? `?v=${h.edition}` : ""}`;

const ORDINAL_FA = ["اول", "دوم", "سوم", "چهارم", "پنجم", "ششم"];
const ORDINAL_EN = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

/**
 * "هفته دوم آبان 1405": the week of the Persian month the issue appeared in.
 * Weeks start on Saturday, so days before the first Saturday are week one.
 */
export function issueWeek(published: string): Bi {
  const at = new Date(`${published}T12:00:00Z`);
  const parts = (locale: string) =>
    Object.fromEntries(
      new Intl.DateTimeFormat(`${locale}-u-ca-persian-nu-latn`, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
        .formatToParts(at)
        .map((p) => [p.type, p.value]),
    );
  const en = parts("en");
  const fa = parts("fa-IR");
  const day = Number(en.day);
  const first = new Date(at.getTime() - (day - 1) * 86_400_000);
  const offset = (first.getUTCDay() + 1) % 7; // Saturday = 0
  const week = Math.floor((day - 1 + offset) / 7);
  const year = String(en.year).replace(/\D/g, "");
  return bi(`${ORDINAL_EN[week]} week of ${en.month} ${year}`, `هفته ${ORDINAL_FA[week]} ${fa.month} ${year}`);
}

export const freeHandbookCopy = {
  eyebrow: bi("Free weekly handbook", "هندبوک رایگان هفته"),
  pageTitle: bi("Free weekly handbooks", "هندبوک‌های رایگان هفته"),
  lead: bi(
    "Every week a new, in-depth handbook for pharmaceutical professionals, written in Persian with expert terminology, figures and references. Free to download.",
    "هر هفته یک هندبوک تخصصی و جامع برای متخصصان صنعت داروسازی؛ با اصطلاحات تخصصی، شکل‌ها و رفرنس‌های معتبر. دانلود رایگان.",
  ),
  thisWeek: bi("This week", "هندبوک این هفته"),
  issue: bi("Issue {n}", "شماره {n}"),
  free: bi("Free", "رایگان"),
  download: bi("Download the PDF free", "دانلود رایگان PDF"),
  details: bi("Contents and details", "فهرست و جزئیات"),
  size: bi("{s} MB · {p} pages · Persian", "{s} مگابایت · {p} صفحه · فارسی"),
  contents: bi("What's inside", "محتوای هندبوک"),
  preview: bi("A look inside", "نگاهی به صفحات"),
  rightsTitle: bi("Copyright", "حقوق نشر"),
  rights: bi(
    "© PharmaVault. The handbook is free for personal reading and professional use. Copying, reproducing, republishing in whole or in part, editing, translating, selling, or posting the file or its content on websites, channels or social media without written permission is prohibited and legally pursued under Iran's copyright law. To share it with colleagues, send them the link to this page.",
    "© PharmaVault. این هندبوک برای مطالعه شخصی و استفاده حرفه‌ای رایگان است. هرگونه کپی‌برداری، تکثیر، بازنشر کامل یا بخشی، ویرایش، ترجمه، فروش، و قرار دادن فایل یا محتوای آن در وب‌سایت‌ها، کانال‌ها و شبکه‌های اجتماعی بدون مجوز کتبی ممنوع است و بر اساس قانون حمایت حقوق مؤلفان و مصنفان و هنرمندان پیگرد قانونی دارد. برای معرفی به همکاران، لینک همین صفحه را بفرستید.",
  ),
  next: bi("A new handbook every week", "هر هفته یک هندبوک جدید"),
  nextText: bi(
    "New issues are added here every week. Bookmark this page or install the PharmaVault app so you don't miss one.",
    "شماره‌های جدید هر هفته در همین صفحه منتشر می‌شوند. این صفحه را نشانه‌گذاری کنید یا اپلیکیشن فارماوالت را نصب کنید تا هیچ شماره‌ای را از دست ندهید.",
  ),
  archive: bi("Previous issues", "شماره‌های قبلی"),
  archiveTitle: bi("Handbooks of previous weeks", "هندبوک‌های هفته‌های گذشته"),
  archiveLead: bi(
    "Earlier issues, in order of issue number. This week's handbook is free for everyone; earlier issues are available to PharmaVault subscribers.",
    "شماره‌های قبلی به ترتیب شماره. هندبوک این هفته برای همه رایگان است؛ شماره‌های قبلی ویژه مشترکان فارماوالت است.",
  ),
  subscribers: bi("Subscribers", "ویژه مشترکان"),
  downloadPrevious: bi("Download PDF", "دانلود PDF"),
  checking: bi("Checking…", "در حال بررسی…"),
  lockedTitle: bi("For subscribers only", "ویژه مشترکان"),
  lockedText: bi(
    "Handbooks of previous weeks are available only to users with a subscription. This week's handbook is free for everyone.",
    "هندبوک‌های هفته‌های گذشته فقط برای کاربرانی که اشتراک تهیه کرده‌اند در دسترس است. هندبوک این هفته برای همه رایگان است.",
  ),
  buy: bi("Get a subscription", "تهیه اشتراک"),
  login: bi("Sign in", "ورود به حساب"),
  close: bi("Close", "بستن"),
  sampleAlt: bi("Sample page", "نمونه صفحه"),
};
