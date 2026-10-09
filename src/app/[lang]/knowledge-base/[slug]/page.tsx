import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/ui";
import { locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { articleSlugs, formatDate, getArticle } from "@/lib/articles";
import { href } from "@/lib/site";

export function generateStaticParams() {
  // Slugs may differ per locale, so emit the union; unknown pairs 404 below.
  const slugs = new Set(locales.flatMap((l) => articleSlugs(l)));
  return [...slugs].map((slug) => ({ slug }));
}

async function load(params: PageProps<"/[lang]/knowledge-base/[slug]">["params"]) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const article = await getArticle(locale, slug);
  if (!article) notFound();
  return { locale, article };
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/knowledge-base/[slug]">): Promise<Metadata> {
  const { locale, article } = await load(params);
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: href(locale, `knowledge-base/${article.slug}`) },
    openGraph: { type: "article", publishedTime: article.date },
  };
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/knowledge-base/[slug]">) {
  const [{ locale, article }, t] = await Promise.all([load(params), getDictionary()]);
  const { Content } = article;

  return (
    <>
      <PageHero
        title={article.title}
        lead={article.description}
        breadcrumb={{ href: href(locale, "knowledge-base"), label: t.knowledge.backToList }}
      />
      <Container className="py-14 lg:py-16">
        <div className="mb-10 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span className="rounded-full bg-molecule-50 px-3 py-1 font-semibold text-molecule-700">
            {article.category}
          </span>
          <time dateTime={article.date}>{formatDate(locale, article.date)}</time>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {article.readingMinutes.toLocaleString(locale)} {t.knowledge.minRead}
          </span>
        </div>
        <div className="prose-pv">
          <Content />
        </div>
      </Container>
    </>
  );
}
