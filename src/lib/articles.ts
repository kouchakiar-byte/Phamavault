import type { ComponentType } from "react";
import type { Locale } from "@/i18n/config";

export type ArticleMeta = {
  title: string;
  description: string;
  /** ISO date, e.g. "2026-10-09". */
  date: string;
  category: string;
  readingMinutes: number;
};

export type Article = ArticleMeta & { slug: string };

/**
 * Published articles per locale. To add one, create
 * `src/content/articles/<locale>/<slug>.mdx` exporting `metadata`
 * and list its slug here.
 */
const registry: Record<Locale, readonly string[]> = {
  fa: ["preformulation-studies", "ctd-structure"],
  en: ["preformulation-studies", "ctd-structure"],
};

type ArticleModule = { default: ComponentType; metadata: ArticleMeta };

function load(locale: Locale, slug: string): Promise<ArticleModule> {
  return import(`@/content/articles/${locale}/${slug}.mdx`);
}

export function articleSlugs(locale: Locale): readonly string[] {
  return registry[locale];
}

export async function getArticles(locale: Locale): Promise<Article[]> {
  const articles = await Promise.all(
    registry[locale].map(async (slug) => ({ slug, ...(await load(locale, slug)).metadata })),
  );
  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getArticle(locale: Locale, slug: string) {
  if (!registry[locale].includes(slug)) return null;
  const mod = await load(locale, slug);
  return { slug, ...mod.metadata, Content: mod.default };
}

export function formatDate(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
