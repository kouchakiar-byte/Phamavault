import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { GrantForm, ResetPasswordForm } from "@/components/account/admin-forms";
import { Loading, accountMetadata } from "@/components/account/shell";
import { BiTitle, Container } from "@/components/ui";
import { account } from "@/content/account";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";
import { formatDate, formatNumber } from "@/lib/format";
import { planName, periodLabel, sectionsLabel } from "@/lib/labels";
import { recentOrders, stats } from "@/lib/orders";
import { href } from "@/lib/paths";
import { paywallEnabled, recentSubscriptions, subscriptionStatus } from "@/lib/subscriptions";
import { onlinePaymentEnabled } from "@/lib/zarinpal";
import { recentServiceRequests } from "@/lib/service-requests";
import { bi } from "@/i18n/bi";
import { cancelOrder, changeSeats, extend, markOrderPaid, toggleRequestHandled, toggleRevoked } from "./actions";

const { admin: t, dashboard: d } = account;

const requestLabels = {
  title: bi("Service requests (CTD compilation)", "درخواست‌های خدمات (تدوین CTD)"),
  none: bi("No requests yet.", "هنوز درخواستی ثبت نشده است."),
  who: bi("Requester", "درخواست‌کننده"),
  product: bi("Product", "فرآورده"),
  message: bi("Details", "توضیحات"),
  done: bi("Mark handled", "پیگیری شد"),
  reopen: bi("Reopen", "بازگشایی"),
};

export const generateMetadata = () => accountMetadata(t.title);

function Panel({ title, locale, children }: { title: Bi; locale: Locale; children: ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-white p-6">
      <BiTitle as="h2" text={title} locale={locale} className="mb-5 text-lg font-bold text-vault-900" />
      {children}
    </section>
  );
}

const smallButton = "rounded-md px-2.5 py-1 text-xs font-semibold";

async function Admin({ locale }: { locale: Locale }) {
  await connection(); // settings and data are read per request, never at build time
  if (!databaseConfigured()) return <p className="rounded-card bg-red-50 px-5 py-4 text-red-700">{t.noDatabase[locale]}</p>;
  const user = await getUser();
  if (!user) redirect(`${href(locale, "account/login")}?next=${encodeURIComponent(href(locale, "admin"))}`);
  if (!user.isAdmin) notFound();

  const [numbers, orders, subscriptions, requests] = await Promise.all([stats(), recentOrders(), recentSubscriptions(), recentServiceRequests()]);
  const gateway = onlinePaymentEnabled()
    ? `${t.on[locale]}${process.env.ZARINPAL_SANDBOX === "1" ? ` (${t.sandbox[locale]})` : ""}`
    : t.off[locale];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <BiTitle as="h1" text={t.title} locale={locale} className="text-3xl font-bold text-vault-900" />
        <Link href={href(locale, "admin/visits")} className="rounded-full border border-molecule-600 px-4 py-2 text-sm font-semibold text-molecule-700 hover:bg-molecule-50">
          {t.visits.link[locale]}
        </Link>
        <Link href={href(locale, "admin/catalog")} className="rounded-full bg-molecule-600 px-4 py-2 text-sm font-semibold text-white hover:bg-molecule-700">
          {t.catalog.link[locale]}
        </Link>
        <p className="text-sm text-muted">
          {t.paywall[locale]}: <b className="text-vault-900">{paywallEnabled() ? t.on[locale] : t.off[locale]}</b> · {t.gateway[locale]}:{" "}
          <b className="text-vault-900">{gateway}</b>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            [t.stats.users, numbers.users],
            [t.stats.active, numbers.active],
            [t.stats.revenue, numbers.revenue30],
            [t.stats.pending, numbers.pending],
          ] as const
        ).map(([label, value]) => (
          <div key={label.en} className="rounded-card border border-line bg-white p-5">
            <p className="text-sm text-muted">{label[locale]}</p>
            <p className="mt-1 text-2xl font-bold text-vault-900">{formatNumber(value, locale)}</p>
          </div>
        ))}
      </div>

      <Panel title={requestLabels.title} locale={locale}>
        {requests.length === 0 ? (
          <p className="text-sm text-muted">{requestLabels.none[locale]}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="db">
              <thead>
                <tr>
                  <th>{d.orderCols.date[locale]}</th>
                  <th>{requestLabels.who[locale]}</th>
                  <th>{requestLabels.product[locale]}</th>
                  <th>{requestLabels.message[locale]}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className={r.handled ? "opacity-60" : undefined}>
                    <td className="whitespace-nowrap">
                      {formatDate(r.createdAt, locale)}
                      <span className="block text-xs font-semibold text-capsule-600">{r.kind.toUpperCase()}</span>
                    </td>
                    <td>
                      {r.name}
                      {r.company && <span className="block text-xs text-muted">{r.company}</span>}
                      <a href={`tel:${r.phone}`} className="block font-mono text-xs text-molecule-700" dir="ltr">
                        {r.phone}
                      </a>
                      {r.email && (
                        <span className="block font-mono text-xs text-muted" dir="ltr">
                          {r.email}
                        </span>
                      )}
                    </td>
                    <td>{r.product ?? "—"}</td>
                    <td className="max-w-sm whitespace-pre-line text-sm">{r.message ?? "—"}</td>
                    <td>
                      <form action={toggleRequestHandled}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="handled" value={r.handled ? "0" : "1"} />
                        <button type="submit" className={`${smallButton} border border-line hover:border-molecule-500`}>
                          {r.handled ? requestLabels.reopen[locale] : requestLabels.done[locale]}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel title={t.orders} locale={locale}>
        <div className="overflow-x-auto">
          <table className="db">
            <thead>
              <tr>
                <th>{d.orderCols.id[locale]}</th>
                <th>{d.orderCols.date[locale]}</th>
                <th>{t.buyer[locale]}</th>
                <th>{d.orderCols.plan[locale]}</th>
                <th>{d.orderCols.period[locale]}</th>
                <th>{d.orderCols.amount[locale]}</th>
                <th>{d.orderCols.status[locale]}</th>
                <th>{d.orderCols.ref[locale]}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="num">{o.id}</td>
                  <td className="whitespace-nowrap">{formatDate(o.createdAt, locale)}</td>
                  <td>
                    {o.name}
                    <span className="block font-mono text-xs text-muted" dir="ltr">
                      {o.mobile}
                    </span>
                  </td>
                  <td>
                    {planName(o.plan, locale)}
                    <span className="block text-xs text-muted">
                      {o.plan === "team" ? d.users[locale].replace("{n}", formatNumber(o.seats, locale)) : sectionsLabel(o.sections, locale)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">{periodLabel(o.months, locale)}</td>
                  <td className="num">{formatNumber(o.amount, locale)}</td>
                  <td className="whitespace-nowrap">
                    {d.orderStatus[o.status][locale]}
                    <span className="block text-xs text-muted">{t.method[o.method][locale]}</span>
                  </td>
                  <td className="num">{o.refId ?? "—"}</td>
                  <td>
                    {o.status === "pending" && (
                      <div className="flex flex-col gap-1.5">
                        <form action={markOrderPaid}>
                          <input type="hidden" name="id" value={o.id} />
                          <button type="submit" className={`${smallButton} bg-molecule-600 text-white hover:bg-molecule-700`}>
                            {t.markPaid[locale]}
                          </button>
                        </form>
                        <form action={cancelOrder}>
                          <input type="hidden" name="id" value={o.id} />
                          <button type="submit" className={`${smallButton} text-red-700 hover:bg-red-50`}>
                            {t.cancel[locale]}
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={t.subscriptions} locale={locale}>
        <div className="overflow-x-auto">
          <table className="db">
            <thead>
              <tr>
                <th>{d.orderCols.id[locale]}</th>
                <th>{t.owner[locale]}</th>
                <th>{t.plan[locale]}</th>
                <th>{t.ends[locale]}</th>
                <th>{t.members[locale]}</th>
                <th>{t.extend[locale]}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => {
                const state = subscriptionStatus(s);
                return (
                  <tr key={s.id}>
                    <td className="num">{s.id}</td>
                    <td>
                      {s.ownerName}
                      <span className="block font-mono text-xs text-muted" dir="ltr">
                        {s.ownerMobile}
                      </span>
                    </td>
                    <td>
                      {planName(s.plan, locale)}
                      <span className="block text-xs text-muted">{sectionsLabel(s.sections, locale)}</span>
                    </td>
                    <td className="whitespace-nowrap">
                      {formatDate(s.endsAt, locale)}
                      <span className="block text-xs text-muted">{d.status[state][locale]}</span>
                    </td>
                    <td>
                      <span className="num">
                        {formatNumber(s.members.length, locale)} / {formatNumber(s.seats, locale)}
                      </span>
                      {s.plan === "team" && (
                        <form action={changeSeats} className="mt-1.5 flex gap-1">
                          <input type="hidden" name="id" value={s.id} />
                          <input name="seats" type="number" min={1} defaultValue={s.seats} dir="ltr" aria-label={t.seats[locale]} className="field-input !w-20 !py-1 text-xs" />
                          <button type="submit" className={`${smallButton} border border-line hover:border-molecule-500`}>
                            {t.setSeats[locale]}
                          </button>
                        </form>
                      )}
                    </td>
                    <td>
                      <form action={extend} className="flex gap-1">
                        <input type="hidden" name="id" value={s.id} />
                        <input name="days" type="number" defaultValue={30} dir="ltr" aria-label={t.days[locale]} className="field-input !w-20 !py-1 text-xs" />
                        <button type="submit" className={`${smallButton} border border-line hover:border-molecule-500`}>
                          + {t.days[locale]}
                        </button>
                      </form>
                    </td>
                    <td>
                      <form action={toggleRevoked}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="revoked" value={s.revoked ? "0" : "1"} />
                        <button
                          type="submit"
                          className={`${smallButton} ${s.revoked ? "text-molecule-700 hover:bg-molecule-50" : "text-red-700 hover:bg-red-50"}`}
                        >
                          {s.revoked ? t.restore[locale] : t.revoke[locale]}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={t.grant} locale={locale}>
        <p className="-mt-2 mb-5 text-sm text-muted">{t.grantHint[locale]}</p>
        <GrantForm locale={locale} />
      </Panel>

      <Panel title={t.reset} locale={locale}>
        <p className="-mt-2 mb-5 text-sm text-muted">{t.resetHint[locale]}</p>
        <ResetPasswordForm locale={locale} />
      </Panel>
    </div>
  );
}

export default async function AdminPage() {
  const locale = await getLocale();
  return (
    <div className="bg-paper py-12">
      <Container>
        <Suspense fallback={<Loading label="…" />}>
          <Admin locale={locale} />
        </Suspense>
      </Container>
    </div>
  );
}
