import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieOptions,
  isAdminAuthConfigured,
  verifyAdminPassword,
} from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_DASHBOARD_PASSWORD is not configured on the server." },
      { status: 503 }
    );
  }

  let body: { password?: string; action?: string } = {};
  try {
    body = (await request.json()) as { password?: string; action?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  if (body.action === "logout") {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
    return NextResponse.json({ ok: true });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!verifyAdminPassword(password)) {
    return NextResponse.json(
      { error: "Incorrect admin password. Please try again." },
      { status: 401 }
    );
  }

  const token = createAdminSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, getAdminCookieOptions());

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
