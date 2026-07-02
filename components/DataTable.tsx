"use client";

import { useMemo, useState } from "react";
import type { AnomalyTag } from "@/lib/types";

interface DataTableProps {
  rows: Record<string, unknown>[];
}

type SortDirection = "asc" | "desc";

const MONOSPACE_HINTS = ["id", "code", "date", "mrn", "count", "days", "minutes", "hours", "rate", "score"];

function isMonospaceColumn(column: string): boolean {
  const lower = column.toLowerCase();
  return MONOSPACE_HINTS.some((hint) => lower.includes(hint));
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) return value.join("; ");
  return String(value);
}

export function DataTable({ rows }: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showAll, setShowAll] = useState(false);

  const columns = useMemo(() => (rows.length ? Object.keys(rows[0]).filter((c) => !c.startsWith("_")) : []), [rows]);

  const sortedRows = useMemo(() => {
    if (!sortColumn) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortColumn];
      const bv = b[sortColumn];
      if (av === bv) return 0;
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      const cmp = av > bv ? 1 : -1;
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortColumn, sortDirection]);

  const visibleRows = showAll ? sortedRows.slice(0, 50) : sortedRows.slice(0, 10);

  function handleSort(column: string) {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  }

  if (rows.length === 0) {
    return <p className="p-6 text-center text-sm text-text-muted">No rows in this table.</p>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 bg-surface-sunken">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="cursor-pointer select-none whitespace-nowrap border-b border-border px-3 py-2 align-top hover:bg-border/30"
                >
                  <div className="flex items-center gap-1 text-[12px] font-medium text-text-primary">
                    {col}
                    {sortColumn === col && <span className="text-accent">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                  <div className="font-mono text-[10px] font-normal text-text-muted">{typeof rows[0][col]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, idx) => {
              const anomaly = row._anomaly as AnomalyTag | null | undefined;
              return (
                <tr
                  key={idx}
                  className={`${idx % 2 === 1 ? "bg-surface-sunken/60" : ""} ${
                    anomaly
                      ? anomaly.severity === "danger"
                        ? "border-l-2 border-l-danger"
                        : "border-l-2 border-l-warning"
                      : ""
                  }`}
                  title={anomaly?.label}
                >
                  {columns.map((col) => (
                    <td
                      key={col}
                      className={`whitespace-nowrap border-b border-border px-3 py-1.5 text-text-primary ${
                        isMonospaceColumn(col) ? "font-mono text-[11px]" : ""
                      }`}
                    >
                      {formatValue(row[col])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length > 10 && (
        <div className="border-t border-border px-3 py-2">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="text-xs font-medium text-accent hover:text-accent-hover"
          >
            {showAll ? "Show fewer" : `Show more (up to 50 of ${rows.length})`}
          </button>
        </div>
      )}
    </div>
  );
}
