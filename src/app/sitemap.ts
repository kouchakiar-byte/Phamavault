import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { articleSlugs } from "@/lib/articles";
import { sections, siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", ...sections.map((s) => s.slug)];
  return locales.flatMap((locale) => [
    ...pages.map((path) => ({
      url: `${siteConfig.url}/${locale}${path ? `/${path}` : ""}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.url}/${l}${path ? `/${path}` : ""}`]),
        ),
      },
    })),
    ...articleSlugs(locale).map((slug) => ({
      url: `${siteConfig.url}/${locale}/knowledge-base/${slug}`,
    })),
  ]);
}
