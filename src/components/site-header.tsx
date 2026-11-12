import Link from "next/link";
import { BriefcaseBusiness, ChevronDown, Download, FilePlus2, Sparkles } from "lucide-react";
import { coaBuilderCopy } from "@/content/coa-builder";
import { freeHandbookCopy, freeHandbooks } from "@/content/free-handbooks";
import { interviewCopy, withCounts } from "@/content/interview";
import { copy } from "@/content/site";
import { getSection, sectionGroups, sections, supplierBankShort, supplierBankTiny } from "@/content/sections";
import { referenceLabels } from "@/content/references";
import { getLocale } from "@/i18n/locale";
import { href } from "@/lib/paths";
import { AccountLink } from "./account-link";
import { RndBell } from "./rnd/bell";
import { LanguageSwitcher } from "./language-switcher";
import { HoverMenu } from "./hover-menu";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { SiteSearch } from "./site-search";
import { Container } from "./ui";

export async function SiteHeader() {
  const locale = await getLocale();
  const { nav } = copy;
  const SupplierIcon = getSection("suppliers").icon;
  const links = [
    { href: href(locale, "tools"), label: nav.tools[locale], wide: false },
    { href: href(locale, "references"), label: referenceLabels.short[locale], wide: false },
    { href: href(locale, "#plans"), label: nav.plans[locale], wide: true },
    { href: href(locale, "#enterprise"), label: nav.enterprise[locale], wide: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
      <Container className="relative flex h-18 items-center justify-between gap-3 xl:gap-4">
        <div className="flex items-center gap-2">
          <Link href={href(locale)} aria-label="PharmaVault">
            <Logo />
          </Link>
          <Link
            href={href(locale)}
            className="hidden whitespace-nowrap rounded-lg px-2 py-2 text-sm font-medium text-vault-800 transition hover:text-molecule-700 min-[460px]:block lg:hidden 2xl:block"
          >
            {nav.home[locale]}
          </Link>
          <div className="account-link-narrow lg:hidden">
            <AccountLink locale={locale} variant="header" />
          </div>
        </div>

        <nav aria-label={nav.menu[locale]} className="hidden items-center gap-1 lg:flex">
          <Link
            href={href(locale, "suppliers")}
            className="me-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-molecule-50 px-3.5 py-2 text-sm font-semibold text-molecule-700 ring-1 ring-molecule-400/40 transition hover:bg-molecule-100"
          >
            <SupplierIcon className="size-4" aria-hidden="true" />
            <span className="xl:hidden">{supplierBankTiny[locale]}</span>
            <span className="hidden xl:inline">{supplierBankShort[locale]}</span>
          </Link>
          {/* Interview questions: a pill of its own so job seekers find it */}
          <Link
            href={href(locale, "interview")}
            className="me-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-capsule-50 px-3 py-2 text-sm font-semibold text-capsule-700 ring-1 ring-capsule-400/50 transition hover:bg-capsule-100"
          >
            <BriefcaseBusiness className="size-4" aria-hidden="true" />
            <span className="2xl:hidden">{interviewCopy.navTiny[locale]}</span>
            <span className="hidden 2xl:inline">{interviewCopy.navShort[locale]}</span>
          </Link>
          <HoverMenu className="group">
            <Link
              href={href(locale, "#sections")}
              aria-haspopup="true"
              className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-1.5 py-2 text-sm font-medium text-vault-800 hover:text-molecule-700"
            >
              {nav.sections[locale]}
              <ChevronDown className="size-4 transition group-focus-within:rotate-180 group-hover:rotate-180" aria-hidden="true" />
            </Link>
            {/* Mega menu: the sections grouped as databases, tools and knowledge */}
            <div
              data-menu-panel
              className="invisible absolute inset-x-8 top-full pt-1 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
            >
              <div className="rounded-card border border-line bg-white p-4 shadow-xl shadow-vault-900/10">
                <div className="grid grid-cols-4 gap-4">
                  {[...sectionGroups, { key: "company" as const, title: nav.services }].map((g) => (
                    <div key={g.key}>
                      <p className="px-3 pb-2 text-xs font-semibold tracking-wide text-muted">{g.title[locale]}</p>
                      <ul>
                        {sections
                          .filter((s) => s.group === g.key)
                          .map(({ slug, href: path, icon: Icon, title }) => (
                            <li key={slug}>
                              <Link data-menu-item href={href(locale, path)} className="flex gap-2.5 rounded-lg p-2.5 hover:bg-vault-50">
                                <Icon className="mt-0.5 size-[1.1rem] shrink-0 text-molecule-500" aria-hidden="true" />
                                <span className="text-sm font-bold leading-snug text-vault-900">{title[locale]}</span>
                              </Link>
                            </li>
                          ))}
                        {g.key === "tools" && (
                          <li>
                            <Link data-menu-item href={href(locale, "coa-builder")} className="flex gap-2.5 rounded-lg p-2.5 hover:bg-vault-50">
                              <FilePlus2 className="mt-0.5 size-[1.1rem] shrink-0 text-molecule-500" aria-hidden="true" />
                              <span className="text-sm font-bold leading-snug text-vault-900">{coaBuilderCopy.title[locale]}</span>
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
                {/* This week's free handbook, under the sections */}
                <Link
                  data-menu-item
                  href={href(locale, "free-handbooks")}
                  className="mt-3 flex items-center justify-between gap-4 rounded-xl bg-vault-900 px-4 py-3 text-white transition hover:bg-vault-800"
                >
                  <span className="flex items-center gap-2.5 text-sm font-bold">
                    <Sparkles className="size-4 text-capsule-400" aria-hidden="true" />
                    <span className="text-capsule-400">{freeHandbookCopy.eyebrow[locale]}:</span>
                    {freeHandbooks[0].title[locale]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-capsule-400 px-3 py-1 text-xs font-extrabold text-vault-900">
                    <Download className="size-3.5" aria-hidden="true" />
                    {freeHandbookCopy.free[locale]}
                  </span>
                </Link>
                <Link
                  data-menu-item
                  href={href(locale, "interview")}
                  className="mt-2 flex items-center justify-between gap-4 rounded-xl border border-capsule-400/50 bg-capsule-50 px-4 py-3 text-vault-900 transition hover:bg-capsule-100"
                >
                  <span className="flex items-center gap-2.5 text-sm font-bold">
                    <BriefcaseBusiness className="size-4 text-capsule-700" aria-hidden="true" />
                    {withCounts(interviewCopy.navBanner[locale])}
                  </span>
                  <span className="rounded-full bg-capsule-400 px-3 py-1 text-xs font-extrabold text-vault-900">{withCounts(interviewCopy.navBadge[locale])}</span>
                </Link>
              </div>
            </div>
          </HoverMenu>
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-1.5 py-2 text-sm font-medium text-vault-800 hover:text-molecule-700 ${item.wide ? "hidden xl:block" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <RndBell locale={locale} />
          <SiteSearch locale={locale} />
          <div className="hidden sm:block">
            <LanguageSwitcher current={locale} label={nav.language[locale]} />
          </div>
          <div className="hidden lg:block">
            <AccountLink locale={locale} variant="header" />
          </div>
          <MobileNav
            menuLabel={nav.menu[locale]}
            closeLabel={nav.close[locale]}
            items={[
              { href: href(locale), label: nav.home[locale] },
              { href: href(locale, "interview"), label: interviewCopy.title[locale], accent: true },
              ...sections.map((s) => ({ href: href(locale, s.href), label: s.title[locale] })),
              { href: href(locale, "coa-builder"), label: coaBuilderCopy.title[locale] },
              { href: href(locale, "free-handbooks"), label: freeHandbookCopy.pageTitle[locale] },
              { href: href(locale, "#plans"), label: nav.plans[locale] },
            ]}
            cta={<AccountLink locale={locale} variant="menu" />}
            ctaAfter={3 + sections.length}
            footer={<LanguageSwitcher current={locale} label={nav.language[locale]} />}
          />
        </div>
      </Container>
    </header>
  );
}
