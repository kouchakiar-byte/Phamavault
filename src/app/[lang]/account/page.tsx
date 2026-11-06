import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Bell, BellRing, Gift } from "lucide-react";
import { AddMemberForm } from "@/components/account/forms";
import { Loading, accountMetadata } from "@/components/account/shell";
import { BiTitle, ButtonLink, Container } from "@/components/ui";
import { account } from "@/content/account";
import { alertCopy } from "@/content/supplier-alerts";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser, type User } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";
import { daysUntil, formatDate, formatNumber } from "@/lib/format";
import { ordersFor, type Order } from "@/lib/orders";
import { planName, periodLabel, sectionsLabel } from "@/lib/labels";
import { href } from "@/lib/paths";
import { subscriptionStatus, subscriptionsFor, type Subscription } from "@/lib/subscriptions";
import { deleteSupplierAlert } from "@/lib/supplier-alert-actions";
import { alertsFor, type SupplierAlert } from "@/lib/supplier-alerts";
import { REWARDS_PER_MONTH, REWARD_DAYS, referralStats, type ReferralStats } from "@/lib/referrals";
import { ReferralLink } from "@/components/referral-link";
import { referralCopy } from "@/content/referrals";
import { siteConfig } from "@/content/site";
import { logout, removeTeamMember } from "./actions";

const { dashboard: t } = account;

export const generateMetadata = () => accountMetadata(t.title);

type Search = Promise<Record<string, string | string[] | undefined>>;

const statusStyle = {
  active: "bg-molecule-50 text-molecule-700",
  upcoming: "bg-vault-50 text-vault-800",
  expired: "bg-vault-50 text-muted",
  revoked: "bg-red-50 text-red-700",
};

function Flash({ locale, search }: { locale: Locale; search: Record<string, string | string[] | undefined> }) {
  const order = search.order;
  const ref = String(search.ref ?? "").replace(/[^\w-]/g, "");
  if (order === "paid") {
    return (
      <p className="rounded-card bg-molecule-50 px-5 py-4 font-medium text-molecule-700">
        {t.flash.paid[locale].replace("{ref}", ref || "—")}
      </p>
    );
  }
  if (order === "failed") return <p className="rounded-card bg-red-50 px-5 py-4 text-red-700">{t.flash.failed[locale]}</p>;
  if (order === "invoice") {
    return <p className="rounded-card bg-capsule-400/15 px-5 py-4 text-vault-900">{t.flash.invoice[locale]}</p>;
  }
  return null;
}

function SubscriptionCard({ s, user, locale }: { s: Subscription; user: User; locale: Locale }) {
  const state = subscriptionStatus(s);
  const owner = s.ownerId === user.id;
  return (
    <div className="rounded-card border border-line bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-vault-900">
            {planName(s.plan, locale)}
            {s.plan === "team" && (
              <span className="ms-2 text-sm font-normal text-muted">{t.users[locale].replace("{n}", formatNumber(s.seats, locale))}</span>
            )}
          </p>
          <p className="mt-1 text-sm text-muted">{sectionsLabel(s.sections, locale)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[state]}`}>{t.status[state][locale]}</span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="text-vault-900">{t.until[locale].replace("{date}", formatDate(s.endsAt, locale))}</span>
        {state === "active" && (
          <span className="font-semibold text-molecule-700">
            {t.daysLeft[locale].replace("{n}", formatNumber(daysUntil(s.endsAt), locale))}
          </span>
        )}
        {owner && !s.revoked && (
          <Link
            href={`${href(locale, "account/buy")}?renew=${s.id}`}
            className="ms-auto rounded-full bg-vault-900 px-4 py-2 text-xs font-semibold text-white hover:bg-vault-800"
          >
            {t.renew[locale]}
          </Link>
        )}
      </div>

      {s.plan === "team" && owner && (
        <div className="mt-6 border-t border-line pt-5">
          <p className="font-bold text-vault-900">
            {t.members[locale]
              .replace("{used}", formatNumber(s.members.length, locale))
              .replace("{seats}", formatNumber(s.seats, locale))}
          </p>
          <p className="mt-1 text-xs text-muted">{t.membersHint[locale]}</p>
          <ul className="mt-3 divide-y divide-line rounded-lg border border-line">
            {s.members.map((mobile) => (
              <li key={mobile} className="flex items-center justify-between gap-3 px-4 py-2 text-sm">
                <span dir="ltr" className="font-mono">
                  {mobile}
                  {mobile === user.mobile && <span className="ms-2 font-sans text-xs text-muted">({t.you[locale]})</span>}
                </span>
                <form action={removeTeamMember}>
                  <input type="hidden" name="subscription" value={s.id} />
                  <input type="hidden" name="mobile" value={mobile} />
                  <button type="submit" className="text-xs font-medium text-red-700 hover:underline">
                    {t.remove[locale]}
                  </button>
                </form>
              </li>
            ))}
          </ul>
          {s.members.length < s.seats && <AddMemberForm locale={locale} subscription={s.id} />}
        </div>
      )}
    </div>
  );
}

function Orders({ orders, locale }: { orders: Order[]; locale: Locale }) {
  const c = t.orderCols;
  return (
    <div className="overflow-x-auto rounded-card border border-line">
      <table className="db">
        <thead>
          <tr>
            <th>{c.id[locale]}</th>
            <th>{c.date[locale]}</th>
            <th>{c.plan[locale]}</th>
            <th>{c.period[locale]}</th>
            <th>{c.amount[locale]}</th>
            <th>{c.status[locale]}</th>
            <th>{c.ref[locale]}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="num">{o.id}</td>
              <td>{formatDate(o.createdAt, locale)}</td>
              <td>{planName(o.plan, locale)}</td>
              <td>{periodLabel(o.months, locale)}</td>
              <td className="num">{formatNumber(o.amount, locale)}</td>
              <td>
                {t.orderStatus[o.status][locale]}
                {o.method === "invoice" && (
                  <Link href={`${href(locale, "account/invoice")}?id=${o.id}`} className="block text-xs font-semibold text-molecule-700 hover:underline">
                    {account.invoice.open[locale]}
                  </Link>
                )}
              </td>
              <td className="num">{o.refId ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Referral({ stats, locale }: { stats: ReferralStats; locale: Locale }) {
  const fill = (s: string) => s.replace("{days}", String(REWARD_DAYS)).replace("{max}", String(REWARDS_PER_MONTH));
  const numbers = [
    [referralCopy.invited, String(stats.invited)],
    [referralCopy.paid, String(stats.paid)],
    [referralCopy.month, `${stats.thisMonth} / ${REWARDS_PER_MONTH}`],
    [referralCopy.days, String(stats.days)],
  ] as const;
  return (
    <section className="relative isolate overflow-hidden rounded-card border border-capsule-400/50 bg-gradient-to-br from-capsule-50 via-white to-molecule-50 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-capsule-600 shadow-sm">
          <Gift className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <BiTitle as="h2" text={referralCopy.title} locale={locale} className="text-xl font-bold text-vault-900" />
          <p className="mt-1 leading-relaxed text-ink">{fill(referralCopy.lead[locale])}</p>
        </div>
      </div>
      <div className="mt-5">
        <ReferralLink url={`${siteConfig.url}/${locale}?ref=${stats.code}`} locale={locale} />
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {numbers.map(([label, value]) => (
          <div key={label.en} className="flex flex-col-reverse rounded-xl border border-line bg-white px-4 py-3">
            <dt className="text-xs text-muted">{label[locale]}</dt>
            <dd className="font-mono text-2xl font-semibold text-vault-900" dir="ltr">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted">{fill(referralCopy.rule[locale])}</p>
    </section>
  );
}

function Alerts({ alerts, locale }: { alerts: SupplierAlert[]; locale: Locale }) {
  return (
    <section>
      <BiTitle as="h2" text={alertCopy.section} locale={locale} className="mb-4 text-xl font-bold text-vault-900" />
      <ul className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
        {alerts.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="flex items-center gap-3">
              {a.foundAt ? (
                <BellRing className="size-5 shrink-0 text-molecule-600" aria-hidden="true" />
              ) : (
                <Bell className="size-5 shrink-0 text-muted" aria-hidden="true" />
              )}
              <div>
                <p className="font-semibold text-vault-900">«{a.query}»</p>
                <p className={`text-sm ${a.foundAt ? "font-semibold text-molecule-700" : "text-muted"}`}>
                  {a.foundAt ? alertCopy.found[locale].replace("{n}", String(a.found)) : alertCopy.waiting[locale]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {a.foundAt && (
                <Link href={`${href(locale, "suppliers")}?q=${encodeURIComponent(a.query)}`} className="rounded-full bg-molecule-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-molecule-500">
                  {alertCopy.view[locale]}
                </Link>
              )}
              <form action={deleteSupplierAlert}>
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="lang" value={locale} />
                <button type="submit" className="rounded-full border border-line px-4 py-1.5 text-sm text-muted hover:border-red-400 hover:text-red-700">
                  {alertCopy.remove[locale]}
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function Dashboard({ locale, searchParams }: { locale: Locale; searchParams: Search }) {
  const search = await searchParams;
  if (!databaseConfigured()) return <p className="rounded-card bg-red-50 px-5 py-4 text-red-700">{account.errors.unavailable[locale]}</p>;
  const user = await getUser();
  if (!user) redirect(`${href(locale, "account/login")}?next=${encodeURIComponent(href(locale, "account"))}`);
  const [subscriptions, orders, alerts, referral] = await Promise.all([
    subscriptionsFor(user.id, user.mobile),
    ordersFor(user.id),
    alertsFor(user.id).catch(() => []),
    referralStats(user.id).catch(() => null),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-bold text-vault-900">{t.hello[locale].replace("{name}", user.name)}</p>
          <p className="mt-1 font-mono text-sm text-muted" dir="ltr">
            {user.mobile}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {user.isAdmin && (
            <Link href={href(locale, "admin")} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-vault-900 hover:border-molecule-500">
              {t.admin[locale]}
            </Link>
          )}
          <form action={logout}>
            <input type="hidden" name="lang" value={locale} />
            <button type="submit" className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-vault-900 hover:border-red-400 hover:text-red-700">
              {account.auth.logout[locale]}
            </button>
          </form>
        </div>
      </div>

      <Flash locale={locale} search={search} />

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <BiTitle as="h2" text={t.subscriptions} locale={locale} className="text-xl font-bold text-vault-900" />
          {subscriptions.length > 0 && (
            <ButtonLink href={href(locale, "account/buy")} variant="ghost" arrow={false}>
              {t.buyMore[locale]}
            </ButtonLink>
          )}
        </div>
        {subscriptions.length === 0 ? (
          <div className="rounded-card border-2 border-dashed border-line bg-white p-8 text-center">
            <p className="text-muted">{t.none[locale]}</p>
            <div className="mt-5">
              <ButtonLink href={href(locale, "account/buy")}>{t.buy[locale]}</ButtonLink>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {subscriptions.map((s) => (
              <SubscriptionCard key={s.id} s={s} user={user} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {referral && <Referral stats={referral} locale={locale} />}

      {alerts.length > 0 && <Alerts alerts={alerts} locale={locale} />}

      {orders.length > 0 && (
        <section>
          <BiTitle as="h2" text={t.orders} locale={locale} className="mb-4 text-xl font-bold text-vault-900" />
          <Orders orders={orders} locale={locale} />
        </section>
      )}
    </div>
  );
}

export default async function AccountPage({ searchParams }: PageProps<"/[lang]/account">) {
  const locale = await getLocale();
  return (
    <div className="bg-paper py-12 sm:py-16">
      <Container>
        <Suspense fallback={<Loading label="…" />}>
          <Dashboard locale={locale} searchParams={searchParams} />
        </Suspense>
      </Container>
    </div>
  );
}
