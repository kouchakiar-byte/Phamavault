import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { Invoice } from "@/components/account/invoice";
import { Loading, accountMetadata } from "@/components/account/shell";
import { Container } from "@/components/ui";
import { account } from "@/content/account";
import type { Locale } from "@/i18n/config";
import { getLocale } from "@/i18n/locale";
import { getUser } from "@/lib/auth";
import { orderWithBuyer } from "@/lib/orders";
import { href } from "@/lib/paths";

export const generateMetadata = () => accountMetadata(account.invoice.title);

/** An order's pro-forma (?id=…). Only the buyer and the admins can open it. */
async function View({ locale, searchParams }: { locale: Locale; searchParams: Promise<{ id?: string | string[] }> }) {
  const id = String((await searchParams).id ?? "");
  const user = await getUser();
  if (!user) redirect(`${href(locale, "account/login")}?next=${encodeURIComponent(`${href(locale, "account/invoice")}?id=${id}`)}`);
  const order = await orderWithBuyer(id);
  if (!order || (order.buyer.userId !== user.id && !user.isAdmin)) notFound();
  return <Invoice order={order} buyer={order.buyer} locale={locale} />;
}

export default async function InvoicePage({ searchParams }: PageProps<"/[lang]/account/invoice">) {
  const locale = await getLocale();
  return (
    <div className="invoice-shell bg-paper py-10">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Suspense fallback={<Loading label="…" />}>
            <View locale={locale} searchParams={searchParams} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
