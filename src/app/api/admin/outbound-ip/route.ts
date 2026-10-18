import { getUser } from "@/lib/auth";

/** Public "what is my IP" services; several, in case one is unreachable from the server. */
const services = ["https://api.ipify.org", "https://icanhazip.com", "https://ifconfig.me/ip"];

/**
 * GET /api/admin/outbound-ip — admins only: the IP address this server's
 * outgoing requests come from, which the payment gateway (Zarinpal/Shaparak)
 * must have on its allow-list.
 */
export async function GET() {
  const user = await getUser().catch(() => null);
  if (!user?.isAdmin) return new Response("Not found", { status: 404 });
  const lines = await Promise.all(
    services.map(async (url) => {
      try {
        const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
        return `${(await response.text()).trim()}  (${url})`;
      } catch (e) {
        return `unreachable: ${url} — ${String(e)}`;
      }
    }),
  );
  return new Response(["Outbound IP of this server:", ...lines].join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
