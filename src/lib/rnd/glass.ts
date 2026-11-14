/*
 * The data behind the glass dashboard: the same projects, filtered by the same rules as the rest of the
 * workspace (a unit member gets only their unit's work), reduced to what the dashboard shows.
 */
import {
  UNITS, actualAt, alertsOf, daysTo, health, isOpen, ms, nowMs, plannedAt, progress, riskScore, stagePct, sv,
  type Health, type Project, type Unit,
} from "./model";
import { filterProject, loadProjects, type Access } from "./server";

export type GlassProject = {
  id: string; name: string; code: string; lead: string; health: Health; status: string;
  pc: number; plan: number; v: number; series: number[]; done: number; total: number; over: number;
  stage: string; stageIndex: number; target: string; daysLeft: number | null;
  next: { text: string; d: number } | null; risks: number; hiRisks: number;
};
export type GlassUnit = { u: Unit; done: number; total: number; over: number; soon: number; week: number };
export type GlassAlert = { project: string; projectName: string; unit: Unit; d: number; due: string; text: string; kind: string };
export type GlassEvent = { id: string; project: string; projectName: string; kind: string; text: string; at: number; by: string };
export type GlassData = {
  role: Access["role"]; unit: Unit | null; name: string;
  totals: { open: number; all: number; avg: number; late: number; risk: number; ok: number; hold: number; overdue: number; soon: number; week: number; hiRisks: number };
  projects: GlassProject[]; units: GlassUnit[]; alerts: GlassAlert[]; events: GlassEvent[]; stamp: number;
};

const SERIES = 14;

/** Progress at evenly spaced points from the project's start to today: the line inside each card. */
function series(p: Project, mine: (u: Unit) => boolean, member: boolean): number[] {
  const t0 = ms(p.start), t1 = nowMs();
  if (!isFinite(t0) || t1 <= t0) return [0, 0];
  const items = p.stages.flatMap((s) => s.items).filter((i) => mine(i.unit));
  return Array.from({ length: SERIES }, (_, k) => {
    const t = t0 + ((t1 - t0) * k) / (SERIES - 1);
    if (!member) return Math.round(actualAt(p, t));
    return items.length ? Math.round((100 * items.filter((i) => i.done && (i.doneAt ? ms(i.doneAt) : t0) <= t).length) / items.length) : 0;
  });
}

export async function buildGlass(access: Access): Promise<GlassData> {
  const member = access.role === "member";
  const mine = (u: Unit) => !member || u === access.unit;
  const units = member && access.unit ? [access.unit] : null;
  const all = (await loadProjects()).map((p) => filterProject(p, access));
  const open = all.filter(isOpen);

  const projects: GlassProject[] = open.map((p) => {
    const items = p.stages.flatMap((s) => s.items);
    const done = items.filter((i) => i.done).length;
    const ci = p.stages.findIndex((s) => stagePct(s) < 100);
    const al = alertsOf(p, units, 60);
    const next = al.find((a) => a.d >= 0);
    const risks = p.risks.filter((r) => r.status !== "closed");
    return {
      id: p.id, name: p.name, code: p.code ?? "", lead: p.lead ?? "", health: health(p), status: p.status,
      // A member's card shows their unit's share of the work; the whole project's progress comes from the server.
      pc: member ? (items.length ? Math.round((100 * done) / items.length) : 0) : progress(p),
      plan: member ? (p.overall ?? 0) : Math.round(plannedAt(p, nowMs())),
      v: member ? 0 : sv(p),
      series: series(p, mine, member), done, total: items.length,
      over: al.filter((a) => a.d < 0).length,
      stage: ci >= 0 ? p.stages[ci].title : "", stageIndex: ci,
      target: p.target, daysLeft: p.target ? daysTo(p.target) : null,
      next: next ? { text: next.text, d: next.d } : null,
      risks: risks.length, hiRisks: risks.filter((r) => riskScore(r) >= 15).length,
    };
  }).sort((a, b) => b.over - a.over || a.v - b.v);

  const alerts: GlassAlert[] = open.flatMap((p) => alertsOf(p, units, 30)).sort((a, b) => a.d - b.d)
    .map((a) => ({ project: a.project, projectName: a.projectName, unit: a.unit, d: a.d, due: a.due, text: a.text, kind: a.kind }));

  const unitRows: GlassUnit[] = (Object.keys(UNITS) as Unit[]).filter(mine).map((u) => {
    const items = open.flatMap((p) => p.stages.flatMap((s) => s.items)).filter((i) => i.unit === u);
    return {
      u, done: items.filter((i) => i.done).length, total: items.length,
      over: alerts.filter((a) => a.unit === u && a.d < 0).length,
      soon: alerts.filter((a) => a.unit === u && a.d >= 0 && a.d <= 7).length,
      week: items.filter((i) => i.done && i.doneAt && daysTo(i.doneAt) > -7).length,
    };
  }).filter((r) => r.total || r.over || r.soon);

  const events: GlassEvent[] = all.flatMap((p) => p.events.map((e) => ({ id: e.id, project: p.id, projectName: p.name, kind: e.kind, text: e.text, at: e.at || ms(e.date), by: e.by ?? "" })))
    .sort((a, b) => b.at - a.at).slice(0, 12);

  const h = projects.map((p) => p.health);
  return {
    role: access.role, unit: access.unit, name: access.user.name || access.user.mobile,
    totals: {
      open: projects.length, all: all.length,
      avg: projects.length ? Math.round(projects.reduce((a, p) => a + p.pc, 0) / projects.length) : 0,
      late: h.filter((x) => x === "late").length, risk: h.filter((x) => x === "risk").length, ok: h.filter((x) => x === "ok").length, hold: h.filter((x) => x === "hold").length,
      overdue: alerts.filter((a) => a.d < 0).length, soon: alerts.filter((a) => a.d >= 0 && a.d <= 7).length,
      week: unitRows.reduce((a, r) => a + r.week, 0),
      hiRisks: projects.reduce((a, p) => a + p.hiRisks, 0),
    },
    projects, units: unitRows, alerts: alerts.slice(0, 60), events, stamp: nowMs(),
  };
}
