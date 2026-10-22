import type { StaticImageData } from "next/image";
import { bi, type Bi } from "@/i18n/bi";
import hplcCover from "@/assets/handbooks/hplc-cover.webp";
import hplcPage1 from "@/assets/handbooks/hplc-page-1.webp";
import hplcPage2 from "@/assets/handbooks/hplc-page-2.webp";
import hplcPage3 from "@/assets/handbooks/hplc-page-3.webp";

export type FreeHandbook = {
  slug: string;
  issue: number;
  date: Bi;
  title: Bi;
  subtitle: Bi;
  /** Path of the PDF under public/. */
  file: string;
  sizeMb: number;
  pages: number;
  cover: StaticImageData;
  samples: StaticImageData[];
  stats: { value: number; label: Bi; plus?: boolean }[];
  chapters: Bi[];
};

/** Weekly free handbooks, newest first. */
export const freeHandbooks: FreeHandbook[] = [
  {
    slug: "hplc",
    issue: 1,
    date: bi("October 2026", "مهر 1405"),
    title: bi("HPLC — an applied handbook for the QC laboratory", "راهنمای کاربردی HPLC در واحد کنترل کیفیت"),
    subtitle: bi(
      "From separation fundamentals to systematic troubleshooting: columns, detectors, mobile phase, pharmacopoeial requirements, validation, data integrity, case studies and worked calculations.",
      "از مبانی جداسازی تا Troubleshooting سیستماتیک: ستون‌ها، Detectorها، فاز متحرک، الزامات فارماکوپه، صحه‌گذاری، یکپارچگی داده، مطالعات موردی و مسائل محاسباتی حل‌شده.",
    ),
    // The query string makes browsers fetch the revised edition.
    file: "/downloads/pharmavault-hplc-handbook.pdf?v=2",
    sizeMb: 2.9,
    pages: 74,
    cover: hplcCover,
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
  coverAlt: bi("Cover of the PharmaVault HPLC handbook", "جلد هندبوک HPLC فارماوالت"),
  sampleAlt: bi("Sample page", "نمونه صفحه"),
};
