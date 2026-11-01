import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { AddUserForm, DeleteUserButton, GrantForm, MailTestForm, ResetPasswordForm, SendInvoiceButton, TraceForm } from "@/components/account/admin-forms";
import { invoiceNumber } from "@/lib/invoice";
import { Loading, accountMetadata } from "@/components/account/shell";
import { BiTitle, Container } from "@/components/ui";
import { account } from "@/content/account";
import { copy } from "@/content/site";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";
import { formatDate, formatNumber } from "@/lib/format";
import { planName, periodLabel, sectionsLabel } from "@/lib/labels";
import { recentOrders, recentUsers, stats } from "@/lib/orders";
import { href } from "@/lib/paths";
import { paywallEnabled, recentSubscriptions, subscriptionStatus } from "@/lib/subscriptions";
import { mailConfigured } from "@/lib/mail";
import { recentMailLog } from "@/lib/mail-log";
import { onlinePaymentEnabled } from "@/lib/zarinpal";
import { recentServiceRequests } from "@/lib/service-requests";
import { bi } from "@/i18n/bi";
import { cancelOrder, changeSeats, extend, markOrderPaid, setBlocked, toggleRequestHandled, toggleRevoked } from "./actions";

const { admin: t, dashboard: d, invoice: inv } = account;
const copyToman = copy.plans.currency;

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

  const [numbers, orders, subscriptions, requests, users, mailLog] = await Promise.all([stats(), recentOrders(), recentSubscriptions(), recentServiceRequests(), recentUsers(), recentMailLog()]);
  const u = t.usersList;
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
          <b className="text-vault-900">{gateway}</b> · {t.mail[locale]}: <b className="text-vault-900">{mailConfigured() ? t.on[locale] : t.off[locale]}</b>
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

      <Panel title={u.title} locale={locale}>
        {users.length === 0 ? (
          <p className="text-sm text-muted">{u.none[locale]}</p>
        ) : (
          <div className="max-h-[32rem] overflow-auto">
            <table className="db">
              <thead>
                <tr>
                  <th>{u.name[locale]}</th>
                  <th>{u.mobile[locale]}</th>
                  <th>{u.email[locale]}</th>
                  <th>{u.joined[locale]}</th>
                  <th>{u.lastSeen[locale]}</th>
                  <th>{u.subscription[locale]}</th>
                  <th>{u.status[locale]}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((x) => (
                  <tr key={x.id} className={x.blocked ? "bg-red-50/60" : undefined}>
                    <td>
                      {x.name}
                      <span className="block text-xs text-muted">
                        {account.auth.kinds[x.kind as keyof typeof account.auth.kinds]?.[locale] ?? x.kind}
                        {x.org ? ` · ${x.org}` : ""}
                      </span>
                    </td>
                    <td>
                      <a href={`tel:${x.mobile}`} className="font-mono text-molecule-700 hover:underline" dir="ltr">
                        {x.mobile}
                      </a>
                    </td>
                    <td className="font-mono text-xs" dir="ltr">{x.email ?? "—"}</td>
                    <td className="whitespace-nowrap">{formatDate(x.createdAt, locale)}</td>
                    <td className="whitespace-nowrap">{x.lastSeen ? formatDate(x.lastSeen, locale) : "—"}</td>
                    <td className={x.activeSubscriptions ? "font-semibold text-molecule-700" : "text-muted"}>
                      {x.activeSubscriptions ? u.active[locale] : u.none2[locale]}
                    </td>
                    <td>
                      {x.mobile !== user.mobile && (
                      <div className="flex flex-wrap items-center gap-1">
                        {x.blocked && <span className="text-xs font-semibold text-red-700">{u.blocked[locale]}</span>}
                        <form action={setBlocked}>
                          <input type="hidden" name="id" value={x.id} />
                          <input type="hidden" name="blocked" value={x.blocked ? "0" : "1"} />
                          <button type="submit" className={`${smallButton} border border-line hover:border-molecule-500`}>
                            {x.blocked ? u.unblock[locale] : u.block[locale]}
                          </button>
                        </form>
                        <DeleteUserButton id={x.id} locale={locale} />
                      </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <p className="-mt-4 text-xs text-muted">{u.blockNote[locale]}</p>

      <Panel title={u.addTitle} locale={locale}>
        <p className="mb-4 text-sm text-muted">{u.addLead[locale]}</p>
        <AddUserForm locale={locale} />
      </Panel>

      <Panel title={t.trace.title} locale={locale}>
        <p className="mb-3 text-sm text-muted">{t.trace.lead[locale]}</p>
        <TraceForm locale={locale} />
      </Panel>

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
        {orders.some((o) => o.status === "pending" && o.method === "invoice") && (
          <div className="mb-6 space-y-3">
            <h3 className="font-bold text-vault-900">{inv.pendingTitle[locale]}</h3>
            <p className="text-sm text-muted">{inv.pendingLead[locale]}</p>
            {orders
              .filter((o) => o.status === "pending" && o.method === "invoice")
              .map((o) => (
                <div key={o.id} className="rounded-lg border border-capsule-500/40 bg-capsule-400/10 p-4 text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-bold text-vault-900">
                      {inv.title[locale]} {invoiceNumber(o)}
                    </p>
                    <p className="text-xs text-muted">{formatDate(o.createdAt, locale)}</p>
                  </div>
                  <p className="mt-1">
                    {o.org ? `${o.org} · ` : ""}
                    {o.name} ·{" "}
                    <a href={`tel:${o.mobile}`} dir="ltr" className="font-mono text-molecule-700">
                      {o.mobile}
                    </a>
                    {o.email && (
                      <>
                        {" "}·{" "}
                        <span dir="ltr" className="font-mono text-xs">
                          {o.email}
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-muted">
                    {planName(o.plan, locale)} ·{" "}
                    {o.plan === "team" ? d.users[locale].replace("{n}", formatNumber(o.seats, locale)) : sectionsLabel(o.sections, locale)} ·{" "}
                    {periodLabel(o.months, locale)} · <b className="text-vault-900">{formatNumber(o.amount, locale)}</b> {copyToman[locale]}
                  </p>
                  <div className="mt-3 flex flex-wrap items-start gap-2">
                    <Link
                      href={`${href(locale, "account/invoice")}?id=${o.id}`}
                      className={`${smallButton} bg-vault-900 text-white hover:bg-vault-800`}
                    >
                      {inv.open[locale]} / {inv.print[locale]}
                    </Link>
                    <SendInvoiceButton locale={locale} id={o.id} disabled={!o.email} />
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
                </div>
              ))}
          </div>
        )}
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
                    {o.method === "invoice" && (
                      <Link href={`${href(locale, "account/invoice")}?id=${o.id}`} className="mb-1.5 block text-xs font-semibold text-molecule-700 hover:underline">
                        {inv.open[locale]}
                      </Link>
                    )}
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

      <Panel title={t.mailLog.title} locale={locale}>
        <p className="-mt-2 mb-5 text-sm text-muted">{t.mailLog.lead[locale]}</p>
        <MailTestForm locale={locale} defaultTo={users.find((x) => x.mobile === user.mobile)?.email ?? ""} />
        {mailLog.length === 0 ? (
          <p className="mt-5 text-sm text-muted">{t.mailLog.empty[locale]}</p>
        ) : (
          <div className="mt-5 max-h-[24rem] overflow-auto">
            <table className="db">
              <thead>
                <tr>
                  <th>{t.mailLog.when[locale]}</th>
                  <th>{t.mailLog.kind[locale]}</th>
                  <th>{t.mailLog.recipient[locale]}</th>
                  <th>{t.mailLog.result[locale]}</th>
                </tr>
              </thead>
              <tbody>
                {mailLog.map((m) => {
                  const known = t.mailLog.details[m.detail as keyof typeof t.mailLog.details];
                  return (
                    <tr key={m.id}>
                      <td className="whitespace-nowrap">{formatDate(m.createdAt, locale)} <span dir="ltr">{m.createdAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tehran" })}</span></td>
                      <td className="whitespace-nowrap">{t.mailLog.kinds[m.kind as keyof typeof t.mailLog.kinds]?.[locale] ?? m.kind}</td>
                      <td>
                        {m.name && <span className="block">{m.name}</span>}
                        <span dir="ltr" className="font-mono text-xs">{m.recipient ?? "—"}</span>
                      </td>
                      <td className={m.ok ? "text-molecule-700" : "text-red-700"}>
                        {known ? known[locale] : <span dir="ltr" className="font-mono text-xs">{m.detail}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
