import { env } from "@/lib/env";
import { fromBase64Url, toBase64Url } from "@/lib/encoding";

export const SESSION_COOKIE = "session";
export const OIDC_COOKIE = "oidc";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const OIDC_MAX_AGE = 60 * 10; // long enough to finish the Telegram popup

// The session is minted here and read by every tool, so it lives on the parent domain.
// Dev has no shared domain; the tools impersonate with AUTH_DEV_USER_ID instead.
const SESSION_DOMAIN = process.env.NODE_ENV === "production" ? "tapt.so" : undefined;

const encoder = new TextEncoder();

// Web Crypto only, so this runs on Workers without Node APIs. Same secret in every tool.
async function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(env("SESSION_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

// Value shape: "<sub>.<exp>.<sig>", sig covers "<sub>.<exp>".
export async function createSession(sub: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const body = `${sub}.${exp}`;
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(body));
  return `${body}.${toBase64Url(sig)}`;
}

// Returns the Telegram user id, or null if tampered or expired.
export async function verifySession(value: string): Promise<string | null> {
  const [sub, exp, sig] = value.split(".");
  if (!sub || !exp || !sig) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  const ok = await crypto.subtle.verify(
    "HMAC",
    await hmacKey(),
    fromBase64Url(sig),
    encoder.encode(`${sub}.${exp}`),
  );
  return ok ? sub : null;
}

const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function sessionCookie(value: string) {
  return { name: SESSION_COOKIE, value, ...base, domain: SESSION_DOMAIN, maxAge: SESSION_MAX_AGE };
}

// Host-only: the callback that reads it is on this host.
export function oidcCookie(value: string) {
  return { name: OIDC_COOKIE, value, ...base, maxAge: OIDC_MAX_AGE };
}

export function clearCookie(name: string) {
  return { name, value: "", ...base, maxAge: 0 };
}

// Clearing must name the domain, or the browser keeps the parent-domain cookie and you stay in.
export function clearSessionCookie() {
  return { name: SESSION_COOKIE, value: "", ...base, domain: SESSION_DOMAIN, maxAge: 0 };
}
