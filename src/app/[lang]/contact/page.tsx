import { Clock, Mail, MapPin, Phone, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LegalPage } from "@/components/legal-page";
import { contact, contactLabels as t } from "@/content/legal";
import { siteConfig } from "@/content/site";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export const generateMetadata = () => pageMetadata(contact.title, contact.lead, "contact");

export default async function ContactPage() {
  const locale = await getLocale();
  const c = siteConfig.contact;
  const rows: { icon: LucideIcon; label: string; value: string | null; ltr?: boolean; href?: string }[] = [
    { icon: UserRound, label: t.owner[locale], value: c.owner },
    { icon: MapPin, label: t.address[locale], value: c.address && (c.postalCode ? `${c.address} — ${t.postalCode[locale]}: ${c.postalCode}` : c.address) },
    { icon: Phone, label: t.phone[locale], value: c.phone, ltr: true, href: c.phone ? `tel:${c.phone.replace(/[^\d+]/g, "")}` : undefined },
    { icon: Mail, label: t.email[locale], value: siteConfig.email, ltr: true, href: `mailto:${siteConfig.email}` },
    { icon: Clock, label: t.hours[locale], value: c.hours[locale] },
  ];
  return (
    <LegalPage page={contact} locale={locale}>
      <dl className="grid gap-4 sm:grid-cols-2">
        {rows
          .filter((r) => r.value)
          .map(({ icon: Icon, label, value, ltr, href }) => (
            <div key={label} className="flex gap-3 rounded-card border border-line bg-white p-5">
              <Icon className="mt-0.5 size-5 shrink-0 text-molecule-500" aria-hidden="true" />
              <div>
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="mt-1 font-semibold text-vault-900" dir={ltr ? "ltr" : undefined}>
                  {href ? (
                    <a href={href} className="hover:text-molecule-700">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            </div>
          ))}
      </dl>
    </LegalPage>
  );
}
