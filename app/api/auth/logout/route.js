// app/api/auth/logout/route.js
//
// LOGOUT API — Clears the session cookie.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear the cookie by setting it with an expired date
  cookieStore.set("blogger_auth_session", "", {
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
