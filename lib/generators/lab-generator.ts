import type { Encounter, LabResult } from "@/lib/types";
import { LAB_TESTS } from "@/lib/seed-data/lab-tests";
import { addDays, randBool, randFloat, randInt, pick, toIsoDate, uuid } from "@/lib/rng";

export function generateLabResults(rand: () => number, encounters: Encounter[]): LabResult[] {
  const results: LabResult[] = [];

  for (const encounter of encounters) {
    const labCount = randInt(rand, 1, 4);
    for (let i = 0; i < labCount; i++) {
      const test = pick(rand, LAB_TESTS);
      const admitDate = new Date(encounter.admit_date);
      const orderedDate = addDays(admitDate, randInt(rand, 0, 2));
      const turnaroundHours = randInt(rand, 1, 72);
      const resultedDate = new Date(orderedDate.getTime() + turnaroundHours * 60 * 60 * 1000);

      const isCritical = randBool(rand, 0.05);
      const isAbnormal = isCritical || randBool(rand, 0.2);

      let value: number;
      const range = test.reference_range_high - test.reference_range_low;
      if (isCritical && test.criticalLow !== undefined && test.criticalHigh !== undefined) {
        value = randBool(rand, 0.5)
          ? randFloat(rand, test.criticalLow, test.reference_range_low, test.decimals)
          : randFloat(rand, test.reference_range_high, test.criticalHigh, test.decimals);
      } else if (isAbnormal) {
        value = randBool(rand, 0.5)
          ? randFloat(rand, test.reference_range_low - range * 0.3, test.reference_range_low, test.decimals)
          : randFloat(rand, test.reference_range_high, test.reference_range_high + range * 0.3, test.decimals);
      } else {
        value = randFloat(rand, test.reference_range_low, test.reference_range_high, test.decimals);
      }

      results.push({
        lab_id: uuid(rand),
        encounter_id: encounter.encounter_id,
        test_name: test.test_name,
        ordered_date: toIsoDate(orderedDate),
        resulted_date: toIsoDate(resultedDate),
        turnaround_hours: turnaroundHours,
        value,
        unit: test.unit,
        reference_range_low: test.reference_range_low,
        reference_range_high: test.reference_range_high,
        abnormal_flag: isAbnormal,
        critical_flag: isCritical,
      });
    }
  }

  return results;
}
