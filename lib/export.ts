import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { GeneratedDataset, GeneratedTable } from "@/lib/types";

function toCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return toCsvValue(value.join("; "));
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function tableToCsv(table: GeneratedTable): string {
  if (table.rows.length === 0) return "";
  const columns = Object.keys(table.rows[0]).filter((c) => !c.startsWith("_"));
  const header = columns.join(",");
  const lines = table.rows.map((row) => columns.map((col) => toCsvValue(row[col])).join(","));
  return [header, ...lines].join("\n");
}

export function datasetToJson(dataset: GeneratedDataset): string {
  const payload: Record<string, unknown> = {
    useCase: dataset.useCase,
    config: dataset.config,
    generatedAt: dataset.generatedAt,
    stats: dataset.stats,
  };
  for (const table of dataset.tables) {
    payload[table.name] = table.rows.map((row) => stripInternal(row));
  }
  return JSON.stringify(payload, null, 2);
}

function stripInternal(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (key.startsWith("_")) continue;
    out[key] = value;
  }
  return out;
}

export async function downloadCsvZip(dataset: GeneratedDataset): Promise<void> {
  const zip = new JSZip();
  for (const table of dataset.tables) {
    zip.file(`${table.name}.csv`, tableToCsv(table));
  }
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `synthforge-${dataset.useCase}-${dataset.tables[0]?.rows.length ?? 0}pt.zip`);
}

export function downloadJson(dataset: GeneratedDataset): void {
  const json = datasetToJson(dataset);
  const blob = new Blob([json], { type: "application/json" });
  saveAs(blob, `synthforge-${dataset.useCase}-${dataset.tables[0]?.rows.length ?? 0}pt.json`);
}

export function estimateFileSizeBytes(dataset: GeneratedDataset, format: "csv" | "json"): number {
  if (format === "json") {
    return new Blob([datasetToJson(dataset)]).size;
  }
  let total = 0;
  for (const table of dataset.tables) {
    total += new Blob([tableToCsv(table)]).size;
  }
  return total;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
