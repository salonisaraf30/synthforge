"use client";

import type { UseCaseId } from "@/lib/types";
import { USE_CASES } from "@/lib/use-cases";

interface UseCaseSelectorProps {
  selected: UseCaseId;
  onSelect: (useCase: UseCaseId) => void;
}

export function UseCaseSelector({ selected, onSelect }: UseCaseSelectorProps) {
  return (
    <div>
      <h2 className="px-3 pt-4 pb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
        Use Case
      </h2>
      <div className="flex flex-col gap-1 px-2">
        {USE_CASES.map((useCase) => {
          const isSelected = useCase.id === selected;
          return (
            <button
              key={useCase.id}
              type="button"
              onClick={() => onSelect(useCase.id)}
              className={`text-left rounded-sm border-l-2 px-3 py-2.5 transition-colors ${
                isSelected
                  ? "border-l-accent bg-accent-light"
                  : "border-l-transparent bg-transparent hover:bg-surface-sunken"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-text-primary">{useCase.name}</span>
                <span className="font-mono text-[11px] text-text-muted">{useCase.tableCount} tbl</span>
              </div>
              <p className="mt-0.5 text-xs text-text-secondary">{useCase.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
