import { CheckCircle2, Circle, Compass, Repeat } from "lucide-react";
import { T, isOpen, type Project } from "@/lib/rnd/model";

type Step = { t: string; d: string; done: boolean | null; href?: string; link?: string };

/**
 * The project manager's first steps, ticked from what the workspace already holds: a project, a team,
 * people on the activities, a fixed baseline, the RACI, work reported, Gate 0 held, then the weekly
 * follow-up. It opens while something is left and folds away once everything is done.
 */
export function StartGuide({ ps, people, href }: { ps: Project[]; people: number; href: (path: string) => string }) {
  const open = ps.filter(isOpen);
  // The latest real project; the sample only when there is nothing else.
  const p = open.find((x) => x.code !== "RD-SAMPLE-01") ?? open[0];
  const items = p ? p.stages.flatMap((s) => s.items) : [];
  const go = (tab: string) => (p ? `${href("project")}?id=${encodeURIComponent(p.id)}&tab=${tab}` : undefined);
  const steps: Step[] = [
    { t: "پروژه را بسازید", d: "«+ پروژه جدید» را بزنید و نام، کد، تاریخ اعلام و تاریخ هدف را وارد کنید. برنامه 12 فازی و فعالیت‌ها خودکار ساخته می‌شود.", done: ps.length > 0, href: "#projects", link: "فهرست پروژه‌ها" },
    { t: "اعضای واحدها را دعوت کنید", d: "برای هر واحد (فرمولاسیون، آنالیز، QA، خرید، ثبت، تولید) فرد مسئول را با شماره موبایل دعوت کنید؛ هر کس فقط کار واحد خودش را می‌بیند.", done: people > 0, href: href("team"), link: "تیم و دسترسی‌ها" },
    { t: "مسئول فعالیت‌ها را تعیین کنید", d: "در «برنامه و فعالیت‌ها» برای فعالیت‌های فاز جاری فرد مسئول، مدت و پیش‌نیازها را تنظیم کنید؛ فرد مسئول در «کارهای من» آن را می‌بیند.", done: items.some((i) => i.assignee), href: go("stages"), link: "برنامه و فعالیت‌ها" },
    { t: "برنامه را بازچینی و Baseline را تثبیت کنید", d: "پس از تنظیم مدت‌ها «بازچینی برنامه» و سپس «تثبیت برنامه پایه (Baseline)» را بزنید تا تأخیرها نسبت به همین برنامه سنجیده شوند.", done: Boolean(p?.events.some((e) => e.text.includes("Baseline"))), href: go("stages"), link: "برنامه و فعالیت‌ها" },
    { t: "نقش واحدها را در RACI بازبینی کنید", d: "پیش‌فرض‌ها را برای این پروژه تأیید یا اصلاح کنید؛ هر فاز یک پاسخگو (A) و حداقل یک مسئول اجرا (R) دارد.", done: Boolean(p?.raci && Object.keys(p.raci).length), href: go("raci"), link: "RACI" },
    { t: "پیشرفت کار ثبت شود", d: "واحدها درصد پیشرفت، Trialها، روش‌ها، خریدها و بچ‌ها را ثبت می‌کنند؛ هشدار موعدها خودکار صادر می‌شود.", done: items.some((i) => i.done || (i.pct ?? 0) > 0), href: go("stages"), link: "پیشرفت فعالیت‌ها" },
    { t: "Gate 0 را برگزار کنید", d: "در پایان فاز اول، چک‌لیست Gate، صورت‌جلسه و تصمیم Go / Hold / No-go را ثبت و صورت‌جلسه را برای امضا چاپ کنید.", done: Boolean(p?.stages.some((s) => s.key === "p0" && s.gate.decision !== "pending")), href: go("stages"), link: "بازبینی Gate" },
    { t: "هر هفته پیگیری کنید", d: "خلاصه هفتگی، هشدارها و گزارش وضعیت A4 را مرور کنید و در جلسه مدیریت از خروجی Excel استفاده کنید.", done: null, href: href("weekly"), link: "خلاصه هفتگی" },
  ];
  const checked = steps.filter((s) => s.done !== null);
  const n = checked.filter((s) => s.done).length, all = n === checked.length;
  return (
    <details open={!all} className="group rounded-card border border-molecule-400/40 bg-gradient-to-br from-molecule-50 via-white to-capsule-50/50 p-4 sm:p-5">
      <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2">
          <Compass className="size-5 text-molecule-600" aria-hidden="true" />
          <span className="text-base font-bold text-vault-900">راهنمای شروع مدیر پروژه</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${all ? "bg-emerald-50 text-emerald-700" : "bg-white text-molecule-700"}`}>{n} از {checked.length} گام</span>
        </span>
        <span className="text-xs text-muted">
          {p ? <>پروژه مبنا: {T(p.name)}{p.code === "RD-SAMPLE-01" && !p.name.includes("نمونه") ? " (نمونه)" : ""} · </> : null}
          <span className="group-open:hidden">نمایش گام‌ها</span><span className="hidden group-open:inline">بستن</span>
        </span>
      </summary>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-molecule-500" style={{ width: `${(100 * n) / checked.length}%` }} />
      </div>
      <ol className="mt-4 grid gap-2 md:grid-cols-2">
        {steps.map((s, i) => (
          <li key={s.t} className={`flex gap-3 rounded-lg border bg-white p-3 ${s.done ? "border-emerald-200" : "border-line"}`}>
            {s.done ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" aria-label="انجام شده" />
              : s.done === null ? <Repeat className="mt-0.5 size-5 shrink-0 text-molecule-600" aria-label="کار همیشگی" />
              : <span className="mt-0.5 flex size-5 shrink-0"><Circle className="size-5 text-vault-200" aria-hidden="true" /><span className="sr-only">انجام نشده</span></span>}
            <div className="min-w-0">
              <p className={`text-sm font-bold ${s.done ? "text-emerald-800" : "text-vault-900"}`}><span className="me-1.5 inline-flex size-5 items-center justify-center rounded-full bg-vault-50 font-mono text-[11px] text-muted">{i + 1}</span>{s.t}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{s.d}</p>
              {s.href && !s.done && <a href={s.href} className="mt-1 inline-block text-xs font-bold text-molecule-700 hover:underline">← {s.link}</a>}
            </div>
          </li>
        ))}
      </ol>
    </details>
  );
}
