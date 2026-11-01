import { connect as netConnect, type Socket } from "node:net";
import { connect as tlsConnect, type TLSSocket } from "node:tls";

/**
 * Sends one email through the SMTP server in SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
 * (the Liara mail service), from MAIL_FROM. Port 465 uses TLS from the start; any other port
 * upgrades with STARTTLS. No outside library: the protocol needed here is a dozen commands.
 */
export const mailConfigured = (): boolean =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.MAIL_FROM);

type Conn = { socket: Socket | TLSSocket; buffer: string };

function read(conn: Conn): Promise<string> {
  return new Promise((resolve, reject) => {
    const done = () => {
      // A reply ends with a line whose code is followed by a space: "250 OK".
      const lines = conn.buffer.split("\r\n");
      const last = lines.findIndex((l) => /^\d{3} /.test(l));
      if (last < 0) return false;
      const reply = lines.slice(0, last + 1).join("\n");
      conn.buffer = lines.slice(last + 1).join("\r\n");
      cleanup();
      resolve(reply);
      return true;
    };
    const onData = (chunk: Buffer) => {
      conn.buffer += chunk.toString("utf8");
      done();
    };
    const onError = (e: Error) => {
      cleanup();
      reject(e);
    };
    const cleanup = () => {
      conn.socket.off("data", onData);
      conn.socket.off("error", onError);
    };
    conn.socket.on("data", onData);
    conn.socket.on("error", onError);
    done();
  });
}

async function command(conn: Conn, line: string | null, expect: number): Promise<string> {
  if (line !== null) conn.socket.write(`${line}\r\n`);
  const reply = await read(conn);
  if (!reply.split("\n").at(-1)!.startsWith(String(expect))) throw new Error(`SMTP: expected ${expect}, got ${reply.slice(0, 200)}`);
  return reply;
}

const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64");
const header = (s: string) => (/^[\x20-\x7e]*$/.test(s) ? s : `=?UTF-8?B?${b64(s)}?=`);
const wrap = (s: string) => b64(s).replace(/.{76}/g, "$&\r\n");

export async function sendMail({ to, subject, text, html }: { to: string; subject: string; text: string; html: string }): Promise<void> {
  if (!mailConfigured()) throw new Error("SMTP is not configured");
  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || 465);
  const from = process.env.MAIL_FROM!;
  const address = from.match(/<([^>]+)>/)?.[1] ?? from;
  const name = from.includes("<") ? from.slice(0, from.indexOf("<")).trim() : "";

  const socket: Socket | TLSSocket =
    port === 465 ? tlsConnect({ host, port, servername: host }) : netConnect({ host, port });
  socket.setTimeout(20_000, () => socket.destroy(new Error("SMTP timeout")));
  const conn: Conn = { socket, buffer: "" };
  try {
    await command(conn, null, 220);
    await command(conn, "EHLO pharmavault.ir", 250);
    if (port !== 465) {
      await command(conn, "STARTTLS", 220);
      conn.socket = tlsConnect({ socket: conn.socket as Socket, servername: host });
      conn.buffer = "";
      await command(conn, "EHLO pharmavault.ir", 250);
    }
    await command(conn, "AUTH LOGIN", 334);
    await command(conn, b64(process.env.SMTP_USER!), 334);
    await command(conn, b64(process.env.SMTP_PASS!), 235);
    await command(conn, `MAIL FROM:<${address}>`, 250);
    await command(conn, `RCPT TO:<${to}>`, 250);
    await command(conn, "DATA", 354);
    const boundary = `pv-${Date.now().toString(36)}`;
    const message = [
      `From: ${name ? `${header(name)} <${address}>` : address}`,
      `To: <${to}>`,
      `Subject: ${header(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: <${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}@pharmavault.ir>`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      wrap(text),
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      wrap(html),
      `--${boundary}--`,
      "",
    ].join("\r\n");
    // Base64 bodies cannot contain a line with a single dot, so no dot-stuffing is needed.
    await command(conn, `${message}\r\n.`, 250);
    await command(conn, "QUIT", 221).catch(() => undefined);
  } finally {
    conn.socket.destroy();
  }
}
