"use client";

import React, { useState } from "react";
import type { BreakdownItem, DailySeriesPoint } from "@/lib/admin/types";

type SeriesKey = "downloads" | "newUsers" | "sessions" | "datesPlanned";

const SERIES_META: Record<
  SeriesKey,
  { label: string; color: string; bg: string }
> = {
  downloads: { label: "App Downloads", color: "#E05A6D", bg: "#FCE7EB" },
  newUsers: { label: "New Users", color: "#1D1D1F", bg: "#E8E8ED" },
  sessions: { label: "Sessions", color: "#2563EB", bg: "#DBEAFE" },
  datesPlanned: { label: "Dates Planned", color: "#059669", bg: "#D1FAE5" },
};

export function TrendAreaChart({
  data,
  rangeDays,
}: {
  data: DailySeriesPoint[];
  rangeDays: number;
}) {
  const [activeSeries, setActiveSeries] = useState<SeriesKey[]>([
    "downloads",
    "sessions",
    "datesPlanned",
  ]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  function toggleSeries(key: SeriesKey) {
    setActiveSeries((prev) => {
      if (prev.includes(key)) {
        return prev.length > 1 ? prev.filter((k) => k !== key) : prev;
      }
      return [...prev, key];
    });
  }

  const width = 760;
  const height = 240;
  const padLeft = 36;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 30;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const maxValue = Math.max(
    1,
    ...data.flatMap((pt) => activeSeries.map((k) => pt[k]))
  );

  const yTicks = [0, Math.ceil(maxValue / 2), maxValue];

  function xFor(idx: number) {
    if (data.length <= 1) return padLeft + plotW / 2;
    return padLeft + (idx / (data.length - 1)) * plotW;
  }

  function yFor(val: number) {
    return padTop + plotH - (val / maxValue) * plotH;
  }

  const activePoint =
    hoveredIdx !== null && data[hoveredIdx]
      ? data[hoveredIdx]
      : data[data.length - 1] ?? null;

  return (
    <section
      aria-label="Growth and activity trends"
      className="rounded-3xl border border-[#E8E8ED] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-[#1D1D1F]">
            Activity &amp; Growth ({rangeDays}d)
          </h2>
          <p className="text-xs text-[#6E6E73]">
            Daily downloads, signups, sessions, and dates planned
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(SERIES_META) as SeriesKey[]).map((key) => {
            const meta = SERIES_META[key];
            const enabled = activeSeries.includes(key);
            return (
              <button
                key={key}
                type="button"
                aria-pressed={enabled}
                onClick={() => toggleSeries(key)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[#E05A6D] ${
                  enabled
                    ? "border-[#1D1D1F]/15 bg-[#F5F5F7] text-[#1D1D1F]"
                    : "border-[#E8E8ED] bg-white text-[#98989D]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: enabled ? meta.color : "#D1D1D6",
                  }}
                />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {activePoint && (
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-2xl bg-[#F5F5F7] px-4 py-2.5 text-xs">
          <span className="font-semibold text-[#1D1D1F]">
            {hoveredIdx !== null ? activePoint.label : `Latest (${activePoint.label})`}
          </span>
          {activeSeries.map((key) => (
            <span key={key} className="inline-flex items-center gap-1.5 tabular-nums text-[#6E6E73]">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: SERIES_META[key].color }}
              />
              {SERIES_META[key].label}:{" "}
              <strong className="font-semibold text-[#1D1D1F]">
                {activePoint[key]}
              </strong>
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-60 w-full min-w-[520px]"
          role="img"
          aria-label={`Line chart for the past ${rangeDays} days`}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {yTicks.map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E8E8ED"
                  strokeDasharray={tick === 0 ? undefined : "4 4"}
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[#6E6E73] text-[10px] tabular-nums"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {activeSeries.map((key) => {
            const color = SERIES_META[key].color;
            const points = data.map((pt, i) => `${xFor(i)},${yFor(pt[key])}`).join(" ");
            const areaPoints = [
              `${xFor(0)},${yFor(0)}`,
              points,
              `${xFor(data.length - 1)},${yFor(0)}`,
            ].join(" ");

            return (
              <g key={key}>
                {key === "downloads" && data.length > 1 && (
                  <polygon points={areaPoints} fill={color} fillOpacity={0.08} />
                )}
                <polyline
                  fill="none"
                  stroke={color}
                  strokeWidth={2.25}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={points}
                />
              </g>
            );
          })}

          {hoveredIdx !== null && data[hoveredIdx] && (
            <line
              x1={xFor(hoveredIdx)}
              y1={padTop}
              x2={xFor(hoveredIdx)}
              y2={padTop + plotH}
              stroke="#1D1D1F"
              strokeOpacity={0.18}
              strokeWidth={1.5}
            />
          )}

          {data.map((pt, idx) => {
            const x = xFor(idx);
            const showLabel =
              idx === 0 ||
              idx === data.length - 1 ||
              idx % Math.max(1, Math.floor(data.length / 6)) === 0;
            const sliceWidth = data.length > 1 ? plotW / (data.length - 1) : plotW;

            return (
              <g key={pt.date}>
                {showLabel && (
                  <text
                    x={x}
                    y={height - 8}
                    textAnchor="middle"
                    className="fill-[#6E6E73] text-[10px]"
                  >
                    {pt.label}
                  </text>
                )}
                {hoveredIdx === idx &&
                  activeSeries.map((key) => (
                    <circle
                      key={key}
                      cx={x}
                      cy={yFor(pt[key])}
                      r={4}
                      fill={SERIES_META[key].color}
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                    />
                  ))}
                <rect
                  x={x - sliceWidth / 2}
                  y={padTop}
                  width={Math.max(sliceWidth, 8)}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

export function BreakdownCard({
  title,
  subtitle,
  items,
  emptyText = "No records yet",
  accent = "#E05A6D",
}: {
  title: string;
  subtitle?: string;
  items: BreakdownItem[];
  emptyText?: string;
  accent?: string;
}) {
  return (
    <section className="rounded-3xl border border-[#E8E8ED] bg-white p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="font-heading text-lg font-bold tracking-tight text-[#1D1D1F]">
          {title}
        </h3>
        {subtitle && <p className="mt-0.5 text-xs text-[#6E6E73]">{subtitle}</p>}
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl bg-[#F5F5F7] px-4 py-6 text-center text-xs text-[#6E6E73]">
          {emptyText}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.label} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate font-medium capitalize text-[#1D1D1F]">
                  {item.label.replace(/_/g, " ")}
                </span>
                <span className="flex-shrink-0 tabular-nums text-[#6E6E73]">
                  <strong className="font-semibold text-[#1D1D1F]">
                    {item.count}
                  </strong>{" "}
                  ({item.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#F5F5F7]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(item.percentage, 3)}%`,
                    backgroundColor: accent,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
