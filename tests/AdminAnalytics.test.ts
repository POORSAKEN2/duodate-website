import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildAdminDashboardData } from "@/lib/admin/analytics";
import { getDemoDashboardData } from "@/lib/admin/demo-data";
import { escapeCsvCell, formatDuration } from "@/lib/admin/format";
import {
  createAdminSessionToken,
  verifyAdminPassword,
  verifyAdminSessionToken,
} from "@/lib/admin/auth";

describe("Admin analytics aggregation & helpers", () => {
  const prevPassword = process.env.ADMIN_DASHBOARD_PASSWORD;
  const prevSecret = process.env.ADMIN_SESSION_SECRET;

  beforeEach(() => {
    process.env.ADMIN_DASHBOARD_PASSWORD = "test-secret-password";
    process.env.ADMIN_SESSION_SECRET = "test-hmac-secret-32-chars-minimum";
  });

  afterEach(() => {
    process.env.ADMIN_DASHBOARD_PASSWORD = prevPassword;
    process.env.ADMIN_SESSION_SECRET = prevSecret;
  });

  it("formats durations cleanly across seconds, minutes, and hours", () => {
    expect(formatDuration(0)).toBe("0s");
    expect(formatDuration(45)).toMatch(/45\s?s/);
    expect(formatDuration(90)).toMatch(/1m.*30s|1m 30s/);
    expect(formatDuration(3900)).toMatch(/1h.*5m|1h 5m/);
  });

  it("escapes CSV cells with commas, quotes, or newlines", () => {
    expect(escapeCsvCell("plain")).toBe("plain");
    expect(escapeCsvCell("hello, world")).toBe('"hello, world"');
    expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""');
  });

  it("creates and verifies signed admin session tokens and rejects tampered/expired tokens", () => {
    const now = 1_700_000_000_000;
    const token = createAdminSessionToken(now);
    expect(verifyAdminSessionToken(token, now + 1000)).toBe(true);
    expect(verifyAdminSessionToken(`${token}tampered`, now + 1000)).toBe(false);
    expect(verifyAdminSessionToken(token, now + 1000 * 60 * 60 * 24 * 8)).toBe(
      false
    );
    expect(verifyAdminPassword("test-secret-password")).toBe(true);
    expect(verifyAdminPassword("wrong-password")).toBe(false);
  });

  it("aggregates downloads, per-user average usage time, couples, and product metrics accurately", () => {
    const fixedNow = new Date("2026-11-13T12:00:00.000Z");
    const data = buildAdminDashboardData(
      {
        authUsers: [
          {
            id: "u1",
            email: "alex@example.com",
            created_at: "2026-11-12T10:00:00.000Z",
          },
          {
            id: "u2",
            email: "sam@example.com",
            created_at: "2026-11-10T10:00:00.000Z",
          },
        ],
        users: [
          { id: "u1", display_name: "Alex" },
          { id: "u2", display_name: "Sam" },
        ],
        couples: [
          {
            id: "c1",
            user1_id: "u1",
            user2_id: "u2",
            together_since: "2026-11-03",
            ended_at: null,
            user2_wants_back: false,
          },
        ],
        dates: [
          {
            id: "d1",
            couple_id: "c1",
            title: "Dinner",
            vibe: "romantic",
            is_outdoor: false,
            status: "completed",
            created_at: "2026-11-12T18:00:00.000Z",
          },
          {
            id: "d2",
            couple_id: "c1",
            title: "Park Walk",
            vibe: "cozy",
            is_outdoor: true,
            status: "planned",
            created_at: "2026-11-13T08:00:00.000Z",
          },
        ],
        outfits: [{ id: "o1", date_id: "d1", description: "Blazer" }],
        daily_moods: [{ user_id: "u1", mood: "happy", note: "Excited" }],
        goals: [
          {
            id: "g1",
            couple_id: "c1",
            kind: "date_streak",
            title: "Weekly Dates",
            target_count: 10,
            completed_at: "2026-11-12T00:00:00.000Z",
          },
        ],
        goal_items: [{ id: "gi1", goal_id: "g1", label: "Dinner", position: 1 }],
        achievements: [
          {
            id: "a1",
            couple_id: "c1",
            kind: "first_date",
            goal_id: "g1",
            title: "First Date",
            earned_at: "2026-11-12T20:00:00.000Z",
          },
        ],
        preference_items: [{ id: "p1", user_id: "u1", mark: "love" }],
        push_tokens: [{ token: "t1", user_id: "u1", platform: "android" }],
        reports: [
          {
            id: "r1",
            reported_id: "u2",
            reason: "Test",
            details: "Details",
            created_at: "2026-11-13T09:00:00.000Z",
          },
        ],
        app_downloads: [
          {
            id: "dl1",
            user_id: "u1",
            platform: "android",
            source: "app_install",
            downloaded_at: "2026-11-13T09:30:00.000Z",
          },
          {
            id: "dl2",
            user_id: "u2",
            platform: "ios",
            source: "website_store_click",
            downloaded_at: "2026-11-10T09:30:00.000Z",
          },
        ],
        user_sessions: [
          {
            id: "s1",
            user_id: "u1",
            platform: "android",
            duration_seconds: 600,
            started_at: "2026-11-13T10:00:00.000Z",
          },
          {
            id: "s2",
            user_id: "u1",
            platform: "android",
            duration_seconds: 300,
            started_at: "2026-11-13T11:00:00.000Z",
          },
          {
            id: "s3",
            user_id: "u2",
            platform: "ios",
            duration_seconds: 300,
            started_at: "2026-11-12T10:00:00.000Z",
          },
        ],
        analytics_events: [],
        tableHealth: [],
      },
      { now: fixedNow, rangeDays: 7 }
    );

    expect(data.overview.totalDownloads).toBe(2);
    expect(data.overview.downloadsToday).toBe(1);
    expect(data.overview.totalUsers).toBe(2);
    expect(data.overview.activeCouples).toBe(1);
    expect(data.overview.totalSessions).toBe(3);
    // Total 1200s across 2 users -> 600s avg per user; 3 sessions -> 400s avg session
    expect(data.overview.avgUsagePerUserSeconds).toBe(600);
    expect(data.overview.avgSessionDurationSeconds).toBe(400);
    expect(data.overview.medianSessionDurationSeconds).toBe(300);
    expect(data.overview.pushReachPct).toBe(50);

    const alex = data.users.find((u) => u.userId === "u1");
    expect(alex?.avgSessionSeconds).toBe(450);
    expect(alex?.totalUsageSeconds).toBe(900);
    expect(alex?.datesCount).toBe(2);

    expect(data.productMetrics.outfitCoordinationRatePct).toBe(50);
    expect(data.productMetrics.goalCompletionRatePct).toBe(100);
    expect(data.timeSeries).toHaveLength(7);
  });

  it("builds deterministic demo dataset", () => {
    const demo = getDemoDashboardData(14);
    expect(demo.mode).toBe("demo");
    expect(demo.rangeDays).toBe(14);
    expect(demo.downloads.length).toBeGreaterThan(0);
    expect(demo.users.length).toBeGreaterThan(0);
  });
});
