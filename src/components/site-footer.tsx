import Link from "next/link";
import { copy, siteConfig } from "@/content/site";
import { sections } from "@/content/sections";
import { getLocale } from "@/i18n/locale";
import { href } from "@/lib/paths";
import { Logo } from "./logo";
import { Container } from "./ui";

export async function SiteFooter() {
  const locale = await getLocale();

  return (
    <footer className="bg-vault-950 text-vault-100/85">
      <Container className="grid gap-12 py-14 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo inverted tagline={copy.platform.en} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{copy.platform[locale]}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-4 inline-block text-sm font-medium text-molecule-400 hover:text-white"
            dir="ltr"
          >
            {siteConfig.email}
          </a>
        </div>
        <nav aria-label={copy.nav.sections[locale]}>
          <ul className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <li key={s.slug}>
                <Link href={href(locale, s.href)} className="hover:text-molecule-400">
                  {s.title[locale]}
                </Link>
              </li>
            ))}
            <li>
              <Link href={href(locale, "#plans")} className="hover:text-molecule-400">
                {copy.nav.plans[locale]}
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-vault-100/70 sm:flex-row sm:justify-between">
          <p>
            <span dir="ltr">PharmaVault</span> · {copy.platform[locale]}
          </p>
          <p className="font-mono" dir="ltr">
            {siteConfig.domain}
          </p>
        </Container>
      </div>
    </footer>
  );
}
