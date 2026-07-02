import type { UseCaseDefinition } from "@/lib/types";

export const USE_CASES: UseCaseDefinition[] = [
  {
    id: "utilization-review",
    name: "Utilization Review",
    description: "UR worklist data: authorizations, denials, deadlines.",
    tableCount: 5,
    schema: [
      {
        name: "patients",
        columns: [
          { name: "patient_id", type: "uuid" },
          { name: "mrn", type: "string" },
          { name: "first_name", type: "string" },
          { name: "last_name", type: "string" },
          { name: "date_of_birth", type: "date" },
          { name: "gender", type: "string" },
          { name: "primary_payer", type: "uuid", isForeignKey: true },
          { name: "secondary_payer", type: "uuid | null", isForeignKey: true },
          { name: "admission_date", type: "date" },
          { name: "expected_los_days", type: "number" },
        ],
      },
      {
        name: "payers",
        columns: [
          { name: "payer_id", type: "uuid" },
          { name: "payer_name", type: "string" },
          { name: "payer_type", type: "string" },
          { name: "avg_denial_rate", type: "number" },
          { name: "review_turnaround_days", type: "number" },
        ],
      },
      {
        name: "encounters",
        columns: [
          { name: "encounter_id", type: "uuid" },
          { name: "patient_id", type: "uuid", isForeignKey: true },
          { name: "encounter_type", type: "string" },
          { name: "admit_date", type: "date" },
          { name: "discharge_date", type: "date | null" },
          { name: "attending_physician", type: "string" },
          { name: "department", type: "string" },
          { name: "drg_code", type: "string" },
          { name: "los_days", type: "number" },
          { name: "status", type: "string" },
        ],
      },
      {
        name: "diagnoses",
        columns: [
          { name: "diagnosis_id", type: "uuid" },
          { name: "encounter_id", type: "uuid", isForeignKey: true },
          { name: "icd10_code", type: "string" },
          { name: "description", type: "string" },
          { name: "is_primary", type: "boolean" },
          { name: "diagnosis_date", type: "date" },
        ],
      },
      {
        name: "clinical_reviews",
        columns: [
          { name: "review_id", type: "uuid" },
          { name: "encounter_id", type: "uuid", isForeignKey: true },
          { name: "review_type", type: "string" },
          { name: "review_date", type: "date" },
          { name: "reviewer_name", type: "string" },
          { name: "clinical_criteria_met", type: "boolean" },
          { name: "authorization_status", type: "string" },
          { name: "denial_reason", type: "string | null" },
          { name: "missing_documentation", type: "string[] | null" },
          { name: "deadline_date", type: "date" },
          { name: "priority_score", type: "number" },
        ],
      },
    ],
  },
  {
    id: "patient-safety",
    name: "Patient Safety",
    description: "Recalls, containment, and blast-radius tracking.",
    tableCount: 5,
    schema: [
      {
        name: "patients",
        columns: [
          { name: "patient_id", type: "uuid" },
          { name: "mrn", type: "string" },
          { name: "first_name", type: "string" },
          { name: "last_name", type: "string" },
          { name: "date_of_birth", type: "date" },
          { name: "gender", type: "string" },
        ],
      },
      {
        name: "encounters",
        columns: [
          { name: "encounter_id", type: "uuid" },
          { name: "patient_id", type: "uuid", isForeignKey: true },
          { name: "encounter_type", type: "string" },
          { name: "department", type: "string" },
        ],
      },
      {
        name: "safety_events",
        columns: [
          { name: "event_id", type: "uuid" },
          { name: "event_type", type: "string" },
          { name: "event_date", type: "date" },
          { name: "severity", type: "string" },
          { name: "source", type: "string" },
          { name: "description", type: "string" },
          { name: "affected_product", type: "string" },
          { name: "status", type: "string" },
          { name: "response_owner", type: "string" },
        ],
      },
      {
        name: "affected_patients",
        columns: [
          { name: "id", type: "uuid" },
          { name: "event_id", type: "uuid", isForeignKey: true },
          { name: "patient_id", type: "uuid", isForeignKey: true },
          { name: "exposure_date", type: "date" },
          { name: "exposure_type", type: "string" },
          { name: "containment_status", type: "string" },
          { name: "clinical_impact", type: "string" },
        ],
      },
      {
        name: "containment_actions",
        columns: [
          { name: "action_id", type: "uuid" },
          { name: "event_id", type: "uuid", isForeignKey: true },
          { name: "action_type", type: "string" },
          { name: "assigned_to", type: "string" },
          { name: "assigned_department", type: "string" },
          { name: "due_date", type: "date" },
          { name: "completed_date", type: "date | null" },
          { name: "status", type: "string" },
        ],
      },
    ],
  },
  {
    id: "clinical-ops",
    name: "Clinical Operations",
    description: "OR utilization, readmissions, lab turnaround SLAs.",
    tableCount: 4,
    schema: [
      {
        name: "patients",
        columns: [
          { name: "patient_id", type: "uuid" },
          { name: "mrn", type: "string" },
          { name: "first_name", type: "string" },
          { name: "last_name", type: "string" },
        ],
      },
      {
        name: "encounters",
        columns: [
          { name: "encounter_id", type: "uuid" },
          { name: "patient_id", type: "uuid", isForeignKey: true },
          { name: "wait_time_minutes", type: "number" },
          { name: "bed_assignment_delay_minutes", type: "number" },
          { name: "discharge_delay_minutes", type: "number" },
          { name: "readmission_flag", type: "boolean" },
          { name: "readmission_days", type: "number | null" },
        ],
      },
      {
        name: "procedures",
        columns: [
          { name: "procedure_id", type: "uuid" },
          { name: "encounter_id", type: "uuid", isForeignKey: true },
          { name: "cpt_code", type: "string" },
          { name: "description", type: "string" },
          { name: "scheduled_date", type: "date" },
          { name: "actual_date", type: "date | null" },
          { name: "duration_minutes", type: "number" },
          { name: "operating_room", type: "string" },
          { name: "surgeon_name", type: "string" },
          { name: "cancellation_flag", type: "boolean" },
          { name: "cancellation_reason", type: "string | null" },
        ],
      },
      {
        name: "lab_results",
        columns: [
          { name: "lab_id", type: "uuid" },
          { name: "encounter_id", type: "uuid", isForeignKey: true },
          { name: "test_name", type: "string" },
          { name: "ordered_date", type: "date" },
          { name: "resulted_date", type: "date" },
          { name: "turnaround_hours", type: "number" },
          { name: "value", type: "number" },
          { name: "unit", type: "string" },
          { name: "abnormal_flag", type: "boolean" },
          { name: "critical_flag", type: "boolean" },
        ],
      },
    ],
  },
];

export function getUseCase(id: string): UseCaseDefinition | undefined {
  return USE_CASES.find((uc) => uc.id === id);
}
