"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { VaultLock } from "@/components/account/vault-lock";
import type { Locale } from "@/i18n/config";
import { copy } from "@/content/site";

const STEPS = 4;
type Stage = "locked" | "unlocking" | "opening" | "playing";

/**
 * The vault in the hero: as soon as it comes into view the key turns once every
 * half second, lighting a tumbler each time; then the door swings open and a
 * two-minute, silent tour of all twelve sections plays in its place, looping.
 */
export function VaultTour({ locale, className = "" }: { locale: Locale; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<Stage>("locked");
  const [unlocked, setUnlocked] = useState(0);
  const [turns, setTurns] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = copy.tour;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const quiet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (quiet) {
          // No unlocking show: open straight onto the tour, paused, for the visitor to start.
          later(0, () => {
            setPaused(true);
            setStage("playing");
          });
          return;
        }
        const start = 150;
        const turn = 500; // one key turn every half second
        later(start, () => setStage("unlocking"));
        for (let i = 1; i <= STEPS; i++)
          later(start + i * turn, () => {
            setUnlocked(i);
            setTurns(i);
          });
        later(start + STEPS * turn + 200, () => setStage("opening"));
        later(start + STEPS * turn + 800, () => setStage("playing"));
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  // Load the film while the key turns and start it as the door opens, so it is
  // already running when the vault fades away.
  useEffect(() => {
    const v = video.current;
    if (!v || stage === "locked") return;
    if (v.preload !== "auto") {
      v.preload = "auto";
      v.load();
    }
    if ((stage === "opening" || stage === "playing") && !paused) v.play().catch(() => setPaused(true));
  }, [stage, paused]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      setPaused(false);
      v.play().catch(() => setPaused(true));
    } else {
      v.pause();
      setPaused(true);
    }
  };

  const open = stage === "playing";
  return (
    <figure ref={box} className={`overflow-hidden rounded-2xl border border-white/15 bg-vault-950/70 shadow-2xl shadow-black/40 ${className}`}>
      {/* Browser chrome, so the film reads as the site itself */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.06] px-3 py-2" dir="ltr">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto rounded-md bg-white/10 px-3 py-0.5 font-mono text-[0.7rem] text-vault-100/70">pharmavault.ir</span>
        <button
          type="button"
          onClick={toggle}
          disabled={!open}
          aria-label={(paused ? t.play : t.pause)[locale]}
          className="flex size-6 items-center justify-center rounded-md text-vault-100/70 transition hover:bg-white/10 hover:text-white disabled:opacity-0"
        >
          {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
        </button>
      </div>
      <div className="relative aspect-[8/5]">
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          poster="/videos/tour-poster.webp"
          aria-label={t.label[locale]}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${open ? "opacity-100" : "opacity-0"}`}
        >
          {/* Smaller cut on phones; H.264 first, VP9 for browsers without it */}
          <source src="/videos/tour-640.mp4" type={'video/mp4; codecs="avc1.64001E"'} media="(max-width: 640px)" />
          <source src="/videos/tour-640.webm" type={'video/webm; codecs="vp9"'} media="(max-width: 640px)" />
          <source src="/videos/tour-1024.mp4" type={'video/mp4; codecs="avc1.64001F"'} />
          <source src="/videos/tour-1024.webm" type={'video/webm; codecs="vp9"'} />
        </video>
        {/* The vault that opens onto the film */}
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-vault-900 via-vault-950 to-vault-900 transition-opacity duration-700 ${open ? "pointer-events-none opacity-0" : "opacity-100"}`}
          aria-hidden="true"
        >
          <VaultLock steps={STEPS} unlocked={unlocked} turns={turns} opening={stage === "opening" || open} className="size-40 sm:size-48" />
        </div>
        {paused && open && (
          <button
            type="button"
            onClick={toggle}
            aria-label={t.play[locale]}
            className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-vault-950/70 text-capsule-400 ring-2 ring-capsule-400/70 backdrop-blur transition hover:scale-105"
          >
            <Play className="size-7 translate-x-0.5" aria-hidden="true" />
          </button>
        )}
      </div>
      <figcaption className="sr-only">{t.label[locale]}</figcaption>
    </figure>
  );
}
