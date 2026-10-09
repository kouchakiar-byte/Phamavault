import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href, sections, siteConfig } from "@/lib/site";
import { Logo } from "./logo";
import { Container } from "./ui";

export async function SiteFooter() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  const columns = [
    { title: t.footer.expertise, group: "expertise" },
    { title: t.footer.knowledge, group: "knowledge" },
    { title: t.footer.company, group: "company" },
  ] as const;

  return (
    <footer className="bg-vault-950 text-vault-100/80">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo inverted tagline={t.brand.tagline} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{t.footer.about}</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-5 inline-block text-sm font-medium text-molecule-400 hover:text-molecule-100"
            dir="ltr"
          >
            {siteConfig.email}
          </a>
        </div>
        {columns.map((col) => (
          <div key={col.group}>
            <h2 className="text-sm font-semibold text-white">{col.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {sections
                .filter((s) => s.group === col.group)
                .map((s) => (
                  <li key={s.slug}>
                    <Link href={href(locale, s.slug)} className="hover:text-molecule-400">
                      {t.sections[s.key].title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-vault-100/60 sm:flex-row sm:justify-between">
          <p>
            © <span dir="ltr">{siteConfig.name}</span>. {t.footer.rights}
          </p>
          <p>{t.brand.slogan}</p>
        </Container>
      </div>
    </footer>
  );
}
