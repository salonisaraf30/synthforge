import type { AuthorizationStatus, ClinicalReview, Encounter, ReviewType } from "@/lib/types";
import { FIRST_NAMES, LAST_NAMES } from "@/lib/seed-data/names";
import { DENIAL_REASONS, MISSING_DOCUMENTATION_ITEMS } from "@/lib/seed-data/payers";
import { addDays, pick, randBool, randInt, toIsoDate, uuid } from "@/lib/rng";

const REVIEW_TYPES: ReviewType[] = ["Initial", "Continued Stay", "Retrospective"];
const AUTH_STATUSES: AuthorizationStatus[] = ["Approved", "Denied", "Pending", "Appealed"];

export function generateClinicalReviews(
  rand: () => number,
  encounters: Encounter[],
  denialReasonPool: string[] = DENIAL_REASONS,
): ClinicalReview[] {
  const reviews: ClinicalReview[] = [];

  for (const encounter of encounters) {
    const admitDate = new Date(encounter.admit_date);
    const reviewDate = addDays(admitDate, randInt(rand, 0, 3));
    const deadlineDate = addDays(reviewDate, randInt(rand, 2, 7));

    const authorizationStatus = pick(rand, AUTH_STATUSES);
    const clinicalCriteriaMet = authorizationStatus === "Approved" ? true : randBool(rand, 0.4);
    const isDenied = authorizationStatus === "Denied" || authorizationStatus === "Appealed";

    reviews.push({
      review_id: uuid(rand),
      encounter_id: encounter.encounter_id,
      review_type: pick(rand, REVIEW_TYPES),
      review_date: toIsoDate(reviewDate),
      reviewer_name: `${pick(rand, FIRST_NAMES)} ${pick(rand, LAST_NAMES)}`,
      clinical_criteria_met: clinicalCriteriaMet,
      authorization_status: authorizationStatus,
      denial_reason: isDenied ? pick(rand, denialReasonPool) : null,
      missing_documentation: isDenied && randBool(rand, 0.5)
        ? shuffleSample(rand, MISSING_DOCUMENTATION_ITEMS, randInt(rand, 1, 3))
        : null,
      deadline_date: toIsoDate(deadlineDate),
      priority_score: computePriorityScore(rand, isDenied, clinicalCriteriaMet),
    });
  }

  return reviews;
}

function computePriorityScore(rand: () => number, isDenied: boolean, criteriaMet: boolean): number {
  let base = randInt(rand, 1, 5);
  if (isDenied) base += 3;
  if (!criteriaMet) base += 2;
  return Math.min(10, base);
}

function shuffleSample<T>(rand: () => number, arr: readonly T[], count: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}
