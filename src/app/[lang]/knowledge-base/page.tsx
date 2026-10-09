import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getArticles } from "@/lib/articles";
import { href, sections } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  return {
    title: t.sections.knowledgeBase.title,
    description: t.sections.knowledgeBase.short,
    alternates: { canonical: href(locale, "knowledge-base") },
  };
}

export default async function KnowledgeBasePage() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  const articles = await getArticles(locale);
  const icon = sections.find((s) => s.slug === "knowledge-base")?.icon;

  return (
    <>
      <PageHero
        title={t.sections.knowledgeBase.title}
        lead={t.sections.knowledgeBase.short}
        icon={icon}
        breadcrumb={{ href: href(locale), label: t.nav.home }}
      />
      <Container className="py-16 lg:py-20">
        {articles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard
                key={a.slug}
                article={a}
                locale={locale}
                minRead={t.knowledge.minRead}
                readMore={t.knowledge.readMore}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted">{t.knowledge.empty}</p>
        )}
      </Container>
    </>
  );
}
