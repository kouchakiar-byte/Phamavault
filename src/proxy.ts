import { NextResponse, type NextRequest } from "next/server";
import excipients from "@/data/excipients.json";
import sops from "@/data/sops.json";
import { LOCALE_COOKIE, defaultLocale, hasLocale, type Locale } from "@/i18n/config";
import { excipientSlug } from "@/lib/excipient-slug";
import { isAiBot } from "@/lib/ai-bots";
import { allow, clientIp } from "@/lib/rate-limit";

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

export function proxy(request: NextRequest) {
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

export const config = {
  // Skip Next internals, metadata routes and any file with an extension.
  matcher: ["/((?!_next|api|sitemap.xml|robots.txt|.*\\..*).*)"],
};
