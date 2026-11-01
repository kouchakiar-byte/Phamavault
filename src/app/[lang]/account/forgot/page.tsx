import { ForgotForm } from "@/components/account/forms";
import { AccountShell, accountMetadata } from "@/components/account/shell";
import { account } from "@/content/account";
import { getLocale } from "@/i18n/locale";

const t = account.reset;

export const generateMetadata = () => accountMetadata(t.forgotTitle);

export default async function ForgotPage() {
  const locale = await getLocale();
  return (
    <AccountShell locale={locale} title={t.forgotTitle} lead={t.forgotLead}>
      <ForgotForm locale={locale} />
    </AccountShell>
  );
}
