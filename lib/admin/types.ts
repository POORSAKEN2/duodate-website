export type TableConnectionState = "connected" | "missing" | "error";

export interface TableHealth {
  table: string;
  category: "existing" | "analytics";
  state: TableConnectionState;
  rowCount: number;
  message?: string;
}

export interface DownloadEntry {
  id: string;
  userId: string | null;
  who: string;
  email: string | null;
  platform: "ios" | "android" | "web" | "unknown";
  source: "app_install" | "website_store_click" | "waitlist" | "direct" | string;
  appVersion: string | null;
  osVersion: string | null;
  deviceModel: string | null;
  country: string | null;
  referrer: string | null;
  downloadedAt: string;
}

export interface UserUsageSummary {
  userId: string;
  displayName: string;
  email: string | null;
  joinedAt: string | null;
  lastActiveAt: string | null;
  coupleStatus: "active" | "ended" | "solo";
  sessionCount: number;
  totalUsageSeconds: number;
  avgSessionSeconds: number;
  screensViewedTotal: number;
  hasPushEnabled: boolean;
  datesCount: number;
  moodsCount: number;
  preferencesCount: number;
  platform: string;
}

export interface ReportEntry {
  id: string;
  reportedId: string;
  reportedName: string;
  reason: string;
  details: string | null;
  createdAt: string;
}

export interface BreakdownItem {
  label: string;
  count: number;
  percentage: number;
}

export interface DailySeriesPoint {
  date: string; // YYYY-MM-DD
  label: string;
  downloads: number;
  newUsers: number;
  sessions: number;
  datesPlanned: number;
}

export interface AdminDashboardData {
  mode: "live" | "demo";
  generatedAt: string;
  rangeDays: number;
  tableHealth: TableHealth[];
  overview: {
    totalDownloads: number;
    downloadsToday: number;
    downloads7d: number;
    downloads30d: number;
    totalUsers: number;
    newUsers7d: number;
    dau: number;
    wau: number;
    mau: number;
    usageSource: "user_sessions" | "activity_fallback";
    avgUsagePerUserSeconds: number;
    avgSessionDurationSeconds: number;
    medianSessionDurationSeconds: number;
    totalUsageHours: number;
    totalSessions: number;
    totalCouples: number;
    activeCouples: number;
    endedCouples: number;
    reunionRequests: number;
    avgCoupleTenureDays: number;
    pushEnabledUsers: number;
    pushReachPct: number;
    openReportsCount: number;
  };
  breakdowns: {
    downloadsByPlatform: BreakdownItem[];
    downloadsBySource: BreakdownItem[];
    datesByStatus: BreakdownItem[];
    datesByVibe: BreakdownItem[];
    moodDistribution: BreakdownItem[];
    goalKinds: BreakdownItem[];
    achievementKinds: BreakdownItem[];
    preferenceMarks: BreakdownItem[];
    sessionDurationBuckets: BreakdownItem[];
  };
  productMetrics: {
    totalDates: number;
    outdoorDates: number;
    indoorDates: number;
    totalOutfits: number;
    outfitCoordinationRatePct: number;
    totalGoals: number;
    completedGoals: number;
    goalCompletionRatePct: number;
    totalGoalItems: number;
    avgGoalTargetCount: number;
    totalAchievements: number;
    totalDailyMoods: number;
    totalPreferenceItems: number;
    totalPushTokens: number;
    totalAnalyticsEvents: number;
  };
  timeSeries: DailySeriesPoint[];
  downloads: DownloadEntry[];
  users: UserUsageSummary[];
  reports: ReportEntry[];
  topEvents: BreakdownItem[];
}
