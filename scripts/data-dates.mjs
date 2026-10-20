// Writes src/data/data-dates.json: when each part of the site's content last
// changed (Tehran calendar day), taken from the git history, so "last reviewed" dates follow the
// content instead of being typed by hand. Runs before every build; where the
// history is missing or shallow (a single-commit checkout would date every
// file to the newest commit) the committed file is kept as it is.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const OUT = "src/data/data-dates.json";
const SOURCES = {
  suppliers: ["src/data/suppliers.json"],
  materials: ["src/data/raw-materials.json"],
  interactions: ["src/data/interactions.ts"],
  pharmacy: ["src/content/pharmacy.ts"],
  references: ["src/content/references.ts"],
};

/** yyyy-mm-dd in Tehran time. */
const tehranDay = (date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran" }).format(date);

const git = (...args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();

let current = {};
try {
  current = JSON.parse(readFileSync(OUT, "utf8"));
} catch {}

let next = current;
try {
  if (git("rev-parse", "--is-shallow-repository") === "true") throw new Error("shallow history");
  next = Object.fromEntries(
    Object.entries(SOURCES).map(([key, files]) => {
      // Edits not committed yet are dated today, so the date is right in the same commit.
      const edited = git("status", "--porcelain", "--", ...files) !== "";
      const last = edited ? new Date().toISOString() : git("log", "-1", "--format=%cI", "--", ...files);
      return [key, last ? tehranDay(new Date(last)) : current[key] || null];
    }),
  );
} catch (error) {
  console.log(`data-dates: keeping ${OUT} (${error.message.split("\n")[0]})`);
}

const missing = Object.keys(SOURCES).filter((key) => !next[key]);
if (missing.length) throw new Error(`data-dates: no date for ${missing.join(", ")}`);
if (JSON.stringify(next) !== JSON.stringify(current)) {
  writeFileSync(OUT, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`data-dates: updated ${OUT}`);
}
