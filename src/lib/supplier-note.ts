/**
 * The bank's notes mix facts readers need (what a company makes, which grade, which number to
 * call) with working notes on where each record was collected. Readers see only the first kind:
 * where the data came from stays out of the page, so the bank cannot be rebuilt from its sources.
 */
const REWRITE: [RegExp, string][] = [
  [/طبق صفحه سندیکا\s*/g, ""],
  [/\s*طبق دایرکتوری پارس‌سنتر/g, ""],
  [/\s*طبق سایت adonisherb\.ir/g, ""],
  [/\s*از منابع در دسترس/g, ""],
  [/\s*(?:در|از) منبع/g, ""],
  [/فهرست محصولات از PharmaCompass \(وضعیت GMP تأیید نشده\)/g, "وضعیت GMP تأیید نشده"],
  [/\s*طبق (?:PharmaCompass|پروفایل شرکت)/g, ""],
];

/** A clause is dropped when it only says where the data came from. */
const DROP = [
  /شیمی‌بازار|پارس‌سنتر|دایرکتوری|به معرفی کاربر|برداشت شده|نیامده/,
  /PharmaCompass|Pharmaoffer|village\.ai|فنکام|از سرور ما|از صفحات محصول سایت|جستجوی وب/,
  /^تلفن‌ها از سایت شرکت$/,
  /^فهرست محصول از سایت شرکت$/,
];

const keepSyndicate = /^عضو( وابسته)? سندیکا$/;

export function publicNote(note: string | undefined): string | undefined {
  if (!note) return undefined;
  let text = note;
  for (const [pattern, to] of REWRITE) text = text.replace(pattern, to);
  const clauses = text
    .split(/[؛.](?=\s|$)/)
    .map((c) => c.trim())
    .filter(Boolean)
    .filter((c) => !(c.includes("سندیکا") && !keepSyndicate.test(c)))
    .filter((c) => !DROP.some((d) => d.test(c)));
  return clauses.length ? `${clauses.join("؛ ")}.` : undefined;
}
