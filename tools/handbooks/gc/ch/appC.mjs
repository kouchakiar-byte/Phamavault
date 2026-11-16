import { chapter, table } from "../lib.mjs";

// English term as used in the handbook, then its formal Persian equivalent.
const terms = [
  ["Gas chromatography (GC)", "کروماتوگرافی گازی"], ["Carrier gas", "گاز حامل"],
  ["Make-up gas", "گاز کمکی دتکتور"], ["Stationary phase", "فاز ساکن"],
  ["Capillary column", "ستون مویین"], ["Packed column", "ستون پرشده"],
  ["Fused silica", "سیلیکای ذوب‌شده"], ["Film thickness (d<sub>f</sub>)", "ضخامت فیلم فاز ساکن"],
  ["Phase ratio (β)", "نسبت فاز"], ["Partition coefficient (K)", "ضریب توزیع"],
  ["Retention factor (k)", "ضریب نگهداری"], ["Retention index", "شاخص نگهداری"],
  ["Hold-up time (t<sub>M</sub>)", "زمان مرده"], ["Linear velocity (ū)", "سرعت خطی متوسط"],
  ["Temperature programming", "برنامه دمایی"], ["Isothermal", "هم‌دما"],
  ["Ramp rate", "سرعت افزایش دما"], ["Hold time", "زمان نگهداری دما"],
  ["Inlet", "محل تزریق"], ["Liner", "لوله شیشه‌ای Inlet"],
  ["Septum", "دیافراگم تزریق"], ["Septum purge", "جریان پاک‌سازی Septum"],
  ["Split / Splitless", "تزریق با تقسیم / بدون تقسیم"], ["Split ratio", "نسبت تقسیم"],
  ["Backflash", "پس‌زدن بخار"], ["Discrimination", "تبعیض در انتقال نمونه"],
  ["Solvent focusing", "تمرکز با حلال"], ["Cold trapping", "تمرکز سرد"],
  ["Electronic pneumatic control (EPC)", "کنترل الکترونیکی پنوماتیک"], ["Ferrule", "حلقه آب‌بند اتصال"],
  ["Column bleed", "خروج فاز ساکن"], ["Conditioning", "آماده‌سازی حرارتی ستون"],
  ["Trimming", "بریدن ابتدای ستون"], ["Retention gap", "ستون پیش‌رو بدون فاز"],
  ["Flame ionization detector (FID)", "دتکتور یونش شعله‌ای"], ["Thermal conductivity detector (TCD)", "دتکتور هدایت حرارتی"],
  ["Electron capture detector (ECD)", "دتکتور جذب الکترون"], ["Jet / Collector", "نازل شعله / الکترود جمع‌کننده"],
  ["Electron ionization (EI)", "یونش الکترونی"], ["Selected ion monitoring (SIM)", "پایش یون انتخابی"],
  ["Static headspace", "فضای فوقانی ایستا"], ["Equilibration time", "زمان تعادل"],
  ["Transfer line", "خط انتقال"], ["Pressurization", "فشارافزایی ویال"],
  ["Salting out", "نمک‌افزایی"], ["Matrix effect", "اثر ماتریکس"],
  ["Full evaporation technique (FET)", "روش تبخیر کامل"], ["Multiple headspace extraction (MHE)", "استخراج چندمرحله‌ای فضای فوقانی"],
  ["Residual solvents", "حلال‌های باقی‌مانده"], ["Permitted daily exposure (PDE)", "مواجهه روزانه مجاز"],
  ["Standard addition", "افزایش استاندارد"], ["Internal standard", "استاندارد داخلی"],
  ["Ghost peak", "پیک شبح"], ["Carryover", "انتقال باقی‌مانده"],
  ["System suitability test (SST)", "آزمون تناسب سیستم"], ["Allowable adjustments", "تنظیمات مجاز"],
  ["Signal-to-noise ratio (S/N)", "نسبت سیگنال به نویز"], ["Symmetry factor (A<sub>S</sub>)", "ضریب تقارن"],
  ["Threshold of toxicological concern (TTC)", "آستانه نگرانی سم‌شناختی"], ["Audit trail", "دنباله ممیزی"],
];
const rows = [];
for (let i = 0; i < terms.length; i += 2) rows.push([terms[i][0], terms[i][1], terms[i + 1]?.[0] ?? "", terms[i + 1]?.[1] ?? ""]);

export default () => `
${chapter("پیوست ج", "واژه‌نامه اصطلاحات تخصصی", "Appendix C — Glossary of technical terms")}
${table(["Term", "معادل فارسی", "Term", "معادل فارسی"], rows, { ltr: [0, 2] })}
`;
