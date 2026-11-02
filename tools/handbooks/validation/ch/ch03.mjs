import { chapter, h2, h3, p, ul, box, table, fig, svg, T, axes, trace, path, C } from "../lib.mjs";

/** Overlay: placebo, unstressed sample and acid-stressed sample. */
const overlay = () => {
  const w = 640, h = 270;
  const ax = axes({ w, h, xmin: 0, xmax: 16, ymin: -2, ymax: 105, xticks: [0, 2, 4, 6, 8, 10, 12, 14, 16], yticks: [], xlabel: "Retention time (min)", ylabel: "Response" });
  const off = (k) => (v) => ax.sy(v + k);
  const placebo = trace({ sx: ax.sx, sy: off(0), tmin: 0, tmax: 16, peaks: [{ t0: 1.6, h: 6, s: 0.12 }, { t0: 2.4, h: 4, s: 0.15 }], noise: 0.25, seed: 3 });
  const sample = trace({ sx: ax.sx, sy: off(30), tmin: 0, tmax: 16, peaks: [{ t0: 1.6, h: 6, s: 0.12 }, { t0: 8.2, h: 62, s: 0.2, tau: 0.05 }], noise: 0.25, seed: 5 });
  const stressed = trace({ sx: ax.sx, sy: off(60), tmin: 0, tmax: 16, peaks: [{ t0: 1.6, h: 6, s: 0.12 }, { t0: 5.9, h: 9, s: 0.16 }, { t0: 7.6, h: 7, s: 0.17 }, { t0: 8.2, h: 52, s: 0.2, tau: 0.05 }, { t0: 11.4, h: 5, s: 0.2 }], noise: 0.25, seed: 9 });
  let s = ax.frame + path(placebo, { stroke: C.muted, width: 1.3 }) + path(sample, { stroke: C.navy, width: 1.4 }) + path(stressed, { stroke: C.tealD, width: 1.4 });
  s += T(w - 20, ax.sy(4), "Placebo", { size: 9.5, anchor: "end", fill: C.muted, weight: 600 });
  s += T(w - 20, ax.sy(34), "Sample (unstressed)", { size: 9.5, anchor: "end", fill: C.navy, weight: 600 });
  s += T(w - 20, ax.sy(64), "Sample, 0.1 N HCl, 60 °C, 8 h", { size: 9.5, anchor: "end", fill: C.tealD, weight: 600 });
  s += T(ax.sx(8.2), ax.sy(116), "API", { size: 9.5, fill: C.navy, weight: 700 });
  s += T(ax.sx(5.9), ax.sy(73), "D1", { size: 9, fill: C.red, weight: 700 });
  s += T(ax.sx(7.6), ax.sy(71), "D2 (Rs 2.6)", { size: 9, fill: C.red, weight: 700 });
  s += T(ax.sx(11.4), ax.sy(69), "D3", { size: 9, fill: C.red, weight: 700 });
  return svg(w, h, s);
};

export default () => `
${chapter("فصل 3", "Specificity و Forced degradation", "Chapter 3 — Specificity, selectivity and stress testing")}
${p(
  "Specificity توانایی روش در اندازه‌گیری بی‌ابهام Analyte در حضور اجزایی است که انتظار می‌رود در نمونه باشند: مواد جانبی (Placebo)، ناخالصی‌های فرایند، محصولات تخریب و ماتریکس. Q2(R2) اصطلاح Selectivity را هم کنار آن به کار می‌برد، چون بسیاری از روش‌ها کاملاً اختصاصی نیستند و Selectivity کافی آن‌ها با ترکیبی از شواهد اثبات می‌شود. Specificity پایه همه ویژگی‌های دیگر است: اگر پیک ماده مؤثره با یک ناخالصی هم‌پوشانی داشته باشد، Accuracy و Precision عالی هم معنایی ندارد.",
)}
${h2("شواهد Specificity برای روش کروماتوگرافی")}
${table(
  ["آزمایش", "هدف", "معیار پذیرش رایج"],
  [
    ["Blank (Diluent)", "نبود پیک مزاحم در زمان بازداری Analyte و ناخالصی‌ها", "هیچ پیکی ≥ DL در زمان بازداری Analyteها"],
    ["Placebo", "نبود تداخل مواد جانبی", "پاسخ Placebo در زمان بازداری Analyte کمتر از 0.1 تا 0.2 درصد پاسخ 100% (Assay) یا کمتر از Reporting threshold (Impurities)"],
    ["محلول ناخالصی‌های شناخته‌شده (Spiked)", "تفکیک Analyte از ناخالصی‌ها", "Resolution بحرانی‌ترین جفت پیک معمولاً ≥ 1.5 (برای کمّی‌سازی دقیق‌تر ≥ 2.0)"],
    ["Forced degradation", "اثبات Stability-indicating بودن", "تفکیک محصولات تخریب از پیک اصلی، Peak purity مطلوب، Mass balance قابل قبول"],
    ["Peak purity (PDA یا MS)", "نبود ترکیب هم‌شوی (Co-eluting) زیر پیک اصلی", "Purity angle کمتر از Purity threshold یا شاخص معادل نرم‌افزار"],
  ],
  { cap: "<b>جدول 3-1.</b> آزمایش‌های Specificity برای روش HPLC." },
)}
${fig(overlay(), "3-1", "هم‌پوشانی کروماتوگرام Placebo، نمونه بدون تنش و نمونه تحت تنش اسیدی. محصولات تخریب D1 تا D3 از پیک اصلی تفکیک شده‌اند و Placebo در زمان بازداری API پیکی ندارد (داده نمایشی).")}
${h2("Forced degradation (Stress testing)")}
${p(
  "هدف Forced degradation تخریب کامل نمونه نیست؛ هدف تولید مقدار کافی از محصولات تخریب محتمل است تا نشان داده شود روش آن‌ها را از ماده مؤثره تفکیک می‌کند. تخریب بیش از حد، محصولات ثانویه‌ای می‌سازد که در شرایط واقعی نگهداری تشکیل نمی‌شوند و تفسیر را دشوار می‌کنند. هدف رایج، تخریب حدود 5 تا 20 درصد ماده مؤثره است.",
)}
${table(
  ["تنش", "شرایط نمونه (نقطه شروع رایج)", "ملاحظات"],
  [
    ["هیدرولیز اسیدی", "0.1 N HCl، دمای اتاق تا 60 °C، چند ساعت تا چند روز", "پیش از تزریق خنثی شود"],
    ["هیدرولیز بازی", "0.1 N NaOH، دمای اتاق تا 60 °C", "استرها و آمیدها حساس‌اند؛ اغلب سریع‌تر از اسید"],
    ["اکسیداسیون", "0.3 تا 3% H₂O₂، دمای اتاق، دور از نور", "واکنش ممکن است ادامه یابد؛ زمان تزریق را ثابت نگه دارید"],
    ["حرارت (جامد)", "دمای بالاتر از شرایط Accelerated، مثلاً 60 تا 80 °C", "برای جامد و فرآورده نهایی"],
    ["رطوبت", "مثلاً 40 °C / 75% RH یا بالاتر", "برای مواد رطوبت‌گیر و فرمولاسیون‌ها"],
    ["نور", "طبق ICH Q1B: دست‌کم 1.2 million lux·h نور مرئی و 200 W·h/m² UV", "نمونه کنترل پوشیده با فویل هم‌زمان قرار گیرد"],
  ],
  { cap: "<b>جدول 3-2.</b> شرایط متداول Forced degradation؛ شرایط برای هر ماده بر اساس پایداری آن تنظیم می‌شود (ICH Q1A(R2)، Q1B)." },
)}
${box(
  "ref",
  "ICH Q1A(R2) و Q1B",
  p("Stress testing ماده مؤثره به شناسایی محصولات تخریب محتمل، مسیرهای تخریب و پایداری ذاتی مولکول کمک می‌کند و برای اثبات Stability-indicating بودن روش‌ها به کار می‌رود. اثر دما، رطوبت، اکسیداسیون، نور و هیدرولیز در گستره وسیعی از pH بررسی می‌شود. Q1B حداقل مواجهه نوری را برای آزمون تأییدی تعیین می‌کند."),
  "ICH Q1A(R2) Stability Testing of New Drug Substances and Products; ICH Q1B Photostability Testing",
)}
${h3("Mass balance")}
${p(
  "Mass balance مقایسه مجموع Assay و ناخالصی‌ها در نمونه تحت تنش با مقدار اولیه است. Mass balance نزدیک 100 درصد (در عمل، اغلب 95 تا 105 درصد یا گستره‌ای که از پیش توجیه شده) نشان می‌دهد محصولات تخریب عمده دیده و اندازه‌گیری شده‌اند. Mass balance پایین ممکن است به معنای محصول تخریب بدون جذب UV، محصول فرار، ترکیب باقی‌مانده روی ستون یا تفاوت RRF ناخالصی‌ها باشد.",
)}
${box(
  "lab",
  "نکته کاربردی Peak purity",
  p("الگوریتم Peak purity در PDA تنها زمانی ناخالصی هم‌شو را تشخیص می‌دهد که طیف UV آن به اندازه کافی با ماده مؤثره متفاوت باشد و مقدار آن از حد حساسیت بالاتر باشد. «Pass» شدن Peak purity اثبات قطعی نیست؛ در موارد حساس، روش دوم با Selectivity متفاوت (ستون دیگر، pH دیگر) یا LC-MS شواهد قوی‌تری فراهم می‌کند."),
)}
${h2("Specificity برای روش‌های غیرکروماتوگرافی")}
${ul([
  "<b>Identification با IR:</b> مقایسه طیف نمونه با استاندارد مرجع؛ نشان دادن تفاوت با ترکیبات مشابه ساختاری در صورت وجود.",
  "<b>Titration:</b> Specificity ذاتی پایین؛ معمولاً با یک روش اختصاصی دیگر (مثلاً HPLC برای ناخالصی‌ها) تکمیل می‌شود (رویکرد ترکیبی).",
  "<b>UV در Dissolution:</b> اثبات نبود جذب Placebo و مواد جانبی در طول موج انتخابی؛ در صورت تداخل، استفاده از تصحیح پایه یا روش HPLC.",
  "<b>Karl Fischer:</b> بررسی تداخل اجزای نمونه با معرف (مثلاً آلدهیدها و کتون‌ها یا مواد اکسیدکننده و احیاکننده).",
])}
${box(
  "warn",
  "یافته رایج بازرسی",
  p("روش Assay بدون مطالعه Forced degradation برای نمونه‌های Stability استفاده شده است. هر روشی که برای آزمون Stability به کار می‌رود باید Stability-indicating بودن خود را نشان دهد؛ در غیر این صورت کاهش واقعی ماده مؤثره ممکن است زیر پیک یک محصول تخریب پنهان بماند."),
)}
`;
