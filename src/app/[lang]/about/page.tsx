import { LegalPage } from "@/components/legal-page";
import { about } from "@/content/legal";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";

export const generateMetadata = () => pageMetadata(about.title, about.lead, "about");

export default async function Page() {
  return <LegalPage page={about} locale={await getLocale()} />;
}
