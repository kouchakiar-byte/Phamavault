import type { Locale } from "@/i18n/config";

/** Locale-prefixed link: `href("fa", "tools")` → `/fa/tools`, `href("fa", "#plans")` → `/fa#plans`. */
export function href(locale: Locale, path = ""): string {
  if (!path) return `/${locale}`;
  if (path.startsWith("#")) return `/${locale}${path}`;
  return `/${locale}/${path.replace(/^\//, "")}`;
}
