import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft, ArrowRight, CircleAlert, Cog, ListChecks, Search, ShieldCheck } from "lucide-react";
import { weeklyCaseCopy as t, weeklyCaseIndex, weeklyCases } from "@/content/weekly-cases";
import type { Locale } from "@/i18n/config";
import { isolateText } from "@/lib/bidi";
import { href } from "@/lib/paths";

/** The home page's case of the week; which case shows depends on today's date, so it is read per request. */
export function WeeklyCase({ locale }: { locale: Locale }) {
  return (
    <Suspense fallback={<div className="min-h-[40rem] rounded-card border border-line bg-paper" aria-busy="true" />}>
      <Card locale={locale} />
    </Suspense>
  );
}

async function Card({ locale }: { locale: Locale }) {
  await connection();
  const i = weeklyCaseIndex();
  const c = weeklyCases[i];
  const fa = locale === "fa";
  const say = (s: string) => (fa ? isolateText(s) : s);
  const Arrow = fa ? ArrowLeft : ArrowRight;
  return (
    <article className="relative isolate overflow-hidden rounded-card border border-vault-800 bg-vault-900 text-white shadow-xl">
      <div className="pointer-events-none absolute -end-24 -top-24 -z-10 size-72 rounded-full bg-molecule-500/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-32 -start-16 -z-10 size-72 rounded-full bg-capsule-400/10 blur-3xl" aria-hidden="true" />
      <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_1.35fr] lg:gap-12">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-capsule-400 px-3 py-1 text-vault-900">{t.eyebrow[locale]}</span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-white/80">{say(c.area[locale])}</span>
          </div>
          <h2 className="mt-5 text-2xl font-bold leading-snug sm:text-3xl">{say(c.title[locale])}</h2>
          <p className="mt-2 text-sm text-white/60">{t.lead[locale]}</p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-capsule-400">
              <CircleAlert className="size-4" aria-hidden="true" />
              {t.symptom[locale]}
            </p>
            <p className="mt-2 leading-relaxed text-white/90">{say(c.symptom[locale])}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-molecule-400/20 bg-molecule-500/10 p-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-molecule-400">
              <Cog className="size-4" aria-hidden="true" />
              {t.mechanism[locale]}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/85">{say(c.mechanism[locale])}</p>
          </div>
          <p className="mt-5 text-xs text-white/50">
            {t.refs[locale]}: <bdi dir="ltr" className="font-mono">{c.refs}</bdi>
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              [t.causes, c.causes, Search],
              [t.checks, c.checks, ListChecks],
              [t.actions, c.actions, ShieldCheck],
            ] as const
          ).map(([label, items, Icon], k) => (
            <div key={label.en} className={`rounded-2xl bg-white p-5 text-ink${k === 2 ? " sm:col-span-2" : ""}`}>
              <p className="flex items-center gap-2 text-sm font-bold text-vault-900">
                <Icon className="size-4 text-molecule-600" aria-hidden="true" />
                {label[locale]}
              </p>
              <ol className="mt-3 space-y-2.5 text-sm leading-relaxed sm:space-y-3">
                {items.map((item, n) => (
                  <li key={n} className="flex gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-molecule-50 font-mono text-[11px] font-bold text-molecule-700">{n + 1}</span>
                    <span>{say(item[locale])}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
            <span className="text-xs text-white/50">
              {t.of[locale].replace("{n}", String(i + 1)).replace("{total}", String(weeklyCases.length))}
            </span>
            <Link
              href={href(locale, c.more.path)}
              className="inline-flex items-center gap-2 rounded-full bg-molecule-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-molecule-400"
            >
              {c.more.label[locale]}
              <Arrow className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
