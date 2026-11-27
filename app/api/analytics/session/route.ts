import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

function verifyIngestSecret(provided: string | null): boolean {
  const configured = process.env.ANALYTICS_INGEST_SECRET?.trim();
  if (!configured || !provided) return false;
  const a = crypto.createHash("sha256").update(provided).digest();
  const b = crypto.createHash("sha256").update(configured).digest();
  return crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured" },
      { status: 503 }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Authenticate either via Supabase user Bearer token or ANALYTICS_INGEST_SECRET
  let verifiedUserId: string | null = null;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const jwt = authHeader.slice("Bearer ".length).trim();
    const { data, error } = await supabase.auth.getUser(jwt);
    if (!error && data.user) {
      verifiedUserId = data.user.id;
    }
  }

  const secretValid = verifyIngestSecret(
    request.headers.get("x-analytics-secret")
  );
  if (!verifiedUserId && !secretValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId =
    verifiedUserId ?? (typeof body.userId === "string" ? body.userId : null);
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const action =
    typeof body.action === "string" ? body.action.toLowerCase() : "start";
  const platform =
    typeof body.platform === "string" ? body.platform.toLowerCase() : "android";
  const appVersion =
    typeof body.appVersion === "string" ? body.appVersion.slice(0, 40) : null;
  const deviceId =
    typeof body.deviceId === "string" ? body.deviceId.slice(0, 128) : null;
  const screensViewed =
    typeof body.screensViewed === "number" && body.screensViewed >= 0
      ? Math.round(body.screensViewed)
      : 1;
  const durationSeconds =
    typeof body.durationSeconds === "number" && body.durationSeconds >= 0
      ? Math.round(body.durationSeconds)
      : undefined;
  const nowIso = new Date().toISOString();

  if (action === "start") {
    const { data, error } = await supabase
      .from("user_sessions")
      .insert({
        user_id: userId,
        device_id: deviceId,
        platform,
        app_version: appVersion,
        started_at: nowIso,
        last_heartbeat_at: nowIso,
        duration_seconds: durationSeconds ?? 0,
        screens_viewed: screensViewed,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, sessionId: data.id });
  }

  const sessionId =
    typeof body.sessionId === "string" ? body.sessionId : null;
  if (!sessionId) {
    return NextResponse.json(
      { error: "sessionId is required for heartbeat or end" },
      { status: 400 }
    );
  }

  const updatePayload: Record<string, unknown> = {
    last_heartbeat_at: nowIso,
    screens_viewed: screensViewed,
  };
  if (action === "end") {
    updatePayload.ended_at = nowIso;
  }
  if (durationSeconds !== undefined) {
    updatePayload.duration_seconds = durationSeconds;
  }

  const { error } = await supabase
    .from("user_sessions")
    .update(updatePayload)
    .eq("id", sessionId)
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sessionId });
}
