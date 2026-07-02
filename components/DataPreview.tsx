"use client";

import type { GeneratedTable } from "@/lib/types";
import { DataTable } from "@/components/DataTable";

interface DataPreviewProps {
  tables: GeneratedTable[] | null;
  activeTable: string | null;
  onSelectTable: (tableName: string) => void;
}

export function DataPreview({ tables, activeTable, onSelectTable }: DataPreviewProps) {
  if (!tables) {
    return (
      <div className="flex min-h-[280px] items-center justify-center border border-border bg-surface-raised">
        <p className="max-w-xs text-center text-sm text-text-muted">
          Select a use case and configure your dataset to get started.
        </p>
      </div>
    );
  }

  const active = activeTable ?? tables[0]?.name ?? null;
  const activeData = tables.find((t) => t.name === active);

  return (
    <div className="border border-border bg-surface-raised">
      <div className="flex flex-wrap border-b border-border">
        {tables.map((table) => (
          <button
            key={table.name}
            type="button"
            onClick={() => onSelectTable(table.name)}
            className={`border-r border-border px-4 py-2.5 text-xs font-medium ${
              active === table.name
                ? "bg-accent-light text-accent"
                : "text-text-secondary hover:bg-surface-sunken"
            }`}
          >
            {table.name}{" "}
            <span className="font-mono text-[10px] text-text-muted">{table.rows.length}</span>
          </button>
        ))}
      </div>
      {activeData && <DataTable rows={activeData.rows} />}
    </div>
  );
}
