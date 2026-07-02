"use client";

import type { TableSchema, UseCaseId } from "@/lib/types";
import { UseCaseSelector } from "@/components/UseCaseSelector";
import { SchemaExplorer } from "@/components/SchemaExplorer";
import { Footer } from "@/components/Footer";

interface SidebarProps {
  selectedUseCase: UseCaseId;
  onSelectUseCase: (useCase: UseCaseId) => void;
  schema: TableSchema[] | null;
  onSelectTable?: (tableName: string) => void;
}

export function Sidebar({ selectedUseCase, onSelectUseCase, schema, onSelectTable }: SidebarProps) {
  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-border bg-surface-raised">
      <div className="flex-1 overflow-y-auto">
        <UseCaseSelector selected={selectedUseCase} onSelect={onSelectUseCase} />
        {schema && (
          <>
            <div className="mx-3 mt-3 border-t border-border" />
            <SchemaExplorer schema={schema} onSelectTable={onSelectTable} />
          </>
        )}
      </div>
      <Footer />
    </aside>
  );
}
