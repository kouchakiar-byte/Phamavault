import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { getUser, type User } from "@/lib/auth";
import { databaseConfigured, db } from "@/lib/db";
import {
  LISTS, LIST_KEYS, STABILITY_UNIT, UNITS, alertsOf, progress, isDate, isUnit, normalize, uid, today,
  type Alert, type Item, type ListKey, type Project, type Role, type Row, type Study, type Unit,
} from "./model";

/** Who is looking: the site owner (an admin) sees and edits everything; a manager sees everything; a member sees one unit. */
export type Access = { user: User; role: Role; unit: Unit | null; title: string };

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export const getAccess = cache(async (): Promise<Access | null> => {
  if (!databaseConfigured()) return null;
  const user = await getUser().catch(() => null);
  if (!user) return null;
  if (user.isAdmin) return { user, role: "owner", unit: null, title: "" };
  const { rows } = await (await db()).query<{ unit: string; role: string; title: string }>(
    "select unit, role, title from rnd_members where user_id = $1 and revoked_at is null",
    [user.id],
  );
  const m = rows[0];
  if (!m) return null;
  if (m.role === "manager") return { user, role: "manager", unit: null, title: m.title };
  return isUnit(m.unit) ? { user, role: "member", unit: m.unit, title: m.title } : null;
});

/** The units whose work this reader may see; null means all of them. */
export const unitsOf = (a: Access): Unit[] | null => (a.role === "member" && a.unit ? [a.unit] : null);

/**
 * The copy of a project a member's browser receives: only the tasks, register rows, stability studies
 * and log entries of their unit. Budget, costs, gate notes and other units' work never leave the server.
 */
export function filterProject(p: Project, a: Access): Project {
  if (a.role !== "member" || !a.unit) return p;
  const u = a.unit;
  const keep = (r: { unit: Unit }) => r.unit === u;
  const out: Project = {
    ...p,
    budget: undefined, notes: undefined, requester: undefined, team: undefined,
    stages: p.stages.map((s) => ({ ...s, gate: { decision: s.gate.decision }, items: s.items.filter(keep) })),
    stability: u === STABILITY_UNIT ? p.stability : [],
    events: p.events.filter(keep),
    partial: true,
    overall: progress(p),
  } as Project;
  for (const k of LIST_KEYS) out[k] = LISTS[k].ownerOnly ? [] : p[k].filter(keep);
  return out;
}

// ---------- storage ----------
type DbRow = { id: string; data: Record<string, unknown>; version: number };
export async function loadProjects(): Promise<Project[]> {
  const { rows } = await (await db()).query<DbRow>("select id, data, version from rnd_projects where deleted_at is null order by updated_at desc");
  return rows.map((r) => normalize(r.data, r.id));
}
export async function loadProject(id: string): Promise<Project | null> {
  if (!/^[\w-]{1,40}$/.test(id)) return null;
  const { rows } = await (await db()).query<DbRow>("select id, data, version from rnd_projects where id = $1 and deleted_at is null", [id]);
  return rows[0] ? normalize(rows[0].data, rows[0].id) : null;
}

/** Alerts for this reader across every open project, worst first. */
export const alertsFor = cache(async (a: Access, days = 30): Promise<Alert[]> => {
  const all = (await loadProjects()).flatMap((p) => alertsOf(p, unitsOf(a), days));
  return all.sort((x, y) => x.d - y.d);
});

/** What each person with access did in the last `days` days, from the audit trail: for the manager's weekly summary. */
export type Activity = { name: string; unit: string; role: string; actions: number; last: string | null };
export async function activitySince(days: number): Promise<Activity[]> {
  const pool = await db();
  const members = await pool.query<{ name: string; mobile: string; unit: string; role: string; actions: number; last: Date | null }>(
    `select u.name, u.mobile, m.unit, m.role, count(a.id)::int as actions, max(a.at) as last
       from rnd_members m join users u on u.id = m.user_id
       left join rnd_audit a on a.user_id = m.user_id and a.at > now() - make_interval(days => $1)
      where m.revoked_at is null
      group by u.name, u.mobile, m.unit, m.role`,
    [days],
  );
  const owners = await pool.query<{ name: string; mobile: string; actions: number; last: Date | null }>(
    `select u.name, u.mobile, count(a.id)::int as actions, max(a.at) as last
       from rnd_audit a join users u on u.id = a.user_id
      where a.unit = 'owner' and a.at > now() - make_interval(days => $1)
      group by u.name, u.mobile`,
    [days],
  );
  const row = (r: { name: string; mobile: string; actions: number; last: Date | null }, unit: string, role: string): Activity => ({ name: r.name || r.mobile, unit, role, actions: r.actions, last: r.last ? r.last.toISOString() : null });
  return [...owners.rows.map((r) => row(r, "pm", "owner")), ...members.rows.map((r) => row(r, r.unit, r.role))].sort((a, b) => b.actions - a.actions || a.name.localeCompare(b.name, "fa"));
}

// ---------- invitations ----------
export const newToken = () => randomBytes(24).toString("base64url");

// ---------- operations ----------
/** One change a reader asks for. Every op is checked against the reader's role and unit before it touches the record. */
export type Op =
  | { op: "item"; stage: string; item: string; done?: boolean; t?: string; owner?: string; due?: string; unit?: string }
  | { op: "addItem"; stage: string; t: string; unit: string; due?: string; owner?: string }
  | { op: "delItem"; stage: string; item: string }
  | { op: "comment"; stage: string; item: string; text: string }
  | { op: "stage"; stage: string; due?: string; w?: number; title?: string; decision?: string; by?: string; date?: string; note?: string }
  | { op: "row"; list: string; id?: string; data: Record<string, unknown> }
  | { op: "delRow"; list: string; id: string }
  | { op: "study"; id?: string; data: Record<string, unknown> }
  | { op: "delStudy"; id: string }
  | { op: "pull"; id: string; month: number; done?: boolean; result?: Record<string, string> }
  | { op: "event"; kind: string; text: string; date?: string }
  | { op: "meta"; data: Record<string, unknown> };

export class Denied extends Error {}
const deny = (why = "denied"): never => { throw new Denied(why); };

const str = (v: unknown, max = 400) => String(v ?? "").replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, max);
const dateOr = (v: unknown) => (v === "" || v == null ? undefined : isDate(v) ? v : deny("date"));

function findItem(p: Project, stage: string, item: string): { s: Project["stages"][number]; it: Item } {
  const s = p.stages.find((x) => x.key === stage) ?? deny("stage");
  const it = s.items.find((x) => x.id === item) ?? deny("item");
  return { s, it };
}

/** Cleans a register row to its schema's columns. */
function cleanRow(list: ListKey, data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of LISTS[list].cols) {
    if (c.t === "calc" || !(c.k in data)) continue;
    const v = data[c.k];
    if (c.t === "date") out[c.k] = v ? dateOr(v) ?? "" : "";
    else if (c.t === "num") out[c.k] = Number.isFinite(+(v as number)) ? +(v as number) : 0;
    else if (c.t === "sel") out[c.k] = c.o && String(v) in c.o ? String(v) : deny("option");
    else out[c.k] = str(v, 600);
  }
  return out;
}

/**
 * Applies the ops to the full stored project and returns a short description of each change for the
 * audit trail. Members may only work on their own unit's tasks and rows; only the owner shapes the plan.
 */
export function applyOps(p: Project, ops: Op[], a: Access): string[] {
  const owner = a.role === "owner";
  const mine = (u: Unit) => owner || (a.role === "member" && a.unit === u);
  const who = a.user.name || a.user.mobile;
  const logUnit: Unit = a.unit ?? "pm";
  const log: string[] = [];
  const auto = (text: string) => p.events.unshift({ id: uid("e"), date: today(), kind: "auto", text, at: Date.now(), unit: logUnit, by: who });

  for (const o of ops) {
    switch (o.op) {
      case "item": {
        const { s, it } = findItem(p, o.stage, o.item);
        if (!mine(it.unit)) deny();
        if (o.done !== undefined && o.done !== it.done) {
          it.done = Boolean(o.done);
          if (it.done) it.doneAt = today(); else delete it.doneAt;
          log.push(`${it.done ? "تکمیل" : "بازگشایی"} وظیفه «${it.t}»`);
          if (it.done && s.items.every((x) => x.done)) auto(`مرحله «${s.title}» تکمیل شد.`);
        }
        if (o.t !== undefined || o.owner !== undefined || o.due !== undefined || o.unit !== undefined) {
          if (!owner) deny();
          if (o.t !== undefined) it.t = str(o.t, 200) || it.t;
          if (o.owner !== undefined) it.owner = str(o.owner, 80);
          if (o.due !== undefined) it.due = dateOr(o.due);
          if (o.unit !== undefined) it.unit = isUnit(o.unit) ? o.unit : deny("unit");
          log.push(`ویرایش وظیفه «${it.t}»`);
        }
        break;
      }
      case "addItem": {
        if (!owner) deny();
        const s = p.stages.find((x) => x.key === o.stage) ?? deny("stage");
        const t = str(o.t, 200) || deny("text");
        s.items.push({ id: uid("i"), t, done: false, unit: isUnit(o.unit) ? o.unit : deny("unit"), due: dateOr(o.due), owner: str(o.owner, 80) || undefined });
        log.push(`افزودن وظیفه «${t}» به «${s.title}»`);
        break;
      }
      case "delItem": {
        if (!owner) deny();
        const { s, it } = findItem(p, o.stage, o.item);
        s.items = s.items.filter((x) => x !== it);
        log.push(`حذف وظیفه «${it.t}»`);
        break;
      }
      case "comment": {
        const { it } = findItem(p, o.stage, o.item);
        if (a.role === "member" && it.unit !== a.unit) deny();
        const text = str(o.text, 1000) || deny("text");
        (it.comments ??= []).push({ by: a.user.id, name: who, unit: a.unit ? UNITS[a.unit] : a.role === "owner" ? "مدیر پروژه" : "مدیر", at: Date.now(), text });
        log.push(`یادداشت روی وظیفه «${it.t}»`);
        break;
      }
      case "stage": {
        if (!owner) deny();
        const s = p.stages.find((x) => x.key === o.stage) ?? deny("stage");
        if (o.due !== undefined) s.due = dateOr(o.due) ?? s.due;
        if (o.w !== undefined) s.w = Math.max(0, Math.min(100, Math.round(+o.w || 0)));
        if (o.title !== undefined) s.title = str(o.title, 120) || s.title;
        if (o.decision !== undefined) {
          const d = ["pending", "go", "hold", "nogo"].includes(o.decision) ? (o.decision as Project["stages"][number]["gate"]["decision"]) : deny("gate");
          const changed = d !== s.gate.decision;
          s.gate = { decision: d, by: str(o.by, 80), date: dateOr(o.date), note: str(o.note, 600) };
          if (changed && d !== "pending") p.events.unshift({ id: uid("e"), date: s.gate.date || today(), kind: "decision", text: `تصمیم Gate «${s.title}»: ${d === "go" ? "Go" : d === "hold" ? "Hold" : "No-go"}${s.gate.note ? ` — ${s.gate.note}` : ""}`, at: Date.now(), unit: "pm", by: who });
        }
        log.push(`ویرایش مرحله «${s.title}»`);
        break;
      }
      case "row": {
        const list = (LIST_KEYS as string[]).includes(o.list) ? (o.list as ListKey) : deny("list");
        const def = LISTS[list];
        if (def.ownerOnly && !owner) deny();
        const data = cleanRow(list, o.data ?? {});
        const rows = p[list] as Row[];
        if (o.id) {
          const r = rows.find((x) => x.id === o.id) ?? deny("row");
          if (!mine(r.unit)) deny();
          const tracked = def.cols.find((c) => c.log && c.k in data && data[c.k] !== r[c.k]);
          Object.assign(r, data);
          if (owner && isUnit(o.data?.unit)) r.unit = o.data.unit as Unit;
          if (tracked) auto(`${def.title}: «${String(r[def.cols[0].k] || "—")}» → ${tracked.o?.[String(data[tracked.k])] ?? data[tracked.k]}`);
          log.push(`ویرایش ردیف در ${def.title}`);
        } else {
          if (a.role === "manager") deny();
          const unit: Unit = owner ? (isUnit(o.data?.unit) ? (o.data.unit as Unit) : def.unit) : (a.unit as Unit);
          const blank = Object.fromEntries(def.cols.filter((c) => c.t !== "calc").map((c) => [c.k, c.t === "sel" ? Object.keys(c.o!)[0] : c.t === "num" ? 0 : c.t === "date" ? today() : ""]));
          rows.push({ ...blank, ...data, id: uid("r"), unit });
          log.push(`ردیف جدید در ${def.title}`);
        }
        break;
      }
      case "delRow": {
        const list = (LIST_KEYS as string[]).includes(o.list) ? (o.list as ListKey) : deny("list");
        const rows = p[list] as Row[];
        const r = rows.find((x) => x.id === o.id) ?? deny("row");
        if (!mine(r.unit) || (LISTS[list].ownerOnly && !owner)) deny();
        p[list] = rows.filter((x) => x !== r) as never;
        log.push(`حذف ردیف از ${LISTS[list].title}`);
        break;
      }
      case "study": case "delStudy": case "pull": {
        if (!mine(STABILITY_UNIT)) deny();
        if (o.op === "delStudy") { p.stability = p.stability.filter((s) => s.id !== o.id); log.push("حذف مطالعه پایداری"); break; }
        if (o.op === "pull") {
          const st = p.stability.find((s) => s.id === o.id) ?? deny("study");
          const m = Number(o.month);
          if (!st.months.includes(m)) deny("month");
          if (o.done !== undefined) {
            st.done = o.done ? [...new Set([...st.done, m])].sort((x, y) => x - y) : st.done.filter((x) => x !== m);
            if (o.done) auto(`نمونه‌برداری پایداری ${m}M انجام شد — ${st.cond}`);
          }
          if (o.result) {
            const r = o.result;
            const prev = st.results[m] ?? {};
            const next = { ...prev, ...Object.fromEntries((["assay", "imp", "diss", "other", "ok"] as const).filter((k) => k in r).map((k) => [k, str(r[k], k === "other" ? 200 : 20)])) };
            if (next.ok && !["pass", "fail"].includes(next.ok)) deny("result");
            st.results[m] = next;
            const v = parseFloat(next.assay ?? "");
            if (next.assay !== prev.assay && Number.isFinite(v) && (v < st.specMin || v > st.specMax))
              p.events.unshift({ id: uid("e"), date: today(), kind: "issue", text: `Assay خارج از محدوده در پایداری ${m}M (${st.cond}): ${v}% — محدوده ${st.specMin} تا ${st.specMax}%`, at: Date.now(), unit: STABILITY_UNIT, by: who });
          }
          log.push(`پایداری ${m}M — ${st.cond}`);
          break;
        }
        const d = o.data ?? {};
        const months = Array.isArray(d.months) ? [...new Set((d.months as unknown[]).map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n <= 60))].sort((x, y) => x - y) : undefined;
        const patch: Partial<Study> = {};
        if ("cond" in d) patch.cond = str(d.cond, 120) || deny("cond");
        if (months) patch.months = months;
        if ("start" in d) patch.start = dateOr(d.start) ?? "";
        if ("batches" in d) patch.batches = str(d.batches, 120);
        if ("specMin" in d) patch.specMin = Number.isFinite(+(d.specMin as number)) ? +(d.specMin as number) : 95;
        if ("specMax" in d) patch.specMax = Number.isFinite(+(d.specMax as number)) ? +(d.specMax as number) : 105;
        if (o.id) Object.assign(p.stability.find((s) => s.id === o.id) ?? deny("study"), patch);
        else p.stability.push({ id: uid("s"), cond: patch.cond || deny("cond"), months: patch.months || [0], start: patch.start || today(), done: [], results: {}, specMin: patch.specMin ?? 95, specMax: patch.specMax ?? 105, batches: patch.batches });
        log.push(o.id ? "ویرایش مطالعه پایداری" : "مطالعه پایداری جدید");
        break;
      }
      case "event": {
        const kind = ["note", "decision", "issue"].includes(o.kind) ? (o.kind as "note" | "decision" | "issue") : deny("kind");
        const text = str(o.text, 1000) || deny("text");
        p.events.unshift({ id: uid("e"), date: dateOr(o.date) ?? today(), kind, text, at: Date.now(), unit: logUnit, by: who });
        log.push(kind === "issue" ? "ثبت مشکل" : kind === "decision" ? "ثبت تصمیم" : "ثبت یادداشت");
        break;
      }
      case "meta": {
        if (!owner) deny();
        const d = o.data ?? {};
        for (const k of ["name", "code", "form", "strength", "lead", "requester", "market", "rld", "team", "notes", "unit"] as const) if (k in d) (p as Record<string, unknown>)[k] = str(d[k], k === "notes" ? 3000 : 160);
        if (!p.name) deny("name");
        for (const k of ["start", "target"] as const) if (k in d) p[k] = dateOr(d[k]) ?? p[k];
        if ("budget" in d) p.budget = Number.isFinite(+(d.budget as number)) ? Math.max(0, +(d.budget as number)) : 0;
        if ("type" in d && ["generic", "new", "ext", "transfer", "reform"].includes(String(d.type))) p.type = String(d.type);
        if ("priority" in d && ["high", "medium", "low"].includes(String(d.priority))) p.priority = d.priority as Project["priority"];
        if ("status" in d && ["active", "hold", "done", "cancelled"].includes(String(d.status)) && d.status !== p.status) {
          p.status = d.status as Project["status"];
          auto(`وضعیت پروژه: ${{ active: "در جریان", hold: "متوقف", done: "تکمیل", cancelled: "لغو" }[p.status]}`);
        }
        log.push("ویرایش مشخصات پروژه");
        break;
      }
      default:
        deny("op");
    }
  }
  p.updatedAt = Date.now();
  if (p.events.length > 500) p.events.length = 500;
  return log;
}
