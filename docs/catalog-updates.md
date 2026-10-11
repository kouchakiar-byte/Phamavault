# Daily catalog update (suppliers and raw materials)

The supplier bank and the raw-material database are updated once a day at
**18:00 Tehran time**, and the pages show "Last updated: <date>, 18:00".

## How it works

- **Base data** stays in `src/data/suppliers.json` and `src/data/raw-materials.json`.
- **Edits** are made at `/fa/admin/catalog` (admins only):
  - add a supplier or raw material, edit one, or remove one from the site;
  - each edit waits in a queue (`catalog_pending`).
- **At 18:00** `src/lib/scheduler.ts`, started by `src/instrumentation.ts`, calls
  `/api/cron/catalog`. That runs `runDailyUpdate()` in `src/lib/daily-update.ts`, which:
  1. publishes the queued edits into `catalog_entries`, layered over the base data;
  2. checks every supplier website — one that fails 3 daily checks in a row is
     marked "not reachable" in the bank, and a later success clears it;
  3. records the run in `catalog_runs` (one per Tehran day), which drives the
     "last updated" stamp;
  4. refreshes the cached pages (`getCatalog()`, tag `catalog`).
- If the server was down at 18:00, the update runs as soon as it is back the same evening.
- "Publish now" on the admin page runs the update immediately.

The supplier list now reaches the browser only through the page, after the
subscription check, instead of being bundled into public JavaScript.

## Settings

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Required; without it the base data is shown and no stamp appears. |
| `CRON_SECRET` | Optional (16+ characters). Lets an external cron POST `/api/cron/catalog` with `Authorization: Bearer …`. |
| `CATALOG_SCHEDULER=off` | Turns the built-in 18:00 clock off, e.g. when an external cron is used. |
