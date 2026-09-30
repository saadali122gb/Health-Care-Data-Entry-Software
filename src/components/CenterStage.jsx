import React, { useState } from 'react';
import { 
  Network, 
  FileSpreadsheet, 
  Heart, 
  Dna, 
  ShieldCheck, 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CenterStage({ 
  swarmSession, 
  currentStepIndex, 
  swarmStatus, 
  onOpenPriorAuthModal,
  activePatient
}) {
  const [viewMode, setViewMode] = useState('blackboard'); // 'blackboard' | 'graph'

  const { steps } = swarmSession;
  const scenario = activePatient?.swarmScenario || {};
  const cardioProposal = scenario.cardioProposal || 'Standard first-line therapy';
  const resolvedDrug = scenario.resolvedDrug || 'Pending analysis';
  const conflictLabel = (scenario.conflictType || 'No conflict').replace(/_/g, ' ');
  const criticalAllele = (activePatient?.genomicProfile?.alleles || []).find(a => a.riskLevel === 'CRITICAL');

  // Dark theme per-agent styling
  const agentTheme = {
    INGESTION: {
      border: 'border-[#1e293b]',
      badge: 'bg-white/10 text-slate-300 border-white/10',
      icon: FileSpreadsheet
    },
    CARDIOLOGY: {
      border: 'border-blue-500/30',
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      icon: Heart
    },
    PHARMACOGENOMICS: {
      border: 'border-rose-500/30',
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      icon: Dna
    },
    CRITIC: {
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: ShieldCheck
    }
  };

  return (
    <main className="vs-card flex flex-col overflow-hidden">
      
      {/* Top Controls & View Mode Selector */}
      <div className="border-b border-[#1e293b] px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-white truncate">
            Clinical Reasoning
          </h2>
          <p className="text-[11px] text-slate-500">Multi-agent care plan analysis</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#0b1120] border border-[#1e293b] p-1 rounded-lg text-xs font-medium overflow-x-auto self-start sm:self-auto">
          <button
            onClick={() => setViewMode('blackboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              viewMode === 'blackboard' 
                ? 'bg-teal-600 text-white font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Reasoning Steps</span>
          </button>

          <button
            onClick={() => setViewMode('graph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              viewMode === 'graph' 
                ? 'bg-teal-600 text-white font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Consensus Flow</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="p-4 sm:p-5 space-y-5">

        {/* Consensus Reached Banner Header */}
        {swarmStatus === 'CONSENSUS_REACHED' || swarmStatus === 'APPROVED' ? (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-emerald-200">
                  Consensus reached
                </span>
                <p className="text-xs text-emerald-300/80">
                  Care plan reconciled with the patient's genomic profile. No unresolved conflicts.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenPriorAuthModal}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all w-full sm:w-auto shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>View Prior Authorization</span>
            </button>
          </motion.div>
        ) : null}

        {/* ================= MODE 1: BLACKBOARD DOCUMENT CARDS ================= */}
        {viewMode === 'blackboard' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const isVisible = index <= currentStepIndex;
              const isCurrentTyping = index === currentStepIndex && step.status === 'typing';

              if (!isVisible) return null;

              const theme = agentTheme[step.agentKey] || agentTheme.INGESTION;
              const IconComp = theme.icon;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`vs-card-inset border ${theme.border} p-5 relative overflow-hidden transition-all`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between border-b border-[#1e293b] pb-3 mb-4 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${theme.badge}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-slate-100">
                            {step.title}
                          </h3>
                          {step.agentName && (
                            <span className="font-mono-code text-[11px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                              {step.agentName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs shrink-0">
                      {step.confidenceScore && (
                        <span className="bg-white/5 text-slate-300 px-2 py-0.5 rounded font-semibold text-[11px]">
                          {step.confidenceScore}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Typing Indicator */}
                  {isCurrentTyping ? (
                    <div className="py-6 flex items-center justify-center gap-3 text-slate-400 text-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="italic">Agent analyzing clinical data...</span>
                    </div>
                  ) : (
                    /* Step Output Body Content */
                    <div className="space-y-4">

                      {/* STEP 1: INGESTION */}
                      {step.agentKey === 'INGESTION' && (
                        <div className="text-xs text-slate-300 leading-relaxed bg-white/5 p-3.5 rounded-lg border border-[#1e293b]">
                          {step.content}
                        </div>
                      )}

                      {/* STEP 2: CARDIOLOGY REASONING */}
                      {step.agentKey === 'CARDIOLOGY' && (
                        <div className="space-y-3">
                          <div className="p-3.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs">
                            <span className="font-semibold text-blue-200 text-sm block mb-1">
                              Primary Recommendation: {step.recommendation}
                            </span>
                            <p className="text-slate-300 leading-relaxed">
                              {step.rationale}
                            </p>
                          </div>

                          <div className="text-xs space-y-1">
                            <span className="text-[11px] font-semibold text-slate-400 uppercase">
                              Guidelines & Evidence
                            </span>
                            <ul className="list-disc pl-5 text-slate-400 space-y-0.5 text-[11px]">
                              {step.evidenceCitations?.map((cite, cIdx) => (
                                <li key={cIdx}>{cite}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* STEP 3: PHARMACOGENOMICS CRITICAL INTERVENTION */}
                      {step.agentKey === 'PHARMACOGENOMICS' && (
                        <div className="space-y-3">
                          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs">
                            <div className="flex items-center gap-2 mb-1.5 font-semibold text-rose-200 text-sm">
                              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
                              <span>{step.alertHeader}</span>
                            </div>
                            <p className="text-rose-200/90 leading-relaxed text-xs">
                              {step.alertBody}
                            </p>
                          </div>

                          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
                            <span className="font-semibold text-amber-200 block mb-0.5">
                              CPIC Directive:
                            </span>
                            <p className="text-[11px] text-amber-200/90">
                              {step.cpicRecommendation}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* STEP 4: CRITIC RESOLUTION & PRIOR AUTH */}
                      {step.agentKey === 'CRITIC' && (
                        <div className="space-y-3">
                          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                            <div className="flex items-center gap-2 mb-1 font-semibold text-emerald-200 text-sm">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                              <span>{step.resolutionHeader}</span>
                            </div>
                            <p className="text-emerald-200/90 leading-relaxed text-xs">
                              {step.resolutionBody}
                            </p>
                          </div>

                          {/* Prior Auth Card Action */}
                          {step.priorAuthGenerated && (
                            <div className="p-3.5 rounded-lg bg-white/5 border border-[#1e293b] flex items-center justify-between text-xs gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="p-2 rounded bg-teal-500/15 text-teal-300 border border-teal-500/20 shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-100 block">
                                    Prior Authorization auto-generated
                                  </span>
                                  <span className="text-[11px] text-slate-500 font-mono-code">
                                    PA-FORM-2026-{activePatient?.mrn?.slice(-6) || 'XXXXXX'} &bull; {resolvedDrug}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={onOpenPriorAuthModal}
                                className="px-3 py-1.5 rounded-md bg-teal-600 text-white font-semibold text-xs hover:bg-teal-500 transition-all shrink-0"
                              >
                                Review
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-slate-500 font-mono-code">
                    <span>{step.agentName || 'VitaSync Engine'}</span>
                    {step.latencyMs && <span>{step.latencyMs}ms</span>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ================= MODE 2: CONSENSUS FLOW ================= */}
        {viewMode === 'graph' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center max-w-md mx-auto">
              <h3 className="text-base font-semibold text-white">Agent Consensus Flow</h3>
              <p className="text-xs text-slate-500">How the agents reached the final care plan.</p>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-5 vs-card-inset">
              {/* Node 1 */}
              <div className={`flex-1 w-full p-4 rounded-xl border text-center transition-all ${
                currentStepIndex >= 1 ? 'bg-blue-500/10 border-blue-500/40' : 'bg-white/5 border-[#1e293b] opacity-50'
              }`}>
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-xs text-slate-100">Cardiology</h4>
                <p className="text-[10px] text-slate-400 mt-1">Proposed: {cardioProposal}</p>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-600 rotate-90 md:rotate-0 shrink-0" />

              {/* Node 2 */}
              <div className={`flex-1 w-full p-4 rounded-xl border text-center transition-all ${
                currentStepIndex >= 2 ? 'bg-rose-500/10 border-rose-500/40' : 'bg-white/5 border-[#1e293b] opacity-50'
              }`}>
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center mx-auto mb-2">
                  <Dna className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-xs text-slate-100">PGx Safety</h4>
                <p className="text-[10px] text-rose-300 font-medium mt-1">Flag: {criticalAllele ? `${criticalAllele.gene} ${criticalAllele.diplotype}` : conflictLabel}</p>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-600 rotate-90 md:rotate-0 shrink-0" />

              {/* Node 3 */}
              <div className={`flex-1 w-full p-4 rounded-xl border text-center transition-all ${
                currentStepIndex >= 3 ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-white/5 border-[#1e293b] opacity-50'
              }`}>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-xs text-slate-100">Critic</h4>
                <p className="text-[10px] text-emerald-300 font-medium mt-1">Resolved: {resolvedDrug}</p>
              </div>
            </div>

            <div className="p-4 vs-card-inset text-xs text-slate-300">
              <span className="font-semibold text-slate-100 block mb-1">Verification trace</span>
              <p className="text-slate-400 leading-relaxed">
                The initial proposal ({cardioProposal}) was flagged at the PGx step due to a genomic constraint ({conflictLabel}
                {criticalAllele ? ` — ${criticalAllele.gene} ${criticalAllele.diplotype}` : ''}). The Critic resolved it by selecting a safe alternative: {resolvedDrug}.
              </p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
