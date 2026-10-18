import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  const cookieStore = cookies();
  // Clear legacy 7-day cookie from all devices
  if (cookieStore.get("auth-token")) {
    cookieStore.delete("auth-token");
  }
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || "";
  return NextResponse.json({ token });
}
