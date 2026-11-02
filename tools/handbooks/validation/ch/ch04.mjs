import { chapter, h2, h3, p, ul, box, table, fig, eq, svg, T, axes, path, C } from "../lib.mjs";
import { weighting } from "../figs.mjs";

// Five-level calibration (80–120 %), three replicates per level; response in arbitrary units.
const data = [
  [80, 1602], [80, 1611], [80, 1596],
  [90, 1800], [90, 1795], [90, 1809],
  [100, 2003], [100, 1996], [100, 2009],
  [110, 2198], [110, 2207], [110, 2201],
  [120, 2402], [120, 2391], [120, 2409],
];
const n = data.length;
const mx = data.reduce((a, [x]) => a + x, 0) / n;
const my = data.reduce((a, [, y]) => a + y, 0) / n;
const sxx = data.reduce((a, [x]) => a + (x - mx) ** 2, 0);
const sxy = data.reduce((a, [x, y]) => a + (x - mx) * (y - my), 0);
const b = sxy / sxx;
const a = my - b * mx;
const res = data.map(([x, y]) => [x, y - (a + b * x)]);

const calPlot = () => {
  const w = 310, h = 230;
  const ax = axes({ w, h, xmin: 70, xmax: 130, ymin: 1400, ymax: 2600, xticks: [70, 80, 90, 100, 110, 120, 130], yticks: [1400, 1800, 2200, 2600], xlabel: "Concentration (% of test conc.)", ylabel: "Peak area" });
  let s = ax.frame + path([[ax.sx(75), ax.sy(a + b * 75)], [ax.sx(125), ax.sy(a + b * 125)]], { stroke: C.teal, width: 1.8 });
  s += data.map(([x, y]) => `<circle cx="${ax.sx(x)}" cy="${ax.sy(y)}" r="3.2" fill="${C.navy}"/>`).join("");
  s += T(ax.x0 + 8, ax.y0 + 12, `y = ${a.toFixed(1)} + ${b.toFixed(2)}x`, { size: 9, anchor: "start", fill: C.tealD, weight: 600 });
  return svg(w, h, s);
};
const resPlot = () => {
  const w = 310, h = 230;
  const ax = axes({ w, h, xmin: 70, xmax: 130, ymin: -15, ymax: 15, xticks: [70, 80, 90, 100, 110, 120, 130], yticks: [-15, -10, -5, 0, 5, 10, 15], xlabel: "Concentration (% of test conc.)", ylabel: "Residual" });
  let s = ax.frame + path([[ax.sx(70), ax.sy(0)], [ax.sx(130), ax.sy(0)]], { stroke: C.gold, width: 1.2, dash: "5 4" });
  s += res.map(([x, r]) => `<circle cx="${ax.sx(x)}" cy="${ax.sy(r)}" r="3.2" fill="${C.tealD}"/>`).join("");
  return svg(w, h, s);
};

export default () => `
${chapter("فصل 4", "Range و Response (Linearity)", "Chapter 4 — Range and response")}
${p(
  "Range گستره‌ای است که در آن روش Accuracy، Precision و Response مناسب دارد. Q2(R2) دو مفهوم را از هم جدا می‌کند: <b>Reportable range</b>، گستره نتایجی که روش گزارش می‌کند (مثلاً 80 تا 120 درصد مقدار برچسب)، و <b>Working range</b>، گستره غلظت محلول‌هایی که واقعاً به دستگاه تزریق می‌شوند (پس از رقیق‌سازی). Response رابطه بین غلظت (یا مقدار) Analyte و پاسخ دستگاه است که می‌تواند خطی یا غیرخطی باشد.",
)}
${h2("گستره‌های رایج")}
${table(
  ["کاربرد", "حد پایین", "حد بالا"],
  [
    ["Assay ماده مؤثره یا فرآورده", "80% مقدار اعلام‌شده یا 80% حد پایین Specification", "120% مقدار اعلام‌شده یا 120% حد بالای Specification"],
    ["Content uniformity", "70% مقدار اعلام‌شده", "130% مقدار اعلام‌شده"],
    ["Dissolution (IR، Specification تک‌نقطه‌ای)", "Q − 45% برای کمترین Strength", "130% مقدار اعلام‌شده بیشترین Strength"],
    ["Impurities (کمّی)", "Reporting threshold (QL ≤ Reporting threshold)", "120% حد Specification"],
    ["Assay و Impurity با یک روش (100% Standard)", "Reporting threshold ناخالصی", "120% حد Specification مقدار ماده مؤثره"],
  ],
  { cap: "<b>جدول 4-1.</b> نمونه‌هایی از Reportable range بر پایه ICH Q2(R2). برای روش‌های خاص (مثلاً Dissolution فرآورده‌های MR) به متن گایدلاین مراجعه شود." },
)}
${h2("طراحی آزمایش Response")}
${ul([
  "حداقل 5 سطح غلظت در گستره، با فاصله تقریباً مساوی (برای مثال 80، 90، 100، 110 و 120 درصد).",
  "هر سطح از وزن‌کشی مستقل یا رقیق‌سازی سریال از Stock مستقل تهیه شود؛ دو تکرار تزریق یا تکرار آماده‌سازی برای ارزیابی بهتر توصیه می‌شود.",
  "برای Impurities، گستره از QL تا دست‌کم 120% Specification و ترجیحاً با استاندارد خود ناخالصی.",
  "اگر در فرمول محاسبه از Standard تک‌نقطه‌ای استفاده می‌شود، باید نشان داد عرض از مبدأ خط اثر معناداری بر نتیجه ندارد.",
])}
${fig(`<div class="grid2">${calPlot()}${resPlot()}</div>`, "4-1", "منحنی کالیبراسیون (راست) و نمودار Residual (چپ) برای 5 سطح در 3 تکرار. پراکندگی تصادفی Residualها حول صفر، شاهد خطی بودن است (داده نمایشی).")}
${h3("ارزیابی آماری")}
${eq("y = a + b·x ;  b = Σ(xᵢ − <span style='text-decoration:overline'>x</span>)(yᵢ − <span style='text-decoration:overline'>y</span>) / Σ(xᵢ − <span style='text-decoration:overline'>x</span>)² ;  a = <span style='text-decoration:overline'>y</span> − b·<span style='text-decoration:overline'>x</span>", "شیب و عرض از مبدأ با روش حداقل مربعات")}
${eq("r = Σ(xᵢ − <span style='text-decoration:overline'>x</span>)(yᵢ − <span style='text-decoration:overline'>y</span>) / √[Σ(xᵢ − <span style='text-decoration:overline'>x</span>)² · Σ(yᵢ − <span style='text-decoration:overline'>y</span>)²]", "ضریب همبستگی")}
${p(
  `برای داده‌های شکل 4-1: شیب ${b.toFixed(2)}، عرض از مبدأ ${a.toFixed(1)} و ضریب همبستگی بالاتر از 0.999 است. اما ضریب همبستگی بالا به‌تنهایی اثبات خطی بودن نیست؛ یک رابطه کمی منحنی هم می‌تواند r بالای 0.999 بدهد. به همین دلیل گزارش صحه‌گذاری باید این موارد را در کنار هم ارائه کند:`,
)}
${table(
  ["شاخص", "چه چیزی را نشان می‌دهد", "معیار رایج برای Assay"],
  [
    ["r یا R²", "میزان برازش کلی", "r ≥ 0.999 (R² ≥ 0.998)"],
    ["نمودار Residual", "الگوی سیستماتیک (انحنا، قیف شدن)", "پراکندگی تصادفی بدون روند"],
    ["عرض از مبدأ", "اریبی در غلظت‌های پایین", "معمولاً ≤ 2.0% پاسخ سطح 100%، یا فاصله اطمینان آن شامل صفر"],
    ["Response factor هر سطح (y/x)", "ثابت بودن حساسیت", "انحراف هر سطح از میانگین کمتر از حد تعیین‌شده، مثلاً ±2%"],
    ["Lack-of-fit test", "کفایت مدل خطی (با تکرار در هر سطح)", "عدم معناداری در سطح 5%"],
  ],
  { cap: "<b>جدول 4-2.</b> شاخص‌های ارزیابی Response؛ معیارها متداول‌اند و باید در پروتکل تعریف شوند." },
)}
${box(
  "key",
  "Heteroscedasticity و وزن‌دهی",
  p("در گستره‌های وسیع (مثلاً از QL ناخالصی تا 150 درصد)، واریانس پاسخ معمولاً با غلظت افزایش می‌یابد و نقاط بالا بر خط رگرسیون غلبه می‌کنند. نتیجه، خطای نسبی بزرگ در غلظت‌های پایین است. نمودار Residual قیفی‌شکل نشانه این وضعیت است و رگرسیون وزن‌دار (مثلاً با وزن 1/x یا 1/x²) یا تقسیم گستره به دو بخش راه‌حل است."),
)}
${fig(weighting(), "4-2", "Residualهای رگرسیون بدون وزن در گستره وسیع (راست) با افزایش غلظت باز می‌شوند (قیفی‌شکل)؛ Residual نسبی پس از وزن‌دهی 1/x² (چپ) پراکندگی یکنواخت دارد (داده نمایشی).")}
${h3("Response غیرخطی")}
${p(
  "برخی Detectorها ذاتاً پاسخ غیرخطی دارند (ELSD، CAD) و روش‌های بیولوژیک اغلب مدل چهارپارامتری (4PL) دارند. در این موارد Q2(R2) اجازه می‌دهد مدل مناسب (مثلاً درجه دوم یا لگاریتمی) انتخاب شود، به شرط آنکه مناسب بودن مدل در گستره با شواهد آماری و Accuracy کافی در سطوح مختلف اثبات شود.",
)}
`;
