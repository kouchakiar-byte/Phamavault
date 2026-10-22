import Image from "next/image";
import { BellRing, ShieldAlert, Sparkles } from "lucide-react";
import { FreeHandbookFeature, HandbookDownload } from "@/components/free-handbook-feature";
import { BackLink, BiTitle, Container, MoleculePattern } from "@/components/ui";
import { freeHandbookCopy as t, freeHandbooks } from "@/content/free-handbooks";
import { copy } from "@/content/site";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(t.pageTitle, t.lead, "free-handbooks");

export default async function FreeHandbooksPage() {
  const locale = await getLocale();
  const [current] = freeHandbooks;
  const num = (n: number) => n.toLocaleString(locale === "fa" ? "fa-IR-u-nu-latn" : "en-US");

  return (
    <>
      <section className="relative isolate overflow-hidden bg-vault-900 text-white">
        <MoleculePattern className="text-white/[0.05]" />
        <div className="absolute -top-32 end-[-8%] -z-10 size-[28rem] rounded-full bg-capsule-500/15 blur-3xl" />
        <Container className="py-14 lg:py-18">
          <BackLink href={href(locale)} tone="light">
            {copy.nav.home[locale]}
          </BackLink>
          <div className="mt-6 max-w-3xl">
            <p className="inline-flex items-center gap-2 text-sm font-bold text-capsule-400">
              <Sparkles className="size-4" aria-hidden="true" />
              {t.eyebrow[locale]}
            </p>
            <BiTitle
              as="h1"
              text={t.pageTitle}
              locale={locale}
              className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl"
              primaryClassName="pv-gold-text font-extrabold leading-snug"
              secondaryClassName="text-vault-100"
            />
            <p className="mt-5 text-lg leading-relaxed text-vault-100/80">{t.lead[locale]}</p>
          </div>
        </Container>
      </section>

      <Container className="py-14 lg:py-18">
        <p className="mb-5 text-sm font-bold tracking-wide text-molecule-600">{t.thisWeek[locale]}</p>
        <FreeHandbookFeature handbook={current} locale={locale} details={false} />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Contents */}
          <section>
            <h2 className="text-2xl font-extrabold text-vault-900">{t.contents[locale]}</h2>
            <ol className="mt-6 grid gap-3 sm:grid-cols-2">
              {current.chapters.map((c, i) => (
                <li key={c.en} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm shadow-vault-900/5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-vault-900 text-sm font-extrabold text-capsule-400">
                    {num(i + 1)}
                  </span>
                  <span className="text-sm font-bold leading-relaxed text-vault-900">{c[locale]}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Sample pages, fanned */}
          <section>
            <h2 className="text-2xl font-extrabold text-vault-900">{t.preview[locale]}</h2>
            <div className="relative mt-6 h-80 sm:h-96">
              {current.samples.map((img, i) => (
                <div
                  key={img.src}
                  className={`absolute top-0 w-[46%] overflow-hidden rounded-lg shadow-xl shadow-vault-900/20 ring-1 ring-line ${
                    ["start-0 rotate-[-6deg]", "start-[27%] z-10 -translate-y-2", "end-0 rotate-[6deg]"][i]
                  }`}
                >
                  <Image src={img} alt={`${t.sampleAlt[locale]} ${num(i + 1)}`} sizes="(min-width: 1024px) 230px, 45vw" placeholder="blur" className="pointer-events-none h-auto w-full select-none" draggable={false} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-center">
              <HandbookDownload handbook={current} locale={locale} />
            </div>
          </section>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <aside className="rounded-3xl border border-capsule-400/60 bg-capsule-50 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-capsule-700">
              <ShieldAlert className="size-5" aria-hidden="true" />
              {t.rightsTitle[locale]}
            </h2>
            <p className="mt-3 leading-relaxed text-vault-900">{t.rights[locale]}</p>
          </aside>
          <aside className="rounded-3xl border border-molecule-400/40 bg-molecule-50 p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-molecule-700">
              <BellRing className="size-5" aria-hidden="true" />
              {t.next[locale]}
            </h2>
            <p className="mt-3 leading-relaxed text-vault-900">{t.nextText[locale]}</p>
          </aside>
        </div>
      </Container>
    </>
  );
}
