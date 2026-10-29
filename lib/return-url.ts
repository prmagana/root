// Where to send someone after login. Only tapt.so and its subdomains, so this can't bounce
// a signed-in person anywhere else. Anything odd falls back to the hub.
const FALLBACK = "https://tapt.so/";

export function safeReturnUrl(raw: string | null): string {
  if (!raw) return FALLBACK;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return FALLBACK;
  }
  const host = u.hostname;
  const ours = host === "tapt.so" || host.endsWith(".tapt.so");
  return u.protocol === "https:" && ours ? u.toString() : FALLBACK;
}
