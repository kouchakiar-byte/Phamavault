import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loading, accountMetadata } from "@/components/account/shell";
import { RndFrame, rndHref, rndTitle } from "@/components/rnd/frame";
import { ProjectView } from "@/components/rnd/project-view";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { requireAccess } from "@/lib/rnd/guard";
import { filterProject, loadProject } from "@/lib/rnd/server";

// A neutral title: the tab and the 404 shown to anyone without access do not say what is here.
export const generateMetadata = () => accountMetadata(rndTitle);

type Search = Promise<Record<string, string | string[] | undefined>>;

async function Project({ locale, searchParams }: { locale: Locale; searchParams: Search }) {
  const id = String((await searchParams).id ?? "");
  const { access, urgent } = await requireAccess(locale, `${rndHref(locale, "project")}?id=${encodeURIComponent(id)}`);
  const p = await loadProject(id);
  if (!p) notFound();
  return (
    <RndFrame locale={locale} access={access} alerts={urgent} active="project">
      <ProjectView key={p.id} initial={filterProject(p, access)} viewer={{ role: access.role, unit: access.unit, name: access.user.name }} homeHref={rndHref(locale)}
        reportHref={access.role === "member" ? undefined : `${rndHref(locale, "report")}?id=${p.id}`} />
    </RndFrame>
  );
}

export default async function RndProjectPage({ searchParams }: { searchParams: Search }) {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Loading label="…" />}>
      <Project locale={locale} searchParams={searchParams} />
    </Suspense>
  );
}
