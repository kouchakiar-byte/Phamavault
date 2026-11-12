"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rndCreate, rndImport } from "@/lib/rnd/actions";
import { P_TYPE, PRIO, addMonths, today } from "@/lib/rnd/model";

const inp = "w-full rounded-md border border-line bg-white px-2 py-1.5 text-sm focus:border-molecule-500 focus:outline-none";
const btn = "inline-flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-vault-900 transition hover:border-molecule-500";

/** New project (the 9-stage template, with each stage's due date spread by its weight) or a project brought in from a JSON export. */
export function NewProject({ projectHref }: { projectHref: string }) {
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const go = (id: string) => router.push(`${projectHref}?id=${id}`);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true); setErr("");
    const r = await rndCreate({ name: f.name, code: f.code, form: f.form, type: f.type, lead: f.lead, requester: f.requester, priority: f.priority, start: f.start, target: f.target, budget: +f.budget || 0 }).catch(() => null);
    setBusy(false);
    if (r?.ok) go(r.id); else setErr(r?.error === "invalid" ? "نام محصول و تاریخ‌ها را بررسی کنید؛ تاریخ هدف باید بعد از تاریخ اعلام باشد." : "پروژه ثبت نشد. دوباره امتحان کنید.");
  }
  async function importFile(file?: File) {
    if (!file) return;
    setBusy(true); setErr("");
    const r = await rndImport(await file.text()).catch(() => null);
    setBusy(false);
    if (r?.ok) go(r.id); else setErr("فایل JSON یک پروژه معتبر نیست.");
  }
  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block text-xs text-muted">{label}<input name={name} className={`${inp} mt-1`} {...props} /></label>
  );
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className={`${btn} cursor-pointer`}>ورود از فایل JSON<input type="file" accept="application/json,.json" className="sr-only" onChange={(e) => importFile(e.target.files?.[0])} /></label>
      <button type="button" className="rounded-full bg-molecule-600 px-4 py-2 text-sm font-semibold text-white hover:bg-molecule-700" onClick={() => setOpen(true)}>+ پروژه جدید</button>
      {err && !open && <span className="text-xs text-red-700">{err}</span>}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-vault-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="np-title" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <form onSubmit={submit} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card bg-white p-5 shadow-xl" dir="rtl">
            <h2 id="np-title" className="text-lg font-bold text-vault-900">پروژه جدید</h2>
            <p className="mt-1 text-xs text-muted">9 مرحله استاندارد با چک‌لیست و واحد مسئول هر کار ساخته می‌شود و موعد هر مرحله به نسبت حجم کارش بین تاریخ اعلام و تاریخ هدف تقسیم می‌شود. همه را بعداً می‌توانید تغییر دهید.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {field("name", "نام محصول *", { required: true, placeholder: "مثلاً قرص روکش‌دار …", maxLength: 160 })}
              {field("code", "کد پروژه", { dir: "ltr", placeholder: "RD-1405-01", maxLength: 40 })}
              {field("form", "شکل دارویی", { maxLength: 80 })}
              <label className="block text-xs text-muted">نوع پروژه<select name="type" className={`${inp} mt-1`}>{Object.entries(P_TYPE).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
              {field("lead", "مسئول پروژه", { maxLength: 80 })}
              {field("requester", "درخواست‌دهنده", { maxLength: 80, placeholder: "بازاریابی، مدیریت، …" })}
              <label className="block text-xs text-muted">اولویت<select name="priority" defaultValue="medium" className={`${inp} mt-1`}>{Object.entries(PRIO).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
              {field("budget", "بودجه مصوب (میلیون تومان)", { type: "number", min: 0, dir: "ltr" })}
              {field("start", "تاریخ اعلام به R&D *", { type: "date", required: true, defaultValue: today() })}
              {field("target", "تاریخ هدف *", { type: "date", required: true, defaultValue: addMonths(today(), 18) })}
            </div>
            {err && <p className="mt-3 text-sm text-red-700">{err}</p>}
            <div className="mt-5 flex gap-2">
              <button type="submit" disabled={busy} className="rounded-full bg-molecule-600 px-5 py-2 text-sm font-semibold text-white hover:bg-molecule-700 disabled:opacity-50">{busy ? "در حال ثبت…" : "ساخت پروژه"}</button>
              <button type="button" className={btn} onClick={() => setOpen(false)}>انصراف</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
