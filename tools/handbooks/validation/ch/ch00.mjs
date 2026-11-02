import { chapter, h2, p, box, table, m } from "../lib.mjs";

export default () => `
${chapter("پیشگفتار", "درباره این هندبوک", "About this handbook", "پیشگفتار — درباره این هندبوک")}
${p(
  "هر عددی که آزمایشگاه کنترل کیفیت گزارش می‌کند، از Assay و Impurities تا Dissolution و Water content، تنها زمانی قابل اتکاست که روش تولیدکننده آن «برای هدف مورد نظر مناسب» (Fit for intended purpose) بودنش را با شواهد مستند نشان داده باشد. صحه‌گذاری روش آنالیز (Analytical procedure validation) همین شواهد را فراهم می‌کند و به همین دلیل یکی از پرتکرارترین موضوعات در بازرسی‌های GMP و در ارزیابی پرونده‌های ثبت (Module 3، بخش‌های 3.2.S.4.3 و 3.2.P.5.3) است.",
  "با انتشار <b>ICH Q2(R2)</b> و <b>ICH Q14</b> در آبان 1402 (نوامبر 2023)، نگاه به صحه‌گذاری از یک «رویداد یک‌باره» به بخشی از <b>چرخه عمر روش</b> (Analytical procedure lifecycle) تغییر کرده است: روش بر پایه یک هدف تعریف‌شده (Analytical Target Profile) توسعه می‌یابد، صحه‌گذاری می‌شود، در طول عمر خود پایش می‌شود و تغییرات آن با مدیریت ریسک کنترل می‌شود. اصطلاحات هم به‌روز شده‌اند؛ برای مثال Linearity در قالب گسترده‌تر <b>Response</b> و Range در قالب <b>Reportable range</b> و <b>Working range</b> تعریف شده است.",
)}
${p(
  "این هندبوک ادامه دو شماره قبل (HPLC و Dissolution) است و برای کارشناسانی تدوین شده که باید پروتکل صحه‌گذاری بنویسند، آزمون‌ها را اجرا کنند، داده‌ها را ارزیابی کنند یا در بازرسی از آن دفاع کنند. ساختار هندبوک: فصل 1 چارچوب مقررات و چرخه عمر روش؛ فصل 2 برنامه‌ریزی و پروتکل؛ فصل 3 Specificity و Forced degradation؛ فصل 4 Range و Response؛ فصل 5 Accuracy و Precision؛ فصل 6 حدود پایینی (DL و QL)، Robustness و System suitability؛ فصل 7 ملاحظات هر نوع روش، Verification، انتقال روش و Revalidation؛ فصل 8 مطالعات موردی؛ فصل 9 مسائل محاسباتی حل‌شده. پیوست‌ها شامل چک‌لیست پروتکل و گزارش، جدول سریع معیارهای پذیرش، پرسش‌های ارزیابی، واژه‌نامه و رفرنس‌هاست.",
)}
${box(
  "ref",
  "کادرهای طلایی",
  p("کادرهای طلایی‌رنگ خلاصه‌ای بازنویسی‌شده از مفاهیم کلیدی گایدلاین‌ها، فصل‌های عمومی فارماکوپه و کتاب‌های مرجع است و منبع هر کادر در انتهای آن ذکر شده است. این کادرها نقل‌قول مستقیم نیستند؛ برای متن کامل به منبع اصلی (پیوست د) مراجعه شود."),
)}
${box(
  "key",
  "معیارهای پذیرش در این هندبوک",
  p("ICH Q2(R2) عمداً عدد ثابتی برای معیارهای پذیرش تعیین نمی‌کند و انتخاب آن‌ها را به هدف روش و ریسک محصول واگذار کرده است. اعدادی که در این هندبوک با عنوان «رایج» یا «متداول در صنعت» آمده، برگرفته از عرف آزمایشگاه‌ها و منابع آموزشی است و الزام رسمی نیست. در هر تصمیم مستند، <b>متن نسخه جاری</b> گایدلاین، فارماکوپه و SOPهای مصوب سازمان ملاک عمل است."),
)}
${h2("نمادها و اختصارها")}
${table(
  ["نماد", "کمیت", "توضیح"],
  [
    [m("<span style='text-decoration:overline'>x</span> , s"), "میانگین و انحراف معیار نمونه", m("s = √[Σ(xᵢ − <span style='text-decoration:overline'>x</span>)² / (n − 1)]")],
    [m("RSD"), "انحراف معیار نسبی", m("RSD (%) = s / <span style='text-decoration:overline'>x</span> × 100")],
    [m("b , a"), "شیب و عرض از مبدأ خط رگرسیون", m("y = a + b·x")],
    [m("r , R²"), "ضریب همبستگی و ضریب تعیین", "شاخص برازش، نه به‌تنهایی اثبات خطی بودن"],
    [m("σ"), "انحراف معیار پاسخ", "برای محاسبه DL و QL"],
    [m("S/N"), "نسبت سیگنال به نویز", "3:1 برای DL و 10:1 برای QL"],
    [m("Rs"), "Resolution دو پیک", "طبق USP &lt;621&gt; و Ph. Eur. 2.2.46"],
    [m("CI"), "فاصله اطمینان", "معمولاً 95%"],
  ],
)}
${table(
  ["اختصار", "عبارت کامل", "اختصار", "عبارت کامل"],
  [
    ["ATP", "Analytical Target Profile", "DL / QL", "Detection / Quantitation limit"],
    ["SST", "System suitability test", "PDA / DAD", "Photodiode-array detector"],
    ["RRT / RRF", "Relative retention time / response factor", "MS", "Mass spectrometry"],
    ["OOS / OOT", "Out of specification / trend", "DoE", "Design of experiments"],
    ["ANOVA", "Analysis of variance", "TOST", "Two one-sided tests"],
    ["CU", "Content uniformity", "KF", "Karl Fischer"],
    ["API", "Active pharmaceutical ingredient", "RS", "Reference standard"],
  ],
  { ltr: [1, 3] },
)}
`;
