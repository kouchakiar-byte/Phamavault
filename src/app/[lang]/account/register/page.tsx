import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/account/forms";
import { AccountShell, accountMetadata } from "@/components/account/shell";
import { account } from "@/content/account";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { href } from "@/lib/paths";

const { auth } = account;

export const generateMetadata = () => accountMetadata(auth.registerTitle);

async function Register({ locale, searchParams }: { locale: Locale; searchParams: Promise<{ next?: string | string[] }> }) {
  const next = String((await searchParams).next ?? "");
  if (await getUser()) redirect(next.startsWith(`/${locale}/`) ? next : href(locale, "account"));
  const other = `${href(locale, "account/login")}${next ? `?next=${encodeURIComponent(next)}` : ""}`;
  return (
    <>
      <RegisterForm locale={locale} />
      <p className="mt-6 text-center text-sm text-muted">
        {auth.haveAccount[locale]}{" "}
        <Link href={other} className="font-semibold text-molecule-700 hover:text-molecule-600">
          {auth.login[locale]}
        </Link>
      </p>
    </>
  );
}

export default async function RegisterPage({ searchParams }: PageProps<"/[lang]/account/register">) {
  const locale = await getLocale();
  return (
    <AccountShell locale={locale} title={auth.registerTitle} lead={auth.registerLead}>
      <Suspense fallback={<RegisterForm locale={locale} />}>
        <Register locale={locale} searchParams={searchParams} />
      </Suspense>
      <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-muted">{auth.oneDevice[locale]}</p>
    </AccountShell>
  );
}
