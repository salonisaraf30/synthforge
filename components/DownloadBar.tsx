"use client";

import { useState } from "react";
import type { GeneratedDataset } from "@/lib/types";
import { downloadCsvZip, downloadJson, estimateFileSizeBytes, formatFileSize } from "@/lib/export";

interface DownloadBarProps {
  dataset: GeneratedDataset;
}

export function DownloadBar({ dataset }: DownloadBarProps) {
  const [isZipping, setIsZipping] = useState(false);
  const csvSize = estimateFileSizeBytes(dataset, "csv");
  const jsonSize = estimateFileSizeBytes(dataset, "json");

  async function handleCsvDownload() {
    setIsZipping(true);
    try {
      await downloadCsvZip(dataset);
    } finally {
      setIsZipping(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border border-t-0 border-border bg-surface-raised px-5 py-3">
      <button
        type="button"
        onClick={handleCsvDownload}
        disabled={isZipping}
        className="border border-border bg-surface-raised px-4 py-2 text-xs font-medium text-text-primary hover:bg-surface-sunken disabled:opacity-60"
      >
        ↓ Download CSV <span className="font-mono text-text-muted">({formatFileSize(csvSize)})</span>
      </button>
      <button
        type="button"
        onClick={() => downloadJson(dataset)}
        className="border border-border bg-surface-raised px-4 py-2 text-xs font-medium text-text-primary hover:bg-surface-sunken"
      >
        ↓ Download JSON <span className="font-mono text-text-muted">({formatFileSize(jsonSize)})</span>
      </button>
    </div>
  );
}
