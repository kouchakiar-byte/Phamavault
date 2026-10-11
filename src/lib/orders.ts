import { db } from "./db";
import type { PlanId, Purchase } from "./pricing";

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";
export type OrderMethod = "online" | "invoice" | "manual";

export type Order = {
  id: string;
  plan: PlanId;
  sections: string[];
  seats: number;
  months: number;
  amount: number;
  method: OrderMethod;
  status: OrderStatus;
  refId: string | null;
  createdAt: Date;
  paidAt: Date | null;
  renews: string | null;
};

type Row = {
  id: string;
  plan: PlanId;
  sections: string[];
  seats: number;
  months: number;
  amount: string;
  method: OrderMethod;
  status: OrderStatus;
  ref_id: string | null;
  created_at: Date;
  paid_at: Date | null;
  renews: string | null;
};

const toOrder = (r: Row): Order => ({
  id: r.id,
  plan: r.plan,
  sections: r.sections,
  seats: r.seats,
  months: r.months,
  amount: Number(r.amount),
  method: r.method,
  status: r.status,
  refId: r.ref_id,
  createdAt: r.created_at,
  paidAt: r.paid_at,
  renews: r.renews,
});

export async function createOrder(input: {
  userId: string;
  purchase: Purchase;
  amount: number;
  method: OrderMethod;
  locale: string;
  renews: string | null;
}): Promise<string> {
  const { purchase: p } = input;
  const { rows } = await (await db()).query<{ id: string }>(
    `insert into orders (user_id, plan, sections, seats, months, amount, method, locale, renews)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id`,
    [input.userId, p.plan, p.sections, p.seats, p.months, input.amount, input.method, input.locale, input.renews],
  );
  return rows[0].id;
}

export async function setAuthority(orderId: string, authority: string): Promise<void> {
  await (await db()).query("update orders set authority = $2 where id = $1", [orderId, authority]);
}

export async function setStatus(orderId: string, status: OrderStatus): Promise<void> {
  await (await db()).query("update orders set status = $2 where id = $1 and status = 'pending'", [orderId, status]);
}

export async function ordersFor(userId: string): Promise<Order[]> {
  const { rows } = await (await db()).query<Row>("select * from orders where user_id = $1 order by created_at desc limit 50", [
    userId,
  ]);
  return rows.map(toOrder);
}

/** Latest orders with the buyer, for the admin page. */
export async function recentOrders(limit = 100): Promise<(Order & { mobile: string; name: string })[]> {
  const { rows } = await (await db()).query<Row & { mobile: string; name: string }>(
    `select o.*, u.mobile, u.name from orders o join users u on u.id = o.user_id
     order by o.created_at desc limit $1`,
    [limit],
  );
  return rows.map((r) => ({ ...toOrder(r), mobile: r.mobile, name: r.name }));
}

export async function stats(): Promise<{ users: number; active: number; revenue30: number; pending: number }> {
  const { rows } = await (await db()).query<{ users: number; active: number; revenue30: string; pending: number }>(
    `select
       (select count(*)::int from users) as users,
       (select count(*)::int from subscriptions where not revoked and starts_at <= now() and ends_at > now()) as active,
       (select coalesce(sum(amount), 0) from orders where status = 'paid' and paid_at > now() - interval '30 days') as revenue30,
       (select count(*)::int from orders where status = 'pending' and method = 'invoice') as pending`,
  );
  return { ...rows[0], revenue30: Number(rows[0].revenue30) };
}
