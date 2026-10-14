import dns from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import tls from "node:tls";
import { X509Certificate } from "node:crypto";

/*
 * HTTPS GET for the Iran FDA register. Some Iranian public sites send their
 * certificate without the intermediate CA, which browsers fill in but Node
 * does not. When that happens the missing intermediates are fetched from the
 * certificate's own "CA Issuers" address and the request is verified again
 * against the usual trusted roots plus those intermediates — verification is
 * never turned off.
 */

const CHAIN_ERRORS = new Set(["UNABLE_TO_VERIFY_LEAF_SIGNATURE", "UNABLE_TO_GET_ISSUER_CERT_LOCALLY", "UNABLE_TO_GET_ISSUER_CERT"]);
const intermediates = new Map<string, string[]>();

type Reply = { status: number; body: string };

function get(url: string, ca?: string[], timeoutMs = 12_000): Promise<Reply> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: { "User-Agent": "PharmaVault (+https://pharmavault.ir)", Accept: "text/html" },
        ...(ca ? { ca: [...tls.rootCertificates, ...ca] } : {}),
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, body: Buffer.concat(chunks).toString("utf8") }));
        res.on("error", reject);
      },
    );
    req.setTimeout(timeoutMs, () => req.destroy(Object.assign(new Error("timeout"), { code: "ETIMEDOUT" })));
    req.on("error", reject);
  });
}

function download(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https:") ? https : http;
    const req = lib.get(url, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    });
    req.setTimeout(8_000, () => req.destroy(new Error("timeout")));
    req.on("error", reject);
  });
}

/** The server's leaf certificate, read without trusting it (only to find its issuer). */
export function peerCertificate(host: string): Promise<tls.DetailedPeerCertificate & { authorized: boolean; authorizationError?: string }> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host, port: 443, servername: host, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate(true);
      resolve(Object.assign(cert, { authorized: socket.authorized, authorizationError: socket.authorizationError?.toString() }));
      socket.end();
    });
    socket.setTimeout(8_000, () => socket.destroy(new Error("timeout")));
    socket.on("error", reject);
  });
}

const issuerUrl = (infoAccess: string | undefined) => /CA Issuers - URI:(\S+)/.exec(infoAccess ?? "")?.[1];

/** Missing intermediates of a host, followed up the "CA Issuers" links (at most 3 levels). */
async function fetchIntermediates(host: string): Promise<string[]> {
  const leaf = await peerCertificate(host);
  let next = issuerUrl(new X509Certificate(leaf.raw).infoAccess);
  const pems: string[] = [];
  for (let level = 0; next && level < 3; level++) {
    const cert = new X509Certificate(await download(next));
    pems.push(cert.toString());
    if (cert.subject === cert.issuer) break;
    next = issuerUrl(cert.infoAccess);
  }
  return pems;
}

const codeOf = (e: unknown) => (e as { code?: string })?.code ?? "";

/** GET a page from the register, completing a missing certificate chain once if needed. */
export async function ircGet(url: string): Promise<Reply> {
  const host = new URL(url).hostname;
  try {
    return await get(url, intermediates.get(host));
  } catch (e) {
    if (!CHAIN_ERRORS.has(codeOf(e)) || intermediates.has(host)) throw e;
    intermediates.set(host, await fetchIntermediates(host));
    return get(url, intermediates.get(host));
  }
}

/** Connection facts for the admin check: DNS, the certificate and whether Node trusts it. */
export async function diagnose(host: string): Promise<string[]> {
  const out: string[] = [];
  try {
    out.push(`dns: ${(await dns.lookup(host, { all: true })).map((a) => a.address).join(", ")}`);
  } catch (e) {
    out.push(`dns failed: ${codeOf(e)} ${String(e)}`);
    return out;
  }
  try {
    const c = await peerCertificate(host);
    out.push(`tls: authorized=${c.authorized} error=${c.authorizationError ?? "-"}`);
    out.push(`cert subject: ${c.subject?.CN} · issuer: ${c.issuer?.CN} · valid to: ${c.valid_to}`);
    out.push(`ca issuers: ${issuerUrl(new X509Certificate(c.raw).infoAccess) ?? "-"}`);
  } catch (e) {
    out.push(`tls failed: ${codeOf(e)} ${String(e)}`);
  }
  out.push(`cached intermediates: ${intermediates.get(host)?.length ?? 0}`);
  return out;
}
