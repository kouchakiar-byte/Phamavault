/**
 * Zarinpal payment gateway (REST API v4).
 *
 * ZARINPAL_MERCHANT_ID  merchant code from the Zarinpal panel; without it,
 *                       checkout records the order for offline payment.
 * ZARINPAL_SANDBOX=1    use Zarinpal's test gateway (no real money moves).
 * ZARINPAL_API_URL      overrides the gateway address, for local testing.
 */
const merchantId = () => process.env.ZARINPAL_MERCHANT_ID?.trim() ?? "";
const sandbox = () => process.env.ZARINPAL_SANDBOX === "1";
const baseUrl = () =>
  (process.env.ZARINPAL_API_URL ?? (sandbox() ? "https://sandbox.zarinpal.com" : "https://payment.zarinpal.com")).replace(/\/$/, "");

export const onlinePaymentEnabled = (): boolean => merchantId() !== "";

type ZarinpalResponse = {
  data?: { code?: number; authority?: string; ref_id?: number | string; card_pan?: string } | unknown[];
  errors?: { code?: number; message?: string } | unknown[];
};

async function call(path: string, body: Record<string, unknown>): Promise<ZarinpalResponse> {
  const response = await fetch(`${baseUrl()}/pg/v4/payment/${path}.json`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ merchant_id: merchantId(), ...body }),
    signal: AbortSignal.timeout(20_000),
  });
  return (await response.json().catch(() => ({}))) as ZarinpalResponse;
}

const dataOf = (r: ZarinpalResponse) => (r.data && !Array.isArray(r.data) ? r.data : {});
const errorOf = (r: ZarinpalResponse) => (r.errors && !Array.isArray(r.errors) ? r.errors : {});

/** Opens a payment and returns the gateway page the buyer is sent to. Amounts are in Toman. */
export async function requestPayment(input: {
  amount: number;
  description: string;
  callbackUrl: string;
  mobile: string;
  orderId: string;
}): Promise<{ authority: string; payUrl: string }> {
  const result = await call("request", {
    amount: input.amount * 10, // the gateway works in Rial
    description: input.description,
    callback_url: input.callbackUrl,
    metadata: { mobile: input.mobile, order_id: input.orderId },
  });
  const data = dataOf(result);
  if (data.code !== 100 || !data.authority) {
    const error = errorOf(result);
    throw new Error(`Zarinpal request failed: ${error.code ?? data.code ?? "?"} ${error.message ?? ""}`.trim());
  }
  return { authority: data.authority, payUrl: `${baseUrl()}/pg/StartPay/${data.authority}` };
}

/** Confirms a payment after the buyer returns. Code 101 means it was already confirmed. */
export async function verifyPayment(input: {
  amount: number;
  authority: string;
}): Promise<{ ok: true; refId: string; cardPan: string | null } | { ok: false; code: number | null }> {
  const result = await call("verify", { amount: input.amount * 10, authority: input.authority });
  const data = dataOf(result);
  if (data.code === 100 || data.code === 101) {
    return { ok: true, refId: String(data.ref_id ?? ""), cardPan: data.card_pan ?? null };
  }
  return { ok: false, code: errorOf(result).code ?? data.code ?? null };
}
