import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Loading, accountMetadata } from "@/components/account/shell";
import { RndFrame, rndHref, rndTitle } from "@/components/rnd/frame";
import { TeamManager } from "@/components/rnd/team-manager";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { rndTeam } from "@/lib/rnd/actions";
import { requireAccess } from "@/lib/rnd/guard";

// A neutral title: the tab and the 404 shown to anyone without access do not say what is here.
export const generateMetadata = () => accountMetadata(rndTitle);

async function Team({ locale }: { locale: Locale }) {
  const { access, urgent } = await requireAccess(locale, rndHref(locale, "team"));
  if (access.role !== "owner") notFound();
  const team = await rndTeam();
  return (
    <RndFrame locale={locale} access={access} alerts={urgent} active="team">
      {team.ok ? <TeamManager initial={team} joinPath={rndHref(locale, "join")} /> : <p className="text-sm text-red-700">فهرست تیم خوانده نشد.</p>}
    </RndFrame>
  );
}

export default async function RndTeamPage() {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Loading label="…" />}>
      <Team locale={locale} />
    </Suspense>
  );
}
