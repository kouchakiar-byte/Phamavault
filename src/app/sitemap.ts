import type { MetadataRoute } from "next";
import { sections } from "@/content/sections";
import { siteConfig } from "@/content/site";
import { sops } from "@/data";
import { locales } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    ...sections.filter((s) => !s.href.startsWith("#")).map((s) => s.href),
    ...sops.items.filter((s) => s.text).map((s) => `qa/${s.code.toLowerCase()}`),
  ];
  const url = (locale: string, path: string) => `${siteConfig.url}/${locale}${path ? `/${path}` : ""}`;
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: url(locale, path),
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(l, path)])) },
    })),
  );
}
