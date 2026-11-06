import { randomBytes } from "node:crypto";
import { db, transaction } from "./db";
import { jalaliMonth } from "./metering";
import { coreSections } from "./pricing";
import { REF_CODE } from "./ref-cookie";

/** Days added to the referrer's subscription for each invited reader's first paid order. */
export const REWARD_DAYS = 7;
/** Rewards per referrer in a Jalali month; later ones are recorded as "capped". */
export const REWARDS_PER_MONTH = 3;

const newCode = () => {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789"; // no 0/o, 1/l/i
  return [...randomBytes(8)].map((b) => alphabet[b % alphabet.length]).join("");
};

/** The reader's own referral code, made on first use. */
export async function refCodeFor(userId: string): Promise<string> {
  const pool = await db();
  const { rows } = await pool.query<{ ref_code: string | null }>("select ref_code from users where id = $1", [userId]);
  if (rows[0]?.ref_code) return rows[0].ref_code;
  for (let i = 0; i < 5; i++) {
    const code = newCode();
    const r = await pool.query<{ ref_code: string }>(
      "update users set ref_code = $2 where id = $1 and ref_code is null and not exists (select 1 from users where ref_code = $2) returning ref_code",
      [userId, code],
    );
    if (r.rows[0]) return r.rows[0].ref_code;
    const again = await pool.query<{ ref_code: string | null }>("select ref_code from users where id = $1", [userId]);
    if (again.rows[0]?.ref_code) return again.rows[0].ref_code;
  }
  throw new Error("could not make a referral code");
}

/** The account a code belongs to, if any. */
export async function referrerByCode(code: string | undefined | null): Promise<string | null> {
  const c = code?.toLowerCase() ?? "";
  if (!REF_CODE.test(c)) return null;
  const { rows } = await (await db()).query<{ id: string }>("select id from users where ref_code = $1 and not blocked", [c]);
  return rows[0]?.id ?? null;
}

/**
 * After an order is paid for the first time: if its buyer was invited and this is their first
 * paid order, the referrer gets REWARD_DAYS days (up to REWARDS_PER_MONTH a month), added to
 * their own latest active subscription, or as a new individual subscription when they have none.
 */
export async function rewardReferral(orderId: string): Promise<void> {
  await transaction(async (client) => {
    const { rows } = await client.query<{ user_id: string; amount: string; referred_by: string | null }>(
      "select o.user_id, o.amount, u.referred_by from orders o join users u on u.id = o.user_id where o.id = $1 and o.status = 'paid'",
      [orderId],
    );
    const order = rows[0];
    if (!order?.referred_by || Number(order.amount) <= 0) return;
    const referrer = order.referred_by;
    await client.query("select pg_advisory_xact_lock(hashtext('ref:' || $1))", [referrer]);
    const done = await client.query("select 1 from referral_rewards where referee_id = $1", [order.user_id]);
    if (done.rows.length) return; // only the first paid order counts
    const month = jalaliMonth();
    const { rows: counted } = await client.query<{ n: number }>(
      "select count(*)::int as n from referral_rewards where referrer_id = $1 and month = $2 and status = 'granted'",
      [referrer, month],
    );
    if ((counted[0]?.n ?? 0) >= REWARDS_PER_MONTH) {
      await client.query(
        "insert into referral_rewards (referrer_id, referee_id, order_id, month, days, status) values ($1, $2, $3, $4, 0, 'capped')",
        [referrer, order.user_id, orderId, month],
      );
      return;
    }
    const { rows: subs } = await client.query<{ id: string }>(
      "select id from subscriptions where owner_id = $1 and not revoked and ends_at > now() order by ends_at desc limit 1 for update",
      [referrer],
    );
    let subscriptionId = subs[0]?.id;
    if (subscriptionId) {
      await client.query("update subscriptions set ends_at = ends_at + make_interval(days => $2) where id = $1", [subscriptionId, REWARD_DAYS]);
    } else {
      const { rows: created } = await client.query<{ id: string }>(
        `insert into subscriptions (owner_id, plan, sections, seats, starts_at, ends_at)
         values ($1, 'individual', $2, 1, now(), now() + make_interval(days => $3)) returning id`,
        [referrer, [...coreSections].sort(), REWARD_DAYS],
      );
      subscriptionId = created[0].id;
      await client.query(
        "insert into subscription_members (subscription_id, mobile) select $1, mobile from users where id = $2 on conflict do nothing",
        [subscriptionId, referrer],
      );
    }
    await client.query(
      "insert into referral_rewards (referrer_id, referee_id, order_id, subscription_id, month, days, status) values ($1, $2, $3, $4, $5, $6, 'granted')",
      [referrer, order.user_id, orderId, subscriptionId, month, REWARD_DAYS],
    );
  });
}

export type ReferralStats = { code: string; invited: number; paid: number; thisMonth: number; days: number };

export async function referralStats(userId: string): Promise<ReferralStats> {
  const code = await refCodeFor(userId);
  const { rows } = await (await db()).query<{ invited: number; paid: number; month: number; days: number }>(
    `select (select count(*)::int from users where referred_by = $1) as invited,
            (select count(*)::int from referral_rewards where referrer_id = $1) as paid,
            (select count(*)::int from referral_rewards where referrer_id = $1 and month = $2 and status = 'granted') as month,
            (select coalesce(sum(days), 0)::int from referral_rewards where referrer_id = $1) as days`,
    [userId, jalaliMonth()],
  );
  const r = rows[0];
  return { code, invited: r?.invited ?? 0, paid: r?.paid ?? 0, thisMonth: r?.month ?? 0, days: r?.days ?? 0 };
}

export type RewardRow = { id: string; referrer: string; referrerMobile: string; referee: string; days: number; status: string; createdAt: Date };

export async function recentRewards(limit = 30): Promise<RewardRow[]> {
  const { rows } = await (await db()).query<{ id: string; referrer: string; referrer_mobile: string; referee: string; days: number; status: string; created_at: Date }>(
    `select r.id, a.name as referrer, a.mobile as referrer_mobile, b.name as referee, r.days, r.status, r.created_at
     from referral_rewards r join users a on a.id = r.referrer_id join users b on b.id = r.referee_id
     order by r.created_at desc limit $1`,
    [limit],
  );
  return rows.map((r) => ({ id: r.id, referrer: r.referrer, referrerMobile: r.referrer_mobile, referee: r.referee, days: r.days, status: r.status, createdAt: r.created_at }));
}
