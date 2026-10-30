import { bi, type Bi } from "@/i18n/bi";

/*
 * Fillable GMP forms that go with the SOP library. Each form is exported as a
 * Word (.docx) document or printed to PDF with the user's company name and logo.
 */

export type FormField =
  | { id: string; label: Bi; type: "text" | "date" }
  | { id: string; label: Bi; type: "textarea" }
  | { id: string; label: Bi; type: "select" | "multi"; options: Bi[] }
  | { id: string; label: Bi; type: "check"; items: Bi[] }
  | { id: string; label: Bi; type: "table"; columns: Bi[]; rows: number };

export type QaForm = {
  code: string;
  sop: string;
  title: Bi;
  purpose: Bi;
  sections: { title: Bi; fields: FormField[] }[];
  signatures: Bi[];
};

const yesNo = [bi("Yes", "بله"), bi("No", "خیر")];

export const qaForms: QaForm[] = [
  {
    code: "F-QA-006-01",
    sop: "QA-006",
    title: bi("Deviation report", "گزارش انحراف (Deviation report)"),
    purpose: bi("Record, classify, investigate and close a deviation from an approved procedure or specification.", "ثبت، طبقه‌بندی، بررسی و بستن انحراف از دستورالعمل یا مشخصات تأییدشده."),
    sections: [
      {
        title: bi("Identification", "مشخصات انحراف"),
        fields: [
          { id: "no", label: bi("Deviation number", "شماره انحراف"), type: "text" },
          { id: "occurred", label: bi("Date and time of occurrence", "تاریخ و زمان وقوع"), type: "text" },
          { id: "reported", label: bi("Date reported", "تاریخ گزارش"), type: "date" },
          { id: "dept", label: bi("Department / area", "واحد / محل"), type: "text" },
          { id: "product", label: bi("Product or material", "محصول یا ماده"), type: "text" },
          { id: "batch", label: bi("Batch / lot number(s)", "شماره بچ یا لات"), type: "text" },
          { id: "equipment", label: bi("Equipment / system ID", "شناسه تجهیز یا سیستم"), type: "text" },
          { id: "type", label: bi("Type", "نوع"), type: "select", options: [bi("Unplanned", "برنامه‌ریزی‌نشده"), bi("Planned (temporary)", "برنامه‌ریزی‌شده (موقت)")] },
        ],
      },
      {
        title: bi("Description and immediate action", "شرح رویداد و اقدام فوری"),
        fields: [
          { id: "description", label: bi("What happened (what, where, when, how detected)", "شرح رویداد (چه چیزی، کجا، چه زمانی، چگونه شناسایی شد)"), type: "textarea" },
          { id: "containment", label: bi("Immediate correction and containment (hold, segregation)", "اصلاح فوری و مهار (Hold، جداسازی)"), type: "textarea" },
        ],
      },
      {
        title: bi("Classification and impact assessment", "طبقه‌بندی و ارزیابی اثر"),
        fields: [
          { id: "class", label: bi("Classification", "طبقه‌بندی"), type: "select", options: [bi("Critical", "Critical (بحرانی)"), bi("Major", "Major (عمده)"), bi("Minor", "Minor (جزئی)")] },
          {
            id: "impact",
            label: bi("Possible impact on", "اثر احتمالی بر"),
            type: "multi",
            options: [
              bi("Product quality / patient safety", "کیفیت محصول / ایمنی بیمار"),
              bi("Other batches or products", "سایر بچ‌ها یا محصولات"),
              bi("Validated state (process, cleaning, equipment)", "وضعیت Validated (فرایند، نظافت، تجهیزات)"),
              bi("Marketing authorisation / regulatory filing", "پروانه محصول / پرونده ثبت"),
              bi("Stability programme", "برنامه پایداری"),
              bi("Data integrity", "یکپارچگی داده"),
            ],
          },
          { id: "impactText", label: bi("Impact assessment", "شرح ارزیابی اثر"), type: "textarea" },
        ],
      },
      {
        title: bi("Investigation", "بررسی علت ریشه‌ای"),
        fields: [
          { id: "tool", label: bi("Tool used", "ابزار به‌کاررفته"), type: "multi", options: [bi("5 Whys", "5 Whys"), bi("Ishikawa (6M)", "Ishikawa (6M)"), bi("Is / Is not", "Is / Is not"), bi("Fault tree analysis", "Fault tree analysis"), bi("Change analysis", "Change analysis")] },
          { id: "rootCause", label: bi("Root cause", "علت ریشه‌ای"), type: "textarea" },
          { id: "capa", label: bi("CAPA reference number(s)", "شماره CAPA مرتبط"), type: "text" },
        ],
      },
      {
        title: bi("Batch disposition and closure", "تصمیم درباره بچ و بستن انحراف"),
        fields: [
          { id: "disposition", label: bi("Batch disposition", "تصمیم درباره بچ"), type: "select", options: [bi("Release", "آزادسازی"), bi("Reject", "رد"), bi("Reprocess / rework", "بازفراوری"), bi("Pending further data", "منوط به داده بیشتر")] },
          { id: "justification", label: bi("Justification", "توجیه"), type: "textarea" },
          { id: "closed", label: bi("Closure date", "تاریخ بستن"), type: "date" },
        ],
      },
    ],
    signatures: [bi("Reported by", "گزارش‌دهنده"), bi("Head of department", "مدیر واحد"), bi("QA reviewer", "بازبین تضمین کیفیت"), bi("Head of QA", "مدیر تضمین کیفیت")],
  },
  {
    code: "F-QA-005-01",
    sop: "QA-005",
    title: bi("Change control request", "درخواست کنترل تغییر (Change control)"),
    purpose: bi("Propose, assess and approve a change before it is implemented, including its regulatory impact.", "پیشنهاد، ارزیابی و تأیید تغییر پیش از اجرا، از جمله اثر رگولاتوری آن."),
    sections: [
      {
        title: bi("Request", "درخواست"),
        fields: [
          { id: "no", label: bi("Change control number", "شماره کنترل تغییر"), type: "text" },
          { id: "date", label: bi("Date", "تاریخ"), type: "date" },
          { id: "requester", label: bi("Requested by / department", "درخواست‌کننده / واحد"), type: "text" },
          { id: "kind", label: bi("Type", "نوع تغییر"), type: "select", options: [bi("Permanent", "دائم"), bi("Temporary", "موقت")] },
          {
            id: "category",
            label: bi("Category", "دسته تغییر"),
            type: "multi",
            options: [
              bi("Facility / utilities", "ساختمان / سیستم‌های پشتیبانی"),
              bi("Equipment", "تجهیزات"),
              bi("Manufacturing process", "فرایند ساخت"),
              bi("Starting material / supplier", "ماده اولیه / تأمین‌کننده"),
              bi("Analytical method / specification", "روش آنالیز / مشخصات"),
              bi("Packaging / labelling", "بسته‌بندی / برچسب"),
              bi("Computerised system", "سیستم رایانه‌ای"),
              bi("Document / SOP", "مستند / SOP"),
            ],
          },
          { id: "products", label: bi("Products / batches affected", "محصولات / بچ‌های متأثر"), type: "text" },
        ],
      },
      {
        title: bi("Description", "شرح تغییر"),
        fields: [
          { id: "current", label: bi("Current state", "وضعیت فعلی"), type: "textarea" },
          { id: "proposed", label: bi("Proposed change", "تغییر پیشنهادی"), type: "textarea" },
          { id: "reason", label: bi("Reason and justification", "دلیل و توجیه"), type: "textarea" },
        ],
      },
      {
        title: bi("Impact assessment", "ارزیابی اثر"),
        fields: [
          {
            id: "impact",
            label: bi("Assessment", "ارزیابی"),
            type: "check",
            items: [
              bi("Product quality (CQAs)", "کیفیت محصول (CQAها)"),
              bi("Validation / qualification needed", "نیاز به Validation / Qualification"),
              bi("Stability data needed", "نیاز به داده پایداری"),
              bi("Cleaning validation affected", "اثر بر Cleaning validation"),
              bi("Documents / SOPs to update", "مستندات / SOPهای نیازمند به‌روزرسانی"),
              bi("Training needed", "نیاز به آموزش"),
              bi("Supplier / customer notification", "اطلاع به تأمین‌کننده / مشتری"),
            ],
          },
          { id: "regulatory", label: bi("Regulatory impact", "اثر رگولاتوری"), type: "select", options: [bi("None", "ندارد"), bi("Notification", "نیاز به اطلاع‌رسانی"), bi("Prior approval", "نیاز به تأیید قبلی")] },
          { id: "risk", label: bi("Risk classification", "طبقه‌بندی ریسک"), type: "select", options: [bi("Major", "Major (عمده)"), bi("Minor", "Minor (جزئی)")] },
        ],
      },
      {
        title: bi("Action plan", "برنامه اجرا"),
        fields: [
          { id: "actions", label: bi("Actions", "اقدامات"), type: "table", columns: [bi("Action", "اقدام"), bi("Owner", "مسئول"), bi("Due date", "سررسید"), bi("Done", "انجام شد")], rows: 4 },
          { id: "effectiveness", label: bi("Post-implementation review / effectiveness", "بازبینی پس از اجرا / اثربخشی"), type: "textarea" },
        ],
      },
    ],
    signatures: [bi("Requested by", "درخواست‌کننده"), bi("Head of department", "مدیر واحد"), bi("Head of QC", "مدیر کنترل کیفیت"), bi("Head of QA", "مدیر تضمین کیفیت")],
  },
  {
    code: "F-QA-007-01",
    sop: "QA-007",
    title: bi("CAPA plan and effectiveness check", "برنامه CAPA و بررسی اثربخشی"),
    purpose: bi("Define corrective and preventive actions against a root cause and verify that they worked.", "تعریف اقدامات اصلاحی و پیشگیرانه در برابر علت ریشه‌ای و تأیید اثربخشی آن‌ها."),
    sections: [
      {
        title: bi("Source", "منشأ"),
        fields: [
          { id: "no", label: bi("CAPA number", "شماره CAPA"), type: "text" },
          { id: "date", label: bi("Date opened", "تاریخ ایجاد"), type: "date" },
          { id: "source", label: bi("Source", "منشأ"), type: "select", options: [bi("Deviation", "انحراف"), bi("OOS / OOT", "OOS / OOT"), bi("Complaint", "شکایت"), bi("Internal audit", "ممیزی داخلی"), bi("Regulatory inspection", "بازرسی رگولاتوری"), bi("PQR / trend", "PQR / روند"), bi("Other", "سایر")] },
          { id: "ref", label: bi("Source reference number", "شماره مرجع"), type: "text" },
        ],
      },
      {
        title: bi("Problem and root cause", "مسئله و علت ریشه‌ای"),
        fields: [
          { id: "problem", label: bi("Problem statement", "شرح مسئله"), type: "textarea" },
          { id: "rootCause", label: bi("Root cause", "علت ریشه‌ای"), type: "textarea" },
        ],
      },
      {
        title: bi("Actions", "اقدامات"),
        fields: [
          { id: "correction", label: bi("Correction (immediate fix)", "Correction (اصلاح فوری)"), type: "textarea" },
          { id: "corrective", label: bi("Corrective actions", "Corrective actions"), type: "table", columns: [bi("Action", "اقدام"), bi("Owner", "مسئول"), bi("Due date", "سررسید")], rows: 3 },
          { id: "preventive", label: bi("Preventive actions", "Preventive actions"), type: "table", columns: [bi("Action", "اقدام"), bi("Owner", "مسئول"), bi("Due date", "سررسید")], rows: 3 },
        ],
      },
      {
        title: bi("Effectiveness check", "بررسی اثربخشی"),
        fields: [
          { id: "criterion", label: bi("Measurable criterion and period", "معیار قابل اندازه‌گیری و دوره بررسی"), type: "textarea" },
          { id: "checkDate", label: bi("Check date", "تاریخ بررسی"), type: "date" },
          { id: "result", label: bi("Result", "نتیجه"), type: "select", options: [bi("Effective", "اثربخش"), bi("Not effective — new CAPA opened", "غیراثربخش — CAPA جدید باز شد")] },
          { id: "closed", label: bi("Closure date", "تاریخ بستن"), type: "date" },
        ],
      },
    ],
    signatures: [bi("CAPA owner", "مسئول CAPA"), bi("Head of department", "مدیر واحد"), bi("Head of QA", "مدیر تضمین کیفیت")],
  },
  {
    code: "F-QC-008-01",
    sop: "QC-008",
    title: bi("OOS result — Phase I laboratory investigation", "نتیجه OOS — بررسی آزمایشگاهی مرحله اول"),
    purpose: bi("Check for an assignable laboratory error before any retest, as required by FDA OOS guidance (2022) and EU GMP Chapter 6.", "بررسی خطای آزمایشگاهی قابل انتساب پیش از هر آزمون مجدد، طبق راهنمای OOS سازمان FDA (2022) و فصل 6 EU GMP."),
    sections: [
      {
        title: bi("Result", "نتیجه"),
        fields: [
          { id: "no", label: bi("OOS number", "شماره OOS"), type: "text" },
          { id: "product", label: bi("Product / material", "محصول / ماده"), type: "text" },
          { id: "batch", label: bi("Batch / lot", "بچ / لات"), type: "text" },
          { id: "test", label: bi("Test and method (version)", "آزمون و روش (نسخه)"), type: "text" },
          { id: "spec", label: bi("Specification", "حد مشخصات"), type: "text" },
          { id: "result", label: bi("Result obtained", "نتیجه به‌دست‌آمده"), type: "text" },
          { id: "analyst", label: bi("Analyst / date", "آنالیست / تاریخ"), type: "text" },
          { id: "instrument", label: bi("Instrument ID", "شناسه دستگاه"), type: "text" },
        ],
      },
      {
        title: bi("Phase I checklist (analyst and supervisor)", "چک‌لیست مرحله اول (آنالیست و سرپرست)"),
        fields: [
          {
            id: "checklist",
            label: bi("Laboratory checks", "کنترل‌های آزمایشگاهی"),
            type: "check",
            items: [
              bi("Correct, current method version used", "روش صحیح و نسخه جاری استفاده شده است"),
              bi("System suitability met", "System suitability منطبق بوده است"),
              bi("Calculations and dilution factors verified", "محاسبات و ضرایب رقت تأیید شده است"),
              bi("Reference standards and reagents valid", "استانداردهای مرجع و معرف‌ها معتبر بوده‌اند"),
              bi("Instrument calibrated and qualified", "دستگاه کالیبره و Qualify‌شده بوده است"),
              bi("Sample identity and integrity confirmed", "هویت و سلامت نمونه تأیید شده است"),
              bi("Sample preparation followed the method", "آماده‌سازی نمونه طبق روش انجام شده است"),
              bi("Glassware and volumetric devices correct", "ظروف شیشه‌ای و حجمی صحیح بوده‌اند"),
              bi("Integration and audit trail reviewed", "Integration و Audit trail بازبینی شده است"),
              bi("Analyst trained for the method", "آنالیست برای روش آموزش دیده است"),
              bi("Retained solutions re-analysed (if permitted)", "محلول‌های نگه‌داشته‌شده دوباره آنالیز شده است (در صورت مجاز بودن)"),
            ],
          },
        ],
      },
      {
        title: bi("Conclusion", "نتیجه‌گیری"),
        fields: [
          { id: "assignable", label: bi("Assignable laboratory cause found?", "علت آزمایشگاهی قابل انتساب یافت شد؟"), type: "select", options: yesNo },
          { id: "conclusion", label: bi("Description of the cause or of the checks", "شرح علت یا کنترل‌های انجام‌شده"), type: "textarea" },
          { id: "next", label: bi("Next step", "اقدام بعدی"), type: "select", options: [bi("Result invalidated — repeat per method", "ابطال نتیجه — تکرار آزمون طبق روش"), bi("No lab error — proceed to Phase II (full-scale investigation)", "خطای آزمایشگاهی ندارد — ورود به مرحله دوم (بررسی کامل)")] },
        ],
      },
    ],
    signatures: [bi("Analyst", "آنالیست"), bi("Laboratory supervisor", "سرپرست آزمایشگاه"), bi("QA", "تضمین کیفیت")],
  },
  {
    code: "F-QA-024-01",
    sop: "QA-024",
    title: bi("Line clearance checklist", "چک‌لیست Line clearance"),
    purpose: bi("Confirm that the line or room is free of materials, documents and products of the previous batch before the next one starts.", "تأیید عاری بودن خط یا اتاق از مواد، مستندات و محصولات بچ قبلی پیش از شروع بچ بعدی."),
    sections: [
      {
        title: bi("Line and batches", "خط و بچ‌ها"),
        fields: [
          { id: "line", label: bi("Line / room", "خط / اتاق"), type: "text" },
          { id: "stage", label: bi("Stage", "مرحله"), type: "select", options: [bi("Dispensing", "توزین"), bi("Granulation / blending", "گرانولاسیون / مخلوط‌سازی"), bi("Compression / encapsulation", "پرس / پرکردن کپسول"), bi("Coating", "پوشش‌دهی"), bi("Primary packaging", "بسته‌بندی اولیه"), bi("Secondary packaging", "بسته‌بندی ثانویه")] },
          { id: "prev", label: bi("Previous product / batch", "محصول / بچ قبلی"), type: "text" },
          { id: "next", label: bi("Next product / batch", "محصول / بچ بعدی"), type: "text" },
          { id: "date", label: bi("Date and time", "تاریخ و ساعت"), type: "text" },
        ],
      },
      {
        title: bi("Checks", "کنترل‌ها"),
        fields: [
          {
            id: "checks",
            label: bi("Line clearance", "Line clearance"),
            type: "check",
            items: [
              bi("All materials and products of the previous batch removed", "همه مواد و محصولات بچ قبلی خارج شده است"),
              bi("All labels, printed packaging and leaflets removed", "همه برچسب‌ها، مواد بسته‌بندی چاپی و بروشورها خارج شده است"),
              bi("Documents of the previous batch removed", "مستندات بچ قبلی خارج شده است"),
              bi("Equipment cleaned, with 'clean' status label in date", "تجهیزات تمیز شده و برچسب وضعیت «تمیز» معتبر دارد"),
              bi("Room, floor and drains clean; waste removed", "اتاق، کف و کفشورها تمیز و پسماندها خارج شده است"),
              bi("Temperature, humidity and pressure differential within limits", "دما، رطوبت و اختلاف فشار در محدوده است"),
              bi("Balances and instruments checked and in calibration", "ترازوها و ابزارها کنترل شده و در وضعیت کالیبره هستند"),
              bi("Coding and printing set to the new batch data and verified", "کدزنی و چاپ با اطلاعات بچ جدید تنظیم و تأیید شده است"),
              bi("Rejected and reconciled materials removed and recorded", "مواد مردود و تطبیق‌داده‌شده خارج و ثبت شده است"),
            ],
          },
          { id: "remarks", label: bi("Remarks", "ملاحظات"), type: "textarea" },
        ],
      },
    ],
    signatures: [bi("Production operator", "اپراتور تولید"), bi("Production supervisor", "سرپرست تولید"), bi("IPQA", "IPQA")],
  },
];

export const formsCopy = {
  title: bi("GMP form generator", "فرم‌ساز GMP"),
  lead: bi(
    "Standard forms of the SOP library: fill them in, add your company name and logo, then download a Word (.docx) file or print to PDF.",
    "فرم‌های استاندارد کتابخانه SOP: فرم را پر کنید، نام و لوگوی شرکت را اضافه کنید و فایل Word (.docx) دریافت کنید یا PDF چاپ کنید.",
  ),
  back: bi("Quality Assurance", "تضمین کیفیت"),
  choose: bi("Form", "فرم"),
  sop: bi("Related SOP", "SOP مرتبط"),
  company: bi("Company name", "نام شرکت"),
  logo: bi("Company logo (optional)", "لوگوی شرکت (اختیاری)"),
  removeLogo: bi("Remove logo", "حذف لوگو"),
  docNo: bi("Form code", "کد فرم"),
  rev: bi("Revision", "شماره بازنگری"),
  effective: bi("Effective date", "تاریخ اجرا"),
  header: bi("Document header", "سربرگ سند"),
  fill: bi("Fill in", "تکمیل فرم"),
  preview: bi("Preview", "پیش‌نمایش"),
  word: bi("Download Word (.docx)", "دانلود Word (.docx)"),
  print: bi("Print / save as PDF", "چاپ / ذخیره PDF"),
  reset: bi("Clear form", "پاک کردن فرم"),
  addRow: bi("Add row", "افزودن ردیف"),
  yes: bi("Yes", "بله"),
  no: bi("No", "خیر"),
  na: bi("N/A", "N/A"),
  item: bi("Item", "مورد"),
  resultCol: bi("Result", "نتیجه"),
  name: bi("Name", "نام"),
  signature: bi("Signature", "امضا"),
  date: bi("Date", "تاریخ"),
  role: bi("Role", "سمت"),
  page: bi("Page", "صفحه"),
  saved: bi("Your entries are kept in this browser only.", "اطلاعات واردشده فقط در همین مرورگر نگهداری می‌شود."),
  lockedTitle: bi("For subscribers", "ویژه مشترکان"),
  lockedText: bi(
    "You can fill in and preview every form. Downloading the Word file and printing are for subscribers to the QA or QC section.",
    "تکمیل و پیش‌نمایش همه فرم‌ها آزاد است. دریافت فایل Word و چاپ برای مشترکان بخش تضمین کیفیت یا کنترل کیفیت است.",
  ),
  buy: bi("Get a subscription", "تهیه اشتراک"),
  close: bi("Close", "بستن"),
  card: bi("Fill in the standard GMP forms (deviation, change control, CAPA, OOS, line clearance) and download them as Word or PDF with your company's logo.", "فرم‌های استاندارد GMP (انحراف، کنترل تغییر، CAPA، OOS، Line clearance) را پر کنید و با لوگوی شرکت خود به‌صورت Word یا PDF دریافت کنید."),
};
