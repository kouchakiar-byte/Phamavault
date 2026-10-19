import { bi, type Bi } from "@/i18n/bi";

/*
 * About, contact, terms and privacy pages — the pages e-Namad reviews before
 * issuing a trust seal. Owner details (name, address, postal code, landline)
 * live in siteConfig.contact and appear once filled in.
 */

export type LegalSection = { title: Bi; paragraphs?: Bi[]; items?: Bi[] };
export type LegalPage = { title: Bi; lead: Bi; sections: LegalSection[] };

export const legalNav = {
  about: bi("About us", "درباره ما"),
  contact: bi("Contact us", "تماس با ما"),
  terms: bi("Terms and conditions", "قوانین و مقررات"),
  privacy: bi("Privacy policy", "حریم خصوصی"),
  references: bi("References and pharmacopoeias", "مراجع و فارماکوپه‌ها"),
};

export const contactLabels = {
  owner: bi("Owner", "صاحب امتیاز"),
  address: bi("Address", "نشانی"),
  postalCode: bi("Postal code", "کد پستی"),
  phone: bi("Phone", "تلفن"),
  email: bi("Email", "ایمیل"),
  hours: bi("Support hours", "ساعات پاسخگویی"),
};

export const about: LegalPage = {
  title: bi("About PharmaVault", "درباره PharmaVault"),
  lead: bi(
    "PharmaVault is a specialist reference for pharmaceutical knowledge, data and practical tools, built by the PharmaVault expert team to support the whole life cycle of a medicine in Iran — from sourcing raw materials and designing the formulation to manufacturing, analysis, quality assurance and registration.",
    "PharmaVault مرجع تخصصی دانش، داده و ابزارهای کاربردی داروسازی است که توسط تیم تخصصی فارماوالت برای پشتیبانی از چرخه کامل توسعه دارو در ایران طراحی شده است — از تأمین مواد اولیه و طراحی فرمولاسیون تا تولید، آنالیز، تضمین کیفیت و ثبت فرآورده.",
  ),
  sections: [
    {
      title: bi("From knowledge to solutions — what we offer", "از دانش تا راهکار؛ آنچه ارائه می‌دهیم"),
      items: [
        bi(
          "A bank of suppliers and manufacturers of pharmaceutical, supplement and cosmetic raw materials, searchable by material and salt form",
          "بانک تأمین‌کنندگان و تولیدکنندگان مواد اولیه دارویی، مکمل و آرایشی‌بهداشتی، قابل جستجو بر اساس ماده و فرم نمکی",
        ),
        bi(
          "Databases of excipients and active pharmaceutical ingredients: function, use levels, CAS number and key physicochemical properties",
          "پایگاه داده مواد جانبی و مواد مؤثره دارویی: عملکرد، محدوده مصرف، شماره CAS و ویژگی‌های کلیدی فیزیکوشیمیایی",
        ),
        bi(
          "Technical handbooks for every dosage form, from formulation design and critical process parameters to scale-up and stability",
          "هندبوک‌های تخصصی اشکال دارویی؛ از طراحی فرمولاسیون و پارامترهای بحرانی فرایند تا افزایش مقیاس و پایداری",
        ),
        bi(
          "Formulation and analytical calculations, and a starting-formula builder",
          "محاسبات فرمولاسیون و آنالیز، و ابزار طراحی فرمول پایه",
        ),
        bi(
          "Standard operating procedures and references for quality control (QC) and quality assurance (QA)",
          "دستورالعمل‌های استاندارد و مراجع کنترل کیفیت (QC) و تضمین کیفیت (QA)",
        ),
        bi(
          "A regulatory reference for the CTD dossier and ICH guidelines",
          "مرجع رگولاتوری پرونده CTD و راهنماهای ICH",
        ),
        bi(
          "CTD dossier compilation for your project in 5 working days by the PharmaVault expert team",
          "تدوین CTD پروژه شما در ۵ روز کاری توسط تیم تخصصی فارماوالت",
        ),
      ],
    },
    {
      title: bi("Scientific basis", "مبنای علمی"),
      paragraphs: [
        bi(
          "The PharmaVault expert team draws the content from authoritative, citable sources — the USP–NF, BP, Ph. Eur. and JP pharmacopoeias, ICH guidelines and PIC/S GMP — and each topic names its reference so it can be checked against the current official edition.",
          "محتوا توسط تیم تخصصی فارماوالت بر پایه منابع معتبر و قابل استناد تدوین می‌شود — فارماکوپه‌های \u2066USP–NF\u2069، \u2066BP\u2069، \u2066Ph. Eur.\u2069 و \u2066JP\u2069، راهنماهای ICH و GMP سازمان \u2066PIC/S\u2069 — و مرجع هر موضوع ذکر می‌شود تا با آخرین ویرایش رسمی قابل تطبیق باشد.",
        ),
      ],
    },
    {
      title: bi("Who it is for", "برای چه کسانی"),
      items: [
        bi("R&D and formulation teams", "واحدهای تحقیق و توسعه و فرمولاسیون"),
        bi("Quality control (QC) and quality assurance (QA)", "کنترل کیفیت (QC) و تضمین کیفیت (QA)"),
        bi("Regulatory affairs (RA)", "امور رگولاتوری (RA)"),
        bi("Purchasing and supply chain", "بازرگانی و زنجیره تأمین"),
        bi("University teachers and pharmacy students", "اساتید و دانشجویان داروسازی و علوم دارویی"),
        bi("Pharmacies and everyone working with medicines", "داروخانه‌ها و فعالان حوزه دارو"),
      ],
    },
  ],
};

export const contact: LegalPage = {
  title: bi("Contact us", "تماس با ما"),
  lead: bi(
    "Questions about subscriptions, invoices for companies, CTD compilation, custom handbooks or the content of the site — the PharmaVault expert team is glad to help.",
    "برای پرسش درباره اشتراک، پیش‌فاکتور شرکت‌ها، تدوین CTD، سفارش هندبوک اختصاصی یا محتوای سایت، با تیم تخصصی فارماوالت در تماس باشید.",
  ),
  sections: [],
};

export const terms: LegalPage = {
  title: bi("Terms and conditions", "قوانین و مقررات"),
  lead: bi(
    "By creating an account or buying a subscription you accept these terms. Please read them before you pay.",
    "با ساخت حساب کاربری یا خرید اشتراک، این قوانین را می‌پذیرید. لطفاً پیش از پرداخت آن‌ها را مطالعه کنید.",
  ),
  sections: [
    {
      title: bi("1. Account", "۱. حساب کاربری"),
      items: [
        bi("An account is created with a mobile number and password and belongs to one person.", "حساب کاربری با شماره موبایل و رمز عبور ساخته می‌شود و متعلق به یک نفر است."),
        bi(
          "An individual licence is for one user on one device at a time; signing in on a new device signs out the previous one.",
          "اشتراک فردی برای یک کاربر و در هر زمان روی یک دستگاه است؛ ورود از دستگاه جدید، دستگاه قبلی را از حساب خارج می‌کند.",
        ),
        bi("Keep your password private; you are responsible for activity on your account.", "رمز عبور را محرمانه نگه دارید؛ مسئولیت فعالیت‌های حساب با صاحب آن است."),
      ],
    },
    {
      title: bi("2. Subscriptions and payment", "۲. اشتراک و پرداخت"),
      items: [
        bi("Prices are in Toman and shown on the site before payment; the amount on the payment page is final.", "قیمت‌ها به تومان و پیش از پرداخت در سایت نمایش داده می‌شود؛ مبلغ صفحه پرداخت، مبلغ نهایی است."),
        bi(
          "Online payment is made through a Shaparak-licensed bank gateway; PharmaVault never receives or stores card details.",
          "پرداخت آنلاین از طریق درگاه بانکی دارای مجوز شاپرک انجام می‌شود و اطلاعات کارت بانکی به PharmaVault نمی‌رسد و ذخیره نمی‌شود.",
        ),
        bi(
          "Access opens as soon as the payment is confirmed, for the period bought (1, 3, 6 or 12 months). The start and end dates are shown in your account.",
          "دسترسی بلافاصله پس از تأیید پرداخت و برای مدت خریداری‌شده (۱، ۳، ۶ یا ۱۲ ماه) باز می‌شود. تاریخ شروع و پایان در حساب کاربری نمایش داده می‌شود.",
        ),
        bi("Renewal adds the new period to the current end date.", "تمدید، مدت جدید را به تاریخ پایان فعلی اضافه می‌کند."),
        bi(
          "Team / Organisation subscriptions cover at least six users; the account owner assigns them by mobile number. Companies may pay against a pro-forma invoice.",
          "اشتراک تیمی / سازمانی حداقل شش کاربر دارد که صاحب حساب با شماره موبایل آن‌ها را تعیین می‌کند. شرکت‌ها می‌توانند بر اساس پیش‌فاکتور پرداخت کنند.",
        ),
      ],
    },
    {
      title: bi("3. Refunds", "۳. بازگشت وجه"),
      items: [
        bi(
          "Within 3 days of purchase, if the subscribed sections have not been used, the full amount is refunded on request.",
          "تا ۳ روز پس از خرید، در صورتی که از بخش‌های اشتراک استفاده نشده باشد، با درخواست شما کل مبلغ بازگردانده می‌شود.",
        ),
        bi(
          "If a payment was taken but the subscription did not open, contact us with the payment reference; it is activated or refunded.",
          "اگر مبلغ کسر شد اما اشتراک فعال نشد، با کد پیگیری پرداخت با ما تماس بگیرید تا اشتراک فعال یا مبلغ بازگردانده شود.",
        ),
        bi(
          "Failed bank payments are returned to the card by the bank, normally within 72 hours.",
          "مبالغ پرداخت‌های ناموفق، معمولاً ظرف ۷۲ ساعت توسط بانک به کارت بازگردانده می‌شود.",
        ),
      ],
    },
    {
      title: bi("4. Permitted use", "۴. استفاده مجاز"),
      items: [
        bi("Content is for the subscriber's own professional and educational use.", "محتوا برای استفاده حرفه‌ای و آموزشی خود مشترک است."),
        bi(
          "Copying, republishing, selling or automatically extracting the databases, or sharing an account, is not permitted and ends the subscription without refund.",
          "کپی، بازنشر، فروش یا استخراج خودکار پایگاه‌های داده و نیز اشتراک‌گذاری حساب کاربری مجاز نیست و موجب قطع اشتراک بدون بازگشت وجه می‌شود.",
        ),
      ],
    },
    {
      title: bi("5. Intellectual property", "۵. مالکیت معنوی"),
      items: [
        bi(
          "All content on PharmaVault — the monographs, databases, calculators, SOPs, handbook chapters, translations, compilation and design — belongs to the PharmaVault platform (The Pharmaceutical Information Vault) and is protected by intellectual-property law.",
          "تمامی محتوای PharmaVault — شامل مونوگراف‌ها، پایگاه‌های داده، ماشین‌حساب‌ها، دستورالعمل‌ها، فصل‌های هندبوک، ترجمه‌ها، گردآوری و طراحی سایت — متعلق به پلتفرم PharmaVault (گنجینه اطلاعات داروسازی) است و تحت حمایت قوانین مالکیت معنوی قرار دارد.",
        ),
        bi(
          "Short quotations are allowed only with a clear credit to PharmaVault and a link to pharmavault.ir. Any other copying, republishing or commercial use without written permission is prohibited and will be pursued under the law.",
          "نقل بخش‌های کوتاه فقط با ذکر صریح منبع PharmaVault و لینک به pharmavault.ir مجاز است. هرگونه کپی‌برداری، بازنشر یا استفاده تجاری دیگر بدون اجازه کتبی ممنوع است و پیگرد قانونی دارد.",
        ),
        bi(
          "Pharmacopoeias, guidelines, trade names and trademarks of third parties that are cited or linked on the site belong to their respective owners.",
          "فارماکوپه‌ها، راهنماها، نام‌های تجاری و نشان‌های اشخاص ثالث که در سایت به آن‌ها ارجاع یا لینک داده شده، متعلق به صاحبان آن‌هاست.",
        ),
      ],
    },
    {
      title: bi("6. Nature of the information", "۶. ماهیت اطلاعات"),
      paragraphs: [
        bi(
          "PharmaVault is a working reference that shortens the search. Specifications, limits and registration requirements must always be confirmed against the current official pharmacopoeia, guideline or authority before use in production, release or a regulatory submission. Supplier details are published as found in the cited sources; PharmaVault is not a party to any purchase between users and suppliers.",
          "PharmaVault مرجعی کاربردی برای کوتاه‌کردن مسیر جستجو است. مشخصات، حدود پذیرش و الزامات ثبت باید پیش از استفاده در تولید، آزادسازی بچ یا پرونده ثبت، با آخرین ویرایش رسمی فارماکوپه، راهنما یا مرجع قانونی تطبیق داده شود. اطلاعات تأمین‌کنندگان همان‌گونه که در منابع ذکرشده آمده منتشر می‌شود و PharmaVault طرف هیچ معامله‌ای میان کاربران و تأمین‌کنندگان نیست.",
        ),
      ],
    },
    {
      title: bi("7. Changes", "۷. تغییرات"),
      paragraphs: [
        bi(
          "These terms and the prices may change; changes apply to purchases made after they are published and do not affect a subscription already paid for.",
          "این قوانین و قیمت‌ها ممکن است تغییر کند؛ تغییرات برای خریدهای پس از انتشار اعمال می‌شود و بر اشتراکی که پیش‌تر پرداخت شده اثری ندارد.",
        ),
      ],
    },
  ],
};

export const privacy: LegalPage = {
  title: bi("Privacy policy", "حریم خصوصی"),
  lead: bi(
    "What we collect, why, and how we protect it.",
    "چه اطلاعاتی جمع‌آوری می‌کنیم، برای چه، و چگونه از آن محافظت می‌کنیم.",
  ),
  sections: [
    {
      title: bi("What we collect", "اطلاعاتی که جمع‌آوری می‌کنیم"),
      items: [
        bi("Name and mobile number, to create and secure your account.", "نام و شماره موبایل، برای ساخت و حفاظت از حساب کاربری."),
        bi(
          "Orders and the bank's payment reference, to activate and support your subscription. Card details are entered only on the bank's page and never reach us.",
          "سفارش‌ها و کد پیگیری بانکی، برای فعال‌سازی و پشتیبانی اشتراک. اطلاعات کارت فقط در صفحه بانک وارد می‌شود و به ما نمی‌رسد.",
        ),
        bi(
          "The device and IP of the active sign-in, to apply the one-device-at-a-time rule.",
          "دستگاه و IP ورود فعال، برای اجرای قاعده «یک کاربر روی یک دستگاه».",
        ),
        bi("Two cookies: the sign-in session and your language choice.", "دو کوکی: نشست ورود به حساب و زبان انتخابی شما."),
        bi(
          "Anonymous visit counts (page, referring site, device type), kept on our own server to see which pages are useful. No cookie is set for this and no IP is stored; visitors are counted with a one-way code that changes every day.",
          "آمار ناشناس بازدید (صفحه، سایت ارجاع‌دهنده و نوع دستگاه) روی سرور خود سایت، به‌منظور شناسایی صفحات مفید. برای این کار کوکی ذخیره نمی‌شود و IP نیز ثبت نمی‌شود؛ بازدیدکننده با یک کد یک‌طرفه شمرده می‌شود که هر روز تغییر می‌کند.",
        ),
      ],
    },
    {
      title: bi("How we protect it", "چگونه محافظت می‌کنیم"),
      items: [
        bi("Passwords are stored only as a one-way hash, never as text.", "رمز عبور فقط به‌صورت درهم‌سازی یک‌طرفه ذخیره می‌شود، نه به‌صورت متن."),
        bi("Pages are served over an encrypted connection (HTTPS).", "صفحات از طریق اتصال رمزنگاری‌شده (HTTPS) ارائه می‌شود."),
        bi(
          "Your information is not sold or shared with others, except where Iranian law requires it.",
          "اطلاعات شما فروخته نمی‌شود و در اختیار دیگران قرار نمی‌گیرد، مگر به حکم قانون.",
        ),
      ],
    },
    {
      title: bi("Your choices", "اختیارات شما"),
      paragraphs: [
        bi(
          "You can ask us to correct your details or delete your account by email; deleting an account ends its subscriptions.",
          "می‌توانید با ارسال ایمیل، اصلاح اطلاعات یا حذف حساب کاربری خود را درخواست کنید؛ حذف حساب، اشتراک‌های آن را نیز پایان می‌دهد.",
        ),
      ],
    },
  ],
};
