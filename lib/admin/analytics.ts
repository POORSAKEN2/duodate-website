import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type {
  AdminDashboardData,
  BreakdownItem,
  DailySeriesPoint,
  DownloadEntry,
  ReportEntry,
  TableHealth,
  UserUsageSummary,
} from "./types";

export type GenericRow = Record<string, unknown>;

export interface RawAnalyticsDataset {
  authUsers: Array<{
    id: string;
    email?: string | null;
    created_at?: string | null;
    last_sign_in_at?: string | null;
    user_metadata?: Record<string, unknown> | null;
  }>;
  users: GenericRow[];
  couples: GenericRow[];
  dates: GenericRow[];
  outfits: GenericRow[];
  daily_moods: GenericRow[];
  goals: GenericRow[];
  goal_items: GenericRow[];
  achievements: GenericRow[];
  preference_items: GenericRow[];
  push_tokens: GenericRow[];
  reports: GenericRow[];
  app_downloads: GenericRow[];
  user_sessions: GenericRow[];
  analytics_events: GenericRow[];
  tableHealth: TableHealth[];
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  return null;
}

function pickString(row: GenericRow, keys: string[]): string | null {
  for (const key of keys) {
    const val = asString(row[key]);
    if (val) return val;
  }
  return null;
}

function pickTimestamp(row: GenericRow, keys: string[]): string | null {
  for (const key of keys) {
    const val = asString(row[key]);
    if (val && !Number.isNaN(Date.parse(val))) {
      return new Date(val).toISOString();
    }
  }
  return null;
}

function toDayKey(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString().slice(0, 10);
}

function computeBreakdown(values: Array<string | null | undefined>, limit = 10): BreakdownItem[] {
  const counts = new Map<string, number>();
  let total = 0;

  for (const raw of values) {
    const label = raw && raw.trim() ? raw.trim() : "unspecified";
    counts.set(label, (counts.get(label) ?? 0) + 1);
    total += 1;
  }

  if (total === 0) return [];

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / total) * 1000) / 10,
    }));
}

function computeMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }
  return Math.round(sorted[mid]);
}

function extractCoupleUserIds(couple: GenericRow): string[] {
  const candidateKeys = [
    "user1_id",
    "user2_id",
    "user_1_id",
    "user_2_id",
    "partner1_id",
    "partner2_id",
    "creator_id",
    "owner_id",
    "initiator_id",
    "inviter_id",
    "invitee_id",
  ];
  const ids: string[] = [];
  for (const key of candidateKeys) {
    const id = asString(couple[key]);
    if (id) ids.push(id);
  }
  return ids;
}

function getSessionDurationSeconds(session: GenericRow): number {
  const explicit = asNumber(session.duration_seconds);
  if (explicit !== null && explicit >= 0) {
    return Math.round(explicit);
  }
  const started = pickTimestamp(session, ["started_at", "created_at"]);
  const ended = pickTimestamp(session, ["ended_at", "last_heartbeat_at", "updated_at"]);
  if (started && ended) {
    const diff = Math.floor((Date.parse(ended) - Date.parse(started)) / 1000);
    return Math.max(0, diff);
  }
  return 0;
}

function normalizePlatform(raw: string | null): DownloadEntry["platform"] {
  if (!raw) return "unknown";
  const lower = raw.toLowerCase();
  if (lower.includes("ios") || lower.includes("iphone") || lower.includes("ipad") || lower.includes("apple")) {
    return "ios";
  }
  if (lower.includes("android") || lower.includes("play")) {
    return "android";
  }
  if (lower.includes("web") || lower.includes("browser")) {
    return "web";
  }
  return "unknown";
}

export function buildAdminDashboardData(
  raw: RawAnalyticsDataset,
  options: { mode?: "live" | "demo"; rangeDays?: number; now?: Date } = {}
): AdminDashboardData {
  const now = options.now ?? new Date();
  const nowMs = now.getTime();
  const rangeDays = Math.min(Math.max(options.rangeDays ?? 30, 7), 90);
  const dayMs = 86_400_000;
  const todayKey = now.toISOString().slice(0, 10);
  const cutoff1d = nowMs - dayMs;
  const cutoff7d = nowMs - 7 * dayMs;
  const cutoff30d = nowMs - 30 * dayMs;

  // 1. Build unified user directory from public.users + auth.users
  const authById = new Map(raw.authUsers.map((u) => [u.id, u]));
  const userMap = new Map<
    string,
    {
      id: string;
      displayName: string;
      email: string | null;
      joinedAt: string | null;
      lastSeenAt: string | null;
      platform: string | null;
    }
  >();

  for (const row of raw.users) {
    const id = pickString(row, ["id", "user_id"]);
    if (!id) continue;
    const auth = authById.get(id);
    const metaName =
      auth?.user_metadata &&
      (asString(auth.user_metadata.display_name) ??
        asString(auth.user_metadata.full_name) ??
        asString(auth.user_metadata.name));

    const displayName =
      pickString(row, ["display_name", "full_name", "name", "username", "first_name"]) ??
      metaName ??
      auth?.email?.split("@")[0] ??
      `User ${id.slice(0, 8)}`;

    const email = pickString(row, ["email"]) ?? auth?.email ?? null;
    const joinedAt =
      pickTimestamp(row, ["created_at", "joined_at"]) ??
      (auth?.created_at && !Number.isNaN(Date.parse(auth.created_at))
        ? new Date(auth.created_at).toISOString()
        : null);
    const lastSeenAt =
      pickTimestamp(row, ["last_seen_at", "updated_at"]) ??
      (auth?.last_sign_in_at && !Number.isNaN(Date.parse(auth.last_sign_in_at))
        ? new Date(auth.last_sign_in_at).toISOString()
        : null);
    const platform = pickString(row, ["platform", "os"]);

    userMap.set(id, {
      id,
      displayName,
      email,
      joinedAt,
      lastSeenAt,
      platform,
    });
  }

  for (const auth of raw.authUsers) {
    if (userMap.has(auth.id)) continue;
    const metaName =
      auth.user_metadata &&
      (asString(auth.user_metadata.display_name) ??
        asString(auth.user_metadata.full_name) ??
        asString(auth.user_metadata.name));
    userMap.set(auth.id, {
      id: auth.id,
      displayName: metaName ?? auth.email?.split("@")[0] ?? `User ${auth.id.slice(0, 8)}`,
      email: auth.email ?? null,
      joinedAt:
        auth.created_at && !Number.isNaN(Date.parse(auth.created_at))
          ? new Date(auth.created_at).toISOString()
          : null,
      lastSeenAt:
        auth.last_sign_in_at && !Number.isNaN(Date.parse(auth.last_sign_in_at))
          ? new Date(auth.last_sign_in_at).toISOString()
          : null,
      platform: null,
    });
  }

  // 2. Couples lookup & metrics
  const userCoupleStatus = new Map<string, "active" | "ended">();
  const coupleUserMap = new Map<string, string[]>();
  let activeCouples = 0;
  let endedCouples = 0;
  let reunionRequests = 0;
  const tenureDaysList: number[] = [];

  for (const couple of raw.couples) {
    const coupleId = pickString(couple, ["id"]);
    const endedAt = pickTimestamp(couple, ["ended_at"]);
    const isEnded = Boolean(endedAt);
    if (isEnded) endedCouples += 1;
    else activeCouples += 1;

    if (asBoolean(couple.user2_wants_back) === true) {
      reunionRequests += 1;
    }

    const togetherSince = pickString(couple, ["together_since", "created_at"]);
    if (togetherSince) {
      const startMs = Date.parse(togetherSince);
      const endMs = endedAt ? Date.parse(endedAt) : nowMs;
      if (!Number.isNaN(startMs) && endMs >= startMs) {
        tenureDaysList.push(Math.round((endMs - startMs) / dayMs));
      }
    }

    const memberIds = extractCoupleUserIds(couple);
    if (coupleId) {
      coupleUserMap.set(coupleId, memberIds);
    }
    for (const uid of memberIds) {
      const prev = userCoupleStatus.get(uid);
      if (prev !== "active") {
        userCoupleStatus.set(uid, isEnded ? "ended" : "active");
      }
    }
  }

  // 3. Push tokens lookup
  const pushUsers = new Set<string>();
  const pushPlatformByUser = new Map<string, string>();
  for (const token of raw.push_tokens) {
    const uid = asString(token.user_id);
    if (uid) {
      pushUsers.add(uid);
      const plat = pickString(token, ["platform", "os"]);
      if (plat) pushPlatformByUser.set(uid, plat);
    }
  }

  // 4. Dates & outfits aggregation
  const datesByCoupleCount = new Map<string, number>();
  let outdoorDates = 0;
  let indoorDates = 0;
  const dateIdsWithOutfits = new Set<string>();

  for (const outfit of raw.outfits) {
    const dateId = asString(outfit.date_id);
    if (dateId) dateIdsWithOutfits.add(dateId);
  }

  for (const d of raw.dates) {
    const coupleId = asString(d.couple_id);
    if (coupleId) {
      datesByCoupleCount.set(coupleId, (datesByCoupleCount.get(coupleId) ?? 0) + 1);
    }
    const outdoor = asBoolean(d.is_outdoor);
    if (outdoor === true) outdoorDates += 1;
    else if (outdoor === false) indoorDates += 1;
  }

  const datesCountByUser = new Map<string, number>();
  for (const [coupleId, count] of datesByCoupleCount.entries()) {
    const members = coupleUserMap.get(coupleId) ?? [];
    for (const uid of members) {
      datesCountByUser.set(uid, (datesCountByUser.get(uid) ?? 0) + count);
    }
  }

  // 5. Daily moods & preference items
  const moodsCountByUser = new Map<string, number>();
  const latestActivityByUser = new Map<string, number>();

  function recordActivity(uid: string | null, iso: string | null) {
    if (!uid || !iso) return;
    const ms = Date.parse(iso);
    if (Number.isNaN(ms)) return;
    const prev = latestActivityByUser.get(uid) ?? 0;
    if (ms > prev) latestActivityByUser.set(uid, ms);
  }

  for (const mood of raw.daily_moods) {
    const uid = asString(mood.user_id);
    if (uid) {
      moodsCountByUser.set(uid, (moodsCountByUser.get(uid) ?? 0) + 1);
      recordActivity(uid, pickTimestamp(mood, ["created_at", "updated_at", "mood_date", "date"]));
    }
  }

  const prefsCountByUser = new Map<string, number>();
  for (const pref of raw.preference_items) {
    const uid = asString(pref.user_id);
    if (uid) {
      prefsCountByUser.set(uid, (prefsCountByUser.get(uid) ?? 0) + 1);
      recordActivity(uid, pickTimestamp(pref, ["updated_at", "created_at"]));
    }
  }

  for (const user of userMap.values()) {
    recordActivity(user.id, user.lastSeenAt);
  }

  // 6. Goals & achievements
  let completedGoals = 0;
  const targetCounts: number[] = [];
  for (const g of raw.goals) {
    if (pickTimestamp(g, ["completed_at"])) {
      completedGoals += 1;
    }
    const tc = asNumber(g.target_count);
    if (tc !== null && tc > 0) targetCounts.push(tc);
  }

  // 7. Downloads analytics
  const downloads: DownloadEntry[] = raw.app_downloads
    .map((row, idx): DownloadEntry => {
      const userId = asString(row.user_id);
      const linkedUser = userId ? userMap.get(userId) : undefined;
      const email = pickString(row, ["downloader_email", "email"]) ?? linkedUser?.email ?? null;
      const who =
        pickString(row, ["downloader_name", "name"]) ??
        linkedUser?.displayName ??
        email ??
        (pickString(row, ["device_id"])
          ? `Device ${pickString(row, ["device_id"])!.slice(0, 8)}`
          : `Visitor #${idx + 1}`);
      const downloadedAt =
        pickTimestamp(row, ["downloaded_at", "created_at"]) ?? now.toISOString();

      return {
        id: pickString(row, ["id"]) ?? `dl-${idx}`,
        userId,
        who,
        email,
        platform: normalizePlatform(pickString(row, ["platform", "os"])),
        source: pickString(row, ["source"]) ?? "app_install",
        appVersion: pickString(row, ["app_version"]),
        osVersion: pickString(row, ["os_version"]),
        deviceModel: pickString(row, ["device_model"]),
        country: pickString(row, ["country"]),
        referrer: pickString(row, ["referrer"]),
        downloadedAt,
      };
    })
    .sort((a, b) => Date.parse(b.downloadedAt) - Date.parse(a.downloadedAt));

  let downloadsToday = 0;
  let downloads7d = 0;
  let downloads30d = 0;
  for (const dl of downloads) {
    const ms = Date.parse(dl.downloadedAt);
    if (Number.isNaN(ms)) continue;
    if (dl.downloadedAt.slice(0, 10) === todayKey) downloadsToday += 1;
    if (ms >= cutoff7d) downloads7d += 1;
    if (ms >= cutoff30d) downloads30d += 1;
  }

  // 8. Sessions & average time of use per user
  const sessionsByUser = new Map<
    string,
    {
      count: number;
      totalSeconds: number;
      screensTotal: number;
      lastStartedMs: number;
      platform: string | null;
    }
  >();
  const allSessionDurations: number[] = [];
  const dauSet = new Set<string>();
  const wauSet = new Set<string>();
  const mauSet = new Set<string>();

  for (const sess of raw.user_sessions) {
    const uid = asString(sess.user_id);
    const duration = getSessionDurationSeconds(sess);
    allSessionDurations.push(duration);

    const startedAt = pickTimestamp(sess, ["started_at", "created_at"]);
    const startedMs = startedAt ? Date.parse(startedAt) : 0;
    const endedAt = pickTimestamp(sess, ["ended_at", "last_heartbeat_at", "started_at"]);
    const activeMs = endedAt ? Date.parse(endedAt) : startedMs;

    if (uid) {
      const current = sessionsByUser.get(uid) ?? {
        count: 0,
        totalSeconds: 0,
        screensTotal: 0,
        lastStartedMs: 0,
        platform: null,
      };
      current.count += 1;
      current.totalSeconds += duration;
      current.screensTotal += asNumber(sess.screens_viewed) ?? 1;
      if (activeMs > current.lastStartedMs) {
        current.lastStartedMs = activeMs;
      }
      const plat = pickString(sess, ["platform"]);
      if (plat) current.platform = plat;
      sessionsByUser.set(uid, current);

      recordActivity(uid, endedAt ?? startedAt);

      if (activeMs >= cutoff1d) dauSet.add(uid);
      if (activeMs >= cutoff7d) wauSet.add(uid);
      if (activeMs >= cutoff30d) mauSet.add(uid);
    }
  }

  const hasSessions = raw.user_sessions.length > 0;
  if (!hasSessions) {
    for (const [uid, ms] of latestActivityByUser.entries()) {
      if (ms >= cutoff1d) dauSet.add(uid);
      if (ms >= cutoff7d) wauSet.add(uid);
      if (ms >= cutoff30d) mauSet.add(uid);
    }
  }

  const totalUsageSeconds = allSessionDurations.reduce((sum, s) => sum + s, 0);
  const usersWithSessions = sessionsByUser.size;
  const avgUsagePerUserSeconds =
    usersWithSessions > 0 ? Math.round(totalUsageSeconds / usersWithSessions) : 0;
  const avgSessionDurationSeconds =
    allSessionDurations.length > 0
      ? Math.round(totalUsageSeconds / allSessionDurations.length)
      : 0;
  const medianSessionDurationSeconds = computeMedian(allSessionDurations);

  const durationBuckets = {
    "< 1 min": 0,
    "1 – 5 min": 0,
    "5 – 15 min": 0,
    "15 – 30 min": 0,
    "30+ min": 0,
  };
  for (const sec of allSessionDurations) {
    if (sec < 60) durationBuckets["< 1 min"] += 1;
    else if (sec < 300) durationBuckets["1 – 5 min"] += 1;
    else if (sec < 900) durationBuckets["5 – 15 min"] += 1;
    else if (sec < 1800) durationBuckets["15 – 30 min"] += 1;
    else durationBuckets["30+ min"] += 1;
  }
  const totalDurBucketCount = allSessionDurations.length;
  const sessionDurationBuckets: BreakdownItem[] =
    totalDurBucketCount === 0
      ? []
      : Object.entries(durationBuckets).map(([label, count]) => ({
          label,
          count,
          percentage: Math.round((count / totalDurBucketCount) * 1000) / 10,
        }));

  // Ensure any userId found in sessions is present in userMap
  for (const uid of sessionsByUser.keys()) {
    if (!userMap.has(uid)) {
      userMap.set(uid, {
        id: uid,
        displayName: `User ${uid.slice(0, 8)}`,
        email: null,
        joinedAt: null,
        lastSeenAt: null,
        platform: null,
      });
    }
  }

  const users: UserUsageSummary[] = [...userMap.values()]
    .map((u): UserUsageSummary => {
      const sess = sessionsByUser.get(u.id);
      const lastActiveMs = Math.max(
        latestActivityByUser.get(u.id) ?? 0,
        sess?.lastStartedMs ?? 0
      );
      return {
        userId: u.id,
        displayName: u.displayName,
        email: u.email,
        joinedAt: u.joinedAt,
        lastActiveAt: lastActiveMs > 0 ? new Date(lastActiveMs).toISOString() : null,
        coupleStatus: userCoupleStatus.get(u.id) ?? "solo",
        sessionCount: sess?.count ?? 0,
        totalUsageSeconds: sess?.totalSeconds ?? 0,
        avgSessionSeconds:
          sess && sess.count > 0 ? Math.round(sess.totalSeconds / sess.count) : 0,
        screensViewedTotal: sess?.screensTotal ?? 0,
        hasPushEnabled: pushUsers.has(u.id),
        datesCount: datesCountByUser.get(u.id) ?? 0,
        moodsCount: moodsCountByUser.get(u.id) ?? 0,
        preferencesCount: prefsCountByUser.get(u.id) ?? 0,
        platform:
          sess?.platform ??
          pushPlatformByUser.get(u.id) ??
          u.platform ??
          "unknown",
      };
    })
    .sort((a, b) => b.totalUsageSeconds - a.totalUsageSeconds || b.datesCount - a.datesCount);

  let newUsers7d = 0;
  for (const u of users) {
    if (u.joinedAt && Date.parse(u.joinedAt) >= cutoff7d) {
      newUsers7d += 1;
    }
  }

  // 9. Reports list
  const reports: ReportEntry[] = raw.reports
    .map((r, idx): ReportEntry => {
      const reportedId = asString(r.reported_id) ?? "unknown";
      const reportedUser = userMap.get(reportedId);
      return {
        id: pickString(r, ["id"]) ?? `rep-${idx}`,
        reportedId,
        reportedName: reportedUser?.displayName ?? `User ${reportedId.slice(0, 8)}`,
        reason: pickString(r, ["reason"]) ?? "Unspecified",
        details: pickString(r, ["details"]),
        createdAt: pickTimestamp(r, ["created_at"]) ?? now.toISOString(),
      };
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

  // 10. Time series over rangeDays
  const seriesMap = new Map<string, DailySeriesPoint>();
  const shortDateFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  for (let offset = rangeDays - 1; offset >= 0; offset -= 1) {
    const dayDate = new Date(nowMs - offset * dayMs);
    const key = dayDate.toISOString().slice(0, 10);
    seriesMap.set(key, {
      date: key,
      label: shortDateFmt.format(dayDate),
      downloads: 0,
      newUsers: 0,
      sessions: 0,
      datesPlanned: 0,
    });
  }

  for (const dl of downloads) {
    const key = toDayKey(dl.downloadedAt);
    const point = key ? seriesMap.get(key) : undefined;
    if (point) point.downloads += 1;
  }
  for (const u of users) {
    const key = toDayKey(u.joinedAt);
    const point = key ? seriesMap.get(key) : undefined;
    if (point) point.newUsers += 1;
  }
  for (const sess of raw.user_sessions) {
    const key = toDayKey(pickTimestamp(sess, ["started_at", "created_at"]));
    const point = key ? seriesMap.get(key) : undefined;
    if (point) point.sessions += 1;
  }
  for (const d of raw.dates) {
    const key = toDayKey(pickTimestamp(d, ["created_at", "scheduled_at", "date_at", "updated_at"]));
    const point = key ? seriesMap.get(key) : undefined;
    if (point) point.datesPlanned += 1;
  }

  const totalDates = raw.dates.length;
  const totalUsers = users.length;
  const totalGoals = raw.goals.length;

  return {
    mode: options.mode ?? "live",
    generatedAt: now.toISOString(),
    rangeDays,
    tableHealth: raw.tableHealth,
    overview: {
      totalDownloads: downloads.length,
      downloadsToday,
      downloads7d,
      downloads30d,
      totalUsers,
      newUsers7d,
      dau: dauSet.size,
      wau: wauSet.size,
      mau: mauSet.size,
      usageSource: hasSessions ? "user_sessions" : "activity_fallback",
      avgUsagePerUserSeconds,
      avgSessionDurationSeconds,
      medianSessionDurationSeconds,
      totalUsageHours: Math.round((totalUsageSeconds / 3600) * 10) / 10,
      totalSessions: raw.user_sessions.length,
      totalCouples: raw.couples.length,
      activeCouples,
      endedCouples,
      reunionRequests,
      avgCoupleTenureDays:
        tenureDaysList.length > 0
          ? Math.round(
              tenureDaysList.reduce((a, b) => a + b, 0) / tenureDaysList.length
            )
          : 0,
      pushEnabledUsers: pushUsers.size,
      pushReachPct:
        totalUsers > 0 ? Math.round((pushUsers.size / totalUsers) * 1000) / 10 : 0,
      openReportsCount: reports.length,
    },
    breakdowns: {
      downloadsByPlatform: computeBreakdown(downloads.map((d) => d.platform)),
      downloadsBySource: computeBreakdown(downloads.map((d) => d.source)),
      datesByStatus: computeBreakdown(raw.dates.map((d) => asString(d.status))),
      datesByVibe: computeBreakdown(raw.dates.map((d) => asString(d.vibe))),
      moodDistribution: computeBreakdown(raw.daily_moods.map((m) => asString(m.mood))),
      goalKinds: computeBreakdown(raw.goals.map((g) => asString(g.kind))),
      achievementKinds: computeBreakdown(raw.achievements.map((a) => asString(a.kind))),
      preferenceMarks: computeBreakdown(raw.preference_items.map((p) => asString(p.mark))),
      sessionDurationBuckets,
    },
    productMetrics: {
      totalDates,
      outdoorDates,
      indoorDates,
      totalOutfits: raw.outfits.length,
      outfitCoordinationRatePct:
        totalDates > 0
          ? Math.round((dateIdsWithOutfits.size / totalDates) * 1000) / 10
          : 0,
      totalGoals,
      completedGoals,
      goalCompletionRatePct:
        totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 1000) / 10 : 0,
      totalGoalItems: raw.goal_items.length,
      avgGoalTargetCount:
        targetCounts.length > 0
          ? Math.round(
              (targetCounts.reduce((a, b) => a + b, 0) / targetCounts.length) * 10
            ) / 10
          : 0,
      totalAchievements: raw.achievements.length,
      totalDailyMoods: raw.daily_moods.length,
      totalPreferenceItems: raw.preference_items.length,
      totalPushTokens: raw.push_tokens.length,
      totalAnalyticsEvents: raw.analytics_events.length,
    },
    timeSeries: [...seriesMap.values()],
    downloads,
    users,
    reports,
    topEvents: computeBreakdown(
      raw.analytics_events.map((e) => asString(e.event_name)),
      8
    ),
  };
}

async function safeSelectTable(
  supabase: SupabaseClient,
  table: string,
  category: "existing" | "analytics",
  limit = 5000
): Promise<{ rows: GenericRow[]; health: TableHealth }> {
  const { data, error, count } = await supabase
    .from(table)
    .select("*", { count: "exact" })
    .limit(limit);

  if (error) {
    const code = error.code ?? "";
    const msg = error.message ?? "Query failed";
    const isMissing =
      code === "42P01" ||
      code === "PGRST205" ||
      msg.toLowerCase().includes("does not exist") ||
      msg.toLowerCase().includes("could not find the table");

    return {
      rows: [],
      health: {
        table,
        category,
        state: isMissing ? "missing" : "error",
        rowCount: 0,
        message: msg,
      },
    };
  }

  return {
    rows: (data as GenericRow[]) ?? [],
    health: {
      table,
      category,
      state: "connected",
      rowCount: count ?? data?.length ?? 0,
    },
  };
}

async function safeListAuthUsers(supabase: SupabaseClient) {
  try {
    const users: RawAnalyticsDataset["authUsers"] = [];
    let page = 1;
    const perPage = 1000;

    while (page <= 5) {
      const { data, error } = await supabase.auth.admin.listUsers({
        page,
        perPage,
      });
      if (error || !data?.users?.length) break;
      for (const u of data.users) {
        users.push({
          id: u.id,
          email: u.email ?? null,
          created_at: u.created_at ?? null,
          last_sign_in_at: u.last_sign_in_at ?? null,
          user_metadata: (u.user_metadata as Record<string, unknown>) ?? null,
        });
      }
      if (data.users.length < perPage) break;
      page += 1;
    }

    return users;
  } catch {
    return [];
  }
}

export async function fetchAdminDashboardData(
  rangeDays = 30
): Promise<AdminDashboardData | null> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const [
    authUsers,
    usersRes,
    couplesRes,
    datesRes,
    outfitsRes,
    moodsRes,
    goalsRes,
    goalItemsRes,
    achievementsRes,
    prefsRes,
    pushRes,
    reportsRes,
    downloadsRes,
    sessionsRes,
    eventsRes,
  ] = await Promise.all([
    safeListAuthUsers(supabase),
    safeSelectTable(supabase, "users", "existing"),
    safeSelectTable(supabase, "couples", "existing"),
    safeSelectTable(supabase, "dates", "existing"),
    safeSelectTable(supabase, "outfits", "existing"),
    safeSelectTable(supabase, "daily_moods", "existing"),
    safeSelectTable(supabase, "goals", "existing"),
    safeSelectTable(supabase, "goal_items", "existing"),
    safeSelectTable(supabase, "achievements", "existing"),
    safeSelectTable(supabase, "preference_items", "existing"),
    safeSelectTable(supabase, "push_tokens", "existing"),
    safeSelectTable(supabase, "reports", "existing"),
    safeSelectTable(supabase, "app_downloads", "analytics"),
    safeSelectTable(supabase, "user_sessions", "analytics"),
    safeSelectTable(supabase, "analytics_events", "analytics"),
  ]);

  return buildAdminDashboardData(
    {
      authUsers,
      users: usersRes.rows,
      couples: couplesRes.rows,
      dates: datesRes.rows,
      outfits: outfitsRes.rows,
      daily_moods: moodsRes.rows,
      goals: goalsRes.rows,
      goal_items: goalItemsRes.rows,
      achievements: achievementsRes.rows,
      preference_items: prefsRes.rows,
      push_tokens: pushRes.rows,
      reports: reportsRes.rows,
      app_downloads: downloadsRes.rows,
      user_sessions: sessionsRes.rows,
      analytics_events: eventsRes.rows,
      tableHealth: [
        usersRes.health,
        couplesRes.health,
        datesRes.health,
        outfitsRes.health,
        moodsRes.health,
        goalsRes.health,
        goalItemsRes.health,
        achievementsRes.health,
        prefsRes.health,
        pushRes.health,
        reportsRes.health,
        downloadsRes.health,
        sessionsRes.health,
        eventsRes.health,
      ],
    },
    { mode: "live", rangeDays }
  );
}
