import Link from "next/link";
import { Clock } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { formatDate, type Article } from "@/lib/articles";
import { href } from "@/lib/site";

type Props = { article: Article; locale: Locale; minRead: string; readMore: string };

export function ArticleCard({ article, locale, minRead, readMore }: Props) {
  return (
    <article className="group relative flex flex-col rounded-card border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-molecule-400 hover:shadow-lg hover:shadow-vault-900/5">
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="rounded-full bg-molecule-50 px-2.5 py-1 font-semibold text-molecule-700">
          {article.category}
        </span>
        <time dateTime={article.date}>{formatDate(locale, article.date)}</time>
      </div>
      <h3 className="mt-4 text-lg font-bold leading-snug text-vault-900">
        <Link href={href(locale, `knowledge-base/${article.slug}`)} className="after:absolute after:inset-0">
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{article.description}</p>
      <div className="mt-auto flex items-center justify-between pt-6 text-sm">
        <span className="inline-flex items-center gap-1.5 text-muted">
          <Clock className="size-4" aria-hidden="true" />
          {article.readingMinutes.toLocaleString(locale)} {minRead}
        </span>
        <span className="font-semibold text-molecule-700 group-hover:text-molecule-600">{readMore}</span>
      </div>
    </article>
  );
}
