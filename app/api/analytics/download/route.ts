import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const ALLOWED_PLATFORMS = new Set(["ios", "android", "web", "unknown"]);
const ALLOWED_SOURCES = new Set([
  "app_install",
  "website_store_click",
  "waitlist",
  "direct",
]);

function inferDeviceModel(userAgent: string | null): string | null {
  if (!userAgent) return null;
  if (/iPhone/i.test(userAgent)) return "iPhone";
  if (/iPad/i.test(userAgent)) return "iPad";
  if (/Android/i.test(userAgent)) return "Android Device";
  if (/Windows/i.test(userAgent)) return "Windows Browser";
  if (/Macintosh/i.test(userAgent)) return "Mac Browser";
  return "Web Browser";
}

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    // Gracefully no-op on public site when Supabase isn't wired yet
    return NextResponse.json({ ok: true, tracked: false });
  }

  const rawPlatform =
    typeof body.platform === "string" ? body.platform.toLowerCase() : "unknown";
  const platform = ALLOWED_PLATFORMS.has(rawPlatform) ? rawPlatform : "unknown";

  const rawSource =
    typeof body.source === "string" ? body.source.toLowerCase() : "website_store_click";
  const source = ALLOWED_SOURCES.has(rawSource) ? rawSource : "website_store_click";

  const userAgent = request.headers.get("user-agent")?.slice(0, 300) ?? null;
  const referrer =
    (typeof body.referrer === "string" ? body.referrer : null) ??
    request.headers.get("referer")?.slice(0, 300) ??
    null;
  const country =
    (typeof body.country === "string" ? body.country.slice(0, 8) : null) ??
    request.headers.get("x-vercel-ip-country") ??
    null;

  const insertPayload = {
    user_id: typeof body.userId === "string" && body.userId ? body.userId : null,
    device_id:
      typeof body.deviceId === "string" && body.deviceId
        ? body.deviceId.slice(0, 128)
        : null,
    downloader_name:
      typeof body.name === "string" && body.name
        ? body.name.slice(0, 120)
        : source === "website_store_click"
        ? "Website Visitor"
        : null,
    downloader_email:
      typeof body.email === "string" && body.email
        ? body.email.slice(0, 180)
        : null,
    platform,
    source,
    app_version:
      typeof body.appVersion === "string" ? body.appVersion.slice(0, 40) : null,
    os_version:
      typeof body.osVersion === "string" ? body.osVersion.slice(0, 40) : null,
    device_model:
      typeof body.deviceModel === "string" && body.deviceModel
        ? body.deviceModel.slice(0, 100)
        : inferDeviceModel(userAgent),
    country,
    referrer,
    user_agent: userAgent,
    downloaded_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("app_downloads").insert(insertPayload);

  if (error) {
    return NextResponse.json(
      { ok: false, tracked: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, tracked: true });
}
