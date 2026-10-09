import { bi } from "@/i18n/bi";

/** Header copy and fixed labels for each section page, as in the design. */
export const pages = {
  handbooks: {
    eyebrow: bi("Handbooks", "هندبوک‌ها"),
    title: bi("Handbook library", "کتابخانه هندبوک‌ها"),
    lead: bi(
      "The planned titles and what each one covers. Open a title to see its chapters. Any of them can also be ordered in a version written for one company.",
      "عنوان‌های برنامه‌ریزی‌شده و سرفصل هر کدام. برای دیدن فصل‌ها روی عنوان بزنید. هر عنوان را می‌توان به‌صورت اختصاصی برای یک شرکت هم سفارش داد.",
    ),
  },
  suppliers: {
    eyebrow: bi("Supplier Database", "بانک تأمین‌کنندگان"),
    title: bi("Supplier Database", "بانک تأمین‌کنندگان"),
    lead: bi(
      "Iranian manufacturers and suppliers of pharmaceutical, vitamin, mineral and cosmetic raw materials, searchable by material.",
      "تولیدکنندگان و تأمین‌کنندگان ایرانی مواد اولیه دارویی، ویتامینی، معدنی و آرایشی، قابل جستجو بر اساس ماده.",
    ),
    hold: bi(
      "The existing supplier bank is placed in this section and matched to this design.",
      "بانک تأمین‌کنندگان موجود در این بخش قرار می‌گیرد و با همین ظاهر یکی می‌شود.",
    ),
  },
  excipients: {
    eyebrow: bi("Excipient Database", "بانک اکسیپیان"),
    title: bi("Excipient Database", "بانک اکسیپیان"),
    lead: bi(
      "Excipients with function, dosage form and, where a common range exists, typical use level. Search by English, Persian or trade name or by CAS number, or filter the list.",
      "اکسیپیان‌ها با نقش، شکل دارویی و محدوده مصرف معمول (هر جا محدوده رایجی وجود دارد). با نام انگلیسی، فارسی یا تجاری یا با شماره CAS جستجو کنید، یا فهرست را فیلتر کنید.",
    ),
    fn: bi("Function", "نقش"),
    form: bi("Dosage form", "شکل دارویی"),
    useLevel: bi("Typical use level", "محدوده مصرف معمول"),
    allFunctions: bi("All functions", "همه نقش‌ها"),
    allForms: bi("All dosage forms", "همه اشکال دارویی"),
    note: bi(
      "Ranges are starting guidance and must be confirmed for each formula against a reference and by experiment. q.s. means as much as needed.",
      "محدوده‌ها راهنمای شروع کار هستند و باید برای هر فرمول با مرجع و آزمایش تأیید شوند. q.s. یعنی به مقدار لازم.",
    ),
  },
  materials: {
    eyebrow: bi("Raw Material Database", "بانک مواد اولیه"),
    title: bi("Raw Material Database", "بانک مواد اولیه"),
    lead: bi(
      "A starter set of active ingredients, vitamins and minerals with CAS number, molecular weight and one handling point each.",
      "مجموعه اولیه‌ای از مواد مؤثره، ویتامین‌ها و مواد معدنی با شماره CAS، وزن مولکولی و یک نکته کاربردی برای هر ماده.",
    ),
    group: bi("Group", "گروه"),
    allGroups: bi("All groups", "همه گروه‌ها"),
    mw: bi("Mol. weight", "وزن مولکولی"),
    keyPoint: bi("Key point", "نکته"),
  },
  tools: {
    eyebrow: bi("Tools", "ابزارها"),
    title: bi("Pharmaceutical calculators", "ماشین‌حساب‌های دارویی"),
    lead: bi(
      "Eight calculators that work right here. Change a value and the result updates at once.",
      "هشت ماشین‌حساب که همین‌جا کار می‌کنند. مقادیر را عوض کنید تا نتیجه همان لحظه حساب شود.",
    ),
  },
  formulation: {
    eyebrow: bi("Formulation Tools", "ابزار فرمولاسیون"),
    title: bi("Starting formula builder", "سازنده فرمول پایه"),
    lead: bi(
      "Pick a dosage form to load a typical starting composition. Edit the percentages, and the q.s. component and batch quantities follow.",
      "یک شکل دارویی انتخاب کنید تا ترکیب پایه معمول آن بیاید. درصدها را عوض کنید؛ جزء q.s. و مقادیر بچ خودشان حساب می‌شوند.",
    ),
    form: bi("Dosage form", "شکل دارویی"),
    batch: bi("Batch size (kg)", "اندازه بچ (کیلوگرم)"),
    fn: bi("Function", "نقش"),
    material: bi("Example material", "نمونه ماده"),
    kg: bi("kg per batch", "kg در بچ"),
    over: bi("The components add up to more than 100%.", "مجموع اجزا از 100% بیشتر است."),
    note: bi(
      "These compositions are starting points, not validated formulas. Compatibility, stability and performance must be tested for each product.",
      "این ترکیب‌ها نقطه شروع هستند، نه فرمول تأییدشده. سازگاری، پایداری و عملکرد باید برای هر محصول آزمایش شود.",
    ),
  },
  regulatory: {
    eyebrow: bi("Regulatory Resources", "منابع رگولاتوری"),
    title: bi("Regulatory reference", "مرجع رگولاتوری"),
    lead: bi(
      "The CTD structure, the ICH guidelines used most in quality work, and the ICH Q1A stability conditions.",
      "ساختار CTD، راهنماهای ICH پرکاربرد در کار کیفیت، و شرایط پایداری ICH Q1A.",
    ),
    ctd: bi("CTD structure", "ساختار CTD"),
    ich: bi("ICH guidelines", "راهنماهای ICH"),
    code: bi("Code", "کد"),
    subject: bi("Subject", "موضوع"),
    stability: bi("Stability study conditions (ICH Q1A, general case)", "شرایط مطالعه پایداری (ICH Q1A، حالت کلی)"),
    study: bi("Study", "مطالعه"),
    storage: bi("Storage condition", "شرایط نگهداری"),
    minData: bi("Minimum data at submission", "حداقل داده هنگام ثبت"),
    stabilityRows: [
      { study: bi("Long-term", "بلندمدت"), condition: "25 °C ± 2 °C / 60% RH ± 5%  |  30 °C ± 2 °C / 65% RH ± 5%", data: bi("12 months", "12 ماه") },
      { study: bi("Intermediate", "میانی"), condition: "30 °C ± 2 °C / 65% RH ± 5%", data: bi("6 months", "6 ماه") },
      { study: bi("Accelerated", "تسریع‌شده"), condition: "40 °C ± 2 °C / 75% RH ± 5%", data: bi("6 months", "6 ماه") },
    ],
  },
  qa: {
    eyebrow: bi("Quality Assurance", "تضمین کیفیت"),
    title: bi("SOP library", "کتابخانه SOP"),
    lead: bi(
      "The master list of procedures a pharmaceutical site needs, by department. Each row gives the SOP title and what it has to cover.",
      "فهرست جامع دستورالعمل‌هایی که یک کارخانه داروسازی لازم دارد، به تفکیک واحد. هر ردیف عنوان SOP و مواردی را که باید پوشش بدهد نشان می‌دهد.",
    ),
    ready: bi(
      "The full text of all 136 SOPs is ready (in Persian): press “Full text” on a row.",
      "متن کامل هر 136 دستورالعمل آماده است: روی «متن کامل» در هر ردیف بزنید.",
    ),
    department: bi("Department", "واحد"),
    allDepartments: bi("All departments", "همه واحدها"),
    code: bi("Code", "کد"),
    sopTitle: bi("SOP title", "عنوان SOP"),
    covers: bi("What it covers", "موارد تحت پوشش"),
    fullText: bi("Full text", "متن کامل"),
    sops: bi("SOPs", "دستورالعمل"),
    codesNote: bi(
      "Codes are suggestions; each company can apply its own numbering system.",
      "کدها پیشنهادی‌اند و هر شرکت می‌تواند سیستم شماره‌گذاری خودش را به کار ببرد.",
    ),
    template: bi("Standard SOP template", "قالب استاندارد SOP"),
    templateHead: bi(
      "Header: title, code, revision number, effective date, next review date, prepared by, reviewed by and approved by (QA).",
      "سربرگ: عنوان، کد، شماره بازنگری، تاریخ اجرا، تاریخ بازنگری بعدی، تهیه‌کننده، بازبین و تأییدکننده (تضمین کیفیت).",
    ),
    templateItems: [
      bi("Purpose", "هدف"),
      bi("Scope", "دامنه کاربرد"),
      bi("Responsibilities", "مسئولیت‌ها"),
      bi("Definitions and abbreviations", "تعاریف و اختصارات"),
      bi("Materials and equipment", "مواد و تجهیزات"),
      bi("Procedure", "روش اجرا"),
      bi("Records and forms", "سوابق و فرم‌ها"),
      bi("References", "مراجع"),
      bi("Revision history", "تاریخچه بازنگری"),
    ],
    backToList: bi("SOP library", "کتابخانه SOP"),
    inPersian: bi("The full text of this SOP is written in Persian.", "متن کامل این دستورالعمل به فارسی است."),
    copy: bi("Copy text", "کپی متن"),
    copied: bi("Copied", "کپی شد"),
  },
};
