import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, UserPlus, LayoutDashboard, Users, Brain, Home,
  ShieldCheck, AlertTriangle, HeartPulse, Play, Pause, RotateCcw,
  FileText, Award
} from 'lucide-react';
import PatientSidebar from './components/PatientSidebar';
import CenterStage from './components/CenterStage';
import RightSidebar from './components/RightSidebar';
import PriorAuthModal from './components/PriorAuthModal';
import ApprovalModal from './components/ApprovalModal';
import PatientSelectorModal from './components/PatientSelectorModal';
import DoctorKnowledgeBase from './components/DoctorKnowledgeBase';
import RealTimeMonitor from './components/RealTimeMonitor';

import { createSwarmSession } from './data/mockMongoData';
import { usePatientStore } from './store/PatientStore';

// Derive the prior auth doc dynamically for the selected patient
function buildPriorAuthDoc(patient) {
  const s = patient.swarmScenario || {};
  return {
    formId: `PA-FORM-2026-${patient.mrn.slice(-6)}`,
    insuranceName: patient.patientProfile.insuranceProvider,
    patientName: patient.patientProfile.fullName,
    mrn: patient.mrn,
    dob: patient.patientProfile.dob,
    requestedMedication: s.resolvedDrug,
    quantity: "30 day supply (auto-calculated by weight/BSA)",
    primaryDiagnosisICD10: (patient.medicalHistory || []).map(h => `${h.icd10} (${h.condition})`).join(' | ') || 'Pending diagnosis coding',
    clinicalRationale: `CPIC ${s.cpicLevel || 'N/A'} Directive — Proposed agent is contraindicated due to documented genomic conflict (${s.conflictType || 'none identified'}). Alternative therapy "${s.resolvedDrug || 'pending analysis'}" selected as genomically safe equivalent.`,
    cpicGuidelineReference: `CPIC Allelic Guideline v4 — ${s.conflictType || 'N/A'} (Level ${s.cpicLevel?.split(' ')[1] || 'A'} Evidence)`,
    conflictType: s.conflictType,
    attachments: [
      `${patient.genomicProfile?.specimenId || 'PGx'}_Genotype_Report.pdf`,
      `Clinical_Guideline_Evidence_Package_${patient.mrn}.pdf`
    ],
    generatedBy: "VitaSync Swarm Care Engine v4.2",
    timestamp: new Date().toISOString()
  };
}

export default function App() {
  // ── Active Patient (from shared store) & Swarm State ──────────────────
  const { activePatient, selectPatient } = usePatientStore();
  const [swarmSession, setSwarmSession] = useState(() => activePatient ? createSwarmSession(activePatient) : null);
  const [priorAuthDoc, setPriorAuthDoc] = useState(() => activePatient ? buildPriorAuthDoc(activePatient) : null);

  // ── Simulation Playback State ─────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [swarmStatus, setSwarmStatus] = useState('INGESTING');
  const [approvedState, setApprovedState] = useState(null);

  // ── Modal Visibility ──────────────────────────────────────────────────
  const [isPriorAuthModalOpen, setIsPriorAuthModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isPatientSelectorOpen, setIsPatientSelectorOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);

  // ── Swarm Simulation Engine ───────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const baseDelay = 3000 / speedMultiplier;

    const timer = setTimeout(() => {
      if (currentStepIndex === 0) {
        // Step 2: Cardiology agent fires
        setCurrentStepIndex(1);
        setSwarmStatus('CARDIOLOGY_ACTIVE');
        setSwarmSession(prev => {
          const steps = [...prev.steps];
          steps[1] = { ...steps[1], status: 'typing', timestamp: new Date().toLocaleTimeString() };
          return { ...prev, steps, currentStepIndex: 1 };
        });
        setTimeout(() => setSwarmSession(prev => {
          const steps = [...prev.steps];
          steps[1] = { ...steps[1], status: 'completed' };
          return { ...prev, steps };
        }), 1400 / speedMultiplier);

      } else if (currentStepIndex === 1) {
        // Step 3: PGx intervention
        setCurrentStepIndex(2);
        setSwarmStatus('PGX_INTERVENTION');
        setSwarmSession(prev => {
          const steps = [...prev.steps];
          steps[2] = { ...steps[2], status: 'typing', timestamp: new Date().toLocaleTimeString() };
          return { ...prev, steps, currentStepIndex: 2 };
        });
        setTimeout(() => setSwarmSession(prev => {
          const steps = [...prev.steps];
          steps[2] = { ...steps[2], status: 'completed' };
          return { ...prev, steps };
        }), 1400 / speedMultiplier);

      } else if (currentStepIndex === 2) {
        // Step 4: Critic resolution
        setCurrentStepIndex(3);
        setSwarmStatus('CRITIC_RESOLUTION');
        setSwarmSession(prev => {
          const steps = [...prev.steps];
          steps[3] = { ...steps[3], status: 'typing', timestamp: new Date().toLocaleTimeString() };
          return { ...prev, steps, currentStepIndex: 3 };
        });
        setTimeout(() => {
          setSwarmSession(prev => {
            const steps = [...prev.steps];
            steps[3] = { ...steps[3], status: 'completed' };
            return { ...prev, steps, status: 'CONSENSUS_REACHED' };
          });
          setSwarmStatus('CONSENSUS_REACHED');
          setIsPlaying(false);
        }, 1600 / speedMultiplier);
      }
    }, baseDelay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, speedMultiplier]);

  // ── Patient Switch Handler ────────────────────────────────────────────
  const handleSelectPatient = useCallback((patient) => {
    selectPatient(patient._id);
  }, [selectPatient]);

  // Rebuild the swarm session whenever the active patient changes (via the
  // selector modal here, or chosen on the Patients page before navigating).
  useEffect(() => {
    if (!activePatient) return;
    setSwarmSession(createSwarmSession(activePatient));
    setPriorAuthDoc(buildPriorAuthDoc(activePatient));
    setCurrentStepIndex(0);
    setSwarmStatus('INGESTING');
    setApprovedState(null);
    setIsPlaying(false);
    const t = setTimeout(() => setIsPlaying(true), 300);
    return () => clearTimeout(t);
  }, [activePatient?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Playback Controls ─────────────────────────────────────────────────
  const handleTogglePlay = () => setIsPlaying(p => !p);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setSwarmStatus('INGESTING');
    setApprovedState(null);
    setSwarmSession(createSwarmSession(activePatient));
    setTimeout(() => setIsPlaying(true), 200);
  };

  // ── Physician Approval ────────────────────────────────────────────────
  const handleConfirmApproval = (data) => {
    setApprovedState(data);
    setSwarmStatus('APPROVED');
    setSwarmSession(prev => ({ ...prev, status: 'APPROVED', approvedAt: new Date().toISOString() }));
  };

  const handleApplyOverride = (data) => {
    setApprovedState({
      physicianName: data.physicianName || "Physician Override",
      customDrug: data.drug,
      overrideNote: data.note,
      timestamp: new Date().toLocaleTimeString()
    });
    setSwarmStatus('APPROVED');
  };

  if (!activePatient || !swarmSession) {
    return <EmptyDashboard />;
  }

  const patient = activePatient;
  const criticalAllele = (patient.genomicProfile?.alleles || []).find(a => a.riskLevel === 'CRITICAL');
  const activeAlerts = criticalAllele ? 2 : 0;
  const statusMeta = {
    INGESTING: { label: 'Ingesting record', dot: 'bg-slate-400' },
    CARDIOLOGY_ACTIVE: { label: 'Cardiology review', dot: 'bg-blue-400 animate-pulse' },
    PGX_INTERVENTION: { label: 'Pharmacogenomic check', dot: 'bg-amber-400 animate-pulse' },
    CRITIC_RESOLUTION: { label: 'Resolving plan', dot: 'bg-teal-400 animate-pulse' },
    CONSENSUS_REACHED: { label: 'Consensus reached', dot: 'bg-emerald-400' },
    APPROVED: { label: 'Plan approved', dot: 'bg-emerald-400' }
  }[swarmStatus] || { label: 'Ready', dot: 'bg-slate-400' };

  return (
    <div className="vs-dark vs-app-bg text-slate-200 flex min-h-screen xl:h-screen w-full xl:overflow-hidden font-sans">

      {/* ── Left icon rail ────────────────────────────────────── */}
      <nav className="hidden sm:flex flex-col items-center gap-2 w-[68px] shrink-0 bg-[#0b1120] border-r border-[#1e293b] py-4">
        <div className="w-9 h-9 rounded-xl bg-teal-700/40 flex items-center justify-center mb-4">
          <Activity className="w-5 h-5 text-teal-300" />
        </div>
        <button className="vs-rail-btn is-active" title="Dashboard"><LayoutDashboard className="w-5 h-5" /></button>
        <button className="vs-rail-btn" title="Patients" onClick={() => navigate('/patients')}><Users className="w-5 h-5" /></button>
        <button className="vs-rail-btn" title="Knowledge Base" onClick={() => setIsKnowledgeBaseOpen(true)}><Brain className="w-5 h-5" /></button>
        <div className="flex-1" />
        <button className="vs-rail-btn" title="Home" onClick={() => navigate('/')}><Home className="w-5 h-5" /></button>
      </nav>

      {/* ── Main column ───────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 xl:overflow-hidden">

        {/* Top bar */}
        <header className="shrink-0 bg-[#0b1120]/80 backdrop-blur border-b border-[#1e293b] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div>
            <h1 className="font-display-medical text-lg font-bold tracking-wide text-white">
              Vita<span className="text-teal-400">Sync</span> <span className="text-slate-500 font-sans text-sm font-normal">Dashboard</span>
            </h1>
            <p className="text-[11px] text-slate-500">by MoveOn AI Solutions · Clinical Decision Support</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0f1a30] border border-[#1e293b] text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
              {statusMeta.label}
            </div>
            {/* Playback */}
            <div className="flex items-center gap-1 bg-[#0f1a30] border border-[#1e293b] rounded-lg p-1">
              <button onClick={handleTogglePlay} title={isPlaying ? 'Pause' : 'Play'} className="p-1.5 rounded-md hover:bg-[#12203b] text-slate-400 hover:text-teal-300 transition-all">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={handleReset} title="Restart" className="p-1.5 rounded-md hover:bg-[#12203b] text-slate-400 hover:text-teal-300 transition-all">
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-[#1e293b] mx-0.5" />
              {[1, 2, 4].map(s => (
                <button key={s} onClick={() => setSpeedMultiplier(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${speedMultiplier === s ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-[#12203b]'}`}>
                  {s}×
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsPatientSelectorOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f1a30] border border-[#1e293b] text-slate-300 hover:text-white text-xs font-medium transition-all"
            >
              <Users className="w-4 h-4" /> <span className="hidden sm:inline">Switch</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-teal-700/40 border border-teal-500/30 flex items-center justify-center text-teal-300 text-xs font-bold">
              {patient.patientProfile.fullName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </header>

        {/* Scroll body */}
        <div className="flex-1 xl:overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <KpiCard label="Safety Score" value={`${swarmSession.safetyScore}`} unit="%" icon={ShieldCheck} tone="teal" bar={swarmSession.safetyScore} />
            <KpiCard label="Active Alerts" value={`${activeAlerts}`} icon={AlertTriangle} tone={activeAlerts > 0 ? 'rose' : 'emerald'} />
            <KpiCard label="Heart Rate" value={`${patient.vitals?.heartRateBpm ?? '—'}`} unit="bpm" icon={HeartPulse} tone="blue" />
            <KpiCard label="Care Plan" value={swarmStatus === 'APPROVED' ? 'Signed' : (swarmStatus === 'CONSENSUS_REACHED' ? 'Ready' : 'In review')} icon={Award} tone="slate" />
          </div>

          {/* Content grid: reasoning (main) + right rail */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 sm:gap-5 items-start">

            {/* Left column: patient summary + reasoning */}
            <div className="space-y-4 sm:space-y-5 min-w-0">
              <PatientSidebar
                patientData={activePatient}
                onOpenPatientSelector={() => setIsPatientSelectorOpen(true)}
              />
              <RealTimeMonitor patientData={activePatient} />
              <CenterStage
                swarmSession={swarmSession}
                currentStepIndex={currentStepIndex}
                swarmStatus={swarmStatus}
                onOpenPriorAuthModal={() => setIsPriorAuthModalOpen(true)}
                activePatient={activePatient}
              />
            </div>

            {/* Right column */}
            <RightSidebar
              swarmSession={swarmSession}
              swarmStatus={swarmStatus}
              onApproveCarePlan={() => setIsApprovalModalOpen(true)}
              onOpenPriorAuthModal={() => setIsPriorAuthModalOpen(true)}
              approvedState={approvedState}
              onApplyOverride={handleApplyOverride}
              activePatient={activePatient}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <PatientSelectorModal
        isOpen={isPatientSelectorOpen}
        onClose={() => setIsPatientSelectorOpen(false)}
        activePatientId={activePatient._id}
        onSelect={handleSelectPatient}
      />

      <PriorAuthModal
        isOpen={isPriorAuthModalOpen}
        onClose={() => setIsPriorAuthModalOpen(false)}
        doc={priorAuthDoc}
      />

      <ApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirmApproval={handleConfirmApproval}
        patientName={activePatient.patientProfile.fullName}
        swarmSession={swarmSession}
        activePatient={activePatient}
      />

      <DoctorKnowledgeBase
        isOpen={isKnowledgeBaseOpen}
        onClose={() => setIsKnowledgeBaseOpen(false)}
      />
    </div>
  );
}

// KPI stat card for the dashboard top row.
function KpiCard({ label, value, unit, icon: Icon, tone = 'slate', bar }) {
  const toneMap = {
    teal: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
    rose: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
    emerald: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
    slate: 'text-slate-300 bg-slate-500/10 border-slate-500/20'
  };
  return (
    <div className="vs-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">{label}</span>
        <span className={`w-7 h-7 rounded-lg border flex items-center justify-center ${toneMap[tone]}`}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white tabular-nums">{value}</span>
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>
      {typeof bar === 'number' && (
        <div className="mt-2 w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full bg-teal-400 transition-all duration-500" style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  );
}

// Shown when the roster is empty (all patients deleted).
function EmptyDashboard() {
  const navigate = useNavigate();
  return (
    <div className="vs-app-bg min-h-screen w-full flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-700/30 border border-teal-500/30 flex items-center justify-center mb-5">
        <Activity className="w-8 h-8 text-teal-300" />
      </div>
      <h1 className="font-display-medical text-2xl font-bold text-white mb-2">No Active Patients</h1>
      <p className="text-slate-400 max-w-md mb-6">
        The patient registry is empty. Add a patient to begin a VitaSync analysis.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/patients')}
          className="px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-500 transition-all flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" /> Go to Patient Registry
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 border border-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-white/5 transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
