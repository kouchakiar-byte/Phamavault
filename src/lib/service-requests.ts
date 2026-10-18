import { db } from "./db";

/** Requests for services ordered outside a subscription, sent from forms on the site. */
export type ServiceKind = "ctd";

export type ServiceRequest = {
  id: string;
  kind: ServiceKind;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  product: string | null;
  message: string | null;
  handled: boolean;
  createdAt: Date;
};

export type NewServiceRequest = Omit<ServiceRequest, "id" | "handled" | "createdAt"> & { locale: string };

export async function saveServiceRequest(r: NewServiceRequest): Promise<void> {
  await (await db()).query(
    `insert into service_requests (kind, name, company, phone, email, product, message, locale)
     values ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [r.kind, r.name, r.company, r.phone, r.email, r.product, r.message, r.locale],
  );
}

export async function recentServiceRequests(limit = 50): Promise<ServiceRequest[]> {
  const { rows } = await (await db()).query<{
    id: string;
    kind: ServiceKind;
    name: string;
    company: string | null;
    phone: string;
    email: string | null;
    product: string | null;
    message: string | null;
    handled: boolean;
    created_at: Date;
  }>("select * from service_requests order by created_at desc limit $1", [limit]);
  return rows.map((r) => ({ ...r, createdAt: r.created_at }));
}

export async function setRequestHandled(id: string, handled: boolean): Promise<void> {
  await (await db()).query("update service_requests set handled = $2 where id = $1", [id, handled]);
}
