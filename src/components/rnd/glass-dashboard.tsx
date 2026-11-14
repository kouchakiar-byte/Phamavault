"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { AlarmClock, Bell, Building2, FlaskConical, LayoutGrid, Plus, X } from "lucide-react";
import bg from "@/assets/photos/lab-microscope.webp";
import { rndGlass } from "@/lib/rnd/actions";
import type { GlassData, GlassEvent } from "@/lib/rnd/glass";
import { T, UNITS, type Health, type Unit } from "@/lib/rnd/model";
import { fmt } from "./charts";

type Lang = "fa" | "en";
type Tab = "overview" | "projects" | "units" | "alerts";

/** Every fixed word on the dashboard, in both languages. Project names and tasks stay as people wrote them. */
const L = {
  title: { fa: "داشبورد شیشه‌ای", en: "Glassy Dashboard" },
  sub: { fa: "پروژه‌های تحقیق و توسعه", en: "R&D projects" },
  live: { fa: "آنلاین", en: "Live" },
  tabs: { overview: { fa: "نمای کلی", en: "Overview" }, projects: { fa: "پروژه‌ها", en: "Projects" }, units: { fa: "واحدها", en: "Units" }, alerts: { fa: "هشدارها", en: "Alerts" } },
  open: { fa: "پروژه در جریان", en: "Open projects" },
  avg: { fa: "میانگین پیشرفت", en: "Average progress" },
  late: { fa: "عقب از برنامه", en: "Behind plan" },
  overdue: { fa: "موعد گذشته", en: "Overdue" },
  soon: { fa: "موعد 7 روز آینده", en: "Due in 7 days" },
  week: { fa: "کار انجام‌شده در 7 روز", en: "Done in 7 days" },
  hiRisks: { fa: "ریسک بالا", en: "High risks" },
  health: { fa: "سلامت پروژه‌ها", en: "Project health" },
  recent: { fa: "رویدادهای اخیر", en: "Recent activity" },
  myUnit: { fa: "پیشرفت کارهای واحد شما", en: "Your unit's progress" },
  tasks: { fa: "کار", en: "tasks" },
  of: { fa: "از", en: "of" },
  plan: { fa: "برنامه", en: "plan" },
  next: { fa: "کار بعدی", en: "Next" },
  none: { fa: "موردی وجود ندارد.", en: "Nothing here." },
  noProjects: { fa: "پروژه در جریانی وجود ندارد.", en: "No open projects." },
  days: { fa: "روز", en: "days" },
  today: { fa: "امروز", en: "today" },
  late2: { fa: "تأخیر", en: "late" },
  left: { fa: "مانده", en: "left" },
  open2: { fa: "باز کردن پروژه", en: "Open project" },
  stage: { fa: "مرحله", en: "Stage" },
  doneOf: { fa: "انجام‌شده", en: "done" },
  newEvent: { fa: "رویداد تازه", en: "New activity" },
  sample: { fa: "داده واقعی پروژه‌های شما · هر دقیقه به‌روز می‌شود", en: "Your real project data · refreshed every minute" },
  memberNote: { fa: "فقط کارهای واحد شما نمایش داده می‌شود.", en: "Only your unit's work is shown." },
  back: { fa: "نمای عادی", en: "Classic view" },
};
const HEALTH_L: Record<Health, { fa: string; en: string; c: string }> = {
  ok: { fa: "طبق برنامه", en: "On track", c: "#4ade80" },
  risk: { fa: "در معرض تأخیر", en: "At risk", c: "#fbbf24" },
  late: { fa: "عقب از برنامه", en: "Behind", c: "#f87171" },
  hold: { fa: "متوقف", en: "On hold", c: "#cbd5e1" },
  done: { fa: "تکمیل", en: "Done", c: "#5eead4" },
  cancelled: { fa: "لغو", en: "Cancelled", c: "#cbd5e1" },
};
const UNITS_EN: Record<Unit, string> = { pm: "Project management", form: "Formulation", anal: "Analytical & QC", qa: "Quality assurance", purch: "Purchasing", reg: "Regulatory", prod: "Production" };
const KIND: Record<string, { fa: string; en: string; c: string }> = {
  decision: { fa: "تصمیم", en: "Decision", c: "#5eead4" }, issue: { fa: "مشکل", en: "Issue", c: "#f87171" },
  note: { fa: "یادداشت", en: "Note", c: "#fde68a" }, auto: { fa: "سیستم", en: "System", c: "#cbd5e1" },
};
const AVATAR = ["#fb923c", "#2dd4bf", "#818cf8", "#e879f9", "#38bdf8", "#facc15", "#4ade80"];
const unitName = (u: Unit, lang: Lang) => (lang === "fa" ? UNITS[u] : UNITS_EN[u]);
const whenText = (d: number, lang: Lang) => (d === 0 ? L.today[lang] : d < 0 ? `${-d} ${L.days[lang]} ${L.late2[lang]}` : `${d} ${L.days[lang]} ${L.left[lang]}`);

const CALM = "(prefers-reduced-motion: reduce)";
/** Whether the visitor asked for less motion (false while rendering on the server). */
function useCalm() {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia(CALM); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia(CALM).matches,
    () => false,
  );
}

/** The dashboard's language, remembered on this device; Persian until the page has loaded. */
const LANG_KEY = "pv-glass-lang";
const langListeners = new Set<() => void>();
function readLang(): Lang {
  try { return localStorage.getItem(LANG_KEY) === "en" ? "en" : "fa"; } catch { return "fa"; }
}
function writeLang(v: Lang) {
  try { localStorage.setItem(LANG_KEY, v); } catch { /* storage blocked: the choice lasts until the page is left */ memoryLang = v; }
  langListeners.forEach((f) => f());
}
let memoryLang: Lang | null = null;
function useLang(): [Lang, (v: Lang) => void] {
  const lang = useSyncExternalStore(
    (cb) => { langListeners.add(cb); return () => langListeners.delete(cb); },
    () => memoryLang ?? readLang(),
    () => "fa" as Lang,
  );
  return [lang, writeLang];
}

/** A number that counts up to its value, quickly and once per change. */
function Count({ value, suffix = "", calm }: { value: number; suffix?: string; calm: boolean }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (calm) { from.current = value; return; }
    const start = performance.now(), a = from.current, dur = 900;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
      setShown(Math.round(a + (value - a) * e));
      if (k < 1) raf = requestAnimationFrame(step); else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, calm]);
  return <bdi dir="ltr">{calm ? value : shown}{suffix}</bdi>;
}

/**
 * A glass card that leans a little towards the pointer and catches a highlight where it is.
 * Only for a mouse or pen: on a phone the card stays flat, so scrolling is not disturbed.
 */
function Tilt({ children, className = "", calm, style, onClick, label }: { children: ReactNode; className?: string; calm: boolean; style?: CSSProperties; onClick?: () => void; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (calm || e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
    ref.current.style.setProperty("--ry", `${(x - 0.5) * 9}deg`);
    ref.current.style.setProperty("--gx", `${x * 100}%`);
    ref.current.style.setProperty("--gy", `${y * 100}%`);
  };
  const leave = () => { ref.current?.style.setProperty("--rx", "0deg"); ref.current?.style.setProperty("--ry", "0deg"); };
  return (
    <div ref={ref} className={`gl-card gl-tilt min-w-0 ${onClick ? "cursor-pointer" : ""} ${className}`} style={style} onPointerMove={move} onPointerLeave={leave}
      onClick={onClick} role={onClick ? "link" : undefined} tabIndex={onClick ? 0 : undefined} aria-label={label}
      onKeyDown={(e) => onClick && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick())}>
      {children}
    </div>
  );
}

/** The line inside a project card: progress from the project's start to today, drawn in once. */
function Spark({ data, color = "#5eead4", calm }: { data: number[]; color?: string; calm: boolean }) {
  const W = 220, H = 46, max = Math.max(100, ...data), n = Math.max(1, data.length - 1);
  const pts = data.map((v, i) => [(i / n) * W, H - 4 - (v / max) * (H - 10)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="gl-spark h-11 w-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`g${color.slice(1)}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient>
      </defs>
      <path d={`${d}L${W},${H}L0,${H}Z`} fill={`url(#g${color.slice(1)})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className={calm ? "" : "gl-draw"} />
      {last && <circle cx={last[0]} cy={last[1]} r="3.2" fill={color} className={calm ? "" : "gl-pulse-dot"} />}
    </svg>
  );
}

/** A ring that fills to a percentage. */
function Ring({ value, size = 120, color = "#5eead4", label, calm }: { value: number; size?: number; color?: string; label: string; calm: boolean }) {
  const r = 46, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={`${label}: ${value}%`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="11" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeDasharray={`${(c * Math.min(100, value)) / 100} ${c}`}
        transform="rotate(-90 60 60)" className={calm ? "" : "gl-ring"} style={{ ["--c" as string]: c }} />
      <text x="60" y="68" textAnchor="middle" fontSize="26" fontWeight="800" fill="#fff" style={{ fontFamily: "var(--font-mono)" }}>{value}%</text>
    </svg>
  );
}

function Bar({ value, color = "#5eead4" }: { value: number; color?: string }) {
  return (
    <span className="relative block h-2 w-full overflow-hidden rounded-full bg-white/15">
      <span className="gl-bar absolute inset-y-0 start-0 rounded-full" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </span>
  );
}

export function GlassDashboard({ initial, projectHref, classicHref }: { initial: GlassData; projectHref: string; classicHref: string }) {
  const [data, setData] = useState(initial);
  const [lang, switchLang] = useLang();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [toasts, setToasts] = useState<GlassEvent[]>([]);
  const calm = useCalm();
  const seen = useRef(new Set(initial.events.map((e) => e.id)));
  const tabsRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const t = (k: { fa: string; en: string }) => k[lang];
  const go = (id: string) => router.push(`${projectHref}?id=${id}`);

  // The highlight under the tabs slides to the chosen tab, in either reading direction.
  const place = useCallback(() => {
    const box = tabsRef.current, el = box?.querySelector<HTMLElement>(`[data-tab="${tab}"]`);
    if (box && el) setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [tab]);
  useLayoutEffect(() => { place(); }, [place, lang]);
  useEffect(() => { window.addEventListener("resize", place); return () => window.removeEventListener("resize", place); }, [place]);

  // New numbers every minute while the tab is visible; anything newly logged appears as a toast.
  useEffect(() => {
    const id = setInterval(async () => {
      if (document.hidden) return;
      const r = await rndGlass().catch(() => null);
      if (!r?.ok) return;
      const fresh = r.data.events.filter((e) => !seen.current.has(e.id));
      fresh.forEach((e) => seen.current.add(e.id));
      if (fresh.length) setToasts((x) => [...fresh.slice(0, 3), ...x].slice(0, 3));
      setData(r.data);
    }, 60_000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!toasts.length) return;
    const id = setTimeout(() => setToasts((x) => x.slice(0, -1)), 7000);
    return () => clearTimeout(id);
  }, [toasts]);

  const member = data.role === "member", tot = data.totals;
  const tabs: [Tab, ReactNode][] = [
    ["overview", <LayoutGrid key="o" className="size-6" aria-hidden="true" />],
    ["projects", <FlaskConical key="p" className="size-6" aria-hidden="true" />],
    ["units", <Building2 key="u" className="size-6" aria-hidden="true" />],
    ["alerts", <Bell key="a" className="size-6" aria-hidden="true" />],
  ];
  const healthRows = useMemo(() => (["ok", "risk", "late", "hold"] as Health[]).map((h) => ({ h, n: data.projects.filter((p) => p.health === h).length })), [data.projects]);

  return (
    <section dir={lang === "fa" ? "rtl" : "ltr"} lang={lang} className={`gl-root relative isolate overflow-hidden rounded-[28px] ${calm ? "gl-calm" : ""}`}>
      <style>{CSS}</style>
      <Image src={bg} alt="" fill priority sizes="(max-width: 1280px) 100vw, 1216px" className="-z-20 scale-110 object-cover blur-[3px]" placeholder="blur" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-vault-950/75 via-vault-900/55 to-molecule-700/45" />

      <div className="relative px-4 py-6 sm:px-8 sm:py-8">
        {/* Title, live mark and language switch */}
        <header className="gl-rise mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="gl-card grid size-14 shrink-0 place-items-center rounded-2xl"><FlaskConical className="size-7 text-molecule-400" aria-hidden="true" /></span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{t(L.title)}</h1>
              <p className="text-sm font-semibold text-capsule-400">{t(L.sub)}{member && data.unit ? ` · ${unitName(data.unit, lang)}` : ""}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="gl-card inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-bold text-white">
              <i className="gl-live size-2.5 rounded-full bg-emerald-400" />{t(L.live)}
            </span>
            <div className="gl-card relative flex rounded-full p-1" role="group" aria-label="Language / زبان">
              {(["fa", "en"] as Lang[]).map((v) => (
                <button key={v} type="button" onClick={() => switchLang(v)} aria-pressed={lang === v}
                  className={`relative z-10 rounded-full px-3.5 py-1 text-sm font-bold transition ${lang === v ? "bg-molecule-500/80 text-white shadow" : "text-white/75 hover:text-white"}`}>
                  {v === "fa" ? "فارسی" : "English"}
                </button>
              ))}
            </div>
            <a href={classicHref} className="gl-card rounded-full px-3.5 py-1.5 text-sm font-semibold text-white/85 hover:text-white">{t(L.back)}</a>
          </div>
        </header>

        {/* Tabs with a sliding highlight */}
        <div ref={tabsRef} role="tablist" className="gl-card gl-rise relative mb-5 grid grid-cols-4 gap-1 rounded-3xl p-1.5" style={{ animationDelay: "60ms" }}>
          {pill && <span className="gl-pill absolute top-1.5 bottom-1.5 rounded-[20px]" style={{ left: pill.x, width: pill.w }} aria-hidden="true" />}
          {tabs.map(([k, icon]) => (
            <button key={k} type="button" role="tab" data-tab={k} aria-selected={tab === k} onClick={() => setTab(k)}
              className={`relative z-10 flex flex-col items-center gap-1 rounded-[20px] px-1 py-2.5 text-xs font-bold transition sm:text-sm ${tab === k ? "text-white" : "text-white/70 hover:text-white"}`}>
              {icon}
              <span>{L.tabs[k][lang]}</span>
              <span className="hidden text-[10px] font-medium text-white/55 sm:block">{L.tabs[k][lang === "fa" ? "en" : "fa"]}</span>
            </button>
          ))}
        </div>

        <p className="gl-rise mb-4 inline-flex items-center gap-2 rounded-full bg-capsule-400/20 px-3 py-1 text-xs font-semibold text-capsule-100 ring-1 ring-capsule-400/40" style={{ animationDelay: "120ms" }}>
          <i className="size-1.5 rounded-full bg-capsule-400" />{t(L.sample)}{member ? ` · ${t(L.memberNote)}` : ""}
        </p>

        <div key={`${tab}-${lang}`} className="gl-swap min-w-0">
          {tab === "overview" && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                {[
                  [L.open, tot.open, "", "#fff"], [L.avg, tot.avg, "%", "#5eead4"], [L.late, tot.late, "", tot.late ? "#f87171" : "#4ade80"],
                  [L.overdue, tot.overdue, "", tot.overdue ? "#f87171" : "#4ade80"], [L.soon, tot.soon, "", tot.soon ? "#fbbf24" : "#fff"], [L.week, tot.week, "", "#5eead4"],
                ].map(([k, v, s, c], i) => (
                  <Tilt key={i} calm={calm} className="gl-rise rounded-3xl p-4" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="truncate text-xs font-semibold text-white/70">{(k as { fa: string; en: string })[lang]}</div>
                    <div className="mt-1 font-mono text-3xl font-extrabold" style={{ color: c as string }}><Count value={v as number} suffix={s as string} calm={calm} /></div>
                  </Tilt>
                ))}
              </div>
              <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
                <Tilt calm={calm} className="gl-rise rounded-3xl p-5" style={{ animationDelay: "200ms" }}>
                  <h2 className="mb-3 text-base font-bold text-white">{member ? t(L.myUnit) : t(L.health)}</h2>
                  <div className="flex flex-wrap items-center gap-5">
                    <Ring value={tot.avg} label={t(L.avg)} calm={calm} />
                    <ul className="flex min-w-36 flex-1 flex-col gap-2 text-sm text-white">
                      {healthRows.map(({ h, n }) => (
                        <li key={h} className="flex items-center gap-2">
                          <i className="size-2.5 rounded-full" style={{ background: HEALTH_L[h].c }} />
                          <span className="flex-1">{HEALTH_L[h][lang]}</span>
                          <b className="font-mono">{n}</b>
                        </li>
                      ))}
                      {!member && <li className="flex items-center gap-2 border-t border-white/15 pt-2"><i className="size-2.5 rounded-full bg-red-400" /><span className="flex-1">{t(L.hiRisks)}</span><b className="font-mono">{tot.hiRisks}</b></li>}
                    </ul>
                  </div>
                </Tilt>
                <Tilt calm={calm} className="gl-rise rounded-3xl p-5" style={{ animationDelay: "260ms" }}>
                  <h2 className="mb-3 text-base font-bold text-white">{t(L.recent)}</h2>
                  <ul className="flex flex-col gap-2">
                    {data.events.slice(0, 6).map((e) => (
                      <li key={e.id} className="flex gap-3 rounded-2xl bg-white/[.07] px-3 py-2 text-sm text-white">
                        <span className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: KIND[e.kind]?.c ?? "#fff" }} />
                        <span className="min-w-0 flex-1">
                          <b className="text-white/90">{KIND[e.kind]?.[lang] ?? e.kind}</b> <span className="text-white/60">· {T(e.projectName)}</span>
                          <span className="block truncate text-white/85">{T(e.text)}</span>
                        </span>
                      </li>
                    ))}
                    {!data.events.length && <li className="text-sm text-white/70">{t(L.none)}</li>}
                  </ul>
                </Tilt>
              </div>
              <ProjectGrid data={data} lang={lang} calm={calm} go={go} limit={4} />
            </div>
          )}
          {tab === "projects" && <ProjectGrid data={data} lang={lang} calm={calm} go={go} />}
          {tab === "units" && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {data.units.map((r, i) => {
                const pc = r.total ? Math.round((100 * r.done) / r.total) : 0;
                return (
                  <Tilt key={r.u} calm={calm} className="gl-rise rounded-3xl p-5" style={{ animationDelay: `${i * 70}ms` }}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-full text-lg font-extrabold text-vault-950" style={{ background: AVATAR[i % AVATAR.length] }}>{unitName(r.u, lang).charAt(0)}</span>
                      <div className="min-w-0">
                        <div className="truncate text-base font-bold text-white">{unitName(r.u, lang)}</div>
                        <div className="text-xs text-white/65"><bdi dir="ltr">{r.done} / {r.total}</bdi> {t(L.tasks)} {t(L.doneOf)}</div>
                      </div>
                      <b className="ms-auto font-mono text-2xl text-molecule-400"><Count value={pc} suffix="%" calm={calm} /></b>
                    </div>
                    <Bar value={pc} />
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      {[[L.overdue, r.over, r.over ? "#f87171" : "#fff"], [L.soon, r.soon, r.soon ? "#fbbf24" : "#fff"], [L.week, r.week, "#5eead4"]].map(([k, v, c], j) => (
                        <div key={j} className="rounded-2xl bg-white/[.07] px-1 py-2">
                          <div className="font-mono text-xl font-extrabold" style={{ color: c as string }}><Count value={v as number} calm={calm} /></div>
                          <div className="text-[10.5px] leading-4 text-white/65">{(k as { fa: string; en: string })[lang]}</div>
                        </div>
                      ))}
                    </div>
                  </Tilt>
                );
              })}
              {!data.units.length && <p className="text-white/75">{t(L.none)}</p>}
            </div>
          )}
          {tab === "alerts" && (
            <div className="grid gap-4 lg:grid-cols-2">
              {[[L.overdue, data.alerts.filter((a) => a.d < 0), "#f87171"], [L.soon, data.alerts.filter((a) => a.d >= 0), "#fbbf24"]].map(([k, list, c], i) => (
                <Tilt key={i} calm={calm} className="gl-rise rounded-3xl p-5" style={{ animationDelay: `${i * 80}ms` }}>
                  <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-white">
                    <AlarmClock className="size-5" style={{ color: c as string }} aria-hidden="true" />{i ? (lang === "fa" ? "موعدهای 30 روز آینده" : "Due in the next 30 days") : (k as { fa: string; en: string })[lang]}
                    <span className="ms-auto rounded-full bg-white/15 px-2 font-mono text-sm">{(list as GlassData["alerts"]).length}</span>
                  </h2>
                  <ul className="flex max-h-[30rem] flex-col gap-2 overflow-y-auto pe-1">
                    {(list as GlassData["alerts"]).map((a, j) => (
                      <li key={j}>
                        <button type="button" onClick={() => go(a.project)} className="flex w-full gap-3 rounded-2xl bg-white/[.07] px-3 py-2 text-start text-sm text-white transition hover:bg-white/[.14]">
                          <span className="w-20 shrink-0 text-xs font-bold" style={{ color: c as string }}>{whenText(a.d, lang)}<span className="block font-mono font-medium text-white/60" dir="ltr">{fmt(a.due)}</span></span>
                          <span className="min-w-0 flex-1"><span className="block text-white/90">{a.text}</span><span className="text-xs text-white/60">{T(a.projectName)} · {unitName(a.unit, lang)}</span></span>
                        </button>
                      </li>
                    ))}
                    {!(list as GlassData["alerts"]).length && <li className="text-sm text-white/70">{t(L.none)}</li>}
                  </ul>
                </Tilt>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New activity, as it is logged by the team */}
      <div className="pointer-events-none absolute bottom-4 end-4 z-20 flex w-[min(22rem,calc(100%-2rem))] flex-col gap-2" aria-live="polite">
        {toasts.map((e) => (
          <div key={e.id} className="gl-card gl-toast pointer-events-auto flex items-start gap-3 rounded-2xl p-3 text-sm text-white">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-molecule-500"><Plus className="size-4" aria-hidden="true" /></span>
            <span className="min-w-0 flex-1"><b>{t(L.newEvent)}: {KIND[e.kind]?.[lang]}</b><span className="block truncate text-white/80">{T(e.projectName)} — {T(e.text)}</span></span>
            <button type="button" onClick={() => setToasts((x) => x.filter((y) => y.id !== e.id))} aria-label="×" className="text-white/70 hover:text-white"><X className="size-4" /></button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectGrid({ data, lang, calm, go, limit }: { data: GlassData; lang: Lang; calm: boolean; go: (id: string) => void; limit?: number }) {
  const t = (k: { fa: string; en: string }) => k[lang];
  const list = limit ? data.projects.slice(0, limit) : data.projects;
  if (!list.length) return <p className="text-white/75">{t(L.noProjects)}</p>;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {list.map((p, i) => {
        const h = HEALTH_L[p.health], col = p.health === "late" ? "#f87171" : p.health === "risk" ? "#fbbf24" : "#5eead4";
        return (
          <Tilt key={p.id} calm={calm} onClick={() => go(p.id)} label={`${t(L.open2)}: ${p.name}`} className="gl-rise rounded-3xl p-5" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full text-lg font-extrabold text-vault-950" style={{ background: AVATAR[i % AVATAR.length] }}>
                {(p.name.match(/[A-Za-zآ-ی]/)?.[0] ?? "P").toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-bold text-white">{T(p.name)}</div>
                <div className="truncate text-xs text-white/65">{p.code && <bdi dir="ltr" className="font-mono">{p.code}</bdi>}{p.code && p.lead ? " · " : ""}{p.lead ? T(p.lead) : ""}</div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-white"><i className="size-2 rounded-full" style={{ background: h.c }} />{h[lang]}</span>
            </div>
            <div className="mt-2 text-xs text-white/65"><bdi dir="ltr">{p.done} / {p.total}</bdi> {t(L.tasks)} · {p.stageIndex >= 0 ? `${t(L.stage)} ${p.stageIndex + 1}: ${T(p.stage)}` : ""}</div>
            <div className="mt-2"><Spark data={p.series} color={col} calm={calm} /></div>
            <div className="mt-1 flex items-end justify-between gap-3">
              <div>
                <div className="font-mono text-2xl font-extrabold text-white"><Count value={p.pc} suffix="%" calm={calm} /></div>
                {data.role !== "member" && <div className="text-[11px] text-white/60">{t(L.plan)}: <bdi dir="ltr">{p.plan}%</bdi></div>}
              </div>
              <div className="min-w-0 text-end text-xs">
                {p.over > 0 && <div className="font-bold text-red-300">{p.over} {t(L.overdue)}</div>}
                {p.next && <div className="truncate text-white/75">{t(L.next)}: {whenText(p.next.d, lang)}</div>}
                {p.daysLeft !== null && <div className="text-white/55"><bdi dir="ltr" className="font-mono">{fmt(p.target)}</bdi></div>}
              </div>
            </div>
          </Tilt>
        );
      })}
    </div>
  );
}

/** The glass look, the entrance and the motion. Everything moves less (or not at all) for reduced motion. */
const CSS = `
.gl-root { min-height: 640px; color: #fff; }
.gl-card {
  background: linear-gradient(135deg, rgba(255,255,255,.20), rgba(255,255,255,.07));
  -webkit-backdrop-filter: blur(18px) saturate(150%); backdrop-filter: blur(18px) saturate(150%);
  border: 1px solid rgba(255,255,255,.28);
  box-shadow: 0 10px 30px -10px rgba(2,12,27,.55), inset 0 1px 0 rgba(255,255,255,.35);
}
.gl-tilt {
  position: relative; transform-style: preserve-3d;
  transform: perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));
  transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s, border-color .35s;
}
.gl-tilt::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; transition: opacity .3s;
  background: radial-gradient(240px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,.22), transparent 60%);
}
.gl-tilt:hover { border-color: rgba(255,255,255,.45); box-shadow: 0 18px 40px -12px rgba(2,12,27,.7), inset 0 1px 0 rgba(255,255,255,.45); }
.gl-tilt:hover::after { opacity: 1; }
.gl-tilt:focus-visible { outline: 2px solid #5eead4; outline-offset: 3px; }
.gl-pill {
  background: linear-gradient(135deg, rgba(45,212,191,.55), rgba(255,255,255,.18));
  border: 1px solid rgba(255,255,255,.45); box-shadow: 0 0 24px rgba(45,212,191,.45), inset 0 1px 0 rgba(255,255,255,.5);
  transition: left .55s cubic-bezier(.34,1.45,.64,1), width .55s cubic-bezier(.34,1.45,.64,1);
}
@keyframes gl-rise { from { opacity: 0; transform: translateY(14px) perspective(900px) rotateX(8deg); } to { opacity: 1; transform: none; } }
.gl-rise { animation: gl-rise .6s cubic-bezier(.2,.8,.2,1) both; }
.gl-tilt.gl-rise { animation-name: gl-rise-tilt; }
@keyframes gl-rise-tilt { from { opacity: 0; translate: 0 14px; } to { opacity: 1; translate: 0 0; } }
@keyframes gl-swap { from { opacity: 0; } to { opacity: 1; } }
.gl-swap { animation: gl-swap .35s ease both; }
@keyframes gl-draw { from { stroke-dasharray: 1; stroke-dashoffset: 1; } to { stroke-dasharray: 1; stroke-dashoffset: 0; } }
.gl-draw { animation: gl-draw 1.3s cubic-bezier(.4,0,.2,1) both; }
@keyframes gl-ring { from { stroke-dashoffset: var(--c); } to { stroke-dashoffset: 0; } }
.gl-ring { animation: gl-ring 1.2s cubic-bezier(.2,.8,.2,1) both; }
@keyframes gl-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.gl-bar { transform-origin: var(--o, left); animation: gl-grow 1s cubic-bezier(.2,.8,.2,1) both; }
[dir=rtl] .gl-bar { --o: right; }
/* Time runs in the reading direction: in Persian the project starts on the right. */
[dir=rtl] .gl-spark { transform: scaleX(-1); }
@keyframes gl-live { 0% { box-shadow: 0 0 0 0 rgba(74,222,128,.7); } 70% { box-shadow: 0 0 0 9px rgba(74,222,128,0); } 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); } }
.gl-live { animation: gl-live 1.8s ease-out infinite; }
@keyframes gl-dot { 50% { r: 4.6; opacity: .7; } }
.gl-pulse-dot { animation: gl-dot 2s ease-in-out infinite; }
@keyframes gl-toast { from { opacity: 0; transform: translateY(16px) scale(.96); } to { opacity: 1; transform: none; } }
.gl-toast { animation: gl-toast .45s cubic-bezier(.34,1.45,.64,1) both; }
.gl-calm *, .gl-calm *::after { animation: none !important; transition: none !important; }
@media (prefers-reduced-motion: reduce) { .gl-root *, .gl-root *::after { animation: none !important; transition: none !important; } }
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { .gl-card { background: rgba(15,27,45,.78); } }
`;
