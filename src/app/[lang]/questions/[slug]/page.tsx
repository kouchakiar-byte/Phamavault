import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookOpen, Wrench } from "lucide-react";
import { SimpleHeader } from "@/components/simple-header";
import { Container } from "@/components/ui";
import { freeHandbooks } from "@/content/free-handbooks";
import { questions, questionsCopy as t } from "@/content/questions";
import { coaCopy } from "@/content/coa-review";
import { siteConfig } from "@/content/site";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export function generateStaticParams() {
  return questions.map((q) => ({ slug: q.slug }));
}

const find = async (params: PageProps<"/[lang]/questions/[slug]">["params"]) => {
  const { slug } = await params;
  const q = questions.find((x) => x.slug === slug);
  if (!q) notFound();
  return q;
};

export async function generateMetadata({ params }: PageProps<"/[lang]/questions/[slug]">): Promise<Metadata> {
  const [locale, q] = await Promise.all([getLocale(), find(params)]);
  const meta = await pageMetadata(q.q, q.short, `questions/${q.slug}`);
  return { ...meta, title: q.q[locale], openGraph: { ...meta.openGraph, title: q.q[locale] } };
}

export default async function QuestionPage({ params }: PageProps<"/[lang]/questions/[slug]">) {
  const [locale, q] = await Promise.all([getLocale(), find(params)]);
  const handbook = q.more?.handbook ? freeHandbooks.find((h) => h.slug === q.more?.handbook) : undefined;
  const related = questions.filter((x) => x.topic === q.topic && x.slug !== q.slug);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: q.q[locale],
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: [q.short[locale], ...q.points.map((p) => p[locale])].join(" ").replace(/[⁦-⁩]/g, ""),
        url: `${siteConfig.url}/${locale}/questions/${q.slug}`,
        author: { "@type": "Organization", name: "PharmaVault" },
      },
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleHeader locale={locale} title={q.q} eyebrow={t.topics[q.topic]} back={{ href: href(locale, "questions"), label: t.all }} />
      <Container className="py-12">
        <article className="mx-auto max-w-3xl space-y-8">
          <section className="rounded-card border border-molecule-500/30 bg-molecule-50/60 p-5">
            <h2 className="mb-2 text-sm font-bold text-molecule-700">{t.answer[locale]}</h2>
            <p className="text-lg leading-9 text-ink">{q.short[locale]}</p>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold text-vault-900">{t.details[locale]}</h2>
            <ul className="list-disc space-y-2 ps-5 leading-8 text-ink">
              {q.points.map((p, i) => (
                <li key={i}>{p[locale]}</li>
              ))}
            </ul>
          </section>
          {(handbook || q.more?.path) && (
            <section className="flex flex-wrap items-center gap-3 rounded-card border border-capsule-400/40 bg-capsule-400/10 p-5">
              <span className="font-bold text-vault-900">{t.more[locale]}:</span>
              {handbook && (
                <Link href={href(locale, "free-handbooks")} className="inline-flex items-center gap-2 rounded-full bg-vault-900 px-4 py-2 text-sm font-semibold text-white hover:bg-vault-800">
                  <BookOpen className="size-4" aria-hidden="true" />
                  {t.handbook[locale]}: {handbook.title[locale]}
                </Link>
              )}
              {q.more?.path && (
                <Link href={href(locale, q.more.path)} className="inline-flex items-center gap-2 rounded-full bg-molecule-600 px-4 py-2 text-sm font-semibold text-white hover:bg-molecule-700">
                  <Wrench className="size-4" aria-hidden="true" />
                  {t.tool[locale]}: {coaCopy.title[locale]}
                </Link>
              )}
            </section>
          )}
          <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="font-bold text-vault-900">{t.refs[locale]}:</span>
            {q.refs.map((r) => (
              <bdi key={r} dir="ltr" className="rounded-lg border border-line bg-white px-2 py-0.5">
                {r}
              </bdi>
            ))}
          </p>
          <p className="text-xs text-muted">{t.note[locale]}</p>
          {related.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold text-vault-900">{t.related[locale]}</h2>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={href(locale, `questions/${r.slug}`)} className="text-molecule-700 hover:underline">
                      {r.q[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </Container>
    </>
  );
}
