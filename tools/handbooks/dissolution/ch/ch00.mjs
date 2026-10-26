import { chapter, h2, p, box, table, m } from "../lib.mjs";

export default () => `
${chapter("پیشگفتار", "درباره این هندبوک", "About this handbook", "پیشگفتار — درباره این هندبوک")}
${p(
  "آزمون انحلال (Dissolution) تنها آزمون کنترل کیفیت است که به‌طور مستقیم رفتار آزادسازی ماده مؤثره از شکل دارویی جامد را اندازه می‌گیرد. همین ویژگی آن را به ابزاری چندمنظوره تبدیل کرده است: در واحد کنترل کیفیت برای Release بچ و مطالعات Stability، در واحد تحقیق و توسعه برای انتخاب فرمولاسیون و پایش اثر تغییرات فرایند، و در پرونده ثبت برای اثبات مشابهت با فرآورده مرجع، پشتیبانی از Biowaiver و ارزیابی تغییرات پس از تأیید (SUPAC). در عین حال، آزمون انحلال یکی از پرنوسان‌ترین آزمون‌های آزمایشگاه است؛ کوچک‌ترین انحراف در هندسه دستگاه، گاز محلول در Medium، موقعیت قرص یا روش نمونه‌برداری می‌تواند نتیجه را چندین درصد جابه‌جا کند و به نتیجه OOS بینجامد.",
  "این هندبوک برای تسلط کاربردی کارشناسان بر آزمون انحلال تدوین شده است؛ از مبانی فیزیکوشیمیایی انحلال و نقش Solubility و طبقه‌بندی BCS، تا Apparatusهای فارماکوپه‌ای، Mechanical qualification و Performance verification test، انتخاب و آماده‌سازی Dissolution medium، توسعه روش Discriminating و Validation آن، معیارهای پذیرش فرآورده‌های Immediate-release، Extended-release و Delayed-release، و مقایسه پروفایل با f2. بخش پایانی به Troubleshooting سیستماتیک، ده مطالعه موردی و مسائل محاسباتی حل‌شده اختصاص دارد. محتوا بر پایه فصل‌های عمومی <b>USP</b> (به‌ویژه &lt;711&gt;، &lt;1092&gt; و &lt;1094&gt;)، <b>Ph. Eur.</b> 2.9.3، رهنمودهای <b>FDA</b>، <b>EMA</b> و <b>ICH M9</b> و منابع مرجع بیوفارماسی بازنویسی شده است.",
)}
${p(
  "ساختار هندبوک: فصل 1 مبانی انحلال؛ فصل 2 Apparatusها؛ فصل 3 Qualification و نگهداری دستگاه؛ فصل 4 Dissolution medium؛ فصل 5 توسعه و Validation روش؛ فصل 6 معیارهای پذیرش و مراحل آزمون؛ فصل 7 مقایسه پروفایل، Biowaiver و IVIVC؛ فصل 8 Troubleshooting سیستماتیک؛ فصل 9 مطالعات موردی؛ فصل 10 مسائل محاسباتی حل‌شده. پیوست‌ها شامل جدول Troubleshooting سریع، پرسش‌های ارزیابی، واژه‌نامه و رفرنس‌هاست.",
)}
${box(
  "ref",
  "کادرهای طلایی",
  p("کادرهای طلایی‌رنگ خلاصه‌ای بازنویسی‌شده از دیدگاه‌ها و مفاهیم کلیدی کتاب‌ها، مقالات و متون رسمی مرجع است و منبع هر کادر در انتهای آن ذکر شده است. این کادرها نقل‌قول مستقیم نیستند؛ برای مطالعه متن کامل به منبع اصلی (پیوست د) مراجعه شود."),
)}
${box(
  "key",
  "اعتبار الزامات رسمی",
  p("الزامات فارماکوپه و رهنمودها به‌طور دوره‌ای بازنگری می‌شوند. خلاصه‌های این هندبوک برای درک مفهومی و مرور سریع است؛ در هر تصمیم مستند (انطباق، تغییر روش، پذیرش نتیجه) <b>متن نسخه جاری</b> فارماکوپه یا رهنمود مربوط و SOPهای داخلی سازمان ملاک عمل است."),
)}
${h2("نمادها و اختصارها")}
${table(
  ["نماد", "کمیت", "واحد رایج", "توضیح"],
  [
    [m("Q"), "مقدار حل‌شده تعیین‌شده در مونوگراف", "% label claim", "معیار پذیرش در زمان مشخص"],
    [m("C<sub>s</sub>"), "Solubility (غلظت اشباع)", "mg/mL", "در دما و pH مشخص"],
    [m("C<sub>t</sub>"), "غلظت ماده حل‌شده در زمان t", "mg/mL", ""],
    [m("V"), "حجم Dissolution medium", "mL", "معمولاً 500 تا 1000"],
    [m("D"), "ضریب نفوذ", "cm²/s", "در معادله Noyes–Whitney"],
    [m("h"), "ضخامت لایه مرزی (Diffusion layer)", "µm", "وابسته به هیدرودینامیک"],
    [m("A"), "سطح مؤثر ذرات", "cm²", "وابسته به Particle size"],
    [m("D<sub>0</sub>"), "Dose number", "بی‌بعد", m("D<sub>0</sub> = (Dose / 250 mL) / C<sub>s</sub>")],
    [m("f<sub>2</sub> , f<sub>1</sub>"), "Similarity / Difference factor", "بی‌بعد", "مقایسه دو پروفایل"],
    [m("CV"), "ضریب تغییرات", "%", m("CV = SD / mean × 100")],
    [m("MDT"), "Mean dissolution time", "min", "شاخص سرعت انحلال"],
    [m("rpm"), "سرعت چرخش Paddle یا Basket", "rpm", ""],
  ],
)}
${table(
  ["اختصار", "عبارت کامل", "اختصار", "عبارت کامل"],
  [
    ["IR / MR", "Immediate / Modified release", "BCS", "Biopharmaceutics Classification System"],
    ["ER / DR", "Extended / Delayed release", "IVIVC", "In vitro–in vivo correlation"],
    ["MQ", "Mechanical qualification", "SUPAC", "Scale-up and post-approval changes"],
    ["PVT", "Performance verification test", "SGF / SIF", "Simulated gastric / intestinal fluid"],
    ["RS", "Reference standard", "FaSSIF / FeSSIF", "Fasted / Fed state simulated intestinal fluid"],
    ["SLS", "Sodium lauryl sulfate", "OOS / OOT", "Out of specification / trend"],
    ["CTAB", "Cetyltrimethylammonium bromide", "RLD", "Reference listed drug"],
  ],
  { ltr: [1, 3] },
)}
`;
