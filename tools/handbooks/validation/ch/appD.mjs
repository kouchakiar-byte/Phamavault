import { chapter, h2, p, table } from "../lib.mjs";

const list = (xs) => `<ol class="refs">${xs.map((x) => `<li>${x}</li>`).join("")}</ol>`;
export default () => `
${chapter("پیوست د", "واژه‌نامه و منابع", "Appendix D — Glossary and references")}
${h2("واژه‌نامه")}
${table(
  ["اصطلاح", "توضیح"],
  [
    ["Accuracy", "نزدیکی میانگین نتایج به مقدار واقعی یا مقدار مرجع پذیرفته‌شده (صحت)"],
    ["Precision", "نزدیکی نتایج تکرارها به یکدیگر (دقت)"],
    ["Specificity / Selectivity", "توانایی اندازه‌گیری بی‌ابهام Analyte در حضور سایر اجزا (اختصاصیت / گزینش‌پذیری)"],
    ["Response", "رابطه بین مقدار Analyte و پاسخ دستگاه؛ در Q2(R1) با عنوان Linearity"],
    ["Reportable range", "گستره نتایج گزارش‌شده که روش در آن عملکرد مناسب دارد"],
    ["Working range", "گستره غلظت محلول‌هایی که به دستگاه وارد می‌شوند"],
    ["DL / QL", "حد تشخیص / حد اندازه‌گیری کمّی"],
    ["Robustness", "پایداری عملکرد روش در برابر تغییرات کوچک و عمدی پارامترها (استحکام)"],
    ["ATP", "Analytical Target Profile؛ الزامات عملکردی روش"],
    ["Stability-indicating", "روشی که کاهش ماده مؤثره و افزایش محصولات تخریب را به‌درستی اندازه می‌گیرد"],
    ["Mass balance", "مقایسه مجموع Assay و ناخالصی‌ها با مقدار اولیه پس از تخریب"],
    ["RRF", "نسبت پاسخ ناخالصی به پاسخ ماده مؤثره در غلظت یکسان"],
    ["Dwell volume", "حجم بین نقطه اختلاط حلال‌ها و ابتدای ستون در گرادیان"],
    ["TOST", "Two one-sided tests؛ آزمون آماری هم‌ارزی"],
  ],
  { ltr: [0] },
)}
${h2("گایدلاین‌ها و فارماکوپه‌ها")}
${list([
  "ICH Q2(R2) Validation of Analytical Procedures. Step 4, 1 November 2023.",
  "ICH Q14 Analytical Procedure Development. Step 4, 1 November 2023.",
  "ICH Q1A(R2) Stability Testing of New Drug Substances and Products, 2003; ICH Q1B Photostability Testing, 1996.",
  "ICH Q3A(R2), Q3B(R2) Impurities in New Drug Substances / Products; ICH Q3C Residual Solvents; ICH M7 Mutagenic Impurities.",
  "ICH Q12 Technical and Regulatory Considerations for Pharmaceutical Product Lifecycle Management, 2019.",
  "USP General Chapters &lt;1225&gt; Validation of Compendial Procedures; &lt;1226&gt; Verification of Compendial Procedures; &lt;1224&gt; Transfer of Analytical Procedures; &lt;1220&gt; Analytical Procedure Life Cycle; &lt;1210&gt; Statistical Tools for Procedure Validation; &lt;621&gt; Chromatography; &lt;1058&gt; Analytical Instrument Qualification.",
  "Ph. Eur. 2.2.46 Chromatographic separation techniques.",
  "US FDA. Analytical Procedures and Methods Validation for Drugs and Biologics. Guidance for Industry, July 2015.",
  "US FDA. Investigating Out-of-Specification (OOS) Test Results for Pharmaceutical Production. Guidance for Industry, 2022.",
])}
${h2("کتاب‌ها و مقالات")}
${list([
  "Ermer J., Nethercote P. (eds.) <i>Method Validation in Pharmaceutical Analysis: A Guide to Best Practice</i>, 2nd ed. Wiley-VCH, 2015.",
  "Huber L. <i>Validation and Qualification in Analytical Laboratories</i>, 2nd ed. Informa Healthcare, 2007.",
  "Snyder L.R., Kirkland J.J., Dolan J.W. <i>Introduction to Modern Liquid Chromatography</i>, 3rd ed. Wiley, 2010.",
  "Horwitz W. Evaluation of analytical methods used for regulation of foods and drugs. <i>Anal. Chem.</i> 54 (1982) 67A–76A.",
  "Horwitz W., Albert R. The Horwitz ratio (HorRat): a useful index of method performance with respect to precision. <i>J. AOAC Int.</i> 89 (2006) 1095–1109.",
  "Blessy M., Patel R.D., Prajapati P.N., Agrawal Y.K. Development of forced degradation and stability indicating studies of drugs — a review. <i>J. Pharm. Anal.</i> 4 (2014) 159–165.",
])}
${p("<span style=\"font-size:8.6pt;color:#5b6b7f\">یادداشت: کادرهای «از منابع مرجع» خلاصه و بازنویسی مفاهیم منابع فوق‌اند و نقل‌قول مستقیم محسوب نمی‌شوند. همه شکل‌ها برای این هندبوک ترسیم شده‌اند و داده‌های آن‌ها نمایشی است. در تصمیم‌های رسمی، متن نسخه جاری گایدلاین‌ها و فارماکوپه‌ها ملاک است.</span>")}
<div style="margin-top:18pt;padding:12pt 14pt;border-radius:6pt;background:linear-gradient(120deg,#0b1f3a,#12305a);color:#fff;text-align:center;break-inside:avoid">
<div style="font-weight:800;font-size:12pt;color:#ecd27f">PharmaVault — گنجینه اطلاعات داروسازی</div>
<div style="font-size:9.4pt;color:#cfe9e7;margin-top:3pt">هر هفته یک هندبوک تخصصی رایگان · <span style="direction:ltr;unicode-bidi:isolate;color:#ecd27f">pharmavault.ir</span></div>
</div>
`;
