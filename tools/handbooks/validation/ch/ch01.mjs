import { chapter, h2, h3, p, ul, box, table, fig, svg, T, arrowDefs, C } from "../lib.mjs";

const lifecycle = () => {
  const stages = [
    ["Stage 1", "Procedure design", "ATP · development · Q14"],
    ["Stage 2", "Performance qualification", "validation · Q2(R2)"],
    ["Stage 3", "Ongoing performance", "SST trends · OOS/OOT"],
  ];
  let s = arrowDefs("a1", C.navy);
  stages.forEach(([a, b, c], i) => {
    const x = 20 + i * 205;
    s += `<rect x="${x}" y="30" width="180" height="92" rx="10" fill="${i === 1 ? C.navy : C.tealXL}" stroke="${i === 1 ? C.gold : C.teal}" stroke-width="1.6"/>`;
    s += T(x + 90, 56, a, { size: 11, fill: i === 1 ? "#ecd27f" : C.tealD, weight: 700 });
    s += T(x + 90, 80, b, { size: 12, fill: i === 1 ? "#fff" : C.navy, weight: 700 });
    s += T(x + 90, 103, c, { size: 9.5, fill: i === 1 ? "#cfe9e7" : C.muted });
    if (i < 2) s += `<line x1="${x + 182}" y1="76" x2="${x + 203}" y2="76" stroke="${C.navy}" stroke-width="1.6" marker-end="url(#a1)"/>`;
  });
  s += `<path d="M560 124 C 560 170, 110 170, 110 124" fill="none" stroke="${C.gold}" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#a1)"/>`;
  s += T(335, 166, "change control · risk assessment · revalidation when needed", { size: 9.5, fill: C.goldD, weight: 600 });
  return svg(640, 180, s);
};

export default () => `
${chapter("فصل 1", "چارچوب مقررات و چرخه عمر روش", "Chapter 1 — Regulatory framework and procedure lifecycle")}
${p(
  "صحه‌گذاری روش آنالیز یعنی فراهم کردن شواهد مستند که روش، در شرایط مشخص‌شده، نتایجی با کیفیت کافی برای هدف خود تولید می‌کند. «هدف» در اینجا تعیین‌کننده است: روشی که برای Assay یک قرص مناسب است، لزوماً برای اندازه‌گیری ناخالصی 0.05 درصدی یا آزمون Cleaning validation کافی نیست. به همین دلیل، اولین پرسش هر صحه‌گذاری این است که روش دقیقاً قرار است چه چیزی را، در چه گستره‌ای و با چه دقتی اندازه بگیرد.",
)}
${h2("اسناد اصلی")}
${table(
  ["سند", "دامنه", "نکته کلیدی"],
  [
    ["ICH Q2(R2) — Validation of Analytical Procedures (2023)", "روش‌های Release و Stability داروها و مواد اولیه", "ویژگی‌های عملکردی، Reportable range، روش‌های چندمتغیره و ارزیابی هم‌زمان Accuracy و Precision"],
    ["ICH Q14 — Analytical Procedure Development (2023)", "توسعه روش و مدیریت تغییرات", "ATP، رویکرد Minimal و Enhanced، Robustness در مرحله توسعه، Established conditions"],
    ["USP &lt;1225&gt; Validation of Compendial Procedures", "روش‌های جدید یا تغییریافته", "طبقه‌بندی روش‌ها در Category I تا IV"],
    ["USP &lt;1226&gt; Verification of Compendial Procedures", "روش‌های مونوگراف فارماکوپه", "تأیید مناسب بودن روش رسمی در آزمایشگاه و برای ماتریکس مشخص"],
    ["USP &lt;1224&gt; Transfer of Analytical Procedures", "انتقال روش بین آزمایشگاه‌ها", "Comparative testing، Co-validation، Revalidation و Waiver"],
    ["USP &lt;1220&gt; Analytical Procedure Life Cycle", "کل چرخه عمر روش", "سه مرحله Design، Qualification و Ongoing verification"],
    ["FDA Guidance — Analytical Procedures and Methods Validation (2015)", "پرونده‌های NDA و ANDA", "محتوای مورد انتظار در پرونده و مدیریت تغییرات"],
    ["Ph. Eur. 2.2.46 and related general chapters", "روش‌های فارماکوپه اروپا", "روش‌های فارماکوپه صحه‌گذاری‌شده فرض می‌شوند؛ کاربر مناسب بودن را تأیید می‌کند"],
  ],
  { cap: "<b>جدول 1-1.</b> اسناد اصلی مرتبط با صحه‌گذاری روش آنالیز.", ltr: [0] },
)}
${box(
  "ref",
  "ICH Q2(R2) و ICH Q14",
  p("دو گایدلاین در یک روز (1 نوامبر 2023) به مرحله Step 4 رسیدند و مکمل یکدیگرند: Q14 چگونگی توسعه روش و شناخت آن را شرح می‌دهد و Q2(R2) چگونگی اثبات مناسب بودن آن را. دانش حاصل از توسعه، از جمله داده‌های Robustness، می‌تواند در صحه‌گذاری استفاده شود و از تکرار غیرضروری آزمایش‌ها جلوگیری کند. برای روش‌های Platform (یک روش برای چند محصول مشابه) امکان کاهش دامنه صحه‌گذاری با توجیه علمی پیش‌بینی شده است."),
  "ICH Q2(R2) Step 4, 1 Nov 2023; ICH Q14 Step 4, 1 Nov 2023",
)}
${h2("Validation، Verification، Transfer و Qualification")}
${table(
  ["فعالیت", "چه زمانی", "پرسش اصلی"],
  [
    ["Validation", "روش جدید، روش داخلی، تغییر عمده در روش یا محصول", "آیا روش برای هدفش مناسب است؟"],
    ["Verification", "استفاده از روش فارماکوپه یا روش ثبت‌شده برای اولین بار در آزمایشگاه", "آیا روش صحه‌گذاری‌شده در شرایط این آزمایشگاه و برای این محصول هم درست کار می‌کند؟"],
    ["Transfer", "انتقال روش صحه‌گذاری‌شده به آزمایشگاه دیگر (مثلاً از R&amp;D به QC یا به پیمانکار)", "آیا آزمایشگاه گیرنده همان نتایج آزمایشگاه فرستنده را به دست می‌آورد؟"],
    ["Revalidation", "تغییر در روش، فرمولاسیون، فرایند سنتز یا مسیر ناخالصی‌ها", "کدام ویژگی‌ها تحت تأثیر تغییر قرار گرفته‌اند و باید دوباره اثبات شوند؟"],
    ["Instrument qualification", "پیش از هر یک از موارد بالا", "آیا دستگاه (DQ، IQ، OQ، PQ) برای استفاده مناسب است؟ (USP &lt;1058&gt;)"],
  ],
  { cap: "<b>جدول 1-2.</b> تفاوت فعالیت‌هایی که اغلب با هم اشتباه گرفته می‌شوند." },
)}
${box(
  "warn",
  "اشتباه رایج",
  p("صحه‌گذاری روش روی دستگاهی که Qualification آن معتبر نیست، از نظر بازرس فاقد پایه است. ترتیب درست همیشه این است: Qualification دستگاه، سپس صحه‌گذاری یا Verification روش، سپس استفاده روزمره همراه با System suitability."),
)}
${h2("کدام ویژگی‌ها برای کدام روش؟")}
${p("ویژگی‌های عملکردی لازم به نوع روش بستگی دارد. جدول زیر خلاصه رویکرد ICH Q2(R2) و طبقه‌بندی USP &lt;1225&gt; است.")}
${table(
  ["ویژگی", "Identification", "Impurities — کمّی", "Impurities — حدی", "Assay، Content uniformity، Dissolution"],
  [
    ["Specificity / Selectivity", "✓", "✓", "✓", "✓"],
    ["Range: Response (Linearity)", "—", "✓", "—", "✓"],
    ["Range: حد پایینی (QL)", "—", "✓", "—", "—"],
    ["Detection limit (DL)", "—", "در صورت نیاز", "✓", "—"],
    ["Accuracy", "—", "✓", "—", "✓"],
    ["Precision: Repeatability", "—", "✓", "—", "✓"],
    ["Precision: Intermediate precision", "—", "✓", "—", "✓"],
    ["Robustness", "در توسعه روش ارزیابی می‌شود (Q14)", "", "", ""],
  ],
  { cap: "<b>جدول 1-3.</b> ویژگی‌های عملکردی لازم بر حسب نوع روش. معادل USP &lt;1225&gt;: Category I (Assay)، Category II (Impurities کمّی و حدی)، Category III (آزمون‌های عملکردی مانند Dissolution) و Category IV (Identification)." },
)}
${h2("چرخه عمر روش")}
${fig(lifecycle(), "1-1", "سه مرحله چرخه عمر روش آنالیز (USP &lt;1220&gt; و ICH Q14). صحه‌گذاری مرحله دوم است و با پایش مستمر عملکرد و کنترل تغییرات ادامه می‌یابد.")}
${h3("Analytical Target Profile (ATP)")}
${p(
  "ATP خلاصه‌ای از الزامات روش است، مستقل از تکنیک: چه چیزی (Analyte و ماتریکس)، در چه گستره‌ای، با چه Accuracy و Precision و با چه اطمینانی باید اندازه‌گیری شود. ATP پیش از انتخاب تکنیک نوشته می‌شود و معیار پذیرش صحه‌گذاری از آن استخراج می‌شود. نمونه یک ATP برای Assay قرص:",
)}
${box(
  "lab",
  "نمونه ATP",
  p("روش باید مقدار ماده مؤثره X را در قرص 50 mg، در گستره 80 تا 120 درصد مقدار برچسب، در حضور مواد جانبی و محصولات تخریب شناخته‌شده اندازه بگیرد؛ به‌طوری که نتیجه گزارش‌شده با احتمال دست‌کم 95 درصد در فاصله ±2.0 درصد از مقدار واقعی قرار گیرد."),
)}
${p(
  "دو رویکرد Q14 برای توسعه روش: <b>Minimal</b> (رویکرد سنتی: تعیین شرایط روش، ارزیابی Robustness و تعریف SST) و <b>Enhanced</b> (استفاده از ATP، ارزیابی ریسک، DoE برای شناخت اثر پارامترها و تعریف گستره عملکرد مجاز). رویکرد Enhanced کار بیشتری در توسعه می‌طلبد، ولی مدیریت تغییرات پس از ثبت را ساده‌تر می‌کند.",
)}
${h2("تغییرات مهم Q2(R2) نسبت به Q2(R1)")}
${ul([
  "<b>Response به جای Linearity:</b> مدل کالیبراسیون می‌تواند خطی یا غیرخطی باشد (مثلاً در روش‌های ایمونواسی یا Detectorهای ELSD و CAD)؛ آنچه باید اثبات شود، مناسب بودن مدل پاسخ در گستره است.",
  "<b>Reportable range و Working range:</b> گستره‌ای که نتایج در آن گزارش می‌شوند از گستره غلظت محلول‌های آزمون (پس از رقیق‌سازی) تفکیک شده است.",
  "<b>حد پایینی گستره:</b> DL و QL زیر عنوان Lower range limit آمده‌اند؛ برای ناخالصی‌ها، QL باید برابر یا کمتر از Reporting threshold باشد.",
  "<b>ارزیابی هم‌زمان Accuracy و Precision:</b> علاوه بر ارزیابی جداگانه، می‌توان خطای کل را با فاصله پیش‌بینی یا فاصله Tolerance نشان داد.",
  "<b>روش‌های چندمتغیره و طیف‌سنجی:</b> مانند NIR و Raman با مدل‌های Chemometric در دامنه گایدلاین قرار گرفته‌اند.",
  "<b>استفاده از دانش قبلی:</b> داده‌های توسعه و روش‌های Platform می‌توانند بخشی از شواهد صحه‌گذاری باشند.",
])}
`;
