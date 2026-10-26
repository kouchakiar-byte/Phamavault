import { C, chapter, h2, h3, p, ul, box, eq, table, fig, svg, T, axes, path, arrowDefs, m } from "../lib.mjs";

// Figure 1-1: from dosage form to solution.
function figSteps() {
  const W = 580, H = 150;
  let g = arrowDefs("a1", C.tealD);
  const st = [
    ["Tablet", "intact unit"],
    ["Disintegration", "granules"],
    ["Deaggregation", "fine particles"],
    ["Dissolution", "drug in solution"],
  ];
  st.forEach(([t1, t2], i) => {
    const x = 10 + i * 145;
    g += `<rect x="${x}" y="30" width="118" height="70" rx="10" fill="${i === 3 ? C.tealXL : "#f8fafc"}" stroke="${i === 3 ? C.tealD : C.navy}" stroke-width="1.3"/>`;
    g += T(x + 59, 58, t1, { size: 10, weight: 700, fill: C.navy }) + T(x + 59, 76, t2, { size: 8.5, fill: C.muted });
    if (i < 3) g += `<path d="M${x + 120} 65H${x + 143}" stroke="${C.tealD}" stroke-width="1.6" marker-end="url(#a1)"/>`;
  });
  g += `<path d="M69 102q0 30 145 30T500 102" fill="none" stroke="${C.gold}" stroke-width="1.3" stroke-dasharray="4 3" marker-end="url(#a1)"/>`;
  g += T(290, 145, "direct dissolution from the surface also occurs at every stage", { size: 8.5, fill: C.goldD });
  return svg(W, H, g);
}

// Figure 1-2: diffusion layer model.
function figLayer() {
  const W = 540, H = 210;
  let g = arrowDefs("a2", C.navy);
  g += `<rect x="40" y="30" width="90" height="150" fill="${C.navy}" opacity=".85"/>` + T(85, 108, "solid", { size: 10, fill: "#fff", weight: 700 }) + T(85, 122, "drug", { size: 10, fill: "#fff", weight: 700 });
  g += `<rect x="130" y="30" width="80" height="150" fill="${C.tealL}"/>` + T(170, 24, "diffusion layer (h)", { size: 8.5, fill: C.tealD, weight: 700 });
  g += `<rect x="210" y="30" width="300" height="150" fill="#f8fafc" stroke="${C.line}"/>` + T(360, 24, "bulk medium (well mixed)", { size: 8.5, fill: C.navy, weight: 700 });
  g += path([[130, 45], [210, 150], [510, 150]], { stroke: C.red, width: 2 });
  g += T(140, 42, "Cs", { size: 9, fill: C.red, anchor: "start", weight: 700 }) + T(500, 144, "Ct", { size: 9, fill: C.red, anchor: "end", weight: 700 });
  g += `<path d="M150 190H200" stroke="${C.navy}" stroke-width="1.4" marker-end="url(#a2)"/>` + T(175, 205, "flux = D·A·(Cs−Ct)/h", { size: 8.5, fill: C.navy });
  return svg(W, H, g);
}

// Figure 1-3: profiles for fast, medium and slow formulations.
function figProfiles() {
  const W = 540, H = 220;
  const a = axes({ w: W, h: H, x0: 52, xmin: 0, xmax: 60, ymin: 0, ymax: 105, xticks: [0, 10, 15, 20, 30, 45, 60], yticks: [0, 20, 40, 60, 80, 100], xlabel: "Time (min)", ylabel: "Dissolved (% label claim)" });
  const curve = (k, col, lag = 0) => {
    const pts = [];
    for (let t = 0; t <= 60; t += 0.5) pts.push([a.sx(t), a.sy(t < lag ? 0 : 100 * (1 - Math.exp(-k * (t - lag))))]);
    return path(pts, { stroke: col, width: 2 });
  };
  let g = a.frame + `<line x1="${a.x0}" y1="${a.sy(85)}" x2="${a.x1}" y2="${a.sy(85)}" stroke="${C.gold}" stroke-dasharray="4 3"/>` + T(a.x1 - 4, a.sy(85) - 4, "85 %", { size: 8, fill: C.goldD, anchor: "end" });
  g += curve(0.25, C.teal) + curve(0.08, C.navy) + curve(0.035, C.red, 3);
  g += T(a.sx(9), a.sy(97), "very rapid", { size: 8.5, fill: C.tealD, weight: 700 }) + T(a.sx(30), a.sy(80), "rapid", { size: 8.5, fill: C.navy, weight: 700 }) + T(a.sx(48), a.sy(70), "slow, with lag", { size: 8.5, fill: C.red, weight: 700 });
  return svg(W, H, g);
}

export default () => `
${chapter("فصل 1", "مبانی انحلال و عوامل مؤثر", "Chapter 1 — Dissolution fundamentals")}
${p(
  "انحلال فرایندی است که طی آن مولکول‌های ماده مؤثره از فاز جامد جدا شده و در Medium پخش می‌شوند. برای یک قرص Immediate-release، آزادسازی دارو مجموعه‌ای از مراحل متوالی و هم‌زمان است: نفوذ مایع به داخل قرص (Wetting و Water uptake)، Disintegration به گرانول، Deaggregation به ذرات اولیه و در نهایت انحلال ذرات. انحلال مستقیم از سطح قرص و گرانول‌ها نیز در تمام این مراحل رخ می‌دهد. کندترین مرحله، سرعت کل فرایند را تعیین می‌کند (Rate-limiting step)؛ در داروهای محلول معمولاً Disintegration و در داروهای کم‌محلول معمولاً خود انحلال ذرات تعیین‌کننده است.",
)}
${fig(figSteps(), "1-1", "مراحل آزادسازی دارو از قرص Immediate-release. شناخت مرحله کند (Rate-limiting) مبنای Troubleshooting و توسعه روش است.")}
${h2("معادله Noyes–Whitney و مدل لایه انتشار")}
${p(
  "بنیادی‌ترین توصیف کمّی انحلال، معادله Noyes–Whitney در شکل اصلاح‌شده Nernst–Brunner است. در این مدل، اطراف هر ذره یک لایه ساکن (Diffusion layer) به ضخامت h وجود دارد که غلظت در سطح ذره برابر Solubility (C<sub>s</sub>) و در توده Medium برابر C<sub>t</sub> است. سرعت انحلال با شیب غلظت در این لایه متناسب است:",
)}
${eq("dM/dt = (D · A / h) · (C<sub>s</sub> − C<sub>t</sub>)", "D ضریب نفوذ، A سطح مؤثر ذرات، h ضخامت لایه انتشار، C<sub>s</sub> Solubility و C<sub>t</sub> غلظت در توده Medium")}
${fig(figLayer(), "1-2", "مدل لایه انتشار (Nernst–Brunner): افت غلظت از C<sub>s</sub> در سطح جامد تا C<sub>t</sub> در توده Medium.")}
${p("هر جمله این معادله به یک متغیر عملی در آزمایشگاه و فرمولاسیون ترجمه می‌شود:")}
${table(
  ["جمله معادله", "عامل عملی", "پیامد در آزمون انحلال"],
  [
    ["A (سطح)", "Particle size، Micronization، Wettability، Disintegration", "کاهش اندازه ذره یا بهبود Wetting سرعت انحلال را افزایش می‌دهد؛ تجمع ذرات (Agglomeration) آن را کاهش می‌دهد."],
    ["C<sub>s</sub> (Solubility)", "pH و pKa، فرم نمکی، Polymorph، Hydrate، Surfactant", "تغییر pH Medium یا فرم جامد می‌تواند سرعت را چند برابر تغییر دهد."],
    ["h (لایه انتشار)", "هیدرودینامیک: سرعت چرخش، نوع Apparatus، موقعیت قرص، Coning", "افزایش rpm لایه را نازک‌تر و انحلال را سریع‌تر می‌کند؛ هیدرودینامیک ناهمگن منبع اصلی تغییرپذیری است."],
    ["C<sub>s</sub> − C<sub>t</sub>", "Sink condition", "اگر C<sub>t</sub> به C<sub>s</sub> نزدیک شود، نیروی محرکه کاهش و پروفایل به‌طور مصنوعی Plateau می‌شود."],
    ["D (نفوذ)", "دما، ویسکوزیته Medium", "انحراف دما از 37 °C یا Medium ویسکوز سرعت را تغییر می‌دهد."],
  ],
)}
${h2("Solubility، pH و فرم جامد")}
${p(
  "برای داروهای اسیدی یا بازی ضعیف، Solubility کل تابع pH است و با معادله Henderson–Hasselbalch پیش‌بینی می‌شود. یک باز ضعیف (مانند بسیاری از داروهای قلبی و CNS) در pH اسیدی معده به‌خوبی حل می‌شود اما در pH 6.8 ممکن است Solubility آن صدها برابر کاهش یابد؛ عکس این رفتار برای اسیدهای ضعیف (مانند NSAIDها) صادق است. به همین دلیل، پروفایل Solubility در گستره pH 1.2 تا 6.8 نخستین داده لازم برای طراحی روش انحلال است.",
)}
${eq("اسید ضعیف: C<sub>s</sub> = C<sub>0</sub> · (1 + 10<sup>pH − pKa</sup>) &nbsp;&nbsp;·&nbsp;&nbsp; باز ضعیف: C<sub>s</sub> = C<sub>0</sub> · (1 + 10<sup>pKa − pH</sup>)", "C<sub>0</sub> Solubility ذاتی فرم یونیزه‌نشده (Intrinsic solubility)")}
${ul([
  "<b>Polymorphism:</b> فرم Metastable معمولاً Solubility و سرعت انحلال بالاتری دارد اما ممکن است حین فرایند (Wet granulation، Drying) یا Stability به فرم پایدار تبدیل شود و افت انحلال ایجاد کند.",
  "<b>Hydrate و Solvate:</b> فرم Anhydrous اغلب سریع‌تر از Hydrate حل می‌شود؛ تبدیل فرم در تماس با آب (Solution-mediated transformation) می‌تواند به کاهش سرعت انحلال در طول آزمون بینجامد.",
  "<b>فرم نمکی:</b> نمک یک باز ضعیف در Medium با pH بالا ممکن است به Free base کم‌محلول تبدیل و روی سطح ذره رسوب کند (Disproportionation).",
  "<b>فرم آمورف:</b> Solubility ظاهری بالاتر و احتمال Supersaturation و سپس رسوب؛ پایداری فیزیکی آن باید پایش شود.",
])}
${h2("طبقه‌بندی Biopharmaceutics (BCS)")}
${p(
  "سامانه BCS داروها را بر اساس Solubility و Permeability در چهار کلاس قرار می‌دهد. طبق ICH M9، ماده‌ای <b>High solubility</b> است که بالاترین دوز واحد آن در 250 mL یا کمتر از Medium آبی در گستره pH 1.2 تا 6.8 و دمای 37 ± 1 °C حل شود. <b>High permeability</b> به جذب کامل (حداقل 85 درصد) در انسان اطلاق می‌شود.",
)}
${table(
  ["کلاس", "Solubility", "Permeability", "نقش آزمون انحلال"],
  [
    ["BCS I", "High", "High", "انحلال معمولاً Rate-limiting نیست؛ کاندید Biowaiver با انحلال Very rapid یا Rapid."],
    ["BCS II", "Low", "High", "انحلال مرحله تعیین‌کننده جذب است؛ روش باید Discriminating باشد و اغلب Surfactant لازم است."],
    ["BCS III", "High", "Low", "Permeability محدودکننده است؛ Biowaiver فقط با انحلال Very rapid و Q1/Q2 مشابه."],
    ["BCS IV", "Low", "Low", "هم انحلال و هم جذب محدودکننده‌اند؛ پیش‌بینی in vivo دشوار است."],
  ],
)}
${eq("D<sub>0</sub> = (M<sub>0</sub> / V<sub>0</sub>) / C<sub>s</sub> &nbsp;&nbsp; (V<sub>0</sub> = 250 mL)", "Dose number بزرگ‌تر از 1 یعنی بالاترین دوز در 250 mL حل نمی‌شود (Low solubility)")}
${h2("Sink condition")}
${p(
  "Sink condition به وضعیتی گفته می‌شود که غلظت ماده حل‌شده در Medium به اندازه‌ای پایین بماند که بر نیروی محرکه انحلال اثر محسوسی نگذارد. USP &lt;1092&gt; حجم Medium را دست‌کم <b>سه برابر</b> حجم لازم برای تشکیل محلول اشباع از کل دوز توصیه می‌کند. در غیاب Sink condition، پروفایل در سطحی کمتر از 100 درصد Plateau می‌شود و آزمون به‌جای عملکرد فرمولاسیون، Solubility را اندازه می‌گیرد.",
)}
${eq("Sink index = (C<sub>s</sub> × V) / Dose &nbsp; ≥ 3", "C<sub>s</sub> در همان Medium و دمای 37 °C اندازه‌گیری شود")}
${fig(figProfiles(), "1-3", "سه نوع پروفایل انحلال: Very rapid (حداقل 85 درصد در 15 دقیقه)، Rapid (حداقل 85 درصد در 30 دقیقه) و پروفایل کند همراه با Lag time ناشی از Disintegration کند.")}
${h2("عوامل فرمولاسیون و فرایند")}
${table(
  ["عامل", "اثر متداول بر انحلال", "یادداشت"],
  [
    ["Magnesium stearate و زمان Lubrication", "کاهش Wettability و سرعت انحلال با افزایش غلظت و زمان اختلاط", "Over-lubrication از علل شایع افت انحلال پس از Scale-up است."],
    ["نوع و غلظت Disintegrant", "Superdisintegrantها Lag time را کاهش می‌دهند", "روش افزودن (Intra/Extragranular) نیز مؤثر است."],
    ["Binder و Wet granulation", "گرانول متراکم‌تر و Binder بیشتر ممکن است انحلال را کند کند", "End point و LOD گرانول متغیرهای بحرانی‌اند."],
    ["نیروی Compression و Hardness", "افزایش Hardness معمولاً Disintegration را کند می‌کند", "رابطه را در Compression profile بررسی کنید."],
    ["Film coating", "تأخیر اولیه کوتاه؛ در روکش‌های ضخیم یا متقاطع اثر بیشتر", "دمای Curing و Weight gain بحرانی‌اند."],
    ["کپسول ژلاتینی", "Cross-linking در اثر آلدئیدها، رطوبت و دما؛ تشکیل Pellicle", "آزمون Two-tier با آنزیم (فصل 6)."],
  ],
)}
${box(
  "ref",
  "Amidon و همکاران، 1995",
  p("طبقه‌بندی BCS بر این مفهوم استوار است که جذب خوراکی را می‌توان با دو پارامتر بنیادی Solubility و Permeability توصیف کرد و در نتیجه، برای داروهای با Solubility و Permeability بالا، انحلال سریع in vitro پیش‌بینی‌کننده مناسبی برای رفتار in vivo است. این چارچوب مبنای علمی Biowaiver در رهنمودهای امروزی است."),
  "Amidon G.L., Lennernäs H., Shah V.P., Crison J.R. Pharm. Res. 12 (1995) 413–420",
)}
${box(
  "key",
  "",
  p("آزمون انحلال QC و آزمون انحلال Biorelevant دو هدف متفاوت دارند. روش QC باید <b>Discriminating</b>، تکرارپذیر و ساده باشد تا تغییرات بحرانی فرمولاسیون و فرایند را نشان دهد؛ روش Biorelevant تلاش می‌کند شرایط فیزیولوژیک را شبیه‌سازی کند. اشتباه گرفتن این دو هدف، یکی از رایج‌ترین خطاها در توسعه روش است."),
)}
`;
