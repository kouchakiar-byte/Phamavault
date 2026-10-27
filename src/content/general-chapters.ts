import { bi } from "@/i18n/bi";

/** Isolates a Latin run inside Persian text and keeps it on one line. */
const ltr = (s: string) => `⁦${s.replace(/ /g, "\u00a0")}⁩`;

/** Copy for the general chapters bank (USP–NF and Ph. Eur. / BP). */
export const generalChaptersPage = {
  title: bi("General chapters bank — USP and Ph. Eur. / BP", `بانک ${ltr("General Chapter")}‌های ${ltr("USP")} و ${ltr("Ph. Eur. / BP")}`),
  lead: bi(
    "Every general chapter of USP–NF and every general method of the European Pharmacopoeia — which the British Pharmacopoeia reproduces in its appendices — with its official number and title, a technical Persian title and a professional summary of what the chapter covers. Search by number, English or Persian title, or filter by pharmacopoeia and subject.",
    `همه ${ltr("General Chapter")}‌های ${ltr("USP–NF")} و روش‌های عمومی فارماکوپه اروپا (که فارماکوپه بریتانیا عیناً در ${ltr("Appendix")}‌های خود آورده است) با شماره و عنوان رسمی، عنوان تخصصی فارسی و خلاصه حرفه‌ای محتوای هر فصل. با شماره فصل، عنوان انگلیسی یا فارسی جستجو کنید یا بر اساس فارماکوپه و موضوع فیلتر کنید.`,
  ),
  short: bi("General chapters bank", `بانک ${ltr("General Chapter")}‌ها`),
  open: bi("Open the general chapters bank", `ورود به بانک ${ltr("General Chapter")}‌ها`),
  openNote: bi(
    "All USP and Ph. Eur. / BP general chapters with Persian titles and summaries",
    `همه ${ltr("General Chapter")}‌های ${ltr("USP")} و ${ltr("Ph. Eur. / BP")} با عنوان و خلاصه فارسی`,
  ),
  back: bi("References and pharmacopoeias", "رفرنس‌ها و فارماکوپه‌ها"),
  pharmacopoeia: bi("Pharmacopoeia", "فارماکوپه"),
  allPharmacopoeias: bi("USP and Ph. Eur. / BP", `${ltr("USP")} و ${ltr("Ph. Eur. / BP")}`),
  subject: bi("Subject", "موضوع"),
  allSubjects: bi("All subjects", "همه موضوع‌ها"),
  placeholder: bi("e.g. 711, dissolution, 2.9.3, endotoxin", `مثلاً: 711، Dissolution، ${ltr("2.9.3")}، اندوتوکسین`),
  chapter: bi("Chapter", "فصل"),
  titleCol: bi("Title", "عنوان"),
  summary: bi("Summary", "خلاصه"),
  official: bi("Official text", "متن رسمی"),
  ph: {
    USP: bi("USP–NF", "USP–NF"),
    EP: bi("Ph. Eur. / BP", "Ph. Eur. / BP"),
  },
  note: bi(
    "Numbers and titles follow the editions current in 2026; summaries are written by PharmaVault to explain the scope of each chapter and are not a translation of the official text. Requirements, limits and procedures must always be taken from the official edition in force. USP chapters numbered below <1000> are enforceable tests and assays, <1000>–<1999> are informational, and <2000> and above apply to dietary supplements. In the BP the Ph. Eur. general methods appear as appendices with BP numbering.",
    `شماره‌ها و عنوان‌ها مطابق ویرایش‌های جاری 2026 است. خلاصه‌ها را فارماوالت برای معرفی دامنه هر فصل نوشته است و ترجمه متن رسمی نیست؛ الزامات، حدود و روش‌ها را همیشه از ویرایش رسمی لازم‌الاجرا استناد کنید. در ${ltr("USP")} فصل‌های کمتر از ${ltr("<1000>")} آزمون‌ها و ${ltr("Assay")}‌های الزام‌آور، فصل‌های ${ltr("<1000>")} تا ${ltr("<1999>")} اطلاعاتی (${ltr("Informational")}) و فصل‌های ${ltr("<2000>")} به بالا مربوط به مکمل‌های غذایی است. در ${ltr("BP")} روش‌های عمومی ${ltr("Ph. Eur.")} به‌صورت ${ltr("Appendix")} با شماره‌گذاری ${ltr("BP")} آمده است.`,
  ),
  links: {
    USP: [{ label: "USP–NF Online", url: "https://online.uspnf.com/" }],
    EP: [
      { label: "Ph. Eur. Online", url: "https://pheur.edqm.eu/" },
      { label: "BP Online", url: "https://www.pharmacopoeia.com/" },
    ],
  },
  sheet: {
    docTitle: bi("PharmaVault general chapter", "فصل عمومی فارماوالت"),
    open: bi("PharmaVault sheet", "برگه فارماوالت"),
    openLong: bi("Open the PharmaVault sheet", "مشاهده برگه فارماوالت"),
    back: bi("Back to the general chapters bank", `بازگشت به بانک ${ltr("General Chapter")}‌ها`),
    summary: bi("Summary", "خلاصه"),
    related: bi("Related chapters", "فصل‌های مرتبط"),
    official: bi("Official text", "متن رسمی"),
    subject: bi("Subject", "موضوع"),
    pharmacopoeia: bi("Pharmacopoeia", "فارماکوپه"),
    harmonised: bi("Harmonised text (PDG)", "متن هماهنگ‌شده (PDG)"),
    pending: bi(
      "The detailed PharmaVault sheet for this chapter is being prepared; the summary below comes from the general chapters bank.",
      "برگه تفصیلی فارماوالت برای این فصل در حال تهیه است؛ خلاصه زیر از بانک General Chapterها آمده است.",
    ),
    sameAs: bi(
      "This text is harmonised with {code}; the technical content below is shared. Non-harmonised local requirements are marked ♦ in the official text.",
      "این متن با {code} هماهنگ شده است و محتوای فنی زیر مشترک است. الزامات محلی غیرهماهنگ در متن رسمی با علامت ♦ مشخص شده‌اند.",
    ),
    faOnly: bi("The detailed sheet is written in Persian.", "برگه تفصیلی به زبان فارسی نوشته شده است."),
    readFa: bi("Read the Persian sheet", "مشاهده برگه فارسی"),
    sources: bi("Sources", "منابع"),
    disclaimer: bi(
      "Written by PharmaVault to explain the chapter; not a translation of the official text. Take requirements, limits and procedures from the official edition in force.",
      "نوشته فارماوالت برای توضیح فصل؛ ترجمه متن رسمی نیست. الزامات، حدود و روش‌ها را از ویرایش رسمی لازم‌الاجرا استناد کنید.",
    ),
    printBlocked: bi("This sheet can be viewed on pharmavault.ir only.", "این برگه فقط در سایت pharmavault.ir قابل مشاهده است."),
    copy: bi("Copy the sheet text", "کپی متن برگه"),
    copied: bi("Copied", "کپی شد"),
    copyLock: {
      title: bi("Copying is for subscribers", "کپی متن ویژه مشترکان است"),
      text: bi(
        "To copy the text of the PharmaVault general chapter sheets, get a subscription to the References section.",
        `برای کپی متن برگه‌های ${ltr("General Chapter")} فارماوالت، اشتراک بخش رفرنس‌ها و فارماکوپه‌ها را تهیه کنید.`,
      ),
      buy: bi("Get a subscription", "تهیه اشتراک"),
      plans: bi("See the plans", "مشاهده طرح‌های اشتراک"),
      close: bi("Close", "بستن"),
    },
  },
};
