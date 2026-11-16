import { chapter, h2, h3, p, ul, ol, box, table } from "../lib.mjs";

export default () => `
${chapter("فصل 9", "صحه‌گذاری، عملیات روزمره و یکپارچگی داده", "Chapter 9 — Validation, routine operation and data integrity")}
${h2("صحه‌گذاری روش GC طبق ICH Q2(R2)")}
${p(
  "ICH Q2(R2) (Validation of analytical procedures) و ICH Q14 (Analytical procedure development) هر دو در November 2023 به مرحله 4 رسیدند. Q14 بر توسعه مبتنی بر دانش و تعریف Analytical target profile تأکید دارد و Q2(R2) مشخصه‌های صحه‌گذاری را برای هر نوع روش تعیین می‌کند. مقاومت روش (Robustness) در Q2(R2) بخشی از توسعه شمرده می‌شود و باید پیش از صحه‌گذاری نهایی ارزیابی شده باشد.",
)}
${table(
  ["مشخصه", "آزمون حد (Limit test)", "تعیین مقدار ناخالصی / حلال", "تعیین مقدار (Assay)"],
  [
    ["Specificity", "بله", "بله", "بله"],
    ["Detection limit", "بله", "—", "—"],
    ["Quantitation limit", "—", "بله", "—"],
    ["Response (Linearity) و Range", "—", "بله؛ از Reporting threshold تا 120 درصد حد", "بله؛ 80 تا 120 درصد غلظت هدف"],
    ["Accuracy", "—", "بله", "بله"],
    ["Precision (Repeatability و Intermediate)", "—", "بله", "بله"],
  ],
  { cap: "<b>جدول 9-1.</b> مشخصه‌های صحه‌گذاری بر اساس نوع روش (خلاصه ICH Q2(R2)). آزمون USP &lt;467&gt; در روش‌های A و B آزمون حد و روش C تعیین مقدار است." },
)}
${h3("نکات اختصاصی GC و Headspace")}
${ul([
  "<b>Specificity</b>: تزریق بلانک Diluent، نمونه بدون Spike و نمونه Spike‌شده با همه حلال‌های محتمل فرایند. Resolution هر حلال از پیک‌های مجاور و از پیک‌های ناشی از ماتریکس را ثابت کنید. برای اثبات هویت، ستون دوم با قطبیت متفاوت یا MS به کار ببرید.",
  "<b>Accuracy</b>: Spike حلال‌ها در ماتریکس واقعی در حداقل سه سطح (مثلاً 50، 100 و 120 درصد حد) با سه تکرار در هر سطح. در Headspace، Recovery مهم‌ترین شاهد عدم وجود اثر ماتریکس است.",
  "<b>Precision</b>: Repeatability با شش آماده‌سازی مستقل در غلظت حد، و Intermediate precision با تحلیلگر، روز و در صورت امکان دستگاه یا ستون دیگر.",
  "<b>Detection و Quantitation limit</b>: بر اساس S/N (3 و 10) یا انحراف معیار پاسخ و شیب؛ مقدار به‌دست‌آمده را با تزریق محلول در همان سطح تأیید کنید.",
  "<b>Solution stability</b>: پایداری محلول‌های استاندارد و نمونه در ویال دربسته و پس از قرار گرفتن در Autosampler؛ حلال‌های بسیار فرار از Septum سوراخ‌شده خارج می‌شوند.",
  "<b>Robustness</b>: دما و زمان تعادل Headspace، دمای اولیه آون، سرعت برنامه دمایی، جریان گاز حامل و حجم نمونه در ویال. نتیجه آن معیارهای SST و محدوده‌های کنترل روش را تعیین می‌کند.",
])}
${box(
  "key",
  "Verification روش فارماکوپه‌ای",
  p("روش USP &lt;467&gt; یا هر روش فارماکوپه‌ای دیگر نیاز به صحه‌گذاری کامل ندارد، ولی باید مناسب بودن آن برای ماده و شرایط آزمایشگاه اثبات شود (USP &lt;1226&gt; Verification of compendial procedures). برای Residual solvents این اثبات معمولاً شامل Specificity در حضور ماتریکس، Recovery حلال‌های محتمل در حد مجاز و S/N کافی پیک‌هاست. انتقال روش بین آزمایشگاه‌ها طبق USP &lt;1224&gt; (Transfer of analytical procedures) انجام می‌شود."),
)}
${h2("Qualification دستگاه")}
${p(
  "دستگاه GC و Headspace طبق USP &lt;1058&gt; (Analytical instrument qualification) در چرخه عمر خود Qualification می‌شوند: مشخصات نیاز کاربر (URS)، Installation qualification، Operational qualification و Performance qualification. آزمون‌های رایج OQ و PQ برای GC:",
)}
${table(
  ["بخش", "آزمون نمونه"],
  [
    ["آون", "دقت و پایداری دما، صحت سرعت برنامه دمایی"],
    ["Inlet و EPC", "صحت و پایداری فشار و جریان، آزمون نشت"],
    ["Autosampler", "تکرارپذیری تزریق (RSD سطح پیک)، Carryover"],
    ["Headspace", "دقت دمای ویال و خط انتقال، تکرارپذیری و Carryover"],
    ["FID", "نویز و Drift، خطی بودن پاسخ، حساسیت"],
  ],
  { cap: "<b>جدول 9-2.</b> نمونه آزمون‌های OQ و PQ دستگاه GC. معیارهای پذیرش را بر اساس مشخصات سازنده و نیاز کاربرد تعیین کنید." },
)}
${h2("عملیات روزمره")}
${h3("ساختار Sequence")}
${ol([
  "بلانک Diluent (اطمینان از تمیزی سیستم و Diluent).",
  "محلول‌های SST و بررسی معیارهای آن پیش از تزریق نمونه‌ها.",
  "استانداردها و نمونه‌ها؛ استاندارد کنترل (Bracketing) در فواصل تعریف‌شده و در پایان Sequence.",
  "بلانک پس از نمونه یا استاندارد غلیظ برای ارزیابی Carryover.",
])}
${h3("کنترل روزمره و مصرفی‌ها")}
${ul([
  "فشار سیلندرها و وضعیت تله‌ها را در ابتدای روز ثبت کنید.",
  "Septum، Liner و O-ring را بر اساس تعداد تزریق تعویض کنید و در Logbook ثبت کنید.",
  "برای هر ستون سوابق نصب، Trimming و نتایج SST را نگه دارید و روند N، Tailing و Rs را پایش کنید.",
  "ویال‌ها، درپوش‌ها و Septumهای ویال Headspace را از یک تأمین‌کننده واجد شرایط تهیه و هر سری جدید را با بلانک ارزیابی کنید.",
])}
${h2("یکپارچگی داده")}
${p(
  "داده‌های کروماتوگرافی از حساس‌ترین داده‌های آزمایشگاه از نظر بازرسی‌اند. راهنمای FDA با عنوان Data integrity and compliance with drug CGMP (2018) و اصول ALCOA+ (Attributable، Legible، Contemporaneous، Original، Accurate و Complete، Consistent، Enduring، Available) چارچوب آن را تعیین می‌کنند.",
)}
${ul([
  "<b>Audit trail</b> نرم‌افزار کروماتوگرافی همیشه فعال باشد و بازبینی آن جزء بازبینی نتیجه باشد؛ تغییر روش پردازش، حذف تزریق و انتگراسیون دستی باید قابل ردیابی باشد.",
  "<b>تزریق آزمایشی</b> (Test یا Trial injection) با نمونه واقعی پیش از Sequence رسمی ممنوع است. تزریق‌های آماده‌سازی سیستم فقط با محلول‌های تعریف‌شده در روش (بلانک یا SST) و ثبت‌شده انجام شود.",
  "<b>انتگراسیون</b>: پارامترهای انتگراسیون در روش پردازش تعریف و قفل شود. انتگراسیون دستی فقط طبق SOP، با دلیل ثبت‌شده و بازبینی مستقل مجاز است.",
  "<b>دسترسی کاربران</b>: نقش‌های جداگانه برای تحلیلگر، بازبین و مدیر سیستم؛ تحلیلگر نباید بتواند داده خام را حذف کند یا ساعت سیستم را تغییر دهد.",
  "<b>داده الکترونیکی اصلی است</b>: نسخه چاپی کروماتوگرام جایگزین داده الکترونیکی و Metadata آن نیست.",
])}
${box(
  "warn",
  "",
  p("تکرار تزریق یا آماده‌سازی تا رسیدن به نتیجه قابل قبول (Testing into compliance) نقض جدی CGMP است. نتیجه خارج از مشخصات یا SST ناموفق باید طبق روند OOS یا انحراف بررسی شود؛ هندبوک شماره 4 PharmaVault (بررسی OOS و OOT) این روند را با جزئیات شرح داده است."),
)}
${box(
  "ref",
  "منابع این فصل",
  p("ICH Q2(R2) Validation of Analytical Procedures و ICH Q14 Analytical Procedure Development (Step 4, November 2023)؛ USP &lt;1225&gt;، &lt;1226&gt;، &lt;1224&gt; و &lt;1058&gt;؛ FDA, Data Integrity and Compliance With Drug CGMP: Questions and Answers (December 2018)."),
)}
`;
