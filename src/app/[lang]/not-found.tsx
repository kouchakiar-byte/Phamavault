import { ButtonLink, Container } from "@/components/ui";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { href } from "@/lib/site";

export default async function NotFound() {
  const [locale, t] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="font-mono text-sm font-semibold text-molecule-600">404</p>
      <h1 className="mt-4 text-3xl font-bold text-vault-900 sm:text-4xl">{t.notFound.title}</h1>
      <p className="mt-4 text-muted">{t.notFound.text}</p>
      <div className="mt-8">
        <ButtonLink href={href(locale)}>{t.sectionPage.backHome}</ButtonLink>
      </div>
    </Container>
  );
}
