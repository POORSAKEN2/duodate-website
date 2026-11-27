import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "duodate_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_DASHBOARD_PASSWORD?.trim());
}

function getSessionSecret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicit) return explicit;
  const fallbackSeed = [
    process.env.ADMIN_DASHBOARD_PASSWORD?.trim() ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "",
    "duodate-admin-fallback-key",
  ].join("|");
  return crypto.createHash("sha256").update(fallbackSeed).digest("hex");
}

function timingSafeMatch(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

export function verifyAdminPassword(candidate: string): boolean {
  const configured = process.env.ADMIN_DASHBOARD_PASSWORD?.trim();
  if (!configured || !candidate) return false;
  return timingSafeMatch(candidate, configured);
}

export function createAdminSessionToken(nowMs = Date.now()): string {
  const expiresAt = nowMs + SESSION_TTL_MS;
  const payload = `admin.${expiresAt}`;
  const sig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(
  token: string | undefined | null,
  nowMs = Date.now()
): boolean {
  if (!token || !isAdminAuthConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "admin") return false;

  const expiresAt = Number(parts[1]);
  if (!Number.isFinite(expiresAt) || expiresAt <= nowMs) return false;

  const payload = `${parts[0]}.${parts[1]}`;
  const expectedSig = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");

  return timingSafeMatch(parts[2], expectedSig);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  if (!isAdminAuthConfigured()) return false;
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export function getAdminCookieOptions(maxAgeSeconds = SESSION_TTL_MS / 1000) {
  return {
    name: ADMIN_COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
