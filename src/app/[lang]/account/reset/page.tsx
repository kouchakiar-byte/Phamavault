import Link from "next/link";
import { Suspense } from "react";
import { NewPasswordForm } from "@/components/account/forms";
import { AccountShell, Loading, accountMetadata } from "@/components/account/shell";
import { account } from "@/content/account";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { resetTokenValid } from "@/lib/auth";
import { href } from "@/lib/paths";

const t = account.reset;

export const generateMetadata = () => accountMetadata(t.title);

/** The page a reset email links to (?token=…): a new password if the link is still valid. */
async function Reset({ locale, searchParams }: { locale: Locale; searchParams: Promise<{ token?: string | string[] }> }) {
  const token = String((await searchParams).token ?? "");
  if (!(await resetTokenValid(token))) {
    return (
      <div className="space-y-4">
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{t.invalid[locale]}</p>
        <Link href={href(locale, "account/forgot")} className="text-sm font-semibold text-molecule-700 hover:underline">
          {t.again[locale]}
        </Link>
      </div>
    );
  }
  return <NewPasswordForm locale={locale} token={token} />;
}

export default async function ResetPage({ searchParams }: PageProps<"/[lang]/account/reset">) {
  const locale = await getLocale();
  return (
    <AccountShell locale={locale} title={t.title} lead={t.lead}>
      <Suspense fallback={<Loading label="…" />}>
        <Reset locale={locale} searchParams={searchParams} />
      </Suspense>
    </AccountShell>
  );
}
