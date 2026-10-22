import { chapter, table } from "../lib.mjs";

// English term as used in the handbook, then its formal Persian equivalent.
const terms = [
  ["Retention time (t<sub>R</sub>)", "زمان بازداری"], ["Retention factor (k)", "ضریب بازداری"],
  ["Selectivity (α)", "گزینش‌پذیری"], ["Resolution (R<sub>s</sub>)", "قدرت تفکیک"],
  ["Theoretical plate (N)", "بشقابک نظری"], ["HETP (H)", "ارتفاع معادل بشقابک نظری"],
  ["Tailing factor (T)", "ضریب دنباله‌دهی"], ["Symmetry factor (A<sub>s</sub>)", "ضریب تقارن"],
  ["Fronting", "پیشانی‌دهی پیک"], ["Co-elution", "هم‌شویی"],
  ["Hold-up time (t<sub>M</sub>)", "زمان مرده"], ["Dwell volume", "حجم تأخیر"],
  ["Extra-column volume", "حجم خارج از ستون"], ["Isocratic elution", "شویش با ترکیب ثابت"],
  ["Gradient elution", "شویش شیب‌دار"], ["Reversed phase / Normal phase", "فاز معکوس / فاز نرمال"],
  ["End-capping", "پوشش انتهایی سیلانول‌ها"], ["Silanol", "گروه سیلانول"],
  ["Superficially porous particles", "ذرات با پوسته متخلخل"], ["Fully porous particles", "ذرات کاملاً متخلخل"],
  ["Guard column", "ستون محافظ"], ["In-line filter", "فیلتر درون‌خطی"],
  ["Dewetting", "آب‌زدایی منافذ"], ["Eddy diffusion", "پخش گردابی"],
  ["Check valve", "شیر یک‌طرفه"], ["Piston seal", "آب‌بند پیستون"],
  ["Pulse damper", "میراگر ضربان"], ["Proportioning valve", "شیر تناسب‌ساز"],
  ["Degasser", "گاززدا"], ["Autosampler", "تزریق‌گر خودکار"],
  ["Sample loop", "حلقه نمونه"], ["Carryover", "انتقال باقی‌مانده"],
  ["Detector", "آشکارساز"], ["Flow cell", "سلول جریان"],
  ["Diode array detector (DAD)", "آشکارساز آرایه دیودی"], ["Peak purity", "خلوص طیفی پیک"],
  ["Bandwidth", "پهنای باند"], ["Time constant", "ثابت زمانی"],
  ["Baseline", "خط پایه"], ["Drift", "رانش"],
  ["Ghost peak", "پیک شبح"], ["Signal-to-noise ratio (S/N)", "نسبت سیگنال به نویز"],
  ["Peak-to-valley ratio (p/v)", "نسبت قله به دره"], ["Relative response factor (RRF)", "ضریب پاسخ نسبی"],
  ["System Suitability Test (SST)", "آزمون تناسب سیستم"], ["Allowable adjustments", "تنظیمات مجاز"],
  ["Diluent", "حلال رقیق‌سازی نمونه"], ["Overload", "اضافه‌بار"],
  ["Ion pairing", "جفت‌یون"], ["Equilibration", "تعادل‌یابی ستون"],
  ["Flow rate", "سرعت جریان"], ["Sequence", "توالی تزریق"],
  ["Forced degradation", "تخریب اجباری"], ["Mass balance", "موازنه جرم"],
  ["Working range", "گستره کاری"], ["Reportable result", "نتیجه قابل گزارش"],
  ["Analytical Target Profile (ATP)", "پروفایل هدف روش"], ["Method transfer", "انتقال روش"],
  ["Qualification (DQ/IQ/OQ/PQ)", "کیفیت‌سنجی دستگاه"], ["Audit trail", "دنباله ممیزی"],
  ["Manual integration", "انتگرال‌گیری دستی"], ["Out of Specification (OOS)", "نتیجه خارج از مشخصات"],
  ["Troubleshooting", "عیب‌یابی"], ["Pre-heater", "پیش‌گرم‌کن فاز متحرک"],
];
const rows = [];
for (let i = 0; i < terms.length; i += 2) rows.push([terms[i][0], terms[i][1], terms[i + 1]?.[0] ?? "", terms[i + 1]?.[1] ?? ""]);

export default () => `
${chapter("پیوست ج", "واژه‌نامه اصطلاحات تخصصی", "Appendix C — Glossary of technical terms")}
${table(["Term", "معادل فارسی", "Term", "معادل فارسی"], rows, { ltr: [0, 2] })}
`;
