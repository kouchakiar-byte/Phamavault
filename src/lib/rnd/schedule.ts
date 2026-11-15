/*
 * Scheduling by the critical path method. Activities are linked by finish-to-start dependencies
 * (`deps`, by activity code); durations are calendar days and dates are inclusive, so an activity of
 * 5 days starting on the 1st ends on the 5th and its successors start on the 6th.
 *
 * - schedule(): works out every activity's planned start and end from the project start, the durations
 *   and the dependencies. "plan" keeps to the plan; "actual" re-plans what is left from what has really
 *   happened: finished work counts from its real finish, and unfinished work cannot end before today.
 * - cpm(): for display, the slack of each activity and which ones are critical (no slack: any delay
 *   there delays the end of the project).
 */
import type { Item, Project } from "./model";

// Day arithmetic in whole UTC days, so the time zone of the server or the browser never shifts a date.
const DAY = 86400000;
const isDate = (v: unknown): v is string => typeof v === "string" && /^(19|20|21)\d{2}-\d{2}-\d{2}$/.test(v);
const day = (s: string) => Math.round(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / DAY);
const iso = (d: number) => new Date(d * DAY).toISOString().slice(0, 10);
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const len = (it: Item) => Math.max(1, Math.round(+(it.dur ?? 0) || 0) || (isDate(it.start) && isDate(it.due) ? day(it.due) - day(it.start) + 1 : 5));

type Node = { it: Item; stage: number; deps: Node[]; succ: Node[] };

/** The activities as a graph, in an order where every activity comes after the ones it depends on. Cycles are cut. */
function graph(p: Project): Node[] {
  const nodes: Node[] = [];
  const byCode = new Map<string, Node>();
  p.stages.forEach((s, si) => s.items.forEach((it) => {
    const n: Node = { it, stage: si, deps: [], succ: [] };
    nodes.push(n);
    if (it.code) byCode.set(it.code, n);
  }));
  for (const n of nodes) for (const c of n.it.deps ?? []) { const d = byCode.get(c); if (d && d !== n) { n.deps.push(d); d.succ.push(n); } }
  const order: Node[] = [], state = new Map<Node, 1 | 2>();
  const visit = (n: Node) => {
    if (state.get(n) === 2) return;
    if (state.get(n) === 1) return; // a cycle: this link is ignored
    state.set(n, 1);
    for (const d of n.deps) visit(d);
    state.set(n, 2);
    order.push(n);
  };
  nodes.forEach(visit);
  return order;
}

/** Sets planned start and end on every activity and the due date of every phase. Returns the planned end of the project. */
export function schedule(p: Project, mode: "plan" | "actual" = "plan"): string {
  const order = graph(p), end = new Map<Node, number>(), t0 = day(p.start), now = day(today());
  for (const n of order) {
    const it = n.it, d = len(it);
    let es = t0;
    for (const dep of n.deps) es = Math.max(es, (end.get(dep) ?? t0) + 1);
    if (it.pin && isDate(it.start)) es = day(it.start);
    if (mode === "actual" && isDate(it.aStart)) es = day(it.aStart);
    let ef = es + d - 1;
    if (mode === "actual") {
      if (it.done && isDate(it.doneAt)) ef = day(it.doneAt);
      else if (!it.done && ef < now) ef = now + Math.ceil((d * (100 - (+(it.pct ?? 0) || 0))) / 100); // what is left of it, from today
    }
    if (!(mode === "actual" && it.done)) { it.start = iso(es); it.due = iso(Math.max(es, ef)); it.dur = d; }
    end.set(n, ef);
  }
  for (const s of p.stages) {
    const dues = s.items.map((i) => i.due).filter(isDate).sort();
    if (dues.length) s.due = dues[dues.length - 1];
  }
  const last = Math.max(t0, ...[...end.values()]);
  return iso(last);
}

/** Fixes the current plan as the baseline: later slippage is measured against it. */
export function baseline(p: Project) {
  for (const s of p.stages) for (const it of s.items) if (isDate(it.due)) it.base = it.due;
}

export type CpmInfo = { slack: number; crit: boolean };
/** Slack in days for each activity (by id), from the planned dates. Finished activities are never critical. */
export function cpm(p: Project): Map<string, CpmInfo> {
  const order = graph(p), out = new Map<string, CpmInfo>();
  const dated = order.filter((n) => isDate(n.it.start) && isDate(n.it.due));
  if (!dated.length) return out;
  const finish = Math.max(...dated.map((n) => day(n.it.due!)));
  const lf = new Map<Node, number>();
  for (const n of [...order].reverse()) {
    if (!isDate(n.it.start) || !isDate(n.it.due)) continue;
    let late = finish;
    for (const s of n.succ) if (isDate(s.it.start) && lf.has(s)) late = Math.min(late, (lf.get(s)! - len(s.it) + 1) - 1);
    lf.set(n, late);
    const slack = late - day(n.it.due!);
    out.set(n.it.id, { slack, crit: !n.it.done && slack <= 0 });
  }
  return out;
}

/** Activities whose predecessors are not all finished: they cannot really start yet. */
export function waitingOn(p: Project, it: Item): Item[] {
  if (!it.deps?.length) return [];
  const all = p.stages.flatMap((s) => s.items);
  return it.deps.map((c) => all.find((x) => x.code === c)).filter((x): x is Item => Boolean(x && !x.done));
}

/** Where an activity stands, from its dates, its progress and its predecessors. */
export type ActivityStatus = "done" | "late" | "active" | "waiting" | "ready" | "upcoming";
export function activityStatus(p: Project, it: Item): ActivityStatus {
  if (it.done) return "done";
  const now = day(today());
  if (isDate(it.due) && day(it.due) < now) return "late";
  if ((+(it.pct ?? 0) || 0) > 0 || it.aStart) return "active";
  if (isDate(it.start) && day(it.start) <= now) return waitingOn(p, it).length ? "waiting" : "ready";
  return "upcoming";
}
