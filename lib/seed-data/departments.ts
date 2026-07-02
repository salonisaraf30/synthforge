export const DEPARTMENTS = [
  "Cardiology",
  "Orthopedics",
  "General Surgery",
  "Internal Medicine",
  "Neurology",
  "Oncology",
];

export const PHYSICIAN_FIRST_NAMES = [
  "Alan", "Rachel", "Samuel", "Diane", "Victor", "Grace", "Marcus", "Elena",
  "Peter", "Julia", "Frank", "Naomi", "Derek", "Hannah", "Isaac", "Renee",
];

export const PHYSICIAN_LAST_NAMES = [
  "Whitfield", "Okafor", "Bergstrom", "Delgado", "Fairweather", "Nakashima",
  "Holloway", "Petrov", "Aldana", "Muto", "Vance", "Ferreira", "Lindqvist",
  "Osei", "Barbieri", "Kowalski",
];

export function generatePhysicianName(rand: () => number): string {
  const first = PHYSICIAN_FIRST_NAMES[Math.floor(rand() * PHYSICIAN_FIRST_NAMES.length)];
  const last = PHYSICIAN_LAST_NAMES[Math.floor(rand() * PHYSICIAN_LAST_NAMES.length)];
  return `Dr. ${first} ${last}`;
}

export const ADMIN_DEPARTMENTS = [
  "Supply Chain",
  "Clinical",
  "Pharmacy",
  "Quality",
  "Regulatory",
];

export const OPERATING_ROOMS = Array.from({ length: 8 }, (_, i) => `OR-${i + 1}`);
