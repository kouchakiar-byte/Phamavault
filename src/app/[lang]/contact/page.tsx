import { Clock, Mail, MapPin, Phone, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LegalPage } from "@/components/legal-page";
import { WhatsAppIcon, whatsappHref } from "@/components/whatsapp-icon";
import { contact, contactLabels as t } from "@/content/legal";
import { siteConfig } from "@/content/site";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export const generateMetadata = () => pageMetadata(contact.title, contact.lead, "contact");

export default async function ContactPage() {
  const locale = await getLocale();
  const c = siteConfig.contact;
  const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;
  const rows: { icon: LucideIcon | typeof WhatsAppIcon; label: string; value: string | null; ltr?: boolean; href?: string; whatsapp?: string }[] = [
    { icon: UserRound, label: t.owner[locale], value: c.owner },
    { icon: MapPin, label: t.address[locale], value: c.address && (c.postalCode ? `${c.address} — ${t.postalCode[locale]}: ${c.postalCode}` : c.address) },
    { icon: Phone, label: t.landline[locale], value: c.landline, ltr: true, href: c.landline ? tel(c.landline) : undefined },
    { icon: WhatsAppIcon, label: t.phone[locale], value: c.phone, ltr: true, href: c.phone ? tel(c.phone) : undefined, whatsapp: c.phone ? whatsappHref(c.phone) : undefined },
    { icon: Mail, label: t.email[locale], value: siteConfig.email, ltr: true, href: `mailto:${siteConfig.email}` },
    { icon: Clock, label: t.hours[locale], value: c.hours[locale] },
  ];
  return (
    <LegalPage page={contact} locale={locale}>
      <dl className="grid gap-4 sm:grid-cols-2">
        {rows
          .filter((r) => r.value)
          .map(({ icon: Icon, label, value, ltr, href, whatsapp }) => (
            <div key={label} className="flex gap-3 rounded-card border border-line bg-white p-5">
              <Icon className="mt-0.5 size-5 shrink-0 text-molecule-500" aria-hidden="true" />
              <div>
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="mt-1 font-bold text-vault-900" dir={ltr ? "ltr" : undefined}>
                  {href ? (
                    <a href={href} className="hover:text-molecule-700">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
                {whatsapp && (
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/10 px-3 py-1 text-xs font-semibold text-[#128C7E] hover:bg-[#25D366]/20">
                    <WhatsAppIcon className="size-4" />
                    {t.whatsapp[locale]}
                  </a>
                )}
              </div>
            </div>
          ))}
      </dl>
    </LegalPage>
  );
}
