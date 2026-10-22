import { C, chapter, h2, h3, p, ul, ol, box, eq, table, fig, m, svg, T, arrowDefs } from "../lib.mjs";

// Figure 3-1: column hardware cross-section.
function figHardware() {
  const W = 580, H = 170;
  let g = arrowDefs("c1", C.tealD);
  g += `<rect x="70" y="56" width="440" height="52" fill="#dfe6ee" stroke="${C.navy}" stroke-width="1.4"/>`; // tube
  g += `<rect x="78" y="62" width="424" height="40" fill="#fff"/>`;
  let dots = "";
  for (let i = 0; i < 420; i++) {
    const x = 82 + ((i * 37) % 416), y = 65 + ((i * 53) % 34);
    dots += `<circle cx="${x}" cy="${y}" r="2.1" fill="${C.teal}" fill-opacity=".55"/>`;
  }
  g += dots;
  g += `<rect x="78" y="62" width="6" height="40" fill="${C.gold}"/><rect x="496" y="62" width="6" height="40" fill="${C.gold}"/>`; // frits
  g += `<path d="M30 52h40v60H30z" fill="#c7d2de" stroke="${C.navy}"/><path d="M510 52h40v60h-40z" fill="#c7d2de" stroke="${C.navy}"/>`; // end fittings
  g += `<path d="M4 82H44" stroke="${C.tealD}" stroke-width="2" marker-end="url(#c1)"/><path d="M536 82H576" stroke="${C.tealD}" stroke-width="2" marker-end="url(#c1)"/>`;
  const lab = (x, y, x2, y2, t) => `<path d="M${x} ${y}L${x2} ${y2}" stroke="${C.muted}" stroke-width=".8"/>` + T(x2, y2 + (y2 < y ? -4 : 12), t, { size: 8, fill: C.navy, weight: 600 });
  g += lab(50, 52, 50, 24, "end fitting") + lab(81, 62, 120, 24, "inlet frit (0.5–2 µm)") + lab(300, 70, 300, 24, "packed bed of particles") + lab(499, 62, 470, 24, "outlet frit");
  g += lab(200, 108, 200, 140, "stainless-steel tube") + lab(420, 100, 420, 140, "flow direction arrow on label");
  return svg(W, H, g);
}

// Figure 3-2: particle morphologies.
function figParticles() {
  const W = 580, H = 190;
  const pores = (cx, cy, r0, r1, n, seed) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = ((i * 137.5 + seed) % 360) * (Math.PI / 180), rr = r0 + ((i * 7919) % 1000) / 1000 * (r1 - r0);
      s += `<circle cx="${cx + rr * Math.cos(a)}" cy="${cy + rr * Math.sin(a)}" r="${1.2 + (i % 3) * 0.5}" fill="#fff"/>`;
    }
    return s;
  };
  let g = "";
  // Fully porous.
  g += `<circle cx="80" cy="82" r="52" fill="${C.teal}" fill-opacity=".75" stroke="${C.tealD}" stroke-width="1.5"/>${pores(80, 82, 4, 49, 260, 3)}`;
  g += T(80, 156, "Fully porous (FPP)", { size: 9.5, weight: 700, fill: C.navy }) + T(80, 170, "1.7–10 µm", { size: 8, fill: C.muted });
  // Core-shell.
  g += `<circle cx="225" cy="82" r="52" fill="${C.teal}" fill-opacity=".75" stroke="${C.tealD}" stroke-width="1.5"/>${pores(225, 82, 36, 49, 160, 11)}<circle cx="225" cy="82" r="33" fill="${C.navy}"/>`;
  g += T(225, 156, "Superficially porous (SPP)", { size: 9.5, weight: 700, fill: C.navy }) + T(225, 170, "solid core + porous shell", { size: 8, fill: C.muted });
  // Non-porous.
  g += `<circle cx="370" cy="82" r="40" fill="${C.navy2}" stroke="${C.navy}" stroke-width="1.5"/>`;
  g += T(370, 156, "Non-porous", { size: 9.5, weight: 700, fill: C.navy }) + T(370, 170, "very low surface area", { size: 8, fill: C.muted });
  // Monolith.
  let mono = `<rect x="458" y="30" width="110" height="104" rx="8" fill="${C.tealXL}" stroke="${C.tealD}" stroke-width="1.5"/>`;
  for (let i = 0; i < 16; i++) {
    const x = 472 + (i % 4) * 26, y = 44 + Math.floor(i / 4) * 24;
    mono += `<path d="M${x} ${y}c8 -6 14 6 22 0" stroke="${C.teal}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${x + 10} ${y - 4}v14" stroke="${C.teal}" stroke-width="4" stroke-linecap="round"/>`;
  }
  g += mono + T(513, 156, "Monolith", { size: 9.5, weight: 700, fill: C.navy }) + T(513, 170, "continuous porous rod", { size: 8, fill: C.muted });
  return svg(W, H, g);
}

// Figure 3-3: bonded phase on the silica surface.
function figSurface() {
  const W = 580, H = 200;
  let g = `<rect x="20" y="150" width="540" height="34" fill="#e7ecf2" stroke="${C.navy}"/>` + T(290, 172, "silica support (SiO<tspan font-size='6' dy='2'>2</tspan><tspan dy='-2'>)</tspan>", { size: 9, fill: C.navy, weight: 700 });
  const chain = (x, n, col) => {
    let s = `<circle cx="${x}" cy="146" r="5" fill="${C.navy}"/>` + T(x, 149, "Si", { size: 5.5, fill: "#fff", weight: 700 });
    for (let i = 0; i < n; i++) s += `<path d="M${x + (i % 2 ? 5 : -5)} ${140 - i * 6.5}L${x + (i % 2 ? -5 : 5)} ${133.5 - i * 6.5}" stroke="${col}" stroke-width="2.2" stroke-linecap="round"/>`;
    return s;
  };
  const xs = [50, 82, 126, 170, 214, 290, 334, 378, 450, 494, 530];
  xs.forEach((x, i) => {
    if (i === 3 || i === 8) g += `<path d="M${x} 150v-12" stroke="${C.red}" stroke-width="2"/>` + T(x, 132, "Si–OH", { size: 7.5, fill: C.red, weight: 700 });
    else if (i === 5) g += `<circle cx="${x}" cy="146" r="5" fill="${C.gold}"/><path d="M${x - 7} 136h14M${x} 129v14" stroke="${C.goldD}" stroke-width="2"/>` + T(x, 122, "end-cap", { size: 7.5, fill: C.goldD, weight: 700 });
    else g += chain(x, i === 1 || i === 9 ? 10 : 17, C.teal);
  });
  g += T(108, 22, "C18 (octadecyl) chains", { size: 8.5, fill: C.tealD, weight: 700 });
  g += T(395, 22, "residual silanols interact with basic analytes", { size: 8.5, fill: C.red, weight: 700 });
  return svg(W, H, g);
}

// Figure 3-4: common bonded-phase ligands.
function figLigands() {
  const W = 580, H = 150;
  const cell = (i, title, body) => {
    const x = 6 + i * 96;
    return `<rect x="${x}" y="6" width="90" height="136" rx="7" fill="#f7f9fc" stroke="${C.line}"/>${body(x + 45)}` + T(x + 45, 132, title, { size: 8.5, weight: 700, fill: C.navy });
  };
  const anchor = (cx) => `<path d="M${cx - 28} 112h56" stroke="${C.navy}" stroke-width="2"/><path d="M${cx} 112v-8" stroke="${C.navy}" stroke-width="1.6"/>`;
  const zig = (cx, n, y0 = 104) => {
    let s = "";
    for (let i = 0; i < n; i++) s += `<path d="M${cx + (i % 2 ? 5 : -5)} ${y0 - i * 7}L${cx + (i % 2 ? -5 : 5)} ${y0 - (i + 1) * 7}" stroke="${C.teal}" stroke-width="2" stroke-linecap="round"/>`;
    return s;
  };
  const ring = (cx, cy, label = "", col = C.teal) => {
    let pts = [];
    for (let k = 0; k < 6; k++) pts.push([cx + 13 * Math.cos((Math.PI / 3) * k + Math.PI / 6), cy + 13 * Math.sin((Math.PI / 3) * k + Math.PI / 6)]);
    return `<path d="M${pts.map((q) => q.join(" ")).join("L")}Z" fill="none" stroke="${col}" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="6" fill="none" stroke="${col}" stroke-width="1.2"/>${label}`;
  };
  let g = "";
  g += cell(0, "C18 (L1)", (cx) => anchor(cx) + zig(cx, 12, 104));
  g += cell(1, "C8 (L7)", (cx) => anchor(cx) + zig(cx, 7, 104));
  g += cell(2, "Phenyl (L11)", (cx) => anchor(cx) + zig(cx, 3, 104) + ring(cx, 70));
  g += cell(3, "PFP (L43)", (cx) => anchor(cx) + zig(cx, 3, 104) + ring(cx, 70, "", C.gold) + [0, 1, 2, 3, 4].map((k) => { const a = (Math.PI / 3) * (k + 2) + Math.PI / 6; return T(cx + 22 * Math.cos(a), 70 + 22 * Math.sin(a) + 3, "F", { size: 7.5, fill: C.goldD, weight: 700 }); }).join(""));
  g += cell(4, "Cyano (L10)", (cx) => anchor(cx) + zig(cx, 3, 104) + `<path d="M${cx} 83v-14M${cx - 3} 69v-12M${cx + 3} 69v-12" stroke="${C.tealD}" stroke-width="1.6"/>` + T(cx, 50, "N", { size: 9, fill: C.navy, weight: 700 }));
  g += cell(5, "Polar-embedded", (cx) => anchor(cx) + zig(cx, 3, 104) + `<rect x="${cx - 12}" y="${70}" width="24" height="12" rx="3" fill="${C.goldL}" stroke="${C.gold}"/>` + T(cx, 79, "amide", { size: 6.5, fill: C.goldD, weight: 700 }) + zig(cx, 8, 68));
  return svg(W, H, g);
}

export default () => `
${chapter("فصل 3", "ستون‌ها: شیمی، ساختار و نگهداری", "Chapter 3 — Columns: chemistry, morphology and care")}
${p("ستون محل وقوع جداسازی و حساس‌ترین جزء مصرفی سیستم است. بخش بزرگی از مشکلات تکرارپذیری، Tailing و از دست رفتن تفکیک، به انتخاب نادرست، تفاوت سری ساخت (Batch-to-batch variability) یا نگهداری نامناسب ستون مربوط است.")}
${h2("ساختار فیزیکی ستون")}
${fig(figHardware(), "3-1", "اجزای یک ستون تحلیلی: لوله فولادی، فریت‌های ورودی و خروجی که ذرات را در جای خود نگه می‌دارند، بستر پرشده و اتصالات انتهایی. جهت جریان روی برچسب ستون مشخص است.")}
${table(
  ["قطر داخلی (mm)", "Flow rate رایج (mL/min)", "حجم مرده تقریبی ستون 150 mm (mL)", "کاربرد"],
  [
    ["4.6", "1.0 تا 2.0", "حدود 1.6", "HPLC متداول؛ اکثر روش‌های فارماکوپه‌ای"],
    ["3.0", "0.4 تا 0.9", "حدود 0.7", "کاهش مصرف حلال؛ سازگار با HPLC و UHPLC"],
    ["2.1", "0.2 تا 0.5", "حدود 0.33", "UHPLC و LC-MS؛ حساس به حجم خارج از ستون"],
  ],
  { cap: "<b>جدول 3-1.</b> ابعاد رایج ستون‌های تحلیلی. حجم مرده با رابطه تقریبی V<sub>M</sub> ≈ 0.5 · L · d<sub>c</sub><sup>2</sup> (L و d<sub>c</sub> بر حسب سانتی‌متر، V<sub>M</sub> بر حسب میلی‌لیتر) برآورد شده است؛ سرعت‌ها برای ذرات 3 تا 5 میکرومتر است." }
)}
${h2("بستر سیلیکا و ذرات")}
${p(
  "اکثر ستون‌های فاز معکوس بر پایه ذرات سیلیکا ساخته می‌شوند. <b>سیلیکای نوع B</b> (با خلوص بالا و فلزات بسیار کم) نسبت به سیلیکای قدیمی نوع A، فعالیت سیلانولی کمتر و Tailing بسیار کمتری برای ترکیبات بازی ایجاد می‌کند. <b>ذرات هیبریدی</b> (سیلیکای حاوی پل‌های آلی مانند اتیلن) پایداری بیشتری در pH بالا دارند و <b>ذرات پلیمری</b> در تمام گستره pH پایدارند اما کارایی کمتری دارند."
)}
${fig(figParticles(), "3-2", "ریخت‌شناسی ذرات فاز ساکن. ذرات با پوسته متخلخل (مثلاً 2.7 میکرومتر با هسته جامد حدود 1.7 میکرومتر) به دلیل مسیر نفوذ کوتاه‌تر، کارایی بالا را با فشار کمتر از ذرات کاملاً متخلخل کوچک‌تر از 2 میکرومتر فراهم می‌کنند.")}
${ul([
  "<b>اندازه منافذ:</b> برای مولکول‌های کوچک (وزن مولکولی کمتر از حدود 2000 دالتون) منافذ حدود 80 تا 120 آنگستروم و برای پپتیدها و پروتئین‌ها منافذ حدود 300 آنگستروم مناسب است تا مولکول به سطح داخلی دسترسی داشته باشد.",
  "<b>سطح ویژه و درصد کربن:</b> سطح ویژه بیشتر و بارگذاری کربن بالاتر معمولاً Retention بیشتری ایجاد می‌کند، اما این اعداد به‌تنهایی معیار هم‌ارزی دو ستون نیستند.",
  "<b>محدوده pH و دما:</b> سیلیکای پیوندی متداول معمولاً در محدوده pH حدود 2 تا 8 پایدار است. در pH پایین‌تر، پیوند سیلوکسان فاز پیوندی هیدرولیز می‌شود و در pH بالاتر بستر سیلیکا حل می‌شود؛ هر دو حالت با افزایش دما تشدید می‌شوند. محدوده‌های مجاز هر ستون را از گواهی سازنده بخوانید.",
])}
${h2("شیمی فاز ساکن")}
${fig(figSurface(), "3-3", "طرح‌واره سطح سیلیکا پس از پیوند با زنجیره‌های C18. گروه‌های سیلانول باقی‌مانده (قرمز) منشأ برهم‌کنش‌های ثانویه با بازهای پروتونه‌اند و End-capping با گروه‌های تری‌متیل‌سیلیل کوچک (طلایی) بخشی از آن‌ها را می‌پوشاند.")}
${fig(figLigands(), "3-4", "لیگاندهای متداول فازهای پیوندی و کد USP مربوط. هر شیمی، علاوه بر آب‌گریزی، سازوکارهای Selectivity متفاوتی (برهم‌کنش π–π، دوقطبی، پیوند هیدروژنی) ایجاد می‌کند.")}
${table(
  ["فاز", "سازوکارهای غالب", "موارد استفاده مناسب", "ملاحظات"],
  [
    ["C18", "آب‌گریزی", "انتخاب نخست برای اکثر داروهای مولکول کوچک", "تنوع بسیار زیاد میان برندها با برچسب یکسان L1"],
    ["C8 / C4", "آب‌گریزی کمتر", "ترکیبات بسیار آب‌گریز، کاهش زمان آنالیز؛ C4 برای پروتئین‌ها", "Retention کمتر ترکیبات قطبی"],
    ["فنیل / فنیل‌هگزیل", "آب‌گریزی + π–π", "ترکیبات آروماتیک، ایزومرهای موقعیتی", "اثر π–π با متانول آشکارتر از استونیتریل است"],
    ["PFP (پنتافلوئوروفنیل)", "π–π، دوقطبی، پیوند هیدروژنی، تبادل یونی ضعیف", "ترکیبات هالوژنه، ایزومرها، بازهای قطبی", "Selectivity بسیار متفاوت از C18؛ گزینه جایگزین در توسعه روش"],
    ["CN (سیانو)", "دوقطبی، آب‌گریزی کم", "قابل استفاده در RP و NP", "پایداری کمتر؛ تعادل‌یابی کندتر"],
    ["قطبی‌نهفته (Polar-embedded)", "آب‌گریزی + پیوند هیدروژنی", "بازها با تقارن بهتر، فاز متحرک با درصد آب بالا", "Elution order ممکن است با C18 متفاوت باشد"],
    ["C18 سازگار با آب (AQ)", "آب‌گریزی", "ترکیبات قطبی با فاز متحرک تا 100 درصد آبی", "مقاوم در برابر Dewetting"],
    ["HILIC (سیلیکا، آمید، زویتریونی)", "تقسیم در لایه آبی، الکترواستاتیک", "ترکیبات بسیار قطبی", "تعادل‌یابی طولانی؛ حساس به ترکیب Diluent"],
  ],
  { cap: "<b>جدول 3-2.</b> شیمی‌های متداول فاز ساکن و کاربرد آن‌ها." }
)}
${h3("طبقه‌بندی USP و هم‌ارزی ستون‌ها")}
${p("در USP، ستون‌ها با کد L طبقه‌بندی می‌شوند. این کدها فقط نوع کلی فاز را مشخص می‌کنند؛ دو ستون با یک کد ممکن است Selectivity کاملاً متفاوتی داشته باشند.")}
${table(
  ["کد USP", "توصیف خلاصه فاز ساکن", "کد USP", "توصیف خلاصه فاز ساکن"],
  [
    ["L1", "اکتادسیل‌سیلان (C18) پیوندی روی سیلیکا یا ذرات سرامیکی", "L10", "گروه‌های نیتریل (CN) پیوندی روی سیلیکا"],
    ["L3", "سیلیکای متخلخل", "L11", "گروه‌های فنیل پیوندی روی سیلیکا"],
    ["L7", "اکتیل‌سیلان (C8) پیوندی روی سیلیکا", "L14", "سیلیکا با پوشش تبادل آنیونی قوی (آمونیوم Quaternary)"],
    ["L8", "آمینوپروپیل‌سیلان (NH<sub>2</sub>) پیوندی روی سیلیکا", "L17", "رزین تبادل کاتیونی قوی استایرن–دی‌وینیل‌بنزن در فرم هیدروژن"],
    ["L9", "سیلیکا با پوشش تبادل کاتیونی قوی", "L43", "پنتافلوئوروفنیل (PFP) پیوندی روی سیلیکا"],
  ],
  { cap: "<b>جدول 3-3.</b> نمونه‌ای از کدهای پرکاربرد USP. فهرست کامل و تعاریف رسمی در بخش Reagents, Chromatographic Columns فارماکوپه آمده است." }
)}
${box(
  "ref",
  "مدل تفریق آب‌گریزی",
  p("برای مقایسه عینی ستون‌های فاز معکوس، مدل تفریق آب‌گریزی (Hydrophobic subtraction model) Selectivity هر ستون را با پنج پارامتر توصیف می‌کند: آب‌گریزی (H)، ممانعت فضایی (S*)، اسیدیته پیوند هیدروژنی (A)، بازیته پیوند هیدروژنی (B) و برهم‌کنش تبادل کاتیونی (C). پایگاه‌های داده مبتنی بر این مدل، از جمله پایگاه USP، برای یافتن ستون جایگزین با Selectivity مشابه، ابزار کارآمدی هستند؛ با این حال هم‌ارزی نهایی تنها با آزمون System Suitability اثبات می‌شود."),
  "Based on: Snyder L.R., Dolan J.W., Carr P.W. J. Chromatogr. A 1060 (2004) 77–116; USP column equivalency resources"
)}
${h2("Dewetting در فاز متحرک آبی")}
${p(
  "در ستون‌های C18 متداول با فاز متحرک حاوی کمتر از حدود 5 درصد حلال آلی، به‌ویژه پس از توقف جریان و کاهش فشار، آب ممکن است از منافذ آب‌گریز خارج شود (Dewetting). نتیجه، کاهش ناگهانی و شدید Retention است که اغلب به اشتباه «فروپاشی فاز» (Phase collapse) نامیده می‌شود. شستشوی ستون با درصد بالای حلال آلی و سپس تعادل مجدد، معمولاً Retention را بازمی‌گرداند. برای روش‌های با فاز متحرک تقریباً کاملاً آبی، ستون‌های سازگار با آب (AQ یا قطبی‌نهفته) انتخاب شوند."
)}
${h2("Guard column و In-line filter")}
${p(
  "Guard column کارتریج کوتاهی از همان فاز ساکن است که پیش از ستون اصلی قرار می‌گیرد و ذرات و ترکیبات با جذب برگشت‌ناپذیر از ماتریس نمونه را به دام می‌اندازد. In-line filter (معمولاً 0.5 میکرومتر) میان Autosampler و ستون، از گرفتگی فریت ورودی ستون اصلی جلوگیری می‌کند. استفاده از Guard column در روش‌های فارماکوپه‌ای باید با شیمی یکسان باشد و اثر آن بر System Suitability در صحه‌گذاری یا تأیید روش ارزیابی شود."
)}
${h2("نگهداری، شستشو و ذخیره ستون")}
${ol([
  "<b>پیش از استفاده:</b> گواهی آزمون (Certificate of analysis) و دفترچه سازنده را مطالعه و شماره سریال ستون را در دفتر ستون (Column logbook) ثبت کنید. ستون‌ها را برای روش‌های حساس، به‌ویژه روش‌های حاوی جفت‌یون، به‌طور اختصاصی تعیین کنید.",
  "<b>حذف بافر:</b> هرگز ستون را مستقیماً از بافر به حلال آلی خالص منتقل نکنید؛ خطر رسوب نمک در منافذ و فریت وجود دارد. ابتدا با حداقل حدود 10 تا 20 حجم ستون از مخلوط آب و حلال آلی بدون نمک با همان درصد آلی (یا حدود 5 تا 10 درصد آلی) شستشو دهید.",
  "<b>ذخیره کوتاه‌مدت و بلندمدت:</b> ستون‌های فاز معکوس را در حلال آلی با غلظت بالا (معمولاً استونیتریل یا متانول بیش از حدود 50 درصد، طبق توصیه سازنده) ذخیره و دو سر آن را با درپوش ببندید.",
  "<b>بازیابی (Regeneration):</b> در صورت افزایش فشار یا افت کارایی، Sequence شستشو با حلال‌هایی با قدرت فزاینده (آب، متانول، استونیتریل، ایزوپروپانول) و بازگشت با همان ترتیب، با Flow rate کاهش‌یافته اجرا شود. شستشوی معکوس (Back-flush) تنها در صورت مجاز بودن در دستورالعمل سازنده و بدون اتصال به Detector انجام شود.",
  "<b>پایش روند:</b> فشار، تعداد Plate، Tailing factor و تعداد تزریق هر ستون را ثبت و روندیابی کنید. افت تدریجی پارامترهای System Suitability پیش از رسیدن به حد پذیرش، زمان مناسب برای تعویض برنامه‌ریزی‌شده ستون را مشخص می‌کند.",
])}
${box(
  "lab",
  "",
  p("ستون جدید همیشه با ستون در حال استفاده یکسان رفتار نمی‌کند. برای روش‌های دارای جفت بحرانی با حاشیه تفکیک کم، پیش از به‌کارگیری ستون از سری ساخت جدید، تزریق محلول System Suitability و مقایسه با کروماتوگرام مرجع را به‌عنوان یک گام کنترلی در SOP پیش‌بینی کنید. نگهداری یک ستون پشتیبان از سری ساخت متفاوت، ریسک توقف آزمون‌ها را کاهش می‌دهد.")
)}
`;
