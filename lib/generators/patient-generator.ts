import type { GenerationConfig, Patient, Payer } from "@/lib/types";
import { FIRST_NAMES, LAST_NAMES, PATIENT_GENDERS } from "@/lib/seed-data/names";
import { PAYER_SEEDS, PAYER_TYPE_DEFAULT_DISTRIBUTION } from "@/lib/seed-data/payers";
import { pick, pickWeighted, randInt, randomDateBetween, toIsoDate, uuid } from "@/lib/rng";

export function generatePayers(rand: () => number, config: GenerationConfig): Payer[] {
  return PAYER_SEEDS.filter((seed) => config.payerMix.includes(seed.payer_type)).map((seed) => ({
    payer_id: uuid(rand),
    payer_name: seed.payer_name,
    payer_type: seed.payer_type,
    avg_denial_rate: seed.avg_denial_rate,
    review_turnaround_days: seed.review_turnaround_days,
  }));
}

export function generatePatients(
  rand: () => number,
  config: GenerationConfig,
  payers: Payer[],
): Patient[] {
  const start = new Date(config.startDate);
  const end = new Date(config.endDate);

  const weightedPayers: [Payer, number][] = payers.map((p) => [
    p,
    PAYER_TYPE_DEFAULT_DISTRIBUTION[p.payer_type] ?? 0.1,
  ]);

  const patients: Patient[] = [];
  for (let i = 0; i < config.patientCount; i++) {
    const primaryPayer = pickWeighted(rand, weightedPayers);
    const hasSecondary = rand() < 0.2 && payers.length > 1;
    let secondaryPayer: Payer | null = null;
    if (hasSecondary) {
      const candidates = payers.filter((p) => p.payer_id !== primaryPayer.payer_id);
      secondaryPayer = candidates.length ? pick(rand, candidates) : null;
    }

    const dob = randomDateBetween(rand, new Date(1935, 0, 1), new Date(2015, 11, 31));
    const admissionDate = randomDateBetween(rand, start, end);

    patients.push({
      patient_id: uuid(rand),
      mrn: `MRN-${String(randInt(rand, 1000000, 9999999))}`,
      first_name: pick(rand, FIRST_NAMES),
      last_name: pick(rand, LAST_NAMES),
      date_of_birth: toIsoDate(dob),
      gender: pick(rand, PATIENT_GENDERS),
      primary_payer: primaryPayer.payer_id,
      secondary_payer: secondaryPayer ? secondaryPayer.payer_id : null,
      admission_date: toIsoDate(admissionDate),
      expected_los_days: randInt(rand, 1, 12),
    });
  }
  return patients;
}
