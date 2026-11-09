import { chapter, h2, p, table } from "../lib.mjs";

const list = (xs) => `<ol class="refs">${xs.map((x) => `<li>${x}</li>`).join("")}</ol>`;
export default () => `
${chapter("پیوست د", "واژه‌نامه و منابع", "Appendix D — Glossary and references")}
${h2("واژه‌نامه")}
${table(
  ["اصطلاح", "توضیح"],
  [
    ["OOS", "Out-of-Specification؛ نتیجه‌ای خارج از Specification یا معیار پذیرش ثبت‌شده"],
    ["OOT", "Out-of-Trend؛ نتیجه‌ای در Specification که از روند مورد انتظار همان بچ یا بچ‌های قبلی فاصله معنی‌دار دارد"],
    ["Atypical / Aberrant result", "نتیجه غیرعادی در محدوده که با رفتار شناخته‌شده روش یا محصول سازگار نیست"],
    ["Assignable cause", "علت قابل انتساب؛ علت مستند و قابل اثباتی که نتیجه را توضیح می‌دهد"],
    ["Invalidation", "ابطال نتیجه، فقط بر پایه شواهد عینی یک خطای آزمایشگاهی"],
    ["Retest", "آزمون مجدد روی همان نمونه اصلی، طبق پروتکل و با تعداد از پیش تعیین‌شده"],
    ["Resample", "نمونه‌برداری جدید از بچ، فقط وقتی نمونه اصلی نماینده بچ نبوده است"],
    ["Hypothesis testing", "آزمایش هدفمند برای تأیید یا رد یک فرضیه مشخص درباره علت (فاز Ib)"],
    ["Testing into compliance", "تکرار آزمون تا رسیدن به نتیجه قبول و نادیده گرفتن نتایج نامطلوب"],
    ["Root cause", "علت ریشه‌ای؛ عاملی که حذف آن از تکرار مشکل جلوگیری می‌کند"],
    ["Prediction interval", "بازه‌ای که انتظار می‌رود یک نتیجه جدید با احتمال مشخص در آن قرار گیرد"],
    ["CAPA", "Corrective and Preventive Action؛ اقدام اصلاحی و پیشگیرانه"],
    ["FAR", "Field Alert Report؛ گزارش FDA برای نقص کیفی بچ‌های توزیع‌شده"],
    ["APQR / PQR", "بازنگری سالانه یا دوره‌ای کیفیت محصول"],
  ],
  { ltr: [0] },
)}
${h2("گایدلاین‌ها، مقررات و فارماکوپه‌ها")}
${list([
  "US FDA. Investigating Out-of-Specification (OOS) Test Results for Pharmaceutical Production. Guidance for Industry, October 2006; Revision 1, May 2022.",
  "US Code of Federal Regulations, 21 CFR Part 211: §211.160, §211.165, §211.180(e), §211.192, §211.194.",
  "US Code of Federal Regulations, 21 CFR §314.81(b)(1) Field Alert Reports.",
  "EudraLex Volume 4, EU GMP Part I: Chapter 1 Pharmaceutical Quality System; Chapter 6 Quality Control; Chapter 8 Complaints, Quality Defects and Product Recalls.",
  "MHRA. Out of Specification and Out of Trend Investigations. Guidance (GMP), current version.",
  "ICH Q1E Evaluation of Stability Data, 2003.",
  "ICH Q9(R1) Quality Risk Management, 2023; ICH Q10 Pharmaceutical Quality System, 2008.",
  "USP General Chapters &lt;711&gt; Dissolution; &lt;905&gt; Uniformity of Dosage Units; &lt;1010&gt; Analytical Data — Interpretation and Treatment; &lt;61&gt; Microbiological Examination of Nonsterile Products.",
])}
${h2("پرونده‌ها و مقالات")}
${list([
  "United States v. Barr Laboratories, Inc., 812 F. Supp. 458 (D.N.J. 1993).",
  "PhRMA CMC Statistics and Stability Expert Teams. Identification of Out-of-Trend Stability Results: A Review of the Potential Regulatory Issue and Various Approaches. <i>Pharmaceutical Technology</i> 27(4) (2003) 38–52.",
  "Montgomery D.C. <i>Introduction to Statistical Quality Control</i>, 8th ed. Wiley, 2019.",
])}
${p("<span style=\"font-size:8.6pt;color:#5b6b7f\">یادداشت: کادرهای «از منابع مرجع» خلاصه و بازنویسی مفاهیم منابع فوق‌اند و نقل‌قول مستقیم محسوب نمی‌شوند. همه شکل‌ها برای این هندبوک ترسیم شده‌اند و داده‌های آن‌ها نمایشی است. در تصمیم‌های رسمی، متن نسخه جاری گایدلاین‌ها، مقررات و فارماکوپه‌ها ملاک است.</span>")}
<div style="margin-top:18pt;padding:12pt 14pt;border-radius:6pt;background:linear-gradient(120deg,#0b1f3a,#12305a);color:#fff;text-align:center;break-inside:avoid">
<div style="font-weight:800;font-size:12pt;color:#ecd27f">PharmaVault — گنجینه اطلاعات داروسازی</div>
<div style="font-size:9.4pt;color:#cfe9e7;margin-top:3pt">هر هفته یک هندبوک تخصصی رایگان · <span style="direction:ltr;unicode-bidi:isolate;color:#ecd27f">pharmavault.ir</span></div>
</div>
`;
