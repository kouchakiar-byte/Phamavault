import { C, chapter, h2, h3, p, ul, ol, box, eq, table, fig, svg, T, axes, path, arrowDefs } from "../lib.mjs";

const prof = (a, k, col, lag = 0, plateau = 100, dash = "") => {
  const pts = [];
  for (let t = 0; t <= 60; t += 0.5) pts.push([a.sx(t), a.sy(t < lag ? 0 : plateau * (1 - Math.exp(-k * (t - lag))))]);
  return path(pts, { stroke: col, width: 2, dash });
};

// Figure 5-1: discriminating vs non-discriminating method.
function figDisc() {
  const W = 580, H = 210;
  const pane = (ox, title, kA, kB, sub) => {
    const a = axes({ w: 280, h: 200, x0: ox + 40, x1: ox + 270, y0: 24, y1: 166, xmin: 0, xmax: 60, ymin: 0, ymax: 105, xticks: [0, 15, 30, 45, 60], yticks: [0, 50, 100], xlabel: "min", ylabel: "%", grid: true });
    return a.frame + prof(a, kA, C.teal) + prof(a, kB, C.red, 0, 100, "5 3") + T(ox + 155, 14, title, { size: 9, weight: 700, fill: C.navy }) + T(ox + 155, 200, sub, { size: 7.5, fill: C.muted });
  };
  let g = pane(0, "Medium with 2% SLS", 0.32, 0.27, "variants indistinguishable") + pane(290, "Medium with 0.5% SLS", 0.12, 0.045, "over-lubricated batch detected");
  g += `<rect x="440" y="150" width="12" height="3" fill="${C.teal}"/>` + T(456, 154, "target", { size: 7.5, anchor: "start" }) + `<rect x="500" y="150" width="12" height="3" fill="${C.red}"/>` + T(516, 154, "variant", { size: 7.5, anchor: "start" });
  return svg(W, H, g);
}

// Figure 5-2: development workflow.
function figFlow() {
  const W = 580, H = 120;
  let g = arrowDefs("w1", C.tealD);
  const steps = [["Solubility & stability", "pH 1.2–6.8"], ["Apparatus & speed", "50 rpm / 100 rpm"], ["Medium & volume", "sink, surfactant"], ["Sampling & analysis", "filter, UV/HPLC"], ["Discrimination", "batch variants"], ["Validation", "USP <1092>"]];
  steps.forEach(([a, b], i) => {
    const x = 6 + i * 96;
    g += `<rect x="${x}" y="30" width="86" height="58" rx="8" fill="${i === 4 ? C.goldL : "#f8fafc"}" stroke="${i === 4 ? C.gold : C.navy}" stroke-width="1.2"/>` + T(x + 43, 55, a, { size: 7.8, weight: 700, fill: C.navy }) + T(x + 43, 71, b, { size: 7, fill: C.muted });
    if (i < 5) g += `<path d="M${x + 87} 59H${x + 95}" stroke="${C.tealD}" stroke-width="1.4" marker-end="url(#w1)"/>`;
  });
  return svg(W, H, g);
}

export default () => `
${chapter("فصل 5", "توسعه و Validation روش انحلال", "Chapter 5 — Method development and validation")}
${p(
  "یک روش انحلال مناسب برای QC باید سه ویژگی داشته باشد: <b>تکرارپذیری</b> (Variability کم بین Vesselها و بین آزمون‌ها)، <b>قدرت تمایز</b> (Discriminating power) برای تشخیص تغییرات بحرانی فرمولاسیون و فرایند، و در حد امکان <b>ارتباط با رفتار in vivo</b>. توسعه روش فرایندی گام‌به‌گام است که از داده‌های فیزیکوشیمیایی آغاز و به Validation ختم می‌شود.",
)}
${fig(figFlow(), "5-1", "گام‌های توسعه روش انحلال؛ اثبات Discriminating power پیش از Validation انجام می‌شود.")}
${h2("گام 1: داده‌های پایه")}
${ul([
  "Solubility ماده مؤثره در 37 °C در Mediumهای pH 1.2، 4.5 و 6.8 (و آب)، و در صورت نیاز در حضور Surfactant.",
  "pKa، logP، فرم جامد (Polymorph، Hydrate، نمک) و Particle size.",
  "پایداری در هر Medium در 37 °C به مدت زمان آزمون.",
  "طبقه‌بندی BCS و دوز؛ محاسبه Dose number و Sink index.",
])}
${h2("گام 2: Apparatus، سرعت و Medium")}
${p(
  "انتخاب پیش‌فرض برای قرص Immediate-release، Apparatus 2 با سرعت 50 rpm و برای کپسول Apparatus 1 با سرعت 100 rpm است. سرعت 75 rpm در Apparatus 2 در صورت بروز Coning و با داده توجیهی پذیرفتنی است؛ سرعت‌های بالاتر معمولاً قدرت تمایز را کاهش می‌دهند. Medium با کمترین پیچیدگی که Sink condition را برقرار کند انتخاب می‌شود و ترتیب ترجیح معمولاً بافرهای آبی بدون Surfactant، سپس Surfactant با کمترین غلظت لازم است.",
)}
${h2("گام 3: زمان‌های نمونه‌برداری و Infinity point")}
${ul([
  "برای IR معمولاً 5، 10، 15، 20، 30، 45 و 60 دقیقه در Development؛ تعداد نقاط کافی در فاز صعودی پروفایل برای محاسبه f2 لازم است.",
  "برای ER حداقل سه نقطه: نقطه اولیه برای نشان دادن عدم Dose dumping (معمولاً 1 تا 2 ساعت)، نقطه میانی و نقطه پایانی که حداقل حدود 80 درصد آزادسازی را نشان دهد.",
  "<b>Infinity point:</b> در پایان پروفایل، سرعت چرخش برای مدت کوتاه (مثلاً 15 دقیقه در 150 تا 250 rpm) افزایش داده می‌شود تا آزادسازی کامل (حدود 100 درصد) و صحت محاسبات تأیید شود.",
  "خطای زمان نمونه‌برداری در USP حداکثر ± 2 درصد زمان تعیین‌شده است.",
])}
${h2("گام 4: نمونه‌برداری، فیلتراسیون و آنالیز")}
${p(
  "نمونه از Sampling zone (میانه سطح Medium و بالای Paddle یا Basket، دست‌کم 1 سانتی‌متر از دیواره) برداشته و بی‌درنگ فیلتر می‌شود تا ذرات حل‌نشده در لوله نمونه به انحلال ادامه ندهند. انتخاب فیلتر بخش بحرانی روش است و دو آزمون لازم دارد:",
)}
${table(
  ["آزمون", "روش", "معیار متداول"],
  [
    ["Filter adsorption (جذب دارو روی فیلتر)", "مقایسه محلول استاندارد فیلترشده (پس از دورریختن حجم‌های افزایشی) با محلول فیلترنشده یا سانتریفیوژشده", "اختلاف معمولاً حداکثر 2 درصد؛ حجم دورریز (Discard volume) بر اساس داده تعیین شود."],
    ["Filter efficiency (حذف ذرات)", "مقایسه نمونه فیلترشده با نمونه سانتریفیوژشده از Vessel حاوی شکل دارویی", "عدم افزایش جذب یا غلظت ناشی از ذرات عبوری."],
    ["Extractables", "فیلتر کردن Medium بلانک", "عدم تداخل در طول موج یا زمان بازداری آنالیت."],
  ],
)}
${p(
  "آنالیز نهایی با UV (مستقیم یا Fiber-optic) ساده و سریع است اما در حضور Excipientهای جاذب UV، محصولات تخریب یا ترکیب‌های چندجزئی، HPLC ترجیح دارد. در Fiber-optic باید اثر کدورت ناشی از Excipientهای نامحلول با تصحیح Baseline یا طول موج دوم بررسی شود.",
)}
${h2("گام 5: Discriminating power")}
${p(
  "قدرت تمایز روش با آزمون بچ‌هایی اثبات می‌شود که به‌طور عمدی در یک متغیر بحرانی تفاوت دارند؛ برای مثال Particle size ماده مؤثره، غلظت یا زمان Lubrication، Hardness قرص، غلظت Disintegrant یا Binder، و نمونه‌های Stability. روش باید تفاوت معنی‌دار (برای مثال f2 کمتر از 50) بین بچ هدف و بچ‌های نامطلوب نشان دهد، در حالی که بین بچ‌های قابل قبول تفاوتی نشان ندهد. یکی از رایج‌ترین دلایل ناکامی، غلظت بیش از حد Surfactant است.",
)}
${fig(figDisc(), "5-2", "اثر غلظت SLS بر قدرت تمایز: در 2 درصد SLS، بچ با Over-lubrication از بچ هدف قابل تشخیص نیست؛ در 0.5 درصد تفاوت به‌وضوح دیده می‌شود (داده نمایشی).")}
${h2("گام 6: Validation روش")}
${table(
  ["ویژگی", "روش متداول", "معیار متداول (USP &lt;1092&gt;)"],
  [
    ["Specificity", "Placebo در Medium، و در صورت نیاز نمونه تخریب‌شده", "تداخل Placebo معمولاً حداکثر 2 درصد"],
    ["Linearity و Range", "پنج سطح در گستره روش؛ برای IR تک‌نقطه‌ای ± 20 درصد بالاتر و پایین‌تر از گستره مشخصات؛ برای پروفایل از پایین‌ترین غلظت مورد انتظار تا حدود 120 درصد", "r ≥ 0.99 (معمولاً ≥ 0.998)؛ Intercept کوچک"],
    ["Accuracy / Recovery", "افزودن ماده مؤثره به Placebo در Vessel در چند سطح", "معمولاً 95 تا 105 درصد"],
    ["Repeatability", "شش Vessel از یک بچ همگن یا تکرار آنالیز", "RSD متناسب با سطح؛ برای آنالیز محلول معمولاً ≤ 2%"],
    ["Intermediate precision", "روز، آنالیست و دستگاه متفاوت", "اختلاف میانگین‌ها در محدوده از پیش تعیین‌شده (مثلاً ≤ 10% در نقاط اولیه و ≤ 5% در نقاط بعدی)"],
    ["Robustness", "تغییر کوچک pH، حجم، سرعت، دما، Degassing، نوع فیلتر", "بدون تغییر معنی‌دار نتیجه؛ پارامترهای حساس در روش کنترل شوند"],
    ["Solution stability", "نگهداری نمونه و استاندارد در شرایط آزمایشگاه", "تغییر معمولاً حداکثر 2 درصد در مدت تعیین‌شده"],
  ],
  { cap: "<b>جدول 5-1.</b> ویژگی‌های Validation روش انحلال بر پایه USP &lt;1092&gt; و ICH Q2(R2)." },
)}
${box(
  "key",
  "",
  p("تغییرپذیری بالا در Development (RSD بیش از حدود 20 درصد در نقاط اولیه یا 10 درصد در نقاط بعدی) معمولاً به خود روش برمی‌گردد، نه به فرمولاسیون: Coning، حباب، موقعیت ناپایدار قرص، Sinker نامناسب یا Degassing ناکافی را پیش از نسبت دادن تغییرپذیری به بچ بررسی کنید."),
)}
${box(
  "ref",
  "FDA Guidance, Dissolution Testing of Immediate Release Solid Oral Dosage Forms",
  p("رهنمود FDA توصیه می‌کند که مشخصات انحلال بر پایه داده‌های بچ‌های مورد استفاده در مطالعات بالینی یا Bioequivalence تعیین شود و روش، توانایی تمایز بچ‌های با عملکرد نامطلوب را داشته باشد. برای داروهای با انحلال سریع، معیار تک‌نقطه‌ای (مثلاً Q = 80% در 30 تا 60 دقیقه) و برای داروهای کم‌محلول، معیار دو نقطه‌ای پیشنهاد شده است."),
  "FDA Guidance for Industry, Dissolution Testing of Immediate Release Solid Oral Dosage Forms, 1997",
)}
`;
