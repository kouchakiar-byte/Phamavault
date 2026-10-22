import { C, chapter, h2, h3, p, ul, box, eq, table, fig, m, svg, T, axes, path, arrowDefs } from "../lib.mjs";

const block = (x, y, w, h, title, sub, { fill = "#fff", stroke = C.navy, tc = C.navy } = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>` +
  T(x + w / 2, y + h / 2 - (sub ? 3 : -4), title, { size: 10, fill: tc, weight: 700 }) +
  (sub ? T(x + w / 2, y + h / 2 + 12, sub, { size: 7.5, fill: C.muted }) : "");

// Figure 2-1: system block diagram.
function figBlock() {
  const W = 580, H = 250;
  let g = arrowDefs("b1", C.tealD);
  // Reservoirs.
  ["A", "B", "C", "D"].forEach((l, i) => {
    const x = 18 + i * 34;
    g += `<path d="M${x} 24h24v40a4 4 0 0 1-4 4h-16a4 4 0 0 1-4-4z" fill="${i < 2 ? C.tealXL : "#f4f6f9"}" stroke="${C.navy}" stroke-width="1.2"/><rect x="${x + 2}" y="${40}" width="20" height="26" fill="${C.teal}" opacity="${0.25 + i * 0.1}"/>` + T(x + 12, 18, l, { size: 9, weight: 700 });
    g += `<path d="M${x + 12} 68V92" stroke="${C.navy}" stroke-width="1"/>`;
  });
  g += T(170, 60, "solvent reservoirs", { size: 7.5, fill: C.muted, anchor: "start" });
  g += block(18, 116, 132, 40, "Degasser", "vacuum, in-line");
  g += block(18, 180, 132, 50, "Pump", "dual piston · mixing", { fill: C.tealXL, stroke: C.tealD, tc: C.tealD });
  g += block(186, 180, 110, 50, "Autosampler", "6-port valve · loop");
  g += `<rect x="326" y="168" width="124" height="74" rx="10" fill="${C.goldL}" stroke="${C.gold}" stroke-width="1.2" stroke-dasharray="4 3"/>` + T(388, 236, "column oven", { size: 7.5, fill: C.goldD });
  g += `<rect x="338" y="192" width="100" height="22" rx="5" fill="${C.navy}"/><rect x="332" y="189" width="10" height="28" rx="2" fill="${C.gold}"/><rect x="434" y="189" width="10" height="28" rx="2" fill="${C.gold}"/>` + T(388, 207, "Column", { size: 9, fill: "#fff", weight: 700 });
  g += block(468, 180, 96, 50, "Detector", "UV / DAD / FLD", { fill: C.tealXL, stroke: C.tealD, tc: C.tealD });
  g += block(468, 96, 96, 46, "CDS", "data system");
  g += `<path d="M84 92V114" stroke="${C.navy}" stroke-width="1.2" marker-end="url(#b1)"/><path d="M84 156V178" stroke="${C.navy}" stroke-width="1.2" marker-end="url(#b1)"/>`;
  g += `<path d="M150 205H184" stroke="${C.tealD}" stroke-width="2" marker-end="url(#b1)"/><path d="M296 205H330" stroke="${C.tealD}" stroke-width="2" marker-end="url(#b1)"/><path d="M444 205H466" stroke="${C.tealD}" stroke-width="2" marker-end="url(#b1)"/>`;
  g += `<path d="M516 180V144" stroke="${C.gold}" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#b1)"/>` + T(552, 166, "signal", { size: 7.5, fill: C.goldD });
  g += `<path d="M564 215h8v20" fill="none" stroke="${C.tealD}" stroke-width="1.2" marker-end="url(#b1)"/>` + T(560, 249, "waste", { size: 7.5, fill: C.muted });
  g += `<path d="M84 230v12h0" stroke="none"/>` + T(84, 246, "high-pressure flow path", { size: 7.5, fill: C.tealD, weight: 700 });
  return svg(W, H + 4, g);
}

// Figure 2-2: dual-piston (serial) pump.
function figPump() {
  const W = 560, H = 230;
  let g = arrowDefs("b2", C.tealD);
  const head = (x, label, inlet) => {
    let s = `<rect x="${x}" y="40" width="120" height="76" rx="8" fill="#eef2f7" stroke="${C.navy}" stroke-width="1.4"/>`;
    s += `<rect x="${x + 44}" y="52" width="32" height="54" rx="3" fill="#fff" stroke="${C.navy}"/>`; // chamber
    s += `<rect x="${x + 52}" y="80" width="16" height="96" rx="2" fill="${C.gold}" stroke="${C.goldD}"/>`; // piston
    s += `<rect x="${x + 44}" y="106" width="32" height="8" fill="${C.teal}"/>` + T(x + 98, 114, "seal", { size: 7.5, fill: C.tealD, anchor: "start" });
    s += `<circle cx="${x + 60}" cy="198" r="20" fill="none" stroke="${C.navy}" stroke-width="1.4"/><circle cx="${x + 66}" cy="198" r="4" fill="${C.navy}"/>` + T(x + 60, 228, "cam", { size: 7.5, fill: C.muted });
    s += T(x + 60, 32, label, { size: 9, weight: 700, fill: C.navy });
    if (inlet) s += `<circle cx="${x + 20}" cy="78" r="7" fill="#fff" stroke="${C.red}" stroke-width="1.3"/><circle cx="${x + 20}" cy="78" r="3" fill="${C.red}"/>` + T(x + 20, 132, "inlet check valve", { size: 7, fill: C.red });
    return s;
  };
  g += head(110, "primary piston", true) + head(330, "accumulator piston", false);
  g += `<circle cx="270" cy="66" r="7" fill="#fff" stroke="${C.red}" stroke-width="1.3"/><circle cx="270" cy="66" r="3" fill="${C.red}"/>` + T(270, 48, "outlet check valve", { size: 7, fill: C.red });
  g += `<path d="M20 78H122" stroke="${C.tealD}" stroke-width="2" marker-end="url(#b2)"/>` + T(56, 70, "from mixer", { size: 7.5, fill: C.tealD });
  g += `<path d="M186 66H262M278 66H372" stroke="${C.tealD}" stroke-width="2" marker-end="url(#b2)"/>`;
  g += `<path d="M406 66H470V100" fill="none" stroke="${C.tealD}" stroke-width="2"/><rect x="456" y="100" width="28" height="36" rx="6" fill="${C.tealXL}" stroke="${C.tealD}"/>` + T(470, 150, "pressure sensor", { size: 7, fill: C.tealD }) + T(470, 160, "/ damper", { size: 7, fill: C.tealD });
  g += `<path d="M484 118H548" stroke="${C.tealD}" stroke-width="2" marker-end="url(#b2)"/>` + T(520, 110, "to injector", { size: 7.5, fill: C.tealD });
  return svg(W, H + 4, g);
}

// Figure 2-3: six-port injection valve in load and inject positions.
function figValve() {
  const W = 560, H = 220;
  const valve = (cx, inject) => {
    const R = 56, ports = Array.from({ length: 6 }, (_, i) => {
      const a = (-90 + i * 60) * (Math.PI / 180);
      return [cx + R * Math.cos(a), 104 + R * Math.sin(a)];
    });
    let s = `<circle cx="${cx}" cy="104" r="${R + 16}" fill="#f4f7fa" stroke="${C.navy}" stroke-width="1.4"/>`;
    // Grooves connect neighbouring ports; the pairs rotate by one port between positions.
    const pairs = inject ? [[0, 1], [2, 3], [4, 5]] : [[1, 2], [3, 4], [5, 0]];
    for (const [a, b] of pairs) {
      const [x1, y1] = ports[a], [x2, y2] = ports[b];
      s += `<path d="M${x1} ${y1}A${R} ${R} 0 0 1 ${x2} ${y2}" fill="none" stroke="${C.teal}" stroke-width="5" stroke-linecap="round" opacity=".85"/>`;
    }
    ports.forEach(([x, y], i) => (s += `<circle cx="${x}" cy="${y}" r="6" fill="#fff" stroke="${C.navy}" stroke-width="1.3"/>` + T(x, y + 3, i + 1, { size: 7, weight: 700 })));
    // External connections: 1 pump, 2 column, 3 & 6 loop, 4 needle port, 5 waste.
    const [p1, p2, p3, p4, p5, p6] = ports;
    s += `<path d="M${p3[0] + 6} ${p3[1] + 4}C${cx + 110} ${p3[1] + 60} ${cx - 110} ${p6[1] + 60} ${p6[0] - 6} ${p6[1] + 4}" fill="none" stroke="${C.gold}" stroke-width="3"/>` + T(cx, 206, "sample loop", { size: 8, fill: C.goldD, weight: 700 });
    s += T(p1[0], p1[1] - 12, "pump", { size: 7.5, fill: C.tealD, weight: 700 }) + T(p2[0] + 30, p2[1] - 4, "column", { size: 7.5, fill: C.tealD, weight: 700 });
    s += T(p4[0] + 14, p4[1] + 24, "needle port", { size: 7, fill: C.muted }) + T(p5[0] - 24, p5[1] + 22, "waste", { size: 7, fill: C.muted });
    s += T(cx, 16, inject ? "INJECT: loop in the high-pressure path" : "LOAD: loop filled at ambient pressure", { size: 9, weight: 700, fill: inject ? C.tealD : C.navy });
    return s;
  };
  return svg(W, H, valve(150, false) + valve(420, true));
}

// Figure 2-4: ferrule seating.
function figFitting() {
  const W = 560, H = 140;
  const fitting = (ox, ok) => {
    let s = `<rect x="${ox}" y="38" width="200" height="56" rx="4" fill="#eef2f7" stroke="${C.navy}" stroke-width="1.2"/>`;
    s += `<rect x="${ox + 140}" y="58" width="60" height="16" fill="#fff" stroke="${C.navy}"/>` + T(ox + 170, 108, "column / port body", { size: 7.5, fill: C.muted });
    const tip = ok ? ox + 140 : ox + 126;
    s += `<rect x="${ox - 30}" y="61" width="${tip - ox + 30}" height="10" fill="${C.gold}" stroke="${C.goldD}"/>`;
    s += `<path d="M${tip - 30} 52L${tip - 8} 58v16L${tip - 30} 80z" fill="${C.teal}"/>`;
    if (!ok) s += `<rect x="${tip}" y="61" width="${140 + ox - tip}" height="10" fill="${C.red}" opacity=".35"/>` + T(ox + 133, 30, "void (mixing volume)", { size: 8, fill: C.red, weight: 700 });
    s += T(ox + 100, 128, ok ? "correct: tubing bottomed in the port" : "incorrect: gap before the port", { size: 9, weight: 700, fill: ok ? C.tealD : C.red });
    return s;
  };
  return svg(W, H, fitting(50, true) + fitting(330, false));
}

// Figure 2-5: programmed vs delivered gradient for two dwell volumes.
function figDwell() {
  const W = 560, H = 230;
  const a = axes({ w: W, h: H, x0: 50, xmin: 0, xmax: 20, ymin: 0, ymax: 100, xticks: [0, 4, 8, 12, 16, 20], yticks: [0, 25, 50, 75, 100], xlabel: "Time (min)", ylabel: "%B at column inlet" });
  const prog = (t) => (t < 1 ? 5 : t < 16 ? 5 + ((t - 1) / 15) * 85 : 90);
  const line = (delay, col, dash) => {
    const pts = [];
    for (let t = 0; t <= 20; t += 0.1) pts.push([a.sx(t), a.sy(prog(Math.max(0, t - delay)))]);
    return path(pts, { stroke: col, width: 2, dash });
  };
  let g = a.frame + line(0, C.muted, "5 4") + line(0.4, C.teal) + line(2.0, C.gold);
  const items = [[C.muted, "programmed gradient"], [C.teal, "system A: V<tspan font-size='6' dy='2'>D</tspan><tspan dy='-2'> = 0.4 mL</tspan>"], [C.gold, "system B: V<tspan font-size='6' dy='2'>D</tspan><tspan dy='-2'> = 2.0 mL</tspan>"]];
  items.forEach(([c, l], i) => (g += `<rect x="${a.x1 - 170}" y="${a.y1 - 52 + i * 15}" width="14" height="3" fill="${c}"/>` + T(a.x1 - 150, a.y1 - 47 + i * 15, l, { size: 8.5, anchor: "start" })));
  g += T(a.sx(3), a.sy(80), "F = 1.0 mL/min", { size: 8.5, fill: C.muted });
  return svg(W, H, g);
}

export default () => `
${chapter("فصل 2", "اجزای دستگاه و مسیر جریان", "Chapter 2 — Instrument components and flow path")}
${p("سیستم HPLC از چند واحد مستقل تشکیل شده است که هر یک سهم مشخصی در صحت، دقت و پایداری نتایج دارد. شناخت عملکرد هر واحد، پیش‌نیاز عیب‌یابی سیستماتیک است؛ زیرا هر نشانه در کروماتوگرام، مانند نوسان فشار، نویز Baseline یا جابه‌جایی Retention time، معمولاً به یک واحد مشخص قابل ردیابی است.")}
${fig(figBlock(), "2-1", "نمای کلی اجزای سیستم HPLC و مسیر جریان پرفشار از پمپ تا Detector.")}
${h2("مخازن حلال و Degassing")}
${p(
  "فاز متحرک از مخازن شیشه‌ای از طریق فیلتر ورودی (Inlet frit، معمولاً با تخلخل حدود 10 میکرومتر) کشیده می‌شود. گازهای محلول در فاز متحرک، به‌ویژه هنگام مخلوط شدن آب و حلال آلی که حلالیت گاز را کاهش می‌دهد، در محفظه پمپ یا Flow cell Detector به حباب تبدیل می‌شوند و نوسان فشار، خطای Flow rate و نویز یا اسپایک Baseline ایجاد می‌کنند. In-line vacuum degasser‌های امروزه روش استاندارد هستند؛ جریان هلیوم (Helium sparging) و صاف‌کردن تحت خلأ روش‌های جایگزین‌اند."
)}
${ul([
  "مخازن را با درپوش مناسب ببندید تا تبخیر جزء فرار (مثلاً استونیتریل یا تری‌اتیل‌آمین) ترکیب فاز متحرک را در طول Sequence تغییر ندهد.",
  "از «سرریز کردن» (Topping-off) فاز متحرک تازه روی باقی‌مانده فاز قدیمی پرهیز کنید؛ این کار ردیابی سری ساخت و تاریخ را مخدوش و خطر رشد میکروبی در بافرهای آبی را افزایش می‌دهد.",
  "فیلتر ورودی مسدود، به‌ویژه در بافرهای فسفاتی با غلظت بالا یا رشد میکروبی، به تشکیل حباب در سمت مکش و کاهش واقعی Flow rate منجر می‌شود.",
])}
${h2("پمپ: قلب سیستم")}
${p(
  "پمپ باید جریان پایدار و بدون ضربان را در برابر فشار برگشتی ستون (معمولاً 50 تا 400 بار در HPLC و تا حدود 1300 بار در UHPLC) تأمین کند. رایج‌ترین طراحی، پمپ رفت‌وبرگشتی دوپیستونی (Dual-piston reciprocating) است که در دو آرایش موازی یا سری ساخته می‌شود. در آرایش سری، پیستون اول (اصلی) حلال را از Inlet check valve مکش و با فشار ارسال می‌کند و پیستون دوم (انباشتگر) در زمان مکش پیستون اول، جریان را جبران می‌کند."
)}
${fig(figPump(), "2-2", "طرح‌واره پمپ دوپیستونی با آرایش سری: Check valve‌ها جهت جریان را تعیین می‌کنند، Piston seal از نشت جلوگیری می‌کند و Pressure sensor / Pulse damper باقی‌مانده نوسان را کاهش می‌دهد.")}
${table(
  ["جزء", "عملکرد", "نشانه خرابی", "اقدام پیشگیرانه"],
  [
    ["Check valve (توپ و نشیمنگاه از یاقوت/سافایر)", "جلوگیری از برگشت جریان", "نوسان منظم فشار، خطای Flow rate، افت فشار در مکش", "صاف‌کردن فاز متحرک، شستشوی سیستم با آب پس از بافر، جایگزینی دوره‌ای"],
    ["Piston seal", "آب‌بندی در فشار بالا", "نشت پشت هد پمپ، رسوب نمک، کاهش تکرارپذیری Retention time", "شستشوی Seal wash هنگام کار با بافر، تعویض طبق برنامه نگهداری"],
    ["پیستون (سرامیک یا سافایر)", "جابه‌جایی حلال", "خراش، شکستگی، نشت", "پرهیز از خشک‌کار کردن، حذف رسوب نمک"],
    ["Proportioning valve (Quaternary pump)", "اختلاط حلال‌ها با نسبت برنامه‌ریزی‌شده", "خطای ترکیب، جابه‌جایی Retention time در Gradient", "پرج منظم همه کانال‌ها، آزمون دقت ترکیب در OQ"],
    ["Pulse damper", "کاهش نوسان باقی‌مانده", "نویز دوره‌ای Baseline", "بررسی در PQ، به‌ویژه در طول‌موج‌های پایین"],
  ],
  { cap: "<b>جدول 2-1.</b> اجزای پمپ، نشانه‌های خرابی و اقدام‌های پیشگیرانه." }
)}
${h3("اختلاط در فشار کم و فشار بالا")}
${p(
  "در <b>Quaternary pump (low-pressure mixing)</b> یک پمپ واحد و یک Proportioning valve، حلال‌ها را پیش از ورود به پمپ با نسبت معین مخلوط می‌کند؛ انعطاف‌پذیری آن بالا است اما حجم تأخیر بیشتری دارد و به Degassing کارآمد حساس‌تر است. در <b>Binary pump (high-pressure mixing)</b> دو پمپ مستقل هر یک یک حلال را تحویل می‌دهند و اختلاط پس از پمپ و در فشار بالا انجام می‌شود؛ حجم تأخیر کمتر و دقت ترکیب در درصدهای پایین بهتر است."
)}
${h3("حجم تأخیر (Dwell volume)")}
${p(
  "حجم تأخیر، حجم مسیر از نقطه اختلاط حلال‌ها تا ورودی ستون است. در Gradient elution، تغییر ترکیب به اندازه " + m("V<sub>D</sub> / F") + " دیرتر از برنامه به ستون می‌رسد. این حجم در دستگاه‌های مختلف از حدود 0.1 میلی‌لیتر در برخی سیستم‌های UHPLC Binary تا بیش از 1 میلی‌لیتر در برخی سیستم‌های Quaternary متغیر است و یکی از شایع‌ترین علت‌های ناکامی انتقال روش‌های Gradient میان دستگاه‌هاست؛ به‌ویژه برای پیک‌هایی که در ابتدای Gradient خارج می‌شوند."
)}
${fig(figDwell(), "2-3", "اثر حجم تأخیر بر Gradient واقعی رسیده به ستون در دو سیستم با برنامه یکسان. اختلاف حدود 1.6 دقیقه در شروع Gradient می‌تواند ترتیب یا تفکیک پیک‌های ابتدایی را تغییر دهد.")}
${box(
  "lab",
  "",
  p(`حجم تأخیر هر دستگاه را یک بار با روش استاندارد اندازه‌گیری و در پرونده دستگاه ثبت کنید: ستون را با یک اتصال‌دهنده با حجم کم جایگزین کنید، حلال A آب و حلال B آب حاوی حدود 0.1 درصد استون باشد، Gradient خطی 0 تا 100 درصد B اجرا و در 265 نانومتر پایش شود. زمان رسیدن به نیمه ارتفاع پله منهای نیمه زمان Gradient، ضرب در Flow rate، برابر ${m("V<sub>D</sub>")} است. این عدد در انتقال روش و بررسی انحراف‌ها کاربرد مستقیم دارد.`)
)}
${h2("Autosampler")}
${p(
  "Autosampler باید حجم مشخصی از نمونه را با تکرارپذیری بالا و بدون Carryover از تزریق قبلی وارد جریان پرفشار کند. اساس اغلب طراحی‌ها Six-port valve است: در وضعیت <b>بارگذاری</b> Sample loop خارج از مسیر پرفشار پر می‌شود و با چرخش Valve به وضعیت <b>تزریق</b>، فاز متحرک محتوای Loop را به سوی ستون می‌برد."
)}
${fig(figValve(), "2-4", "Six-port injection valve در دو وضعیت بارگذاری و تزریق. شیارهای روتور (سبز) در هر وضعیت دو درگاه مجاور را به هم متصل می‌کنند.")}
${ul([
  "<b>Full-loop:</b> حجم نمونه چند برابر حجم Loop (معمولاً 2 تا 3 برابر) است و بیشترین دقت را دارد؛ حجم تزریق برابر حجم اسمی Loop است.",
  "<b>Partial-loop:</b> حجم تزریق کمتر از حدود نیمی از حجم Loop است و دقت به دقت سرنگ اندازه‌گیر وابسته است.",
  "<b>طراحی سوزن یکپارچه (Flow-through needle):</b> سوزن و Loop بخشی از مسیر پرفشار هستند و پس از هر تزریق با فاز متحرک شسته می‌شوند؛ Carryover کمتر است اما حجم تأخیر افزایش می‌یابد.",
  "<b>Carryover:</b> با تزریق بلانک پس از غلیظ‌ترین استاندارد ارزیابی می‌شود. انتخاب حلال شستشوی سوزن با قدرت حل‌کنندگی کافی برای آنالیت، مؤثرترین راهکار است.",
  "<b>کنترل دمای سینی:</b> برای نمونه‌های ناپایدار یا حلال‌های فرار، تنظیم دمای سینی (مثلاً 5 تا 10 درجه سانتی‌گراد) از تخریب و تبخیر در طول Sequence جلوگیری می‌کند.",
])}
${h2("محفظه ستون و کنترل دما")}
${p(
  "دمای ستون بر ویسکوزیته فاز متحرک، فشار، Retention factor و در مواردی بر Selectivity اثر دارد. در فاز معکوس، به‌عنوان قاعده تجربی، افزایش 1 درجه سانتی‌گراد Retention factor را حدود 1 تا 2 درصد کاهش می‌دهد؛ بنابراین نوسان چندین درجه‌ای دمای اتاق در ستون بدون کنترل دما، به‌تنهایی می‌تواند Retention time را بیش از حد مجاز جابه‌جا کند. Pre-heater فاز متحرک (Pre-heater) از ایجاد Gradient دمایی شعاعی در ستون جلوگیری می‌کند؛ این موضوع در Flow rate‌های بالا و دماهای بالاتر از حدود 40 درجه اهمیت بیشتری دارد."
)}
${h2("لوله‌ها، اتصالات و حجم خارج از ستون")}
${p(
  "لوله‌های مسیر پرفشار معمولاً از فولاد ضدزنگ یا PEEK با قطر داخلی حدود 0.12 تا 0.25 میلی‌متر هستند. حجم هر قطعه لوله با " + m("V = π · r<sup>2</sup> · L") + " محاسبه می‌شود؛ برای مثال 50 سانتی‌متر لوله با قطر داخلی 0.25 میلی‌متر حدود 25 میکرولیتر حجم دارد که برای ستون‌های کوتاه با قطر 2.1 میلی‌متر قابل‌توجه است. مهم‌تر از طول لوله، <b>کیفیت اتصال</b> است: اگر انتهای لوله تا ته درگاه ننشسته باشد، فضای خالی ایجادشده به محفظه اختلاط تبدیل می‌شود و پیک‌ها پهن، Tailing‌دار یا دوشاخه می‌شوند."
)}
${fig(figFitting(), "2-5", "اثر نشستن صحیح و نادرست لوله و فرول در درگاه. فاصله کوچک میان انتهای لوله و کف درگاه، حجم مرده‌ای ایجاد می‌کند که شکل پیک را تخریب می‌کند.")}
${box(
  "warn",
  "",
  p("فرول‌های فولادی پس از یک بار سفت شدن روی لوله ثابت می‌شوند و عمق نشست آن‌ها با هندسه درگاه همان سازنده تنظیم شده است. انتقال یک لوله با فرول ثابت‌شده به ستون سازنده دیگر، علت شایع حجم مرده یا نشت است. در جابه‌جایی مکرر ستون‌ها از اتصالات انگشتی قابل‌تنظیم (Finger-tight) مناسب فشار کاری استفاده کنید.")
)}
${h2("Detector و سیستم داده")}
${p(
  "Detector سیگنال الکتریکی متناسب با غلظت یا جرم آنالیت تولید می‌کند و سیستم داده کروماتوگرافی (Chromatography Data System, CDS) آن را جمع‌آوری، انتگرال‌گیری و محاسبه می‌کند. انواع Detector‌ها و ویژگی‌های آن‌ها در فصل 4 بررسی شده است. در سطح سیستم، دو تنظیم اثر مستقیم بر کیفیت داده دارد: <b>سرعت نمونه‌برداری داده</b> (Data rate) که باید حداقل حدود 20 نقطه در پهنای پیک ایجاد کند، و <b>ثابت زمانی یا پهنای پاسخ فیلتر</b> (Time constant / Response time) که مقدار بیش از حد آن پیک‌های باریک را پهن و کوتاه می‌کند. CDS همچنین محل اجرای کنترل‌های یکپارچگی داده، شامل حساب‌های کاربری، Audit trail و کنترل نسخه روش‌های پردازش است (فصل 8)."
)}
`;
