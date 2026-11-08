import { NextResponse, type NextRequest } from "next/server";
import { REF_CODE, REF_COOKIE } from "@/lib/ref-cookie";
import { GUEST_COOKIE, GUEST_ID, PATH_HEADER } from "@/lib/guest-cookie";
import excipients from "@/data/excipients.json";
import sops from "@/data/sops.json";
import { LOCALE_COOKIE, defaultLocale, hasLocale, type Locale } from "@/i18n/config";
import { excipientSlug } from "@/lib/excipient-slug";
import { isAiBot } from "@/lib/ai-bots";
import { allow, clientIp } from "@/lib/rate-limit";
import { isBlockedDevice } from "@/lib/blocked-devices";
import { siteConfig } from "@/content/site";

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && hasLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return ranked.map((r) => r.lang).find(hasLocale) ?? defaultLocale;
}

/** Old or guessed section addresses and where that content lives now. */
const MOVED: Record<string, string> = {
  "knowledge-base": "/handbooks",
  calculations: "/tools",
  calculators: "/tools",
  ctd: "#ctd",
  enterprise: "#enterprise",
};

// Sheets and SOPs that exist. Others would render the 404 page with a 200 status, which search engines report as a soft 404.
const sheetSlugs = new Set(excipients.items.map((x) => excipientSlug(x.name)));
const sopCodes = new Set(sops.items.filter((s) => s.text).map((s) => s.code.toLowerCase()));
sopCodes.add("forms"); // the GMP form generator lives beside the SOP pages
const known: Record<string, Set<string>> = { excipients: sheetSlugs, qa: sopCodes };

function redirect(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  const [pathname, hash] = path.split("#");
  url.pathname = pathname;
  url.hash = hash ? `#${hash}` : "";
  return NextResponse.redirect(url, 308);
}

/** Search engines that should crawl freely (user agents can be faked, so this only skips the page limit). */
const CRAWLERS = /googlebot|bingbot|yandex(bot)?|duckduckbot|applebot|enamad/i;

/**
 * Full-page loads per address: generous for a person, too few for a script copying the site page by
 * page. In-app navigations (RSC requests and prefetches) are not counted.
 */
function overLimit(request: NextRequest): boolean {
  if (request.headers.has("rsc") || request.headers.has("next-router-prefetch")) return false;
  if (CRAWLERS.test(request.headers.get("user-agent") ?? "")) return false;
  return !allow(`page:${clientIp(request.headers)}`, 240, 5 * 60_000);
}

function route(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;
  // AI training crawlers are refused outright; robots.txt (not matched here) still tells them so politely.
  if (isAiBot(request.headers.get("user-agent") ?? "")) {
    return new NextResponse("Automated collection of this site for AI training is not permitted.", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noai, noimageai" },
    });
  }
  if (overLimit(request)) {
    return new NextResponse("تعداد درخواست‌ها از این نشانی بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.\nToo many requests. Please try again in a few minutes.", {
      status: 429,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "300" },
    });
  }
  const [, lang, section, slug, ...rest] = pathname.split("/");

  if (!hasLocale(lang)) {
    // The bare domain always answers with the Persian home page itself (no redirect, whatever the
    // browser language or a saved choice), so checkers such as e-Namad that read
    // https://pharmavault.ir/ find the seal; other paths still redirect to the preferred language.
    if (pathname === "/") {
      request.nextUrl.pathname = `/${defaultLocale}`;
      return NextResponse.rewrite(request.nextUrl);
    }
    request.nextUrl.pathname = `/${preferredLocale(request)}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  if (section && MOVED[section]) return redirect(request, `/${lang}${MOVED[section]}`);

  const valid = section ? known[section] : undefined;
  if (valid && slug) {
    let key = "";
    try {
      key = decodeURIComponent(slug).toLowerCase();
    } catch {}
    if (rest.length || !valid.has(key)) {
      // Rewritten to the catch-all route, which answers with a real 404.
      request.nextUrl.pathname = `/${lang}/missing`;
      return NextResponse.rewrite(request.nextUrl);
    }
    if (key !== slug) return redirect(request, `/${lang}/${section}/${key}`);
  }
}

/** What a browser of a blocked account gets instead of any page or API answer. */
function blockedResponse(api: boolean): NextResponse {
  if (api) return NextResponse.json({ error: "blocked" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  const html = `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>PharmaVault</title></head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0b1f3a;color:#fff;font-family:Tahoma,sans-serif;text-align:center;padding:24px">
<div><p style="font-size:20px;font-weight:bold;margin:0 0 12px">دسترسی این مرورگر به فارماوالت مسدود شده است.</p>
<p style="margin:0 0 8px;opacity:.8">برای پیگیری با پشتیبانی تماس بگیرید: <bdi dir="ltr">${siteConfig.email}</bdi></p>
<p dir="ltr" style="margin:24px 0 0;opacity:.6;font-size:14px">Access to PharmaVault from this browser has been blocked.</p></div></body></html>`;
  return new NextResponse(html, { status: 403, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}

/** API routes that stay open to every browser: scheduled jobs and the payment gateway's return. */
const OPEN_API = /^\/api\/(cron|pay)(\/|$)/;

/** Referral links (?ref=code): the first code a visitor arrives with is kept for 30 days, until sign-up. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Browsers of blocked accounts see nothing of the site, signed in or not, however they arrive.
  if (!OPEN_API.test(pathname) && (await isBlockedDevice(request.cookies.get(GUEST_COOKIE)?.value))) {
    return blockedResponse(pathname.startsWith("/api/"));
  }
  if (pathname.startsWith("/api/")) return NextResponse.next();
  let response = route(request);
  if (response && response.status >= 400) return response;
  const secure = process.env.NODE_ENV === "production";
  // Pages that pass straight through carry their path to the section gate, which counts a
  // guest's free uses by page; a guest browser also gets a random id kept beside its IP.
  let gid = request.cookies.get(GUEST_COOKIE)?.value;
  const newGid = !gid || !GUEST_ID.test(gid) ? crypto.randomUUID().replace(/-/g, "") : null;
  if (newGid) gid = newGid;
  if (!response) {
    const headers = new Headers(request.headers);
    headers.set(PATH_HEADER, request.nextUrl.pathname);
    if (newGid) headers.set("cookie", `${request.headers.get("cookie") ?? ""}; ${GUEST_COOKIE}=${newGid}`.replace(/^; /, ""));
    response = NextResponse.next({ request: { headers } });
  }
  if (newGid) response.cookies.set(GUEST_COOKIE, newGid, { maxAge: 400 * 86_400, httpOnly: true, sameSite: "lax", secure, path: "/" });
  const ref = request.nextUrl.searchParams.get("ref")?.toLowerCase();
  if (ref && REF_CODE.test(ref) && !request.cookies.has(REF_COOKIE)) {
    response.cookies.set(REF_COOKIE, ref, { maxAge: 30 * 86_400, httpOnly: true, sameSite: "lax", secure, path: "/" });
  }
  return response;
}

export const config = {
  // Skip Next internals, metadata routes and any file with an extension.
  matcher: ["/((?!_next|api|sitemap.xml|robots.txt|.*\\..*).*)", "/api/:path*"],
};
