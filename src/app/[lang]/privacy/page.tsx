import { LegalPage } from "@/components/legal-page";
import { privacy } from "@/content/legal";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export const generateMetadata = () => pageMetadata(privacy.title, privacy.lead, "privacy");

export default async function Page() {
  return <LegalPage page={privacy} locale={await getLocale()} />;
}
