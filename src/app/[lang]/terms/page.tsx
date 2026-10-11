import { LegalPage } from "@/components/legal-page";
import { terms } from "@/content/legal";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export const generateMetadata = () => pageMetadata(terms.title, terms.lead, "terms");

export default async function Page() {
  return <LegalPage page={terms} locale={await getLocale()} />;
}
