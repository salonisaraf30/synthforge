"use client";

import type { AnomalyDensity, GenerationConfig, PayerType } from "@/lib/types";
import { PAYER_TYPE_DEFAULT_DISTRIBUTION } from "@/lib/seed-data/payers";
import type { GenerationStage } from "@/lib/engine";

interface ConfigPanelProps {
  config: GenerationConfig;
  onChange: (config: GenerationConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  stage: GenerationStage | null;
  progress: number;
}

const DENSITY_OPTIONS: { id: AnomalyDensity; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

const PAYER_OPTIONS: PayerType[] = ["Commercial", "Medicare", "Medicaid", "Self-Pay"];

export function ConfigPanel({ config, onChange, onGenerate, isGenerating, stage, progress }: ConfigPanelProps) {
  function update<K extends keyof GenerationConfig>(key: K, value: GenerationConfig[K]) {
    onChange({ ...config, [key]: value });
  }

  function togglePayer(payer: PayerType) {
    const isChecked = config.payerMix.includes(payer);
    const next = isChecked ? config.payerMix.filter((p) => p !== payer) : [...config.payerMix, payer];
    if (next.length === 0) return;
    update("payerMix", next);
  }

  return (
    <div className="border border-border bg-surface-raised p-5">
      <h2 className="mb-4 text-sm font-medium text-text-primary">Configuration Panel</h2>

      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        <div className="col-span-2">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-medium text-text-secondary">Patient Count</label>
            <span className="font-mono text-xs text-text-primary">{config.patientCount}</span>
          </div>
          <input
            type="range"
            min={50}
            max={2000}
            step={10}
            value={config.patientCount}
            disabled={isGenerating}
            onChange={(e) => update("patientCount", Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-text-muted">
            <span>50</span>
            <span>2000</span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">Time Range — Start</label>
          <input
            type="date"
            value={config.startDate}
            disabled={isGenerating}
            onChange={(e) => update("startDate", e.target.value)}
            className="w-full border border-border bg-surface-sunken px-2 py-1.5 font-mono text-xs text-text-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">Time Range — End</label>
          <input
            type="date"
            value={config.endDate}
            disabled={isGenerating}
            onChange={(e) => update("endDate", e.target.value)}
            className="w-full border border-border bg-surface-sunken px-2 py-1.5 font-mono text-xs text-text-primary"
          />
        </div>

        <div className="col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">Anomaly Density</label>
          <div className="inline-flex border border-border">
            {DENSITY_OPTIONS.map((opt, i) => (
              <button
                key={opt.id}
                type="button"
                disabled={isGenerating}
                onClick={() => update("anomalyDensity", opt.id)}
                className={`px-4 py-1.5 text-xs font-medium ${i > 0 ? "border-l border-border" : ""} ${
                  config.anomalyDensity === opt.id
                    ? "bg-accent text-white"
                    : "bg-surface-raised text-text-secondary hover:bg-surface-sunken"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">Payer Mix</label>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {PAYER_OPTIONS.map((payer) => (
              <label key={payer} className="flex items-center gap-1.5 text-xs text-text-primary">
                <input
                  type="checkbox"
                  checked={config.payerMix.includes(payer)}
                  disabled={isGenerating}
                  onChange={() => togglePayer(payer)}
                />
                {payer}
                <span className="font-mono text-[11px] text-text-muted">
                  {Math.round(PAYER_TYPE_DEFAULT_DISTRIBUTION[payer] * 100)}%
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full bg-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating ? "Generating…" : "Generate Dataset"}
        </button>
        {isGenerating && (
          <div className="mt-3">
            <div className="h-1 w-full bg-surface-sunken">
              <div
                className="h-1 bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 font-mono text-xs text-text-secondary">{stage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
