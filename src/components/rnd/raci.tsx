"use client";

/*
 * Who does what in each phase: Responsible, Accountable, Consulted, Informed, one column per unit.
 * The project manager edits it; everyone on the project reads it, and a member sees their own column marked.
 */
import { RACI_L, RACI_UNITS, T, UNITS, raciIssue, raciRow, type Raci } from "@/lib/rnd/model";
import { Panel, pill, type Ctx } from "./fields";

const TONE: Record<Raci, string> = {
  A: "bg-vault-900 text-capsule-400",
  AR: "bg-vault-900 text-white",
  R: "bg-molecule-600 text-white",
  C: "bg-capsule-100 text-capsule-800",
  I: "bg-vault-50 text-vault-700",
};
const OPTS: [Raci | "", string][] = [["", "—"], ["R", "R"], ["A", "A"], ["AR", "A/R"], ["C", "C"], ["I", "I"]];

export function RaciMatrix({ ctx }: { ctx: Ctx }) {
  const { p, viewer } = ctx;
  const owner = viewer.role === "owner";
  const issues = p.stages.map((s) => raciIssue(raciRow(p, s.key))).filter(Boolean).length;
  return (
    <Panel title="ماتریس مسئولیت‌ها (RACI)" aside={issues ? <span className={`${pill} bg-amber-50 text-amber-700`}>{issues} فاز نیاز به اصلاح دارد</span> : <span className={`${pill} bg-emerald-50 text-emerald-700`}>همه فازها یک پاسخگو و مسئول اجرا دارند</span>}>
      <p className="mb-3 text-xs leading-relaxed text-muted">
        برای هر فاز، هر واحد یکی از نقش‌ها را دارد. هر فاز باید دقیقاً یک <b>پاسخگو (A)</b> داشته باشد که نتیجه را تأیید می‌کند و حداقل یک <b>مسئول اجرا (R)</b>.
        {owner ? " مقادیر پیش‌فرض بر اساس تقسیم کار رایج پروژه‌های ژنریک است؛ آن را برای این پروژه تنظیم کنید." : ""}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="bg-vault-50 text-xs text-muted">
              <th className="p-2 text-start font-semibold">فاز</th>
              {RACI_UNITS.map((u) => (
                <th key={u} className={`p-2 text-center font-semibold ${viewer.unit === u ? "bg-molecule-50 text-molecule-700" : ""}`}>{UNITS[u]}</th>
              ))}
              <th className="p-2 text-start font-semibold">بررسی</th>
            </tr>
          </thead>
          <tbody>
            {p.stages.map((s) => {
              const row = raciRow(p, s.key), issue = raciIssue(row);
              return (
                <tr key={s.key} className="border-t border-line">
                  <td className="p-2 font-semibold text-vault-900">{T(s.title)}</td>
                  {RACI_UNITS.map((u) => {
                    const v = (row[u] ?? "") as Raci | "";
                    return (
                      <td key={u} className={`p-1.5 text-center ${viewer.unit === u ? "bg-molecule-50/60" : ""}`}>
                        {owner ? (
                          <select value={v} aria-label={`${s.title} — ${UNITS[u]}`} title={v ? RACI_L[v] : "بدون نقش"}
                            onChange={(e) => ctx.send([{ op: "raci", stage: s.key, unit: u, v: e.target.value }])}
                            className={`w-16 rounded-md border border-line px-1 py-1 text-center font-mono text-xs font-bold focus:border-molecule-500 focus:outline-none ${v ? TONE[v] : "bg-white text-muted"}`}>
                            {OPTS.map(([k, l]) => <option key={k} value={k} className="bg-white text-vault-900">{l}</option>)}
                          </select>
                        ) : v ? (
                          <span className={`inline-block min-w-9 rounded-md px-1.5 py-0.5 font-mono text-xs font-bold ${TONE[v]}`} title={RACI_L[v]}>{v === "AR" ? "A/R" : v}</span>
                        ) : <span className="text-muted">—</span>}
                      </td>
                    );
                  })}
                  <td className="p-2 text-xs">{issue ? <span className="text-amber-700">{issue}</span> : <span className="text-emerald-700">✓</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2 text-xs">
        {(Object.keys(RACI_L) as Raci[]).map((k) => (
          <li key={k} className="flex items-center gap-1.5"><span className={`rounded-md px-1.5 py-0.5 font-mono font-bold ${TONE[k]}`}>{k === "AR" ? "A/R" : k}</span>{RACI_L[k]}</li>
        ))}
      </ul>
    </Panel>
  );
}
