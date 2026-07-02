import type {
  AffectedPatient,
  ContainmentAction,
  ContainmentActionType,
  ExposureType,
  GenerationConfig,
  Patient,
  SafetyEvent,
  SafetyEventType,
  SafetySeverity,
  SafetySource,
} from "@/lib/types";
import { ADMIN_DEPARTMENTS, PHYSICIAN_FIRST_NAMES, PHYSICIAN_LAST_NAMES } from "@/lib/seed-data/departments";
import { MEDICATION_LOT_BATCHES, MEDICATIONS } from "@/lib/seed-data/medications";
import { addDays, pick, randBool, randInt, randomDateBetween, toIsoDate, uuid } from "@/lib/rng";

const EVENT_TYPES: SafetyEventType[] = [
  "FDA Recall",
  "Contamination Alert",
  "Sterility Failure",
  "Temperature Excursion",
  "Medication Error",
  "Device Malfunction",
];
const SEVERITIES: SafetySeverity[] = ["Critical", "High", "Moderate", "Low"];
const SOURCES: SafetySource[] = ["FDA", "Internal QA", "Supplier Notification", "Lab Alert"];
const ACTION_TYPES: ContainmentActionType[] = [
  "Product Quarantine",
  "Patient Notification",
  "Supplier Contact",
  "Regulatory Filing",
  "Clinical Follow-up",
];

const AFFECTED_PRODUCTS = [
  "Surgical Mesh",
  "Insulin Glargine 100U/mL",
  "Central Line Catheter Kit",
  "Orthopedic Bone Cement",
  "IV Saline Solution",
  "Sterile Gauze Pads",
  "Cardiac Stent",
  "Blood Glucose Test Strips",
];

const FALLBACK_DESCRIPTIONS = [
  "Lot recalled due to sterility concern identified during routine supplier audit.",
  "Temperature excursion detected in pharmacy cold storage exceeding safe threshold for 4 hours.",
  "Contamination alert issued after positive microbial culture from affected batch.",
  "Device malfunction reported causing intermittent readout errors during clinical use.",
  "Medication error traced to look-alike packaging between two dosage strengths.",
  "Supplier notification received regarding potential particulate contamination in IV solution.",
];

export function generateSafetyEvents(
  rand: () => number,
  config: GenerationConfig,
  count: number,
  descriptionPool: string[] = FALLBACK_DESCRIPTIONS,
): SafetyEvent[] {
  const start = new Date(config.startDate);
  const end = new Date(config.endDate);
  const events: SafetyEvent[] = [];

  for (let i = 0; i < count; i++) {
    const product = pick(rand, AFFECTED_PRODUCTS);
    const isMed = MEDICATIONS.includes(product);
    const lot = pick(rand, MEDICATION_LOT_BATCHES);
    events.push({
      event_id: uuid(rand),
      event_type: pick(rand, EVENT_TYPES),
      event_date: toIsoDate(randomDateBetween(rand, start, end)),
      severity: pick(rand, SEVERITIES),
      source: pick(rand, SOURCES),
      description: pick(rand, descriptionPool),
      affected_product: isMed ? `${product} - ${lot}` : `${product} - ${lot}`,
      status: pick(rand, ["Open", "Investigating", "Contained", "Resolved"] as const),
      response_owner: `${pick(rand, PHYSICIAN_FIRST_NAMES)} ${pick(rand, PHYSICIAN_LAST_NAMES)} - ${pick(rand, ADMIN_DEPARTMENTS)}`,
    });
  }

  return events;
}

export function generateAffectedPatients(
  rand: () => number,
  events: SafetyEvent[],
  patients: Patient[],
): AffectedPatient[] {
  const exposureTypes: ExposureType[] = ["Direct", "Indirect", "Potential"];
  const result: AffectedPatient[] = [];

  for (const event of events) {
    const affectedCount = randInt(rand, 1, Math.min(20, patients.length || 1));
    const sample = samplePatients(rand, patients, affectedCount);

    for (const patient of sample) {
      const eventDate = new Date(event.event_date);
      const containmentStatus = pick(rand, ["Identified", "Contacted", "Monitored", "Cleared"] as const);
      const clinicalImpact = randBool(rand, 0.08)
        ? "Adverse Reaction Confirmed"
        : randBool(rand, 0.3)
          ? "Under Observation"
          : "None Detected";

      result.push({
        id: uuid(rand),
        event_id: event.event_id,
        patient_id: patient.patient_id,
        exposure_date: toIsoDate(addDays(eventDate, randInt(rand, 0, 5))),
        exposure_type: pick(rand, exposureTypes),
        containment_status: containmentStatus,
        clinical_impact: clinicalImpact,
      });
    }
  }

  return result;
}

export function generateContainmentActions(rand: () => number, events: SafetyEvent[]): ContainmentAction[] {
  const actions: ContainmentAction[] = [];

  for (const event of events) {
    const actionCount = randInt(rand, 1, 4);
    for (let i = 0; i < actionCount; i++) {
      const eventDate = new Date(event.event_date);
      const dueDate = addDays(eventDate, randInt(rand, 3, 21));
      const isCompleted = randBool(rand, 0.55);
      const completedDate = isCompleted ? addDays(dueDate, randInt(rand, -5, 2)) : null;

      let status: ContainmentAction["status"] = "Pending";
      if (isCompleted) status = "Completed";
      else if (randBool(rand, 0.3)) status = "In Progress";

      actions.push({
        action_id: uuid(rand),
        event_id: event.event_id,
        action_type: pick(rand, ACTION_TYPES),
        assigned_to: `${pick(rand, PHYSICIAN_FIRST_NAMES)} ${pick(rand, PHYSICIAN_LAST_NAMES)}`,
        assigned_department: pick(rand, ADMIN_DEPARTMENTS),
        due_date: toIsoDate(dueDate),
        completed_date: completedDate ? toIsoDate(completedDate) : null,
        status,
      });
    }
  }

  return actions;
}

function samplePatients(rand: () => number, patients: Patient[], count: number): Patient[] {
  if (patients.length === 0) return [];
  const copy = [...patients];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}
