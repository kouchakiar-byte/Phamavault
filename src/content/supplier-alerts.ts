import { bi } from "@/i18n/bi";

/** "Tell me when it is listed": a reader's watch on a material the supplier bank does not have yet. */
export const alertCopy = {
  title: bi("Tell me when a supplier is listed", "وقتی تأمین‌کننده‌ای ثبت شد خبرم کن"),
  lead: bi(
    "The bank is updated every day. Leave this search with us and you will hear as soon as a supplier for “{q}” is listed.",
    "بانک هر روز به‌روز می‌شود. این جستجو را ثبت کنید تا به محض ثبت تأمین‌کننده‌ای برای «{q}» باخبر شوید.",
  ),
  email: bi("Email (optional)", "ایمیل (اختیاری)"),
  emailHint: bi("Left empty, we write to your account's email. The news also shows on your account page.", "اگر خالی بماند، به ایمیل حساب کاربری شما فرستاده می‌شود؛ خبر در صفحه حساب هم نمایش داده می‌شود."),
  submit: bi("Notify me", "خبرم کن"),
  saved: bi("Saved. We will tell you when a supplier for “{q}” is listed.", "ثبت شد. وقتی تأمین‌کننده‌ای برای «{q}» ثبت شود، خبرتان می‌کنیم."),
  signIn: bi("Sign in to be notified", "برای دریافت خبر وارد شوید"),
  errors: {
    short: bi("Search for at least two characters first.", "ابتدا عبارتی با دست‌کم 2 حرف جستجو کنید."),
    email: bi("That email address does not look right.", "نشانی ایمیل درست به نظر نمی‌رسد."),
    full: bi("You already have 20 open alerts; remove one from your account page first.", "20 اعلان باز دارید؛ ابتدا یکی را از صفحه حساب کاربری حذف کنید."),
    signin: bi("Sign in first.", "ابتدا وارد حساب شوید."),
    unavailable: bi("The service is not available right now; please try again later.", "این خدمت در حال حاضر در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید."),
  },
  // account page
  section: bi("Supplier alerts", "اعلان‌های بانک تأمین‌کنندگان"),
  waiting: bi("Waiting: checked after every daily update", "در انتظار؛ پس از هر به‌روزرسانی روزانه بررسی می‌شود"),
  found: bi("{n} suppliers listed", "{n} تأمین‌کننده ثبت شد"),
  view: bi("View", "مشاهده"),
  remove: bi("Remove", "حذف"),
  // email
  mailSubject: bi("A supplier for “{q}” is now listed — PharmaVault", "تأمین‌کننده «{q}» در PharmaVault ثبت شد"),
  mailText: bi(
    "You asked to hear when a supplier for “{q}” is listed in the PharmaVault supplier bank. {n} suppliers are listed now:",
    "درخواست کرده بودید وقتی تأمین‌کننده‌ای برای «{q}» در بانک تأمین‌کنندگان PharmaVault ثبت شد، باخبر شوید. اکنون {n} تأمین‌کننده ثبت شده است:",
  ),
  // admin
  adminTitle: bi("Supplier alerts: what readers are looking for", "اعلان‌های تأمین‌کننده؛ موادی که کاربران دنبالشان هستند"),
  adminQuery: bi("Search", "جستجو"),
  adminReaders: bi("Readers", "تعداد کاربر"),
  adminState: bi("State", "وضعیت"),
  adminOpen: bi("Open", "باز"),
  adminFound: bi("Found", "پیدا شد"),
  adminEmpty: bi("No alerts yet.", "هنوز اعلانی ثبت نشده است."),
};
