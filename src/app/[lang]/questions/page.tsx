import Link from "next/link";
import { SimpleHeader } from "@/components/simple-header";
import { Container } from "@/components/ui";
import { questions, questionsCopy as t, type Topic } from "@/content/questions";
import { copy } from "@/content/site";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(t.title, t.lead, "questions");

export default async function QuestionsPage() {
  const locale = await getLocale();
  const topics = Object.keys(t.topics) as Topic[];
  return (
    <>
      <SimpleHeader locale={locale} title={t.title} lead={t.lead} back={{ href: href(locale), label: copy.nav.home }} />
      <Container className="space-y-10 py-12">
        {topics.map((topic) => (
          <section key={topic}>
            <h2 className="mb-4 text-xl font-bold text-vault-900">{t.topics[topic][locale]}</h2>
            <ul className="grid gap-3 md:grid-cols-2">
              {questions
                .filter((q) => q.topic === topic)
                .map((q) => (
                  <li key={q.slug}>
                    <Link href={href(locale, `questions/${q.slug}`)} className="block h-full rounded-card border border-line bg-white p-4 transition hover:border-molecule-500 hover:shadow-sm">
                      <span className="block font-bold text-vault-900">{q.q[locale]}</span>
                      <span className="mt-1 line-clamp-2 block text-sm leading-6 text-muted">{q.short[locale]}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
