"use client";

import { useState } from "react";
import type { TableSchema } from "@/lib/types";

interface SchemaExplorerProps {
  schema: TableSchema[];
  onSelectTable?: (tableName: string) => void;
}

export function SchemaExplorer({ schema, onSelectTable }: SchemaExplorerProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(schema.map((t) => t.name)));

  function toggle(name: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div>
      <h2 className="px-3 pt-4 pb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
        Schema Explorer
      </h2>
      <div className="flex flex-col px-2 pb-4">
        {schema.map((table) => {
          const isOpen = expanded.has(table.name);
          return (
            <div key={table.name} className="mb-1">
              <button
                type="button"
                onClick={() => {
                  toggle(table.name);
                  onSelectTable?.(table.name);
                }}
                className="flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left hover:bg-surface-sunken"
              >
                <span className="font-mono text-[11px] text-text-muted">{isOpen ? "▾" : "▸"}</span>
                <span className="font-mono text-[13px] text-text-primary">{table.name}</span>
              </button>
              {isOpen && (
                <div className="ml-4 border-l border-border pl-2">
                  {table.columns.map((col) => (
                    <div key={col.name} className="flex items-center justify-between py-0.5 pl-2">
                      <span className="font-mono text-[12px] text-text-secondary">
                        {col.name}
                        {col.isForeignKey && <span className="ml-1 text-accent">FK</span>}
                      </span>
                      <span className="font-mono text-[11px] text-text-muted">{col.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
