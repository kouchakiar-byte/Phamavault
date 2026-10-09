import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { copy } from "@/content/site";
import { getSection, sectionGroups, sections, supplierBankShort } from "@/content/sections";
import { getLocale } from "@/i18n/locale";
import { href } from "@/lib/paths";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { Container } from "./ui";

export async function SiteHeader() {
  const locale = await getLocale();
  const { nav } = copy;
  const SupplierIcon = getSection("suppliers").icon;
  const links = [
    { href: href(locale, "tools"), label: nav.tools[locale], wide: false },
    { href: href(locale, "#plans"), label: nav.plans[locale], wide: true },
    { href: href(locale, "#enterprise"), label: nav.enterprise[locale], wide: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
      <Container className="relative flex h-18 items-center justify-between gap-6">
        <Link href={href(locale)} aria-label="PharmaVault">
          <Logo />
        </Link>

        <nav aria-label={nav.menu[locale]} className="hidden items-center gap-1 lg:flex">
          <Link
            href={href(locale, "suppliers")}
            className="me-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-molecule-50 px-3.5 py-2 text-sm font-semibold text-molecule-700 ring-1 ring-molecule-400/40 transition hover:bg-molecule-100"
          >
            <SupplierIcon className="size-4" aria-hidden="true" />
            {supplierBankShort[locale]}
          </Link>
          <div className="group">
            <Link
              href={href(locale, "#sections")}
              aria-haspopup="true"
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-vault-800 hover:text-molecule-700"
            >
              {nav.sections[locale]}
              <ChevronDown className="size-4 transition group-focus-within:rotate-180 group-hover:rotate-180" aria-hidden="true" />
            </Link>
            {/* Mega menu: the sections grouped as databases, tools and knowledge */}
            <div className="invisible absolute inset-x-8 top-full pt-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="grid grid-cols-3 gap-4 rounded-card border border-line bg-white p-4 shadow-xl shadow-vault-900/10">
                {sectionGroups.map((g) => (
                  <div key={g.key}>
                    <p className="px-3 pb-2 text-xs font-semibold tracking-wide text-muted">{g.title[locale]}</p>
                    <ul>
                      {sections
                        .filter((s) => s.group === g.key)
                        .map(({ slug, href: path, icon: Icon, title }) => (
                          <li key={slug}>
                            <Link href={href(locale, path)} className="flex gap-2.5 rounded-lg p-2.5 hover:bg-vault-50">
                              <Icon className="mt-0.5 size-[1.1rem] shrink-0 text-molecule-500" aria-hidden="true" />
                              <span className="text-sm font-semibold leading-snug text-vault-900">{title[locale]}</span>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-vault-800 hover:text-molecule-700 ${item.wide ? "hidden xl:block" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher current={locale} label={nav.language[locale]} />
          </div>
          <Link
            href={href(locale, "#contact")}
            className="hidden whitespace-nowrap rounded-full bg-vault-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-vault-800 lg:inline-flex"
          >
            {nav.requestAccess[locale]}
          </Link>
          <MobileNav
            menuLabel={nav.menu[locale]}
            closeLabel={nav.close[locale]}
            items={[
              { href: href(locale), label: nav.home[locale] },
              ...sections.map((s) => ({ href: href(locale, s.href), label: s.title[locale] })),
              { href: href(locale, "#plans"), label: nav.plans[locale] },
              { href: href(locale, "#contact"), label: nav.requestAccess[locale] },
            ]}
            footer={<LanguageSwitcher current={locale} label={nav.language[locale]} />}
          />
        </div>
      </Container>
    </header>
  );
}
