import { db } from "@/lib/db";

/**
 * Outcome of a password-recovery request or a test email. "detail" is a short code
 * (sent, noAccount, noEmail, smtpOff, limited) or the SMTP error text; it never holds a password.
 */
export async function logMail(entry: { kind: "reset" | "test" | "invoice"; recipient: string | null; userId?: string | null; ok: boolean; detail: string }) {
  try {
    const pool = await db();
    await pool.query("insert into mail_log (kind, recipient, user_id, ok, detail) values ($1, $2, $3, $4, $5)", [
      entry.kind,
      entry.recipient?.slice(0, 200) ?? null,
      entry.userId ?? null,
      entry.ok,
      entry.detail.slice(0, 500),
    ]);
    await pool.query("delete from mail_log where id not in (select id from mail_log order by created_at desc limit 200)");
  } catch (error) {
    console.error("mail log failed", error);
  }
}

export type MailLogRow = { id: string; kind: string; recipient: string | null; name: string | null; ok: boolean; detail: string | null; createdAt: Date };

export async function recentMailLog(limit = 30): Promise<MailLogRow[]> {
  const { rows } = await (await db()).query<{ id: string; kind: string; recipient: string | null; name: string | null; ok: boolean; detail: string | null; created_at: Date }>(
    "select m.id, m.kind, m.recipient, u.name, m.ok, m.detail, m.created_at from mail_log m left join users u on u.id = m.user_id order by m.created_at desc limit $1",
    [limit],
  );
  return rows.map((r) => ({ ...r, createdAt: r.created_at }));
}
