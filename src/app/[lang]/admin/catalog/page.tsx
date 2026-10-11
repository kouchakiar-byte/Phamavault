import { Suspense, type ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { MaterialEditor, SupplierEditor } from "@/components/account/catalog-forms";
import { Loading, accountMetadata } from "@/components/account/shell";
import { BackLink, BiTitle, Container } from "@/components/ui";
import { account } from "@/content/account";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { loadCatalog, updateTimeOf } from "@/lib/catalog";
import { databaseConfigured } from "@/lib/db";
import { lastRuns, pendingChanges } from "@/lib/daily-update";
import { formatDate, formatNumber } from "@/lib/format";
import { href } from "@/lib/paths";
import { cancelQueued, publishNow } from "./actions";

const { admin } = account;
const t = admin.catalog;

export const generateMetadata = () => accountMetadata(t.title);

function Panel({ title, locale, children }: { title: Bi; locale: Locale; children: ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-white p-6">
      <BiTitle as="h2" text={title} locale={locale} className="mb-5 text-lg font-bold text-vault-900" />
      {children}
    </section>
  );
}

async function CatalogAdmin({ locale }: { locale: Locale }) {
  await connection();
  if (!databaseConfigured()) return <p className="rounded-card bg-red-50 px-5 py-4 text-red-700">{admin.noDatabase[locale]}</p>;
  const user = await getUser();
  if (!user) redirect(`${href(locale, "account/login")}?next=${encodeURIComponent(href(locale, "admin/catalog"))}`);
  if (!user.isAdmin) notFound();

  const [catalog, pending, runs] = await Promise.all([loadCatalog(), pendingChanges(), lastRuns()]);

  return (
    <div className="space-y-8">
      <div>
        <BackLink href={href(locale, "admin")}>{admin.title[locale]}</BackLink>
        <BiTitle as="h1" text={t.title} locale={locale} className="mt-4 text-3xl font-bold text-vault-900" />
        <p className="mt-3 max-w-3xl text-muted">{t.lead[locale]}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={t.pending} locale={locale}>
          {pending.length === 0 ? (
            <p className="text-sm text-muted">{t.none[locale]}</p>
          ) : (
            <ul className="divide-y divide-line rounded-lg border border-line">
              {pending.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span>
                    <span className={`me-2 rounded px-1.5 py-0.5 text-xs ${c.hide ? "bg-red-50 text-red-700" : "bg-molecule-50 text-molecule-700"}`}>
                      {c.hide ? t.hideTag[locale] : t.editTag[locale]}
                    </span>
                    <span className="text-muted">{c.kind === "supplier" ? t.supplier[locale] : t.material[locale]}:</span>{" "}
                    <bdi className="font-medium text-vault-900">{c.key}</bdi>
                  </span>
                  <form action={cancelQueued}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="text-xs text-red-700 hover:underline">
                      {admin.cancel[locale]}
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
          <form action={publishNow} className="mt-4">
            <button type="submit" className="rounded-full bg-vault-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-vault-800">
              {t.publishNow[locale]}
            </button>
          </form>
        </Panel>

        <Panel title={t.runs} locale={locale}>
          {runs.length === 0 ? (
            <p className="text-sm text-muted">{t.noRuns[locale]}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="db" style={{ minWidth: 0 }}>
                <thead>
                  <tr>
                    <th>{t.day[locale]}</th>
                    <th>{t.published[locale]}</th>
                    <th>{t.checked[locale]}</th>
                    <th>{t.unreachable[locale]}</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((r) => (
                    <tr key={r.day}>
                      <td className="whitespace-nowrap">
                        {formatDate(new Date(updateTimeOf(r.day)), locale, "Asia/Tehran")}
                        {!r.finishedAt && <span className="ms-2 text-xs text-muted">{t.running[locale]}</span>}
                      </td>
                      <td className="num">{formatNumber(r.published, locale)}</td>
                      <td className="num">{formatNumber(r.checked, locale)}</td>
                      <td className="num">{formatNumber(r.unreachable, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <Panel title={t.supplier} locale={locale}>
        <SupplierEditor locale={locale} companies={catalog.companies} provinces={catalog.provinceOrder} />
      </Panel>

      <Panel title={t.material} locale={locale}>
        <MaterialEditor locale={locale} materials={catalog.materials} groups={catalog.materialGroups} />
      </Panel>
    </div>
  );
}

export default async function CatalogAdminPage() {
  const locale = await getLocale();
  return (
    <div className="bg-paper py-12">
      <Container>
        <Suspense fallback={<Loading label="…" />}>
          <CatalogAdmin locale={locale} />
        </Suspense>
      </Container>
    </div>
  );
}
