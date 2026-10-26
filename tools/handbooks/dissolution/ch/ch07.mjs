import { C, chapter, h2, h3, p, ul, ol, box, eq, table, fig, svg, T, axes, path } from "../lib.mjs";

// Figure 7-1: reference vs test profiles with f2.
function figF2() {
  const W = 540, H = 220;
  const a = axes({ w: W, h: H, x0: 52, xmin: 0, xmax: 60, ymin: 0, ymax: 105, xticks: [0, 5, 10, 15, 20, 30, 45, 60], yticks: [0, 20, 40, 60, 80, 100], xlabel: "Time (min)", ylabel: "Dissolved (%)" });
  const t = [5, 10, 15, 20, 30, 45, 60], R = [28, 51, 67, 78, 89, 95, 98], Tt = [21, 42, 59, 71, 85, 93, 97];
  const ln = (ys, col, dash = "") => path(t.map((x, i) => [a.sx(x), a.sy(ys[i])]), { stroke: col, width: 2, dash }) + t.map((x, i) => `<circle cx="${a.sx(x)}" cy="${a.sy(ys[i])}" r="3.2" fill="${col}"/>`).join("");
  let g = a.frame + `<line x1="${a.x0}" y1="${a.sy(85)}" x2="${a.x1}" y2="${a.sy(85)}" stroke="${C.gold}" stroke-dasharray="4 3"/>` + T(a.x0 + 6, a.sy(85) - 4, "85 %", { size: 8, fill: C.goldD, anchor: "start" });
  g += ln(R, C.navy) + ln(Tt, C.teal, "5 3");
  g += `<rect x="${a.x1 - 170}" y="${a.y1 - 58}" width="160" height="48" rx="6" fill="#fff" stroke="${C.line}"/>` + `<rect x="${a.x1 - 160}" y="${a.y1 - 46}" width="14" height="3" fill="${C.navy}"/>` + T(a.x1 - 140, a.y1 - 42, "Reference (RLD)", { size: 8.5, anchor: "start" }) + `<rect x="${a.x1 - 160}" y="${a.y1 - 30}" width="14" height="3" fill="${C.teal}"/>` + T(a.x1 - 140, a.y1 - 26, "Test, f2 = 57", { size: 8.5, anchor: "start", weight: 700 });
  return svg(W, H, g);
}

// Figure 7-2: f2 as a function of the mean difference.
function figF2Curve() {
  const W = 540, H = 200;
  const a = axes({ w: W, h: H, x0: 52, xmin: 0, xmax: 25, ymin: 20, ymax: 100, xticks: [0, 5, 10, 15, 20, 25], yticks: [20, 40, 50, 60, 80, 100], xlabel: "Average absolute difference at each time point (%)", ylabel: "f2" });
  const pts = [];
  for (let d = 0; d <= 25; d += 0.25) pts.push([a.sx(d), a.sy(50 * Math.log10(100 / Math.sqrt(1 + d * d)))]);
  let g = a.frame + path(pts, { stroke: C.navy, width: 2.2 });
  g += `<line x1="${a.sx(10)}" y1="${a.y1}" x2="${a.sx(10)}" y2="${a.sy(50)}" stroke="${C.red}" stroke-dasharray="4 3"/><line x1="${a.x0}" y1="${a.sy(50)}" x2="${a.sx(10)}" y2="${a.sy(50)}" stroke="${C.red}" stroke-dasharray="4 3"/>` + T(a.sx(10) + 5, a.sy(50) - 6, "f2 ≈ 50 at a 10 % mean difference", { size: 8.5, fill: C.red, anchor: "start", weight: 700 });
  return svg(W, H, g);
}

export default () => `
${chapter("فصل 7", "مقایسه پروفایل، Biowaiver و IVIVC", "Chapter 7 — Profile comparison, biowaivers and IVIVC")}
${p(
  "مقایسه پروفایل انحلال در چند موقعیت کلیدی به کار می‌رود: مقایسه فرآورده ژنریک با فرآورده مرجع (RLD)، ارزیابی تغییرات پس از تأیید (SUPAC) مانند تغییر سازنده ماده مؤثره، مقیاس یا محل تولید، تأیید قدرت‌های پایین‌تر یک خانواده فرآورده و درخواست Biowaiver. ساده‌ترین و پذیرفته‌ترین ابزار، <b>ضریب مشابهت f2</b> است.",
)}
${h2("ضریب مشابهت f2 و ضریب تفاوت f1")}
${eq("f<sub>2</sub> = 50 · log<sub>10</sub> { [ 1 + (1/n) Σ (R<sub>t</sub> − T<sub>t</sub>)² ]<sup>−0.5</sup> × 100 }", "R<sub>t</sub> و T<sub>t</sub> میانگین درصد حل‌شده مرجع و آزمون در زمان t، و n تعداد نقاط زمانی")}
${eq("f<sub>1</sub> = [ Σ |R<sub>t</sub> − T<sub>t</sub>| / Σ R<sub>t</sub> ] × 100", "f<sub>1</sub> بین 0 تا 15 و f<sub>2</sub> بین 50 تا 100 نشانه مشابهت دو پروفایل است")}
${p(
  "f2 تابعی لگاریتمی از میانگین مربع اختلاف‌هاست. مقدار f2 برابر 100 یعنی دو پروفایل یکسان‌اند و f2 برابر 50 تقریباً معادل میانگین اختلاف 10 درصدی در هر نقطه زمانی است (شکل 7-2).",
)}
${fig(figF2(), "7-1", "پروفایل انحلال فرآورده مرجع و آزمون؛ با نقاط 5 تا 30 دقیقه (یک نقطه پس از 85 درصد) f2 حدود 57 به دست می‌آید (داده نمایشی؛ محاسبه کامل در فصل 10).")}
${fig(figF2Curve(), "7-2", "رابطه f2 با میانگین اختلاف مطلق در نقاط زمانی؛ مرز پذیرش f2 = 50 با اختلاف حدود 10 درصد متناظر است.")}
${h2("شرایط استفاده از f2")}
${table(
  ["شرط", "FDA (1997)", "EMA (2010)"],
  [
    ["تعداد واحد", "حداقل 12 واحد از هر فرآورده", "حداقل 12 واحد از هر فرآورده"],
    ["نقاط زمانی", "زمان‌های یکسان؛ حداقل سه تا چهار نقطه", "حداقل سه نقطه (بدون صفر)"],
    ["نقاط پس از 85%", "حداکثر یک نقطه پس از 85% انحلال هر دو فرآورده", "حداکثر یک نقطه پس از 85% انحلال هر یک از دو فرآورده"],
    ["تغییرپذیری", "CV نقاط اولیه (مثلاً 10 دقیقه) حداکثر 20% و سایر نقاط حداکثر 10%", "CV نخستین نقطه حداکثر 20% و سایر نقاط حداکثر 10%"],
    ["انحلال خیلی سریع", "اگر هر دو فرآورده در 15 دقیقه حداقل 85% حل شوند، مقایسه پروفایل لازم نیست", "همان؛ پروفایل‌ها مشابه تلقی می‌شوند"],
  ],
  { cap: "<b>جدول 7-1.</b> شرایط استفاده از f2 در رهنمودهای FDA و EMA." },
)}
${box(
  "warn",
  "",
  p("وقتی CV از حدود تعیین‌شده بیشتر است، f2 معتبر نیست. در این حالت روش‌های جایگزین مانند <b>Bootstrap f2</b> (برآورد فاصله اطمینان f2) یا روش‌های چندمتغیره مستقل از مدل (Multivariate statistical distance) به کار می‌روند و انتخاب روش باید پیش از انجام آزمون مشخص و توجیه شود. افزودن نقاط زمانی پس از 85 درصد برای «بالا بردن» f2 مجاز نیست."),
)}
${h2("Biowaiver بر پایه BCS (ICH M9)")}
${p(
  "رهنمود ICH M9 شرایط معافیت از مطالعه Bioequivalence را برای اشکال خوراکی Immediate-release با اثر سیستمیک بر پایه BCS تعیین می‌کند. آزمون انحلال در سه Medium با pH 1.2، 4.5 و 6.8 با 12 واحد از هر فرآورده انجام می‌شود (Apparatus 2 در 50 rpm یا Apparatus 1 در 100 rpm، حجم 900 mL یا کمتر، بدون Surfactant).",
)}
${table(
  ["تعریف یا شرط", "معیار ICH M9"],
  [
    ["High solubility", "بالاترین دوز در 250 mL یا کمتر در گستره pH 1.2 تا 6.8 در 37 ± 1 °C حل شود"],
    ["Very rapidly dissolving", "حداقل 85% در 15 دقیقه در هر سه Medium"],
    ["Rapidly dissolving", "حداقل 85% در 30 دقیقه در هر سه Medium"],
    ["BCS کلاس I", "انحلال Very rapid برای هر دو فرآورده، یا Rapid همراه با پروفایل‌های مشابه (f2 ≥ 50)"],
    ["BCS کلاس III", "انحلال Very rapid برای هر دو فرآورده؛ Excipientها از نظر کیفی یکسان و از نظر کمّی بسیار مشابه"],
    ["Excipientها", "Excipientهایی که بر جذب اثر دارند (مانند Sugar alcoholها) از نظر کیفی و کمّی مشابه باشند"],
    ["استثنا", "داروهای با Narrow therapeutic index و فرآورده‌های جذب در دهان (مانند Sublingual و ODT با جذب حفره دهان) مشمول نیستند"],
  ],
  { cap: "<b>جدول 7-2.</b> خلاصه شرایط Biowaiver بر پایه BCS در ICH M9 (2019)." },
)}
${h2("تغییرات پس از تأیید (SUPAC-IR)")}
${p("رهنمود SUPAC-IR سه سطح مستندسازی انحلال را بر حسب نوع و سطح تغییر تعریف می‌کند:")}
${table(
  ["Case", "مستندسازی انحلال"],
  [
    ["Case A", "انحلال حداقل 85% در 15 دقیقه در 900 mL از 0.1 N HCl (Apparatus 1 در 100 rpm یا Apparatus 2 در 50 rpm)"],
    ["Case B", "پروفایل چندنقطه‌ای در Medium مندرج در پرونده یا فارماکوپه (مثلاً 15، 30، 45، 60 و 120 دقیقه یا تا رسیدن به Plateau)"],
    ["Case C", "پروفایل‌های چندنقطه‌ای در آب، 0.1 N HCl و بافرهای USP با pH 4.5، 6.5 و 7.5"],
  ],
  { cap: "<b>جدول 7-3.</b> سطوح مستندسازی انحلال در SUPAC-IR (FDA, 1995)." },
)}
${h2("In vitro–in vivo correlation (IVIVC)")}
${p(
  "IVIVC مدلی پیش‌بینی‌کننده است که خاصیت in vitro (معمولاً سرعت یا مقدار انحلال) را به پاسخ in vivo (غلظت پلاسمایی یا مقدار جذب‌شده) ربط می‌دهد و بیشتر برای فرآورده‌های ER توسعه داده می‌شود. وجود IVIVC معتبر امکان تعیین مشخصات انحلال با مبنای بالینی و Biowaiver برای برخی تغییرات را فراهم می‌کند.",
)}
${table(
  ["سطح", "تعریف", "کاربرد"],
  [
    ["Level A", "رابطه نقطه‌به‌نقطه بین کسر حل‌شده in vitro و کسر جذب‌شده in vivo", "قوی‌ترین سطح؛ پشتیبان Biowaiver و تعیین مشخصات"],
    ["Level B", "مقایسه Mean dissolution time با Mean residence یا Mean absorption time", "کاربرد محدود؛ پیش‌بینی پروفایل پلاسمایی ممکن نیست"],
    ["Level C", "رابطه یک پارامتر انحلال (مثلاً t<sub>50%</sub>) با یک پارامتر فارماکوکینتیک (AUC یا C<sub>max</sub>)", "پشتیبان توسعه فرمولاسیون"],
    ["Multiple Level C", "رابطه چند نقطه انحلال با یک یا چند پارامتر فارماکوکینتیک", "در برخی موارد معادل Level A پذیرفته می‌شود"],
  ],
)}
${box(
  "ref",
  "Moore و Flanner، 1996",
  p("ضرایب f1 و f2 به‌عنوان روشی مستقل از مدل برای مقایسه دو پروفایل انحلال معرفی شدند؛ f2 به دلیل حساسیت به اختلاف‌های بزرگ‌تر و تفسیر ساده، به معیار اصلی رهنمودهای نظارتی تبدیل شد."),
  "Moore J.W., Flanner H.H. Pharm. Technol. 20 (1996) 64–74; Shah V.P. et al. Pharm. Res. 15 (1998) 889–896",
)}
`;
