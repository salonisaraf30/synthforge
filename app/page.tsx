"use client";

import { useRef, useState } from "react";
import type { GeneratedDataset, UseCaseId } from "@/lib/types";
import { defaultConfigForUseCase, generateDataset, type GenerationStage } from "@/lib/engine";
import { getUseCase } from "@/lib/use-cases";
import { TopBar } from "@/components/TopBar";
import { Sidebar } from "@/components/Sidebar";
import { ConfigPanel } from "@/components/ConfigPanel";
import { DataPreview } from "@/components/DataPreview";
import { GenerationStats } from "@/components/GenerationStats";
import { DownloadBar } from "@/components/DownloadBar";

const STAGE_PROGRESS: Record<GenerationStage, number> = {
  "Generating patients…": 15,
  "Linking encounters…": 35,
  "Generating downstream records…": 55,
  "Generating clinical narratives…": 75,
  "Injecting anomalies…": 90,
  Done: 100,
};

export default function Home() {
  const [useCase, setUseCase] = useState<UseCaseId>("utilization-review");
  const [config, setConfig] = useState(defaultConfigForUseCase("utilization-review"));
  const [dataset, setDataset] = useState<GeneratedDataset | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [stage, setStage] = useState<GenerationStage | null>(null);
  const [activeTable, setActiveTable] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  function handleSelectUseCase(nextUseCase: UseCaseId) {
    setUseCase(nextUseCase);
    setConfig(defaultConfigForUseCase(nextUseCase));
    setDataset(null);
    setActiveTable(null);
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setStage(null);
    try {
      const result = await generateDataset(config, {
        onStage: (s) => setStage(s),
      });
      setDataset(result);
      setActiveTable(result.tables[0]?.name ?? null);
      requestAnimationFrame(() => {
        previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const useCaseDefinition = getUseCase(useCase);
  const progress = stage ? STAGE_PROGRESS[stage] : 0;

  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <Sidebar
          selectedUseCase={useCase}
          onSelectUseCase={handleSelectUseCase}
          schema={dataset ? (useCaseDefinition?.schema ?? null) : null}
          onSelectTable={setActiveTable}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
            <ConfigPanel
              config={config}
              onChange={setConfig}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              stage={stage}
              progress={progress}
            />

            <div ref={previewRef}>
              <h2 className="mb-2 text-sm font-medium text-text-primary">Data Preview</h2>
              <DataPreview tables={dataset?.tables ?? null} activeTable={activeTable} onSelectTable={setActiveTable} />
            </div>

            {dataset && (
              <div>
                <h2 className="mb-2 text-sm font-medium text-text-primary">Generation Stats</h2>
                <GenerationStats dataset={dataset} />
              </div>
            )}

            {dataset && <DownloadBar dataset={dataset} />}
          </div>
        </main>
      </div>
    </div>
  );
}
