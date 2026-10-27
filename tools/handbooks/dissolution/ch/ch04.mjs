import { C, chapter, h2, h3, p, ul, ol, box, eq, table, fig, svg, T, axes, path } from "../lib.mjs";

// Figure 4-1: pH-solubility profile of a weak base and the sink limit for a 20 mg dose in 900 mL.
function figPhSol() {
  const W = 540, H = 220;
  const a = axes({ w: W, h: H, x0: 56, xmin: 1, xmax: 7.5, ymin: -3, ymax: 2, xticks: [1, 2, 3, 4, 5, 6, 7], yticks: [-3, -2, -1, 0, 1, 2], xlabel: "pH", ylabel: "log Cs (mg/mL)", fmt: (v) => v });
  const pka = 5.2, c0 = 0.002;
  const pts = [];
  for (let ph = 1; ph <= 7.5; ph += 0.05) pts.push([a.sx(ph), a.sy(Math.min(1.7, Math.log10(c0 * (1 + 10 ** (pka - ph)))))]);
  const sink = Math.log10((3 * 20) / 900); // Cs needed for sink with 20 mg in 900 mL
  let g = a.frame + path(pts, { stroke: C.navy, width: 2.2 });
  g += `<line x1="${a.x0}" y1="${a.sy(sink)}" x2="${a.x1}" y2="${a.sy(sink)}" stroke="${C.red}" stroke-dasharray="5 3"/>` + T(a.x0 + 6, a.sy(sink) - 5, "Cs required for sink (3 × dose / 900 mL)", { size: 8, fill: C.red, anchor: "start", weight: 700 });
  g += T(a.sx(2.2), a.sy(1.9), "sink in 0.1 N HCl", { size: 8, fill: C.tealD, weight: 700 }) + T(a.sx(6.6), a.sy(-2.4), "no sink at pH 6.8", { size: 8, fill: C.red, weight: 700 });
  g += T(a.sx(5.2), a.sy(-0.4), "pKa 5.2", { size: 8, fill: C.muted });
  return svg(W, H, g);
}

export default () => `
${chapter("فصل 4", "Dissolution medium", "Chapter 4 — Dissolution media: selection and preparation")}
${p(
  "Medium مهم‌ترین متغیر شیمیایی روش انحلال است. انتخاب آن بر پایه Solubility و پایداری ماده مؤثره در گستره pH فیزیولوژیک، توانایی ایجاد Sink condition و قدرت Discrimination انجام می‌شود. USP &lt;1092&gt; توصیه می‌کند تا حد امکان از Mediumهای آبی در گستره pH 1.2 تا 6.8 استفاده شود و استفاده از Surfactant یا حلال آلی فقط با توجیه علمی صورت گیرد.",
)}
${h2("Mediumهای متداول و نحوه تهیه")}
${table(
  ["Medium", "pH تقریبی", "تهیه (برای 1000 mL)", "یادداشت"],
  [
    ["0.1 N HCl", "1.2", "حدود 8.5 mL HCl غلیظ (36 تا 37%) با آب به 1000 mL", "شبیه‌ساز محیط معده در حالت ناشتا."],
    ["SGF بدون آنزیم (USP)", "1.2", "2.0 g NaCl و 7.0 mL HCl، با آب به 1000 mL", "برای آزمون Two-tier با Pepsin."],
    ["Acetate buffer (USP)", "4.5", "2.99 g Sodium acetate trihydrate و 14.0 mL Acetic acid 2 N، با آب به 1000 mL", "یکی از سه pH الزامی در مطالعات Biowaiver."],
    ["Phosphate buffer (USP)", "6.8", "250 mL KH<sub>2</sub>PO<sub>4</sub> 0.2 M و 112 mL NaOH 0.2 M، با آب به 1000 mL", "معادل حدود 6.8 g KH<sub>2</sub>PO<sub>4</sub> و 0.9 g NaOH؛ pH را پس از تهیه کنترل کنید."],
    ["SIF (USP)", "6.8", "6.8 g KH<sub>2</sub>PO<sub>4</sub>، 77 mL NaOH 0.2 N و 10 g Pancreatin؛ تنظیم pH به 6.8 ± 0.1 و رساندن به حجم", "Pancreatin برای آزمون Two-tier؛ تازه تهیه شود."],
    ["آب Purified", "متغیر", "—", "pH و ظرفیت بافری کنترل‌نشده؛ برای داروهای یونیزه‌شونده مناسب نیست."],
  ],
  { cap: "<b>جدول 4-1.</b> Mediumهای متداول بر پایه Reagentها و Test solutionهای USP. در هر مورد متن جاری فارماکوپه ملاک است." },
)}
${h3("حجم و دما")}
${ul([
  "حجم متداول 900 mL است؛ گستره 500 تا 1000 mL در Vessel 1 لیتری مجاز است و برای داروهای کم‌محلول Vesselهای 2 و 4 لیتری نیز وجود دارند.",
  "حجم Medium با خطای حداکثر حدود 1 درصد اندازه‌گیری شود؛ اندازه‌گیری وزنی با تصحیح دانسیته یا استوانه مدرج کلاس A مناسب است. حجم‌سنجی در 37 °C با حجم‌سنجی در دمای اتاق اندکی تفاوت دارد و روش باید یکسان و مستند باشد.",
  "Medium پیش از قرار دادن شکل دارویی به 37 ± 0.5 °C برسد و دمای هر Vessel ثبت شود.",
])}
${h2("Degassing")}
${p(
  "گازهای محلول در Medium هنگام گرم شدن تا 37 °C به‌صورت حباب روی سطح قرص، توری Basket و دیواره Vessel ظاهر می‌شوند. حباب‌ها سطح تماس را کاهش، شناوری قرص را افزایش و الگوی جریان را تغییر می‌دهند؛ اثر آن به‌ویژه در Apparatus 1 و قرص‌های با Disintegration کند محسوس است. USP &lt;711&gt; یک روش Degassing ارائه می‌دهد و روش‌های جایگزین را به شرط اعتبارسنجی مجاز می‌داند.",
)}
${ol([
  "Medium را با همزدن ملایم تا حدود 41 °C گرم کنید.",
  "بلافاصله تحت خلأ از فیلتر با تخلخل 0.45 میکرومتر عبور دهید.",
  "همزدن تحت خلأ را حدود 5 دقیقه دیگر ادامه دهید.",
  "Medium را بدون تلاطم و پاشش به Vessel منتقل کنید؛ ریختن از ارتفاع زیاد دوباره هوا وارد می‌کند.",
])}
${box(
  "lab",
  "",
  p("سنجش اکسیژن محلول (Dissolved oxygen) با الکترود، روشی ساده برای پایش اثربخشی Degassing است. Medium Degasشده در دمای اتاق به‌تدریج دوباره هوا جذب می‌کند؛ فاصله زمانی بین Degassing و شروع آزمون را در روش محدود و ثبت کنید. برای Mediumهای حاوی Surfactant، Degassing تحت خلأ کف ایجاد می‌کند و معمولاً Surfactant پس از Degassing افزوده می‌شود."),
)}
${h2("Surfactantها")}
${p(
  "برای داروهای BCS II و IV که در حجم Medium به Sink condition نمی‌رسند، افزودن Surfactant رایج‌ترین راهکار است. Surfactant باید با کمترین غلظتی که Sink condition و قدرت Discrimination کافی ایجاد می‌کند به کار رود؛ غلظت بیش از حد، تفاوت‌های فرمولاسیون را می‌پوشاند و روش را Non-discriminating می‌کند.",
)}
${table(
  ["Surfactant", "نوع", "غلظت متداول", "ملاحظات"],
  [
    ["Sodium lauryl sulfate (SLS)", "آنیونی", "0.1 تا 2% w/v", "در بافرهای Potassium phosphate رسوب Potassium dodecyl sulfate ایجاد می‌کند؛ از Sodium phosphate استفاده کنید. کیفیت و خلوص سری‌های مختلف SLS بر نتیجه اثر دارد."],
    ["Polysorbate 80", "غیریونی", "0.1 تا 1% w/v", "احتمال حضور پراکسید؛ تداخل در آنالیز UV در طول موج‌های پایین."],
    ["CTAB", "کاتیونی", "0.1 تا 1% w/v", "مناسب برخی داروهای اسیدی؛ سازگاری با فیلتر و ستون بررسی شود."],
    ["Lauryldimethylamine oxide (LDAO)", "زویتریونی", "طبق روش", "در برخی مونوگراف‌های USP به کار رفته است."],
  ],
)}
${eq("CMC of SLS in water ≈ 8 mM ≈ 0.24% w/v", "Critical micelle concentration در حضور الکترولیت‌ها کاهش می‌یابد؛ افزایش Solubility عمدتاً بالاتر از CMC و با تشکیل میسل رخ می‌دهد")}
${fig(figPhSol(), "4-1", "پروفایل pH–Solubility یک باز ضعیف (pKa 5.2) و خط Sink برای دوز 20 میلی‌گرم در 900 mL: در 0.1 N HCl شرایط Sink برقرار است، اما در pH 6.8 نیست (داده نمایشی).")}
${h2("Mediumهای Biorelevant و آنزیم‌ها")}
${p(
  "Mediumهای Biorelevant مانند FaSSIF و FeSSIF حاوی Taurocholate و Lecithin هستند و برای پیش‌بینی رفتار in vivo داروهای کم‌محلول و اثر غذا در مرحله Development به کار می‌روند. این Mediumها برای آزمون روتین QC به دلیل هزینه، پایداری محدود و تغییرپذیری بین سری‌ها مناسب نیستند. آنزیم‌ها (Pepsin، Pancreatin، Papain، Bromelain) در آزمون کپسول‌های ژلاتینی دچار Cross-linking کاربرد دارند (فصل 6).",
)}
${h2("pH، ظرفیت بافری و پایداری")}
${ul([
  "pH هر Medium پس از تهیه کنترل شود (معمولاً ± 0.05 واحد از مقدار هدف). برای داروهای اسیدی یا بازی، pH پایان آزمون را نیز در Development اندازه‌گیری کنید؛ دوز بالای دارو می‌تواند pH بافر کم‌ظرفیت را تغییر دهد.",
  "ظرفیت بافری (Buffer capacity) و قدرت یونی بر pH سطح ذره (Microenvironmental pH) و در نتیجه سرعت انحلال داروهای یونیزه‌شونده اثر دارند؛ تغییر غلظت بافر حتی با pH ثابت ممکن است نتیجه را تغییر دهد.",
  "پایداری ماده مؤثره در Medium در 37 °C در طول کل زمان آزمون و تا زمان آنالیز (Solution stability) باید اثبات شود.",
  "Mediumهای حاوی آنزیم یا Surfactant را طبق زمان پایداری تعیین‌شده تهیه و مصرف کنید.",
])}
${box(
  "ref",
  "USP &lt;1092&gt; The Dissolution Procedure",
  p("انتخاب Medium باید بر پایه داده‌های Solubility و پایداری در گستره pH فیزیولوژیک باشد. استفاده از آب به‌عنوان Medium به دلیل وابستگی pH آن به منبع آب و حل‌شدن CO<sub>2</sub> چندان توصیه نمی‌شود، و Surfactant و غلظت آن باید با داده‌های تجربی توجیه شوند."),
  "USP General Chapter &lt;1092&gt; The Dissolution Procedure: Development and Validation",
)}
`;
