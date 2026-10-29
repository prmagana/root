import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// Who is signed in, for the hub's nav. Null when nobody is; the lander never redirects.
export async function currentUserId(): Promise<string | null> {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return value ? verifySession(value) : null;
}
