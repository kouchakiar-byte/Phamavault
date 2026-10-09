import Link from "next/link";
import { copy } from "@/content/site";
import { sections } from "@/content/sections";
import { getLocale } from "@/i18n/locale";
import { href } from "@/lib/paths";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { Container } from "./ui";

export async function SiteHeader() {
  const locale = await getLocale();
  const { nav } = copy;
  const primary = [
    { href: href(locale, "#sections"), label: nav.sections[locale] },
    { href: href(locale, "tools"), label: nav.tools[locale] },
    { href: href(locale, "#plans"), label: nav.plans[locale] },
    { href: href(locale, "#enterprise"), label: nav.enterprise[locale] },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
      <Container className="relative flex h-18 items-center justify-between gap-6">
        <Link href={href(locale)} aria-label="PharmaVault">
          <Logo />
        </Link>

        <nav aria-label={nav.menu[locale]} className="hidden items-center gap-1 lg:flex">
          {primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-vault-800 hover:text-molecule-700"
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
            className="hidden rounded-full bg-molecule-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-molecule-700 lg:inline-flex"
          >
            {nav.requestAccess[locale]}
          </Link>
          <MobileNav
            menuLabel={nav.menu[locale]}
            closeLabel={nav.close[locale]}
            items={[
              ...primary,
              ...sections
                .filter((s) => !s.href.startsWith("#") && s.slug !== "tools")
                .map((s) => ({ href: href(locale, s.href), label: s.title[locale] })),
              { href: href(locale, "#contact"), label: nav.requestAccess[locale] },
            ]}
            footer={<LanguageSwitcher current={locale} label={nav.language[locale]} />}
          />
        </div>
      </Container>
    </header>
  );
}
