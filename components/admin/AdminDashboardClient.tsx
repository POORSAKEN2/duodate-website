"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  escapeCsvCell,
  formatCompactNumber,
  formatDateTime,
  formatDuration,
  formatRelativeTime,
} from "@/lib/admin/format";
import type {
  AdminDashboardData,
  DownloadEntry,
  ReportEntry,
  UserUsageSummary,
} from "@/lib/admin/types";
import { BreakdownCard, TrendAreaChart } from "./AnalyticsCharts";
import SortableDataTable, { type TableColumn } from "./SortableDataTable";

type TabId = "overview" | "downloads" | "users" | "product" | "reports" | "setup";

const TABS: Array<{ id: TabId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "downloads", label: "App Downloads" },
  { id: "users", label: "Usage & Time" },
  { id: "product", label: "Couples & Product" },
  { id: "reports", label: "Safety Reports" },
  { id: "setup", label: "Supabase Setup" },
];

function KpiCard({
  label,
  value,
  sublabel,
  badge,
  accent = false,
}: {
  label: string;
  value: string;
  sublabel: string;
  badge?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 transition-colors ${
        accent
          ? "border-[#E05A6D]/25 bg-[#FCE7EB]/45"
          : "border-[#E8E8ED] bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73]">
          {label}
        </p>
        {badge && (
          <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#A62639] ring-1 ring-[#E05A6D]/20">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 font-heading text-3xl font-bold tracking-tight tabular-nums text-[#1D1D1F]">
        {value}
      </p>
      <p className="mt-1.5 text-xs text-[#6E6E73]">{sublabel}</p>
    </div>
  );
}

function PlatformPill({ platform }: { platform: string }) {
  const lower = platform.toLowerCase();
  const styles =
    lower === "ios"
      ? "bg-[#1D1D1F] text-white"
      : lower === "android"
      ? "bg-[#E7F6EC] text-[#146C34]"
      : lower === "web"
      ? "bg-[#EBF2FF] text-[#1D4ED8]"
      : "bg-[#F5F5F7] text-[#6E6E73]";
  const label =
    lower === "ios"
      ? "iOS"
      : lower === "android"
      ? "Android"
      : lower === "web"
      ? "Web"
      : "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}
    >
      {label}
    </span>
  );
}

function CoupleStatusPill({ status }: { status: UserUsageSummary["coupleStatus"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#FCE7EB] px-2.5 py-0.5 text-xs font-semibold text-[#A62639]">
        Active Couple
      </span>
    );
  }
  if (status === "ended") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#F5F5F7] px-2.5 py-0.5 text-xs font-semibold text-[#6E6E73]">
        Ended
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[#F5F5F7] px-2.5 py-0.5 text-xs font-medium text-[#6E6E73]">
      Solo
    </span>
  );
}

function triggerCsvDownload(filename: string, headers: string[], rows: unknown[][]) {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((r) => r.map(escapeCsvCell).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

const MOBILE_SESSION_SNIPPET = `// Inside your DuoDate mobile app (Expo / React Native / Flutter)
// Call when app enters foreground, periodically every 60s, and when backgrounded:
const { data: { session } } = await supabase.auth.getSession();

// 1) Start session (on app open)
const startRes = await fetch("https://YOUR_WEBSITE_DOMAIN/api/analytics/session", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${session.access_token}\`,
  },
  body: JSON.stringify({
    action: "start",
    platform: Platform.OS, // "ios" | "android"
    appVersion: Application.nativeApplicationVersion,
    deviceId: installationId,
  }),
});
const { sessionId } = await startRes.json();

// 2) End session (on app background / close)
await fetch("https://YOUR_WEBSITE_DOMAIN/api/analytics/session", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${session.access_token}\`,
  },
  body: JSON.stringify({
    action: "end",
    sessionId,
    screensViewed: screenCount,
  }),
});`;

const MOBILE_DOWNLOAD_SNIPPET = `// Call once on first app launch (store a boolean in AsyncStorage/SecureStore)
await fetch("https://YOUR_WEBSITE_DOMAIN/api/analytics/download", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: user?.id ?? null,
    name: user?.displayName ?? null,
    email: user?.email ?? null,
    deviceId: installationId,
    platform: Platform.OS, // "ios" | "android"
    source: "app_install",
    appVersion: Application.nativeApplicationVersion,
    deviceModel: Device.modelName,
  }),
});`;

export default function AdminDashboardClient({
  initialData,
  isAuthConfigured,
}: {
  initialData: AdminDashboardData;
  isAuthConfigured: boolean;
}) {
  const router = useRouter();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [data, setData] = useState<AdminDashboardData>(initialData);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Downloads filters
  const [downloadSearch, setDownloadSearch] = useState("");
  const [downloadPlatform, setDownloadPlatform] = useState<string>("all");
  const [downloadSource, setDownloadSource] = useState<string>("all");

  // Users filters
  const [userSearch, setUserSearch] = useState("");
  const [userCoupleFilter, setUserCoupleFilter] = useState<string>("all");

  const missingAnalyticsTables = useMemo(
    () =>
      data.tableHealth.filter(
        (t) => t.category === "analytics" && t.state === "missing"
      ),
    [data.tableHealth]
  );

  async function refreshData(days = data.rangeDays) {
    setRefreshing(true);
    try {
      const query = new URLSearchParams({
        days: String(days),
        ...(data.mode === "demo" ? { demo: "1" } : {}),
      });
      const res = await fetch(`/api/admin/analytics?${query.toString()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const next = (await res.json()) as AdminDashboardData;
        setData(next);
      } else if (res.status === 401) {
        router.push("/admin/login");
      }
    } finally {
      setRefreshing(false);
    }
  }

  async function handleSignOut() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  async function copySnippet(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Clipboard blocked
    }
  }

  function handleTabKeyDown(e: React.KeyboardEvent, idx: number) {
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = TABS.length - 1;

    if (nextIdx !== null) {
      e.preventDefault();
      const targetTab = TABS[nextIdx];
      setActiveTab(targetTab.id);
      tabRefs.current[nextIdx]?.focus();
    }
  }

  // Filtered downloads
  const filteredDownloads = useMemo(() => {
    const q = downloadSearch.trim().toLowerCase();
    return data.downloads.filter((d) => {
      if (downloadPlatform !== "all" && d.platform !== downloadPlatform) return false;
      if (downloadSource !== "all" && d.source !== downloadSource) return false;
      if (!q) return true;
      return (
        d.who.toLowerCase().includes(q) ||
        (d.email?.toLowerCase().includes(q) ?? false) ||
        (d.deviceModel?.toLowerCase().includes(q) ?? false) ||
        (d.country?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [data.downloads, downloadSearch, downloadPlatform, downloadSource]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    return data.users.filter((u) => {
      if (userCoupleFilter !== "all" && u.coupleStatus !== userCoupleFilter) {
        return false;
      }
      if (!q) return true;
      return (
        u.displayName.toLowerCase().includes(q) ||
        (u.email?.toLowerCase().includes(q) ?? false) ||
        u.userId.toLowerCase().includes(q)
      );
    });
  }, [data.users, userSearch, userCoupleFilter]);

  const downloadColumns: TableColumn<DownloadEntry>[] = useMemo(
    () => [
      {
        key: "who",
        label: "Who Downloaded",
        type: "string",
        sortable: true,
        sortValue: (row) => row.who,
        render: (row) => (
          <div>
            <div className="font-semibold text-[#1D1D1F]">{row.who}</div>
            {row.email && (
              <div className="text-xs text-[#6E6E73]">{row.email}</div>
            )}
          </div>
        ),
      },
      {
        key: "downloadedAt",
        label: "Date & Time",
        type: "date",
        sortable: true,
        sortValue: (row) => Date.parse(row.downloadedAt) || 0,
        render: (row) => {
          const dt = formatDateTime(row.downloadedAt);
          return (
            <time dateTime={row.downloadedAt} className="block tabular-nums">
              <span className="font-medium text-[#1D1D1F]">{dt.date}</span>
              <span className="block text-xs text-[#6E6E73]">
                {dt.time} · {formatRelativeTime(row.downloadedAt)}
              </span>
            </time>
          );
        },
      },
      {
        key: "platform",
        label: "Platform",
        type: "string",
        sortable: true,
        sortValue: (row) => row.platform,
        render: (row) => <PlatformPill platform={row.platform} />,
      },
      {
        key: "source",
        label: "Source",
        type: "string",
        sortable: true,
        sortValue: (row) => row.source,
        render: (row) => (
          <span className="rounded-lg bg-[#F5F5F7] px-2 py-0.5 text-xs font-medium capitalize text-[#1D1D1F]">
            {row.source.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        key: "device",
        label: "Device / Version",
        type: "string",
        sortable: true,
        sortValue: (row) => row.deviceModel ?? row.appVersion ?? "",
        render: (row) => (
          <div className="text-xs">
            <span className="font-medium text-[#1D1D1F]">
              {row.deviceModel ?? "—"}
            </span>
            {row.appVersion && (
              <span className="ml-1.5 text-[#6E6E73]">v{row.appVersion}</span>
            )}
          </div>
        ),
      },
      {
        key: "country",
        label: "Region",
        type: "string",
        sortable: true,
        sortValue: (row) => row.country ?? "",
        render: (row) => (
          <span className="text-xs font-medium uppercase text-[#6E6E73]">
            {row.country ?? "—"}
          </span>
        ),
      },
    ],
    []
  );

  const userColumns: TableColumn<UserUsageSummary>[] = useMemo(
    () => [
      {
        key: "displayName",
        label: "User",
        type: "string",
        sortable: true,
        sortValue: (row) => row.displayName,
        render: (row) => (
          <div>
            <div className="font-semibold text-[#1D1D1F]">
              {row.displayName}
            </div>
            <div className="text-xs text-[#6E6E73]">
              {row.email ?? `${row.userId.slice(0, 8)}…`}
            </div>
          </div>
        ),
      },
      {
        key: "coupleStatus",
        label: "Couple",
        type: "string",
        sortable: true,
        sortValue: (row) => row.coupleStatus,
        render: (row) => <CoupleStatusPill status={row.coupleStatus} />,
      },
      {
        key: "avgSessionSeconds",
        label: "Avg Time / Session",
        type: "number",
        sortable: true,
        align: "right",
        sortValue: (row) => row.avgSessionSeconds,
        render: (row) => (
          <span className="font-semibold tabular-nums text-[#1D1D1F]">
            {row.sessionCount > 0 ? formatDuration(row.avgSessionSeconds) : "—"}
          </span>
        ),
      },
      {
        key: "totalUsageSeconds",
        label: "Total Time Used",
        type: "number",
        sortable: true,
        align: "right",
        sortValue: (row) => row.totalUsageSeconds,
        render: (row) => (
          <span className="tabular-nums text-[#1D1D1F]">
            {row.totalUsageSeconds > 0
              ? formatDuration(row.totalUsageSeconds)
              : "—"}
          </span>
        ),
      },
      {
        key: "sessionCount",
        label: "Sessions",
        type: "number",
        sortable: true,
        align: "right",
        sortValue: (row) => row.sessionCount,
        render: (row) => (
          <span className="tabular-nums text-[#1D1D1F]">{row.sessionCount}</span>
        ),
      },
      {
        key: "activity",
        label: "Dates / Moods",
        type: "number",
        sortable: true,
        align: "right",
        sortValue: (row) => row.datesCount + row.moodsCount,
        render: (row) => (
          <span className="text-xs tabular-nums text-[#6E6E73]">
            {row.datesCount}d · {row.moodsCount}m
          </span>
        ),
      },
      {
        key: "lastActiveAt",
        label: "Last Active",
        type: "date",
        sortable: true,
        sortValue: (row) => (row.lastActiveAt ? Date.parse(row.lastActiveAt) : 0),
        render: (row) => {
          if (!row.lastActiveAt) {
            return <span className="text-xs text-[#98989D]">No activity</span>;
          }
          const dt = formatDateTime(row.lastActiveAt);
          return (
            <time dateTime={row.lastActiveAt} className="block text-xs tabular-nums">
              <span className="font-medium text-[#1D1D1F]">{dt.date}</span>
              <span className="block text-[#6E6E73]">
                {formatRelativeTime(row.lastActiveAt)}
              </span>
            </time>
          );
        },
      },
    ],
    []
  );

  const reportColumns: TableColumn<ReportEntry>[] = useMemo(
    () => [
      {
        key: "reportedName",
        label: "Reported User",
        type: "string",
        sortable: true,
        sortValue: (row) => row.reportedName,
        render: (row) => (
          <div>
            <div className="font-semibold text-[#1D1D1F]">{row.reportedName}</div>
            <div className="font-mono text-[11px] text-[#6E6E73]">
              {row.reportedId}
            </div>
          </div>
        ),
      },
      {
        key: "reason",
        label: "Reason",
        type: "string",
        sortable: true,
        sortValue: (row) => row.reason,
        render: (row) => (
          <span className="inline-flex rounded-full bg-[#FCE7EB] px-2.5 py-0.5 text-xs font-semibold text-[#A62639]">
            {row.reason}
          </span>
        ),
      },
      {
        key: "details",
        label: "Details",
        type: "string",
        sortable: false,
        render: (row) => (
          <span className="text-xs text-[#6E6E73]">
            {row.details ?? "No extra details"}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Submitted",
        type: "date",
        sortable: true,
        sortValue: (row) => Date.parse(row.createdAt) || 0,
        render: (row) => {
          const dt = formatDateTime(row.createdAt);
          return (
            <time dateTime={row.createdAt} className="block text-xs tabular-nums">
              <span className="font-medium text-[#1D1D1F]">{dt.date}</span>
              <span className="block text-[#6E6E73]">{dt.time}</span>
            </time>
          );
        },
      },
    ],
    []
  );

  const { overview, productMetrics, breakdowns } = data;

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F]">
      {/* Sticky Translucent Header */}
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-[#1D1D1F] transition-colors hover:text-[#E05A6D]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#E05A6D] font-heading text-sm font-bold text-white">
                D
              </span>
              DuoDate Admin
            </Link>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                data.mode === "live"
                  ? "bg-[#E7F6EC] text-[#146C34]"
                  : "bg-[#FEF3C7] text-[#92400E]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                  data.mode === "live" ? "bg-[#16A34A]" : "bg-[#D97706]"
                }`}
              />
              {data.mode === "live" ? "Live Supabase" : "Demo Preview"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Date range"
              className="inline-flex rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] p-0.5 text-xs"
            >
              {[7, 14, 30, 90].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => refreshData(days)}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                    data.rangeDays === days
                      ? "bg-white text-[#1D1D1F] shadow-xs"
                      : "text-[#6E6E73] hover:text-[#1D1D1F]"
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => refreshData(data.rangeDays)}
              disabled={refreshing}
              className="rounded-xl border border-[#E8E8ED] bg-white px-3 py-1.5 text-xs font-semibold text-[#1D1D1F] transition-all hover:bg-[#F5F5F7] active:scale-[0.98] disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            {isAuthConfigured && (
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-xl bg-[#1D1D1F] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-black active:scale-[0.98]"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Accessible Tablist */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div
            role="tablist"
            aria-label="Admin dashboard sections"
            className="admin-tablist gap-6 border-t border-black/[0.04]"
          >
            {TABS.map((tab, idx) => {
              const selected = activeTab === tab.id;
              const badgeCount =
                tab.id === "downloads"
                  ? overview.totalDownloads
                  : tab.id === "reports"
                  ? overview.openReportsCount
                  : null;

              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`admin-tab inline-flex items-center gap-2 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E05A6D] ${
                    selected
                      ? "text-[#A62639]"
                      : "text-[#6E6E73] hover:text-[#1D1D1F]"
                  }`}
                >
                  <span>{tab.label}</span>
                  {badgeCount !== null && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] tabular-nums ${
                        selected
                          ? "bg-[#FCE7EB] text-[#A62639]"
                          : "bg-[#F5F5F7] text-[#6E6E73]"
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* Missing Analytics Tables Banner (Live mode only) */}
        {data.mode === "live" && missingAnalyticsTables.length > 0 && (
          <div className="flex flex-col justify-between gap-3 rounded-3xl border border-[#F59E0B]/40 bg-[#FFFBEB] p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-heading text-base font-bold text-[#92400E]">
                Action needed in Supabase: run the analytics SQL migration
              </h2>
              <p className="mt-1 text-xs text-[#78350F]">
                Your existing DuoDate tables are connected, but{" "}
                <strong>
                  {missingAnalyticsTables.map((t) => t.table).join(", ")}
                </strong>{" "}
                {missingAnalyticsTables.length === 1 ? "is" : "are"} not created yet. Run{" "}
                <code>supabase/admin_analytics_setup.sql</code> in Supabase SQL Editor to start logging app downloads and per-user session time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("setup")}
              className="flex-shrink-0 rounded-xl bg-[#92400E] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#78350F]"
            >
              View Setup Guide
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        <section
          role="tabpanel"
          id="panel-overview"
          aria-labelledby="tab-overview"
          hidden={activeTab !== "overview"}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <KpiCard
              label="Total Downloads"
              value={formatCompactNumber(overview.totalDownloads)}
              badge={`+${overview.downloadsToday} today`}
              sublabel={`${overview.downloads7d} last 7d · ${overview.downloads30d} last 30d`}
              accent
            />
            <KpiCard
              label="Avg Use / User"
              value={formatDuration(overview.avgUsagePerUserSeconds)}
              sublabel={`Avg session ${formatDuration(
                overview.avgSessionDurationSeconds
              )} · Median ${formatDuration(overview.medianSessionDurationSeconds)}`}
            />
            <KpiCard
              label="Registered Users"
              value={formatCompactNumber(overview.totalUsers)}
              badge={`+${overview.newUsers7d} / 7d`}
              sublabel={`DAU ${overview.dau} · WAU ${overview.wau} · MAU ${overview.mau}`}
            />
            <KpiCard
              label="Active Couples"
              value={formatCompactNumber(overview.activeCouples)}
              sublabel={`${overview.totalCouples} total · ${overview.endedCouples} ended · ${overview.reunionRequests} wants back`}
            />
            <KpiCard
              label="Dates Planned"
              value={formatCompactNumber(productMetrics.totalDates)}
              sublabel={`${productMetrics.outfitCoordinationRatePct}% with outfits · ${productMetrics.outdoorDates} outdoor`}
            />
            <KpiCard
              label="Push Reach"
              value={`${overview.pushReachPct}%`}
              sublabel={`${overview.pushEnabledUsers} users · ${overview.openReportsCount} safety reports`}
            />
          </div>

          <TrendAreaChart data={data.timeSeries} rangeDays={data.rangeDays} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <BreakdownCard
              title="Downloads by Platform"
              subtitle="iOS vs Android vs Web clicks"
              items={breakdowns.downloadsByPlatform}
              emptyText="No download records yet"
            />
            <BreakdownCard
              title="Session Duration Split"
              subtitle={`Total ${overview.totalUsageHours}h across ${overview.totalSessions} sessions`}
              items={breakdowns.sessionDurationBuckets}
              emptyText="No usage sessions recorded yet"
              accent="#2563EB"
            />
            <BreakdownCard
              title="Date Vibes"
              subtitle="Most chosen vibes across couples"
              items={breakdowns.datesByVibe}
              emptyText="No dates planned yet"
              accent="#059669"
            />
            <BreakdownCard
              title="Daily Moods"
              subtitle={`${productMetrics.totalDailyMoods} mood check-ins`}
              items={breakdowns.moodDistribution}
              emptyText="No mood check-ins yet"
              accent="#7C3AED"
            />
          </div>
        </section>

        {/* TAB 2: APP DOWNLOADS */}
        <section
          role="tabpanel"
          id="panel-downloads"
          aria-labelledby="tab-downloads"
          hidden={activeTab !== "downloads"}
          className="space-y-4"
        >
          <div className="flex flex-col justify-between gap-3 rounded-3xl border border-[#E8E8ED] bg-white p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-heading text-xl font-bold text-[#1D1D1F]">
                App Downloads &amp; Install Log
              </h2>
              <p className="text-xs text-[#6E6E73]">
                Every recorded app download and store click with exact date, time, platform, and user attribution.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                triggerCsvDownload(
                  `duodate-downloads-${new Date().toISOString().slice(0, 10)}.csv`,
                  [
                    "Who",
                    "Email",
                    "Date & Time (ISO)",
                    "Platform",
                    "Source",
                    "Device Model",
                    "App Version",
                    "Country",
                  ],
                  filteredDownloads.map((d) => [
                    d.who,
                    d.email ?? "",
                    d.downloadedAt,
                    d.platform,
                    d.source,
                    d.deviceModel ?? "",
                    d.appVersion ?? "",
                    d.country ?? "",
                  ])
                )
              }
              className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] px-4 py-2 text-xs font-semibold text-[#1D1D1F] transition-colors hover:bg-[#E8E8ED]"
            >
              Export CSV ({filteredDownloads.length})
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="search"
              value={downloadSearch}
              onChange={(e) => setDownloadSearch(e.target.value)}
              placeholder="Search name, email, device, or country..."
              aria-label="Search app downloads"
              className="rounded-2xl border border-[#E8E8ED] bg-white px-4 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#98989D] focus:border-[#E05A6D] focus:outline-none focus:ring-2 focus:ring-[#E05A6D]/25"
            />
            <select
              value={downloadPlatform}
              onChange={(e) => setDownloadPlatform(e.target.value)}
              aria-label="Filter by platform"
              className="rounded-2xl border border-[#E8E8ED] bg-white px-4 py-2.5 text-sm text-[#1D1D1F] focus:border-[#E05A6D] focus:outline-none focus:ring-2 focus:ring-[#E05A6D]/25"
            >
              <option value="all">All platforms</option>
              <option value="android">Android</option>
              <option value="ios">iOS</option>
              <option value="web">Web</option>
              <option value="unknown">Unknown</option>
            </select>
            <select
              value={downloadSource}
              onChange={(e) => setDownloadSource(e.target.value)}
              aria-label="Filter by download source"
              className="rounded-2xl border border-[#E8E8ED] bg-white px-4 py-2.5 text-sm text-[#1D1D1F] focus:border-[#E05A6D] focus:outline-none focus:ring-2 focus:ring-[#E05A6D]/25"
            >
              <option value="all">All sources</option>
              <option value="app_install">App Install (First Open)</option>
              <option value="website_store_click">Website Store Click</option>
              <option value="waitlist">Waitlist</option>
              <option value="direct">Direct</option>
            </select>
          </div>

          <SortableDataTable
            caption="App Downloads with user, date, time, platform, and device"
            rows={filteredDownloads}
            columns={downloadColumns}
            rowKey={(r) => r.id}
            initialSortKey="downloadedAt"
            initialSortDirection="descending"
            emptyMessage="No downloads recorded yet. Store badge clicks and mobile app first-launches will appear here."
          />
        </section>

        {/* TAB 3: USAGE & TIME */}
        <section
          role="tabpanel"
          id="panel-users"
          aria-labelledby="tab-users"
          hidden={activeTab !== "users"}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Avg Time / User"
              value={formatDuration(overview.avgUsagePerUserSeconds)}
              sublabel="Cumulative time across tracked sessions"
              accent
            />
            <KpiCard
              label="Avg Session Length"
              value={formatDuration(overview.avgSessionDurationSeconds)}
              sublabel={`Median session: ${formatDuration(
                overview.medianSessionDurationSeconds
              )}`}
            />
            <KpiCard
              label="Total App Time"
              value={`${overview.totalUsageHours}h`}
              sublabel={`Across ${overview.totalSessions} total sessions`}
            />
            <KpiCard
              label="Active Retention"
              value={`${overview.dau} / ${overview.wau} / ${overview.mau}`}
              sublabel={
                overview.usageSource === "user_sessions"
                  ? "DAU / WAU / MAU from user_sessions"
                  : "DAU / WAU / MAU from app activity fallback"
              }
            />
          </div>

          <div className="flex flex-col justify-between gap-3 rounded-3xl border border-[#E8E8ED] bg-white p-5 sm:flex-row sm:items-center">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user name, email, or UUID..."
                aria-label="Search users"
                className="flex-1 rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] px-4 py-2 text-sm text-[#1D1D1F] placeholder:text-[#98989D] focus:border-[#E05A6D] focus:bg-white focus:outline-none"
              />
              <select
                value={userCoupleFilter}
                onChange={(e) => setUserCoupleFilter(e.target.value)}
                aria-label="Filter by couple status"
                className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] px-4 py-2 text-sm text-[#1D1D1F] focus:border-[#E05A6D] focus:bg-white focus:outline-none"
              >
                <option value="all">All users ({data.users.length})</option>
                <option value="active">In Active Couple</option>
                <option value="ended">Ended Couple</option>
                <option value="solo">Solo / Unpaired</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() =>
                triggerCsvDownload(
                  `duodate-user-usage-${new Date().toISOString().slice(0, 10)}.csv`,
                  [
                    "User ID",
                    "Name",
                    "Email",
                    "Couple Status",
                    "Sessions",
                    "Avg Session (sec)",
                    "Total Time (sec)",
                    "Dates",
                    "Moods",
                    "Last Active",
                  ],
                  filteredUsers.map((u) => [
                    u.userId,
                    u.displayName,
                    u.email ?? "",
                    u.coupleStatus,
                    u.sessionCount,
                    u.avgSessionSeconds,
                    u.totalUsageSeconds,
                    u.datesCount,
                    u.moodsCount,
                    u.lastActiveAt ?? "",
                  ])
                )
              }
              className="rounded-xl border border-[#E8E8ED] bg-[#F5F5F7] px-4 py-2 text-xs font-semibold text-[#1D1D1F] transition-colors hover:bg-[#E8E8ED]"
            >
              Export CSV ({filteredUsers.length})
            </button>
          </div>

          <SortableDataTable
            caption="Per-user time of use, average session duration, sessions, and activity"
            rows={filteredUsers}
            columns={userColumns}
            rowKey={(r) => r.userId}
            initialSortKey="totalUsageSeconds"
            initialSortDirection="descending"
            emptyMessage="No users found."
          />
        </section>

        {/* TAB 4: COUPLES & PRODUCT */}
        <section
          role="tabpanel"
          id="panel-product"
          aria-labelledby="tab-product"
          hidden={activeTab !== "product"}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Avg Couple Tenure"
              value={`${overview.avgCoupleTenureDays} days`}
              sublabel={`${overview.activeCouples} active · ${overview.endedCouples} ended`}
              accent
            />
            <KpiCard
              label="Outfit Sync Rate"
              value={`${productMetrics.outfitCoordinationRatePct}%`}
              sublabel={`${productMetrics.totalOutfits} outfits across ${productMetrics.totalDates} dates`}
            />
            <KpiCard
              label="Goal Completion"
              value={`${productMetrics.goalCompletionRatePct}%`}
              sublabel={`${productMetrics.completedGoals} of ${productMetrics.totalGoals} goals · ${productMetrics.totalGoalItems} items`}
            />
            <KpiCard
              label="Achievements & Prefs"
              value={formatCompactNumber(productMetrics.totalAchievements)}
              sublabel={`${productMetrics.totalPreferenceItems} preferences · ${productMetrics.totalPushTokens} push tokens`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <BreakdownCard
              title="Date Statuses"
              subtitle="Planned vs completed vs cancelled"
              items={breakdowns.datesByStatus}
              emptyText="No dates recorded yet"
            />
            <BreakdownCard
              title="Date Vibes"
              subtitle="Popular couple vibes"
              items={breakdowns.datesByVibe}
              emptyText="No vibes recorded yet"
              accent="#059669"
            />
            <BreakdownCard
              title="Daily Moods"
              subtitle="Partner mood check-ins"
              items={breakdowns.moodDistribution}
              emptyText="No moods recorded yet"
              accent="#7C3AED"
            />
            <BreakdownCard
              title="Goal Categories"
              subtitle={`Avg target count: ${productMetrics.avgGoalTargetCount}`}
              items={breakdowns.goalKinds}
              emptyText="No goals created yet"
              accent="#2563EB"
            />
            <BreakdownCard
              title="Achievement Kinds"
              subtitle="Milestones unlocked by couples"
              items={breakdowns.achievementKinds}
              emptyText="No achievements unlocked yet"
              accent="#D97706"
            />
            <BreakdownCard
              title="Preference Marks"
              subtitle="Saved partner likes & preferences"
              items={breakdowns.preferenceMarks}
              emptyText="No preference items yet"
              accent="#1D1D1F"
            />
          </div>

          {data.topEvents.length > 0 && (
            <BreakdownCard
              title="Top Custom Analytics Events"
              subtitle={`${productMetrics.totalAnalyticsEvents} events tracked`}
              items={data.topEvents}
              accent="#E05A6D"
            />
          )}
        </section>

        {/* TAB 5: SAFETY REPORTS */}
        <section
          role="tabpanel"
          id="panel-reports"
          aria-labelledby="tab-reports"
          hidden={activeTab !== "reports"}
          className="space-y-4"
        >
          <div className="rounded-3xl border border-[#E8E8ED] bg-white p-5">
            <h2 className="font-heading text-xl font-bold text-[#1D1D1F]">
              Safety &amp; Moderation Reports
            </h2>
            <p className="mt-1 text-xs text-[#6E6E73]">
              Live records from your <code>public.reports</code> table.
            </p>
          </div>

          <SortableDataTable
            caption="User safety reports"
            rows={data.reports}
            columns={reportColumns}
            rowKey={(r) => r.id}
            initialSortKey="createdAt"
            initialSortDirection="descending"
            emptyMessage="No safety reports have been submitted."
          />
        </section>

        {/* TAB 6: SUPABASE SETUP & CONNECTION HEALTH */}
        <section
          role="tabpanel"
          id="panel-setup"
          aria-labelledby="tab-setup"
          hidden={activeTab !== "setup"}
          className="space-y-6"
        >
          <div className="rounded-3xl border border-[#E8E8ED] bg-white p-6">
            <h2 className="font-heading text-xl font-bold text-[#1D1D1F]">
              Supabase Table Connection Status
            </h2>
            <p className="mt-1 text-xs text-[#6E6E73]">
              Shows live connectivity for your 11 existing DuoDate tables plus the 3 new analytics tables from{" "}
              <code>supabase/admin_analytics_setup.sql</code>.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.tableHealth.map((t) => (
                <div
                  key={t.table}
                  className="flex items-center justify-between rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7]/60 px-4 py-3"
                >
                  <div>
                    <p className="font-mono text-xs font-semibold text-[#1D1D1F]">
                      {t.table}
                    </p>
                    <p className="text-[11px] text-[#6E6E73]">
                      {t.category === "existing" ? "Existing schema" : "New analytics table"}
                      {t.state === "connected" ? ` · ${t.rowCount} rows` : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      t.state === "connected"
                        ? "bg-[#E7F6EC] text-[#146C34]"
                        : t.state === "missing"
                        ? "bg-[#FEF3C7] text-[#92400E]"
                        : "bg-[#FEE2E2] text-[#991B1B]"
                    }`}
                  >
                    {t.state === "connected"
                      ? "Connected"
                      : t.state === "missing"
                      ? "Run SQL"
                      : "Error"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#E8E8ED] bg-white p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#1D1D1F]">
                    1. Track Mobile App Downloads
                  </h3>
                  <p className="text-xs text-[#6E6E73]">
                    Call once on first launch in your DuoDate mobile app.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copySnippet("dl", MOBILE_DOWNLOAD_SNIPPET)}
                  className="rounded-xl bg-[#F5F5F7] px-3 py-1.5 text-xs font-semibold text-[#1D1D1F] hover:bg-[#E8E8ED]"
                >
                  {copiedKey === "dl" ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-2xl bg-[#1D1D1F] p-4 text-xs leading-relaxed text-[#F5F5F7]">
                <code>{MOBILE_DOWNLOAD_SNIPPET}</code>
              </pre>
            </div>

            <div className="rounded-3xl border border-[#E8E8ED] bg-white p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#1D1D1F]">
                    2. Track Time of Use per User
                  </h3>
                  <p className="text-xs text-[#6E6E73]">
                    Logs session start &amp; end with the user&apos;s Supabase JWT.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copySnippet("sess", MOBILE_SESSION_SNIPPET)}
                  className="rounded-xl bg-[#F5F5F7] px-3 py-1.5 text-xs font-semibold text-[#1D1D1F] hover:bg-[#E8E8ED]"
                >
                  {copiedKey === "sess" ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-2xl bg-[#1D1D1F] p-4 text-xs leading-relaxed text-[#F5F5F7]">
                <code>{MOBILE_SESSION_SNIPPET}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
