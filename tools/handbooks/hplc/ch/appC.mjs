import { chapter, table } from "../lib.mjs";

const rows = [
  ["ریتنشن تایم", "Retention time", "ریتنشن فاکتور", "Retention factor (k)"],
  ["سلکتیویتی", "Selectivity (α)", "رزولوشن", "Resolution (Rs)"],
  ["پلیت تئوری", "Theoretical plate (N)", "ارتفاع معادل پلیت تئوری", "HETP (H)"],
  ["تیلینگ فاکتور", "Tailing factor (T)", "ضریب تقارن", "Symmetry factor (As)"],
  ["فرانتینگ", "Fronting", "کوالوشن", "Co-elution"],
  ["زمان مرده", "Hold-up time (tM)", "حجم مرده", "Hold-up / dead volume"],
  ["حجم تأخیر", "Dwell volume", "حجم خارج از ستون", "Extra-column volume"],
  ["الوشن ایزوکراتیک", "Isocratic elution", "الوشن گرادیانی", "Gradient elution"],
  ["فاز معکوس", "Reversed phase", "فاز نرمال", "Normal phase"],
  ["اندکپینگ", "End-capping", "سیلانول", "Silanol"],
  ["ذرات با پوسته متخلخل", "Superficially porous particles", "ذرات کاملاً متخلخل", "Fully porous particles"],
  ["گارد ستون", "Guard column", "فیلتر این‌لاین", "In-line filter"],
  ["دی‌وتینگ", "Pore dewetting", "پخش گردابی", "Eddy diffusion"],
  ["چک‌ولو", "Check valve", "سیل پیستون", "Piston seal"],
  ["دمپر", "Pulse damper", "ولو تناسب‌ساز", "Proportioning valve"],
  ["دگازر", "Degasser", "اتوسمپلر", "Autosampler"],
  ["لوپ نمونه", "Sample loop", "کری‌اوور", "Carryover"],
  ["دتکتور", "Detector", "فلوسل", "Flow cell"],
  ["دتکتور آرایه دیودی", "Diode array detector", "پیوریتی پیک", "Peak purity"],
  ["پهنای باند", "Bandwidth", "ثابت زمانی", "Time constant"],
  ["بیس‌لاین", "Baseline", "دریفت", "Drift"],
  ["گوست پیک", "Ghost peak", "نسبت سیگنال به نویز", "Signal-to-noise ratio"],
  ["نسبت قله به دره", "Peak-to-valley ratio", "ضریب پاسخ نسبی", "Relative response factor"],
  ["سیستم سوتیبیلیتی", "System suitability", "تنظیمات مجاز", "Allowable adjustments"],
  ["دایلوئنت", "Diluent", "اورلود", "Overload"],
  ["جفت‌یون", "Ion pairing", "تعادل‌یابی", "Equilibration"],
  ["تخریب اجباری", "Forced degradation", "موازنه جرم", "Mass balance"],
  ["گستره کاری", "Working range", "نتیجه قابل گزارش", "Reportable result"],
  ["پروفایل هدف روش", "Analytical target profile", "انتقال روش", "Method transfer"],
  ["کوالیفیکیشن دستگاه", "Analytical instrument qualification", "آدیت تریل", "Audit trail"],
  ["انتگرال‌گیری دستی", "Manual integration", "نتیجه خارج از مشخصات", "Out of specification (OOS)"],
];
export default () => `
${chapter("پیوست ج", "واژه‌نامه فارسی–انگلیسی", "Appendix C — Glossary")}
${table(["فارسی", "English", "فارسی", "English"], rows, { ltr: [1, 3] })}
`;
