import { C, chapter, h2, h3, p, ul, ol, box, table, fig, svg, T, axes, path, arrowDefs } from "../lib.mjs";

// Figure 3-1: geometric parameters of mechanical qualification.
function figMq() {
  const W = 580, H = 230;
  let g = arrowDefs("m1", C.goldD);
  const panel = (ox, title) => `<rect x="${ox}" y="6" width="180" height="218" rx="8" fill="#f8fafc" stroke="${C.line}"/>` + T(ox + 90, 24, title, { size: 9, weight: 700, fill: C.navy });
  // 1: centering
  g += panel(4, "Vessel centering");
  g += `<circle cx="94" cy="125" r="62" fill="${C.tealXL}" stroke="${C.navy}" stroke-width="1.5"/><circle cx="102" cy="125" r="5" fill="${C.red}"/><circle cx="94" cy="125" r="2.5" fill="${C.navy}"/>`;
  g += `<path d="M94 140H102" stroke="${C.goldD}" stroke-width="1.2" marker-start="url(#m1)" marker-end="url(#m1)"/>` + T(98, 158, "offset ≤ 1.0 mm", { size: 8, fill: C.goldD, weight: 700 }) + T(94, 210, "top view: shaft vs vessel axis", { size: 7.5, fill: C.muted });
  // 2: verticality
  g += panel(198, "Shaft / vessel verticality");
  g += `<line x1="288" y1="40" x2="288" y2="200" stroke="${C.line}" stroke-dasharray="4 3"/><line x1="288" y1="200" x2="300" y2="44" stroke="${C.navy}" stroke-width="4"/>`;
  g += `<path d="M288 90A50 50 0 0 1 292 90" fill="none" stroke="${C.goldD}"/>` + T(318, 84, "≤ 0.5° shaft", { size: 8, fill: C.goldD, weight: 700, anchor: "start" }) + T(318, 98, "≤ 1.0° vessel", { size: 8, fill: C.goldD, weight: 700, anchor: "start" }) + T(288, 216, "digital level on shaft and vessel wall", { size: 7.5, fill: C.muted });
  // 3: wobble and depth
  g += panel(392, "Wobble and depth");
  g += `<rect x="478" y="34" width="6" height="130" fill="#9aa9bb"/><path d="M456 164h50l-5 20h-40Z" fill="#9aa9bb"/><line x1="440" y1="208" x2="540" y2="208" stroke="${C.navy}" stroke-width="2"/>`;
  g += `<path d="M520 186V206" stroke="${C.goldD}" stroke-width="1.2" marker-start="url(#m1)" marker-end="url(#m1)"/>` + T(526, 200, "25 ± 2 mm", { size: 8, fill: C.goldD, anchor: "start", weight: 700 });
  g += `<rect x="488" y="70" width="34" height="14" rx="3" fill="${C.goldL}" stroke="${C.gold}"/>` + T(505, 80, "dial", { size: 7, fill: C.goldD }) + T(482, 104, "total runout", { size: 7.5, fill: C.muted, anchor: "end" }) + T(482, 116, "≤ 1.0 mm", { size: 8, fill: C.goldD, anchor: "end", weight: 700 });
  return svg(W, H, g);
}

// Figure 3-2: PVT control chart.
function figPvt() {
  const W = 540, H = 200;
  const a = axes({ w: W, h: H, x0: 52, xmin: 0.5, xmax: 10.5, ymin: 30, ymax: 70, xticks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], yticks: [30, 40, 50, 60, 70], xlabel: "PVT run (6-monthly)", ylabel: "% dissolved, 30 min" });
  const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], ys = [51, 49, 52, 50, 48, 51, 44, 41, 50, 51];
  let g = a.frame + `<rect x="${a.x0}" y="${a.sy(62)}" width="${a.x1 - a.x0}" height="${a.sy(38) - a.sy(62)}" fill="${C.teal}" fill-opacity=".08"/>`;
  g += `<line x1="${a.x0}" y1="${a.sy(62)}" x2="${a.x1}" y2="${a.sy(62)}" stroke="${C.tealD}" stroke-dasharray="4 3"/><line x1="${a.x0}" y1="${a.sy(38)}" x2="${a.x1}" y2="${a.sy(38)}" stroke="${C.tealD}" stroke-dasharray="4 3"/>`;
  g += T(a.x1 - 4, a.sy(62) - 4, "upper acceptance limit (lot certificate)", { size: 7.5, fill: C.tealD, anchor: "end" }) + T(a.x1 - 4, a.sy(38) + 11, "lower acceptance limit", { size: 7.5, fill: C.tealD, anchor: "end" });
  g += path(xs.map((x, i) => [a.sx(x), a.sy(ys[i])]), { stroke: C.navy, width: 1.8 }) + xs.map((x, i) => `<circle cx="${a.sx(x)}" cy="${a.sy(ys[i])}" r="3.4" fill="${i === 6 || i === 7 ? C.red : C.navy}"/>`).join("");
  g += T(a.sx(7.5), a.sy(35), "trend: worn basket clips", { size: 8, fill: C.red, weight: 700 });
  return svg(W, H, g);
}

export default () => `
${chapter("فصل 3", "Qualification، Calibration و نگهداری دستگاه", "Chapter 3 — Qualification, calibration and maintenance")}
${p(
  "تکرارپذیری آزمون انحلال بیش از هر آزمون دیگری به وضعیت مکانیکی دستگاه وابسته است. دو رویکرد مکمل برای اطمینان از عملکرد دستگاه وجود دارد: <b>Mechanical qualification (MQ)</b> که پارامترهای هندسی و فیزیکی را با ابزار اندازه‌گیری کالیبره کنترل می‌کند، و <b>Performance verification test (PVT)</b> که عملکرد کل سیستم را با یک قرص مرجع می‌سنجد. USP &lt;711&gt; هر دو را بخشی از Calibration دستگاه می‌داند؛ رهنمود FDA (2010) پذیرفته است که Mechanical calibration دقیق مطابق رویه‌ای مانند ASTM E2503 می‌تواند جایگزین آزمون با قرص Calibrator شود.",
)}
${h2("Mechanical qualification")}
${p("پارامترهای جدول 3-1 در هر Position اندازه‌گیری و ثبت می‌شوند. محدوده‌ها بر پایه رهنمود FDA و استاندارد ASTM E2503 است که از الزامات USP سخت‌گیرانه‌ترند.")}
${table(
  ["پارامتر", "معیار متداول (FDA / ASTM E2503)", "ابزار", "علت رایج انحراف"],
  [
    ["دمای Medium در Vessel", "37 ± 0.5 °C", "دماسنج کالیبره (دیجیتال)", "سطح آب ناکافی Water bath؛ Heater معیوب"],
    ["سرعت چرخش", "± 2 rpm از مقدار تنظیم", "Tachometer نوری یا تماسی", "فرسودگی موتور یا تسمه"],
    ["ارتفاع Paddle یا Basket", "25 ± 2 mm", "Depth gauge یا Ball gauge", "جابه‌جایی Collar؛ تعویض Paddle"],
    ["Shaft wobble", "≤ 1.0 mm Total runout", "Dial indicator", "خمیدگی محور؛ یاتاقان فرسوده"],
    ["Basket wobble", "≤ 1.0 mm Total runout", "Dial indicator", "Basket تغییر شکل‌یافته؛ Clip شل"],
    ["Shaft verticality", "≤ 0.5° از قائم", "Digital level", "نصب نادرست Head؛ سطح ناتراز میز"],
    ["Vessel verticality", "≤ 1.0° از قائم", "Digital level", "Vessel نامناسب؛ نگهدارنده آسیب‌دیده"],
    ["Vessel centering", "≤ 1.0 mm فاصله از محور", "Centering gauge", "جابه‌جایی Vessel پس از شستشو"],
  ],
  { cap: "<b>جدول 3-1.</b> پارامترهای Mechanical qualification برای Apparatus 1 و 2." },
)}
${fig(figMq(), "3-1", "پارامترهای هندسی MQ: هم‌محوری Shaft و Vessel، Verticality و Wobble، و فاصله 25 میلی‌متر از کف.")}
${h3("فواصل انجام")}
${ul([
  "<b>Full MQ:</b> حداقل هر 6 ماه، و همچنین پس از نصب، جابه‌جایی، تعمیر یا تعویض قطعات اصلی (Shaft، Paddle، Basket، Vessel).",
  "<b>کنترل پیش از هر آزمون:</b> دمای هر Vessel، ارتفاع Paddle یا Basket، سلامت Vesselها، سطح آب Water bath و تراز بودن دستگاه.",
  "<b>Vesselها:</b> هر Vessel شماره‌گذاری و جای ثابت آن در دستگاه ثبت شود تا Centering ثابت بماند؛ Vessel با خراش یا تغییر شکل از چرخه خارج شود.",
])}
${h2("Performance verification test (PVT)")}
${p(
  "PVT کل سیستم، شامل هیدرودینامیک، Degassing و مهارت آنالیست را می‌سنجد. در USP، PVT برای Apparatus 1 و 2 با <b>Prednisone Tablets RS</b> و بر اساس معیارهای مندرج در گواهی همان سری مرجع انجام می‌شود. نتایج هر Position باید در محدوده گواهی باشد؛ علاوه بر این، روند نتایج PVT در طول زمان ابزار ارزشمندی برای شناسایی فرسایش تدریجی دستگاه است.",
)}
${fig(figPvt(), "3-2", "نمودار روند نتایج PVT یک Position: افت تدریجی پیش از خروج از محدوده، هشدار زودهنگام فرسایش قطعات است (داده نمایشی).")}
${box(
  "ref",
  "رهنمود FDA درباره Mechanical calibration",
  p("FDA در رهنمود سال 2010 بیان می‌کند که Mechanical calibration دقیق و مستند Apparatus 1 و 2، با محدوده‌های سخت‌گیرانه‌تر از فارماکوپه و در چارچوب SOP مکتوب، می‌تواند جایگزین آزمون با قرص‌های Calibrator باشد و الزامات CGMP را برآورده کند."),
  "FDA Guidance for Industry. The Use of Mechanical Calibration of Dissolution Apparatus 1 and 2 — Current Good Manufacturing Practice (CGMP), 2010; ASTM E2503",
)}
${h2("سایر اجزای سیستم")}
${table(
  ["جزء", "کنترل لازم", "نکته"],
  [
    ["Autosampler و لوله‌ها", "حجم برداشت، Carryover، زمان نمونه‌برداری", "حجم Dead volume لوله‌ها را در محاسبه جایگزینی Medium لحاظ کنید."],
    ["Sampling probe و Cannula", "موقعیت در Sampling zone، عدم ایجاد اختلال هیدرودینامیک", "Probeهای ماندگار (Resident) ممکن است جریان را تغییر دهند؛ در Validation بررسی شود."],
    ["Filter درون‌خطی", "سازگاری، عدم جذب، Integrity", "فیلتر جدید برای هر نمونه یا طبق Validation."],
    ["Fiber-optic UV", "Baseline، خطی بودن، تداخل ذرات", "اثر Excipientهای نامحلول بر جذب نوری را بررسی کنید."],
    ["Degassing unit", "اثربخشی (اکسیژن محلول یا روش USP)", "Medium دوباره گازدار می‌شود؛ زمان بین Degassing و آزمون محدود باشد."],
    ["Water bath", "سطح آب، تمیزی، یکنواختی دما", "رشد جلبک و رسوب، انتقال حرارت و دید Vessel را مختل می‌کند."],
  ],
)}
${h2("نگهداری و تمیزکاری")}
${ol([
  "Vesselها پس از هر آزمون با آب و در صورت نیاز حلال یا دترجنت مناسب شسته و با آب Purified آبکشی شوند؛ از برس فلزی یا ساینده استفاده نشود.",
  "Basketها پس از هر استفاده بازرسی شوند؛ گرفتگی مش با Excipient یا ماتریکس پلیمری باعث کاهش جریان و افت انحلال می‌شود.",
  "Paddleهای پوشش‌دار از نظر کندگی پوشش بازرسی شوند؛ فلز در معرض Medium اسیدی می‌تواند خوردگی و تداخل آنالیتیکال ایجاد کند.",
  "آب Water bath به‌طور دوره‌ای تعویض و از مواد ضدجلبک سازگار استفاده شود.",
  "هر تعمیر، تعویض قطعه یا جابه‌جایی در Logbook دستگاه ثبت و پیش از استفاده مجدد، MQ مربوط تکرار شود.",
])}
${box(
  "lab",
  "",
  p("ارتعاش یکی از منابع پنهان تغییرپذیری است. دستگاه را روی میز محکم و تراز، دور از سانتریفیوژ، پمپ خلأ، شیکر و درِ پرتردد نصب کنید و در Qualification اولیه، ارتعاش را طبق مشخصات سازنده اندازه‌گیری و ثبت کنید."),
)}
`;
