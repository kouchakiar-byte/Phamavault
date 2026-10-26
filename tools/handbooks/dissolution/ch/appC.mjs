import { chapter, table } from "../lib.mjs";

// English term as used in the handbook, then its formal Persian equivalent.
const terms = [
  ["Dissolution", "انحلال"], ["Dissolution medium", "محیط انحلال"],
  ["Apparatus", "دستگاه انحلال"], ["Vessel", "ظرف آزمون"],
  ["Basket / Paddle", "سبد / پارو"], ["Sinker", "وزنه غوطه‌ورکننده"],
  ["Sampling zone", "ناحیه نمونه‌برداری"], ["Infinity point", "نقطه انتهایی آزادسازی کامل"],
  ["Sink condition", "شرایط Sink (رقیق کافی)"], ["Solubility", "انحلال‌پذیری"],
  ["Intrinsic solubility", "انحلال‌پذیری ذاتی"], ["Dose number", "عدد دوز"],
  ["Permeability", "نفوذپذیری"], ["Biowaiver", "معافیت از مطالعه هم‌ارزی زیستی"],
  ["Diffusion layer", "لایه انتشار"], ["Wettability", "ترشوندگی"],
  ["Disintegration", "از هم پاشیدگی قرص"], ["Deaggregation", "جداشدن ذرات اولیه"],
  ["Coning / Mounding", "تجمع مخروطی ذرات"], ["Hydrodynamics", "هیدرودینامیک"],
  ["Degassing", "گاززدایی"], ["Surfactant", "عامل فعال سطحی"],
  ["Critical micelle concentration", "غلظت بحرانی تشکیل میسل"], ["Biorelevant medium", "محیط شبیه‌ساز فیزیولوژیک"],
  ["Cross-linking", "اتصال عرضی"], ["Pellicle", "لایه نامحلول ژلاتینی"],
  ["Two-tier test", "آزمون دومرحله‌ای با آنزیم"], ["Acid stage / Buffer stage", "مرحله اسیدی / مرحله بافری"],
  ["Mechanical qualification", "تأیید مکانیکی دستگاه"], ["Performance verification test", "آزمون تأیید عملکرد"],
  ["Wobble / Runout", "لنگی محور"], ["Centering", "هم‌محوری"],
  ["Verticality", "قائم بودن"], ["Discriminating power", "قدرت تمایز"],
  ["Discard volume", "حجم دورریز فیلتر"], ["Filter adsorption", "جذب روی فیلتر"],
  ["Similarity factor (f2)", "ضریب مشابهت"], ["Difference factor (f1)", "ضریب تفاوت"],
  ["Profile comparison", "مقایسه پروفایل"], ["Reference listed drug", "فرآورده مرجع"],
  ["IVIVC", "همبستگی برون‌تنی–درون‌تنی"], ["Mean dissolution time", "میانگین زمان انحلال"],
  ["Immediate-release", "رهش فوری"], ["Extended-release", "رهش طولانی"],
  ["Delayed-release", "رهش تأخیری (روده‌ای)"], ["Lag time", "زمان تأخیر"],
  ["Over-lubrication", "روان‌سازی بیش از حد"], ["Polymorph", "چندریختی"],
  ["Disproportionation", "تبدیل نمک به فرم آزاد"], ["Supersaturation", "فوق‌اشباع"],
];
const rows = [];
for (let i = 0; i < terms.length; i += 2) rows.push([terms[i][0], terms[i][1], terms[i + 1]?.[0] ?? "", terms[i + 1]?.[1] ?? ""]);

export default () => `
${chapter("پیوست ج", "واژه‌نامه اصطلاحات تخصصی", "Appendix C — Glossary of technical terms")}
${table(["Term", "معادل فارسی", "Term", "معادل فارسی"], rows, { ltr: [0, 2] })}
`;
