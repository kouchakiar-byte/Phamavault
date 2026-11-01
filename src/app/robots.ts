import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { AI_BOTS } from "@/lib/ai-bots";

export default function robots(): MetadataRoute.Robots {
  return {
    // Account, admin, API and client demo routes are private (and noindex); crawling them only wastes crawl budget.
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/demo/", "/fa/account", "/en/account", "/fa/admin", "/en/admin"] },
      // AI training crawlers: nothing (search engines above are unaffected).
      { userAgent: AI_BOTS, disallow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
