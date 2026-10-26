import { C, chapter, h2, h3, p, ul, ol, box, table, fig, svg, T, axes, path, arrowDefs } from "../lib.mjs";

// Figure 8-1: decision tree for low dissolution results.
function figLow() {
  const W = 580, H = 350;
  let g = arrowDefs("l1", C.tealD);
  const bx = (x, y, w, h, t1, t2 = "", f = "#fff", s = C.navy) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${f}" stroke="${s}" stroke-width="1.3"/>` + T(x + w / 2, y + h / 2 - (t2 ? 3 : -3), t1, { size: 8.6, fill: C.navy, weight: 700 }) + (t2 ? T(x + w / 2, y + h / 2 + 11, t2, { size: 7.4, fill: C.muted }) : "");
  const dia = (cx, cy, t) => `<path d="M${cx} ${cy - 22}L${cx + 92} ${cy}L${cx} ${cy + 22}L${cx - 92} ${cy}Z" fill="${C.goldL}" stroke="${C.gold}" stroke-width="1.3"/>` + T(cx, cy + 3, t, { size: 8.1, fill: C.goldD, weight: 700 });
  const ar = (d, lab = "", lx = 0, ly = 0) => `<path d="${d}" fill="none" stroke="${C.tealD}" stroke-width="1.4" marker-end="url(#l1)"/>` + (lab ? T(lx, ly, lab, { size: 7.5, fill: C.tealD, weight: 700 }) : "");
  g += bx(190, 6, 200, 34, "Low or variable results", "check raw data, vessel by vessel", C.tealXL, C.tealD);
  g += ar("M290 40V56") + dia(290, 80, "Visible residue / mound?");
  g += ar("M382 80H430", "yes", 404, 74) + bx(430, 60, 144, 40, "Coning / hydrodynamics", "position, rpm, sinker");
  g += ar("M290 102V122", "no", 300, 116) + dia(290, 146, "Infinity point < 95 %?");
  g += ar("M382 146H430", "yes", 404, 140) + bx(430, 126, 144, 40, "Recovery problem", "filter, stability, standard");
  g += ar("M290 168V188", "no", 300, 182) + dia(290, 212, "Capsule pellicle?");
  g += ar("M198 212H150", "yes", 176, 206) + bx(6, 192, 144, 40, "Cross-linking", "two-tier test with enzyme");
  g += ar("M290 234V254", "no", 300, 248) + dia(290, 278, "Medium verified?");
  g += ar("M382 278H430", "no", 404, 272) + bx(430, 258, 144, 40, "pH, volume, degassing", "surfactant lot, temperature");
  g += ar("M290 300V326", "yes", 304, 316) + T(290, 344, "→ product cause: lubrication, hardness, PSD, ageing", { size: 8, fill: C.navy, weight: 700 });
  return svg(W, H, g);
}

// Figure 8-2: coning seen from the side.
function figCone() {
  const W = 560, H = 190;
  const vessel = (ox, title, cone) => {
    let s = `<path d="M${ox} 20V120a60 60 0 0 0 120 0V20" fill="none" stroke="${C.navy}" stroke-width="2"/><path d="M${ox + 2} 34V120a58 58 0 0 0 116 0V34Z" fill="${C.tealXL}"/><rect x="${ox + 57}" y="6" width="6" height="110" fill="#9aa9bb"/><path d="M${ox + 24} 116h72l-5 18H${ox + 29}Z" fill="#9aa9bb"/>`;
    if (cone) s += `<path d="M${ox + 40} 178Q${ox + 60} 150 ${ox + 80} 178Z" fill="#c9b27a"/>`;
    else s += Array.from({ length: 16 }, (_, i) => `<circle cx="${ox + 20 + ((i * 37) % 80)}" cy="${60 + ((i * 53) % 90)}" r="2.2" fill="#c9b27a"/>`).join("");
    s += T(ox + 60, 188, title, { size: 8.5, weight: 700, fill: cone ? C.red : C.tealD });
    return s;
  };
  return svg(W, H, vessel(60, "50 rpm: mound under paddle", true) + vessel(240, "75 rpm: particles dispersed", false) + `<rect x="410" y="40" width="140" height="110" rx="8" fill="${C.goldL}" stroke="${C.gold}"/>` + T(480, 64, "Signs of coning", { size: 9, weight: 700, fill: C.goldD }) + T(480, 84, "plateau below 100 %", { size: 8, fill: C.ink }) + T(480, 100, "jump at infinity point", { size: 8, fill: C.ink }) + T(480, 116, "high RSD, later points", { size: 8, fill: C.ink }) + T(480, 132, "visible heap at the bottom", { size: 8, fill: C.ink }));
}

// Figure 8-3: vessel-position effect.
function figVessel() {
  const W = 540, H = 190;
  const a = axes({ w: W, h: H, x0: 52, xmin: 0.4, xmax: 6.6, ymin: 70, ymax: 100, xticks: [1, 2, 3, 4, 5, 6], yticks: [70, 80, 90, 100], xlabel: "Vessel position", ylabel: "% dissolved, 30 min" });
  const v = [91, 92, 90, 78, 91, 92];
  let g = a.frame;
  v.forEach((y, i) => (g += `<rect x="${a.sx(i + 1) - 16}" y="${a.sy(y)}" width="32" height="${a.y1 - a.sy(y)}" fill="${i === 3 ? C.red : C.teal}" fill-opacity="${i === 3 ? 0.85 : 0.6}"/>`));
  g += `<line x1="${a.x0}" y1="${a.sy(85)}" x2="${a.x1}" y2="${a.sy(85)}" stroke="${C.gold}" stroke-dasharray="4 3"/>` + T(a.x1 - 4, a.sy(85) - 4, "Q + 5 % = 85 %", { size: 8, fill: C.goldD, anchor: "end" });
  g += T(a.sx(4), a.sy(78) - 6, "same position low in 3 runs", { size: 8, fill: C.red, weight: 700 });
  return svg(W, H, g);
}

export default () => `
${chapter("فصل 8", "Troubleshooting سیستماتیک", "Chapter 8 — Systematic troubleshooting")}
${p(
  "نتیجه غیرمنتظره در آزمون انحلال ممکن است از شش منبع ناشی شود: <b>دستگاه</b>، <b>Medium</b>، <b>نمونه‌برداری و فیلتراسیون</b>، <b>آنالیز نهایی</b>، <b>محاسبه</b> و در نهایت <b>خود فرآورده</b>. رویکرد سیستماتیک ایجاب می‌کند که پیش از نسبت دادن نتیجه به بچ، منابع آزمایشگاهی یک‌به‌یک و با شواهد کنار گذاشته شوند. نخستین گام، بررسی الگوی داده‌هاست:",
)}
${table(
  ["الگوی داده", "تفسیر محتمل", "نخستین بررسی"],
  [
    ["همه Vesselها پایین، با RSD کم", "خطای سیستماتیک: Medium، استاندارد، محاسبه یا تغییر واقعی فرآورده", "pH و حجم Medium، تهیه استاندارد، محاسبه، Infinity point"],
    ["یک Vessel یا Position همیشه متفاوت", "مشکل مکانیکی همان Position", "Centering، Wobble، ارتفاع، دمای همان Vessel، سلامت Vessel"],
    ["Vesselهای متفاوت در هر آزمون", "هیدرودینامیک ناپایدار: Coning، حباب، موقعیت قرص، Sinker", "مشاهده آزمون، Degassing، نحوه انداختن قرص"],
    ["نقاط اولیه پرنوسان، نقاط پایانی یکنواخت", "Lag time متغیر در Disintegration یا Wetting", "Disintegration، حباب روی قرص، زمان افتادن قرص"],
    ["Plateau کمتر از 100%", "عدم Sink، Coning، تخریب، جذب روی فیلتر یا Cross-linking", "Infinity point، Solubility، Filter adsorption، پایداری"],
    ["نتایج بیش از 100%", "عبور ذرات از فیلتر، تداخل Excipient، خطای استاندارد، تبخیر", "Filter efficiency، Placebo، Assay و Content uniformity بچ"],
  ],
  { cap: "<b>جدول 8-1.</b> تفسیر الگوی داده‌ها؛ نقطه شروع Troubleshooting." },
)}
${fig(figLow(), "8-1", "درخت تصمیم برای نتایج پایین یا پرنوسان؛ منابع آزمایشگاهی پیش از علل فرآورده‌ای بررسی می‌شوند.")}
${h2("هیدرودینامیک و Coning")}
${p(
  "در Apparatus 2 با سرعت 50 rpm، ذرات حاصل از Disintegration قرص‌هایی با Excipientهای سنگین و نامحلول (مانند Dicalcium phosphate یا MCC در مقادیر زیاد) ممکن است در ناحیه کم‌سرعت زیر Paddle جمع شوند و توده‌ای مخروطی تشکیل دهند. ماده مؤثره درون این توده با سرعت بسیار کمتری حل می‌شود و پروفایل در سطحی کمتر از 100 درصد Plateau می‌شود. نشانه مشخص Coning، جهش ناگهانی مقدار حل‌شده در Infinity point است.",
)}
${fig(figCone(), "8-2", "Coning در 50 rpm و پراکندگی ذرات در 75 rpm؛ نشانه‌های تشخیصی در کادر سمت راست.")}
${ul([
  "<b>راهکار رایج:</b> افزایش سرعت به 75 rpm با داده مقایسه‌ای و حفظ قدرت تمایز روش.",
  "<b>جایگزین:</b> Apparatus 1 با 100 rpm، یا در Development استفاده از Peak vessel با توجیه و تأیید نظارتی.",
  "<b>نکته:</b> افزایش سرعت نباید ابزاری برای پنهان کردن مشکل واقعی فرمولاسیون باشد؛ اگر بچ‌های مختلف Coning متفاوتی دارند، خود این تفاوت ممکن است بحرانی باشد.",
])}
${h2("موقعیت قرص، حباب و Sinker")}
${ul([
  "قرص باید در مرکز کف Vessel قرار گیرد؛ انداختن قرص در حالی که Paddle در حال چرخش است (طبق روش متداول) یا قبل از شروع چرخش باید در روش تعریف و ثابت باشد.",
  "چسبیدن قرص به دیواره یا زیر Paddle، و شناور شدن کپسول یا قرص با چگالی پایین، از منابع اصلی تغییرپذیری است. نوع و نحوه استفاده Sinker بخشی از روش است.",
  "حباب روی سطح قرص یا توری Basket نشانه Degassing ناکافی است و معمولاً با کاهش و نوسان انحلال همراه است.",
  "در کپسول‌ها، Sinker با حلقه‌های فشرده ممکن است باز شدن پوسته را محدود کند و ذرات را در خود نگه دارد.",
])}
${fig(figVessel(), "8-3", "نتیجه پایین تکرارشونده در یک Position مشخص در چند آزمون، نشانه مشکل مکانیکی (مثلاً Centering یا Wobble) در همان Position است (داده نمایشی).")}
${h2("Medium")}
${table(
  ["مشکل", "پیامد", "بررسی و اقدام"],
  [
    ["pH نادرست بافر", "تغییر Solubility داروهای یونیزه‌شونده؛ تفاوت چشمگیر نتایج", "اندازه‌گیری pH پیش و پس از آزمون؛ کالیبراسیون pH متر؛ کنترل وزن نمک‌ها"],
    ["حجم نادرست", "خطای تناسبی در درصد حل‌شده", "روش حجم‌سنجی یکسان؛ کنترل استوانه یا ترازو"],
    ["Degassing ناکافی", "حباب؛ نتایج پایین و پرنوسان", "پایش اکسیژن محلول؛ محدود کردن زمان بین Degassing و آزمون"],
    ["سری جدید Surfactant", "تغییر Solubility و میزان کف", "کنترل گرید و خلوص؛ مقایسه سری‌ها"],
    ["SLS در بافر Potassium", "کدورت و رسوب؛ کاهش اثر Surfactant", "استفاده از Sodium phosphate"],
    ["دمای خارج از محدوده", "تغییر سرعت انحلال", "اندازه‌گیری دما در هر Vessel پیش و پس از آزمون"],
  ],
)}
${h2("نمونه‌برداری، فیلتراسیون و آنالیز")}
${ul([
  "<b>جذب روی فیلتر:</b> نتایج پایین، به‌ویژه در غلظت‌های کم (نقاط اولیه و دوزهای پایین). Discard volume کافی و فیلتر صحه‌گذاری‌شده به کار ببرید.",
  "<b>عبور ذرات از فیلتر:</b> نتایج بالا و پرنوسان در آنالیز UV به دلیل پراکندگی نور یا ادامه انحلال در لوله نمونه.",
  "<b>تأخیر در فیلتراسیون:</b> ذرات حل‌نشده در سرنگ یا لوله به انحلال ادامه می‌دهند و نتیجه را افزایش می‌دهند.",
  "<b>محل نمونه‌برداری:</b> برداشت نمونه نزدیک قرص یا سطح Medium غلظت غیرنماینده می‌دهد.",
  "<b>تداخل Excipient در UV:</b> مقایسه با HPLC یا اسکن طیف Placebo.",
  "<b>ناپایداری محلول:</b> افت تدریجی پاسخ نمونه‌های منتظر آنالیز؛ نگهداری در شرایط صحه‌گذاری‌شده.",
])}
${h2("علل مرتبط با فرآورده")}
${table(
  ["علت", "نشانه", "بررسی"],
  [
    ["Over-lubrication", "افت انحلال پس از Scale-up یا تغییر زمان Blending", "زمان و تعداد دور Lubrication در Batch record"],
    ["افزایش Hardness در Stability", "کندشدن تدریجی انحلال در نمونه‌های Stability", "Hardness و Disintegration نمونه‌های Stability"],
    ["تغییر فرم جامد", "کاهش پیوسته انحلال؛ گاهی همراه با تغییر XRPD", "XRPD، DSC و مقایسه با نمونه اولیه"],
    ["Particle size ماده مؤثره", "تفاوت انحلال بین سری‌های ماده مؤثره", "PSD گواهی و اندازه‌گیری داخلی"],
    ["Cross-linking ژلاتین", "Pellicle قابل مشاهده؛ انحلال کند کپسول‌های مسن", "آزمون Two-tier؛ بررسی آلدئیدها و شرایط نگهداری"],
    ["روکش ناقص یا ترک‌خورده (DR)", "آزادسازی در Acid stage", "بازرسی چشمی؛ Weight gain؛ ضخامت روکش"],
  ],
)}
${h2("بررسی نتیجه OOS در آزمون انحلال")}
${ol([
  "بررسی فوری آزمایشگاهی (Phase I) پیش از هر تکرار: Raw data، کروماتوگرام‌ها یا طیف‌ها، محاسبات، استاندارد، Medium، دما و سرعت ثبت‌شده، مشاهدات آنالیست در حین آزمون.",
  "بررسی وضعیت دستگاه: آخرین MQ و PVT، Logbook، و Positionهای خاص.",
  "در صورت شناسایی علت آزمایشگاهی مستند، آزمون نامعتبر اعلام و طبق SOP تکرار می‌شود.",
  "اگر علت آزمایشگاهی یافت نشود، بررسی به فرایند تولید گسترش می‌یابد (Phase II) و نتیجه اولیه معتبر تلقی می‌شود.",
  "ادامه دادن به مراحل S2 و S3 بخشی از روش آزمون است، نه ابزار بررسی OOS؛ ولی نتیجه S1 نامنطبق که با S2 یا S3 منطبق می‌شود، در روند (Trend) پایش شود.",
])}
${box(
  "ref",
  "FDA Guidance, Investigating OOS Test Results",
  p("هر نتیجه خارج از مشخصات باید به‌طور کامل و مستند بررسی شود. تکرار آزمون فقط پس از شناسایی خطای آزمایشگاهی قابل انتساب یا طبق برنامه از پیش تعریف‌شده مجاز است و نتایج را نمی‌توان صرفاً با تکرار آزمون تا رسیدن به نتیجه منطبق، کنار گذاشت."),
  "FDA Guidance for Industry. Investigating Out-of-Specification (OOS) Test Results for Pharmaceutical Production, 2006 (rev. 2022)",
)}
`;
