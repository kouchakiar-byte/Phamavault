import { PageHeader } from "@/components/page-header";
import { SaltFormsBench } from "@/components/salt-forms-bench";
import { Container } from "@/components/ui";
import { saltForms } from "@/content/salt-forms";
import { getLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/metadata";
import { href } from "@/lib/paths";

export const generateMetadata = () => pageMetadata(saltForms.title, saltForms.lead, "materials/salt-forms");

export default async function SaltFormsPage() {
  const locale = await getLocale();
  return (
    <>
      <PageHeader
        locale={locale}
        section="materials"
        title={saltForms.title}
        lead={saltForms.lead}
        back={{ href: href(locale, "materials"), label: saltForms.back }}
      />
      <Container className="py-12">
        <SaltFormsBench locale={locale} />
      </Container>
    </>
  );
}
