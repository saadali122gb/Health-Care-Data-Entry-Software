// VitaSync — Full Multi-Patient Database + Drug Interaction Engine
// MongoDB-schema compliant mock data with 3 patients and live drug checking logic

// ─────────────────────────────────────────────────────────────────────────
// PATIENT REGISTRY (3 different cases with different conflicts)
// ─────────────────────────────────────────────────────────────────────────
export const PATIENT_REGISTRY = [
  {
    _id: "64a7f9b1c2d3e4f5a6b7c8d9",
    mrn: "MRN-894021",
    createdAt: "2026-09-20T08:30:00.000Z",
    updatedAt: "2026-09-26T14:02:10.000Z",
    scenarioLabel: "AFib + LAD Stent + CYP2C19 Conflict",
    scenarioDescription: "Patient needs P2Y12 inhibitor but carries CYP2C19 loss-of-function alleles. Classic Clopidogrel failure scenario.",
    patientProfile: {
      fullName: "John Doe",
      age: 68,
      gender: "Male",
      dob: "1958-04-12",
      bloodGroup: "A+",
      weightKg: 82.5,
      heightCm: 178,
      bmi: 26.0,
      roomNumber: "Cardiology ICU – Bed 04",
      attendingPhysician: "Dr. Evelyn Vance, MD, FACC",
      hospitalAffiliation: "St. Jude Heart & Vascular Center",
      insuranceProvider: "Medicare Advantage (Tier 1 Preferred)",
      admissionReason: "Paroxysmal Atrial Fibrillation with RVR & Recurrent Chest Palpitations"
    },
    vitals: {
      heartRateBpm: 112,
      heartRateStatus: "Elevated (AFib RVR)",
      bpSystolic: 138,
      bpDiastolic: 88,
      bpStatus: "Stage 1 Hypertension",
      spO2Percent: 97,
      respiratoryRate: 18,
      temperatureC: 36.8,
      ecgSummary: "Paroxysmal Atrial Fibrillation with irregular R-R intervals, absent P waves.",
      lastUpdatedIso: "2026-09-26T14:02:10.000Z"
    },
    clinicalRiskScores: {
      chadsVascScore: 4,
      chadsVascInterpretation: "High Annual Embolic Stroke Risk (5.6%/yr) → Anticoagulation strongly indicated",
      hasBledScore: 2,
      hasBledInterpretation: "Moderate Bleeding Risk → Monitor & adjust dose",
      creatinineClearance: "62 mL/min (Mild Impairment)",
      troponinI: "0.02 ng/mL (Negative for ACS)",
      lvefPercent: 55
    },
    medicalHistory: [
      { _id: "hx1a", condition: "Non-Valvular Atrial Fibrillation", icd10: "I48.91", diagnosedYear: 2023, status: "Active", severity: "High Risk" },
      { _id: "hx1b", condition: "Essential Hypertension", icd10: "I10", diagnosedYear: 2018, status: "Controlled", severity: "Moderate" },
      { _id: "hx1c", condition: "Prior PCI with Drug-Eluting Stent (LAD)", icd10: "Z95.5", diagnosedYear: 2021, status: "Post-Procedure Stable", severity: "Requires P2Y12 Coverage" },
      { _id: "hx1d", condition: "Chronic Kidney Disease (Stage 2)", icd10: "N18.2", diagnosedYear: 2022, status: "Monitored", severity: "Mild" }
    ],
    genomicProfile: {
      _id: "pgx1a", specimenId: "VCF-2026-88192-PGX",
      panelName: "NextGen Whole Genome PGx Clinical Panel v4.2",
      sequencingDate: "2026-08-14T11:20:00.000Z",
      qualityScore: "Q38 (High Precision)",
      alleles: [
        { gene: "CYP2C19", diplotype: "*2/*3", phenotype: "Poor Metabolizer (PM)", activityScore: 0.0, riskLevel: "CRITICAL", clinicalImpact: "Complete loss-of-function. Cannot bioactivate Clopidogrel (Plavix)." },
        { gene: "SLCO1B1", diplotype: "*1/*1", phenotype: "Normal Transporter", activityScore: 1.0, riskLevel: "NORMAL", clinicalImpact: "Standard statin hepatic uptake. Normal myopathy risk." },
        { gene: "CYP2C9", diplotype: "*1/*1", phenotype: "Extensive Metabolizer", activityScore: 1.0, riskLevel: "NORMAL", clinicalImpact: "Standard Warfarin clearance kinetics." },
        { gene: "VKORC1", diplotype: "-1639G>A (G/G)", phenotype: "Normal Sensitivity", activityScore: 1.0, riskLevel: "NORMAL", clinicalImpact: "Standard Warfarin sensitivity." }
      ]
    },
    currentMedications: [
      { _id: "m1a", name: "Lisinopril", dosage: "10 mg", route: "Oral", frequency: "Once Daily", indication: "Hypertension", startDate: "2018-05-10" },
      { _id: "m1b", name: "Metoprolol Succinate ER", dosage: "50 mg", route: "Oral", frequency: "Once Daily", indication: "Heart Rate Control (AFib)", startDate: "2023-02-14" },
      { _id: "m1c", name: "Atorvastatin", dosage: "40 mg", route: "Oral", frequency: "Once Daily (Night)", indication: "Hyperlipidemia / CAD Protection", startDate: "2021-11-04" }
    ],
    swarmScenario: {
      cardioProposal: "Clopidogrel 75mg PO Daily",
      pgxFlag: "CYP2C19 *2/*3 — Poor Metabolizer. Clopidogrel bioactivation: 0%. CPIC Level A contraindication.",
      criticResolution: "Ticagrelor (Brilinta) 90mg PO BID — Direct-acting P2Y12 inhibitor. No CYP2C19 dependence. Prior Auth auto-generated.",
      resolvedDrug: "Ticagrelor 90mg PO BID",
      conflictType: "CYP2C19_PRODRUG_FAILURE",
      cpicLevel: "Level A"
    }
  },

  {
    _id: "64a7f9b2c2d3e4f5a6b7c9d0",
    mrn: "MRN-772309",
    createdAt: "2026-09-22T10:15:00.000Z",
    updatedAt: "2026-09-26T13:45:00.000Z",
    scenarioLabel: "Oncology + Severe Drug-Drug Interaction",
    scenarioDescription: "Breast cancer patient on Tamoxifen requires antidepressant — CYP2D6 inhibition conflict renders Tamoxifen ineffective.",
    patientProfile: {
      fullName: "Maria Santos",
      age: 52,
      gender: "Female",
      dob: "1974-07-21",
      bloodGroup: "O-",
      weightKg: 61.0,
      heightCm: 162,
      bmi: 23.2,
      roomNumber: "Oncology Outpatient – Room 3B",
      attendingPhysician: "Dr. Priya Mehta, MD, FACP (Oncology)",
      hospitalAffiliation: "Memorial Cancer & Research Center",
      insuranceProvider: "Blue Cross PPO (Oncology Rider)",
      admissionReason: "Follow-up: ER+ Breast Cancer Post-Lumpectomy — Adjuvant Therapy Management"
    },
    vitals: {
      heartRateBpm: 76,
      heartRateStatus: "Normal Sinus Rhythm",
      bpSystolic: 122,
      bpDiastolic: 78,
      bpStatus: "Normal",
      spO2Percent: 99,
      respiratoryRate: 14,
      temperatureC: 36.6,
      ecgSummary: "Normal sinus rhythm. QTc 416ms (within normal limits).",
      lastUpdatedIso: "2026-09-26T13:45:00.000Z"
    },
    clinicalRiskScores: {
      chadsVascScore: 1,
      chadsVascInterpretation: "Low stroke risk. No anticoagulation indicated.",
      hasBledScore: 1,
      hasBledInterpretation: "Low bleeding risk.",
      creatinineClearance: "91 mL/min (Normal)",
      troponinI: "Undetectable",
      lvefPercent: 62
    },
    medicalHistory: [
      { _id: "hx2a", condition: "ER+/HER2- Breast Cancer (Stage IIA)", icd10: "C50.912", diagnosedYear: 2025, status: "Active — Post-Lumpectomy", severity: "Adjuvant Therapy Required" },
      { _id: "hx2b", condition: "Major Depressive Disorder", icd10: "F32.2", diagnosedYear: 2024, status: "Active", severity: "Moderate" },
      { _id: "hx2c", condition: "Hot Flushes / Menopausal Symptoms", icd10: "N95.1", diagnosedYear: 2024, status: "Active", severity: "Moderate" },
      { _id: "hx2d", condition: "Osteopenia (Lumbar Spine)", icd10: "M85.0", diagnosedYear: 2024, status: "Monitored", severity: "Mild" }
    ],
    genomicProfile: {
      _id: "pgx2a", specimenId: "VCF-2026-77301-PGX",
      panelName: "NextGen Oncology PGx + HER2 Panel v3.1",
      sequencingDate: "2026-07-29T09:00:00.000Z",
      qualityScore: "Q40 (Ultra-High Precision)",
      alleles: [
        { gene: "CYP2D6", diplotype: "*1/*1", phenotype: "Normal Extensive Metabolizer", activityScore: 2.0, riskLevel: "NORMAL", clinicalImpact: "Normal CYP2D6 activity. However, competitive inhibition by Paroxetine (strong CYP2D6 inhibitor) will convert patient to functional Poor Metabolizer, blocking Tamoxifen → Endoxifen conversion." },
        { gene: "CYP2C19", diplotype: "*1/*2", phenotype: "Intermediate Metabolizer", activityScore: 1.0, riskLevel: "REDUCED", clinicalImpact: "Reduced activation of some prodrugs. Monitor dosing of Omeprazole, Escitalopram." },
        { gene: "DPYD", diplotype: "*1/*1", phenotype: "Normal", activityScore: 1.0, riskLevel: "NORMAL", clinicalImpact: "Normal 5-FU/capecitabine metabolism." },
        { gene: "TPMT", diplotype: "*1/*1", phenotype: "Normal Metabolizer", activityScore: 1.0, riskLevel: "NORMAL", clinicalImpact: "Standard thiopurine dosing." }
      ]
    },
    currentMedications: [
      { _id: "m2a", name: "Tamoxifen", dosage: "20 mg", route: "Oral", frequency: "Once Daily", indication: "Adjuvant Endocrine Therapy (ER+ Breast Cancer)", startDate: "2026-03-01" },
      { _id: "m2b", name: "Calcium + Vitamin D3", dosage: "1200 mg / 2000 IU", route: "Oral", frequency: "Once Daily", indication: "Osteopenia Prevention", startDate: "2024-11-15" }
    ],
    swarmScenario: {
      cardioProposal: "Paroxetine (Paxil) 20mg PO Daily for MDD",
      pgxFlag: "CYP2D6 Drug-Drug Interaction: Paroxetine is a STRONG CYP2D6 inhibitor. Will reduce Tamoxifen → Endoxifen conversion by 65-75%, effectively rendering adjuvant cancer therapy INEFFECTIVE. CPIC Level A contraindication.",
      criticResolution: "Venlafaxine (Effexor XR) 75mg PO Daily — Minimal CYP2D6 inhibition. Does not compromise Tamoxifen activation. Validated in oncology settings. Also addresses hot flush symptoms.",
      resolvedDrug: "Venlafaxine 75mg PO Daily",
      conflictType: "DDI_CYP2D6_INHIBITION",
      cpicLevel: "Level A"
    }
  },

  {
    _id: "64a7f9b3c2d3e4f5a6b7cad1",
    mrn: "MRN-604817",
    createdAt: "2026-09-25T07:00:00.000Z",
    updatedAt: "2026-09-26T12:30:00.000Z",
    scenarioLabel: "Pediatric Leukemia + TPMT Toxicity Risk",
    scenarioDescription: "Child with ALL being treated with 6-Mercaptopurine — TPMT deficiency risk of fatal bone marrow suppression at standard doses.",
    patientProfile: {
      fullName: "Aisha Khan",
      age: 9,
      gender: "Female",
      dob: "2017-01-30",
      bloodGroup: "B+",
      weightKg: 29.0,
      heightCm: 132,
      bmi: 16.7,
      roomNumber: "Pediatric Hem/Onc – Ward 7, Bed 02",
      attendingPhysician: "Dr. Samuel Adeyemi, MD, PhD (Pediatric Hematology)",
      hospitalAffiliation: "Children's National Medical Center",
      insuranceProvider: "CHIP / State Medicaid (Pediatric Oncology Rider)",
      admissionReason: "Newly Diagnosed Acute Lymphoblastic Leukemia (ALL) — Induction Chemotherapy Protocol"
    },
    vitals: {
      heartRateBpm: 88,
      heartRateStatus: "Normal for Pediatric Age",
      bpSystolic: 104,
      bpDiastolic: 66,
      bpStatus: "Normal (Pediatric Range)",
      spO2Percent: 98,
      respiratoryRate: 22,
      temperatureC: 37.1,
      ecgSummary: "Normal sinus rhythm. No conduction abnormalities. Age-appropriate intervals.",
      lastUpdatedIso: "2026-09-26T12:30:00.000Z"
    },
    clinicalRiskScores: {
      chadsVascScore: 0,
      chadsVascInterpretation: "N/A (Pediatric patient — CHA₂DS₂-VASc not applicable)",
      hasBledScore: 0,
      hasBledInterpretation: "N/A",
      creatinineClearance: "118 mL/min (Pediatric Normal)",
      troponinI: "Undetectable",
      lvefPercent: 68
    },
    medicalHistory: [
      { _id: "hx3a", condition: "Acute Lymphoblastic Leukemia (B-Cell, Ph-)", icd10: "C91.0", diagnosedYear: 2026, status: "Active — Induction Phase", severity: "High Risk" },
      { _id: "hx3b", condition: "Febrile Neutropenia (Chemo-Induced)", icd10: "D70.1", diagnosedYear: 2026, status: "Active — Managed", severity: "Moderate" }
    ],
    genomicProfile: {
      _id: "pgx3a", specimenId: "VCF-2026-60481-PGX",
      panelName: "Pediatric Oncology PGx Safety Panel v2.4",
      sequencingDate: "2026-09-25T14:00:00.000Z",
      qualityScore: "Q41 (Premium Pediatric Precision)",
      alleles: [
        { gene: "TPMT", diplotype: "*3A/*3A", phenotype: "Poor Metabolizer (Homozygous Deficient)", activityScore: 0.0, riskLevel: "CRITICAL", clinicalImpact: "Complete TPMT enzyme deficiency. Standard 6-MP/Azathioprine doses will cause severe, potentially FATAL bone marrow suppression (myelosuppression). CPIC mandates dose reduction to 10% of standard dose or agent substitution." },
        { gene: "NUDT15", diplotype: "*1/*1", phenotype: "Normal", activityScore: 1.0, riskLevel: "NORMAL", clinicalImpact: "No additional thiopurine toxicity risk from NUDT15." },
        { gene: "DPYD", diplotype: "*1/*2A", phenotype: "Intermediate Metabolizer", activityScore: 0.5, riskLevel: "REDUCED", clinicalImpact: "Moderate 5-FU toxicity risk if capecitabine used. Reduce dose by 25-50%." },
        { gene: "CYP3A5", diplotype: "*1/*3", phenotype: "Intermediate Metabolizer", activityScore: 1.0, riskLevel: "NORMAL", clinicalImpact: "Normal tacrolimus/vincristine metabolization expected." }
      ]
    },
    currentMedications: [
      { _id: "m3a", name: "Dexamethasone", dosage: "6 mg/m²/day", route: "IV", frequency: "Daily (Induction Days 1-28)", indication: "ALL Induction Protocol (AALL0434)", startDate: "2026-09-25" },
      { _id: "m3b", name: "Vincristine", dosage: "1.5 mg/m²", route: "IV Push", frequency: "Weekly (Days 1, 8, 15, 22)", indication: "ALL Induction Chemotherapy", startDate: "2026-09-25" },
      { _id: "m3c", name: "L-Asparaginase (PEG)", dosage: "2500 IU/m²", route: "IM", frequency: "Day 12 & Day 25", indication: "ALL Induction Protocol", startDate: "2026-09-25" }
    ],
    swarmScenario: {
      cardioProposal: "6-Mercaptopurine (6-MP) 75 mg/m²/day (Standard AALL0434 Protocol Dose)",
      pgxFlag: "TPMT *3A/*3A HOMOZYGOUS DEFICIENCY DETECTED. Standard 6-MP dose will cause FATAL bone marrow suppression. Thioguanine nucleotide (TGN) accumulation: >10x normal. CPIC Level A: Reduce dose to 10% OR switch agent.",
      criticResolution: "6-Mercaptopurine 6-MP at 10% of Standard Dose (7.5 mg/m²/day) with Weekly CBC & TGN Level Monitoring. Alternatively: Consider Nelarabine (Arranon) substitution if toxicity persists.",
      resolvedDrug: "6-MP 7.5 mg/m²/day + Weekly CBC Monitoring",
      conflictType: "TPMT_MYELOSUPPRESSION_RISK",
      cpicLevel: "Level A"
    }
  }
];

// ─────────────────────────────────────────────────────────────────────────
// DRUG INTERACTION DATABASE — For live drug checker
// ─────────────────────────────────────────────────────────────────────────
export const DRUG_INTERACTION_DB = [
  {
    drug1: "clopidogrel",
    drug2: "omeprazole",
    severity: "MODERATE",
    mechanism: "CYP2C19 competition — Omeprazole reduces clopidogrel active metabolite by ~40%.",
    cpicLevel: "Level B",
    action: "Use Pantoprazole instead (minimal CYP2C19 inhibition).",
    aliases: ["plavix", "nexium", "prilosec", "losec"]
  },
  {
    drug1: "warfarin",
    drug2: "aspirin",
    severity: "HIGH",
    mechanism: "Pharmacodynamic synergy — Combined bleeding risk substantially elevated.",
    cpicLevel: "Level A",
    action: "Avoid combination unless DAPT clinically mandated; reduce Warfarin dose by 25%, monitor INR weekly.",
    aliases: ["coumadin", "jantoven", "bayer", "ecotrin"]
  },
  {
    drug1: "tamoxifen",
    drug2: "paroxetine",
    severity: "CRITICAL",
    mechanism: "CYP2D6 inhibition — Paroxetine blocks Tamoxifen→Endoxifen conversion. Cancer therapy rendered ineffective.",
    cpicLevel: "Level A",
    action: "CONTRAINDICATED. Switch to Venlafaxine or Citalopram (low CYP2D6 inhibition).",
    aliases: ["nolvadex", "paxil", "seroxat"]
  },
  {
    drug1: "simvastatin",
    drug2: "amiodarone",
    severity: "HIGH",
    mechanism: "CYP3A4 inhibition — Amiodarone increases simvastatin plasma levels, high rhabdomyolysis risk.",
    cpicLevel: "Level A",
    action: "Limit Simvastatin to 10mg. Prefer Pravastatin or Rosuvastatin (not CYP3A4 dependent).",
    aliases: ["zocor", "pacerone", "cordarone"]
  },
  {
    drug1: "metformin",
    drug2: "contrast dye",
    severity: "MODERATE",
    mechanism: "Iodinated contrast impairs renal elimination of Metformin, risk of lactic acidosis.",
    cpicLevel: "Level B",
    action: "Hold Metformin 48 hours before and after IV contrast. Check renal function before restarting.",
    aliases: ["glucophage", "iodine", "radiocontrast"]
  },
  {
    drug1: "ssri",
    drug2: "tramadol",
    severity: "HIGH",
    mechanism: "Serotonin syndrome risk — Combined serotonergic activity may cause hyperthermia, agitation, seizures.",
    cpicLevel: "Level A",
    action: "Avoid combination. If opioid required, use Oxycodone or Hydromorphone (non-serotonergic).",
    aliases: ["sertraline", "fluoxetine", "zoloft", "prozac", "ultram", "ultracet"]
  },
  {
    drug1: "fluconazole",
    drug2: "warfarin",
    severity: "CRITICAL",
    mechanism: "CYP2C9 inhibition — Fluconazole dramatically elevates Warfarin INR to supratherapeutic levels.",
    cpicLevel: "Level A",
    action: "Reduce Warfarin dose by 50% and monitor INR every 2-3 days. Consider antifungal alternative.",
    aliases: ["diflucan", "coumadin", "jantoven"]
  }
];

// ─────────────────────────────────────────────────────────────────────────
// INITIAL SWARM SESSION FACTORY — creates a session for a given patient
// ─────────────────────────────────────────────────────────────────────────
export function createSwarmSession(patient) {
  const s = patient.swarmScenario;
  return {
    _id: `swarm_${patient._id.slice(-6)}`,
    sessionId: `SWARM-2026-${patient.mrn.slice(-6)}`,
    patientId: patient._id,
    createdAt: new Date().toISOString(),
    status: "INGESTING",
    safetyScore: 99.8,
    currentStepIndex: 0,
    steps: [
      {
        stepNumber: 1, id: "step_ingest", agentKey: "INGESTION",
        title: "Patient Context Ingestion",
        subtitle: "EHR Data, Genomic VCF File & Current Medications Loaded",
        status: "completed",
        timestamp: new Date().toLocaleTimeString(),
        content: `Ingested record for ${patient.patientProfile.fullName} (${patient.mrn}). Admission: "${patient.patientProfile.admissionReason}". Loaded PGx panel #${patient.genomicProfile.specimenId}. Active medications: ${patient.currentMedications.map(m => m.name).join(', ')}.`,
        badgeColor: "slate", latencyMs: 85
      },
      {
        stepNumber: 2, id: "step_cardiology", agentKey: "CARDIOLOGY",
        title: "Cardiology / Primary Specialist Agent",
        subtitle: "ACC/AHA & NCCN Guideline-Based Clinical Reasoning",
        agentName: "CardioAgent v4.2",
        badgeColor: "navy", status: "idle", timestamp: null,
        recommendation: s.cardioProposal,
        rationale: `Based on clinical history, risk stratification, and current guideline evidence, the primary specialist recommends: ${s.cardioProposal}.`,
        evidenceCitations: [
          "ACC/AHA 2024 Clinical Practice Guidelines (Class I, Level A)",
          "NCCN Guidelines v2.2026 — Standard Protocol Dosing"
        ],
        confidenceScore: 94.2, latencyMs: 240
      },
      {
        stepNumber: 3, id: "step_pgx", agentKey: "PHARMACOGENOMICS",
        title: "Pharmacogenomics (PGx) Safety Agent",
        subtitle: "CPIC Allelic Variant Safety & Drug Interaction Engine",
        agentName: "PGxAgent v3.8",
        badgeColor: "amber", status: "idle", timestamp: null,
        flagged: true,
        alertHeader: "⚠ CRITICAL PHARMACOGENOMIC / DDI CONFLICT DETECTED",
        alertBody: s.pgxFlag,
        cpicRecommendation: `CPIC ${s.cpicLevel} — Proposed therapy is clinically unsafe for this patient's genomic profile. Agent flagging mandatory intervention.`,
        conflictType: s.conflictType,
        confidenceScore: 99.9, latencyMs: 310
      },
      {
        stepNumber: 4, id: "step_critic", agentKey: "CRITIC",
        title: "Critic & Compliance Agent",
        subtitle: "Swarm Conflict Resolver, FDA Labeling & Prior Auth Generator",
        agentName: "CriticAgent v5.0",
        badgeColor: "emerald", status: "idle", timestamp: null,
        resolutionHeader: `RESOLUTION: ${s.resolvedDrug}`,
        resolutionBody: s.criticResolution,
        proposedDrug: s.resolvedDrug,
        priorAuthGenerated: true,
        confidenceScore: 98.7, latencyMs: 195
      }
    ]
  };
}

// ─────────────────────────────────────────────────────────────────────────
// BACKWARD COMPAT EXPORTS for App.jsx
// ─────────────────────────────────────────────────────────────────────────
export const MOCK_PATIENT_DOCUMENT = PATIENT_REGISTRY[0];
export const INITIAL_SWARM_SESSION = createSwarmSession(PATIENT_REGISTRY[0]);

export const MOCK_PRIOR_AUTH_DOCUMENT = {
  formId: "PA-FORM-2026-I48.91",
  insuranceName: "Medicare Advantage Rx Plan",
  patientName: "John Doe",
  mrn: "MRN-894021",
  dob: "1958-04-12",
  requestedMedication: "Ticagrelor (Brilinta) 90mg Tablets",
  quantity: "60 tablets / 30 day supply",
  primaryDiagnosisICD10: "I48.91 (Unspecified Atrial Fibrillation) & Z95.5 (Coronary Stent)",
  clinicalRationale: "Patient requires P2Y12 inhibitor therapy for AFib + LAD Stent protection. Standard preferred agent (Clopidogrel) is strictly contraindicated due to documented CYP2C19 *2/*3 Poor Metabolizer status (VCF panel #VCF-2026-88192-PGX attached). Direct P2Y12 inhibition via Ticagrelor is medically necessary.",
  cpicGuidelineReference: "CPIC Guideline for CYP2C19 and Clopidogrel Therapy (2022 Update, Level A Evidence)",
  attachments: ["CYP2C19_Genotype_Report_VCF88192.pdf", "ACC_AHA_AFib_Risk_Assessment.pdf"],
  generatedBy: "VitaSync Swarm Care Engine v4.2",
  timestamp: "2026-09-26T14:07:15.000Z"
};

export const MOCK_AGENT_PROMPTS = {
  CARDIOLOGY: {
    systemPrompt: `You are the Cardiology Specialist AI Agent in VitaSync. Your task is to analyze patient EHR records, ECG traces, CHA₂DS₂-VASc scores, and cardiovascular medical history to formulate evidence-based antiplatelet / anticoagulant regimens adhering to ACC/AHA 2024 guidelines.`,
    temperature: 0.1,
    knowledgeBases: ["ACC/AHA 2024 AFib Guidelines", "ESC DAPT Guidelines 2023", "CHA₂DS₂-VASc Calculator", "NCCN Clinical Practice Guidelines"],
    modelName: "Med-PaLM 2 / BioMistral 7B (Cardio-Tuned)"
  },
  PHARMACOGENOMICS: {
    systemPrompt: `You are the Pharmacogenomics (PGx) Safety Agent in VitaSync. You cross-examine all proposed drug regimens against the patient's whole-genome VCF allelic data, CPIC guidelines, and PharmGKB databases. If a proposed drug is a prodrug requiring enzymatic activation and the patient possesses loss-of-function variants, you MUST issue a CRITICAL INTERVENTION FLAG.`,
    temperature: 0.0,
    knowledgeBases: ["CPIC Allelic Guidelines v4", "PharmGKB Database 2026", "FDA Table of Pharmacogenomic Biomarkers", "DDI Interaction Database"],
    modelName: "PGx-LLM v3 (Clinical Variant Resolver)"
  },
  CRITIC: {
    systemPrompt: `You are the Swarm Critic & Compliance Agent in VitaSync. You mediate disputes between Cardiology and PGx agents, synthesize optimal non-conflicting therapeutic alternatives, verify FDA indications, and automatically construct Prior Authorization forms to ensure seamless clinical adoption.`,
    temperature: 0.1,
    knowledgeBases: ["FDA Orange Book", "Prior-Auth Clinical Rules Engine", "NCCN / ACC Guideline Resolvers", "DrugBank Alternatives DB"],
    modelName: "VitaSync-Critic-v5 (Swarm Synthesizer)"
  }
};
