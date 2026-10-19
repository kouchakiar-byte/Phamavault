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
create table if not exists page_views (
  id bigserial primary key,
  at timestamptz not null default now(),
  path text not null,
  visitor text not null,
  ref text,
  device text not null
);
create index if not exists page_views_at_idx on page_views(at);
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
