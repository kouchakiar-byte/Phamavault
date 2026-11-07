import { Suspense } from "react";
import { Lock, MessageCircleQuestion } from "lucide-react";
import interviewPhoto from "@/assets/photos/sections/interview.webp";
import { SimpleHeader } from "@/components/simple-header";
import { TrialBanner, sectionAccess } from "@/components/section-gate";
import { ButtonLink, Container } from "@/components/ui";
import { account } from "@/content/account";
import { interviewCopy as t, interviewQuestions, isFreeQuestion, withCounts, type InterviewArea, type InterviewQuestion } from "@/content/interview";
import { copy } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { isolateText } from "@/lib/bidi";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

const lead = { en: withCounts(t.lead.en), fa: withCounts(t.lead.fa) };

export const generateMetadata = () => pageMetadata(t.title, lead, "interview");

const areas: InterviewArea[] = ["qc", "qa", "rnd", "ra", "prod", "gen"];
const levelTone = { basic: "bg-molecule-50 text-molecule-700", mid: "bg-capsule-50 text-capsule-700", advanced: "bg-vault-100 text-vault-800" };

/** The six free answers as FAQ markup; the others are not on the page for readers without access. */
const faqSchema = (locale: Locale) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: interviewQuestions.filter(isFreeQuestion).map((q) => ({
      "@type": "Question",
      name: q.q[locale],
      acceptedAnswer: { "@type": "Answer", text: q.a[locale] },
    })),
  });

export default async function InterviewPage() {
  const locale = await getLocale();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema(locale) }} />
      <SimpleHeader locale={locale} title={t.title} lead={lead} back={{ href: href(locale), label: copy.nav.home }} photo={interviewPhoto} />
      <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
        <Questions locale={locale} />
      </Suspense>
    </>
  );
}

async function Questions({ locale }: { locale: Locale }) {
  // One page holds every answer, so guests do not spend section uses here: they see the free questions.
  const access = await sectionAccess("qc", { meter: false });
  const open = access.kind === "free" || access.kind === "open" || access.kind === "trial";
  const say = (s: string) => (locale === "fa" ? isolateText(s) : s);
  return (
    <>
      {access.kind === "trial" && <TrialBanner locale={locale} day={access.day} />}
      <Container className="py-12">
        <p className="mb-8 flex items-start gap-3 rounded-card border border-molecule-400/40 bg-molecule-50 px-5 py-4 text-sm leading-relaxed text-ink">
          <MessageCircleQuestion className="mt-0.5 size-5 shrink-0 text-molecule-600" aria-hidden="true" />
          {t.tip[locale]}
        </p>
        {!open && <LockedNotice locale={locale} signedIn={access.kind === "trialOver"} />}
        <nav className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-label={t.title[locale]}>
          {areas.map((area) => (
            <a key={area} href={`#${area}`} className="flex items-center justify-center rounded-full border border-line bg-white px-2 py-2 text-center text-[0.8rem] font-semibold leading-snug text-vault-900 hover:border-molecule-500 sm:px-4 sm:text-sm">
              {(t.areasShort[area] ?? t.areas[area])[locale]} · {interviewQuestions.filter((q) => q.area === area).length}
            </a>
          ))}
        </nav>
        <div className="space-y-14">
          {areas.map((area) => (
            <section key={area} id={area} className="scroll-mt-24">
              <h2 className="mb-5 text-2xl font-bold text-vault-900">{t.areas[area][locale]}</h2>
              <ol className="space-y-4">
                {interviewQuestions
                  .filter((q) => q.area === area)
                  .map((q, i) => (
                    <Item key={q.id} q={q} n={i + 1} locale={locale} show={open || isFreeQuestion(q)} say={say} />
                  ))}
              </ol>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}

function Item({ q, n, locale, show, say }: { q: InterviewQuestion; n: number; locale: Locale; show: boolean; say: (s: string) => string }) {
  return (
    <li className="rounded-card border border-line bg-white p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-vault-900 font-mono text-sm font-bold text-white">{n}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className={`rounded-full px-2.5 py-0.5 ${levelTone[q.level]}`}>{t.levels[q.level][locale]}</span>
            {isFreeQuestion(q) && <span className="rounded-full bg-capsule-400 px-2.5 py-0.5 text-vault-900">{t.free[locale]}</span>}
          </div>
          <h3 className="mt-2 text-lg font-bold leading-snug text-vault-900">{say(q.q[locale])}</h3>
          {show ? (
            <>
              {q.aim && (
                <>
                  <p className="mt-3 text-xs font-bold text-capsule-700">{t.aim[locale]}</p>
                  <p className="mt-1 leading-8 text-ink">{say(q.aim[locale])}</p>
                </>
              )}
              <p className="mt-3 text-xs font-bold text-molecule-700">{(q.aim ? t.sample : t.answer)[locale]}</p>
              <p className="mt-1 leading-8 text-ink">{say(q.a[locale])}</p>
              {q.avoid && (
                <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm leading-7 text-red-900">
                  <span className="font-bold">{t.avoid[locale]}: </span>
                  {say(q.avoid[locale])}
                </p>
              )}
              {q.refs && (
                <p className="mt-3 text-xs text-muted">
                  {t.refs[locale]}: <bdi dir="ltr">{q.refs}</bdi>
                </p>
              )}
            </>
          ) : (
            <div className="relative mt-3 overflow-hidden rounded-xl bg-paper p-4" aria-label={t.lockedAnswer[locale]}>
              <div className="space-y-2 blur-[3px]" aria-hidden="true">
                <div className="h-3 w-11/12 rounded bg-line" />
                <div className="h-3 w-full rounded bg-line" />
                <div className="h-3 w-3/4 rounded bg-line" />
              </div>
              <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-semibold text-vault-900">
                <Lock className="size-4 text-molecule-600" aria-hidden="true" />
                {t.lockedAnswer[locale]}
              </span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function LockedNotice({ locale, signedIn }: { locale: Locale; signedIn: boolean }) {
  const g = account.gate;
  const here = href(locale, "interview");
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-card border border-capsule-400/50 bg-gradient-to-br from-capsule-50 via-white to-molecule-50 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-lg font-bold text-vault-900">{withCounts(t.lockedTitle[locale], interviewQuestions.filter((q) => !isFreeQuestion(q)).length)}</p>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">{t.lockedText[locale]}</p>
      </div>
      {signedIn ? (
        <ButtonLink href={href(locale, "account/buy")}>{g.trialBuy[locale]}</ButtonLink>
      ) : (
        <ButtonLink href={`${href(locale, "account/register")}?next=${encodeURIComponent(here)}`}>{g.signup[locale]}</ButtonLink>
      )}
    </div>
  );
}
