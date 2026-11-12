import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { LogIn, UserRound } from "lucide-react";
import { account } from "@/content/account";
import type { Locale } from "@/i18n/config";
import { getUser } from "@/lib/auth";
import { href } from "@/lib/paths";

type Variant = "header" | "menu";

const styles: Record<Variant, string> = {
  header:
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-vault-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-vault-800 sm:text-sm lg:px-4 lg:py-2.5",
  menu: "flex w-full items-center justify-center gap-2 rounded-full bg-molecule-600 px-5 py-3 font-semibold text-white transition hover:bg-molecule-700",
};

function View({ locale, variant, signedIn }: { locale: Locale; variant: Variant; signedIn: boolean }) {
  const Icon = signedIn ? UserRound : LogIn;
  const label = signedIn ? account.nav.account[locale] : account.nav.join[locale];
  const short = signedIn ? account.nav.account[locale] : account.nav.signIn[locale];
  return (
    <Link href={href(locale, signedIn ? "account" : "account/login")} className={styles[variant]}>
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {variant === "header" ? (
        // The English "Sign in / Sign up" is wider than the Persian label: it needs a wider screen before it fits beside the menu.
        locale === "en" ? (
          <>
            <span className="min-[440px]:hidden">{short}</span>
            <span className="hidden min-[440px]:inline">{label}</span>
          </>
        ) : (
          <>
            <span className="min-[380px]:hidden">{short}</span>
            <span className="hidden min-[380px]:inline">{label}</span>
          </>
        )
      ) : (
        label
      )}
    </Link>
  );
}

async function Resolved({ locale, variant }: { locale: Locale; variant: Variant }) {
  await cookies(); // per request: signed-in readers see "My account"
  const user = await getUser().catch(() => null);
  return <View locale={locale} variant={variant} signedIn={Boolean(user)} />;
}

/** "Sign in / Sign up" for visitors, "My account" once signed in. Most visitors are guests, so that is the fallback. */
export function AccountLink({ locale, variant }: { locale: Locale; variant: Variant }) {
  return (
    <Suspense fallback={<View locale={locale} variant={variant} signedIn={false} />}>
      <Resolved locale={locale} variant={variant} />
    </Suspense>
  );
}
