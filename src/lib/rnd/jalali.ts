/*
 * Solar Hijri (Jalali) dates for the R&D workspace. Dates are stored as Gregorian YYYY-MM-DD;
 * people read and type them as 1405/08/29. The calendar arithmetic is the browser's own
 * (Intl, "persian" calendar), so leap years follow the same rule everywhere on the site.
 */
const DAY = 86400000;
let F: Intl.DateTimeFormat | null = null;
try {
  F = new Intl.DateTimeFormat("en-u-ca-persian-nu-latn", { year: "numeric", month: "numeric", day: "numeric", timeZone: "UTC" });
} catch { /* no Persian calendar: Gregorian dates are shown and accepted instead */ }

function parts(t: number): [number, number, number] | null {
  if (!F) return null;
  const p = F.formatToParts(new Date(t));
  const n = (type: string) => Number(p.find((x) => x.type === type)?.value);
  const out: [number, number, number] = [n("year"), n("month"), n("day")];
  return out.every(Number.isFinite) ? out : null;
}
const utc = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const pad = (n: number) => String(n).padStart(2, "0");

/** 2026-11-20 → 1405/08/29 (the ISO date itself where the Persian calendar is not available). */
export function toJalali(date?: string): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "";
  const p = parts(utc(date));
  return p ? `${p[0]}/${pad(p[1])}/${pad(p[2])}` : date;
}

/** Latin digits for Persian and Arabic ones. */
export const latinDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0)).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

/**
 * What a person typed → a Gregorian YYYY-MM-DD, or null when it is not a real date.
 * Accepts 1405/8/29, 1405-08-29, 14050829, Persian digits, and a Gregorian date (year 1900 and later).
 */
export function fromJalali(text: string): string | null {
  const s = latinDigits(text).trim();
  const m = /^(\d{4})\D+(\d{1,2})\D+(\d{1,2})$/.exec(s) ?? /^(\d{4})(\d{2})(\d{2})$/.exec(s);
  if (!m) return null;
  const [y, mo, d] = [+m[1], +m[2], +m[3]];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  if (y >= 1900) {
    const t = Date.UTC(y, mo - 1, d);
    return y <= 2200 && new Date(t).getUTCDate() === d ? iso(t) : null;
  }
  if (y < 1300 || y > 1500 || !F) return null;
  // Nowruz falls on 19–22 March: start just before it and step to the exact day.
  const dayOfYear = (mo <= 7 ? (mo - 1) * 31 : 186 + (mo - 7) * 30) + d - 1;
  const guess = Date.UTC(y + 621, 2, 18) + dayOfYear * DAY;
  for (let i = 0; i <= 5; i++) {
    const p = parts(guess + i * DAY);
    if (p && p[0] === y && p[1] === mo && p[2] === d) return iso(guess + i * DAY);
  }
  return null;
}

/**
 * While digits are typed the slashes are put in (14050829 → 1405/08/29), so a phone's number pad is
 * enough. A value typed with its own separators, such as 1405/8/29, is left as it is.
 */
export function maskJalali(value: string): string {
  const s = latinDigits(value);
  if (!/^\d+$|^\d{4}\/\d{0,2}$|^\d{4}\/\d{2}\/?\d{0,2}$/.test(s)) return s;
  const d = s.replace(/\D/g, "").slice(0, 8);
  return d.length > 6 ? `${d.slice(0, 4)}/${d.slice(4, 6)}/${d.slice(6)}` : d.length > 4 ? `${d.slice(0, 4)}/${d.slice(4)}` : d;
}
