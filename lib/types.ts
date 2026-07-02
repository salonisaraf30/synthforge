// Core domain types for SynthForge generated datasets.

export type UseCaseId = "utilization-review" | "patient-safety" | "clinical-ops";

export type AnomalyDensity = "low" | "medium" | "high";

export type PayerType = "Commercial" | "Medicare" | "Medicaid" | "Self-Pay";

export interface GenerationConfig {
  useCase: UseCaseId;
  patientCount: number;
  startDate: string; // ISO date
  endDate: string; // ISO date
  anomalyDensity: AnomalyDensity;
  payerMix: PayerType[];
}

export interface Payer {
  payer_id: string;
  payer_name: string;
  payer_type: PayerType;
  avg_denial_rate: number;
  review_turnaround_days: number;
}

export interface Patient {
  patient_id: string;
  mrn: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "M" | "F" | "Other";
  primary_payer: string;
  secondary_payer: string | null;
  admission_date: string;
  expected_los_days: number;
}

export type EncounterType = "Inpatient" | "Outpatient" | "ED" | "Observation";
export type EncounterStatus = "Active" | "Discharged" | "Pending Review";

export interface Encounter {
  encounter_id: string;
  patient_id: string;
  encounter_type: EncounterType;
  admit_date: string;
  discharge_date: string | null;
  attending_physician: string;
  department: string;
  drg_code: string;
  los_days: number;
  status: EncounterStatus;
  // Clinical Ops extensions
  wait_time_minutes?: number;
  bed_assignment_delay_minutes?: number;
  discharge_delay_minutes?: number;
  readmission_flag?: boolean;
  readmission_days?: number | null;
  // anomaly bookkeeping (not exported)
  _anomaly?: AnomalyTag | null;
}

export type ReviewType = "Initial" | "Continued Stay" | "Retrospective";
export type AuthorizationStatus = "Approved" | "Denied" | "Pending" | "Appealed";

export interface ClinicalReview {
  review_id: string;
  encounter_id: string;
  review_type: ReviewType;
  review_date: string;
  reviewer_name: string;
  clinical_criteria_met: boolean;
  authorization_status: AuthorizationStatus;
  denial_reason: string | null;
  missing_documentation: string[] | null;
  deadline_date: string;
  priority_score: number;
  _anomaly?: AnomalyTag | null;
}

export interface Diagnosis {
  diagnosis_id: string;
  encounter_id: string;
  icd10_code: string;
  description: string;
  is_primary: boolean;
  diagnosis_date: string;
}

export type SafetyEventType =
  | "FDA Recall"
  | "Contamination Alert"
  | "Sterility Failure"
  | "Temperature Excursion"
  | "Medication Error"
  | "Device Malfunction";
export type SafetySeverity = "Critical" | "High" | "Moderate" | "Low";
export type SafetySource = "FDA" | "Internal QA" | "Supplier Notification" | "Lab Alert";
export type SafetyStatus = "Open" | "Investigating" | "Contained" | "Resolved";

export interface SafetyEvent {
  event_id: string;
  event_type: SafetyEventType;
  event_date: string;
  severity: SafetySeverity;
  source: SafetySource;
  description: string;
  affected_product: string;
  status: SafetyStatus;
  response_owner: string;
  _anomaly?: AnomalyTag | null;
}

export type ExposureType = "Direct" | "Indirect" | "Potential";
export type ContainmentStatus = "Identified" | "Contacted" | "Monitored" | "Cleared";
export type ClinicalImpact = "None Detected" | "Under Observation" | "Adverse Reaction Confirmed";

export interface AffectedPatient {
  id: string;
  event_id: string;
  patient_id: string;
  exposure_date: string;
  exposure_type: ExposureType;
  containment_status: ContainmentStatus;
  clinical_impact: ClinicalImpact;
  _anomaly?: AnomalyTag | null;
}

export type ContainmentActionType =
  | "Product Quarantine"
  | "Patient Notification"
  | "Supplier Contact"
  | "Regulatory Filing"
  | "Clinical Follow-up";
export type ContainmentActionStatus = "Pending" | "In Progress" | "Completed" | "Overdue";

export interface ContainmentAction {
  action_id: string;
  event_id: string;
  action_type: ContainmentActionType;
  assigned_to: string;
  assigned_department: string;
  due_date: string;
  completed_date: string | null;
  status: ContainmentActionStatus;
  _anomaly?: AnomalyTag | null;
}

export interface Procedure {
  procedure_id: string;
  encounter_id: string;
  cpt_code: string;
  description: string;
  scheduled_date: string;
  actual_date: string | null;
  duration_minutes: number;
  operating_room: string;
  surgeon_name: string;
  cancellation_flag: boolean;
  cancellation_reason: string | null;
  _anomaly?: AnomalyTag | null;
}

export interface LabResult {
  lab_id: string;
  encounter_id: string;
  test_name: string;
  ordered_date: string;
  resulted_date: string;
  turnaround_hours: number;
  value: number;
  unit: string;
  reference_range_low: number;
  reference_range_high: number;
  abnormal_flag: boolean;
  critical_flag: boolean;
  _anomaly?: AnomalyTag | null;
}

export type AnomalySeverity = "warning" | "danger";

export interface AnomalyTag {
  label: string;
  severity: AnomalySeverity;
}

export interface GeneratedTable {
  name: string;
  rows: Record<string, unknown>[];
}

export interface GeneratedDataset {
  useCase: UseCaseId;
  config: GenerationConfig;
  tables: GeneratedTable[];
  stats: {
    label: string;
    value: number;
  }[];
  anomalyCount: number;
  generatedAt: string;
}

export interface ColumnSchema {
  name: string;
  type: string;
  isForeignKey?: boolean;
}

export interface TableSchema {
  name: string;
  columns: ColumnSchema[];
}

export interface UseCaseDefinition {
  id: UseCaseId;
  name: string;
  description: string;
  tableCount: number;
  schema: TableSchema[];
}
