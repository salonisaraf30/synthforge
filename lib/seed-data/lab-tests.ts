export interface LabTestSeed {
  test_name: string;
  unit: string;
  reference_range_low: number;
  reference_range_high: number;
  criticalLow?: number;
  criticalHigh?: number;
  decimals: number;
}

export const LAB_TESTS: LabTestSeed[] = [
  { test_name: "CBC", unit: "10^3/uL", reference_range_low: 4.5, reference_range_high: 11.0, criticalLow: 2.0, criticalHigh: 30.0, decimals: 1 },
  { test_name: "BMP", unit: "mg/dL", reference_range_low: 70, reference_range_high: 100, criticalLow: 40, criticalHigh: 500, decimals: 0 },
  { test_name: "Lipid Panel", unit: "mg/dL", reference_range_low: 100, reference_range_high: 199, criticalLow: 0, criticalHigh: 400, decimals: 0 },
  { test_name: "HbA1c", unit: "%", reference_range_low: 4.0, reference_range_high: 5.6, criticalLow: 0, criticalHigh: 14, decimals: 1 },
  { test_name: "Troponin", unit: "ng/mL", reference_range_low: 0.0, reference_range_high: 0.04, criticalLow: 0, criticalHigh: 10, decimals: 2 },
  { test_name: "TSH", unit: "mIU/L", reference_range_low: 0.4, reference_range_high: 4.0, criticalLow: 0.01, criticalHigh: 100, decimals: 2 },
  { test_name: "Urinalysis", unit: "score", reference_range_low: 0, reference_range_high: 1, criticalLow: 0, criticalHigh: 3, decimals: 0 },
  { test_name: "PT/INR", unit: "INR", reference_range_low: 0.8, reference_range_high: 1.2, criticalLow: 0.5, criticalHigh: 8, decimals: 1 },
];
