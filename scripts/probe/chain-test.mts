import { ircGet, diagnose } from "../../src/lib/irc-http.ts";
for (const url of ["https://incomplete-chain.badssl.com/", "https://expired.badssl.com/", "https://www.google.com/", "https://github.com/login"]) {
  try { const r = await ircGet(url); console.log("OK  ", r.status, r.chain.join(" → ")); }
  catch (e) { console.log("FAIL", (e as { code?: string }).code, url); }
}
console.log((await diagnose("irc.fda.gov.ir")).join("\n"));
