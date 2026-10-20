import { bi, type Bi } from "@/i18n/bi";
import type { LegalPage } from "./legal";

/*
 * Pharmacopoeias, regulators and search databases, with the edition in force
 * and the latest published one. Reviewed October 2026 (Mehr 1405); update the
 * editions here when a new one is published or comes into force.
 */

const ltr = (s: string) => `⁦${s}⁩`;

export type RefLink = { label: string; url: string; note: Bi };
export type RefSection = {
  key: string;
  title: Bi;
  abbr: string;
  /** Short label for the home-page grid. */
  chip: string;
  /** Edition rows: what is in force now and what is already published. */
  editions?: { label: Bi; value: Bi }[];
  text: Bi;
  links: RefLink[];
};

export const referencesPage: LegalPage = {
  title: bi("Pharmaceutical references and pharmacopoeias", "رفرنس‌ها و فارماکوپه‌ها در داروسازی"),
  lead: bi(
    "The pharmacopoeias, regulatory agencies and drug-information databases used across the pharmaceutical industry — with the edition in force today, the latest edition already published, and a direct link to each official source.",
    "فارماکوپه‌ها، نهادهای رگولاتوری و پایگاه‌های اطلاعات دارویی مورد استناد در صنعت داروسازی — با ویرایش لازم‌الاجرای فعلی، آخرین ویرایش منتشرشده و لینک مستقیم به منبع رسمی هر رفرنس.",
  ),
  sections: [],
};

export const referencesReviewedOn = bi("Editions last reviewed: {month}.", "آخرین بازبینی ویرایش‌ها: {month}.");
export const referencesPaid = bi(
  "Links open the official site in a new tab. The full texts of USP–NF, BP, Ph. Eur. need a subscription; the others are free.",
  `لینک‌ها سایت رسمی را در زبانه جدید باز می‌کنند. متن کامل ${ltr("USP–NF")}، ${ltr("BP")} و ${ltr("Ph.\u00a0Eur.")} نیاز به اشتراک دارد؛ سایر موارد رایگان‌اند.`,
);
export const referenceLabels = {
  inForce: bi("In force", "لازم‌الاجرا"),
  latest: bi("Latest published", "آخرین ویرایش منتشرشده"),
  next: bi("Next", "بعدی"),
  links: bi("Official links", "لینک‌های رسمی"),
  nav: bi("References and pharmacopoeias", "رفرنس‌ها و فارماکوپه‌ها"),
  short: bi("References", "رفرنس‌ها"),
};

/** The searchable Orange Book at the top of the references page. */
export const referencesOrangeBook = {
  title: bi("Orange Book — search FDA-approved generic and brand products", "Orange Book — جستجوی داروهای ژنریک و برند تأییدشده FDA"),
  lead: bi(
    "The full FDA Orange Book (Approved Drug Products with Therapeutic Equivalence Evaluations), searchable here. Search by active ingredient or brand name to see every approved product of that ingredient — the reference listed drug and its generics — with strength, dosage form, applicant, application number and therapeutic-equivalence (TE) code. The data are refreshed every month from the FDA data files.",
    "نسخه کامل Orange Book سازمان غذا و دارو آمریکا (Approved Drug Products with Therapeutic Equivalence Evaluations) که همین‌جا قابل جستجوست. با جستجوی ماده مؤثره یا نام تجاری، همه فرآورده‌های تأییدشده آن ماده — داروی مرجع (RLD) و ژنریک‌های آن — را با قدرت، شکل دارویی، شرکت صاحب مجوز، شماره پرونده و کد هم‌ارزی درمانی (TE) مشاهده کنید. داده‌ها هر ماه از فایل‌های رسمی FDA به‌روز می‌شوند.",
  ),
  note: bi(
    "TE codes beginning with A are therapeutically equivalent to the reference product (e.g. AB: bioequivalence demonstrated); codes beginning with B are not considered equivalent; a blank code means there is no multisource comparison (single source or OTC monograph). RLD = reference listed drug, the product generics are compared with; RS = reference standard for bioequivalence studies.",
    "کدهای TE که با A شروع می‌شوند از نظر درمانی با فرآورده مرجع هم‌ارزند (مثلاً AB: هم‌ارزی زیستی اثبات‌شده)؛ کدهای B هم‌ارز محسوب نمی‌شوند؛ کد خالی یعنی مقایسه چندمنبعی وجود ندارد (تک‌منبع یا OTC). RLD = داروی مرجع که ژنریک‌ها با آن مقایسه می‌شوند؛ RS = استاندارد مرجع برای مطالعه هم‌ارزی زیستی.",
  ),
};

export const referenceSections: RefSection[] = [
  {
    key: "usp",
    title: bi("United States Pharmacopeia – National Formulary", "فارماکوپه آمریکا – فرمولاری ملی"),
    abbr: "USP–NF",
    chip: "USP–NF 2026",
    editions: [
      {
        label: referenceLabels.inForce,
        value: bi(
          "USP–NF 2026 — Issue 1 official 1 February 2026, Issue 2 on 1 April 2026, Issue 3 on 1 June 2026",
          `${ltr("USP–NF 2026")} — شماره 1 رسمی از 12 بهمن 1404، شماره 2 از 12 فروردین 1405، شماره 3 از 11 خرداد 1405`,
        ),
      },
      {
        label: referenceLabels.next,
        value: bi("USP–NF 2027 issues, official from 2027", `شماره‌های ${ltr("USP–NF 2027")}، رسمی از 2027`),
      },
    ],
    text: bi(
      "The legal standard for medicines in the United States. Since 2026 USP–NF Online publishes several issues a year and every chapter or monograph carries its own official date, so check the “official” date of the text you cite.",
      "استاندارد قانونی دارو در آمریکا. از 2026 نسخه آنلاین USP–NF چند شماره در سال منتشر می‌کند و هر فصل یا مونوگراف تاریخ رسمی‌شدن خاص خود را دارد؛ بنابراین تاریخ «رسمی از» متنی را که استناد می‌کنید بررسی کنید.",
    ),
    links: [
      { label: "USP–NF Online", url: "https://www.uspnf.com/", note: bi("Official texts (subscription)", "متن رسمی (با اشتراک)") },
      { label: "Publication schedule", url: "https://www.uspnf.com/publication-comment-schedule", note: bi("Publication and official dates", "تاریخ انتشار و رسمی شدن") },
      { label: "USP", url: "https://www.usp.org/", note: bi("Reference standards and news", "استانداردهای مرجع و اخبار") },
    ],
  },
  {
    key: "bp",
    title: bi("British Pharmacopoeia", "فارماکوپه بریتانیا"),
    abbr: "BP",
    chip: "BP 2026 · 2027",
    editions: [
      { label: referenceLabels.inForce, value: bi("BP 2026 — legally effective since 1 January 2026", `${ltr("BP 2026")} — لازم‌الاجرا از 11 دی 1404`) },
      {
        label: referenceLabels.latest,
        value: bi("BP 2027 — available since 1 August 2026, legally effective 1 January 2027", `${ltr("BP 2027")} — در دسترس از 10 مرداد 1405، لازم‌الاجرا از 11 دی 1405`),
      },
    ],
    text: bi(
      "Published each August by the MHRA and legally effective from the following 1 January; it reproduces every Ph. Eur. monograph alongside about 4,000 monographs of its own.",
      "هر سال در ماه اوت از سوی MHRA منتشر و از اول ژانویه سال بعد لازم‌الاجرا می‌شود؛ همه مونوگراف‌های فارماکوپه اروپا را هم در کنار حدود 4000 مونوگراف خود در بر دارد.",
    ),
    links: [
      { label: "BP 2026 online", url: "https://www.pharmacopoeia.com/", note: bi("Official texts — sign in with a subscription", "متن رسمی — ورود با اشتراک") },
      { label: "BP 2026 (print, TSO)", url: "https://tsoshop.co.uk/product/9780113231072/BP-2026-Print", note: bi("Official publisher: print and online licences", "ناشر رسمی: نسخه چاپی و اشتراک آنلاین") },
    ],
  },
  {
    key: "ep",
    title: bi("European Pharmacopoeia", "فارماکوپه اروپا"),
    abbr: "Ph. Eur.",
    chip: "Ph. Eur. 12.3 · 13.1",
    editions: [
      { label: referenceLabels.inForce, value: bi("12th Edition, Issue 12.3 — in force since 1 July 2026", `ویرایش 12، شماره ${ltr("12.3")} — لازم‌الاجرا از 10 تیر 1405`) },
      {
        label: referenceLabels.latest,
        value: bi("Issue 13.1 — published April 2026, in force 1 January 2027", `شماره ${ltr("13.1")} — منتشرشده در اردیبهشت 1405، لازم‌الاجرا از 11 دی 1405`),
      },
    ],
    text: bi(
      "Published by the EDQM (Council of Europe) as three issues a year on an online-only platform; from Issue 13.1 the gap between publication and implementation is nine months. The old pheur.edqm.eu site was retired in January 2026.",
      "از سوی EDQM (شورای اروپا) سالی سه شماره و فقط به‌صورت آنلاین منتشر می‌شود؛ از شماره 13.1 فاصله انتشار تا اجرا نه ماه است. سایت قدیمی pheur.edqm.eu در بهمن 1404 بسته شد.",
    ),
    links: [
      { label: "Ph. Eur. Online", url: "https://go.edqm.eu/PhEurOnline", note: bi("Official texts (subscription)", "متن رسمی (با اشتراک)") },
      { label: "EDQM", url: "https://www.edqm.eu/", note: bi("Reference standards, CEPs and news", "استانداردهای مرجع، CEP و اخبار") },
    ],
  },
  {
    key: "jp",
    title: bi("Japanese Pharmacopoeia", "فارماکوپه ژاپن"),
    abbr: "JP",
    chip: "JP 19",
    editions: [
      { label: referenceLabels.inForce, value: bi("JP 19th Edition (JP19) — in effect since 10 April 2026, 2,072 monographs", `ویرایش 19 ${ltr("(JP19)")} — لازم‌الاجرا از 21 فروردین 1405، 2072 مونوگراف`) },
      { label: referenceLabels.next, value: bi("English translation of JP19 — usually within a year of publication", "ترجمه انگلیسی JP19 — معمولاً تا یک سال پس از انتشار") },
    ],
    text: bi(
      "Issued by the Ministry of Health, Labour and Welfare; PMDA drafts the monographs. JP is harmonised with USP and Ph. Eur. through the Pharmacopoeial Discussion Group (PDG).",
      "از سوی وزارت بهداشت، کار و رفاه ژاپن منتشر می‌شود و PMDA مونوگراف‌ها را تدوین می‌کند. JP از طریق گروه هماهنگی فارماکوپه‌ها (PDG) با USP و فارماکوپه اروپا هماهنگ است.",
    ),
    links: [{ label: "PMDA – Japanese Pharmacopoeia", url: "https://www.pmda.go.jp/english/rs-sb-std/standards-development/jp/0013.html", note: bi("JP drafts and English texts", "پیش‌نویس‌ها و متن انگلیسی") }],
  },
  {
    key: "fda",
    title: bi("US Food and Drug Administration", "سازمان غذا و داروی آمریکا"),
    abbr: "FDA",
    chip: "FDA",
    text: bi(
      "Approvals, guidance documents, excipient levels in approved products and recommended dissolution methods.",
      "تأییدیه‌ها، گایدلاین‌ها، مقدار مواد جانبی در فرآورده‌های تأییدشده و روش‌های انحلال توصیه‌شده.",
    ),
    links: [
      { label: "FDA", url: "https://www.fda.gov/", note: bi("Home page", "صفحه اصلی") },
      { label: "Drugs@FDA", url: "https://www.accessdata.fda.gov/scripts/cder/daf/", note: bi("Approved drugs, labels and review documents", "داروهای تأییدشده، بروشور و مستندات بررسی") },
      { label: "Guidance documents", url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents", note: bi("Search all FDA guidances", "جستجوی همه گایدلاین‌های FDA") },
      { label: "Inactive Ingredient Database", url: "https://www.accessdata.fda.gov/scripts/cder/iig/", note: bi("Maximum excipient levels in approved products", "حداکثر مقدار مواد جانبی در فرآورده‌های تأییدشده") },
      { label: "Dissolution Methods Database", url: "https://www.accessdata.fda.gov/scripts/cder/dissolution/", note: bi("Recommended dissolution conditions", "شرایط انحلال توصیه‌شده") },
      { label: "Product-specific guidances", url: "https://www.fda.gov/drugs/guidances-drugs/product-specific-guidances-generic-drug-development", note: bi("Bioequivalence for generic products", "هم‌ارزی زیستی فرآورده‌های ژنریک") },
    ],
  },
  {
    key: "orange",
    title: bi("Orange Book", "Orange Book"),
    abbr: "Orange Book · Purple Book",
    chip: "Orange Book",
    text: bi(
      "FDA's list of approved drug products with therapeutic-equivalence (TE) codes, reference listed drugs, patents and exclusivities — the starting point for generic development. Biologics are in the Purple Book.",
      "فهرست FDA از فرآورده‌های تأییدشده با کد هم‌ارزی درمانی (TE)، داروی مرجع (RLD)، پتنت‌ها و انحصارها — نقطه شروع توسعه ژنریک. فرآورده‌های بیولوژیک در Purple Book آمده‌اند.",
    ),
    links: [
      { label: "Orange Book", url: "https://www.fda.gov/drugs/drug-approvals-and-databases/approved-drug-products-therapeutic-equivalence-evaluations-orange-book", note: bi("Search and data files (monthly)", "جستجو و فایل‌های داده (ماهانه)") },
      { label: "Purple Book", url: "https://purplebooksearch.fda.gov/", note: bi("Licensed biologics and biosimilars", "فرآورده‌های بیولوژیک و بیوسیمیلار") },
    ],
  },
  {
    key: "dailymed",
    title: bi("DailyMed", "DailyMed"),
    abbr: "DailyMed",
    chip: "DailyMed",
    text: bi(
      "The US National Library of Medicine's library of current package inserts (SPL): composition, inactive ingredients, storage and the full prescribing information, searchable by name, NDC or company.",
      "پایگاه کتابخانه ملی پزشکی آمریکا (NLM) برای بروشورهای جاری دارو (SPL): ترکیب، مواد جانبی، شرایط نگهداری و اطلاعات کامل تجویز، با جستجو بر اساس نام، کد NDC یا شرکت.",
    ),
    links: [{ label: "DailyMed", url: "https://dailymed.nlm.nih.gov/dailymed/", note: bi("Current labels (free)", "بروشورهای جاری (رایگان)") }],
  },
  {
    key: "ema",
    title: bi("European Medicines Agency", "آژانس دارویی اروپا"),
    abbr: "EMA",
    chip: "EMA",
    text: bi(
      "Centrally authorised medicines and their public assessment reports (EPAR), scientific guidelines and product-specific bioequivalence guidance for the EU.",
      "داروهای تأییدشده متمرکز اروپا و گزارش‌های ارزیابی عمومی آن‌ها (EPAR)، گایدلاین‌های علمی و گایدلاین‌های هم‌ارزی زیستی اختصاصی هر فرآورده.",
    ),
    links: [
      { label: "EMA", url: "https://www.ema.europa.eu/en", note: bi("Home page", "صفحه اصلی") },
      { label: "Medicines (EPAR)", url: "https://www.ema.europa.eu/en/medicines", note: bi("Search authorised medicines", "جستجوی داروهای تأییدشده") },
    ],
  },
  {
    key: "search",
    title: bi("Trusted databases for pharmaceutical searches", "پایگاه‌های معتبر جستجو در صنعت\u00a0داروسازی"),
    abbr: "emc · Drugs.com · RxList · PubChem · DrugBank",
    chip: "emc · Drugs.com · RxList",
    text: bi(
      "Product information by brand or active ingredient (SmPC, composition, excipients), drug monographs, chemical structures and identifiers, literature, trials and classifications — plus the Iran FDA for the national drug list and licences.",
      "اطلاعات فرآورده بر اساس نام تجاری یا ماده مؤثره (SmPC، ترکیب فرمولاسیون و مواد جانبی)، مونوگراف دارو، ساختار شیمیایی و شناسه‌ها، مقالات، کارآزمایی‌ها و طبقه‌بندی‌ها — و سازمان غذا و دارو ایران برای فهرست دارویی کشور و پروانه‌ها.",
    ),
    links: [
      {
        label: "emc (electronic medicines compendium)",
        url: "https://www.medicines.org.uk/emc",
        note: bi(
          "UK SmPCs and patient leaflets: search by brand or active ingredient for the full qualitative and quantitative composition, excipients, shelf life and storage; advanced search by SmPC section (free)",
          "SmPC و بروشور بیمار فرآورده‌های بریتانیا: با جستجوی نام تجاری یا ماده مؤثره، فرمول کامل کمّی و کیفی، مواد جانبی، عمر قفسه‌ای و شرایط نگهداری را می‌بینید؛ جستجوی پیشرفته در هر بخش SmPC (رایگان)",
        ),
      },
      {
        label: "Drugs.com",
        url: "https://www.drugs.com/",
        note: bi(
          "Drug monographs, brand–generic names, dosage forms and strengths, interaction checker and pill identifier (free)",
          "مونوگراف داروها، نام تجاری و ژنریک، اشکال و قدرت‌های دارویی، بررسی تداخلات و شناسایی قرص (رایگان)",
        ),
      },
      {
        label: "RxList",
        url: "https://www.rxlist.com/",
        note: bi(
          "Full US prescribing information by brand or generic name: indications, dosing, side effects, and the description section with the inactive ingredients (free)",
          "اطلاعات کامل تجویز داروهای آمریکا بر اساس نام تجاری یا ژنریک: موارد مصرف، دوز، عوارض و بخش توصیف (Description) شامل مواد جانبی (رایگان)",
        ),
      },
      {
        label: "Pharmaceutical Excipients (MedicinesComplete)",
        url: "https://www.medicinescomplete.com/",
        note: bi(
          "The current, regularly updated online edition of the Handbook of Pharmaceutical Excipients (the print 9th edition, 2020, was the last): excipient monographs with functions, typical concentrations, properties and safety (subscription)",
          "نسخه آنلاین، جاری و مرتب به‌روزشونده Handbook of Pharmaceutical Excipients (ویرایش چاپی 9 در 2020 آخرین چاپ بود): مونوگراف مواد جانبی با نقش‌ها، غلظت متداول، ویژگی‌ها و ایمنی (با اشتراک)",
        ),
      },
      { label: "PubChem", url: "https://pubchem.ncbi.nlm.nih.gov/", note: bi("Structures, CAS, properties, safety", "ساختار، CAS، ویژگی‌ها و ایمنی") },
      { label: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov/", note: bi("Scientific literature", "مقالات علمی") },
      { label: "DrugBank", url: "https://go.drugbank.com/", note: bi("Drug data: pharmacology, targets, interactions", "داده دارویی: فارماکولوژی، اهداف و تداخلات") },
      { label: "ChEMBL", url: "https://www.ebi.ac.uk/chembl/", note: bi("Bioactivity data (EMBL-EBI)", "داده فعالیت زیستی (EMBL-EBI)") },
      { label: "GSRS (UNII)", url: "https://gsrs.ncats.nih.gov/", note: bi("FDA substance registry and UNII codes", "ثبت مواد FDA و کدهای UNII") },
      { label: "ClinicalTrials.gov", url: "https://clinicaltrials.gov/", note: bi("Registered clinical trials", "کارآزمایی‌های بالینی ثبت‌شده") },
      { label: "WHO ATC/DDD Index", url: "https://atcddd.fhi.no/atc_ddd_index/", note: bi("ATC classification and defined daily doses", "طبقه‌بندی ATC و دوز روزانه تعریف‌شده") },
      { label: "Iran FDA", url: "https://www.fda.gov.ir/", note: bi("Iran Food and Drug Administration", "سازمان غذا و دارو ایران") },
    ],
  },
  {
    key: "ich",
    title: bi("ICH, PIC/S and international guidelines", "ICH، PIC/S و گایدلاین‌های بین‌المللی"),
    abbr: "ICH · PIC/S",
    chip: "ICH · PIC/S",
    editions: [
      {
        label: referenceLabels.inForce,
        value: bi(
          "Q1A(R2)–Q1E (consolidated Q1 still in draft), Q2(R2) and Q14 (2023), Q3C(R9) (2024), Q3D(R2) (2022), M7(R2) (2023), M4 (CTD)",
          `${ltr("Q1A(R2)–Q1E")} (گایدلاین یکپارچه Q1 هنوز پیش‌نویس است)، ${ltr("Q2(R2)")} و ${ltr("Q14")} (2023)، ${ltr("Q3C(R9)")} (2024)، ${ltr("Q3D(R2)")} (2022)، ${ltr("M7(R2)")} (2023)، ${ltr("M4 (CTD)")}`,
        ),
      },
    ],
    text: bi(
      "ICH sets the harmonised quality, safety and efficacy guidelines and the CTD format; PIC/S publishes the GMP guide followed by its member inspectorates.",
      "ICH گایدلاین‌های هماهنگ کیفیت، ایمنی و اثربخشی و قالب CTD را تدوین می‌کند؛ PIC/S گایدلاین GMP مورد استفاده بازرسی‌های عضو را منتشر می‌کند.",
    ),
    links: [
      { label: "ICH Quality guidelines", url: "https://www.ich.org/page/quality-guidelines", note: bi("Q1–Q14 (free)", "گایدلاین‌های Q1 تا Q14 (رایگان)") },
      { label: "ICH", url: "https://www.ich.org/", note: bi("All ICH guidelines", "همه گایدلاین‌های ICH") },
      { label: "PIC/S", url: "https://picscheme.org/", note: bi("GMP guide and publications", "گایدلاین GMP و انتشارات") },
    ],
  },
];
