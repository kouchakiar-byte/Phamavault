import { Suspense } from "react";
import { Loading, accountMetadata } from "@/components/account/shell";
import { RndFrame, rndHref, rndTitle } from "@/components/rnd/frame";
import { MyTasks } from "@/components/rnd/my-tasks";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { requireAccess } from "@/lib/rnd/guard";
import { myWork, noticesFor } from "@/lib/rnd/server";

export const generateMetadata = () => accountMetadata(rndTitle);

async function Tasks({ locale }: { locale: Locale }) {
  const { access, urgent } = await requireAccess(locale, rndHref(locale, "tasks"));
  const [tasks, notices] = await Promise.all([myWork(access), noticesFor(access).catch(() => [])]);
  return (
    <RndFrame locale={locale} access={access} alerts={urgent} active="tasks">
      <p className="mb-4 text-sm text-muted">
        {access.role === "member"
          ? "کارهایی که به نام شما ثبت شده و کارهای واحد شما که هنوز به کسی واگذار نشده‌اند، از همه پروژه‌ها. پیشرفت را همین‌جا ثبت کنید؛ مدیر پروژه همان لحظه می‌بیند."
          : "کارهایی که به نام شما ثبت شده‌اند، از همه پروژه‌ها. برای واگذاری کار به دیگران، در هر پروژه از تب «برنامه و فعالیت‌ها» مسئول هر فعالیت را انتخاب کنید."}
      </p>
      <MyTasks initial={tasks} notices={notices} projectHref={rndHref(locale, "project")} role={access.role} />
    </RndFrame>
  );
}

export default async function RndTasksPage() {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Loading label="…" />}>
      <Tasks locale={locale} />
    </Suspense>
  );
}
