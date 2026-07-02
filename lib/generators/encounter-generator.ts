import type { Encounter, GenerationConfig, Patient } from "@/lib/types";
import { DEPARTMENTS, generatePhysicianName } from "@/lib/seed-data/departments";
import { addDays, logNormal, pick, poisson, randInt, randomDateBetween, toIsoDate, uuid } from "@/lib/rng";

const ENCOUNTER_TYPES: Encounter["encounter_type"][] = ["Inpatient", "Outpatient", "ED", "Observation"];

const DRG_CODES = [
  "DRG-291", // Heart failure w/ MCC
  "DRG-192", // COPD w/o CC/MCC
  "DRG-470", // Major joint replacement
  "DRG-247", // Percutaneous cardiovascular procedure
  "DRG-871", // Septicemia w/ MV 96+ hours
  "DRG-039", // Extracranial procedures w/o CC/MCC
  "DRG-190", // COPD w/ MCC
  "DRG-292", // Heart failure w/ CC
  "DRG-641", // Nutritional and misc metabolic disorders
  "DRG-378", // GI hemorrhage w/ CC
  "DRG-065", // Intracranial hemorrhage w/ CC
  "DRG-885", // Psychoses
  "DRG-069", // Transient ischemia
  "DRG-460", // Spinal fusion w/o MCC
  "DRG-793", // Full term neonate w/ major problems
];

export function generateEncounters(
  rand: () => number,
  config: GenerationConfig,
  patients: Patient[],
  extendClinicalOps: boolean,
): Encounter[] {
  const start = new Date(config.startDate);
  const end = new Date(config.endDate);
  const encounters: Encounter[] = [];

  for (const patient of patients) {
    const visitCount = Math.max(1, poisson(rand, 1.8));
    for (let i = 0; i < visitCount; i++) {
      const admitDate = randomDateBetween(rand, start, end);
      const encounterType = pick(rand, ENCOUNTER_TYPES);
      const isStillAdmitted = encounterType === "Inpatient" && rand() < 0.05;
      const losDays = Math.min(45, Math.max(1, Math.round(logNormal(rand, 1.1, 0.6))));
      const dischargeDate = isStillAdmitted ? null : addDays(admitDate, losDays);

      const encounter: Encounter = {
        encounter_id: uuid(rand),
        patient_id: patient.patient_id,
        encounter_type: encounterType,
        admit_date: toIsoDate(admitDate),
        discharge_date: dischargeDate ? toIsoDate(dischargeDate) : null,
        attending_physician: generatePhysicianName(rand),
        department: pick(rand, DEPARTMENTS),
        drg_code: pick(rand, DRG_CODES),
        los_days: losDays,
        status: isStillAdmitted ? "Active" : rand() < 0.1 ? "Pending Review" : "Discharged",
      };

      if (extendClinicalOps) {
        encounter.wait_time_minutes = randInt(rand, 5, 240);
        encounter.bed_assignment_delay_minutes = randInt(rand, 0, 180);
        encounter.discharge_delay_minutes = randInt(rand, 0, 300);
        encounter.readmission_flag = rand() < 0.12;
        encounter.readmission_days = encounter.readmission_flag ? randInt(rand, 1, 29) : null;
      }

      encounters.push(encounter);
    }
  }

  return encounters;
}
