import { bi } from "@/i18n/bi";

export const referralCopy = {
  title: bi("Invite a colleague", "معرفی همکار"),
  lead: bi(
    "Send your link to a colleague. When they subscribe, {days} days are added to your subscription, up to {max} times a month.",
    "لینک خود را برای همکارتان بفرستید. وقتی اشتراک بخرد، {days} روز به اشتراک شما اضافه می‌شود؛ حداکثر {max} بار در ماه.",
  ),
  rule: bi(
    "The reward counts only for a new account made through your link, and only after its first paid subscription. Without an active subscription, the {days} days open as a new individual subscription.",
    "پاداش فقط برای حساب تازه‌ای حساب می‌شود که از لینک شما ساخته شده باشد، و فقط پس از اولین خرید اشتراک آن. اگر اشتراک فعال نداشته باشید، {days} روز به‌صورت یک اشتراک فردی تازه برایتان فعال می‌شود.",
  ),
  link: bi("Your link", "لینک شما"),
  copy: bi("Copy link", "کپی لینک"),
  copied: bi("Copied", "کپی شد"),
  share: bi("Share", "اشتراک‌گذاری"),
  shareText: bi(
    "PharmaVault: a technical knowledge base for pharmaceutical QC, QA, formulation and suppliers.",
    "PharmaVault؛ پایگاه دانش تخصصی داروسازی برای QC، QA، فرمولاسیون و بانک تأمین‌کنندگان.",
  ),
  invited: bi("Signed up", "ثبت‌نام کرده"),
  paid: bi("Subscribed", "اشتراک خریده"),
  month: bi("Rewards this month", "پاداش این ماه"),
  days: bi("Days earned", "روز دریافتی"),
  // admin
  adminTitle: bi("Referral rewards", "پاداش‌های معرفی همکار"),
  adminEmpty: bi("No referral rewards yet.", "هنوز پاداشی ثبت نشده است."),
  adminReferrer: bi("Referrer", "معرف"),
  adminReferee: bi("Invited", "معرفی‌شده"),
  adminDays: bi("Days", "روز"),
  statuses: { granted: bi("Granted", "اعطا شد"), capped: bi("Monthly cap reached", "سقف ماهانه پر بود") } as Record<string, ReturnType<typeof bi>>,
};
