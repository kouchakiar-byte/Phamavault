import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { Loading, accountMetadata } from "@/components/account/shell";
import { BiTitle, Container } from "@/components/ui";
import { account } from "@/content/account";
import type { Bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { visitStats } from "@/lib/analytics";
import { getUser } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";
import { formatNumber } from "@/lib/format";
import { href } from "@/lib/paths";

const { admin: a } = account;
const t = a.visits;

export const generateMetadata = () => accountMetadata(t.title);

const dayLabel = (day: string, locale: Locale, long = false) =>
  new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-persian-nu-latn" : "en-GB", {
    day: "numeric",
    month: long ? "long" : "short",
    ...(long ? { weekday: "long" } : {}),
    timeZone: "UTC",
  }).format(new Date(`${day}T12:00:00Z`));

/** /fa/excipients/%D8%A2… shown as Persian text; a malformed address is shown as it is. */
function readable(path: string): string {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

function Panel({
  title,
  locale,
  children,
}: {
  title: Bi;
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <section className="rounded-card border border-line bg-white p-5 sm:p-6">
      <BiTitle
        as="h2"
        text={title}
        locale={locale}
        className="mb-4 text-lg font-bold text-vault-900"
      />
      {children}
    </section>
  );
}

async function Visits({ locale }: { locale: Locale }) {
  await connection();
  if (!databaseConfigured())
    return (
      <p className="rounded-card bg-red-50 px-5 py-4 text-red-700">
        {a.noDatabase[locale]}
      </p>
    );
  const user = await getUser();
  if (!user)
    redirect(
      `${href(locale, "account/login")}?next=${encodeURIComponent(href(locale, "admin/visits"))}`,
    );
  if (!user.isAdmin) notFound();

  const s = await visitStats();
  const n = (x: number) => formatNumber(x, locale);
  const max = Math.max(1, ...s.days.map((d) => d.visitors));
  const month = s.totals.find((x) => x.label === "month");
  const devicesTotal = s.devices.reduce((sum, d) => sum + d.visitors, 0) || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <BiTitle
          as="h1"
          text={t.title}
          locale={locale}
          className="text-3xl font-bold text-vault-900"
        />
        <Link
          href={href(locale, "admin")}
          className="text-sm font-semibold text-molecule-700 hover:underline"
        >
          {t.back[locale]}
        </Link>
      </div>
      <p className="text-sm text-muted">{t.lead[locale]}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {s.totals.map((x) => (
          <div
            key={x.label}
            className="rounded-card border border-line bg-white p-5"
          >
            <p className="text-sm text-muted">{t.periods[x.label][locale]}</p>
            <p className="mt-1 text-3xl font-bold text-vault-900">
              {n(x.visitors)}{" "}
              <span className="text-sm font-medium text-muted">
                {t.visitors[locale]}
              </span>
            </p>
            <p className="mt-1 text-sm text-muted">
              {n(x.views)} {t.views[locale]}
            </p>
          </div>
        ))}
      </div>

      <Panel title={t.ips} locale={locale}>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              [t.periods.today, s.ips.today],
              [t.periods.week, s.ips.week],
              [t.periods.month, s.ips.month],
              [t.ipsAll, s.ips.all],
            ] as const
          ).map(([label, value]) => (
            <div key={label.en}>
              <dt className="text-sm text-muted">{label[locale]}</dt>
              <dd className="mt-1 text-2xl font-bold text-vault-900">{n(value)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {s.ips.since ? t.ipsNote[locale].replace("{d}", dayLabel(s.ips.since, locale, true)) : t.ipsEmpty[locale]}
        </p>
      </Panel>

      {!month?.views ? (
        <p className="rounded-card bg-vault-50 px-5 py-4 text-sm text-ink">
          {t.empty[locale]}
        </p>
      ) : (
        <>
          <Panel title={t.daily} locale={locale}>
            {/* One series, one hue; each bar names its day and numbers on hover and to screen readers */}
            <div className="relative h-48 border-b border-line" dir="ltr">
              <span className="absolute -top-1 start-0 text-xs text-muted">
                {n(max)}
              </span>
              <div
                className="absolute inset-x-0 top-0 border-t border-dashed border-line"
                aria-hidden="true"
              />
              <ol className="flex h-full items-end gap-[2px] pt-4">
                {s.days.map((d) => {
                  const tip = t.dayTip[locale]
                    .replace("{d}", dayLabel(d.day, locale, true))
                    .replace("{v}", n(d.visitors))
                    .replace("{p}", n(d.views));
                  return (
                    <li
                      key={d.day}
                      className="group relative flex h-full flex-1 items-end"
                      title={tip}
                      aria-label={tip}
                    >
                      <div
                        className="w-full rounded-t-[4px] bg-molecule-600 transition-colors group-hover:bg-molecule-800"
                        style={{
                          height: `${(d.visitors / max) * 100}%`,
                          minHeight: d.visitors ? 2 : 0,
                        }}
                      />
                    </li>
                  );
                })}
              </ol>
            </div>
            <div
              className="mt-1.5 flex justify-between text-xs text-muted"
              dir="ltr"
            >
              <span>{dayLabel(s.days[0].day, locale)}</span>
              <span>{dayLabel(s.days[s.days.length - 1].day, locale)}</span>
            </div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Panel title={t.pages} locale={locale}>
              <div className="overflow-x-auto">
                <table className="db !min-w-0">
                  <thead>
                    <tr>
                      <th>{t.page[locale]}</th>
                      <th>{t.visitors[locale]}</th>
                      <th>{t.views[locale]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.pages.map((p) => (
                      <tr key={p.path}>
                        <td>
                          <a
                            href={p.path}
                            target="_blank"
                            rel="noreferrer"
                            className="break-all font-mono text-xs text-molecule-700 hover:underline"
                            dir="ltr"
                          >
                            {readable(p.path)}
                          </a>
                        </td>
                        <td className="num">{n(p.visitors)}</td>
                        <td className="num">{n(p.views)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <div className="space-y-6">
              <Panel title={t.refs} locale={locale}>
                {s.refs.length > 0 && (
                  <div className="mb-3 overflow-x-auto">
                    <table className="db !min-w-0">
                      <thead>
                        <tr>
                          <th>{t.site[locale]}</th>
                          <th>{t.visitors[locale]}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.refs.map((r) => (
                          <tr key={r.host}>
                            <td
                              dir="ltr"
                              className="font-mono text-xs"
                              style={{ textAlign: "start" }}
                            >
                              {r.host}
                            </td>
                            <td className="num">{n(r.visitors)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="text-xs text-muted">{t.direct[locale]}</p>
              </Panel>

              <Panel title={t.devices} locale={locale}>
                <ul className="space-y-3">
                  {s.devices.map((d) => {
                    const share = Math.round((d.visitors / devicesTotal) * 100);
                    return (
                      <li key={d.device}>
                        <div className="flex justify-between text-sm">
                          <span className="text-ink">
                            {t.device[d.device]?.[locale] ?? d.device}
                          </span>
                          <span className="text-muted">
                            {n(d.visitors)} · {n(share)}
                            {locale === "fa" ? "%" : "%"}
                          </span>
                        </div>
                        <div className="mt-1 h-2 rounded-full bg-vault-50">
                          <div
                            className="h-2 rounded-full bg-molecule-600"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Panel>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default async function VisitsPage() {
  const locale = await getLocale();
  return (
    <div className="bg-paper py-12">
      <Container>
        <Suspense fallback={<Loading label="…" />}>
          <Visits locale={locale} />
        </Suspense>
      </Container>
    </div>
  );
}
