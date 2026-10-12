# Deploying on Liara

Every merge into `main` starts a deployment of the app on Liara (build
location: Germany). The running version stays online until the new one is
ready, so a failed or stuck deployment never takes the site down.

## If a deployment stalls

- **"Pulling the base images…" for more than ~10 minutes, or "Pending"
  (معلق) for more than ~15 minutes:** the problem is on Liara's build
  servers, not in the code. Cancel the deployment (لغو), wait a while, and
  deploy again — by merging the next pull request, or with Liara's redeploy.
  If it repeats, open a ticket with Liara support and name the stuck version.
- **Build errors in the log:** these come from the code. Liara does not apply
  `next.config.ts`, so never use `"use cache"`; check a change with a
  temporary `next.config.js` containing
  `module.exports = { output: "standalone" };` before merging.

## Environment variables (set in Liara, never in the repository)

`DATABASE_URL`, `ADMIN_MOBILES`, `SITE_URL`; later `ZARINPAL_MERCHANT_ID` and
`PAYWALL=on`. Optional: `CRON_SECRET`, `CATALOG_SCHEDULER=off`.
