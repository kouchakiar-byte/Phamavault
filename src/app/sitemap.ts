import type { MetadataRoute } from "next";
import { sections } from "@/content/sections";
import { siteConfig } from "@/content/site";
import { excipients, sops } from "@/data";
import { locales } from "@/i18n/config";
import { excipientSlug } from "@/lib/excipient-slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    ...["references", "tools"].map((path) => ({ path, priority: 0.9, changeFrequency: "weekly" as const })),
    ...sections
      .filter((s) => !s.href.startsWith("#") && s.href !== "tools")
      .map((s) => ({ path: s.href, priority: 0.8, changeFrequency: "weekly" as const })),
    ...excipients.items.map((x) => ({ path: `excipients/${excipientSlug(x.name)}`, priority: 0.7, changeFrequency: "monthly" as const })),
    ...sops.items.filter((s) => s.text).map((s) => ({ path: `qa/${s.code.toLowerCase()}`, priority: 0.6, changeFrequency: "monthly" as const })),
    ...["about", "contact", "terms", "privacy"].map((path) => ({ path, priority: 0.3, changeFrequency: "monthly" as const })),
  ];
  const url = (locale: string, path: string) => `${siteConfig.url}/${locale}${path ? `/${path}` : ""}`;
  const seen = new Set<string>();
  return locales.flatMap((locale) =>
    entries
      .filter((e) => !seen.has(`${locale}/${e.path}`) && seen.add(`${locale}/${e.path}`))
      .map((e) => ({
        url: url(locale, e.path),
        changeFrequency: e.changeFrequency,
        priority: locale === "fa" ? e.priority : Math.round(e.priority * 9) / 10,
        alternates: { languages: { ...Object.fromEntries(locales.map((l) => [l, url(l, e.path)])), "x-default": url("fa", e.path) } },
      })),
  );
}
