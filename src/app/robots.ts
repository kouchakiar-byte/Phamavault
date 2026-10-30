import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Account, admin and API routes are private (and noindex); crawling them only wastes crawl budget.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/fa/account", "/en/account", "/fa/admin", "/en/admin"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
