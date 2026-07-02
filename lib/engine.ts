import type { GenerationConfig, GeneratedDataset, GeneratedTable, UseCaseId } from "@/lib/types";
import { createRng } from "@/lib/rng";
import { generatePatients, generatePayers } from "@/lib/generators/patient-generator";
import { generateEncounters } from "@/lib/generators/encounter-generator";
import { generateDiagnoses } from "@/lib/generators/diagnosis-generator";
import { generateClinicalReviews } from "@/lib/generators/review-generator";
import {
  generateAffectedPatients,
  generateContainmentActions,
  generateSafetyEvents,
} from "@/lib/generators/safety-event-generator";
import { generateProcedures } from "@/lib/generators/procedure-generator";
import { generateLabResults } from "@/lib/generators/lab-generator";
import {
  injectClinicalOpsAnomalies,
  injectPatientSafetyAnomalies,
  injectUtilizationReviewAnomalies,
} from "@/lib/generators/anomaly-injector";
import { DENIAL_REASONS } from "@/lib/seed-data/payers";

export type GenerationStage =
  | "Generating patients…"
  | "Linking encounters…"
  | "Generating downstream records…"
  | "Generating clinical narratives…"
  | "Injecting anomalies…"
  | "Done";

export interface GenerationCallbacks {
  onStage?: (stage: GenerationStage) => void;
}

function hashConfig(config: GenerationConfig): number {
  const str = JSON.stringify(config);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

async function fetchGeneratedText(prompt: string, count: number): Promise<string[] | null> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, count }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data.items) && data.items.length > 0) return data.items;
    return null;
  } catch {
    return null;
  }
}

export async function generateDataset(
  config: GenerationConfig,
  callbacks: GenerationCallbacks = {},
): Promise<GeneratedDataset> {
  const { onStage } = callbacks;
  const rand = createRng(hashConfig(config));
  const today = new Date();

  onStage?.("Generating patients…");
  const payers = generatePayers(rand, config);
  const patients = generatePatients(rand, config, payers);

  onStage?.("Linking encounters…");
  const isClinicalOps = config.useCase === "clinical-ops";
  const encounters = generateEncounters(rand, config, patients, isClinicalOps);
  const diagnoses = generateDiagnoses(rand, encounters);

  onStage?.("Generating downstream records…");

  const tables: GeneratedTable[] = [
    { name: "patients", rows: patients as unknown as Record<string, unknown>[] },
    { name: "payers", rows: payers as unknown as Record<string, unknown>[] },
    { name: "encounters", rows: [] },
    { name: "diagnoses", rows: diagnoses as unknown as Record<string, unknown>[] },
  ];

  let anomalyCount = 0;
  let stats: { label: string; value: number }[] = [];

  if (config.useCase === "utilization-review") {
    const reviews = generateClinicalReviews(rand, encounters);

    onStage?.("Generating clinical narratives…");
    const denialReasonText = await fetchGeneratedText(
      `Generate ${Math.min(count(reviews), 20)} realistic insurance denial reason phrases for a healthcare utilization review synthetic dataset. Each should be a short clinical/administrative phrase (5-12 words). Return as a JSON array of strings.`,
      Math.min(count(reviews), 20),
    );
    if (denialReasonText) {
      for (const review of reviews) {
        if (review.denial_reason) {
          review.denial_reason = denialReasonText[Math.floor(rand() * denialReasonText.length)];
        }
      }
    }
    void DENIAL_REASONS; // deterministic fallback already applied by generator

    onStage?.("Injecting anomalies…");
    anomalyCount = injectUtilizationReviewAnomalies(rand, config.anomalyDensity, patients, encounters, reviews, today);

    tables[2].rows = encounters as unknown as Record<string, unknown>[];
    tables.push({ name: "clinical_reviews", rows: reviews as unknown as Record<string, unknown>[] });

    stats = [
      { label: "Patients", value: patients.length },
      { label: "Encounters", value: encounters.length },
      { label: "Reviews", value: reviews.length },
      { label: "Diagnoses", value: diagnoses.length },
      { label: "Anomalies Planted", value: anomalyCount },
    ];
  } else if (config.useCase === "patient-safety") {
    const eventCount = Math.max(5, Math.round(config.patientCount / 25));
    let events = generateSafetyEvents(rand, config, eventCount);

    onStage?.("Generating clinical narratives…");
    const narrativeText = await fetchGeneratedText(
      `Generate ${eventCount} realistic FDA safety event descriptions for healthcare synthetic data. Each should be 1-2 sentences. Mix of: surgical device recalls, pharmaceutical lot contamination, sterility failures, and temperature excursions. Return as a JSON array of strings.`,
      eventCount,
    );
    if (narrativeText) {
      events = generateSafetyEvents(rand, config, eventCount, narrativeText);
    }

    const affectedPatients = generateAffectedPatients(rand, events, patients);
    const containmentActions = generateContainmentActions(rand, events);

    onStage?.("Injecting anomalies…");
    anomalyCount = injectPatientSafetyAnomalies(rand, config.anomalyDensity, events, affectedPatients, containmentActions, today);

    tables[2].rows = encounters as unknown as Record<string, unknown>[];
    tables.push(
      { name: "safety_events", rows: events as unknown as Record<string, unknown>[] },
      { name: "affected_patients", rows: affectedPatients as unknown as Record<string, unknown>[] },
      { name: "containment_actions", rows: containmentActions as unknown as Record<string, unknown>[] },
    );

    stats = [
      { label: "Patients", value: patients.length },
      { label: "Safety Events", value: events.length },
      { label: "Affected Patients", value: affectedPatients.length },
      { label: "Containment Actions", value: containmentActions.length },
      { label: "Anomalies Planted", value: anomalyCount },
    ];
  } else {
    const procedures = generateProcedures(rand, encounters);
    const labResults = generateLabResults(rand, encounters);

    onStage?.("Injecting anomalies…");
    anomalyCount = injectClinicalOpsAnomalies(rand, config.anomalyDensity, encounters, procedures, labResults);

    tables[2].rows = encounters as unknown as Record<string, unknown>[];
    tables.push(
      { name: "procedures", rows: procedures as unknown as Record<string, unknown>[] },
      { name: "lab_results", rows: labResults as unknown as Record<string, unknown>[] },
    );

    stats = [
      { label: "Patients", value: patients.length },
      { label: "Encounters", value: encounters.length },
      { label: "Procedures", value: procedures.length },
      { label: "Lab Results", value: labResults.length },
      { label: "Anomalies Planted", value: anomalyCount },
    ];
  }

  onStage?.("Done");

  return {
    useCase: config.useCase,
    config,
    tables,
    stats,
    anomalyCount,
    generatedAt: new Date().toISOString(),
  };
}

function count<T>(arr: T[]): number {
  return arr.length;
}

export function defaultConfigForUseCase(useCase: UseCaseId): GenerationConfig {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 12);
  return {
    useCase,
    patientCount: 500,
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    anomalyDensity: "medium",
    payerMix: ["Commercial", "Medicare", "Medicaid", "Self-Pay"],
  };
}
