/**
 * Formatting helpers for durations, dates/times, numbers, and CSV export.
 * Uses Intl.DurationFormat when available (with deterministic fallback).
 */

export function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.round(totalSeconds));
  if (safeSeconds === 0) return "0s";

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const durationParts: Record<string, number> = {};
  if (hours > 0) durationParts.hours = hours;
  if (minutes > 0) durationParts.minutes = minutes;
  if (seconds > 0 && hours === 0) durationParts.seconds = seconds;

  if (Object.keys(durationParts).length === 0) {
    durationParts.seconds = 0;
  }

  try {
    const IntlWithDuration = Intl as unknown as {
      DurationFormat?: new (
        locales?: string | string[],
        options?: { style?: "long" | "short" | "narrow" | "digital" }
      ) => { format: (duration: Record<string, number>) => string };
    };
    if (typeof IntlWithDuration.DurationFormat === "function") {
      return new IntlWithDuration.DurationFormat("en-US", {
        style: "narrow",
      }).format(durationParts);
    }
  } catch {
    // Fall through to deterministic formatter
  }

  const tokens: string[] = [];
  if (hours > 0) tokens.push(`${hours}h`);
  if (minutes > 0) tokens.push(`${minutes}m`);
  if (seconds > 0 && hours === 0) tokens.push(`${seconds}s`);
  return tokens.join(" ") || "0s";
}

export function formatDateTime(
  iso: string | null | undefined,
  timeZone?: string
): { date: string; time: string; full: string } {
  if (!iso) {
    return { date: "—", time: "", full: "—" };
  }
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return { date: "—", time: "", full: "—" };
  }

  const dateFmt = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(timeZone ? { timeZone } : {}),
  });
  const timeFmt = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    ...(timeZone ? { timeZone } : {}),
  });

  const date = dateFmt.format(parsed);
  const time = timeFmt.format(parsed);
  return { date, time, full: `${date}, ${time}` };
}

export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "Never";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "Unknown";

  const diffSeconds = Math.round((parsed.getTime() - Date.now()) / 1000);
  const abs = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (abs < 60) return rtf.format(diffSeconds, "second");
  if (abs < 3600) return rtf.format(Math.round(diffSeconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSeconds / 3600), "hour");
  if (abs < 2592000) return rtf.format(Math.round(diffSeconds / 86400), "day");
  return rtf.format(Math.round(diffSeconds / 2592000), "month");
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function escapeCsvCell(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
