import Image from "next/image";
import Link from "next/link";
import { BookOpenCheck, Download, Sparkles } from "lucide-react";
import { freeHandbookCopy as t, freeHandbooks, handbookUrl, issueWeek, type FreeHandbook } from "@/content/free-handbooks";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/paths";
import { HandbookArchive, type ArchiveItem, type ArchiveLabels } from "./handbook-archive";
import { BiTitle, MoleculePattern } from "./ui";

const fmt = (s: string, values: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(values[k]));
const numFor = (locale: Locale) => (n: number) => n.toLocaleString(locale === "fa" ? "fa-IR-u-nu-latn" : "en-US");

/** "Issue 2 · 2nd week of Aban 1405" */
export const issueLabel = (handbook: FreeHandbook, locale: Locale) =>
  `${fmt(t.issue[locale], { n: numFor(locale)(handbook.issue) })} · ${issueWeek(handbook.published)[locale]}`;

/** Earlier issues (all but this week's), in order of issue number, with the labels of the archive. */
export function handbookArchive(locale: Locale) {
  const num = numFor(locale);
  const items: ArchiveItem[] = freeHandbooks
    .slice(1)
    .sort((a, b) => a.issue - b.issue)
    .map((h) => ({
      slug: h.slug,
      label: issueLabel(h, locale),
      title: h.title[locale],
      subtitle: h.subtitle[locale],
      size: fmt(t.size[locale], { s: num(h.sizeMb), p: num(h.pages) }),
      url: handbookUrl(h),
      cover: h.cover,
      coverAlt: h.coverAlt[locale],
    }));
  const labels: ArchiveLabels = {
    button: t.archive[locale],
    title: t.archiveTitle[locale],
    lead: t.archiveLead[locale],
    subscribers: t.subscribers[locale],
    download: t.downloadPrevious[locale],
    checking: t.checking[locale],
    lockedTitle: t.lockedTitle[locale],
    lockedText: t.lockedText[locale],
    buy: t.buy[locale],
    login: t.login[locale],
    close: t.close[locale],
  };
  const links = {
    buyHref: href(locale, "account/buy"),
    loginHref: `${href(locale, "account/login")}?next=${encodeURIComponent(href(locale, "free-handbooks"))}`,
  };
  return { items, labels, links, count: num(items.length) };
}

/** The download button: the PDF itself, free and without signing in. */
export function HandbookDownload({ handbook, locale }: { handbook: FreeHandbook; locale: Locale }) {
  return (
    <a
      href={handbookUrl(handbook)}
      download
      className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-capsule-400 via-[#f3dc8f] to-capsule-500 px-7 py-3.5 text-base font-extrabold text-vault-900 shadow-lg shadow-capsule-500/30 ring-1 ring-white/40 transition hover:brightness-105 hover:shadow-capsule-400/50"
    >
      <Download className="size-5 transition group-hover:translate-y-0.5" aria-hidden="true" />
      {t.download[locale]}
    </a>
  );
}

/** This week's free handbook: the cover beside its title, key numbers and the free download. */
export function FreeHandbookFeature({ handbook, locale, details = true }: { handbook: FreeHandbook; locale: Locale; details?: boolean }) {
  const num = numFor(locale);
  const archive = handbookArchive(locale);
  return (
    <div className="relative isolate grid gap-10 overflow-hidden rounded-3xl bg-vault-900 px-6 py-10 text-white shadow-2xl shadow-vault-900/25 sm:px-10 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:px-14 lg:py-14">
      <MoleculePattern className="-z-10 text-white/[0.05]" />
      <div className="absolute -top-40 start-[-6rem] -z-10 size-[28rem] rounded-full bg-molecule-500/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 end-[-4rem] -z-10 size-[26rem] rounded-full bg-capsule-500/20 blur-3xl" aria-hidden="true" />

      <div>
        <p className="inline-flex items-center gap-2 rounded-full border border-capsule-400/40 bg-capsule-400/10 px-3.5 py-1.5 text-sm font-bold text-capsule-400">
          <Sparkles className="size-4" aria-hidden="true" />
          {t.eyebrow[locale]} · {issueLabel(handbook, locale)}
        </p>
        <BiTitle
          as="h2"
          text={handbook.title}
          locale={locale}
          stacked
          className="mt-5 text-3xl font-bold sm:text-4xl"
          primaryClassName="pv-gold-text font-extrabold leading-snug drop-shadow-[0_2px_10px_rgba(220,189,109,0.35)]"
          secondaryClassName="text-vault-100"
        />
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-vault-100/85">{handbook.subtitle[locale]}</p>

        <dl className="mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
          {handbook.stats.map((s) => (
            <div key={s.label.en} className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3 text-center backdrop-blur-sm">
              <dt className="sr-only">{s.label[locale]}</dt>
              <dd>
                <span className="block text-3xl font-extrabold leading-none text-capsule-400" dir="ltr">
                  {num(s.value)}
                  {s.plus && "+"}
                </span>
                <span className="mt-1.5 block text-xs font-semibold text-vault-100/75">{s.label[locale]}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <HandbookDownload handbook={handbook} locale={locale} />
          <HandbookArchive {...archive} />
          {details && (
            <Link
              href={href(locale, "free-handbooks")}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              <BookOpenCheck className="size-4" aria-hidden="true" />
              {t.details[locale]}
            </Link>
          )}
        </div>
        <p className="mt-4 text-sm text-vault-100/60">
          <span className="me-2 rounded-full bg-molecule-500/20 px-2.5 py-0.5 text-xs font-bold text-molecule-400">{t.free[locale]}</span>
          {fmt(t.size[locale], { s: num(handbook.sizeMb), p: num(handbook.pages) })}
        </p>
      </div>

      {/* The cover, tilted on a gold glow */}
      <div className="relative order-first mx-auto w-44 sm:w-64 lg:order-none lg:w-72">
        <div className="absolute inset-4 -z-10 rounded-2xl bg-capsule-400/40 blur-2xl" aria-hidden="true" />
        <div className="rotate-[-4deg] overflow-hidden rounded-xl shadow-2xl shadow-black/50 ring-1 ring-capsule-400/50 transition duration-500 hover:rotate-0 rtl:rotate-[4deg] rtl:hover:rotate-0">
          <Image src={handbook.cover} alt={handbook.coverAlt[locale]} sizes="(min-width: 1024px) 288px, 256px" placeholder="blur" className="h-auto w-full" />
        </div>
        <span className="absolute -top-3 end-[-0.75rem] rotate-12 rounded-full bg-gradient-to-br from-capsule-400 to-capsule-600 px-4 py-2 text-sm font-extrabold text-vault-900 shadow-lg shadow-black/30">
          {t.free[locale]}
        </span>
      </div>
    </div>
  );
}
