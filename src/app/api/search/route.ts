import { hasLocale } from "@/i18n/config";
import { isSearchScope, lockedSections, siteSearch } from "@/lib/site-search";

/** GET /api/search?q=avicel&lang=fa&n=5&scope=materials — the site-wide search, grouped by kind. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const lang = url.searchParams.get("lang") ?? "fa";
  const perGroup = Math.min(30, Math.max(1, Number(url.searchParams.get("n")) || 5));
  const scope = url.searchParams.get("scope") ?? "all";
  const result = await siteSearch(
    url.searchParams.get("q") ?? "",
    hasLocale(lang) ? lang : "fa",
    perGroup,
    await lockedSections(),
    isSearchScope(scope) ? scope : "all",
  );
  return Response.json(result, { headers: { "Cache-Control": "private, no-store" } });
}
