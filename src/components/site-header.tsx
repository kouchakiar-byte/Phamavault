import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { expertiseSections, href, sections } from "@/lib/site";
import { Container } from "./ui";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

const primarySlugs = ["resources", "knowledge-base", "projects", "about"] as const;

export async function SiteHeader() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  const primary = sections.filter((s) => (primarySlugs as readonly string[]).includes(s.slug));

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
      <Container className="relative flex h-18 items-center justify-between gap-6">
        <Link href={href(locale)} aria-label={t.brand.name}>
          <Logo />
        </Link>

        <nav aria-label={t.nav.menu} className="hidden items-center gap-1 lg:flex">
          <div className="group relative">
            <button
              type="button"
              aria-haspopup="true"
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-vault-800 hover:text-molecule-700"
            >
              {t.nav.expertise}
              <ChevronDown className="size-4 transition group-focus-within:rotate-180 group-hover:rotate-180" aria-hidden="true" />
            </button>
            <div className="invisible absolute start-0 top-full w-80 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <ul className="rounded-card border border-line bg-white p-2 shadow-xl shadow-vault-900/10">
                {expertiseSections.map(({ slug, key, icon: Icon }) => (
                  <li key={slug}>
                    <Link
                      href={href(locale, slug)}
                      className="flex gap-3 rounded-lg p-3 hover:bg-vault-50"
                    >
                      <Icon className="mt-0.5 size-5 shrink-0 text-molecule-500" aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-semibold text-vault-900">{t.sections[key].title}</span>
                        <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted">
                          {t.sections[key].short}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {primary.map(({ slug, key }) => (
            <Link
              key={slug}
              href={href(locale, slug)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-vault-800 hover:text-molecule-700"
            >
              {t.sections[key].title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher current={locale} label={t.nav.language} />
          </div>
          <Link
            href={href(locale, "contact")}
            className="hidden rounded-full bg-vault-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-vault-800 lg:inline-flex"
          >
            {t.sections.contact.title}
          </Link>
          <MobileNav
            menuLabel={t.nav.menu}
            closeLabel={t.nav.close}
            items={[
              { href: href(locale), label: t.nav.home },
              ...sections.map((s) => ({ href: href(locale, s.slug), label: t.sections[s.key].title })),
            ]}
            footer={<LanguageSwitcher current={locale} label={t.nav.language} />}
          />
        </div>
      </Container>
    </header>
  );
}
