import Link from "next/link";
import { copy, siteConfig } from "@/content/site";
import { sectionGroups, sections } from "@/content/sections";
import { getLocale } from "@/i18n/locale";
import { href } from "@/lib/paths";
import { legalNav } from "@/content/legal";
import { BrandName } from "./brand";
import { EnamadSeal } from "./enamad-seal";
import { Logo } from "./logo";
import { Container } from "./ui";

export async function SiteFooter() {
  const locale = await getLocale();

  return (
    <footer className="bg-vault-950 text-vault-100/80">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo inverted tagline={copy.platform.en} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{copy.footer.about[locale]}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-5 inline-block text-sm font-medium text-molecule-400 hover:text-molecule-100"
            dir="ltr"
          >
            {siteConfig.email}
          </a>
        </div>
        {sectionGroups.map((g) => (
          <div key={g.key}>
            <h2 className="text-sm font-bold text-white">{g.title[locale]}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {sections
                .filter((s) => s.group === g.key)
                .map((s) => (
                  <li key={s.slug}>
                    <Link href={href(locale, s.href)} className="hover:text-molecule-400">
                      {s.title[locale]}
                    </Link>
                  </li>
                ))}
              {g.key === "knowledge" && (
                <li>
                  <Link href={href(locale, "#plans")} className="hover:text-molecule-400">
                    {copy.footer.plans[locale]}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-5 py-6 text-xs text-vault-100/60 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <nav aria-label={legalNav.terms[locale]} className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {(["about", "contact", "references", "terms", "privacy"] as const).map((key) => (
                <Link key={key} href={href(locale, key)} className="hover:text-molecule-400">
                  {legalNav[key][locale]}
                </Link>
              ))}
            </nav>
            <p>
              © <BrandName /> · <span className="font-semibold text-capsule-400">{copy.slogan[locale]}</span>
            </p>
            <p className="max-w-3xl leading-relaxed">{copy.rights[locale]}</p>
          </div>
          <EnamadSeal locale={locale} tone="dark" className="w-full max-w-sm shrink-0" />
        </Container>
      </div>
    </footer>
  );
}
