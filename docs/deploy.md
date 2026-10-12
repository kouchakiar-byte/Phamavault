# Deploying on Liara

Every merge into `main` starts a deployment of the app on Liara. The build
location is set in `liara.json` (`build.location`: `iran` or `germany`); it is
`iran` since Liara's German build servers stalled in October 2026, with the npm
mirror on so packages install from inside Iran. The running version stays online until the new one is
ready, so a failed or stuck deployment never takes the site down.

## If a deployment stalls

- **"Pulling the base images…" for more than ~10 minutes, or "Pending"
  (معلق) for more than ~15 minutes:** the problem is on Liara's build
  servers, not in the code. Cancel the deployment (لغو), wait a while, and
  deploy again — by merging the next pull request, or with Liara's redeploy.
  If it repeats, switch `build.location` in `liara.json` to the other location
  and open a ticket with Liara support naming the stuck version.
- **Build errors in the log:** these come from the code. Liara does not apply
  `next.config.ts`, so never use `"use cache"`; check a change with a
  temporary `next.config.js` containing
  `module.exports = { output: "standalone" };` before merging.

## Environment variables (set in Liara, never in the repository)

`DATABASE_URL`, `ADMIN_MOBILES`, `SITE_URL`; later `ZARINPAL_MERCHANT_ID` and
`PAYWALL=on`. Optional: `CRON_SECRET`, `CATALOG_SCHEDULER=off`.
