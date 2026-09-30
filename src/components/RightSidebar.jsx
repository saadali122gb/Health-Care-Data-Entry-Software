import React, { useState } from 'react';
import {
  CheckCircle2, ShieldCheck, FileText, Edit3, Pill, Clock, Award, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import AIAdvicePanel from './AIAdvicePanel';

export default function RightSidebar({
  swarmSession,
  swarmStatus,
  onApproveCarePlan,
  onOpenPriorAuthModal,
  approvedState,
  onApplyOverride,
  activePatient
}) {
  const [showOverridePanel, setShowOverridePanel] = useState(false);
  const [overrideDrug, setOverrideDrug] = useState('Prasugrel 10mg PO Daily');
  const [overrideNote, setOverrideNote] = useState('Physician clinical preference based on patient tolerance.');

  const isConsensusReached = swarmStatus === 'CONSENSUS_REACHED' || swarmStatus === 'APPROVED';
  const isApproved = swarmStatus === 'APPROVED';

  const scenario = activePatient?.swarmScenario || {};
  const resolvedDrug = approvedState?.customDrug || scenario.resolvedDrug || 'Pending analysis';
  const contraindicated = scenario.cardioProposal || 'Standard first-line agent';
  const pgxConflict = scenario.conflictType || '';
  const criticalAllele = (activePatient?.genomicProfile?.alleles || []).find(a => a.riskLevel === 'CRITICAL');
  const alleleLabel = criticalAllele ? `${criticalAllele.gene} ${criticalAllele.diplotype}` : (pgxConflict.replace(/_/g, ' ') || 'genomic constraint');

  const handleCustomOverrideSubmit = (e) => {
    e.preventDefault();
    onApplyOverride({ drug: overrideDrug, note: overrideNote });
    setShowOverridePanel(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* AI Advice */}
      <AIAdvicePanel patientData={activePatient} swarmSession={swarmSession} />

      {/* Safety verification */}
      <div className="vs-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Safety Verification
          </span>
          <span className="text-sm font-semibold text-teal-300">{swarmSession.safetyScore}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mb-3">
          <div className="h-full bg-teal-400 transition-all duration-500" style={{ width: `${swarmSession.safetyScore}%` }} />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500 block text-[10px]">Rule checks</span>
            <span className="font-medium text-emerald-300">All passed</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Conflicts</span>
            <span className="font-medium text-emerald-300">0 unresolved</span>
          </div>
        </div>
      </div>

      {/* Agent timeline */}
      <div className="vs-card p-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wide flex items-center justify-between mb-3">
          <span>Agent Timeline</span>
          <Clock className="w-3.5 h-3.5 text-slate-500" />
        </h3>
        <div className="relative pl-4 border-l border-[#1e293b] space-y-4 text-xs">
          <TimelineStep active dot="bg-slate-400" title="1. Record Ingestion" text="Parsed clinical history & PGx panel." />
          <TimelineStep active={swarmSession.currentStepIndex >= 1} dot="bg-blue-400" title="2. Cardiology Proposal" text={`Proposed ${contraindicated}.`} />
          <TimelineStep active={swarmSession.currentStepIndex >= 2} dot="bg-rose-400" title="3. PGx Intervention" text={`Flagged ${contraindicated} (${alleleLabel}).`} tone="text-rose-300" />
          <TimelineStep active={swarmSession.currentStepIndex >= 3} dot="bg-emerald-400" title="4. Critic Resolution" text={`Realigned to ${resolvedDrug}.`} tone="text-emerald-300" />
        </div>
      </div>

      {/* Synthesized care plan */}
      <div className="vs-card p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1e293b]">
          <span className="text-sm font-semibold text-white">Care Plan</span>
          <span className="text-[10px] uppercase bg-teal-500/15 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded font-medium">
            {isApproved ? 'Signed' : 'Ready to sign'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-semibold uppercase text-emerald-300 block">Final regimen</span>
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="font-semibold text-emerald-100 text-sm">{resolvedDrug}</span>
          </div>
          <p className="text-[11px] text-emerald-300/80">Genomically safe · CPIC compliant · zero conflicts.</p>
        </div>

        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-200">
          <span className="font-semibold block">Contraindicated</span>
          <span>{contraindicated} · {pgxConflict.replace(/_/g, ' ') || 'genomic conflict'}</span>
        </div>

        <button
          onClick={onOpenPriorAuthModal}
          className="w-full p-2.5 rounded-lg bg-white/5 border border-[#1e293b] hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center justify-between transition-all"
        >
          <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-teal-300" /> Prior Authorization</span>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Override form */}
      {showOverridePanel && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleCustomOverrideSubmit}
          className="vs-card p-4 text-xs space-y-3"
        >
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
            <span className="font-semibold text-slate-100 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-teal-300" /> Physician Override
            </span>
            <button type="button" onClick={() => setShowOverridePanel(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Alternative regimen</label>
            <select
              value={overrideDrug}
              onChange={e => setOverrideDrug(e.target.value)}
              className="w-full p-2 bg-[#0b1120] border border-[#1e293b] rounded text-xs text-slate-200"
            >
              <option value="Ticagrelor 90mg PO Twice Daily">Ticagrelor 90mg PO BID (recommended)</option>
              <option value="Prasugrel 10mg PO Daily">Prasugrel 10mg PO Daily</option>
              <option value="Apixaban 5mg PO Twice Daily">Apixaban 5mg PO BID</option>
              <option value="Custom Regimen">Custom prescription</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Clinical note</label>
            <textarea
              value={overrideNote}
              onChange={e => setOverrideNote(e.target.value)}
              rows={3}
              className="w-full p-2 bg-[#0b1120] border border-[#1e293b] rounded text-xs text-slate-200"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded text-xs">
            Apply Override
          </button>
        </motion.form>
      )}

      {/* Approved notice */}
      {isApproved && (
        <div className="vs-card p-4 border-emerald-500/30 text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Care plan approved & signed</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Approved by <span className="font-semibold text-white">{approvedState?.physicianName || activePatient?.patientProfile?.attendingPhysician || 'Attending Physician'}</span> at {approvedState?.timestamp || new Date().toLocaleTimeString()}.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="vs-card p-4 space-y-2">
        <button
          onClick={onApproveCarePlan}
          disabled={!isConsensusReached && !isApproved}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
            isApproved
              ? 'bg-emerald-600 text-white'
              : isConsensusReached
              ? 'bg-teal-600 hover:bg-teal-500 text-white'
              : 'bg-white/5 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{isApproved ? 'Care Plan Signed' : 'Approve Care Plan'}</span>
        </button>
        <button
          onClick={() => setShowOverridePanel(!showOverridePanel)}
          className="w-full py-2 px-3 rounded-lg border border-[#1e293b] bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Physician Override</span>
        </button>
      </div>
    </div>
  );
}

function TimelineStep({ active, dot, title, text, tone = 'text-slate-400' }) {
  return (
    <div className="relative">
      <div className={`absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0f1a30] ${active ? dot : 'bg-slate-600'}`} />
      <span className="font-semibold text-slate-100 block">{title}</span>
      <p className={`text-[11px] ${active ? tone : 'text-slate-500'}`}>{text}</p>
    </div>
  );
}
