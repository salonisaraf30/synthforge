export interface CptCode {
  code: string;
  description: string;
  category: string;
  avgDurationMinutes: number;
}

export const CPT_CODES: CptCode[] = [
  // Cardiovascular
  { code: "33533", description: "Coronary artery bypass, single arterial graft", category: "Cardiovascular", avgDurationMinutes: 240 },
  { code: "92920", description: "Percutaneous transluminal coronary angioplasty, single major vessel", category: "Cardiovascular", avgDurationMinutes: 90 },
  { code: "93000", description: "Electrocardiogram, routine ECG with interpretation", category: "Cardiovascular", avgDurationMinutes: 15 },
  { code: "93306", description: "Echocardiography, transthoracic, complete", category: "Cardiovascular", avgDurationMinutes: 45 },
  { code: "93458", description: "Cardiac catheterization, left heart, coronary angiography", category: "Cardiovascular", avgDurationMinutes: 60 },
  { code: "33249", description: "Insertion of implantable defibrillator system", category: "Cardiovascular", avgDurationMinutes: 120 },
  { code: "33208", description: "Insertion of pacemaker, dual lead", category: "Cardiovascular", avgDurationMinutes: 90 },
  { code: "35301", description: "Thromboendarterectomy, carotid artery", category: "Cardiovascular", avgDurationMinutes: 150 },
  { code: "36247", description: "Selective catheter placement, arterial system, third order", category: "Cardiovascular", avgDurationMinutes: 75 },

  // Orthopedic
  { code: "27130", description: "Total hip arthroplasty", category: "Orthopedic", avgDurationMinutes: 150 },
  { code: "27447", description: "Total knee arthroplasty", category: "Orthopedic", avgDurationMinutes: 135 },
  { code: "29881", description: "Arthroscopy, knee, with meniscectomy", category: "Orthopedic", avgDurationMinutes: 60 },
  { code: "23430", description: "Tenodesis of long tendon of biceps", category: "Orthopedic", avgDurationMinutes: 75 },
  { code: "22612", description: "Arthrodesis, posterior lumbar", category: "Orthopedic", avgDurationMinutes: 210 },
  { code: "25607", description: "Open treatment of distal radial fracture", category: "Orthopedic", avgDurationMinutes: 90 },
  { code: "27506", description: "Open treatment of femoral shaft fracture", category: "Orthopedic", avgDurationMinutes: 120 },
  { code: "29827", description: "Arthroscopy, shoulder, rotator cuff repair", category: "Orthopedic", avgDurationMinutes: 105 },
  { code: "27579", description: "Open treatment of knee dislocation", category: "Orthopedic", avgDurationMinutes: 100 },

  // General Surgery
  { code: "44970", description: "Laparoscopic appendectomy", category: "General Surgery", avgDurationMinutes: 60 },
  { code: "47562", description: "Laparoscopic cholecystectomy", category: "General Surgery", avgDurationMinutes: 75 },
  { code: "49505", description: "Repair initial inguinal hernia", category: "General Surgery", avgDurationMinutes: 60 },
  { code: "44140", description: "Colectomy, partial, with anastomosis", category: "General Surgery", avgDurationMinutes: 180 },
  { code: "38100", description: "Splenectomy, total", category: "General Surgery", avgDurationMinutes: 120 },
  { code: "43775", description: "Laparoscopic sleeve gastrectomy", category: "General Surgery", avgDurationMinutes: 100 },
  { code: "49000", description: "Exploratory laparotomy", category: "General Surgery", avgDurationMinutes: 90 },
  { code: "19301", description: "Partial mastectomy", category: "General Surgery", avgDurationMinutes: 75 },

  // Neurosurgery / Neurology
  { code: "61510", description: "Craniectomy for excision of brain tumor", category: "Neurosurgery", avgDurationMinutes: 240 },
  { code: "63030", description: "Laminotomy with discectomy, lumbar", category: "Neurosurgery", avgDurationMinutes: 120 },
  { code: "62223", description: "Creation of shunt, ventriculo-peritoneal", category: "Neurosurgery", avgDurationMinutes: 90 },
  { code: "95810", description: "Polysomnography, sleep staging", category: "Neurology", avgDurationMinutes: 480 },
  { code: "95816", description: "Electroencephalogram, awake and drowsy", category: "Neurology", avgDurationMinutes: 60 },

  // Imaging
  { code: "70450", description: "CT head/brain without contrast", category: "Imaging", avgDurationMinutes: 20 },
  { code: "71046", description: "Chest X-ray, 2 views", category: "Imaging", avgDurationMinutes: 15 },
  { code: "72148", description: "MRI lumbar spine without contrast", category: "Imaging", avgDurationMinutes: 40 },
  { code: "74177", description: "CT abdomen and pelvis with contrast", category: "Imaging", avgDurationMinutes: 30 },
  { code: "76700", description: "Abdominal ultrasound, complete", category: "Imaging", avgDurationMinutes: 30 },
  { code: "78452", description: "Myocardial perfusion imaging, SPECT", category: "Imaging", avgDurationMinutes: 60 },
  { code: "77067", description: "Screening mammography, bilateral", category: "Imaging", avgDurationMinutes: 20 },

  // OB/GYN
  { code: "59400", description: "Routine obstetric care, vaginal delivery", category: "OB/GYN", avgDurationMinutes: 480 },
  { code: "59510", description: "Routine obstetric care, cesarean delivery", category: "OB/GYN", avgDurationMinutes: 60 },
  { code: "58150", description: "Total abdominal hysterectomy", category: "OB/GYN", avgDurationMinutes: 120 },
  { code: "58558", description: "Hysteroscopy with biopsy", category: "OB/GYN", avgDurationMinutes: 45 },

  // Urology
  { code: "52356", description: "Cystourethroscopy with lithotripsy", category: "Urology", avgDurationMinutes: 60 },
  { code: "55700", description: "Biopsy, prostate", category: "Urology", avgDurationMinutes: 30 },
  { code: "50590", description: "Extracorporeal shock wave lithotripsy", category: "Urology", avgDurationMinutes: 45 },

  // ENT
  { code: "42820", description: "Tonsillectomy and adenoidectomy", category: "ENT", avgDurationMinutes: 45 },
  { code: "31237", description: "Nasal/sinus endoscopy with debridement", category: "ENT", avgDurationMinutes: 30 },
  { code: "69436", description: "Tympanostomy with tube insertion", category: "ENT", avgDurationMinutes: 20 },

  // Ophthalmology
  { code: "66984", description: "Cataract surgery with IOL insertion", category: "Ophthalmology", avgDurationMinutes: 30 },
  { code: "67036", description: "Vitrectomy, mechanical", category: "Ophthalmology", avgDurationMinutes: 60 },

  // Gastroenterology
  { code: "45378", description: "Colonoscopy, diagnostic", category: "Gastroenterology", avgDurationMinutes: 30 },
  { code: "43239", description: "Upper GI endoscopy with biopsy", category: "Gastroenterology", avgDurationMinutes: 25 },
  { code: "47000", description: "Percutaneous liver biopsy", category: "Gastroenterology", avgDurationMinutes: 30 },
  { code: "43235", description: "Upper GI endoscopy, diagnostic", category: "Gastroenterology", avgDurationMinutes: 20 },

  // Vascular
  { code: "36620", description: "Arterial catheterization for monitoring", category: "Vascular", avgDurationMinutes: 15 },
  { code: "36556", description: "Insertion of central venous catheter", category: "Vascular", avgDurationMinutes: 30 },
  { code: "34701", description: "Endovascular repair of infrarenal aortic aneurysm", category: "Vascular", avgDurationMinutes: 180 },

  // Emergency / Critical Care
  { code: "99284", description: "Emergency department visit, high severity", category: "Emergency", avgDurationMinutes: 90 },
  { code: "99285", description: "Emergency department visit, high complexity", category: "Emergency", avgDurationMinutes: 120 },
  { code: "31500", description: "Emergency endotracheal intubation", category: "Emergency", avgDurationMinutes: 15 },
  { code: "36556", description: "Central line placement, emergent", category: "Emergency", avgDurationMinutes: 20 },
  { code: "99291", description: "Critical care, first hour", category: "Emergency", avgDurationMinutes: 60 },

  // Radiation / Oncology
  { code: "77427", description: "Radiation treatment management, 5 treatments", category: "Oncology", avgDurationMinutes: 30 },
  { code: "96413", description: "Chemotherapy administration, IV infusion", category: "Oncology", avgDurationMinutes: 90 },
  { code: "38221", description: "Bone marrow biopsy", category: "Oncology", avgDurationMinutes: 30 },

  // Dermatology
  { code: "11642", description: "Excision, malignant lesion, face/ears/lips", category: "Dermatology", avgDurationMinutes: 30 },
  { code: "17000", description: "Destruction of premalignant lesion, first", category: "Dermatology", avgDurationMinutes: 15 },

  // Pain Management
  { code: "64483", description: "Transforaminal epidural injection, lumbar", category: "Pain Management", avgDurationMinutes: 30 },
  { code: "62323", description: "Interlaminar epidural injection, lumbar", category: "Pain Management", avgDurationMinutes: 25 },

  // Podiatry
  { code: "28296", description: "Correction of hallux valgus (bunionectomy)", category: "Podiatry", avgDurationMinutes: 60 },

  // Pulmonology
  { code: "31622", description: "Diagnostic bronchoscopy", category: "Pulmonology", avgDurationMinutes: 30 },
  { code: "32551", description: "Tube thoracostomy (chest tube insertion)", category: "Pulmonology", avgDurationMinutes: 20 },

  // Nephrology
  { code: "36831", description: "Thrombectomy of dialysis graft", category: "Nephrology", avgDurationMinutes: 45 },
  { code: "90935", description: "Hemodialysis, single evaluation", category: "Nephrology", avgDurationMinutes: 240 },

  // Plastic / Reconstructive
  { code: "15734", description: "Muscle, myocutaneous flap reconstruction", category: "Plastic Surgery", avgDurationMinutes: 180 },
  { code: "13160", description: "Secondary wound closure", category: "Plastic Surgery", avgDurationMinutes: 45 },

  // Anesthesia
  { code: "00790", description: "Anesthesia for intraperitoneal procedures, upper abdomen", category: "Anesthesia", avgDurationMinutes: 120 },
  { code: "00840", description: "Anesthesia for intraperitoneal procedures, lower abdomen", category: "Anesthesia", avgDurationMinutes: 100 },

  // Endocrine Surgery
  { code: "60240", description: "Thyroidectomy, total", category: "Endocrine Surgery", avgDurationMinutes: 120 },
  { code: "60500", description: "Parathyroidectomy", category: "Endocrine Surgery", avgDurationMinutes: 90 },

  // Wound Care
  { code: "11042", description: "Debridement, subcutaneous tissue", category: "Wound Care", avgDurationMinutes: 20 },
  { code: "97597", description: "Debridement, open wound, selective", category: "Wound Care", avgDurationMinutes: 15 },

  // Trauma
  { code: "22325", description: "Open treatment of vertebral fracture", category: "Trauma", avgDurationMinutes: 150 },
  { code: "27245", description: "Treatment of intertrochanteric femoral fracture", category: "Trauma", avgDurationMinutes: 90 },

  // Additional common procedures to round out the list
  { code: "36415", description: "Collection of venous blood by venipuncture", category: "Laboratory", avgDurationMinutes: 5 },
  { code: "94010", description: "Spirometry, complete", category: "Pulmonology", avgDurationMinutes: 15 },
  { code: "93017", description: "Cardiovascular stress test, tracing only", category: "Cardiovascular", avgDurationMinutes: 45 },
  { code: "45385", description: "Colonoscopy with lesion removal", category: "Gastroenterology", avgDurationMinutes: 40 },
  { code: "29826", description: "Arthroscopy, shoulder, decompression", category: "Orthopedic", avgDurationMinutes: 60 },
  { code: "21493", description: "Closed treatment of mandible fracture", category: "Trauma", avgDurationMinutes: 60 },
  { code: "43644", description: "Laparoscopic gastric bypass", category: "General Surgery", avgDurationMinutes: 150 },
  { code: "27427", description: "Ligamentous reconstruction, knee", category: "Orthopedic", avgDurationMinutes: 90 },
  { code: "33405", description: "Replacement of aortic valve", category: "Cardiovascular", avgDurationMinutes: 240 },
  { code: "43647", description: "Laparoscopic implantation of gastric neurostimulator", category: "General Surgery", avgDurationMinutes: 120 },
  { code: "52601", description: "Transurethral resection of prostate", category: "Urology", avgDurationMinutes: 75 },
  { code: "63047", description: "Laminectomy for decompression, lumbar", category: "Neurosurgery", avgDurationMinutes: 120 },
];
