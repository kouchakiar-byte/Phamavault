import { db } from "@/lib/db";
import { portfolioWorkbook, projectWorkbook } from "@/lib/rnd/export";
import { filterProject, getAccess, loadProject, loadProjects } from "@/lib/rnd/server";

const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const safe = (s: string) => s.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "project";

/**
 * GET /api/rnd/export?id=… — one project as an Excel workbook, in the copy the reader may see
 * (a member gets only their unit's work). GET /api/rnd/export?all=1 — every project on one sheet,
 * for the owner and managers. Each download is written to the project's audit trail.
 */
export async function GET(request: Request) {
  const access = await getAccess().catch(() => null);
  if (!access) return Response.json({ error: "not found" }, { status: 404 });
  const q = new URL(request.url).searchParams;
  const headers = (name: string, bytes: Uint8Array) => ({
    "Content-Type": XLSX,
    "Content-Disposition": `attachment; filename="${name}"`,
    "Content-Length": String(bytes.length),
    "Cache-Control": "private, no-store",
  });

  if (q.get("all")) {
    if (access.role === "member") return Response.json({ error: "not found" }, { status: 404 });
    const bytes = portfolioWorkbook(await loadProjects());
    return new Response(new Uint8Array(bytes), { headers: headers("rnd-projects.xlsx", bytes) });
  }

  const p = await loadProject(q.get("id") ?? "");
  if (!p) return Response.json({ error: "not found" }, { status: 404 });
  const seen = filterProject(p, access);
  const bytes = projectWorkbook(seen);
  await (await db())
    .query("insert into rnd_audit (project_id, user_id, unit, action) values ($1, $2, $3, $4)", [p.id, access.user.id, access.unit ?? access.role, "خروجی Excel"])
    .catch(() => undefined);
  return new Response(new Uint8Array(bytes), { headers: headers(`${safe(p.code || p.id)}.xlsx`, bytes) });
}
