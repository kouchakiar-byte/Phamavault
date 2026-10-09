import { BiTitle, ButtonLink, Container } from "@/components/ui";
import { copy } from "@/content/site";
import { getLocale } from "@/i18n/locale";
import { href } from "@/lib/paths";

export default async function NotFound() {
  const locale = await getLocale();
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="font-mono text-sm font-semibold text-molecule-600">404</p>
      <BiTitle
        as="h1"
        text={copy.common.notFoundTitle}
        locale={locale}
        className="mt-4 justify-center text-3xl font-bold text-vault-900 sm:text-4xl"
      />
      <p className="mt-4 text-muted">{copy.common.notFoundText[locale]}</p>
      <div className="mt-8">
        <ButtonLink href={href(locale)}>{copy.common.backHome[locale]}</ButtonLink>
      </div>
    </Container>
  );
}
