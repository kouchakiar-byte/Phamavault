import Link from "next/link";
import type { ReactNode } from "react";
import { Bell, FolderKanban, Users } from "lucide-react";
import { Container } from "@/components/ui";
import type { Locale } from "@/i18n/config";
import { href } from "@/lib/paths";
import { UNITS } from "@/lib/rnd/model";
import type { Access } from "@/lib/rnd/server";

import { bi } from "@/i18n/bi";

export const rndTitle = bi("Workspace", "فضای کاری");
export const rndHref = (locale: Locale, path = "") => href(locale, `rnd${path ? `/${path}` : ""}`);

/** The private workspace's frame: always Persian and right to left, with its own navigation. */
export function RndFrame({ locale, access, alerts, active, children }: { locale: Locale; access: Access; alerts: number; active: "home" | "alerts" | "team" | "project"; children: ReactNode }) {
  const link = (key: typeof active, path: string, label: string, icon: ReactNode, badge?: number) => (
    <Link href={rndHref(locale, path)} aria-current={active === key ? "page" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${active === key ? "bg-vault-900 text-white" : "text-vault-900 hover:bg-vault-50"}`}>
      {icon}{label}
      {badge ? <span className="rounded-full bg-red-600 px-1.5 font-mono text-xs text-white">{badge}</span> : null}
    </Link>
  );
  const who = access.role === "owner" ? "مدیر پروژه‌ها (دسترسی کامل)" : access.role === "manager" ? `مدیر${access.title ? ` — ${access.title}` : ""} (مشاهده همه واحدها)` : `واحد ${UNITS[access.unit!]}${access.title ? ` — ${access.title}` : ""}`;
  return (
    <div dir="rtl" lang="fa" className="bg-paper py-8 sm:py-10">
      <Container>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <p className="text-xs font-semibold text-molecule-700">فضای کاری خصوصی</p>
            <p className="text-lg font-extrabold text-vault-900">مدیریت پروژه‌های تحقیق و توسعه</p>
            <p className="text-xs text-muted">{access.user.name || access.user.mobile} · {who}</p>
          </div>
          <nav className="flex flex-wrap gap-1">
            {link("home", "", "پروژه‌ها", <FolderKanban className="size-4" aria-hidden="true" />)}
            {link("alerts", "alerts", "هشدارهای من", <Bell className="size-4" aria-hidden="true" />, alerts)}
            {access.role === "owner" && link("team", "team", "تیم و دسترسی‌ها", <Users className="size-4" aria-hidden="true" />)}
          </nav>
        </div>
        {children}
      </Container>
    </div>
  );
}
