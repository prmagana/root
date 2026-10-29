import { NextResponse, type NextRequest } from "next/server";
import { clearSessionCookie } from "@/lib/session";

// Signs out of every tool at once: the cookie lives on the parent domain.
export async function POST(request: NextRequest) {
  const res = NextResponse.redirect(new URL("/", request.url), 303);
  res.cookies.set(clearSessionCookie());
  return res;
}
