import type { PoolClient } from "pg";
import { db, transaction } from "./db";
import { isPaidSection, type PaidSection, type PlanId } from "./pricing";

/** The paywall is off until PAYWALL=on, so the site stays open while payments are being set up. */
export const paywallEnabled = (): boolean => process.env.PAYWALL === "on";

export type Subscription = {
  id: string;
  ownerId: string;
  plan: PlanId;
  sections: PaidSection[];
  seats: number;
  startsAt: Date;
  endsAt: Date;
  revoked: boolean;
  members: string[];
};

type SubscriptionRow = {
  id: string;
  owner_id: string;
  plan: PlanId;
  sections: string[];
  seats: number;
  starts_at: Date;
  ends_at: Date;
  revoked: boolean;
  members: string[] | null;
};

export type SubscriptionStatus = "active" | "upcoming" | "expired" | "revoked";

export function subscriptionStatus(s: Pick<Subscription, "revoked" | "startsAt" | "endsAt">): SubscriptionStatus {
  if (s.revoked) return "revoked";
  if (s.endsAt.getTime() <= Date.now()) return "expired";
  if (s.startsAt.getTime() > Date.now()) return "upcoming";
  return "active";
}

const toSubscription = (r: SubscriptionRow): Subscription => ({
  id: r.id,
  ownerId: r.owner_id,
  plan: r.plan,
  sections: r.sections.filter(isPaidSection),
  seats: r.seats,
  startsAt: r.starts_at,
  endsAt: r.ends_at,
  revoked: r.revoked,
  members: r.members ?? [],
});

const SELECT_SUBSCRIPTION = `
  select s.*, (select array_agg(m.mobile order by m.mobile) from subscription_members m where m.subscription_id = s.id) as members
  from subscriptions s`;

/** Sections the mobile can open right now, through any active subscription it is a member of. */
export async function sectionsFor(mobile: string): Promise<Set<PaidSection>> {
  const { rows } = await (await db()).query<{ section: string }>(
    `select distinct unnest(s.sections) as section
     from subscriptions s join subscription_members m on m.subscription_id = s.id
     where m.mobile = $1 and not s.revoked and s.starts_at <= now() and s.ends_at > now()`,
    [mobile],
  );
  return new Set(rows.map((r) => r.section).filter(isPaidSection));
}

/** Subscriptions the user owns or is a member of, newest first. */
export async function subscriptionsFor(userId: string, mobile: string): Promise<Subscription[]> {
  const { rows } = await (await db()).query<SubscriptionRow>(
    `${SELECT_SUBSCRIPTION}
     where s.owner_id = $1 or exists (select 1 from subscription_members m where m.subscription_id = s.id and m.mobile = $2)
     order by s.ends_at desc`,
    [userId, mobile],
  );
  return rows.map(toSubscription);
}

export async function getSubscription(id: string): Promise<Subscription | null> {
  if (!/^\d+$/.test(id)) return null;
  const { rows } = await (await db()).query<SubscriptionRow>(`${SELECT_SUBSCRIPTION} where s.id = $1`, [id]);
  return rows[0] ? toSubscription(rows[0]) : null;
}

/** Latest subscriptions for the admin page. */
export async function recentSubscriptions(limit = 100): Promise<(Subscription & { ownerMobile: string; ownerName: string })[]> {
  const { rows } = await (await db()).query<SubscriptionRow & { owner_mobile: string; owner_name: string }>(
    `select x.*, u.mobile as owner_mobile, u.name as owner_name
     from (${SELECT_SUBSCRIPTION}) x join users u on u.id = x.owner_id
     order by x.created_at desc limit $1`,
    [limit],
  );
  return rows.map((r) => ({ ...toSubscription(r), ownerMobile: r.owner_mobile, ownerName: r.owner_name }));
}

type NewSubscription = { ownerId: string; plan: PlanId; sections: PaidSection[]; seats: number; months: number };

/**
 * Adds the months to a matching subscription (the one being renewed, or an
 * active individual one with the same sections), or starts a new one.
 * Returns the subscription id.
 */
async function grant(client: PoolClient, input: NewSubscription & { renews?: string | null }): Promise<string> {
  const sections = [...input.sections].sort();
  const { rows: existing } = input.renews
    ? await client.query<{ id: string }>(
        "select id from subscriptions where id = $1 and owner_id = $2 and not revoked for update",
        [input.renews, input.ownerId],
      )
    : input.plan === "individual"
      ? await client.query<{ id: string }>(
          `select id from subscriptions
           where owner_id = $1 and plan = 'individual' and not revoked and ends_at > now() and sections = $2::text[]
           order by ends_at desc limit 1 for update`,
          [input.ownerId, sections],
        )
      : { rows: [] };
  if (existing[0]) {
    await client.query(
      `update subscriptions set ends_at = greatest(ends_at, now()) + make_interval(months => $2),
         seats = greatest(seats, $3) where id = $1`,
      [existing[0].id, input.months, input.seats],
    );
    return existing[0].id;
  }
  const { rows } = await client.query<{ id: string }>(
    `insert into subscriptions (owner_id, plan, sections, seats, starts_at, ends_at)
     values ($1, $2, $3, $4, now(), now() + make_interval(months => $5)) returning id`,
    [input.ownerId, input.plan, sections, input.seats, input.months],
  );
  // The buyer is the first member; a team owner can replace themselves later.
  await client.query(
    "insert into subscription_members (subscription_id, mobile) select $1, mobile from users where id = $2 on conflict do nothing",
    [rows[0].id, input.ownerId],
  );
  return rows[0].id;
}

type OrderRow = {
  id: string;
  user_id: string;
  plan: PlanId;
  sections: string[];
  seats: number;
  months: number;
  amount: string;
  status: string;
  renews: string | null;
  locale: string;
};

/**
 * Marks a pending order paid and grants its subscription, once: a second call
 * for the same order changes nothing. Returns the order, or null if missing.
 */
export async function activateOrder(
  orderId: string,
  payment: { refId?: string | null; cardPan?: string | null; note?: string | null } = {},
): Promise<OrderRow | null> {
  return transaction(async (client) => {
    const { rows } = await client.query<OrderRow>("select * from orders where id = $1 for update", [orderId]);
    const order = rows[0];
    if (!order || order.status === "paid") return order ?? null;
    const subscriptionId = await grant(client, {
      ownerId: order.user_id,
      plan: order.plan,
      sections: order.sections.filter(isPaidSection),
      seats: order.seats,
      months: order.months,
      renews: order.renews,
    });
    await client.query(
      `update orders set status = 'paid', paid_at = now(), subscription_id = $2,
         ref_id = coalesce($3, ref_id), card_pan = coalesce($4, card_pan), note = coalesce($5, note)
       where id = $1`,
      [orderId, subscriptionId, payment.refId ?? null, payment.cardPan ?? null, payment.note ?? null],
    );
    return { ...order, status: "paid" };
  });
}

export async function findOrderByAuthority(authority: string): Promise<OrderRow | null> {
  const { rows } = await (await db()).query<OrderRow>("select * from orders where authority = $1", [authority]);
  return rows[0] ?? null;
}

/** Team owners choose who uses their seats. */
export async function addMember(subscriptionId: string, ownerId: string, mobile: string): Promise<"ok" | "full" | "denied"> {
  return transaction(async (client) => {
    const { rows } = await client.query<{ seats: number; used: number }>(
      `select s.seats, (select count(*)::int from subscription_members m where m.subscription_id = s.id) as used
       from subscriptions s where s.id = $1 and s.owner_id = $2 and s.plan = 'team' for update`,
      [subscriptionId, ownerId],
    );
    if (!rows[0]) return "denied";
    if (rows[0].used >= rows[0].seats) return "full";
    await client.query("insert into subscription_members (subscription_id, mobile) values ($1, $2) on conflict do nothing", [
      subscriptionId,
      mobile,
    ]);
    return "ok";
  });
}

export async function removeMember(subscriptionId: string, ownerId: string, mobile: string): Promise<void> {
  await (await db()).query(
    `delete from subscription_members m using subscriptions s
     where m.subscription_id = s.id and s.id = $1 and s.owner_id = $2 and s.plan = 'team' and m.mobile = $3`,
    [subscriptionId, ownerId, mobile],
  );
}

/** Admin: a subscription without an online payment (bank transfer, invoice, gift). */
export async function grantManually(input: NewSubscription & { amount: number; note: string }): Promise<string> {
  const { rows } = await (await db()).query<{ id: string }>(
    `insert into orders (user_id, plan, sections, seats, months, amount, method, note)
     values ($1, $2, $3, $4, $5, $6, 'manual', $7) returning id`,
    [input.ownerId, input.plan, input.sections, input.seats, input.months, input.amount, input.note],
  );
  await activateOrder(rows[0].id);
  return rows[0].id;
}

/** Admin: change the end date by a number of days (negative shortens it). */
export async function extendSubscription(id: string, days: number): Promise<void> {
  await (await db()).query("update subscriptions set ends_at = ends_at + make_interval(days => $2) where id = $1", [id, days]);
}

export async function setRevoked(id: string, revoked: boolean): Promise<void> {
  await (await db()).query("update subscriptions set revoked = $2 where id = $1", [id, revoked]);
}

export async function setSeats(id: string, seats: number): Promise<void> {
  await (await db()).query("update subscriptions set seats = $2 where id = $1 and plan = 'team'", [id, seats]);
}
