import type { Encounter, Procedure } from "@/lib/types";
import { CPT_CODES } from "@/lib/seed-data/cpt-codes";
import { OPERATING_ROOMS, PHYSICIAN_FIRST_NAMES, PHYSICIAN_LAST_NAMES } from "@/lib/seed-data/departments";
import { addDays, pick, randBool, randInt, toIsoDate, uuid } from "@/lib/rng";

const CANCELLATION_REASONS = [
  "Patient no-show",
  "Surgeon unavailable",
  "Pre-op labs incomplete",
  "Insurance auth pending",
];

export function generateProcedures(rand: () => number, encounters: Encounter[]): Procedure[] {
  const procedures: Procedure[] = [];

  for (const encounter of encounters) {
    if (!randBool(rand, 0.55)) continue;
    const procedureCount = randInt(rand, 1, 2);

    for (let i = 0; i < procedureCount; i++) {
      const cpt = pick(rand, CPT_CODES);
      const admitDate = new Date(encounter.admit_date);
      const scheduledDate = addDays(admitDate, randInt(rand, 0, 3));
      const isCancelled = randBool(rand, 0.12);
      const actualDate = isCancelled ? null : addDays(scheduledDate, randInt(rand, 0, 1));

      procedures.push({
        procedure_id: uuid(rand),
        encounter_id: encounter.encounter_id,
        cpt_code: cpt.code,
        description: cpt.description,
        scheduled_date: toIsoDate(scheduledDate),
        actual_date: actualDate ? toIsoDate(actualDate) : null,
        duration_minutes: Math.max(5, cpt.avgDurationMinutes + randInt(rand, -15, 15)),
        operating_room: pick(rand, OPERATING_ROOMS),
        surgeon_name: `Dr. ${pick(rand, PHYSICIAN_FIRST_NAMES)} ${pick(rand, PHYSICIAN_LAST_NAMES)}`,
        cancellation_flag: isCancelled,
        cancellation_reason: isCancelled ? pick(rand, CANCELLATION_REASONS) : null,
      });
    }
  }

  return procedures;
}
