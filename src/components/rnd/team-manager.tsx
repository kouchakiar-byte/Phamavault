"use client";

import { useState } from "react";
import { rndAcceptInvite, rndAddMember, rndCreateInvite, rndRevokeInvite, rndSetRevoked, rndUpdateMember, type Team } from "@/lib/rnd/actions";
import { MEMBER_UNITS, UNITS, nowMs, type Unit } from "@/lib/rnd/model";
import { fmt } from "./charts";

const inp = "w-full rounded-md border border-line bg-white px-2 py-1.5 text-sm focus:border-molecule-500 focus:outline-none";
const btn = "inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-vault-900 transition hover:border-molecule-500 disabled:opacity-50";
const primary = "rounded-full bg-molecule-600 px-4 py-2 text-sm font-semibold text-white hover:bg-molecule-700 disabled:opacity-50";
const card = "rounded-card border border-line bg-white p-4 sm:p-5";
const day = (iso: string) => fmt(iso.slice(0, 10));

/** "unit" is a department; "manager" sees every unit's work without editing it. */
function Access({ unit, role, onChange, idPrefix }: { unit: string; role: string; onChange: (unit: string, role: string) => void; idPrefix: string }) {
  const value = role === "manager" ? "manager" : unit;
  return (
    <select id={`${idPrefix}-access`} className={inp} value={value} aria-label="واحد یا نقش" onChange={(e) => (e.target.value === "manager" ? onChange("pm", "manager") : onChange(e.target.value, "member"))}>
      {MEMBER_UNITS.map((u) => <option key={u} value={u}>واحد {UNITS[u]}</option>)}
      <option value="manager">مدیر (مشاهده همه واحدها، بدون ویرایش)</option>
    </select>
  );
}

const errors: Record<string, string> = {
  nouser: "حسابی با این شماره موبایل در سایت نیست. برای این فرد لینک دعوت بسازید تا پس از ثبت‌نام، با همان لینک وارد شود.",
  invalid: "شماره موبایل یا واحد معتبر نیست.",
  denied: "فقط مدیر پروژه‌ها می‌تواند دسترسی بدهد.",
  unavailable: "انجام نشد؛ دوباره امتحان کنید.",
};

export function TeamManager({ initial, joinPath }: { initial: Team; joinPath: string }) {
  const [team, setTeam] = useState<Team>({ members: initial.members, invites: initial.invites });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [add, setAdd] = useState({ mobile: "", unit: "form", role: "member", title: "" });
  const [inv, setInv] = useState({ unit: "form", role: "member", label: "", days: 7 });
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  async function run(fn: () => Promise<({ ok: true } & Team) | { ok: false; error: string }>) {
    setBusy(true); setErr("");
    const r = await fn().catch(() => ({ ok: false as const, error: "unavailable" }));
    setBusy(false);
    if (r.ok) { setTeam({ members: r.members, invites: r.invites }); return r; }
    setErr(errors[r.error] ?? errors.unavailable);
    return null;
  }
  const active = team.members.filter((m) => !m.revoked), revoked = team.members.filter((m) => m.revoked);
  const label = (m: { unit: string; role: string }) => (m.role === "manager" ? "مدیر — همه واحدها" : `واحد ${UNITS[m.unit as Unit] ?? m.unit}`);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        این فضای کاری جز شما و افرادی که این‌جا دسترسی گرفته‌اند برای هیچ‌کس قابل مشاهده نیست؛ در منو، نقشه سایت و جست‌وجو هم نمی‌آید. هر عضو فقط وظایف و ردیف‌های واحد خودش را می‌بیند و فقط روی همان‌ها کار می‌کند. با «لغو دسترسی» دسترسی فرد از همان لحظه قطع می‌شود.
      </p>
      {err && <p role="alert" className="rounded-card bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        <form className={card} onSubmit={async (e) => { e.preventDefault(); if (await run(() => rndAddMember(add.mobile, add.unit, add.role, add.title))) setAdd({ ...add, mobile: "", title: "" }); }}>
          <h2 className="text-base font-bold text-vault-900">افزودن با شماره موبایل</h2>
          <p className="mt-1 text-xs text-muted">برای کسی که در سایت حساب دارد. دسترسی بلافاصله فعال می‌شود.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-muted">شماره موبایل<input className={`${inp} mt-1`} dir="ltr" inputMode="tel" required placeholder="09xxxxxxxxx" value={add.mobile} onChange={(e) => setAdd({ ...add, mobile: e.target.value })} /></label>
            <label className="block text-xs text-muted">سمت (اختیاری)<input className={`${inp} mt-1`} maxLength={80} placeholder="مثلاً کارشناس فرمولاسیون" value={add.title} onChange={(e) => setAdd({ ...add, title: e.target.value })} /></label>
            <label className="block text-xs text-muted sm:col-span-2">واحد یا نقش<div className="mt-1"><Access idPrefix="add" unit={add.unit} role={add.role} onChange={(unit, role) => setAdd({ ...add, unit, role })} /></div></label>
          </div>
          <button type="submit" disabled={busy} className={`${primary} mt-4`}>دادن دسترسی</button>
        </form>

        <form className={card} onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true); setErr(""); setCopied(false);
          const r = await rndCreateInvite(inv.unit, inv.role, inv.label, inv.days).catch(() => null);
          setBusy(false);
          if (r?.ok) { setTeam({ members: r.members, invites: r.invites }); setLink(`${location.origin}${joinPath}?t=${r.token}`); setInv({ ...inv, label: "" }); }
          else setErr(errors[r?.error ?? "unavailable"] ?? errors.unavailable);
        }}>
          <h2 className="text-base font-bold text-vault-900">ساخت لینک دعوت</h2>
          <p className="mt-1 text-xs text-muted">لینک یک‌بار مصرف است و تا زمان انتخاب‌شده اعتبار دارد. گیرنده با حساب خودش در سایت وارد می‌شود (یا ثبت‌نام می‌کند) و دعوت را می‌پذیرد.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block text-xs text-muted">برای (نام یا سمت)<input className={`${inp} mt-1`} maxLength={80} placeholder="مثلاً آقای … — آزمایشگاه" value={inv.label} onChange={(e) => setInv({ ...inv, label: e.target.value })} /></label>
            <label className="block text-xs text-muted">اعتبار لینک<select className={`${inp} mt-1`} value={inv.days} onChange={(e) => setInv({ ...inv, days: +e.target.value })}>{[1, 3, 7, 14, 30].map((d) => <option key={d} value={d}>{d} روز</option>)}</select></label>
            <label className="block text-xs text-muted sm:col-span-2">واحد یا نقش<div className="mt-1"><Access idPrefix="inv" unit={inv.unit} role={inv.role} onChange={(unit, role) => setInv({ ...inv, unit, role })} /></div></label>
          </div>
          <button type="submit" disabled={busy} className={`${primary} mt-4`}>ساخت لینک</button>
          {link && (
            <div className="mt-4 rounded-lg border border-molecule-500 bg-molecule-50 p-3">
              <p className="text-xs font-semibold text-molecule-700">لینک فقط همین یک بار نمایش داده می‌شود. آن را برای فرد موردنظر بفرستید.</p>
              <div className="mt-2 flex gap-2">
                <input readOnly className={`${inp} font-mono text-xs`} dir="ltr" value={link} onFocus={(e) => e.target.select()} aria-label="لینک دعوت" />
                <button type="button" className={btn} onClick={async () => { await navigator.clipboard.writeText(link).catch(() => {}); setCopied(true); }}>{copied ? "کپی شد" : "کپی"}</button>
              </div>
            </div>
          )}
        </form>
      </div>

      <section className={card}>
        <h2 className="mb-3 text-base font-bold text-vault-900">اعضای دارای دسترسی <span className="font-mono">({active.length})</span></h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead><tr className="border-b border-line bg-vault-50 text-right text-xs"><th className="p-2">نام</th><th className="p-2">موبایل</th><th className="p-2">واحد یا نقش</th><th className="p-2">سمت</th><th className="p-2">از</th><th className="p-2" /></tr></thead>
            <tbody>
              {active.map((m) => (
                <tr key={m.id} className="border-b border-line">
                  <td className="p-2 font-semibold">{m.name}</td>
                  <td className="p-2 font-mono text-xs" dir="ltr">{m.mobile}</td>
                  <td className="w-64 p-2"><Access idPrefix={`m${m.id}`} unit={m.unit} role={m.role} onChange={(unit, role) => run(() => rndUpdateMember(m.id, unit, role, m.title))} /></td>
                  <td className="p-2"><input key={m.title} className={inp} defaultValue={m.title} maxLength={80} aria-label="سمت" onBlur={(e) => e.target.value !== m.title && run(() => rndUpdateMember(m.id, m.unit, m.role, e.target.value))} /></td>
                  <td className="p-2 text-xs">{day(m.since)}</td>
                  <td className="p-2"><button type="button" disabled={busy} className={`${btn} border-red-200 text-red-700`} onClick={() => confirm(`دسترسی ${m.name} از همین لحظه قطع شود؟`) && run(() => rndSetRevoked(m.id, true))}>لغو دسترسی</button></td>
                </tr>
              ))}
              {!active.length && <tr><td colSpan={6} className="py-6 text-center text-muted">هنوز به کسی دسترسی نداده‌اید.</td></tr>}
            </tbody>
          </table>
        </div>
        {revoked.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-muted">دسترسی‌های لغوشده ({revoked.length})</summary>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm">
              {revoked.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center gap-2 text-muted">
                  <span>{m.name} · <span dir="ltr" className="font-mono text-xs">{m.mobile}</span> · {label(m)}</span>
                  <button type="button" className={btn} disabled={busy} onClick={() => run(() => rndSetRevoked(m.id, false))}>بازگرداندن دسترسی</button>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section className={card}>
        <h2 className="mb-3 text-base font-bold text-vault-900">لینک‌های دعوت</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {team.invites.map((i) => {
            const expired = new Date(i.expires).getTime() < nowMs();
            const state = i.usedBy ? `استفاده شد — ${i.usedBy}` : i.revoked ? "باطل شد" : expired ? "منقضی شد" : `فعال تا ${day(i.expires)}`;
            return (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
                <span>{i.label || "بدون نام"} · {label(i)} · <span className="text-xs text-muted">ساخته‌شده {day(i.created)}</span></span>
                <span className="flex items-center gap-2">
                  <span className={`text-xs ${i.usedBy ? "text-emerald-700" : i.revoked || expired ? "text-muted" : "font-semibold text-molecule-700"}`}>{state}</span>
                  {!i.usedBy && !i.revoked && !expired && <button type="button" disabled={busy} className={`${btn} text-red-700`} onClick={() => run(() => rndRevokeInvite(i.id))}>باطل کردن</button>}
                </span>
              </li>
            );
          })}
          {!team.invites.length && <li className="text-muted">لینکی ساخته نشده است.</li>}
        </ul>
      </section>
    </div>
  );
}

export function AcceptInvite({ token, home }: { token: string; home: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <>
      <button type="button" disabled={busy} className={primary} onClick={async () => {
        setBusy(true); setErr("");
        const r = await rndAcceptInvite(token).catch(() => null);
        if (r?.ok) location.href = home;
        else { setBusy(false); setErr(r?.error === "notfound" ? "این دعوت دیگر معتبر نیست." : "انجام نشد؛ دوباره امتحان کنید."); }
      }}>{busy ? "…" : "پذیرش دعوت و ورود"}</button>
      {err && <p className="mt-3 text-sm text-red-700">{err}</p>}
    </>
  );
}
