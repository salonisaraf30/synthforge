import type {
  AffectedPatient,
  AnomalyDensity,
  ClinicalReview,
  ContainmentAction,
  Encounter,
  LabResult,
  Patient,
  Procedure,
  SafetyEvent,
} from "@/lib/types";
import { addDays, randBool, toIsoDate } from "@/lib/rng";

export const ANOMALY_DENSITY_RATE: Record<AnomalyDensity, number> = {
  low: 0.05,
  medium: 0.15,
  high: 0.3,
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function injectUtilizationReviewAnomalies(
  rand: () => number,
  density: AnomalyDensity,
  patients: Patient[],
  encounters: Encounter[],
  reviews: ClinicalReview[],
  today: Date,
): number {
  const rate = ANOMALY_DENSITY_RATE[density];
  let count = 0;

  const patientById = new Map(patients.map((p) => [p.patient_id, p]));
  const reviewsByEncounter = new Map(reviews.map((r) => [r.encounter_id, r]));

  for (const encounter of encounters) {
    if (!randBool(rand, rate)) continue;
    const patient = patientById.get(encounter.patient_id);
    if (!patient) continue;

    encounter.los_days = Math.max(encounter.los_days, Math.round(patient.expected_los_days * 2.2));
    encounter._anomaly = { label: "LOS exceeds expected by 2x+ — continued stay review needed", severity: "warning" };
    count++;

    const review = reviewsByEncounter.get(encounter.encounter_id);
    if (review) {
      review.authorization_status = "Pending";
      review.deadline_date = toIsoDate(new Date(today.getTime() - 2 * DAY_MS));
      review._anomaly = { label: "Pending authorization past deadline — urgent review", severity: "danger" };
      count++;
    }
  }

  for (const review of reviews) {
    if (review._anomaly) continue;
    if (!randBool(rand, rate * 0.6)) continue;
    review.authorization_status = "Denied";
    review.clinical_criteria_met = false;
    review.missing_documentation = review.missing_documentation ?? ["Progress notes for latest 48 hours"];
    review._anomaly = { label: "High denial-risk payer + missing documentation", severity: "danger" };
    count++;
  }

  for (const review of reviews) {
    if (review._anomaly) continue;
    if (!randBool(rand, rate * 0.4)) continue;
    review.clinical_criteria_met = false;
    review.deadline_date = toIsoDate(addDays(today, 1));
    review._anomaly = { label: "Criteria not met + approaching deadline — escalation needed", severity: "warning" };
    count++;
  }

  const encountersByPatient = new Map<string, Encounter[]>();
  for (const encounter of encounters) {
    const list = encountersByPatient.get(encounter.patient_id) ?? [];
    list.push(encounter);
    encountersByPatient.set(encounter.patient_id, list);
  }
  for (const list of encountersByPatient.values()) {
    if (list.length < 2) continue;
    const sorted = [...list].sort(
      (a, b) => new Date(a.admit_date).getTime() - new Date(b.admit_date).getTime(),
    );
    for (let i = 1; i < sorted.length; i++) {
      const gapDays =
        (new Date(sorted[i].admit_date).getTime() - new Date(sorted[i - 1].admit_date).getTime()) / DAY_MS;
      if (gapDays <= 30 && !sorted[i]._anomaly) {
        sorted[i]._anomaly = { label: "Readmission within 30 days — readmission risk", severity: "warning" };
        count++;
      }
    }
  }

  return count;
}

export function injectPatientSafetyAnomalies(
  rand: () => number,
  density: AnomalyDensity,
  events: SafetyEvent[],
  affectedPatients: AffectedPatient[],
  actions: ContainmentAction[],
  today: Date,
): number {
  const rate = ANOMALY_DENSITY_RATE[density];
  let count = 0;

  const affectedByEvent = new Map<string, number>();
  for (const ap of affectedPatients) {
    affectedByEvent.set(ap.event_id, (affectedByEvent.get(ap.event_id) ?? 0) + 1);
  }
  for (const event of events) {
    if ((affectedByEvent.get(event.event_id) ?? 0) >= 15 && randBool(rand, Math.max(rate, 0.5))) {
      event._anomaly = { label: "Blast radius: affects many patients across departments", severity: "danger" };
      count++;
    }
  }

  for (const action of actions) {
    if (action.status === "Completed") continue;
    const dueDate = new Date(action.due_date);
    if (dueDate < today && randBool(rand, Math.max(rate, 0.6))) {
      action.status = "Overdue";
      action._anomaly = { label: "Overdue containment action — escalation needed", severity: "danger" };
      count++;
    }
  }

  for (const ap of affectedPatients) {
    if (ap.clinical_impact === "Adverse Reaction Confirmed" && randBool(rand, Math.max(rate, 0.5))) {
      ap.containment_status = ap.containment_status === "Cleared" ? "Monitored" : ap.containment_status;
      ap._anomaly = { label: "Confirmed adverse reaction + incomplete follow-up", severity: "danger" };
      count++;
    }
  }

  const eventsBySource = new Map<string, SafetyEvent[]>();
  for (const event of events) {
    const list = eventsBySource.get(event.source) ?? [];
    list.push(event);
    eventsBySource.set(event.source, list);
  }
  for (const list of eventsBySource.values()) {
    if (list.length < 2) continue;
    const sorted = [...list].sort(
      (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
    );
    for (let i = 1; i < sorted.length; i++) {
      const gapDays =
        (new Date(sorted[i].event_date).getTime() - new Date(sorted[i - 1].event_date).getTime()) / DAY_MS;
      if (gapDays <= 90 && !sorted[i]._anomaly) {
        sorted[i]._anomaly = { label: "Multiple events from same source within 90 days — supplier risk", severity: "warning" };
        count++;
      }
    }
  }

  for (const event of events) {
    if (event._anomaly) continue;
    if (event.event_type === "Temperature Excursion" && randBool(rand, rate)) {
      event._anomaly = { label: "Temperature excursion linked to medication orders", severity: "warning" };
      count++;
    }
  }

  return count;
}

export function injectClinicalOpsAnomalies(
  rand: () => number,
  density: AnomalyDensity,
  encounters: Encounter[],
  procedures: Procedure[],
  labResults: LabResult[],
): number {
  const rate = ANOMALY_DENSITY_RATE[density];
  let count = 0;

  const procsByOr = new Map<string, Procedure[]>();
  for (const proc of procedures) {
    const list = procsByOr.get(proc.operating_room) ?? [];
    list.push(proc);
    procsByOr.set(proc.operating_room, list);
  }
  for (const list of procsByOr.values()) {
    const cancelledCount = list.filter((p) => p.cancellation_flag).length;
    if (cancelledCount >= 2) {
      for (const proc of list) {
        if (proc.cancellation_flag && !proc._anomaly && randBool(rand, Math.max(rate, 0.5))) {
          proc._anomaly = { label: "OR utilization gap — repeated cancellations", severity: "warning" };
          count++;
        }
      }
    }
  }

  for (const encounter of encounters) {
    if (encounter.readmission_flag && randBool(rand, Math.max(rate, 0.4))) {
      encounter._anomaly = { label: "High readmission rate for department", severity: "warning" };
      count++;
    }
  }

  for (const lab of labResults) {
    const isCriticalTest = ["Troponin", "PT/INR"].includes(lab.test_name);
    if (isCriticalTest && lab.turnaround_hours > 4 && randBool(rand, Math.max(rate, 0.5))) {
      lab._anomaly = { label: "Turnaround exceeds SLA for critical test", severity: "danger" };
      count++;
    }
  }

  for (const encounter of encounters) {
    if (encounter._anomaly) continue;
    if ((encounter.bed_assignment_delay_minutes ?? 0) > 120 && randBool(rand, rate)) {
      encounter._anomaly = { label: "Bed assignment delay correlated with shift", severity: "warning" };
      count++;
    }
  }

  for (const proc of procedures) {
    if (proc._anomaly) continue;
    if (proc.cancellation_flag && proc.cancellation_reason === "Insurance auth pending" && randBool(rand, rate)) {
      proc._anomaly = { label: "Cancellation clustered around insurance authorization issues", severity: "warning" };
      count++;
    }
  }

  return count;
}
