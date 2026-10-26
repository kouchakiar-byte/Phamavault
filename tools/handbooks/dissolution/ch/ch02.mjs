import { C, chapter, h2, h3, p, ul, box, table, fig, svg, T, path, arrowDefs, m } from "../lib.mjs";

// Figure 2-1: Apparatus 1 and 2 in a vessel, with the critical dimensions.
function figApp12() {
  const W = 580, H = 290;
  let g = arrowDefs("d1", C.goldD);
  const vessel = (ox, label, basket) => {
    let s = `<path d="M${ox} 40V200a60 60 0 0 0 120 0V40" fill="none" stroke="${C.navy}" stroke-width="2.2"/>`;
    s += `<path d="M${ox + 2} 80V200a58 58 0 0 0 116 0V80Z" fill="${C.tealXL}"/>`;
    s += `<line x1="${ox + 2}" y1="80" x2="${ox + 118}" y2="80" stroke="${C.teal}" stroke-dasharray="4 3"/>`;
    s += `<rect x="${ox + 57}" y="10" width="6" height="${basket ? 165 : 192}" fill="#9aa9bb"/>`;
    if (basket) s += `<rect x="${ox + 38}" y="175" width="44" height="54" rx="3" fill="none" stroke="${C.navy}" stroke-width="1.6"/>` + Array.from({ length: 9 }, (_, i) => `<line x1="${ox + 38}" y1="${180 + i * 6}" x2="${ox + 82}" y2="${180 + i * 6}" stroke="${C.navy}" stroke-width=".5"/>`).join("");
    else s += `<path d="M${ox + 22} 202h76l-6 26H${ox + 28}Z" fill="#9aa9bb"/>` + `<ellipse cx="${ox + 60}" cy="252" rx="11" ry="4.5" fill="${C.navy}"/>`;
    // 25 mm gap
    const yb = basket ? 229 : 228;
    s += `<path d="M${ox + 132} ${yb}V258" stroke="${C.goldD}" stroke-width="1.2" marker-start="url(#d1)" marker-end="url(#d1)"/>` + T(ox + 138, (yb + 258) / 2 + 3, "25 ± 2 mm", { size: 8.5, fill: C.goldD, anchor: "start", weight: 700 });
    s += T(ox + 60, 282, label, { size: 9.5, fill: C.navy, weight: 700 });
    s += T(ox + 8, 74, "medium", { size: 7.5, fill: C.tealD, anchor: "start" });
    return s;
  };
  g += vessel(40, "Apparatus 1 — Basket", true) + vessel(300, "Apparatus 2 — Paddle", false);
  // sampling zone on paddle vessel
  g += `<rect x="318" y="118" width="84" height="40" rx="4" fill="${C.gold}" fill-opacity=".18" stroke="${C.gold}" stroke-dasharray="3 2"/>` + T(360, 112, "sampling zone", { size: 7.5, fill: C.goldD, weight: 700 });
  g += T(520, 60, "1 L vessel", { size: 8.5, fill: C.navy, anchor: "end", weight: 700 }) + T(520, 74, "H 160–210 mm", { size: 8, fill: C.muted, anchor: "end" }) + T(520, 88, "ID 98–106 mm", { size: 8, fill: C.muted, anchor: "end" }) + T(520, 102, "37 ± 0.5 °C", { size: 8, fill: C.muted, anchor: "end" });
  return svg(W, H, g);
}

// Figure 2-2: Apparatus 4 flow-through cell, open and closed loop.
function figApp4() {
  const W = 580, H = 200;
  let g = arrowDefs("f4", C.tealD);
  const bx = (x, y, w, h, t, s = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#f8fafc" stroke="${C.navy}" stroke-width="1.2"/>` + T(x + w / 2, y + h / 2 + (s ? -2 : 3), t, { size: 8.8, fill: C.navy, weight: 700 }) + (s ? T(x + w / 2, y + h / 2 + 12, s, { size: 7.5, fill: C.muted }) : "");
  g += bx(10, 70, 100, 50, "Medium reservoir", "37 °C");
  g += bx(150, 70, 90, 50, "Pump", "4–16 mL/min");
  // cell
  g += `<path d="M300 150 L330 50 h20 L380 150Z" fill="${C.tealXL}" stroke="${C.navy}" stroke-width="1.4"/>` + `<circle cx="340" cy="138" r="5" fill="${C.red}"/>` + Array.from({ length: 14 }, (_, i) => `<circle cx="${318 + (i % 7) * 7}" cy="${150 - 4 - Math.floor(i / 7) * 6}" r="2.6" fill="#b8c4d2"/>`).join("") + `<rect x="330" y="95" width="20" height="10" rx="2" fill="${C.navy}"/>`;
  g += T(340, 40, "flow-through cell (12 or 22.6 mm)", { size: 8.5, fill: C.navy, weight: 700 }) + T(340, 172, "ruby bead + glass beads", { size: 7.5, fill: C.muted }) + T(388, 100, "dosage form", { size: 7.5, fill: C.muted, anchor: "start" });
  g += bx(440, 30, 130, 45, "Filter → analysis", "UV / HPLC / fraction");
  g += bx(440, 115, 130, 45, "Open loop: waste", "closed loop: back");
  g += `<path d="M112 95H148" stroke="${C.tealD}" stroke-width="1.5" marker-end="url(#f4)"/><path d="M242 95H300" stroke="${C.tealD}" stroke-width="1.5" marker-end="url(#f4)"/><path d="M350 50Q390 30 438 52" fill="none" stroke="${C.tealD}" stroke-width="1.5" marker-end="url(#f4)"/><path d="M505 77V113" stroke="${C.tealD}" stroke-width="1.5" marker-end="url(#f4)"/>`;
  g += `<path d="M440 150Q240 200 60 122" fill="none" stroke="${C.gold}" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#f4)"/>` + T(250, 190, "closed loop only", { size: 7.5, fill: C.goldD });
  g += T(195, 140, "pulsation 120 ± 10 /min", { size: 7.5, fill: C.muted });
  return svg(W, H, g);
}

export default () => `
${chapter("فصل 2", "Apparatusهای انحلال", "Chapter 2 — Dissolution apparatus")}
${p(
  "فارماکوپه‌ها هفت Apparatus برای آزمون انحلال و آزادسازی دارو تعریف کرده‌اند. چهار Apparatus نخست در USP &lt;711&gt;، Ph. Eur. 2.9.3 و JP به‌صورت Harmonized شرح داده شده‌اند و Apparatus 5 تا 7 در USP &lt;724&gt; برای سیستم‌های Transdermal و برخی اشکال خاص به کار می‌روند. انتخاب Apparatus باید بر پایه نوع شکل دارویی، مکانیسم آزادسازی و هدف آزمون باشد و هرگونه انحراف از Apparatusهای فارماکوپه‌ای (مانند Peak vessel یا Mini-paddle) نیازمند توجیه و Validation است.",
)}
${table(
  ["Apparatus", "نام", "کاربرد متداول", "شرایط رایج"],
  [
    ["1", "Basket", "کپسول، قرص‌های شناور، Multiparticulateها", "50–100 rpm؛ 500–1000 mL"],
    ["2", "Paddle", "قرص و کپسول (با Sinker)؛ رایج‌ترین Apparatus", "50–75 rpm؛ 500–1000 mL"],
    ["3", "Reciprocating cylinder", "فرآورده‌های ER و DR، پروفایل با تغییر pH", "5–30 dips/min؛ 250 mL در هر Row"],
    ["4", "Flow-through cell", "داروهای کم‌محلول، Implant، Microsphere، Suspension", "4–16 mL/min؛ Open یا Closed loop"],
    ["5", "Paddle over disk", "Transdermal patch", "50 rpm؛ 32 ± 0.5 °C"],
    ["6", "Rotating cylinder", "Transdermal patch", "32 ± 0.5 °C"],
    ["7", "Reciprocating holder", "Transdermal، ایمپلنت و سیستم‌های کوچک ER", "حدود 30 cycles/min"],
  ],
  { cap: "<b>جدول 2-1.</b> Apparatusهای فارماکوپه‌ای و کاربرد متداول آن‌ها (USP &lt;711&gt;، &lt;724&gt;، Ph. Eur. 2.9.3)." },
)}
${h2("Apparatus 1 (Basket) و Apparatus 2 (Paddle)")}
${p(
  "Apparatus 1 و 2 بیش از 90 درصد آزمون‌های انحلال صنعت دارویی را پوشش می‌دهند. هر دو از Vessel استوانه‌ای با کف نیم‌کره، یک محور چرخان و Water bath یا Jacket گرم‌کننده تشکیل شده‌اند. اجزای کلیدی و الزامات فارماکوپه‌ای در جدول 2-2 آمده است.",
)}
${fig(figApp12(), "2-1", "Apparatus 1 و 2: فاصله 25 ± 2 میلی‌متر از کف Vessel تا پایین Basket یا تیغه Paddle و منطقه نمونه‌برداری (Sampling zone) در میانه سطح Medium و بالای تیغه، با فاصله حداقل 1 سانتی‌متر از دیواره.")}
${table(
  ["جزء یا پارامتر", "الزام USP &lt;711&gt; / Ph. Eur. 2.9.3", "یادداشت کاربردی"],
  [
    ["Vessel (1 L)", "استوانه‌ای با کف نیم‌کره؛ ارتفاع 160 تا 210 mm و قطر داخلی 98 تا 106 mm", "Vesselهای 2 و 4 لیتری نیز در فارماکوپه تعریف شده‌اند؛ سطح داخلی بدون خراش و لک باشد."],
    ["دما", "37 ± 0.5 °C در Vessel", "دما داخل Vessel اندازه‌گیری شود، نه فقط در Water bath."],
    ["فاصله از کف", "25 ± 2 mm", "در Mechanical qualification و هر بار تعویض Basket یا Paddle کنترل شود."],
    ["سرعت چرخش", "در محدوده ± 4% مقدار تعیین‌شده (USP)", "رهنمود FDA برای Mechanical qualification محدوده ± 2 rpm را توصیه می‌کند."],
    ["Basket", "توری 40 مش (مگر آنکه مونوگراف مش دیگری تعیین کند)", "Basket تغییر شکل‌یافته یا با توری آسیب‌دیده کنار گذاشته شود."],
    ["Paddle", "تیغه و محور یکپارچه، با پوشش بی‌اثر مجاز", "پوشش آسیب‌دیده (مانند PTFE) منبع تغییرپذیری و آلودگی است."],
    ["ارتعاش", "Apparatus نباید حرکت یا ارتعاش قابل‌توجهی به سیستم وارد کند", "دستگاه دور از سانتریفیوژ، هود و پمپ‌ها نصب شود."],
    ["Vessel cover", "برای جلوگیری از تبخیر", "در آزمون‌های طولانی (ER) تبخیر خطای حجمی ایجاد می‌کند."],
  ],
  { cap: "<b>جدول 2-2.</b> الزامات کلیدی Apparatus 1 و 2." },
)}
${h3("Sinker")}
${p(
  "شکل‌های دارویی شناور، به‌ویژه کپسول‌ها، در Apparatus 2 باید با Sinker به کف Vessel منتقل شوند. فارماکوپه Sinker را قطعه‌ای کوچک و بی‌اثر، مانند چند دور فنر سیمی (Wire helix)، توصیف می‌کند؛ Ph. Eur. و JP نمونه‌ای استاندارد (موسوم به Japanese sinker) را نیز شرح داده‌اند. نوع Sinker بخشی از روش است و باید در مونوگراف داخلی یا روش آزمون ثبت و در طول عمر فرآورده ثابت بماند؛ تغییر Sinker می‌تواند نتایج را به‌طور معنی‌دار تغییر دهد.",
)}
${h3("هیدرودینامیک Paddle")}
${p(
  "جریان در Vessel نوع Paddle همگن نیست. شبیه‌سازی‌های CFD و اندازه‌گیری‌های تجربی نشان داده‌اند که سرعت سیال در نواحی مختلف Vessel تا چند برابر تفاوت دارد و درست زیر Paddle یک ناحیه کم‌سرعت وجود دارد. قرص یا ذرات Disintegrateشده‌ای که در این ناحیه جمع می‌شوند (پدیده <b>Coning</b> یا <b>Mounding</b>) با سرعت کمتری حل می‌شوند. همچنین جابه‌جایی چند میلی‌متری قرص از مرکز کف Vessel می‌تواند سرعت انحلال را به‌طور محسوس تغییر دهد. این ویژگی‌ها توضیح می‌دهند چرا هندسه دقیق دستگاه (Centering، Verticality و ارتفاع) تا این حد بر تکرارپذیری اثر دارد.",
)}
${box(
  "ref",
  "مطالعات CFD هیدرودینامیک Apparatus 2",
  p("مدل‌سازی دینامیک سیالات محاسباتی Apparatus 2 نشان می‌دهد که بیشترین سرعت برشی در نزدیکی نوک تیغه و کمترین آن در ناحیه مرکزی زیر محور است و تغییرات کوچک در موقعیت قرص یا هندسه Vessel، الگوی جریان را در محل قرص به‌طور قابل توجهی تغییر می‌دهد. نتیجه کاربردی این یافته‌ها، تأکید بر Mechanical qualification دقیق و کنترل Coning در توسعه روش است."),
  "Kukura J., Arratia P.E., Szalai E.S., Muzzio F.J. Drug Dev. Ind. Pharm. 29 (2003) 231–239; McCarthy L.G. et al. AAPS PharmSciTech 4 (2003) E22",
)}
${h2("Apparatus 3 (Reciprocating cylinder)")}
${p(
  "در Apparatus 3، شکل دارویی داخل یک سیلندر داخلی با توری در دو انتها قرار می‌گیرد که با حرکت رفت‌وبرگشتی عمودی (Dips per minute) در یک ردیف از Vesselهای حدود 250 میلی‌لیتری غوطه‌ور می‌شود. مزیت اصلی آن امکان انتقال خودکار شکل دارویی بین Mediumهایی با pH متفاوت است که برای شبیه‌سازی عبور از دستگاه گوارش و آزمون فرآورده‌های ER و DR کاربرد دارد. اندازه مش توری‌ها، سرعت رفت‌وبرگشت و زمان Drip (چکیدن قبل از انتقال) پارامترهای روش‌اند.",
)}
${h2("Apparatus 4 (Flow-through cell)")}
${p(
  "در Apparatus 4، Medium تازه با جریان ضربانی (Pulsatile) از یک سلول حاوی شکل دارویی عبور می‌کند. سلول‌ها در دو اندازه استاندارد (قطر داخلی 12 و 22.6 میلی‌متر) ساخته می‌شوند و معمولاً یک Ruby bead حدود 5 میلی‌متری در رأس مخروط ورودی و در صورت نیاز لایه‌ای از Glass bead برای یکنواختی جریان قرار می‌گیرد. در حالت <b>Open loop</b> Medium پس از عبور دور ریخته می‌شود و Sink condition عملاً نامحدود است؛ این ویژگی Apparatus 4 را برای داروهای بسیار کم‌محلول، Implantها و Microsphereها مناسب می‌کند. در حالت <b>Closed loop</b> حجم ثابتی از Medium به گردش درمی‌آید.",
)}
${fig(figApp4(), "2-2", "Apparatus 4: پمپ با جریان ضربانی (حدود 120 ± 10 پالس در دقیقه)، سلول جریانی با Ruby bead و Glass beadها، فیلتر و آنالیز در حالت Open loop یا Closed loop.")}
${h2("انتخاب Apparatus")}
${table(
  ["شکل دارویی", "انتخاب اول", "جایگزین", "ملاحظه"],
  [
    ["قرص IR", "Apparatus 2، 50 rpm", "Apparatus 1، 100 rpm", "در صورت Coning، افزایش به 75 rpm با توجیه."],
    ["کپسول", "Apparatus 1، 100 rpm", "Apparatus 2 با Sinker", "نوع Sinker ثابت و مستند باشد."],
    ["قرص ER ماتریکسی", "Apparatus 2 یا 1", "Apparatus 3", "خطر چسبیدن ماتریکس متورم به Vessel یا توری."],
    ["قرص یا Pellet روده‌ای (DR)", "Apparatus 1 یا 2 با دو مرحله Acid و Buffer", "Apparatus 3", "روش A یا B در USP &lt;711&gt;."],
    ["Suspension خوراکی", "Apparatus 2، 25–50 rpm", "Apparatus 4", "روش انتقال نمونه به Vessel بخشی از روش است."],
    ["داروی بسیار کم‌محلول", "Apparatus 2 با Surfactant", "Apparatus 4 (Open loop)", "Sink condition را محاسبه کنید."],
  ],
  { cap: "<b>جدول 2-3.</b> راهنمای انتخاب Apparatus بر پایه USP &lt;1092&gt; و رویه متداول." },
)}
${box(
  "warn",
  "",
  p("استفاده از تجهیزات غیرفارماکوپه‌ای مانند Peak vessel (Vessel با برآمدگی مخروطی در کف برای حذف Coning) یا Mini-paddle در آزمون QC، تغییر روش محسوب می‌شود و باید با داده مقایسه‌ای، توجیه علمی و در صورت لزوم تأیید مرجع نظارتی همراه باشد."),
)}
`;
