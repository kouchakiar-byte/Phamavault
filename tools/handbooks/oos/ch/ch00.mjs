import { chapter, h2, p, box, table } from "../lib.mjs";

export default () => `
${chapter("پیشگفتار", "درباره این هندبوک", "About this handbook", "پیشگفتار — درباره این هندبوک")}
${p(
  "نتیجه خارج از Specification (OOS) لحظه‌ای است که کیفیت یک بچ، اعتبار آزمایشگاه و صداقت سیستم کیفیت هم‌زمان آزموده می‌شوند. اگر آزمایشگاه یک نتیجه OOS را بدون بررسی مستند کنار بگذارد یا آن‌قدر آزمون را تکرار کند تا عدد «قبول» به دست آید، ممکن است محصول معیوب به بازار برسد؛ و اگر یک خطای ساده آزمایشگاهی بدون شواهد به تولید نسبت داده شود، بچ سالم بی‌دلیل رد می‌شود. بررسی نتایج OOS به همین دلیل یکی از پرتکرارترین موضوعات در Warning Letterهای FDA و در یافته‌های بازرسی GMP است.",
  "رویکرد امروز به بررسی OOS از پرونده معروف <b>United States v. Barr Laboratories</b> (1993) شکل گرفت و در راهنمای FDA با عنوان <b>Investigating Out-of-Specification (OOS) Test Results for Pharmaceutical Production</b> (نسخه نخست October 2006 و ویرایش 1 در May 2022) تدوین شد. EU GMP، راهنمای MHRA و PIC/S هم بر همین اصول تکیه دارند: نتیجه OOS معتبر است مگر آنکه بررسی مستند خلاف آن را نشان دهد.",
)}
${p(
  "این هندبوک ادامه سه شماره قبل (HPLC، Dissolution و Validation) است و برای کارشناسانی تدوین شده که باید یک نتیجه OOS یا OOT را بررسی کنند، فرم تحقیق را تکمیل کنند، درباره بچ تصمیم بگیرند یا در بازرسی از این تصمیم دفاع کنند. ساختار هندبوک: فصل 1 مفاهیم و تعاریف؛ فصل 2 چارچوب مقررات؛ فصل 3 فاز I آزمایشگاهی؛ فصل 4 فرضیه‌آزمایی؛ فصل 5 فاز II؛ فصل 6 Retest، Resample، Averaging و Outlier؛ فصل 7 نتایج OOT؛ فصل 8 تصمیم درباره بچ، CAPA و مستندسازی؛ فصل 9 مطالعات موردی. پیوست‌ها شامل فلوچارت و چک‌لیست فاز I، الگوی گزارش فاز II، مثال‌های حل‌شده، واژه‌نامه و رفرنس‌هاست.",
)}
${box(
  "ref",
  "کادرهای طلایی",
  p("کادرهای طلایی‌رنگ خلاصه‌ای بازنویسی‌شده از مفاهیم کلیدی راهنماها و مقررات است و منبع هر کادر در انتهای آن ذکر شده است. این کادرها نقل‌قول مستقیم نیستند؛ برای متن کامل به منبع اصلی (پیوست د) مراجعه شود."),
)}
${box(
  "key",
  "SOP سازمان شما ملاک است",
  p("راهنمای FDA و سایر مراجع اصول را تعیین می‌کنند، نه جزئیات اجرایی را. تعداد Retestها، معیار Resample، روش تعیین OOT و زمان‌بندی هر مرحله باید پیش از وقوع OOS در <b>SOP مصوب سازمان</b> تعریف شده باشد. اعدادی که در این هندبوک با عنوان «رایج» آمده، برگرفته از عرف صنعت است و الزام رسمی نیست."),
)}
${h2("اختصارها")}
${table(
  ["اختصار", "عبارت کامل", "اختصار", "عبارت کامل"],
  [
    ["OOS", "Out of specification", "OOT", "Out of trend"],
    ["OOE", "Out of expectation", "CoA", "Certificate of analysis"],
    ["SST", "System suitability test", "RSD", "Relative standard deviation"],
    ["CAPA", "Corrective and preventive action", "RCA", "Root cause analysis"],
    ["BMR / BPR", "Batch manufacturing / packaging record", "APQR / PQR", "Annual product quality review"],
    ["QA / QC", "Quality assurance / control", "QP", "Qualified person"],
    ["FAR", "Field alert report (21 CFR 314.81)", "CU", "Content uniformity"],
    ["PI", "Prediction interval", "LIMS", "Laboratory information management system"],
  ],
  { ltr: [1, 3] },
)}
`;
