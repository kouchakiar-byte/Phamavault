import { ircGet, diagnose } from "../../src/lib/irc-http.ts";
for (const url of ["https://incomplete-chain.badssl.com/", "https://expired.badssl.com/", "https://untrusted-root.badssl.com/", "https://self-signed.badssl.com/", "https://www.google.com/"]) {
  try { const r = await ircGet(url); console.log("OK  ", r.status, url); }
  catch (e) { console.log("FAIL", (e as { code?: string }).code, url); }
}
console.log((await diagnose("incomplete-chain.badssl.com")).join("\n"));
console.log((await diagnose("irc.fda.gov.ir")).join("\n"));
