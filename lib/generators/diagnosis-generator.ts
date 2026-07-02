import type { Diagnosis, Encounter } from "@/lib/types";
import { ICD10_CODES } from "@/lib/seed-data/icd10-codes";
import { pick, randInt, toIsoDate, uuid, addDays } from "@/lib/rng";

export function generateDiagnoses(rand: () => number, encounters: Encounter[]): Diagnosis[] {
  const diagnoses: Diagnosis[] = [];

  for (const encounter of encounters) {
    const diagnosisCount = randInt(rand, 1, 4);
    const admitDate = new Date(encounter.admit_date);

    for (let i = 0; i < diagnosisCount; i++) {
      const code = pick(rand, ICD10_CODES);
      diagnoses.push({
        diagnosis_id: uuid(rand),
        encounter_id: encounter.encounter_id,
        icd10_code: code.code,
        description: code.description,
        is_primary: i === 0,
        diagnosis_date: toIsoDate(addDays(admitDate, randInt(rand, 0, 2))),
      });
    }
  }

  return diagnoses;
}
