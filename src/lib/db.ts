import { Pool, type PoolClient } from "pg";

/**
 * Tables for accounts, sessions, orders, subscriptions and catalog updates. Created on first
 * use, so a fresh PostgreSQL database needs no manual migration.
 * Amounts are in Toman; mobiles are stored as 09xxxxxxxxx.
 */
const SCHEMA = `
create table if not exists users (
  id bigserial primary key,
  mobile text not null unique,
  name text not null,
  password_hash text not null,
  failed_logins int not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists sessions (
  token_hash text primary key,
  user_id bigint not null references users(id) on delete cascade,
  ip text,
  user_agent text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists sessions_user_idx on sessions(user_id);
-- Sign-up details: email (for password recovery), account kind and the company or pharmacy name.
alter table users add column if not exists email text;
alter table users add column if not exists kind text not null default 'individual';
alter table users add column if not exists org text;
-- An admin can block an account: it can no longer sign in and its sessions end.
alter table users add column if not exists blocked boolean not null default false;
alter table users add column if not exists ref_code text unique;
alter table users add column if not exists referred_by bigint references users(id) on delete set null;
create table if not exists password_resets (
  token_hash text primary key,
  user_id bigint not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);
-- Handbook PDF downloads: one row per download (repeats from the same address within 10 minutes are not counted).
create table if not exists handbook_downloads (
  id bigserial primary key,
  slug text not null,
  ip_hash text not null,
  user_id bigint references users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists handbook_downloads_slug_idx on handbook_downloads(slug, created_at desc);
-- What happened to each password-recovery request and test email, so the admin can see why a mail did not arrive.
create table if not exists mail_log (
  id bigserial primary key,
  kind text not null,
  recipient text,
  user_id bigint references users(id) on delete set null,
  ok boolean not null,
  detail text,
  created_at timestamptz not null default now()
);
create index if not exists mail_log_created_idx on mail_log(created_at desc);
create table if not exists subscriptions (
  id bigserial primary key,
  owner_id bigint not null references users(id),
  plan text not null,
  sections text[] not null,
  seats int not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists subscriptions_owner_idx on subscriptions(owner_id);
create table if not exists subscription_members (
  subscription_id bigint not null references subscriptions(id) on delete cascade,
  mobile text not null,
  primary key (subscription_id, mobile)
);
create index if not exists subscription_members_mobile_idx on subscription_members(mobile);
create table if not exists orders (
  id bigserial primary key,
  user_id bigint not null references users(id),
  plan text not null,
  sections text[] not null,
  seats int not null,
  months int not null,
  amount bigint not null,
  method text not null,
  status text not null default 'pending',
  locale text not null default 'fa',
  renews bigint references subscriptions(id),
  authority text unique,
  ref_id text,
  card_pan text,
  subscription_id bigint references subscriptions(id),
  note text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists orders_user_idx on orders(user_id);
-- Free reading days of signed-in readers without the section: 2 Tehran days per Jalali month.
create table if not exists trial_days (
  user_id bigint not null references users(id) on delete cascade,
  day text not null,
  month text not null,
  ip_hash text,
  created_at timestamptz not null default now(),
  primary key (user_id, day)
);
create index if not exists trial_days_month_idx on trial_days(month, user_id);
-- SOPs a subscriber copied: 10 per Jalali month in each bucket (qa, qc); copying the same SOP again in the month is free.
create table if not exists sop_copies (
  user_id bigint not null references users(id) on delete cascade,
  month text not null,
  bucket text not null,
  code text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, month, code)
);
-- Admin-only gateway tests: a small real payment that checks request, return and verify, and grants nothing.
create table if not exists test_payments (
  id bigserial primary key,
  user_id bigint references users(id) on delete set null,
  amount bigint not null,
  status text not null default 'pending',
  authority text unique,
  ref_id text,
  card_pan text,
  detail text,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);
create table if not exists catalog_entries (
  kind text not null,
  key text not null,
  data jsonb,
  hidden boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (kind, key)
);
create table if not exists catalog_pending (
  id bigserial primary key,
  kind text not null,
  key text not null,
  data jsonb,
  hide boolean not null default false,
  created_by bigint references users(id),
  created_at timestamptz not null default now(),
  published_at timestamptz
);
create table if not exists catalog_runs (
  day text primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  published int not null default 0,
  checked int not null default 0,
  unreachable int not null default 0
);
create table if not exists iran_drug_cache (
  term text primary key,
  result jsonb not null,
  fetched_at timestamptz not null default now(),
  asked int not null default 0
);
create table if not exists iran_drug_products (
  product_code text primary key,
  search text not null,
  data jsonb not null,
  seen_at timestamptz not null default now()
);
create table if not exists page_views (
  id bigserial primary key,
  at timestamptz not null default now(),
  path text not null,
  visitor text not null,
  ref text,
  device text not null
);
create index if not exists page_views_at_idx on page_views(at);
-- A stable one-way hash of the visitor's IP, to count distinct IPs over any period (no IP kept).
alter table page_views add column if not exists ip text;
create table if not exists supplier_links (
  url text primary key,
  fails int not null default 0,
  checked_at timestamptz not null default now()
);
create table if not exists service_requests (
  id bigserial primary key,
  kind text not null,
  name text not null,
  company text,
  phone text not null,
  email text,
  product text,
  message text,
  locale text not null default 'fa',
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists service_requests_created_idx on service_requests(created_at);
create table if not exists supplier_alerts (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  query text not null,
  query_key text not null,
  email text,
  locale text not null default 'fa',
  created_at timestamptz not null default now(),
  found_at timestamptz,
  found int not null default 0,
  mailed_at timestamptz,
  unique (user_id, query_key)
);
create index if not exists supplier_alerts_open_idx on supplier_alerts(found_at) where found_at is null;
-- Referral rewards: 7 days for the referrer when someone they invited makes a first paid order; 3 a Jalali month.
create table if not exists referral_rewards (
  id bigserial primary key,
  referrer_id bigint not null references users(id) on delete cascade,
  referee_id bigint not null unique references users(id) on delete cascade,
  order_id bigint references orders(id) on delete set null,
  subscription_id bigint references subscriptions(id) on delete set null,
  month text not null,
  days int not null,
  status text not null,
  created_at timestamptz not null default now()
);
create index if not exists referral_rewards_referrer_idx on referral_rewards(referrer_id, month);
`;

const g = globalThis as unknown as { pvPool?: Pool; pvSchema?: Promise<unknown> };

export const databaseConfigured = (): boolean => Boolean(process.env.DATABASE_URL);

/** The shared connection pool, with the schema in place. */
export async function db(): Promise<Pool> {
  if (!g.pvPool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    g.pvPool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  }
  g.pvSchema ??= g.pvPool.query(SCHEMA).catch((error) => {
    g.pvSchema = undefined;
    throw error;
  });
  await g.pvSchema;
  return g.pvPool;
}

/** Runs `fn` in a transaction, rolling back if it throws. */
export async function transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await (await db()).connect();
  try {
    await client.query("begin");
    const result = await fn(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
