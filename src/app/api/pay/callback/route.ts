import type { NextRequest } from "next/server";
import { setStatus } from "@/lib/orders";
import { activateOrder, findOrderByAuthority } from "@/lib/subscriptions";
import { verifyPayment } from "@/lib/zarinpal";

/** Relative redirect, so it works behind Liara's proxy whatever host the app sees. */
const back = (path: string) => new Response(null, { status: 303, headers: { Location: path } });

/**
 * Zarinpal sends the buyer here after payment with ?Authority=…&Status=OK|NOK.
 * The payment is verified with the gateway before the subscription is granted.
 */
export async function GET(request: NextRequest) {
  const authority = request.nextUrl.searchParams.get("Authority") ?? "";
  const status = request.nextUrl.searchParams.get("Status");
  const order = authority ? await findOrderByAuthority(authority) : null;
  if (!order) return back("/fa/account?order=failed");

  const account = `/${order.locale === "en" ? "en" : "fa"}/account`;
  if (order.status === "paid") return back(`${account}?order=paid`);
  if (status !== "OK" || order.status !== "pending") {
    await setStatus(order.id, "failed");
    return back(`${account}?order=failed`);
  }

  const result = await verifyPayment({ amount: Number(order.amount), authority });
  if (!result.ok) {
    console.error(`Zarinpal verify failed for order ${order.id}: ${result.code}`);
    await setStatus(order.id, "failed");
    return back(`${account}?order=failed`);
  }
  await activateOrder(order.id, { refId: result.refId, cardPan: result.cardPan });
  return back(`${account}?order=paid&ref=${encodeURIComponent(result.refId)}`);
}
