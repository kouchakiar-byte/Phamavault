import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AccountShell, Loading, accountMetadata } from "@/components/account/shell";
import { AcceptInvite } from "@/components/rnd/team-manager";
import { bi } from "@/i18n/bi";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { databaseConfigured, db } from "@/lib/db";
import { href } from "@/lib/paths";
import { UNITS, isUnit } from "@/lib/rnd/model";
import { sha256 } from "@/lib/rnd/server";

const title = bi("Invitation", "دعوت به فضای کاری");
export const generateMetadata = () => accountMetadata(title);

type Search = Promise<Record<string, string | string[] | undefined>>;

async function Join({ locale, searchParams }: { locale: Locale; searchParams: Search }) {
  await connection();
  const token = String((await searchParams).t ?? "");
  const back = `${href(locale, "rnd/join")}?t=${encodeURIComponent(token)}`;
  const user = await getUser().catch(() => null);
  if (!user) redirect(`${href(locale, "account/login")}?next=${encodeURIComponent(back)}`);
  let invite: { unit: string; role: string } | undefined;
  if (databaseConfigured() && token.length >= 20 && token.length <= 80) {
    const { rows } = await (await db()).query<{ unit: string; role: string }>(
      "select unit, role from rnd_invites where token_hash = $1 and used_at is null and revoked_at is null and expires_at > now()",
      [sha256(token)],
    );
    invite = rows[0];
  }
  return (
    <div dir="rtl" lang="fa">
      <AccountShell locale="fa" title={title}>
        {invite ? (
          <>
            <p className="text-sm text-ink">
              شما برای همکاری در پروژه‌های تحقیق و توسعه دعوت شده‌اید
              {invite.role === "manager" ? " با نقش مدیر (مشاهده همه واحدها)." : isUnit(invite.unit) ? `، در واحد ${UNITS[invite.unit]}.` : "."}
            </p>
            <p className="mt-2 text-xs text-muted">این دعوت به حساب {user.name || user.mobile} وصل می‌شود و فقط یک بار قابل استفاده است. مدیر پروژه هر زمان می‌تواند دسترسی را لغو کند.</p>
            <div className="mt-6"><AcceptInvite token={token} home={href(locale, "rnd")} /></div>
          </>
        ) : (
          <p className="text-sm text-muted">این لینک دعوت معتبر نیست، قبلاً استفاده شده یا منقضی شده است. از کسی که دعوت را فرستاده لینک تازه بخواهید.</p>
        )}
      </AccountShell>
    </div>
  );
}

export default async function RndJoinPage({ searchParams }: { searchParams: Search }) {
  const locale = await getLocale();
  return (
    <Suspense fallback={<Loading label="…" />}>
      <Join locale={locale} searchParams={searchParams} />
    </Suspense>
  );
}
