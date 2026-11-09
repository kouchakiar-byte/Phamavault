import { chapter, h2, p, ul, table } from "../lib.mjs";

const blank = `<span style="display:inline-block;min-width:60pt;border-bottom:.6pt dotted #9fb0c3">&nbsp;</span>`;

export default () => `
${chapter("پیوست ب", "الگوی گزارش فاز II", "Appendix B — Phase II report template")}
${p("الگوی زیر بخش‌هایی را نشان می‌دهد که یک گزارش فاز II قابل دفاع باید داشته باشد. هر بخش باید به شواهد (پیوست‌ها، شماره رکوردها) ارجاع دهد.")}
${h2("1. خلاصه")}
${ul(["محصول، بچ، آزمون، Specification و نتیجه OOS", "خلاصه یافته‌های فاز I و دلیل ورود به فاز II", "نتیجه‌گیری نهایی و تصمیم درباره بچ در یک پاراگراف"])}
${h2("2. تیم بررسی و زمان‌بندی")}
${table(["نقش", "نام و واحد", "تاریخ شروع", "تاریخ پایان"], [["رهبر بررسی (QA)", blank, blank, blank], ["QC", blank, blank, blank], ["تولید", blank, blank, blank], ["مهندسی / سایر", blank, blank, blank]])}
${h2("3. بررسی تولیدی")}
${table(
  ["حوزه", "رکوردهای بازبینی‌شده", "یافته"],
  [
    ["Batch record", blank, blank],
    ["Deviation و Change control", blank, blank],
    ["مواد اولیه و CoA", blank, blank],
    ["تجهیزات و داده‌های دستگاه", blank, blank],
    ["محیط و پرسنل", blank, blank],
    ["آزمون‌های حین فرایند", blank, blank],
  ],
)}
${h2("4. آزمون‌های تکمیلی")}
${table(["نوع (Retest / Resample / سایر)", "پروتکل و تأیید QA", "تعداد از پیش تعیین‌شده", "نتایج (همه)"], [[blank, blank, blank, blank], [blank, blank, blank, blank]])}
${h2("5. علت‌یابی")}
${ul(["ابزار استفاده‌شده (Ishikawa، 5 Whys، Fault tree)", "علل بررسی‌شده و شواهد رد یا تأیید هر کدام", "علت ریشه‌ای، یا محتمل‌ترین علت با سطح اطمینان آن"])}
${h2("6. دامنه اثر")}
${table(["بچ / محصول", "دلیل بررسی", "نتیجه ارزیابی", "اقدام"], [[blank, blank, blank, blank], [blank, blank, blank, blank]])}
${h2("7. تصمیم و CAPA")}
${table(["مورد", "شرح", "مسئول", "مهلت"], [["تصمیم درباره بچ", blank, blank, blank], ["Correction", blank, blank, blank], ["Corrective action", blank, blank, blank], ["Preventive action", blank, blank, blank], ["Effectiveness check", blank, blank, blank], ["گزارش به مرجع (در صورت نیاز)", blank, blank, blank]])}
<div style="break-inside:avoid">${h2("8. تأیید")}
${table(["نقش", "نام", "امضا", "تاریخ"], [["رهبر بررسی", blank, blank, blank], ["مدیر کنترل کیفیت", blank, blank, blank], ["مدیر تضمین کیفیت / QP", blank, blank, blank]])}</div>
`;
