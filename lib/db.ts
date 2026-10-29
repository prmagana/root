import { getCloudflareContext } from "@opennextjs/cloudflare";

// Shared users table across every tapt tool. Same person, same row, whichever tool they're in.
export async function accounts(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.ACCOUNTS;
}
