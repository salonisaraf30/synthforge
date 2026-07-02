import type { PayerType } from "@/lib/types";

export interface PayerSeed {
  payer_name: string;
  payer_type: PayerType;
  avg_denial_rate: number;
  review_turnaround_days: number;
}

export const PAYER_SEEDS: PayerSeed[] = [
  { payer_name: "Blue Cross Blue Shield", payer_type: "Commercial", avg_denial_rate: 0.14, review_turnaround_days: 3 },
  { payer_name: "Aetna", payer_type: "Commercial", avg_denial_rate: 0.16, review_turnaround_days: 4 },
  { payer_name: "UnitedHealthcare", payer_type: "Commercial", avg_denial_rate: 0.17, review_turnaround_days: 3 },
  { payer_name: "Cigna", payer_type: "Commercial", avg_denial_rate: 0.15, review_turnaround_days: 4 },
  { payer_name: "Humana", payer_type: "Commercial", avg_denial_rate: 0.13, review_turnaround_days: 5 },
  { payer_name: "Medicare Part A", payer_type: "Medicare", avg_denial_rate: 0.05, review_turnaround_days: 7 },
  { payer_name: "Medicare Advantage", payer_type: "Medicare", avg_denial_rate: 0.08, review_turnaround_days: 5 },
  { payer_name: "Medicaid", payer_type: "Medicaid", avg_denial_rate: 0.11, review_turnaround_days: 10 },
  { payer_name: "Self-Pay", payer_type: "Self-Pay", avg_denial_rate: 0.0, review_turnaround_days: 0 },
];

export const PAYER_TYPE_DEFAULT_DISTRIBUTION: Record<PayerType, number> = {
  Commercial: 0.52,
  Medicare: 0.28,
  Medicaid: 0.15,
  "Self-Pay": 0.05,
};

export const DENIAL_REASONS = [
  "Medical necessity not established",
  "Insufficient documentation",
  "Alternative setting available",
  "Prior authorization not obtained",
  "Non-covered service under plan",
  "Duplicate claim submission",
  "Level of care does not match clinical criteria",
  "Missing physician attestation",
  "Timely filing limit exceeded",
  "Experimental or investigational treatment",
];

export const MISSING_DOCUMENTATION_ITEMS = [
  "Progress notes for latest 48 hours",
  "Lab results CBC",
  "Attending attestation",
  "Physical therapy evaluation",
  "Discharge planning notes",
  "History and physical exam",
  "Medication administration record",
  "Radiology report",
  "Nursing assessment notes",
  "Consult note from specialist",
];
