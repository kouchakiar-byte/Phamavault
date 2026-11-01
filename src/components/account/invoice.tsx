import { account } from "@/content/account";
import { siteConfig } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { formatNumber } from "@/lib/format";
import { periodLabel, planName, sectionsLabel } from "@/lib/labels";
import { invoiceNumber, jalali } from "@/lib/invoice";
import type { Buyer, Order } from "@/lib/orders";
import { PrintButton } from "./print-button";

const t = account.invoice;

function Seal() {
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-6 opacity-90" aria-hidden="true">
      <defs>
        <path id="inv-arc" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" />
      </defs>
      <circle cx="60" cy="60" r="57" fill="none" stroke="#0b1f3a" strokeWidth="2.4" />
      <circle cx="60" cy="60" r="35" fill="none" stroke="#0b1f3a" strokeWidth="1.2" />
      <text direction="ltr" fontWeight="700" fontSize="8.6" fill="#0b1f3a" letterSpacing=".55" textLength="280" lengthAdjust="spacing">
        <textPath href="#inv-arc">PHARMAVAULT · PHARMACEUTICAL INFORMATION VAULT ·</textPath>
      </text>
      <g transform="translate(42 41) scale(.9)">
        <path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5Z" fill="#0b1f3a" stroke="#2cc4bc" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="20" cy="20" r="9" fill="none" stroke="#2cc4bc" strokeWidth="1.6" />
        <circle cx="20" cy="18" r="2.6" fill="#dcbd6d" />
        <path d="M18.6 19.5h2.8l.8 5.2h-4.4Z" fill="#dcbd6d" />
      </g>
      <text x="60" y="88" textAnchor="middle" fontWeight="700" fontSize="7.5" fill="#0b1f3a">
        فارماوالت
      </text>
    </svg>
  );
}

/** A printable pro-forma invoice for one order. Everything outside #invoice is hidden when printing. */
export function Invoice({ order, buyer, locale }: { order: Order; buyer: Buyer; locale: Locale }) {
  const valid = new Date(order.createdAt.getTime() + 7 * 86_400_000);
  const scope = order.plan === "team" ? t.seatsQty[locale].replace("{n}", formatNumber(order.seats, locale)) : sectionsLabel(order.sections, locale);
  const payment = (process.env.INVOICE_PAYMENT ?? "").split(/\\n|\n/).map((l) => l.trim()).filter(Boolean);
  const c = siteConfig.contact;
  const cell = "border border-line px-3 py-2";
  return (
    <>
      <style>{`@media print {
  @page { size: A4; margin: 12mm; }
  html, body, main { min-height: 0 !important; height: auto !important; display: block !important; background: #fff !important; }
  body > *:not(main), .no-print { display: none !important; }
  .invoice-shell, .invoice-shell *:has(#invoice) { padding: 0 !important; margin: 0 !important; max-width: none !important; background: none !important; }
  #invoice { border: 0 !important; padding: 0 !important; }
}`}</style>
      <div className="no-print mb-4 flex flex-wrap gap-3">
        <PrintButton label={t.print[locale]} />
      </div>
      {order.status !== "pending" && (
        <p className="no-print mb-4 rounded-lg bg-capsule-400/15 px-4 py-3 text-sm text-vault-900">
          {(order.status === "paid" ? t.paidNote : t.cancelledNote)[locale]}
        </p>
      )}
      <article id="invoice" className="rounded-card border border-line bg-white p-6 text-sm leading-7 text-ink sm:p-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-vault-900 pb-4">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 40 40" className="h-14 w-14" aria-hidden="true">
              <path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5Z" fill="#0b1f3a" stroke="#2cc4bc" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="20" cy="20" r="9" fill="none" stroke="#2cc4bc" strokeWidth="1.6" />
              <circle cx="20" cy="18" r="2.6" fill="#dcbd6d" />
              <path d="M18.6 19.5h2.8l.8 5.2h-4.4Z" fill="#dcbd6d" />
            </svg>
            <div>
              <p className="text-2xl font-bold text-vault-900" dir="ltr">
                Pharma<span className="text-capsule-600">Vault</span>
              </p>
              <p className="text-xs text-muted">{account.invoice.sellerName[locale]}</p>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-vault-900">{t.title[locale]}</h1>
          </div>
          <dl className="grid grid-cols-[auto_auto] gap-x-2 text-xs">
            <dt className="text-muted">{t.number[locale]}:</dt>
            <dd className="font-bold">{invoiceNumber(order)}</dd>
            <dt className="text-muted">{t.date[locale]}:</dt>
            <dd className="font-bold">{jalali(order.createdAt, locale, { dateStyle: "medium" })}</dd>
            <dt className="text-muted">{t.valid[locale]}:</dt>
            <dd className="font-bold">{jalali(valid, locale, { dateStyle: "medium" })}</dd>
          </dl>
        </header>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <section className="rounded-lg bg-paper p-4">
            <h2 className="mb-1 font-bold text-vault-900">{t.seller[locale]}</h2>
            <p>{t.sellerName[locale]}</p>
            {c.address && <p className="text-xs text-muted">{c.address}</p>}
            <p className="text-xs text-muted">
              <span dir="ltr">{c.landline}</span> · <span dir="ltr">{c.phone}</span> · <span dir="ltr">{siteConfig.email}</span>
            </p>
          </section>
          <section className="rounded-lg bg-paper p-4">
            <h2 className="mb-1 font-bold text-vault-900">{t.buyer[locale]}</h2>
            <p className="font-semibold">{buyer.org || buyer.name}</p>
            {buyer.org && (
              <p className="text-xs text-muted">
                {t.contactPerson[locale]}: {buyer.name}
              </p>
            )}
            <p className="text-xs text-muted">
              {t.mobile[locale]}: <span dir="ltr">{buyer.mobile}</span>
              {buyer.email && (
                <>
                  {" "}· {t.email[locale]}: <span dir="ltr">{buyer.email}</span>
                </>
              )}
            </p>
          </section>
        </div>

        <table className="mt-5 w-full border-collapse text-center">
          <thead className="bg-vault-900 text-white">
            <tr>
              <th className={`${cell} w-12`}>{t.row[locale]}</th>
              <th className={`${cell} text-start`}>{t.item[locale]}</th>
              <th className={cell}>{t.qty[locale]}</th>
              <th className={cell}>{t.period[locale]}</th>
              <th className={cell}>{t.total[locale]}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={cell}>1</td>
              <td className={`${cell} text-start`}>{t.itemText[locale].replace("{plan}", planName(order.plan, locale)).replace("{scope}", scope)}</td>
              <td className={cell}>{order.plan === "team" ? t.seatsQty[locale].replace("{n}", formatNumber(order.seats, locale)) : t.oneUser[locale]}</td>
              <td className={cell}>{periodLabel(order.months, locale)}</td>
              <td className={`${cell} font-mono`}>{formatNumber(order.amount, locale)}</td>
            </tr>
            <tr className="bg-paper font-bold">
              <td className={`${cell} text-start`} colSpan={4}>
                {t.payable[locale]}
              </td>
              <td className={`${cell} font-mono text-vault-900`}>{formatNumber(order.amount, locale)}</td>
            </tr>
          </tbody>
        </table>

        <section className="mt-5">
          <h2 className="mb-1 font-bold text-vault-900">{t.payTitle[locale]}</h2>
          {payment.length ? (
            payment.map((line, i) => (
              <p key={i} className="font-semibold">
                {line}
              </p>
            ))
          ) : (
            <p>{t.payNone[locale]}</p>
          )}
          <p className="text-xs text-muted">{t.payAfter[locale]}</p>
        </section>

        <footer className="mt-6 flex items-center justify-end gap-4">
          <p className="text-center font-bold text-vault-900">{t.sign[locale]}</p>
          <Seal />
        </footer>
        <p className="mt-2 text-center text-xs">
          <a href={siteConfig.url} className="text-molecule-700" dir="ltr">
            {siteConfig.url}
          </a>
        </p>
      </article>
    </>
  );
}
