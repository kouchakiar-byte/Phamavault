import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { databaseConfigured, db } from "./db";

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

const SESSION_COOKIE = "pv_session";
const SESSION_DAYS = 30;
const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;

export type User = { id: string; mobile: string; name: string; isAdmin: boolean };

/** 09xxxxxxxxx from any common way of writing an Iranian mobile number, or null. */
export function normalizeMobile(value: string): string | null {
  const digits = value
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[^\d]/g, "");
  const local = digits.replace(/^(0098|98)/, "0").replace(/^9/, "09");
  return /^09\d{9}$/.test(local) ? local : null;
}

/** Mobiles listed in ADMIN_MOBILES (comma separated) can open the admin page. */
const isAdminMobile = (mobile: string): boolean =>
  (process.env.ADMIN_MOBILES ?? "")
    .split(/[,\s]+/)
    .map(normalizeMobile)
    .includes(mobile);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await scryptAsync(password, Buffer.from(salt, "base64"), expected.length);
  return timingSafeEqual(actual, expected);
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

async function clientInfo() {
  const h = await headers();
  return {
    ip: h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null,
    userAgent: h.get("user-agent")?.slice(0, 300) ?? null,
    secure: h.get("x-forwarded-proto") === "https",
  };
}

/**
 * Signs the user in on this device and signs them out everywhere else:
 * a licence is for one user on one device at a time.
 */
export async function startSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const { ip, userAgent, secure } = await clientInfo();
  const pool = await db();
  await pool.query("delete from sessions where user_id = $1", [userId]);
  await pool.query(
    `insert into sessions (token_hash, user_id, ip, user_agent, expires_at)
     values ($1, $2, $3, $4, now() + make_interval(days => $5))`,
    [sha256(token), userId, ip, userAgent, SESSION_DAYS],
  );
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token && databaseConfigured()) {
    await (await db()).query("delete from sessions where token_hash = $1", [sha256(token)]);
  }
  store.delete(SESSION_COOKIE);
}

/** The signed-in user for this request, or null. Reads the session cookie. */
export const getUser = cache(async (): Promise<User | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !databaseConfigured()) return null;
  const { rows } = await (await db()).query<{ id: string; mobile: string; name: string }>(
    `select u.id, u.mobile, u.name from sessions s join users u on u.id = s.user_id
     where s.token_hash = $1 and s.expires_at > now()`,
    [sha256(token)],
  );
  const row = rows[0];
  return row ? { ...row, isAdmin: isAdminMobile(row.mobile) } : null;
});

export type LoginResult = "ok" | "invalid" | "locked";

/** Checks the password, locking the account for a while after repeated failures. */
export async function checkLogin(mobile: string, password: string): Promise<{ result: LoginResult; userId?: string }> {
  const pool = await db();
  const { rows } = await pool.query<{ id: string; password_hash: string; locked: boolean }>(
    "select id, password_hash, coalesce(locked_until > now(), false) as locked from users where mobile = $1",
    [mobile],
  );
  const user = rows[0];
  if (!user) {
    // Same work as a real check, so timing doesn't reveal which mobiles exist.
    await hashPassword(password);
    return { result: "invalid" };
  }
  if (user.locked) return { result: "locked" };
  if (!(await verifyPassword(password, user.password_hash))) {
    await pool.query(
      `update users set failed_logins = failed_logins + 1,
         locked_until = case when failed_logins + 1 >= $2 then now() + make_interval(mins => $3) else locked_until end
       where id = $1`,
      [user.id, MAX_FAILED_LOGINS, LOCK_MINUTES],
    );
    return { result: "invalid" };
  }
  await pool.query("update users set failed_logins = 0, locked_until = null where id = $1", [user.id]);
  return { result: "ok", userId: user.id };
}
