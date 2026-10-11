# Accounts, payments and subscriptions

How sign-up, checkout, the Zarinpal gateway, subscription periods and the
section paywall fit together, and which settings switch each part on.

## Flow

1. **Sign up / sign in** (`/fa/account/register`, `/fa/account/login`) with a
   mobile number and password. Passwords are hashed with scrypt; five wrong
   attempts lock the account for 15 minutes.
2. **One device at a time.** Signing in removes the account's other sessions,
   so a licence can't be shared between devices (the practical form of "one
   user on one IP": mobile and office IPs change, so IP itself is only logged).
3. **Checkout** (`/fa/account/buy`): Individual (any of the 9 sections; all 9 at
   the full-access price) or Team (6+ users), for 1, 3, 6 or 12 months. The
   price is recomputed on the server from `copy.plans.pricing`.
4. **Payment**
   - *Online*: the order is sent to Zarinpal, the buyer pays on the bank page
     and returns to `/api/pay/callback`, where the payment is **verified with
     Zarinpal** before anything is granted. Replaying the callback grants nothing twice.
   - *Invoice*: the order stays "awaiting payment"; after a bank transfer the
     admin presses "Confirm payment & activate".
5. **Subscription**: starts at payment and ends after the chosen months.
   Renewing (button in the account page) adds the months to the current end
   date. Buying the same individual sections again also extends.
6. **Team users**: the team owner adds the mobiles of their colleagues (up to
   the number of seats); each signs up with that mobile and gets full access.
7. **Paywall**: with `PAYWALL=on`, the 9 sections (and SOP pages) show a
   subscribe card to anyone without access. Admins see everything.

## Settings (Liara → app → Settings → Environment variables)

| Variable | Example | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://user:pass@host:port/db` | PostgreSQL connection. Tables are created automatically. Required for accounts. |
| `ADMIN_MOBILES` | `09121234567` | Mobiles (comma separated) that can open `/fa/admin`. |
| `SITE_URL` | `https://pharmavault.ir` | Address Zarinpal returns the buyer to. |
| `ZARINPAL_MERCHANT_ID` | 36-character code | Turns on online payment. Without it, checkout records invoice orders only. |
| `ZARINPAL_SANDBOX` | `1` | Test gateway (no real money). **Remove before going live.** |
| `PAYWALL` | `on` | Locks the sections for non-subscribers. Leave unset until payment works. |

Order of switching on: database + admin → test a purchase as invoice and
activate it from the admin page → merchant ID → `PAYWALL=on`.

## Code

- `src/lib/db.ts` — pool and schema; `auth.ts` — passwords and sessions;
  `pricing.ts` — prices; `orders.ts`, `subscriptions.ts` — orders, granting,
  access; `zarinpal.ts` — gateway API v4 (amounts are sent in Rial).
- `src/app/[lang]/account/*` — sign-in, sign-up, checkout, dashboard; `actions.ts`.
- `src/app/[lang]/admin` — admin page and actions (each re-checks the admin).
- `src/app/api/pay/callback/route.ts` — gateway return.
- `src/components/section-gate.tsx` — paywall, used by each section's `layout.tsx`.
