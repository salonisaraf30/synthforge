import type { GeneratedDataset } from "@/lib/types";
import { estimateFileSizeBytes, formatFileSize } from "@/lib/export";

interface GenerationStatsProps {
  dataset: GeneratedDataset;
}

export function GenerationStats({ dataset }: GenerationStatsProps) {
  const fileSize = estimateFileSizeBytes(dataset, "csv");
  const cards = [...dataset.stats, { label: "Est. File Size", value: fileSize, isSize: true }];

  return (
    <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 md:grid-cols-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-surface-raised px-4 py-3">
          <div className="font-mono text-2xl text-text-primary">
            {"isSize" in card && card.isSize ? formatFileSize(card.value) : card.value.toLocaleString()}
          </div>
          <div className="mt-0.5 text-xs text-text-muted">{card.label}</div>
        </div>
      ))}
    </div>
  );
}
