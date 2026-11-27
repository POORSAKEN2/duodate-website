"use client";

import React, { useId, useMemo, useState } from "react";

export interface TableColumn<T> {
  key: string;
  label: string;
  type?: "string" | "number" | "date";
  sortable?: boolean;
  align?: "left" | "right";
  sortValue?: (row: T) => string | number;
  render: (row: T) => React.ReactNode;
}

const textCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

export default function SortableDataTable<T>({
  caption,
  rows,
  columns,
  rowKey,
  initialSortKey,
  initialSortDirection = "descending",
  emptyMessage = "No records match the current filters.",
}: {
  caption: string;
  rows: T[];
  columns: TableColumn<T>[];
  rowKey: (row: T) => string;
  initialSortKey?: string;
  initialSortDirection?: "ascending" | "descending";
  emptyMessage?: string;
}) {
  const captionId = useId();
  const [sortKey, setSortKey] = useState<string | null>(initialSortKey ?? null);
  const [sortDirection, setSortDirection] = useState<"ascending" | "descending">(
    initialSortDirection
  );
  const [announcement, setAnnouncement] = useState("");

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col || !col.sortValue) return rows;

    const factor = sortDirection === "ascending" ? 1 : -1;
    const getVal = col.sortValue;
    const isNumeric = col.type === "number" || col.type === "date";

    return [...rows].sort((a, b) => {
      const va = getVal(a);
      const vb = getVal(b);
      if (isNumeric) {
        return factor * (Number(va) - Number(vb));
      }
      return factor * textCollator.compare(String(va), String(vb));
    });
  }, [rows, columns, sortKey, sortDirection]);

  function handleSort(col: TableColumn<T>) {
    if (!col.sortable || !col.sortValue) return;
    const nextDirection: "ascending" | "descending" =
      sortKey === col.key
        ? sortDirection === "ascending"
          ? "descending"
          : "ascending"
        : "ascending";

    setSortKey(col.key);
    setSortDirection(nextDirection);
    setAnnouncement(
      `Sorted by ${col.label}, ${nextDirection}, ${rows.length} rows`
    );
  }

  const labelVars = useMemo(() => {
    const vars: Record<string, string> = {};
    columns.forEach((col, index) => {
      if (index > 0) {
        vars[`--label-${index + 1}`] = `"${col.label.replace(/"/g, '\\"')}"`;
      }
    });
    return vars as React.CSSProperties;
  }, [columns]);

  return (
    <div className="relative">
      <div role="status" className="visually-hidden">
        {announcement}
      </div>

      <div
        tabIndex={0}
        role="region"
        aria-labelledby={captionId}
        className="admin-table-wrapper rounded-2xl border border-[#E8E8ED] bg-white focus:outline-none focus:ring-2 focus:ring-[#E05A6D]"
      >
        <table className="admin-table text-sm" style={labelVars}>
          <caption id={captionId} className="visually-hidden">
            {caption}
          </caption>
          <thead>
            <tr className="border-b border-[#E8E8ED] text-xs uppercase tracking-wider text-[#6E6E73]">
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const isSortable = Boolean(col.sortable && col.sortValue);

                return (
                  <th
                    key={col.key}
                    scope="col"
                    data-sortable={isSortable ? "true" : undefined}
                    aria-sort={isSorted ? sortDirection : undefined}
                    className={`whitespace-nowrap border-b border-[#E8E8ED] bg-[#F5F5F7] ${
                      isSortable ? "" : "px-4 py-3 font-semibold"
                    } ${col.align === "right" ? "text-right" : "text-left"}`}
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col)}
                        className={`group transition-colors hover:text-[#1D1D1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E05A6D] ${
                          col.align === "right" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span>{col.label}</span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${
                            isSorted
                              ? "text-[#E05A6D]"
                              : "text-[#AEAEB2] group-hover:text-[#6E6E73]"
                          } ${
                            isSorted && sortDirection === "descending"
                              ? "rotate-180"
                              : ""
                          }`}
                          fill="currentColor"
                        >
                          <path d="M8 3.5 12.25 8.5H3.75L8 3.5Z" />
                        </svg>
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F2F2F6] text-[#1D1D1F]">
            {sortedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-[#6E6E73]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedRows.map((row) => (
                <tr key={rowKey(row)} className="transition-colors">
                  {columns.map((col, idx) =>
                    idx === 0 ? (
                      <th
                        key={col.key}
                        scope="row"
                        className="px-4 py-3.5 text-left font-medium text-[#1D1D1F]"
                      >
                        {col.render(row)}
                      </th>
                    ) : (
                      <td
                        key={col.key}
                        className={`px-4 py-3.5 ${
                          col.align === "right" ? "text-right" : "text-left"
                        }`}
                      >
                        {col.render(row)}
                      </td>
                    )
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
