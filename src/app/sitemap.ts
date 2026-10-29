import type { MetadataRoute } from "next";
import { sections } from "@/content/sections";
import { siteConfig } from "@/content/site";
import { excipients, generalChapters, sops } from "@/data";
import { locales } from "@/i18n/config";
import { chapterSlug } from "@/lib/chapter-slug";
import { excipientSlug } from "@/lib/excipient-slug";

export default function sitemap(): MetadataRoute.Sitemap {
  // `fa`: Persian-only pages, listed once at their Persian address.
  const entries: { path: string; priority: number; changeFrequency: "weekly" | "monthly"; fa?: boolean }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    ...["references", "references/general-chapters", "regulatory/bioequivalence", "tools", "free-handbooks"].map((path) => ({ path, priority: 0.9, changeFrequency: "weekly" as const })),
    ...sections
      .filter((s) => !s.href.startsWith("#") && s.href !== "tools")
      .map((s) => ({ path: s.href, priority: 0.8, changeFrequency: "weekly" as const })),
    ...excipients.items.map((x) => ({ path: `excipients/${excipientSlug(x.name)}`, priority: 0.7, changeFrequency: "monthly" as const })),
    ...generalChapters.items.map((c) => ({ path: `references/general-chapters/${chapterSlug(c.ph, c.code)}`, priority: 0.6, changeFrequency: "monthly" as const })),
    ...sops.items.filter((s) => s.text).map((s) => ({ path: `qa/${s.code.toLowerCase()}`, priority: 0.6, changeFrequency: "monthly" as const, fa: true })),
    ...["about", "contact", "terms", "privacy"].map((path) => ({ path, priority: 0.3, changeFrequency: "monthly" as const })),
  ];
  const url = (locale: string, path: string) => `${siteConfig.url}/${locale}${path ? `/${path}` : ""}`;
  const seen = new Set<string>();
  return locales.flatMap((locale) =>
    entries
      .filter((e) => (!e.fa || locale === "fa") && !seen.has(`${locale}/${e.path}`) && seen.add(`${locale}/${e.path}`))
      .map((e) => ({
        url: url(locale, e.path),
        changeFrequency: e.changeFrequency,
        priority: locale === "fa" ? e.priority : Math.round(e.priority * 9) / 10,
        ...(e.fa
          ? {}
          : { alternates: { languages: { ...Object.fromEntries(locales.map((l) => [l, url(l, e.path)])), "x-default": url("fa", e.path) } } }),
      })),
  );
}
