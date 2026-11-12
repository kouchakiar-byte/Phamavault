"use server";

import { getUser, normalizeMobile } from "@/lib/auth";
import { databaseConfigured, db, transaction } from "@/lib/db";
import { MEMBER_UNITS, STAGES, isDate, isUnit, newProject, normalize, uid, type Project } from "./model";
import { Denied, applyOps, filterProject, getAccess, loadProject, newToken, sha256, type Op } from "./server";

type Fail = { ok: false; error: "signin" | "denied" | "invalid" | "unavailable" | "notfound" | "nouser" };
export type ProjectResult = { ok: true; project: Project } | Fail;
const MAX_BYTES = 900_000;

async function owner() {
  const a = await getAccess();
  return a?.role === "owner" ? a : null;
}

/** Applies a batch of changes to one project, inside a row lock so two people saving at once never overwrite each other. */
export async function rndApply(id: string, ops: Op[]): Promise<ProjectResult> {
  if (!databaseConfigured()) return { ok: false, error: "unavailable" };
  const a = await getAccess();
  if (!a) return { ok: false, error: "signin" };
  if (!Array.isArray(ops) || !ops.length || ops.length > 50) return { ok: false, error: "invalid" };
  if (a.role === "manager" && ops.some((o) => o.op !== "comment" && o.op !== "event")) return { ok: false, error: "denied" };
  try {
    const project = await transaction(async (c) => {
      const { rows } = await c.query<{ data: Record<string, unknown> }>("select data from rnd_projects where id = $1 and deleted_at is null for update", [id]);
      if (!rows[0]) return null;
      const p = normalize(rows[0].data, id);
      const log = applyOps(p, ops, a);
      const json = JSON.stringify(p);
      if (json.length > MAX_BYTES) throw new Denied("size");
      await c.query("update rnd_projects set data = $2::jsonb, version = version + 1, updated_at = now() where id = $1", [id, json]);
      for (const action of log) await c.query("insert into rnd_audit (project_id, user_id, unit, action) values ($1, $2, $3, $4)", [id, a.user.id, a.unit ?? a.role, action]);
      return p;
    });
    if (!project) return { ok: false, error: "notfound" };
    return { ok: true, project: filterProject(project, a) };
  } catch (e) {
    return { ok: false, error: e instanceof Denied ? (e.message === "denied" ? "denied" : "invalid") : "unavailable" };
  }
}

/** The latest copy of a project, filtered for the reader (used to refresh after someone else saves). */
export async function rndGet(id: string): Promise<ProjectResult> {
  const a = await getAccess().catch(() => null);
  if (!a) return { ok: false, error: "signin" };
  try {
    const p = await loadProject(id);
    return p ? { ok: true, project: filterProject(p, a) } : { ok: false, error: "notfound" };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export type NewProjectForm = { name: string; code: string; form: string; type: string; lead: string; requester: string; priority: string; start: string; target: string; budget: number };

export async function rndCreate(f: NewProjectForm): Promise<{ ok: true; id: string } | Fail> {
  const a = await owner();
  if (!a) return { ok: false, error: "denied" };
  const name = String(f?.name ?? "").trim().slice(0, 160);
  if (!name || !isDate(f.start) || !isDate(f.target) || f.target <= f.start) return { ok: false, error: "invalid" };
  const p = newProject({ ...f, name, code: String(f.code ?? "").slice(0, 40), form: String(f.form ?? "").slice(0, 80), lead: String(f.lead ?? "").slice(0, 80), requester: String(f.requester ?? "").slice(0, 80), budget: Math.max(0, +f.budget || 0) });
  try {
    await (await db()).query("insert into rnd_projects (id, data, created_by) values ($1, $2::jsonb, $3)", [p.id, JSON.stringify(p), a.user.id]);
    await (await db()).query("insert into rnd_audit (project_id, user_id, unit, action) values ($1, $2, 'owner', $3)", [p.id, a.user.id, "ایجاد پروژه"]);
    return { ok: true, id: p.id };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

/** Brings in a project exported as JSON (from this module or the earlier stand-alone dashboard) as a new project. */
export async function rndImport(json: string): Promise<{ ok: true; id: string } | Fail> {
  const a = await owner();
  if (!a) return { ok: false, error: "denied" };
  if (typeof json !== "string" || json.length > MAX_BYTES) return { ok: false, error: "invalid" };
  try {
    const raw = JSON.parse(json) as Record<string, unknown>;
    if (!raw || typeof raw !== "object" || typeof raw.name !== "string" || !Array.isArray(raw.stages)) return { ok: false, error: "invalid" };
    // Tasks from the stand-alone dashboard have no owning unit: take it from the template task of the same wording.
    const unitOf = new Map(STAGES.flatMap((s) => s.items.map(([t, u]) => [t, u] as const)));
    const stages = (raw.stages as Record<string, unknown>[]).map((s) => ({ ...s, items: (Array.isArray(s.items) ? s.items : []).map((i: Record<string, unknown> | string) => {
      const it = typeof i === "string" ? { t: i, done: false } : i;
      return { ...it, unit: isUnit(it.unit) ? it.unit : unitOf.get(String(it.t)) ?? "pm" };
    }) }));
    const p = normalize({ ...raw, stages, events: Array.isArray(raw.events) ? raw.events : [], createdAt: Date.now(), updatedAt: Date.now() }, uid("p"));
    // Every task and row needs an id; a stage without a valid due date takes the target date.
    p.stages = p.stages.map((s) => ({ ...s, due: isDate(s.due) ? s.due : p.target, items: s.items.map((i) => ({ ...i, id: i.id || uid("i") })) }));
    for (const k of ["trials", "methods", "purchases", "batches", "risks", "docs", "costs"] as const) p[k] = p[k].map((r) => ({ ...r, id: r.id || uid("r") }));
    p.stability = p.stability.map((s) => ({ ...s, id: s.id || uid("s") }));
    await (await db()).query("insert into rnd_projects (id, data, created_by) values ($1, $2::jsonb, $3)", [p.id, JSON.stringify(p), a.user.id]);
    await (await db()).query("insert into rnd_audit (project_id, user_id, unit, action) values ($1, $2, 'owner', $3)", [p.id, a.user.id, "ورود پروژه از فایل JSON"]);
    return { ok: true, id: p.id };
  } catch {
    return { ok: false, error: "invalid" };
  }
}

/** Moves a project out of every list. It stays in the database so it can be restored by hand. */
export async function rndDelete(id: string): Promise<{ ok: true } | Fail> {
  const a = await owner();
  if (!a) return { ok: false, error: "denied" };
  try {
    await (await db()).query("update rnd_projects set deleted_at = now() where id = $1", [id]);
    await (await db()).query("insert into rnd_audit (project_id, user_id, unit, action) values ($1, $2, 'owner', $3)", [id, a.user.id, "حذف پروژه"]);
    return { ok: true };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export type AuditRow = { at: string; who: string; unit: string; action: string };
export async function rndAudit(id: string): Promise<{ ok: true; rows: AuditRow[] } | Fail> {
  const a = await owner();
  if (!a) return { ok: false, error: "denied" };
  try {
    const { rows } = await (await db()).query<{ at: Date; name: string | null; mobile: string | null; unit: string; action: string }>(
      "select a.at, u.name, u.mobile, a.unit, a.action from rnd_audit a left join users u on u.id = a.user_id where a.project_id = $1 order by a.at desc limit 300",
      [id],
    );
    return { ok: true, rows: rows.map((r) => ({ at: r.at.toISOString(), who: r.name || r.mobile || "—", unit: r.unit, action: r.action })) };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

// ---------- team ----------
export type Member = { id: string; name: string; mobile: string; unit: string; role: string; title: string; since: string; revoked: boolean };
export type Invite = { id: string; label: string; unit: string; role: string; created: string; expires: string; usedBy: string | null; revoked: boolean };
export type Team = { members: Member[]; invites: Invite[] };
type TeamResult = ({ ok: true } & Team) | Fail;

async function team(): Promise<Team> {
  const pool = await db();
  const m = await pool.query<{ id: string; name: string; mobile: string; unit: string; role: string; title: string; created_at: Date; revoked_at: Date | null }>(
    "select m.id, u.name, u.mobile, m.unit, m.role, m.title, m.created_at, m.revoked_at from rnd_members m join users u on u.id = m.user_id order by m.revoked_at nulls first, m.created_at desc",
  );
  const i = await pool.query<{ id: string; label: string; unit: string; role: string; created_at: Date; expires_at: Date; used: string | null; revoked_at: Date | null }>(
    "select i.id, i.label, i.unit, i.role, i.created_at, i.expires_at, coalesce(u.name, u.mobile) as used, i.revoked_at from rnd_invites i left join users u on u.id = i.used_by order by i.created_at desc limit 100",
  );
  return {
    members: m.rows.map((r) => ({ id: String(r.id), name: r.name, mobile: r.mobile, unit: r.unit, role: r.role, title: r.title, since: r.created_at.toISOString(), revoked: Boolean(r.revoked_at) })),
    invites: i.rows.map((r) => ({ id: String(r.id), label: r.label, unit: r.unit, role: r.role, created: r.created_at.toISOString(), expires: r.expires_at.toISOString(), usedBy: r.used, revoked: Boolean(r.revoked_at) })),
  };
}

export async function rndTeam(): Promise<TeamResult> {
  if (!(await owner())) return { ok: false, error: "denied" };
  try {
    return { ok: true, ...(await team()) };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

const cleanRole = (role: unknown) => (role === "manager" ? "manager" : "member");
const cleanUnit = (unit: unknown, role: string) => (role === "manager" ? "pm" : isUnit(unit) && (MEMBER_UNITS as string[]).includes(unit) ? unit : null);

/** Gives an existing site account access, by its mobile number. */
export async function rndAddMember(mobile: string, unit: string, role: string, title: string): Promise<TeamResult> {
  const a = await owner();
  if (!a) return { ok: false, error: "denied" };
  const m = normalizeMobile(String(mobile ?? ""));
  const r = cleanRole(role), u = cleanUnit(unit, r);
  if (!m || !u) return { ok: false, error: "invalid" };
  try {
    const pool = await db();
    const { rows } = await pool.query<{ id: string }>("select id from users where mobile = $1", [m]);
    if (!rows[0]) return { ok: false, error: "nouser" };
    await pool.query(
      `insert into rnd_members (user_id, unit, role, title, added_by) values ($1, $2, $3, $4, $5)
       on conflict (user_id) do update set unit = excluded.unit, role = excluded.role, title = excluded.title, revoked_at = null`,
      [rows[0].id, u, r, String(title ?? "").trim().slice(0, 80), a.user.id],
    );
    return { ok: true, ...(await team()) };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export async function rndUpdateMember(id: string, unit: string, role: string, title: string): Promise<TeamResult> {
  if (!(await owner())) return { ok: false, error: "denied" };
  const r = cleanRole(role), u = cleanUnit(unit, r);
  if (!/^\d+$/.test(String(id)) || !u) return { ok: false, error: "invalid" };
  try {
    await (await db()).query("update rnd_members set unit = $2, role = $3, title = $4 where id = $1", [id, u, r, String(title ?? "").trim().slice(0, 80)]);
    return { ok: true, ...(await team()) };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

/** Ends or restores a member's access. It takes effect on their very next page load or save. */
export async function rndSetRevoked(id: string, revoked: boolean): Promise<TeamResult> {
  if (!(await owner())) return { ok: false, error: "denied" };
  if (!/^\d+$/.test(String(id))) return { ok: false, error: "invalid" };
  try {
    await (await db()).query(`update rnd_members set revoked_at = ${revoked ? "now()" : "null"} where id = $1`, [id]);
    return { ok: true, ...(await team()) };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

/** A one-time invitation link. The token is returned once and only its hash is stored. */
export async function rndCreateInvite(unit: string, role: string, label: string, days: number): Promise<({ ok: true; token: string } & Team) | Fail> {
  const a = await owner();
  if (!a) return { ok: false, error: "denied" };
  const r = cleanRole(role), u = cleanUnit(unit, r);
  const d = Math.max(1, Math.min(30, Math.round(+days || 7)));
  if (!u) return { ok: false, error: "invalid" };
  try {
    const token = newToken();
    await (await db()).query(
      "insert into rnd_invites (token_hash, unit, role, label, created_by, expires_at) values ($1, $2, $3, $4, $5, now() + make_interval(days => $6))",
      [sha256(token), u, r, String(label ?? "").trim().slice(0, 80), a.user.id, d],
    );
    return { ok: true, token, ...(await team()) };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export async function rndRevokeInvite(id: string): Promise<TeamResult> {
  if (!(await owner())) return { ok: false, error: "denied" };
  if (!/^\d+$/.test(String(id))) return { ok: false, error: "invalid" };
  try {
    await (await db()).query("update rnd_invites set revoked_at = now() where id = $1 and used_at is null", [id]);
    return { ok: true, ...(await team()) };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

/** Accepts an invitation as the signed-in user: the link is used up and the account joins the given unit. */
export async function rndAcceptInvite(token: string): Promise<{ ok: true } | Fail> {
  if (!databaseConfigured()) return { ok: false, error: "unavailable" };
  const user = await getUser().catch(() => null);
  if (!user) return { ok: false, error: "signin" };
  if (typeof token !== "string" || token.length < 20 || token.length > 80) return { ok: false, error: "invalid" };
  try {
    const done = await transaction(async (c) => {
      const { rows } = await c.query<{ id: string; unit: string; role: string; label: string; created_by: string | null }>(
        "update rnd_invites set used_by = $2, used_at = now() where token_hash = $1 and used_at is null and revoked_at is null and expires_at > now() returning id, unit, role, label, created_by",
        [sha256(token), user.id],
      );
      const inv = rows[0];
      if (!inv) return false;
      if (!user.isAdmin)
        await c.query(
          `insert into rnd_members (user_id, unit, role, title, added_by) values ($1, $2, $3, $4, $5)
           on conflict (user_id) do update set unit = excluded.unit, role = excluded.role, title = excluded.title, revoked_at = null`,
          [user.id, inv.unit, inv.role, inv.label, inv.created_by],
        );
      return true;
    });
    return done ? { ok: true } : { ok: false, error: "notfound" };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}
