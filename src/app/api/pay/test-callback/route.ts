import type { NextRequest } from "next/server";
import { finishTestPayment, findTestPayment } from "@/lib/test-payments";
import { verifyPayment } from "@/lib/zarinpal";

const back = (result: "paid" | "failed") =>
  new Response(null, { status: 303, headers: { Location: `/fa/admin?test=${result}#test-payment` } });

/**
 * Return address of the admin's gateway test. It verifies the payment with
 * Zarinpal exactly as a real order would, and records the result; it grants nothing.
 */
export async function GET(request: NextRequest) {
  const authority = request.nextUrl.searchParams.get("Authority") ?? "";
  const status = request.nextUrl.searchParams.get("Status");
  const payment = authority ? await findTestPayment(authority) : null;
  if (!payment) return back("failed");
  if (payment.status === "paid") return back("paid");
  if (payment.status !== "pending") return back("failed");
  if (status !== "OK") {
    await finishTestPayment(payment.id, { ok: false, detail: "cancelled" });
    return back("failed");
  }
  const result = await verifyPayment({ amount: payment.amount, authority });
  if (!result.ok) {
    await finishTestPayment(payment.id, { ok: false, detail: `verify ${result.code ?? "?"}` });
    return back("failed");
  }
  await finishTestPayment(payment.id, { ok: true, refId: result.refId, cardPan: result.cardPan });
  return back("paid");
}
