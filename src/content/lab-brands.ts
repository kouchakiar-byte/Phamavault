import { bi } from "@/i18n/bi";
import suppliersJson from "@/data/suppliers.json";

export const labBrandsCopy = {
  title: bi("Laboratory instrument brands and their suppliers in Iran", "برندهای تجهیزات آزمایشگاهی و تأمین‌کنندگان آن‌ها در ایران"),
  lead: bi(
    "Which Iranian company supplies, represents or services a laboratory brand: instruments, glassware, chemicals and culture media. Open a brand to see the companies in the supplier bank.",
    "کدام شرکت ایرانی یک برند آزمایشگاهی را عرضه می‌کند، نماینده آن است یا خدمات آن را ارائه می‌دهد؛ از دستگاه و شیشه‌آلات تا مواد شیمیایی و محیط کشت. با انتخاب هر برند، شرکت‌های مربوط در بانک تأمین‌کنندگان را می‌بینید.",
  ),
  eyebrow: bi("Supplier bank", "بانک تأمین‌کنندگان"),
  linkLabel: bi("{n} laboratory brands and their suppliers", "{n} برند آزمایشگاهی و تأمین‌کنندگانشان"),
  footer: bi("Laboratory brands", "برندهای تجهیزات آزمایشگاهی"),
  count: bi("{b} brands · {c} laboratory suppliers", "{b} برند · {c} تأمین‌کننده آزمایشگاهی"),
  filter: bi("Find a brand", "جستجوی برند"),
  open: bi("Contacts in the supplier bank", "اطلاعات تماس در بانک تأمین‌کنندگان"),
  companies: bi("Suppliers", "تأمین‌کنندگان"),
  note: bi(
    "Agency and representation are as the companies state in their own catalogues and websites. Ask for the manufacturer's authorisation letter before a large purchase.",
    "نمایندگی و عرضه برندها بر اساس اعلام خود شرکت‌ها در کاتالوگ و سایتشان است. پیش از خرید عمده، نامه نمایندگی از سازنده را از شرکت درخواست کنید.",
  ),
  empty: bi("No brand matches.", "برندی پیدا نشد."),
  askTitle: bi("Not listed?", "برند مورد نظرتان در فهرست نیست؟"),
  askText: bi("Send a quote request and we will find the supplier for you.", "درخواست استعلام بفرستید تا تأمین‌کننده آن را برایتان پیدا کنیم."),
  ask: bi("Request a quote", "درخواست استعلام قیمت"),
};

type Company = { n: string; e: string; c: string[]; p: string[] };

export type LabBrand = { name: string; companies: { fa: string; en: string }[] };

/**
 * Brands named on the products of laboratory suppliers ("fa|en|Brand"), with the
 * companies that list them. Built from the supplier bank's base data.
 */
export const labBrands: LabBrand[] = (() => {
  const map = new Map<string, Map<string, { fa: string; en: string }>>();
  for (const c of (suppliersJson as { companies: Company[] }).companies) {
    if (!c.c.includes("lab")) continue;
    for (const p of c.p) {
      const brand = p.split("|")[2]?.trim();
      if (!brand || brand === "API") continue;
      const key = brand.toLowerCase();
      if (!map.has(key)) map.set(key, new Map());
      map.get(key)!.set(c.n, { fa: c.n, en: c.e });
    }
  }
  const display = new Map<string, string>();
  for (const c of (suppliersJson as { companies: Company[] }).companies)
    for (const p of c.p) {
      const brand = p.split("|")[2]?.trim();
      if (brand && !display.has(brand.toLowerCase())) display.set(brand.toLowerCase(), brand);
    }
  return [...map.entries()]
    .map(([key, cos]) => ({ name: display.get(key) ?? key, companies: [...cos.values()] }))
    .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
})();

export const labSupplierCount = (suppliersJson as { companies: Company[] }).companies.filter((c) => c.c.includes("lab")).length;

export const quoteCopy = {
  title: bi("Request a price quote", "درخواست استعلام قیمت"),
  lead: bi(
    "Tell us what you need, a raw material, a reference standard or a laboratory instrument, and how much. We check the suppliers in the bank and call you back with prices and availability.",
    "بنویسید چه چیزی لازم دارید، ماده اولیه، رفرنس استاندارد یا دستگاه آزمایشگاهی، و چه مقدار. تأمین‌کنندگان بانک را بررسی می‌کنیم و با قیمت و موجودی با شما تماس می‌گیریم.",
  ),
  open: bi("Request a price quote", "درخواست استعلام قیمت"),
  name: bi("Your name", "نام و نام خانوادگی"),
  phone: bi("Mobile", "شماره موبایل"),
  company: bi("Company", "شرکت"),
  email: bi("Email", "ایمیل"),
  item: bi("What you need", "کالای مورد نیاز"),
  itemHint: bi("e.g. Magnesium stearate, Ph. Eur.; or Memmert incubator", "مثلاً منیزیم استئارات گرید Ph. Eur.، یا انکوباتور Memmert"),
  message: bi("Quantity, grade, deadline", "مقدار، گرید و زمان مورد نیاز"),
  submit: bi("Send request", "ارسال درخواست"),
  sending: bi("Sending…", "در حال ارسال…"),
  sent: bi("Your request is registered.", "درخواست شما ثبت شد."),
  sentNote: bi("We will call you within one working day.", "حداکثر تا یک روز کاری با شما تماس می‌گیریم."),
  errors: {
    missing: bi("Please enter your name, mobile and what you need.", "لطفاً نام، شماره موبایل و کالای مورد نیاز را وارد کنید."),
    phone: bi("The phone number looks incomplete.", "شماره تلفن کامل نیست."),
    unavailable: bi("The request could not be saved. Please call us.", "ثبت درخواست ممکن نشد؛ لطفاً تماس بگیرید."),
  },
};
