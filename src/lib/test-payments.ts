import { db } from "@/lib/db";

/** Amount of the admin's gateway test, in Toman. */
export const TEST_PAYMENT_TOMAN = 50_000;

export type TestPaymentStatus = "pending" | "paid" | "failed";

export type TestPayment = {
  id: string;
  amount: number;
  status: TestPaymentStatus;
  refId: string | null;
  cardPan: string | null;
  detail: string | null;
  createdAt: Date;
  name: string | null;
};

export async function createTestPayment(userId: string, amount: number): Promise<string> {
  const { rows } = await (await db()).query<{ id: string }>("insert into test_payments (user_id, amount) values ($1, $2) returning id", [userId, amount]);
  return rows[0].id;
}

export async function setTestAuthority(id: string, authority: string): Promise<void> {
  await (await db()).query("update test_payments set authority = $2 where id = $1", [id, authority]);
}

export async function findTestPayment(authority: string): Promise<{ id: string; amount: number; status: TestPaymentStatus } | null> {
  const { rows } = await (await db()).query<{ id: string; amount: string; status: TestPaymentStatus }>(
    "select id, amount, status from test_payments where authority = $1",
    [authority],
  );
  return rows[0] ? { id: rows[0].id, amount: Number(rows[0].amount), status: rows[0].status } : null;
}

/** Records the outcome once; a later call for the same payment changes nothing. */
export async function finishTestPayment(id: string, result: { ok: boolean; refId?: string; cardPan?: string | null; detail?: string }): Promise<void> {
  await (await db()).query(
    `update test_payments set status = $2, ref_id = $3, card_pan = $4, detail = $5, finished_at = now()
     where id = $1 and status = 'pending'`,
    [id, result.ok ? "paid" : "failed", result.refId ?? null, result.cardPan ?? null, result.detail?.slice(0, 300) ?? null],
  );
}

export async function recentTestPayments(limit = 10): Promise<TestPayment[]> {
  const { rows } = await (await db()).query<{
    id: string;
    amount: string;
    status: TestPaymentStatus;
    ref_id: string | null;
    card_pan: string | null;
    detail: string | null;
    created_at: Date;
    name: string | null;
  }>(
    `select t.id, t.amount, t.status, t.ref_id, t.card_pan, t.detail, t.created_at, u.name
     from test_payments t left join users u on u.id = t.user_id order by t.created_at desc limit $1`,
    [limit],
  );
  return rows.map((r) => ({
    id: r.id,
    amount: Number(r.amount),
    status: r.status,
    refId: r.ref_id,
    cardPan: r.card_pan,
    detail: r.detail,
    createdAt: r.created_at,
    name: r.name,
  }));
}
