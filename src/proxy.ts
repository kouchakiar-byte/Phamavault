import { NextResponse, type NextRequest } from "next/server";
import excipients from "@/data/excipients.json";
import sops from "@/data/sops.json";
import { LOCALE_COOKIE, defaultLocale, hasLocale, type Locale } from "@/i18n/config";
import { excipientSlug } from "@/lib/excipient-slug";

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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, lang, section, slug, ...rest] = pathname.split("/");

  if (!hasLocale(lang)) {
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
