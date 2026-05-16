// app/api/auth/login/route.js
//
// LOGIN API — Validates the password and sets an HTTP-only cookie.
// This is the most secure way to handle simple authentication in Next.js.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // 1. Check if credentials match the ones in .env
    const correctUsername = process.env.ADMIN_USERNAME;
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctUsername || !correctPassword) {
      console.error("Auth credentials not set in .env!");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (username !== correctUsername || password !== correctPassword) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // 2. Password is correct! Create a session cookie.
    // In a real app, you'd use a signed JWT here.
    // For this assignment, we'll use a simple token.
    const cookieStore = await cookies();
    
    cookieStore.set("blogger_auth_session", "authenticated", {
      httpOnly: true,     // Prevents JavaScript from reading the cookie (Secure!)
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Prevents CSRF attacks
      path: "/",          // Accessible across the whole site
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
