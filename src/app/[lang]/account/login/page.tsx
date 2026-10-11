import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/account/forms";
import { AccountShell, accountMetadata } from "@/components/account/shell";
import { account } from "@/content/account";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { href } from "@/lib/paths";

const { auth } = account;

export const generateMetadata = () => accountMetadata(auth.loginTitle);

async function Login({ locale, searchParams }: { locale: Locale; searchParams: Promise<{ next?: string | string[] }> }) {
  const next = String((await searchParams).next ?? "");
  if (await getUser()) redirect(next.startsWith(`/${locale}/`) ? next : href(locale, "account"));
  const register = `${href(locale, "account/register")}${next ? `?next=${encodeURIComponent(next)}` : ""}`;
  return (
    <>
      <LoginForm locale={locale} />
      <p className="mt-6 text-center text-sm text-muted">
        {auth.noAccount[locale]}{" "}
        <Link href={register} className="font-semibold text-molecule-700 hover:text-molecule-600">
          {auth.register[locale]}
        </Link>
      </p>
    </>
  );
}

export default async function LoginPage({ searchParams }: PageProps<"/[lang]/account/login">) {
  const locale = await getLocale();
  return (
    <AccountShell locale={locale} title={auth.loginTitle} lead={auth.loginLead}>
      <Suspense fallback={<LoginForm locale={locale} />}>
        <Login locale={locale} searchParams={searchParams} />
      </Suspense>
      <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-muted">
        {auth.oneDevice[locale]} {auth.forgot[locale]}
      </p>
    </AccountShell>
  );
}
