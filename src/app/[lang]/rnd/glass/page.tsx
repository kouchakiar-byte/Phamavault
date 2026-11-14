import { Suspense } from "react";
import { Loading, accountMetadata } from "@/components/account/shell";
import { RndFrame, rndHref, rndTitle } from "@/components/rnd/frame";
import { GlassDashboard } from "@/components/rnd/glass-dashboard";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { buildGlass } from "@/lib/rnd/glass";
import { requireAccess } from "@/lib/rnd/guard";

export const generateMetadata = () => accountMetadata(rndTitle);

async function Glass({ locale }: { locale: Locale }) {
  const { access, urgent } = await requireAccess(locale, rndHref(locale, "glass"));
  const data = await buildGlass(access);
  return (
    <RndFrame locale={locale} access={access} alerts={urgent} active="glass">
      <GlassDashboard initial={data} projectHref={rndHref(locale, "project")} classicHref={rndHref(locale)} />
    </RndFrame>
  );
}

export default async function RndGlassPage() {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Loading label="…" />}>
      <Glass locale={locale} />
    </Suspense>
  );
}
