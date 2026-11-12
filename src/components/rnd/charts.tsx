/*
 * SVG charts for the R&D module. Pure components with no state, so they render on the server
 * (portfolio) and in the browser (project view) alike. Time axes run right to left, the
 * Persian reading order: earlier dates on the right.
 */
import {
  DAY, nowMs, HEALTH, STAGES, actualAt, addMonths, curStage, daysTo, health, ms, plannedAt, progress, stagePct, stageStart,
  type Project, type Row, type Study,
} from "@/lib/rnd/model";

export const C = {
  accent: "#0b8f8a", plan: "#8a9ab0", gold: "#c9a54c", ink: "#0f1b2d", muted: "#52627a", line: "#dde4ee", track: "#e9eef5",
  ok: "#1f8a4c", okSoft: "#e6f4ec", warn: "#b26a00", warnSoft: "#fdf1dc", bad: "#c2362f", badSoft: "#fbe9e7", white: "#fff",
};
const mono = { fontFamily: "var(--font-mono)" } as const;

let JF: Intl.DateTimeFormat | null = null, JM: Intl.DateTimeFormat | null = null;
try {
  JF = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", { year: "numeric", month: "2-digit", day: "2-digit" });
  JM = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-latn", { year: "2-digit", month: "2-digit" });
} catch { /* the browser has no Persian calendar: ISO dates */ }
/** A Solar Hijri date (YYYY/MM/DD, English digits). */
export const fmt = (iso?: string) => (!iso || isNaN(ms(iso)) ? "—" : JF ? JF.format(new Date(ms(iso))) : iso);
const fmtM = (t: number) => (JM ? JM.format(new Date(t)) : new Date(t).toISOString().slice(2, 7));
const trunc = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

export function Legend({ items }: { items: [string | null, string][] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      {items.map(([c, l]) => (
        <span key={l} className="inline-flex items-center gap-1.5">
          {c && <i className="inline-block size-2.5 rounded-sm" style={{ background: c }} />}
          {l}
        </span>
      ))}
    </div>
  );
}

export function Donut({ parts, center, sub, size = 132 }: { parts: { v: number; c: string }[]; center: string; sub: string; size?: number }) {
  const r = 48, c = 2 * Math.PI * r, tot = parts.reduce((a, x) => a + x.v, 0);
  let off = 0;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} role="img" aria-label={sub}>
      <circle cx="60" cy="60" r={r} fill="none" stroke={C.track} strokeWidth="14" />
      {tot > 0 && parts.filter((x) => x.v).map((x, i) => {
        const len = (c * x.v) / tot, el = <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={x.c} strokeWidth="14" strokeDasharray={`${len.toFixed(2)} ${(c - len).toFixed(2)}`} strokeDashoffset={(-off).toFixed(2)} transform="rotate(-90 60 60)" />;
        off += len;
        return el;
      })}
      <text x="60" y="63" textAnchor="middle" fontSize="24" fontWeight="800" fill={C.ink} style={mono}>{center}</text>
      <text x="60" y="82" textAnchor="middle" fontSize="10.5" fill={C.muted}>{sub}</text>
    </svg>
  );
}

export function Bar({ value, plan, tone }: { value: number; plan?: number; tone?: string }) {
  return (
    <span className="relative block h-2.5 w-full rounded-full" style={{ background: C.track }}>
      <span className="absolute inset-y-0 right-0 rounded-full" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: tone ?? C.accent }} />
      {plan !== undefined && <span className="absolute -inset-y-1 w-0.5 rounded" style={{ right: `calc(${Math.max(0, Math.min(100, plan))}% - 1px)`, background: C.ink }} title={`برنامه: ${plan}%`} />}
    </span>
  );
}

export function SCurve({ p }: { p: Project }) {
  if (!p.start || !p.target) return <p className="text-sm text-muted">تاریخ اعلام و تاریخ هدف را وارد کنید.</p>;
  const t0 = ms(p.start), t1 = Math.max(ms(p.target), ...p.stages.map((s) => ms(s.due)).filter(isFinite)), now = nowMs();
  const Wd = 700, Hd = 250, L = 38, R = 12, T = 18, B = 28, pw = Wd - L - R, ph = Hd - T - B;
  const X = (t: number) => Wd - R - ((t - t0) / (t1 - t0)) * pw, Y = (v: number) => T + ph - (v / 100) * ph;
  const N = 72, tEnd = Math.min(now, t1);
  let plan = "", act = "";
  for (let i = 0; i <= N; i++) { const t = t0 + ((t1 - t0) * i) / N; plan += `${i ? "L" : "M"}${X(t).toFixed(1)},${Y(plannedAt(p, t)).toFixed(1)}`; }
  for (let i = 0; i <= N; i++) { const t = t0 + ((tEnd - t0) * i) / N; act += `${i ? "L" : "M"}${X(t).toFixed(1)},${Y(actualAt(p, t)).toFixed(1)}`; }
  const months: number[] = [];
  const step = Math.max(1, Math.round((t1 - t0) / DAY / 30 / 7));
  for (const d = new Date(t0); d.getTime() <= t1; d.setMonth(d.getMonth() + step)) { d.setDate(1); if (d.getTime() >= t0) months.push(d.getTime()); }
  const xn = X(now), a = actualAt(p, now), pl = plannedAt(p, now);
  return (
    <>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${Wd} ${Hd}`} width="100%" style={{ minWidth: 520 }} role="img" aria-label="منحنی پیشرفت برنامه‌ای و واقعی">
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={L} x2={Wd - R} y1={Y(v)} y2={Y(v)} stroke={C.line} strokeDasharray={v ? "3 4" : undefined} />
              <text x={L - 6} y={Y(v) + 4} textAnchor="end" fontSize="10" fill={C.muted} style={mono}>{v}%</text>
            </g>
          ))}
          {months.map((t) => <text key={t} x={X(t)} y={Hd - 8} textAnchor="middle" fontSize="10" fill={C.muted} style={mono}>{fmtM(t)}</text>)}
          {p.stages.map((s, i) => s.due && (
            <g key={s.key}>
              <line x1={X(ms(s.due))} x2={X(ms(s.due))} y1={T} y2={T + ph} stroke={C.line} />
              <text x={X(ms(s.due))} y={T - 5} textAnchor="middle" fontSize="9.5" fill={C.muted} style={mono}>{i + 1}</text>
            </g>
          ))}
          <path d={plan} fill="none" stroke={C.plan} strokeWidth="2" strokeDasharray="6 4" />
          <path d={`${act}L${X(tEnd).toFixed(1)},${Y(0)}L${X(t0)},${Y(0)}Z`} fill={C.accent} opacity=".12" />
          <path d={act} fill="none" stroke={C.accent} strokeWidth="2.5" />
          {now >= t0 && now <= t1 && (
            <>
              <line x1={xn} x2={xn} y1={T} y2={T + ph} stroke={C.bad} strokeWidth="1.2" strokeDasharray="4 3" />
              <circle cx={xn} cy={Y(pl)} r="3.5" fill={C.plan} />
              <circle cx={xn} cy={Y(a)} r="5" fill={C.accent} stroke={C.white} strokeWidth="2" />
            </>
          )}
        </svg>
      </div>
      <Legend items={[[C.accent, "پیشرفت واقعی"], [C.plan, "پیشرفت برنامه‌ای (از موعد مراحل)"], [C.bad, "امروز"], [null, "اعداد بالای نمودار: موعد پایان هر مرحله"]]} />
    </>
  );
}

export function PortfolioBars({ ps, href }: { ps: Project[]; href: (id: string) => string }) {
  if (!ps.length) return <p className="text-sm text-muted">پروژه در جریانی وجود ندارد.</p>;
  const rows = ps.map((p) => ({ p, a: progress(p), pl: Math.round(plannedAt(p, nowMs())), h: health(p) })).sort((x, y) => x.a - x.pl - (y.a - y.pl));
  return (
    <>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <a key={r.p.id} href={href(r.p.id)} className="grid grid-cols-[minmax(0,10rem)_1fr_5rem] items-center gap-3 hover:opacity-80">
            <span className="flex min-w-0 items-center gap-1.5">
              <i className="size-2 shrink-0 rounded-full" style={{ background: HEALTH[r.h].color }} />
              <span className="truncate text-sm font-semibold">{r.p.name}</span>
            </span>
            <Bar value={r.a} plan={r.pl} tone={r.h === "late" ? C.bad : r.h === "risk" ? C.warn : r.a >= 100 ? C.ok : C.accent} />
            <span className="text-left font-mono text-xs" dir="ltr">{r.a}% / {r.pl}%</span>
          </a>
        ))}
      </div>
      <Legend items={[[C.accent, "پیشرفت واقعی"], [C.ink, "نقطه‌ای که طبق برنامه باید باشد"], [null, "عدد: واقعی / برنامه"]]} />
    </>
  );
}

export function Gantt({ ps, href }: { ps: Project[]; href: (id: string) => string }) {
  const rows = ps.filter((p) => p.start && p.target);
  if (!rows.length) return <p className="text-sm text-muted">برای خط زمانی، تاریخ اعلام و تاریخ هدف پروژه‌ها لازم است.</p>;
  const now = nowMs();
  const t0 = Math.min(now, ...rows.map((p) => ms(p.start))) - 20 * DAY;
  const t1 = Math.max(now, ...rows.map((p) => Math.max(ms(p.target), ...p.stages.map((s) => ms(s.due)).filter(isFinite)))) + 20 * DAY;
  const Wd = 900, rowH = 30, lab = 180, T = 26, Hd = T + rows.length * rowH + 22, pw = Wd - lab - 12;
  const X = (t: number) => pw - ((t - t0) / (t1 - t0)) * pw + 4;
  const months: number[] = [];
  const step = Math.max(1, Math.round((t1 - t0) / DAY / 30 / 9));
  for (const d = new Date(t0); d.getTime() <= t1; d.setMonth(d.getMonth() + step)) { d.setDate(1); if (d.getTime() >= t0) months.push(d.getTime()); }
  const shades = [C.accent, C.gold], xn = X(now);
  return (
    <>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${Wd} ${Hd}`} width="100%" style={{ minWidth: 680 }} role="img" aria-label="خط زمانی مراحل پروژه‌ها">
          {months.map((t) => (
            <g key={t}>
              <line x1={X(t)} x2={X(t)} y1={T - 6} y2={Hd - 18} stroke={C.line} strokeDasharray="2 4" />
              <text x={X(t)} y={T - 10} textAnchor="middle" fontSize="10" fill={C.muted} style={mono}>{fmtM(t)}</text>
            </g>
          ))}
          {rows.map((p, r) => {
            const y = T + r * rowH + 7, xt = X(ms(p.target));
            return (
              <a key={p.id} href={href(p.id)}>
                <title>{p.name}</title>
                {p.stages.map((s, i) => {
                  const a = ms(stageStart(p, i)), b = ms(s.due);
                  if (!isFinite(a) || !isFinite(b) || b <= a) return null;
                  const x1 = X(b), x2 = X(a), w = x2 - x1, f = stagePct(s) / 100, late = f < 1 && daysTo(s.due) < 0;
                  return (
                    <g key={s.key}>
                      <rect x={x1} y={y} width={w} height="15" fill={C.track} stroke={C.white} strokeWidth="1" />
                      <rect x={x2 - w * f} y={y} width={w * f} height="15" fill={late ? C.bad : shades[i % 2]} />
                      {late && f === 0 && <rect x={x1} y={y} width={w} height="15" fill="none" stroke={C.bad} strokeWidth="1.2" />}
                    </g>
                  );
                })}
                <path d={`M${xt},${y - 3} l5,10.5 l-5,10.5 l-5,-10.5Z`} fill={C.ink} />
                <circle cx={Wd - 8} cy={y + 7.5} r="4.5" fill={HEALTH[health(p)].color} />
                <text x={Wd - 18} y={y + 12} textAnchor="start" direction="rtl" fontSize="12" fontWeight="600" fill={C.ink}>{trunc(p.name, 24)}</text>
              </a>
            );
          })}
          <line x1={xn} x2={xn} y1={T - 4} y2={Hd - 18} stroke={C.bad} strokeWidth="1.4" />
          <text x={xn} y={Hd - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={C.bad}>امروز</text>
        </svg>
      </div>
      <Legend items={[[C.accent, "مراحل پیاپی؛ بخش رنگی: انجام‌شده"], [C.gold, "مرحله بعدی"], [C.bad, "مرحله با موعد گذشته"], [null, "◆ تاریخ هدف"]]} />
    </>
  );
}

export function StageBars({ open }: { open: Project[] }) {
  const c = STAGES.map(() => 0);
  for (const p of open) { const i = curStage(p); if (i >= 0 && i < c.length) c[i]++; }
  const mx = Math.max(1, ...c);
  return (
    <div className="flex flex-col gap-1.5 text-xs">
      {STAGES.map((s, i) => (
        <div key={s.key} className="grid grid-cols-[1.25rem_minmax(0,1.3fr)_1fr_1.5rem] items-center gap-2">
          <span className="font-mono text-muted">{i + 1}</span>
          <span className="truncate">{s.title}</span>
          <Bar value={(100 * c[i]) / mx} />
          <span className="font-mono font-semibold">{c[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function RiskHeat({ risks }: { risks: Row[] }) {
  const cells = [];
  for (let s = 5; s >= 1; s--) {
    cells.push(<span key={`a${s}`} className="grid place-items-center font-mono text-xs text-muted">{s}</span>);
    for (let pr = 1; pr <= 5; pr++) {
      const sc = s * pr, n = risks.filter((r) => r.status !== "closed" && +(r.sev as string) === s && +(r.prob as string) === pr).length;
      const bg = sc >= 15 ? C.badSoft : sc >= 8 ? C.warnSoft : C.okSoft, fg = sc >= 15 ? C.bad : sc >= 8 ? C.warn : C.ok;
      cells.push(<span key={`${s}${pr}`} className="grid aspect-square place-items-center rounded font-mono text-sm font-bold" style={{ background: bg, color: fg, outline: n ? `2px solid ${fg}` : undefined }}>{n || ""}</span>);
    }
  }
  cells.push(<span key="o" />);
  for (let x = 1; x <= 5; x++) cells.push(<span key={`b${x}`} className="grid place-items-center font-mono text-xs text-muted">{x}</span>);
  return (
    <>
      <div dir="ltr" className="grid max-w-xs grid-cols-[1.25rem_repeat(5,1fr)] gap-1">{cells}</div>
      <Legend items={[[null, "محور عمودی: شدت"], [null, "محور افقی: احتمال"], [null, "عدد هر خانه: تعداد ریسک باز"]]} />
    </>
  );
}

export function Trend({ st }: { st: Study }) {
  const pts = st.months.filter((m) => st.results[m] && st.results[m].assay !== "" && st.results[m].assay != null && isFinite(+st.results[m].assay)).map((m) => [m, +st.results[m].assay] as const);
  if (pts.length < 2) return <p className="text-sm text-muted">برای نمودار روند Assay، نتیجه دست‌کم دو نقطه زمانی را وارد کنید.</p>;
  const mMax = Math.max(...st.months) || 1, lo = Math.min(+st.specMin, ...pts.map((x) => x[1])) - 1, hi = Math.max(+st.specMax, ...pts.map((x) => x[1])) + 1;
  const Wd = 420, Hd = 160, L = 38, R = 12, T = 10, B = 24, pw = Wd - L - R, ph = Hd - T - B;
  const X = (m: number) => L + (m / mMax) * pw, Y = (v: number) => T + ph - ((v - lo) / (hi - lo)) * ph;
  return (
    <>
      <div dir="ltr" className="overflow-x-auto">
        <svg viewBox={`0 0 ${Wd} ${Hd}`} width="100%" style={{ maxWidth: 520, minWidth: 300 }} role="img" aria-label="روند Assay">
          <rect x={L} y={Y(+st.specMax)} width={pw} height={Math.max(0, Y(+st.specMin) - Y(+st.specMax))} fill={C.okSoft} />
          {[+st.specMin, +st.specMax].map((v) => (
            <g key={v}>
              <line x1={L} x2={Wd - R} y1={Y(v)} y2={Y(v)} stroke={C.ok} strokeDasharray="4 3" />
              <text x={L - 4} y={Y(v) + 3} textAnchor="end" fontSize="9.5" fill={C.muted} style={mono}>{v}</text>
            </g>
          ))}
          {st.months.map((m) => <text key={m} x={X(m)} y={Hd - 6} textAnchor="middle" fontSize="9.5" fill={C.muted} style={mono}>{m}M</text>)}
          <path d={pts.map((x, i) => `${i ? "L" : "M"}${X(x[0])},${Y(x[1])}`).join("")} fill="none" stroke={C.accent} strokeWidth="2" />
          {pts.map(([m, v]) => (
            <g key={m}>
              <circle cx={X(m)} cy={Y(v)} r="3.5" fill={v < +st.specMin || v > +st.specMax ? C.bad : C.accent} />
              <text x={X(m)} y={Y(v) - 7} textAnchor="middle" fontSize="9.5" fill={C.ink} style={mono}>{v}</text>
            </g>
          ))}
        </svg>
      </div>
      <Legend items={[[C.okSoft, "محدوده Specification برای Assay"]]} />
    </>
  );
}

/** Pull dates of a stability study: when each time point falls due. */
export const pullDates = (st: Study) => st.months.map((m) => ({ m, due: st.start ? addMonths(st.start, m) : "", done: st.done.includes(m) }));
