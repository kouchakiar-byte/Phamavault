import { C, chapter, h2, h3, p, ul, box, eq, table, fig, m, svg, T, axes, path, trace, arrowDefs, peakAt } from "../lib.mjs";

// Figure 4-1: VWD (forward optics) and DAD (reverse optics).
function figOptics() {
  const W = 580, H = 250;
  let g = arrowDefs("d1", C.gold);
  const lamp = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="${C.goldL}" stroke="${C.goldD}" stroke-width="1.4"/><path d="M${x - 5} ${y}h10M${x} ${y - 5}v10" stroke="${C.goldD}" stroke-width="1.6"/>` + T(x, y + 26, "D<tspan font-size='6' dy='2'>2</tspan><tspan dy='-2'> lamp</tspan>", { size: 7.5, fill: C.goldD, weight: 700 });
  const grating = (x, y, rot = 0) => `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - 4}" y="${y - 16}" width="8" height="32" fill="${C.navy}"/>${[...Array(6)].map((_, i) => `<path d="M${x + 4} ${y - 14 + i * 5.5}l4 2" stroke="${C.navy}"/>`).join("")}</g>`;
  const cell = (x, y) => `<rect x="${x - 18}" y="${y - 9}" width="36" height="18" rx="3" fill="${C.tealXL}" stroke="${C.tealD}" stroke-width="1.4"/>` + T(x, y + 24, "flow cell", { size: 7.5, fill: C.tealD, weight: 700 });
  const ray = (pts, col = C.gold) => `<path d="M${pts.map((q) => q.join(" ")).join("L")}" fill="none" stroke="${col}" stroke-width="1.8" marker-end="url(#d1)"/>`;
  // VWD.
  g += `<rect x="6" y="6" width="282" height="236" rx="8" fill="#f8fafc" stroke="${C.line}"/>` + T(147, 24, "VWD — forward optics", { size: 9.5, weight: 700, fill: C.navy });
  g += lamp(36, 120) + ray([[50, 120], [104, 120]]) + grating(114, 120, -20) + T(114, 158, "grating", { size: 7.5, fill: C.navy });
  g += `<rect x="150" y="104" width="4" height="12" fill="${C.navy}"/><rect x="150" y="124" width="4" height="12" fill="${C.navy}"/>` + T(152, 96, "slit", { size: 7.5, fill: C.navy });
  g += ray([[122, 118], [176, 120]], C.teal) + T(158, 140, "single λ", { size: 7, fill: C.tealD });
  g += cell(196, 120) + ray([[214, 120], [244, 120]], C.teal) + `<rect x="246" y="108" width="16" height="24" rx="3" fill="${C.navy}"/>` + T(254, 150, "photodiode", { size: 7.5, fill: C.navy });
  g += T(147, 210, "wavelength selected before the sample", { size: 8, fill: C.muted }) + T(147, 224, "low light on sample · one or few wavelengths", { size: 8, fill: C.muted });
  // DAD.
  g += `<rect x="296" y="6" width="278" height="236" rx="8" fill="#f8fafc" stroke="${C.line}"/>` + T(435, 24, "DAD / PDA — reverse optics", { size: 9.5, weight: 700, fill: C.navy });
  g += lamp(324, 120) + ray([[338, 120], [376, 120]]) + cell(396, 120) + ray([[414, 120], [450, 120]]) + grating(460, 120, 20) + T(460, 158, "grating", { size: 7.5, fill: C.navy });
  const cols = ["#6a3fb5", "#2f62d0", C.teal, "#7cbf3a", C.gold, C.red];
  cols.forEach((c, i) => (g += `<path d="M466 ${116 + i}L540 ${62 + i * 14}" stroke="${c}" stroke-width="1.4"/>`));
  g += `<rect x="542" y="56" width="12" height="86" fill="${C.navy}"/>${[...Array(10)].map((_, i) => `<path d="M542 ${60 + i * 8.5}h12" stroke="#fff" stroke-width=".6"/>`).join("")}` + T(548, 160, "diode array", { size: 7.5, fill: C.navy });
  g += T(435, 210, "full spectrum after the sample", { size: 8, fill: C.muted }) + T(435, 224, "spectra for identity and peak purity", { size: 8, fill: C.muted });
  return svg(W, H, g);
}

// Figure 4-2: detector linearity and saturation.
function figLinear() {
  const W = 540, H = 230;
  const a = axes({ w: W, h: H, x0: 52, xmin: 0, xmax: 200, ymin: 0, ymax: 2.2, xticks: [0, 50, 100, 150, 200], yticks: [0, 0.5, 1, 1.5, 2], xlabel: "Concentration (% of nominal)", ylabel: "Absorbance (AU)" });
  const resp = (c) => { const ideal = c * 0.0085; return ideal / (1 + (ideal / 2.4) ** 2.5) ** 0.4; };
  const pts = [], ideal = [];
  for (let c = 0; c <= 200; c += 2) { pts.push([a.sx(c), a.sy(resp(c))]); ideal.push([a.sx(c), a.sy(Math.min(2.2, c * 0.0085))]); }
  let g = a.frame + `<rect x="${a.x0}" y="${a.sy(1.0)}" width="${a.x1 - a.x0}" height="${a.sy(0) - a.sy(1.0)}" fill="${C.tealXL}" opacity=".7"/>`;
  g += path(ideal, { stroke: C.muted, width: 1.1, dash: "4 3" }) + path(pts, { stroke: C.navy, width: 2 });
  g += T(a.sx(30), a.sy(0.9), "typical linear range", { size: 8.5, fill: C.tealD, weight: 700, anchor: "start" });
  g += T(a.sx(150), a.sy(2.1), "ideal (Beer–Lambert)", { size: 8.5, fill: C.muted }) + T(a.sx(178), a.sy(1.45), "stray light / saturation", { size: 8.5, fill: C.red, weight: 700 });
  return svg(W, H, g);
}

// Figure 4-3: peak purity — spectra across the peak.
function figPurity() {
  const W = 580, H = 210;
  const spec = (l, shift = 0, k = 1) => 0.9 * Math.exp(-(((l - 232 - shift) / 14) ** 2)) + 0.55 * k * Math.exp(-(((l - 276 - shift) / 18) ** 2));
  const panel = (ox, title, pure) => {
    const sx = (l) => ox + 30 + ((l - 200) / 150) * 230, sy = (v) => 170 - v * 130;
    let s = `<rect x="${ox}" y="6" width="282" height="198" rx="7" fill="#f8fafc" stroke="${C.line}"/>` + T(ox + 141, 22, title, { size: 9, weight: 700, fill: pure ? C.tealD : C.red });
    s += `<path d="M${ox + 30} 170H${ox + 262}M${ox + 30} 170V34" stroke="${C.navy}"/>` + T(ox + 146, 194, "Wavelength (nm)", { size: 8, fill: C.navy });
    [200, 250, 300, 350].forEach((l) => (s += T(sx(l), 182, l, { size: 7.5, fill: C.muted })));
    const sets = pure ? [[0, 1, C.navy], [0, 1, C.teal], [0, 1, C.gold]] : [[0, 1, C.navy], [3, 1.7, C.red], [0, 1, C.gold]];
    sets.forEach(([sh, k, col], i) => {
      const pts = [];
      for (let l = 200; l <= 350; l += 1.5) pts.push([sx(l), sy(spec(l, sh, k) * (i === 1 ? 1 : 0.97))]);
      s += path(pts, { stroke: col, width: i === 1 ? 2 : 1.4, dash: i === 1 ? "" : "4 3" });
    });
    s += `<rect x="${ox + 176}" y="38" width="12" height="3" fill="${C.navy}"/>` + T(ox + 192, 42, "upslope", { size: 7.5, anchor: "start" });
    s += `<rect x="${ox + 176}" y="52" width="12" height="3" fill="${pure ? C.teal : C.red}"/>` + T(ox + 192, 56, "apex", { size: 7.5, anchor: "start" });
    s += `<rect x="${ox + 176}" y="66" width="12" height="3" fill="${C.gold}"/>` + T(ox + 192, 70, "downslope", { size: 7.5, anchor: "start" });
    return s;
  };
  return svg(W, H, panel(4, "spectrally homogeneous peak", true) + panel(294, "co-eluting impurity at apex", false));
}

// Figure 4-4: data rate and time constant effects on a narrow peak.
function figRate() {
  const W = 560, H = 210;
  const a = axes({ w: W, h: H, x0: 44, xmin: 2.7, xmax: 3.6, ymin: -3, ymax: 105, xticks: [2.8, 3.0, 3.2, 3.4, 3.6], yticks: [0, 50, 100], xlabel: "Time (min)", ylabel: "Signal" });
  const pk = { t0: 3.05, h: 100, s: 0.018 };
  const truth = trace({ sx: a.sx, sy: a.sy, tmin: 2.7, tmax: 3.6, peaks: [pk], n: 600 });
  // Coarse sampling: 1 point every 0.03 min.
  const coarse = [];
  for (let t = 2.7; t <= 3.6; t += 0.03) coarse.push([a.sx(t), a.sy(peakAt(t, pk))]);
  // First-order filter with a long time constant.
  const filt = [];
  let y = 0;
  for (let i = 0; i <= 900; i++) { const t = 2.7 + i * 0.001; y += (peakAt(t, pk) - y) * (0.001 / 0.03); filt.push([a.sx(t), a.sy(y)]); }
  let g = a.frame + path(truth, { stroke: C.navy, width: 2 }) + path(coarse, { stroke: C.gold, width: 1.6 }) + coarse.map(([x, yy]) => `<circle cx="${x}" cy="${yy}" r="2" fill="${C.gold}"/>`).join("") + path(filt, { stroke: C.teal, width: 1.8, dash: "5 3" });
  const lg = [[C.navy, "true peak (≥ 20 points)"], [C.gold, "too few data points"], [C.teal, "time constant too long"]];
  lg.forEach(([c, l], i) => (g += `<rect x="${a.x1 - 160}" y="${a.y0 + 8 + i * 15}" width="14" height="3" fill="${c}"/>` + T(a.x1 - 140, a.y0 + 13 + i * 15, l, { size: 8.5, anchor: "start" })));
  return svg(W, H, g);
}

export default () => `
${chapter("فصل 4", "Detector‌ها", "Chapter 4 — Detectors")}
${p("Detector باید پاسخی پایدار، حساس، خطی و اختصاصی نسبت به آنالیت ایجاد کند و کمترین پهن‌شدگی را به پیک بیفزاید. انتخاب Detector به ساختار شیمیایی آنالیت (وجود کروموفور، فلوئوروفور یا گروه الکتروفعال)، سطح غلظت مورد نیاز، سازگاری با Gradient elution و الزامات روش بستگی دارد. در واحدهای کنترل کیفیت داروسازی، Detector‌های جذب فرابنفش–مرئی بیشترین سهم را دارند.")}
${h2("Detector‌های جذب فرابنفش–مرئی")}
${p(
  "اساس این Detector‌ها قانون Beer–Lambert است: جذب با غلظت آنالیت، طول مسیر نوری Flow cell و ضریب جذب مولی متناسب است. منبع تابش در ناحیه فرابنفش، لامپ دوتریم (گستره حدود 190 تا 400 نانومتر) و در ناحیه مرئی معمولاً لامپ تنگستن است. طول مسیر نوری Flow cell استاندارد حدود 10 میلی‌متر است؛ Flow cell‌های با مسیر بلندتر حساسیت را افزایش و Flow cell‌های با حجم کمتر پهن‌شدگی را کاهش می‌دهند."
)}
${eq("A = ε · b · c", "A: جذب (AU) — ε: ضریب جذب مولی (L·mol<sup>−1</sup>·cm<sup>−1</sup>) — b: طول مسیر نوری (cm) — c: غلظت (mol/L)")}
${fig(figOptics(), "4-1", "مقایسه آرایش نوری Detector طول‌موج متغیر (VWD) و Detector آرایه دیودی (DAD/PDA). در VWD نور پیش از نمونه تک‌فام می‌شود؛ در DAD نور سفید از Flow cell عبور می‌کند و پس از تفکیک توسط توری، طیف کامل همزمان ثبت می‌شود.")}
${table(
  ["تنظیم", "اثر", "توصیه کاربردی"],
  [
    ["طول موج آنالیز", "حساسیت و اختصاصی بودن", "در نزدیکی بیشینه جذب و در ناحیه‌ای با شیب طیفی کم، تا خطای کوچک طول موج اثر محدودی بر پاسخ داشته باشد"],
    ["پهنای باند (Bandwidth)", "پهنای باند بیشتر: نویز کمتر، اختصاصی بودن و خطی بودن کمتر", "مطابق روش؛ معمولاً 4 تا 8 نانومتر"],
    ["طول موج مرجع (DAD)", "جبران تغییرات شدت لامپ و ضریب شکست در Gradient", "در ناحیه‌ای که آنالیت جذب ندارد؛ در صورت جذب آنالیت در طول موج مرجع، پاسخ کاهش می‌یابد"],
    ["پهنای شکاف (Slit)", "شکاف باریک: تفکیک طیفی بهتر، نویز بیشتر", "برای خلوص پیک و طیف‌سنجی دقیق باریک‌تر"],
    ["سرعت داده و ثابت زمانی", "شکل و ارتفاع پیک", "حداقل حدود 20 نقطه در پهنای پیک؛ ثابت زمانی کمتر از حدود یک‌دهم پهنای پیک"],
  ],
  { cap: "<b>جدول 4-1.</b> تنظیمات کلیدی Detector‌های فرابنفش و اثر آن‌ها." }
)}
${h3("گستره خطی و اشباع")}
${p(
  "در جذب‌های بالا، نور سرگردان (Stray light) و پهنای باند محدود، رابطه خطی جذب و غلظت را مخدوش می‌کنند. گستره خطی بسیاری از Detector‌های جدید تا حدود 1 تا 2 واحد جذب است، اما مرز واقعی به دستگاه، طول موج و پهنای باند بستگی دارد. در آزمون‌های تعیین مقدار، جذب پیک اصلی در غلظت اسمی بهتر است در ناحیه میانی گستره خطی باشد تا استانداردهای بالای منحنی کالیبراسیون (مثلاً 120 یا 150 درصد) به ناحیه غیرخطی نرسند."
)}
${fig(figLinear(), "4-2", "انحراف پاسخ Detector از قانون Beer–Lambert در جذب‌های بالا (نمایشی). منحنی کالیبراسیونی که در غلظت‌های بالا خم می‌شود، معمولاً نشانه اشباع یا نور سرگردان است، نه رفتار نمونه.")}
${h3("خلوص طیفی پیک با DAD")}
${p(
  "Detector DAD در هر نقطه از پیک طیف کامل ثبت می‌کند. اگر پیک فقط از یک ترکیب تشکیل شده باشد، طیف‌های نرمال‌شده در لبه بالارونده، رأس و لبه پایین‌رونده یکسان‌اند؛ Co-elution یک ناخالصی با طیف متفاوت، این همانندی را برهم می‌زند. نرم‌افزارهای CDS این مقایسه را به‌صورت شاخص‌هایی مانند زاویه خلوص (Purity angle) در برابر آستانه خلوص (Purity threshold) یا ضریب تطابق طیفی گزارش می‌کنند."
)}
${fig(figPurity(), "4-3", "مفهوم ارزیابی خلوص پیک: طیف‌های نرمال‌شده در سه نقطه از پیک. سمت چپ: پیک همگن. سمت راست: تغییر شکل طیف در رأس به دلیل Co-elution ناخالصی با طیف متفاوت (نمایشی).")}
${box(
  "warn",
  "محدودیت‌های خلوص طیفی",
  p("نتیجه «پیک خالص» در DAD اثبات قطعی اختصاصی بودن نیست. ناخالصی با طیف بسیار مشابه (مانند ایزومرها و بسیاری از محصولات تخریب)، ناخالصی با غلظت بسیار کم نسبت به پیک اصلی، یا Co-elution کامل در رأس، ممکن است تشخیص داده نشود. همچنین جذب بیش از حد پیک اصلی، نویز طیفی و انتخاب نادرست طول موج مرجع می‌تواند نتیجه کاذب «ناخالص» ایجاد کند. در مطالعات تخریب اجباری، تکمیل ارزیابی با یک روش متعامد (ستون با Selectivity متفاوت یا طیف‌سنجی جرمی) توصیه می‌شود.")
)}
${h3("سرعت داده و ثابت زمانی")}
${fig(figRate(), "4-4", "اثر سرعت نمونه‌برداری داده و ثابت زمانی فیلتر بر یک پیک باریک (نمایشی). تعداد کم نقاط داده، رأس پیک را از دست می‌دهد و ثابت زمانی طولانی، پیک را کوتاه، پهن و جابه‌جا می‌کند؛ هر دو، ارتفاع، تعداد Plate و تفکیک را کاهش می‌دهند.")}
${h2("سایر Detector‌ها")}
${h3("Detector فلوئورسانس (FLD)")}
${p("برای ترکیبات فلوئورسان ذاتی یا مشتق‌شده، حساسیت آن ده تا هزار برابر Detector جذبی و Selectivity آن به دلیل انتخاب دو طول موج تحریک و نشر بسیار بالاست. خاموشی (Quenching) ناشی از اکسیژن محلول، حلال یا اجزای ماتریس، و اثر pH بر شدت نشر، از عوامل اصلی خطا هستند. پیک رامان آب، ابزار رایج برای ارزیابی حساسیت و عملکرد این Detector است.")}
${h3("Detector ضریب شکست (RID)")}
${p("تقریباً عمومی است و برای ترکیبات فاقد کروموفور مانند قندها، پلی‌ال‌ها و برخی مواد جانبی به کار می‌رود. به دما و ترکیب فاز متحرک بسیار حساس است، با Gradient elution سازگار نیست و حساسیت محدودی دارد. پایداری دمای Flow cell و ستون و تعادل‌یابی طولانی، پیش‌شرط Baseline پایدار است.")}
${h3("Detector‌های مبتنی بر افشانه: ELSD و CAD")}
${p("در این Detector‌ها، فاز متحرک افشانده و تبخیر می‌شود و ذرات آنالیت غیرفرار با پراکندگی نور (ELSD) یا با بار الکتریکی منتقل‌شده (CAD) اندازه‌گیری می‌شوند. با Gradient elution سازگارند و برای ترکیبات فاقد کروموفور مناسب‌اند، اما فاز متحرک باید کاملاً فرار باشد (بافرهای فسفاتی غیرمجازند) و پاسخ غیرخطی است؛ بنابراین کالیبراسیون معمولاً با مدل غیرخطی یا در گستره محدود انجام می‌شود.")}
${h3("Detector الکتروشیمیایی و طیف‌سنج جرمی")}
${p("Detector الکتروشیمیایی (ECD) برای ترکیبات اکسایش‌پذیر یا کاهش‌پذیر، مانند کاتکول‌آمین‌ها، حساسیت بسیار بالا دارد. طیف‌سنج جرمی (LC-MS) با یونش الکترواسپری (ESI) یا یونش شیمیایی در فشار جو (APCI)، بالاترین اختصاصی بودن را برای شناسایی ناخالصی‌ها و محصولات تخریب فراهم می‌کند و به فاز متحرک فرار (فرمیک اسید، استات یا فرمات آمونیوم) نیاز دارد. سرکوب یونی (Ion suppression) ناشی از اجزای ماتریس، مهم‌ترین منبع خطای کمّی در LC-MS است.")}
${table(
  ["Detector", "اختصاصی بودن", "حساسیت نسبی", "Gradient", "نیاز فاز متحرک", "کاربرد شاخص در QC"],
  [
    ["UV / VWD", "متوسط", "خوب", "سازگار", "شفاف در طول موج کاری", "تعیین مقدار، ناخالصی، انحلال"],
    ["DAD / PDA", "متوسط + طیف", "خوب", "سازگار", "شفاف در گستره طیفی", "توسعه روش، تخریب اجباری، خلوص پیک"],
    ["FLD", "بالا", "بسیار بالا", "سازگار", "بدون خاموش‌کننده", "آنالیت‌های فلوئورسان، مقادیر کم"],
    ["RID", "پایین (عمومی)", "پایین", "ناسازگار", "ترکیب و دمای ثابت", "قندها، پلی‌ال‌ها"],
    ["ELSD / CAD", "پایین (عمومی برای غیرفرارها)", "متوسط تا خوب", "سازگار", "کاملاً فرار", "مواد فاقد کروموفور، لیپیدها، مواد جانبی"],
    ["ECD", "بالا", "بسیار بالا", "محدود", "رسانا، خالص", "ترکیبات الکتروفعال"],
    ["MS", "بسیار بالا", "بسیار بالا", "سازگار", "فرار، بدون فسفات", "شناسایی ناخالصی، ناخالصی‌های جهش‌زا"],
  ],
  { cap: "<b>جدول 4-2.</b> مقایسه کیفی Detector‌های HPLC." }
)}
${h2("کنترل عملکرد Detector")}
${ul([
  "<b>انرژی و ساعت کارکرد لامپ:</b> کاهش انرژی لامپ دوتریم، به‌ویژه در طول موج‌های پایین (کمتر از حدود 230 نانومتر)، نویز را افزایش می‌دهد. روند انرژی لامپ را ثبت کنید و تعویض را بر اساس عملکرد و نه صرفاً ساعت کارکرد برنامه‌ریزی کنید.",
  "<b>صحت طول موج:</b> با فیلتر داخلی اکسید هولمیوم یا خطوط نشری لامپ دوتریم (مانند 486 و 656 نانومتر) و در صورت نیاز با محلول‌های مرجع (مثلاً بیشینه‌های جذب کافئین) ارزیابی می‌شود. خطای طول موج در Gradient‌های تند طیف، تغییر قابل‌توجهی در پاسخ ایجاد می‌کند.",
  "<b>نویز و Drift:</b> در آزمون Qualification عملیاتی (OQ) با شرایط استاندارد سازنده اندازه‌گیری و با مقادیر قبلی مقایسه می‌شود.",
  "<b>Flow cell:</b> آلودگی پنجره‌ها یا حباب، نویز و Drift ایجاد می‌کند. شستشو با آب، سپس ایزوپروپانول یا متانول، و در صورت نیاز با محلول‌های پاک‌کننده توصیه‌شده سازنده انجام شود. اعمال فشار برگشتی کم در خروجی Flow cell (مثلاً با لوله باریک) از تشکیل حباب جلوگیری می‌کند، به شرط اینکه از حد فشار مجاز Flow cell تجاوز نکند.",
])}
`;
