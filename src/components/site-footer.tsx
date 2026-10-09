import Link from "next/link";
import { copy, siteConfig } from "@/content/site";
import { sectionGroups, sections } from "@/content/sections";
import { getLocale } from "@/i18n/locale";
import { href } from "@/lib/paths";
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
            <h2 className="text-sm font-semibold text-white">{g.title[locale]}</h2>
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
        <Container className="flex flex-col gap-2 py-6 text-xs text-vault-100/60 sm:flex-row sm:justify-between">
          <p>
            © <span dir="ltr">{siteConfig.name}</span> · {copy.platform[locale]}
          </p>
          <p>{copy.slogan[locale]}</p>
        </Container>
      </div>
    </footer>
  );
}
