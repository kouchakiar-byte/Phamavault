"use client";

import { useEffect, useRef } from "react";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { DnaHelix } from "./dna-helix";

type Stat = { value: number; label: Bi };

const DURATION = 1400;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/** A number that counts up from zero when it first comes into view, and again on hover. */
function CountUp({ value, locale }: { value: number; locale: Locale }) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => Math.round(n).toLocaleString(locale === "fa" ? "fa-IR-u-nu-latn" : "en-US");

  useEffect(() => {
    const el = ref.current;
    const card = el?.closest("[data-stat]");
    if (!el || !card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let running = false;
    const run = () => {
      if (running) return;
      running = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        el.textContent = format(value * ease(t));
        if (t < 1) frame = requestAnimationFrame(tick);
        else running = false;
      };
      frame = requestAnimationFrame(tick);
    };
    el.textContent = format(0);
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          seen.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    seen.observe(card);
    card.addEventListener("pointerenter", run);
    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      card.removeEventListener("pointerenter", run);
      el.textContent = format(value);
    };
    // format depends only on locale
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, locale]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}

/** The vault at a glance: counters in cards, the first one highlighted, a turning DNA helix beside them. */
export function HeroStats({ stats, locale }: { stats: Stat[]; locale: Locale }) {
  return (
    <div className="flex max-w-2xl items-stretch gap-3 lg:mt-9">
      <dl className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ value, label }, i) => {
          const lead = i === 0;
          return (
            <div
              key={label.en}
              data-stat
              className={`group flex min-h-[7.5rem] cursor-default flex-col-reverse justify-between rounded-2xl border px-4 pb-3.5 pt-4 transition duration-300 ease-out hover:-translate-y-1 motion-reduce:transform-none ${
                lead
                  ? "border-capsule-400 bg-capsule-400 bg-gradient-to-br from-capsule-400 to-capsule-500 text-vault-950 shadow-lg shadow-capsule-500/25"
                  : "border-white/15 bg-white/[0.04] hover:border-capsule-400/70 hover:bg-white/[0.08]"
              }`}
            >
              <dt className={`mt-2 text-xs font-medium leading-snug ${lead ? "text-vault-950/80" : "text-vault-100/75"}`}>{label[locale]}</dt>
              <dd className={`text-3xl font-bold leading-none tracking-tight sm:text-[2.1rem] ${lead ? "text-vault-950" : "text-capsule-400"}`} dir="ltr" style={{ textAlign: locale === "fa" ? "right" : "left" }}>
                <CountUp value={value} locale={locale} />
              </dd>
            </div>
          );
        })}
      </dl>
      <DnaHelix className="hidden h-auto w-14 shrink-0 self-stretch sm:block" rungs={12} />
    </div>
  );
}
