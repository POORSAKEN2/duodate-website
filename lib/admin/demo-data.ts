import { buildAdminDashboardData, type RawAnalyticsDataset } from "./analytics";
import type { AdminDashboardData } from "./types";

export function getDemoDashboardData(rangeDays = 30): AdminDashboardData {
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString();
  const daysAgo = (d: number, extraHours = 0) =>
    new Date(now.getTime() - d * 86_400_000 - extraHours * 3_600_000).toISOString();

  const u1 = "11111111-1111-4111-8111-111111111101";
  const u2 = "11111111-1111-4111-8111-111111111102";
  const u3 = "11111111-1111-4111-8111-111111111103";
  const u4 = "11111111-1111-4111-8111-111111111104";
  const u5 = "11111111-1111-4111-8111-111111111105";
  const u6 = "11111111-1111-4111-8111-111111111106";

  const c1 = "22222222-2222-4222-8222-222222222201";
  const c2 = "22222222-2222-4222-8222-222222222202";
  const c3 = "22222222-2222-4222-8222-222222222203";

  const d1 = "33333333-3333-4333-8333-333333333301";
  const d2 = "33333333-3333-4333-8333-333333333302";
  const d3 = "33333333-3333-4333-8333-333333333303";
  const d4 = "33333333-3333-4333-8333-333333333304";
  const d5 = "33333333-3333-4333-8333-333333333305";

  const raw: RawAnalyticsDataset = {
    authUsers: [
      { id: u1, email: "maya.lin@example.com", created_at: daysAgo(24), last_sign_in_at: hoursAgo(2) },
      { id: u2, email: "liam.ortiz@example.com", created_at: daysAgo(24), last_sign_in_at: hoursAgo(3) },
      { id: u3, email: "chloe.park@example.com", created_at: daysAgo(15), last_sign_in_at: hoursAgo(12) },
      { id: u4, email: "noah.kim@example.com", created_at: daysAgo(14), last_sign_in_at: daysAgo(1) },
      { id: u5, email: "sofia.reyes@example.com", created_at: daysAgo(5), last_sign_in_at: daysAgo(2) },
      { id: u6, email: "ethan.cole@example.com", created_at: daysAgo(2), last_sign_in_at: hoursAgo(5) },
    ],
    users: [
      { id: u1, display_name: "Maya Lin" },
      { id: u2, display_name: "Liam Ortiz" },
      { id: u3, display_name: "Chloe Park" },
      { id: u4, display_name: "Noah Kim" },
      { id: u5, display_name: "Sofia Reyes" },
      { id: u6, display_name: "Ethan Cole" },
    ],
    couples: [
      { id: c1, user1_id: u1, user2_id: u2, invite_code: "DUO-8841", created_at: daysAgo(23), together_since: "2024-06-14", ended_at: null, user2_wants_back: false },
      { id: c2, user1_id: u3, user2_id: u4, invite_code: "DUO-3192", created_at: daysAgo(14), together_since: "2025-02-01", ended_at: null, user2_wants_back: false },
      { id: c3, user1_id: u5, user2_id: u6, invite_code: "DUO-5509", created_at: daysAgo(4), together_since: "2025-11-20", ended_at: daysAgo(1), user2_wants_back: true },
    ],
    dates: [
      { id: d1, couple_id: c1, title: "Sunset Rooftop Tapas", venue_name: "Luna Terrace", vibe: "romantic", is_outdoor: true, status: "completed", created_at: daysAgo(18) },
      { id: d2, couple_id: c1, title: "Botanical Garden Picnic", venue_name: "Conservatory Lawn", vibe: "cozy", is_outdoor: true, status: "planned", created_at: daysAgo(4) },
      { id: d3, couple_id: c2, title: "Late Night Ramen Run", venue_name: "Kuro Alley", vibe: "casual", is_outdoor: false, status: "completed", created_at: daysAgo(9) },
      { id: d4, couple_id: c2, title: "Pottery & Espresso", venue_name: "Clay Studio", vibe: "creative", is_outdoor: false, status: "planned", created_at: daysAgo(2) },
      { id: d5, couple_id: c3, title: "Jazz Bar Listening Room", venue_name: "Velvet Note", vibe: "dressy", is_outdoor: false, status: "cancelled", created_at: daysAgo(3) },
    ],
    outfits: [
      { id: "o1", date_id: d1, description: "Linen blazer + cream midi", updated_at: daysAgo(17) },
      { id: "o2", date_id: d2, description: "Pastel cardigan + chinos", updated_at: daysAgo(3) },
      { id: "o3", date_id: d3, description: "Oversized hoodie + denim", updated_at: daysAgo(8) },
      { id: "o4", date_id: d4, description: "Apron-friendly tee + boots", updated_at: daysAgo(1) },
    ],
    daily_moods: [
      { user_id: u1, mood: "excited", note: "Can't wait for Friday!", created_at: hoursAgo(2) },
      { user_id: u2, mood: "loved", note: "Packed picnic blanket", created_at: hoursAgo(4) },
      { user_id: u3, mood: "calm", note: "Tea & sketchbooks", created_at: hoursAgo(12) },
      { user_id: u4, mood: "playful", note: "Who gets the wheel first?", created_at: daysAgo(1) },
      { user_id: u5, mood: "reflective", note: "", created_at: daysAgo(2) },
    ],
    goals: [
      { id: "g1", couple_id: c1, kind: "date_streak", title: "12 Monthly Dates", target_count: 12, created_at: daysAgo(20), completed_at: null },
      { id: "g2", couple_id: c2, kind: "bucket_list", title: "Try 5 New Cuisines", target_count: 5, created_at: daysAgo(12), completed_at: daysAgo(2) },
    ],
    goal_items: [
      { id: "gi1", goal_id: "g1", label: "Sunset Rooftop", position: 1 },
      { id: "gi2", goal_id: "g1", label: "Botanical Picnic", position: 2 },
      { id: "gi3", goal_id: "g2", label: "Sichuan Noodles", position: 1 },
    ],
    achievements: [
      { id: "a1", couple_id: c1, kind: "first_date", goal_id: "g1", title: "First Night Out", earned_at: daysAgo(17) },
      { id: "a2", couple_id: c2, kind: "goal_master", goal_id: "g2", title: "Cuisine Explorers", earned_at: daysAgo(2) },
    ],
    preference_items: [
      { id: "p1", user_id: u1, mark: "love", updated_at: daysAgo(10) },
      { id: "p2", user_id: u2, mark: "love", updated_at: daysAgo(10) },
      { id: "p3", user_id: u3, mark: "like", updated_at: daysAgo(6) },
      { id: "p4", user_id: u4, mark: "skip", updated_at: daysAgo(6) },
    ],
    push_tokens: [
      { token: "expo-tok-1", user_id: u1, platform: "android" },
      { token: "expo-tok-2", user_id: u2, platform: "ios" },
      { token: "expo-tok-3", user_id: u3, platform: "android" },
      { token: "expo-tok-4", user_id: u6, platform: "android" },
    ],
    reports: [
      { id: "r1", reported_id: u6, reason: "Spam invite attempts", details: "Repeated invite code retries in 5 minutes", created_at: daysAgo(1, 3) },
    ],
    app_downloads: [
      { id: "dl1", user_id: u6, downloader_name: "Ethan Cole", downloader_email: "ethan.cole@example.com", platform: "android", source: "app_install", app_version: "1.0.4", device_model: "Pixel 9", country: "PH", downloaded_at: hoursAgo(5) },
      { id: "dl2", user_id: null, downloader_name: "Web Visitor", downloader_email: null, platform: "android", source: "website_store_click", app_version: null, device_model: "Mobile Chrome", country: "US", referrer: "https://duodate.app/", downloaded_at: hoursAgo(9) },
      { id: "dl3", user_id: u5, downloader_name: "Sofia Reyes", downloader_email: "sofia.reyes@example.com", platform: "ios", source: "app_install", app_version: "1.0.4", device_model: "iPhone 16", country: "PH", downloaded_at: daysAgo(2, 4) },
      { id: "dl4", user_id: u3, downloader_name: "Chloe Park", downloader_email: "chloe.park@example.com", platform: "android", source: "app_install", app_version: "1.0.3", device_model: "Galaxy S24", country: "SG", downloaded_at: daysAgo(6, 2) },
      { id: "dl5", user_id: u4, downloader_name: "Noah Kim", downloader_email: "noah.kim@example.com", platform: "ios", source: "app_install", app_version: "1.0.3", device_model: "iPhone 15 Pro", country: "SG", downloaded_at: daysAgo(14, 1) },
      { id: "dl6", user_id: u1, downloader_name: "Maya Lin", downloader_email: "maya.lin@example.com", platform: "android", source: "app_install", app_version: "1.0.1", device_model: "Pixel 8", country: "US", downloaded_at: daysAgo(24, 3) },
      { id: "dl7", user_id: u2, downloader_name: "Liam Ortiz", downloader_email: "liam.ortiz@example.com", platform: "ios", source: "app_install", app_version: "1.0.1", device_model: "iPhone 15", country: "US", downloaded_at: daysAgo(24, 2) },
    ],
    user_sessions: [
      { id: "s1", user_id: u1, platform: "android", duration_seconds: 840, screens_viewed: 12, started_at: hoursAgo(3) },
      { id: "s2", user_id: u1, platform: "android", duration_seconds: 1260, screens_viewed: 18, started_at: daysAgo(2) },
      { id: "s3", user_id: u2, platform: "ios", duration_seconds: 690, screens_viewed: 9, started_at: hoursAgo(4) },
      { id: "s4", user_id: u3, platform: "android", duration_seconds: 510, screens_viewed: 7, started_at: hoursAgo(13) },
      { id: "s5", user_id: u4, platform: "ios", duration_seconds: 420, screens_viewed: 6, started_at: daysAgo(1) },
      { id: "s6", user_id: u5, platform: "ios", duration_seconds: 310, screens_viewed: 4, started_at: daysAgo(2) },
      { id: "s7", user_id: u6, platform: "android", duration_seconds: 980, screens_viewed: 14, started_at: hoursAgo(6) },
    ],
    analytics_events: [
      { id: "e1", user_id: u1, event_name: "date_created", created_at: daysAgo(4) },
      { id: "e2", user_id: u1, event_name: "outfit_synced", created_at: daysAgo(3) },
      { id: "e3", user_id: u2, event_name: "mood_checked_in", created_at: hoursAgo(4) },
      { id: "e4", user_id: u3, event_name: "date_created", created_at: daysAgo(2) },
      { id: "e5", user_id: u6, event_name: "onboarding_completed", created_at: hoursAgo(5) },
    ],
    tableHealth: [
      { table: "users", category: "existing", state: "connected", rowCount: 6 },
      { table: "couples", category: "existing", state: "connected", rowCount: 3 },
      { table: "dates", category: "existing", state: "connected", rowCount: 5 },
      { table: "outfits", category: "existing", state: "connected", rowCount: 4 },
      { table: "daily_moods", category: "existing", state: "connected", rowCount: 5 },
      { table: "goals", category: "existing", state: "connected", rowCount: 2 },
      { table: "goal_items", category: "existing", state: "connected", rowCount: 3 },
      { table: "achievements", category: "existing", state: "connected", rowCount: 2 },
      { table: "preference_items", category: "existing", state: "connected", rowCount: 4 },
      { table: "push_tokens", category: "existing", state: "connected", rowCount: 4 },
      { table: "reports", category: "existing", state: "connected", rowCount: 1 },
      { table: "app_downloads", category: "analytics", state: "connected", rowCount: 7 },
      { table: "user_sessions", category: "analytics", state: "connected", rowCount: 7 },
      { table: "analytics_events", category: "analytics", state: "connected", rowCount: 5 },
    ],
  };

  return buildAdminDashboardData(raw, { mode: "demo", rangeDays, now });
}
