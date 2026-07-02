# SynthForge — Healthcare Synthetic Data Lab

> A demo project for Northslope Technologies. Built by Saloni Saraf.
> Purpose: Show Tyler Freund (FDE @ Northslope) that I can ship production-quality tools that solve real operator pain points — specifically, the "we need realistic demo data for a healthcare customer meeting in 2 hours" problem that every FDE faces.

---

## What This Is

SynthForge generates realistic, interconnected synthetic healthcare datasets on demand. An FDE picks a use case (Utilization Review, Patient Safety, Clinical Operations), configures complexity (number of patients, time range, anomaly density), and gets a downloadable dataset with realistic distributions, proper ICD-10 codes, linked entities, and pre-planted signals that a Foundry demo can surface.

No real PHI. No hand-building CSVs. No asking the data team for "that one spreadsheet from last quarter."

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Generation:** Merge Gateway API (LLM-assisted schema + deterministic engine for row production)
- **Export:** Client-side CSV/JSON generation (no backend persistence)
- **Deployment:** Vercel
- **No database.** Everything generates on-the-fly and downloads. Stateless.

---

## Design Direction

### Aesthetic: "Lab Instrument"

Think clinical precision meets developer tooling. This is a tool that a senior engineer uses to get work done, not a marketing page. Clean, dense, information-forward.

**DO NOT** use:
- Warm cream backgrounds (#F4F1EA or anything near it)
- Terracotta / warm clay accents
- Dark mode with neon green or acid accents
- Gratuitous gradients, blurs, or glassmorphism
- Rounded-everything pill shapes
- Emoji in UI labels
- "AI-powered" badges or sparkle icons
- Numbered step markers (01 / 02 / 03) unless representing an actual sequence

**DO use:**
- A cool, clinical palette (see tokens below)
- Sharp corners (border-radius: 2px max on cards, 0 on containers)
- Dense information layout — data tables, compact controls
- Monospace type for data values and counts
- Quiet transitions, no bouncing or spring animations

### Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `surface` | `#F8F9FB` | Page background — cool gray-white, not warm |
| `surface-raised` | `#FFFFFF` | Cards, panels |
| `surface-sunken` | `#EEF0F4` | Input fields, code blocks, table headers |
| `border` | `#D4D8E1` | Dividers, card borders — visible but quiet |
| `text-primary` | `#1A1D26` | Headings, primary labels |
| `text-secondary` | `#5C6370` | Descriptions, secondary info |
| `text-muted` | `#9CA3AF` | Placeholders, disabled states |
| `accent` | `#2563EB` | Primary actions, active states — standard blue, not fancy |
| `accent-hover` | `#1D4ED8` | Button hover |
| `accent-light` | `#EFF6FF` | Selected row highlight, active tab background |
| `success` | `#16A34A` | Completed generation, valid data indicators |
| `warning` | `#D97706` | Anomaly indicators, edge case flags |
| `danger` | `#DC2626` | Critical anomalies, high-risk flags in generated data |

### Typography

- **Display / Headings:** `Inter` — weight 600 for page title, 500 for section heads. No bold-everything.
- **Body / UI:** `Inter` — weight 400, 14px base. Compact line-height (1.4).
- **Data / Counts / Code:** `JetBrains Mono` or `IBM Plex Mono` — weight 400, 13px. Used for: row counts, column names, data previews, file sizes, generation stats.
- **No decorative fonts.** This is a tool, not a landing page.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  SynthForge              [GitHub]                        │  ← minimal top bar, logo left
├───────────────┬─────────────────────────────────────────┤
│               │                                         │
│  USE CASE     │  CONFIGURATION PANEL                    │
│  SELECTOR     │                                         │
│               │  ┌─────────────────────────────────┐    │
│  ☐ Utiliz.    │  │ Patient Count     [slider] 500  │    │
│    Review     │  │ Time Range        [dates]       │    │
│               │  │ Anomaly Density   [low/med/high]│    │
│  ☐ Patient    │  │ Payer Mix         [checkboxes]  │    │
│    Safety     │  │                                 │    │
│               │  │        [ Generate Dataset ]     │    │
│  ☐ Clinical   │  └─────────────────────────────────┘    │
│    Ops        │                                         │
│               │  DATA PREVIEW                           │
│  ─────────    │  ┌─────────────────────────────────┐    │
│               │  │ Tab: Patients | Encounters |     │    │
│  SCHEMA       │  │      Claims | Diagnoses | Labs   │    │
│  EXPLORER     │  │                                 │    │
│               │  │  [data table with 10 preview    │    │
│  patients     │  │   rows, sortable columns,       │    │
│   ├─ id       │  │   monospace values]              │    │
│   ├─ mrn      │  │                                 │    │
│   ├─ dob      │  └─────────────────────────────────┘    │
│   └─ ...      │                                         │
│  encounters   │  GENERATION STATS                       │
│   ├─ ...      │  ┌──────┬──────┬──────┬──────┐         │
│               │  │ 500  │ 2.4K │ 1.1K │ 3.8K │         │
│               │  │ pts  │ enc  │ clms │ dx   │         │
│               │  └──────┴──────┴──────┴──────┘         │
│               │                                         │
│               │  [ ↓ Download CSV ]  [ ↓ Download JSON ]│
├───────────────┴─────────────────────────────────────────┤
│  Built by Saloni Saraf | Demo for Northslope Technologies│
└─────────────────────────────────────────────────────────┘
```

- **Left sidebar:** ~240px fixed. Use case selector on top, schema explorer below (tree view of generated tables and columns).
- **Main panel:** Configuration at top, data preview below, stats + download at bottom.
- **No hero section.** No marketing copy. The tool IS the hero. User lands, picks a use case, configures, generates. Done.

---

## Healthcare Use Cases

### 1. Utilization Review

Mirrors Northslope's "Utilization Review Summarization & Decision Support" product. Generates data that would feed a UR worklist.

**Tables generated:**

**patients**
- `patient_id` (UUID)
- `mrn` (medical record number, format: MRN-XXXXXXX)
- `first_name`, `last_name`
- `date_of_birth`
- `gender` (M/F/Other)
- `primary_payer` (FK → payers)
- `secondary_payer` (nullable FK → payers)
- `admission_date`
- `expected_los_days` (expected length of stay)

**encounters**
- `encounter_id` (UUID)
- `patient_id` (FK → patients)
- `encounter_type` (Inpatient, Outpatient, ED, Observation)
- `admit_date`, `discharge_date` (nullable if still admitted)
- `attending_physician` (name)
- `department` (Cardiology, Orthopedics, General Surgery, Internal Medicine, Neurology, Oncology)
- `drg_code` (diagnosis-related group)
- `los_days` (actual length of stay)
- `status` (Active, Discharged, Pending Review)

**clinical_reviews**
- `review_id` (UUID)
- `encounter_id` (FK → encounters)
- `review_type` (Initial, Continued Stay, Retrospective)
- `review_date`
- `reviewer_name`
- `clinical_criteria_met` (boolean)
- `authorization_status` (Approved, Denied, Pending, Appealed)
- `denial_reason` (nullable — e.g., "Medical necessity not established", "Insufficient documentation", "Alternative setting available")
- `missing_documentation` (nullable — array of strings: "Progress notes for 6/12", "Lab results CBC", "Attending attestation")
- `deadline_date`
- `priority_score` (1-10, calculated from denial risk)

**payers**
- `payer_id` (UUID)
- `payer_name` (realistic names: "Blue Cross Blue Shield", "Aetna", "UnitedHealthcare", "Medicare Part A", "Medicaid", "Cigna", "Humana")
- `payer_type` (Commercial, Medicare, Medicaid, Self-Pay)
- `avg_denial_rate` (percentage, varies by payer — Medicare ~5%, Commercial ~15%)
- `review_turnaround_days`

**diagnoses**
- `diagnosis_id` (UUID)
- `encounter_id` (FK → encounters)
- `icd10_code` (real ICD-10 codes — pull from a curated list of ~200 common codes)
- `description` (matching ICD-10 description)
- `is_primary` (boolean)
- `diagnosis_date`

**Pre-planted signals (anomalies) for the Utilization Review use case:**
- Patients with LOS exceeding expected by 2x+ (UR flag: continued stay review needed)
- Encounters with pending authorization past deadline (UR flag: urgent review)
- High denial-rate payers + missing documentation combo (UR flag: denial risk)
- Multiple encounters for same patient within 30 days (UR flag: readmission risk)
- Clinical criteria not met + approaching deadline (UR flag: escalation needed)

**Anomaly density control:**
- Low: ~5% of records have planted signals
- Medium: ~15% of records
- High: ~30% of records

---

### 2. Patient Safety

Mirrors Northslope's "Patient Safety Impact Response Center" product.

**Tables generated:**

**patients** (same schema as above, shared)

**safety_events**
- `event_id` (UUID)
- `event_type` (FDA Recall, Contamination Alert, Sterility Failure, Temperature Excursion, Medication Error, Device Malfunction)
- `event_date`
- `severity` (Critical, High, Moderate, Low)
- `source` (FDA, Internal QA, Supplier Notification, Lab Alert)
- `description` (generated text — e.g., "Lot 2024-0847 of surgical mesh recalled due to sterility concern")
- `affected_product` (e.g., "Surgical Mesh - Lot 2024-0847", "Insulin Glargine 100U/mL - Batch BX2291")
- `status` (Open, Investigating, Contained, Resolved)
- `response_owner` (name + department)

**affected_patients**
- `id` (UUID)
- `event_id` (FK → safety_events)
- `patient_id` (FK → patients)
- `exposure_date`
- `exposure_type` (Direct, Indirect, Potential)
- `containment_status` (Identified, Contacted, Monitored, Cleared)
- `clinical_impact` (None Detected, Under Observation, Adverse Reaction Confirmed)

**containment_actions**
- `action_id` (UUID)
- `event_id` (FK → safety_events)
- `action_type` (Product Quarantine, Patient Notification, Supplier Contact, Regulatory Filing, Clinical Follow-up)
- `assigned_to` (name)
- `assigned_department` (Supply Chain, Clinical, Pharmacy, Quality, Regulatory)
- `due_date`
- `completed_date` (nullable)
- `status` (Pending, In Progress, Completed, Overdue)

**Pre-planted signals:**
- Recalls affecting 50+ patients across multiple departments (blast radius demo)
- Overdue containment actions (escalation needed)
- Patients with confirmed adverse reactions + incomplete follow-up
- Multiple events from the same supplier within 90 days (supplier risk pattern)
- Temperature excursions in pharmacy with connected medication orders

---

### 3. Clinical Operations

General-purpose dataset for clinical workflow optimization.

**Tables generated:**

**patients** (shared)

**encounters** (shared, extended with):
- `wait_time_minutes`
- `bed_assignment_delay_minutes`
- `discharge_delay_minutes`
- `readmission_flag` (boolean)
- `readmission_days` (nullable, days since prior discharge)

**procedures**
- `procedure_id` (UUID)
- `encounter_id` (FK → encounters)
- `cpt_code` (common CPT codes from a curated list of ~100)
- `description`
- `scheduled_date`, `actual_date`
- `duration_minutes`
- `operating_room` (OR-1 through OR-8)
- `surgeon_name`
- `cancellation_flag` (boolean)
- `cancellation_reason` (nullable — "Patient no-show", "Surgeon unavailable", "Pre-op labs incomplete", "Insurance auth pending")

**lab_results**
- `lab_id` (UUID)
- `encounter_id` (FK → encounters)
- `test_name` (CBC, BMP, Lipid Panel, HbA1c, Troponin, TSH, Urinalysis, PT/INR)
- `ordered_date`, `resulted_date`
- `turnaround_hours`
- `value` (numeric, realistic ranges per test)
- `unit`
- `reference_range_low`, `reference_range_high`
- `abnormal_flag` (boolean)
- `critical_flag` (boolean)

**Pre-planted signals:**
- OR utilization gaps (rooms booked but procedures cancelled repeatedly)
- High readmission rates for specific departments
- Lab turnaround times exceeding SLA for critical tests
- Bed assignment delays correlated with specific shifts
- Procedure cancellations clustered around specific insurance authorization issues

---

## Data Generation Architecture

### How It Works

1. **Schema Definition Layer** — TypeScript interfaces define every table, column, type, and constraint. These are static and deterministic.

2. **Seed Data** — Curated arrays of realistic values baked into the codebase:
   - ~200 common ICD-10 codes with descriptions
   - ~100 common CPT codes with descriptions
   - Realistic payer names and denial rates
   - Name lists (first/last, diverse)
   - Department names, physician names
   - Medication names, lab test reference ranges

3. **Generation Engine** — TypeScript functions that:
   - Create the patient population first (anchor table)
   - Generate encounters linked to patients with realistic distributions (Poisson for visit frequency, log-normal for LOS)
   - Generate downstream records (diagnoses, labs, claims) linked to encounters
   - Apply anomaly injection based on density setting
   - Use Merge Gateway API to generate realistic clinical notes / free-text descriptions where needed (safety event descriptions, denial reasons, clinical narratives)

4. **Export** — Client-side. Convert generated arrays to CSV or JSON and trigger browser download. One file per table, or a single ZIP with all tables.

### Merge Gateway API Integration

Used specifically for:
- Generating realistic free-text clinical descriptions (safety event narratives, clinical review notes)
- Generating realistic denial reason language
- Creating coherent patient clinical histories (so diagnoses, labs, and procedures tell a consistent clinical story per patient)

**NOT** used for:
- Structured data generation (that's deterministic TypeScript)
- Schema definition (hardcoded)
- Statistical distributions (hardcoded)

API call pattern:
```typescript
// Example: Generate clinical narratives for safety events
const prompt = `Generate ${count} realistic FDA safety event descriptions for healthcare synthetic data. 
Each should be 1-2 sentences. Mix of: surgical device recalls, pharmaceutical lot contamination, 
sterility failures, and temperature excursions. Return as JSON array of strings.`;

const response = await fetch('/api/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt, count })
});
```

Route handler at `/api/generate` calls Merge Gateway with the provided API key (stored in `.env.local` as `MERGE_GATEWAY_API_KEY`).

---

## Component Breakdown

### `app/layout.tsx`
- Import Inter + JetBrains Mono from Google Fonts
- Set `<html>` background to `#F8F9FB`
- Minimal metadata: "SynthForge — Healthcare Synthetic Data Lab"

### `app/page.tsx`
- Two-column layout: sidebar + main
- State management via `useState` (no external state library needed)
- Top-level state: selected use case, configuration values, generated data, generation status

### `components/Sidebar.tsx`
- **UseCaseSelector** — Three clickable cards (Utilization Review, Patient Safety, Clinical Ops). Selected state = blue left border + `accent-light` background. Unselected = plain white. Each card shows: use case name, one-line description, table count badge.
- **SchemaExplorer** — Tree view that appears after data is generated. Shows each table name with expandable column list. Column entries show: name (monospace), type (muted), FK indicator if applicable. Clicking a table scrolls the data preview to that tab.

### `components/ConfigPanel.tsx`
- **Patient Count** — Slider, range 50–2000, default 500. Show current value in monospace next to slider.
- **Time Range** — Two date inputs (start/end). Default: last 12 months.
- **Anomaly Density** — Three-option toggle (Low / Medium / High). Not a dropdown — inline segmented control.
- **Payer Mix** — Checkbox group: Commercial, Medicare, Medicaid, Self-Pay. Default: all checked. Shows realistic distribution percentages next to each.
- **Generate Button** — Full-width, `accent` color. Label: "Generate Dataset". While generating: show progress text ("Generating patients… Linking encounters… Injecting anomalies…") with a simple horizontal progress bar (not a spinner). Disable button during generation.

### `components/DataPreview.tsx`
- **Tab bar** — One tab per generated table. Tab shows: table name + row count badge (monospace).
- **Data table** — Sortable columns. 10 rows visible by default with "Show more" to expand to 50. Monospace for IDs, dates, codes. Regular font for names and descriptions. Alternate row shading using `surface-sunken`. Anomaly rows highlighted with a thin left border in `warning` or `danger` color depending on severity.
- **Column headers** — Sticky. Show column name + data type in muted text below.

### `components/GenerationStats.tsx`
- Horizontal stat cards after generation completes. Each card: big number (monospace, 24px), small label below (muted, 12px).
- Stats: Total Patients, Total Encounters, Total Claims/Reviews/Events (varies by use case), Anomalies Planted, Estimated File Size.
- No icons. Just numbers and labels.

### `components/DownloadBar.tsx`
- Fixed to bottom of main panel after generation.
- Two buttons: "Download CSV" and "Download JSON". 
- CSV option: downloads a ZIP containing one .csv per table.
- JSON option: downloads a single .json with all tables as nested arrays.
- Show file size estimate next to each button.

### `components/Footer.tsx`
- Single line: "Built by Saloni Saraf · Demo for Northslope Technologies · [GitHub](link)"
- Muted text, small, bottom of sidebar.

---

## Page Behavior

### Initial State (no data generated)
- Sidebar: Use case selector visible, schema explorer hidden
- Main panel: Config panel visible, data preview area shows empty state: "Select a use case and configure your dataset to get started." in muted text, centered.
- No loading states, no animations on load.

### During Generation
- Generate button disabled, shows progress text
- Progress bar fills as each stage completes (Patients → Encounters → Downstream tables → Anomaly injection → Done)
- Approximate generation time for 500 patients: 2-4 seconds for deterministic data + 3-5 seconds for LLM-generated text fields

### After Generation
- Schema explorer populates in sidebar
- Data preview tabs appear with first table selected
- Stats bar populates
- Download bar appears at bottom
- Smooth scroll to data preview (no jarring jump)

### Regeneration
- Changing any config value does NOT auto-regenerate. User must click Generate again.
- Changing use case resets config to defaults for that use case and clears existing data.

---

## ICD-10 Seed Data (curated subset — include at minimum)

```
E11.9  - Type 2 diabetes mellitus without complications
I10    - Essential (primary) hypertension
I25.10 - Atherosclerotic heart disease of native coronary artery
J18.9  - Pneumonia, unspecified organism
J44.1  - Chronic obstructive pulmonary disease with acute exacerbation
K21.0  - Gastro-esophageal reflux disease with esophagitis
M17.11 - Primary osteoarthritis, right knee
N18.3  - Chronic kidney disease, stage 3
S72.001A - Fracture of unspecified part of neck of right femur, initial
Z87.891 - Personal history of nicotine dependence
I50.9  - Heart failure, unspecified
J96.01 - Acute respiratory failure with hypoxia
K92.1  - Melena
N17.9  - Acute kidney failure, unspecified
R06.02 - Shortness of breath
I21.09 - ST elevation myocardial infarction involving other coronary artery of anterior wall
I63.9  - Cerebral infarction, unspecified
G20    - Parkinson's disease
C34.90 - Malignant neoplasm of unspecified part of unspecified bronchus or lung
F32.9  - Major depressive disorder, single episode, unspecified
```

Include at least 200 codes total across cardiovascular, respiratory, endocrine, musculoskeletal, neurological, oncological, and mental health categories.

---

## File Structure

```
synthforge/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/
│       └── generate/
│           └── route.ts          # Merge Gateway proxy
├── components/
│   ├── Sidebar.tsx
│   ├── UseCaseSelector.tsx
│   ├── SchemaExplorer.tsx
│   ├── ConfigPanel.tsx
│   ├── DataPreview.tsx
│   ├── DataTable.tsx
│   ├── GenerationStats.tsx
│   ├── DownloadBar.tsx
│   └── Footer.tsx
├── lib/
│   ├── types.ts                  # All TypeScript interfaces for tables
│   ├── seed-data/
│   │   ├── icd10-codes.ts        # 200+ ICD-10 codes
│   │   ├── cpt-codes.ts          # 100+ CPT codes  
│   │   ├── payers.ts             # Payer names + realistic stats
│   │   ├── names.ts              # First/last name lists
│   │   ├── departments.ts        # Department + physician lists
│   │   ├── medications.ts        # Common medications
│   │   └── lab-tests.ts          # Lab test names + reference ranges
│   ├── generators/
│   │   ├── patient-generator.ts
│   │   ├── encounter-generator.ts
│   │   ├── diagnosis-generator.ts
│   │   ├── review-generator.ts       # Utilization Review
│   │   ├── safety-event-generator.ts # Patient Safety
│   │   ├── procedure-generator.ts    # Clinical Ops
│   │   ├── lab-generator.ts          # Clinical Ops
│   │   └── anomaly-injector.ts       # Cross-cutting anomaly logic
│   ├── engine.ts                 # Orchestrates full generation pipeline
│   └── export.ts                 # CSV/JSON serialization + ZIP packaging
├── public/
│   └── favicon.ico
├── tailwind.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── .env.local.example            # MERGE_GATEWAY_API_KEY=your_key_here
```

---

## Tailwind Config Extensions

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#F8F9FB',
          raised: '#FFFFFF',
          sunken: '#EEF0F4',
        },
        border: '#D4D8E1',
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
        },
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
    },
  },
};
```

---

## What This Proves to Tyler

1. **"I build the same kind of tools you ship."** — SynthForge solves a real operational problem (demo data generation) using the same pattern Northslope uses with customers: take messy domain knowledge, encode it into software, and put a usable tool in an operator's hands.

2. **"I know your verticals."** — The healthcare schemas aren't generic. They map directly to Northslope's published products (Utilization Review, Patient Safety). Tyler can look at this and think "she actually read what we build."

3. **"I ship fast and full-stack."** — One person, end-to-end: data modeling, generation logic, API integration, frontend, deployment. That's exactly what an FDE does on Day 1 of a customer engagement.

4. **"I think about the operator."** — The UI isn't a tech demo. It's a tool someone would actually open before a customer meeting. Config → Generate → Download → Done. No onboarding needed.

---

## Deployment Checklist

- [ ] Deploy to Vercel
- [ ] Set `MERGE_GATEWAY_API_KEY` in Vercel environment variables
- [ ] Custom domain optional (synthforge.vercel.app is fine for a demo)
- [ ] Test generation at 50, 500, and 2000 patient counts
- [ ] Test CSV and JSON downloads across all three use cases
- [ ] Record a 60-second Loom walkthrough for Tyler
- [ ] Share link + Loom in LinkedIn message to Tyler Freund

---

## LinkedIn Message to Tyler (draft after build is complete)

Keep this for later — once the demo is live, we'll draft a short, direct message linking the live tool + Loom walkthrough. No buzzwords, no "I'm passionate about" — just "I built this thing, here's what it does, here's why it's relevant to what you ship."
