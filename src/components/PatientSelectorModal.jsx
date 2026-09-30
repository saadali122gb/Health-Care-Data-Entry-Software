import React, { useState } from 'react';
import { 
  Users, ChevronRight, Activity, Dna, 
  ShieldAlert, CheckCircle2, Loader2, X
} from 'lucide-react';
import { usePatientStore } from '../store/PatientStore';
import { motion } from 'framer-motion';

const conflictColors = {
  CYP2C19_PRODRUG_FAILURE: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-[#0B192C] text-amber-300', icon: Activity },
  DDI_CYP2D6_INHIBITION: { bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-900 text-rose-100', icon: ShieldAlert },
  TPMT_MYELOSUPPRESSION_RISK: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-900 text-amber-100', icon: Dna },
};

export default function PatientSelectorModal({ isOpen, onClose, activePatientId, onSelect }) {
  const { patients } = usePatientStore();
  const [loadingId, setLoadingId] = useState(null);

  if (!isOpen) return null;

  const handleSelect = (patient) => {
    setLoadingId(patient._id);
    setTimeout(() => {
      setLoadingId(null);
      onSelect(patient);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans-medical">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#0B192C] text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif-medical text-lg font-bold">Patient Case Selector</h3>
              <p className="text-xs text-slate-300">Switch patients to run a new swarm analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Cards */}
        <div className="p-6 space-y-4">
          {patients.map((patient, idx) => {
            const conflict = patient.swarmScenario?.conflictType;
            const theme = conflictColors[conflict] || conflictColors.CYP2C19_PRODRUG_FAILURE;
            const Icon = theme.icon;
            const isActive = activePatientId === patient._id;
            const isLoading = loadingId === patient._id;

            return (
              <div
                key={patient._id}
                onClick={() => !isActive && handleSelect(patient)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'border-[#0B192C] bg-slate-50 ring-2 ring-blue-100' 
                    : `${theme.border} ${theme.bg} hover:shadow-md hover:scale-[1.01]`
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display-medical text-lg font-bold shrink-0 ${theme.badge}`}>
                    {patient.patientProfile.fullName.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-serif-medical font-bold text-slate-900 text-base">
                        {patient.patientProfile.fullName}
                      </h4>
                      <span className="text-[11px] text-slate-500 font-mono-code">{patient.mrn}</span>
                      <span className="text-[11px] text-slate-500">•</span>
                      <span className="text-xs text-slate-600">
                        {patient.patientProfile.age}Y {patient.patientProfile.gender}
                      </span>
                      {isActive && (
                        <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-mono-code">
                          ACTIVE CASE
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                      {patient.patientProfile.hospitalAffiliation} · {patient.patientProfile.roomNumber}
                    </p>

                    <div className="mt-2 p-2.5 rounded-lg bg-white/70 border border-current/10 text-xs space-y-1">
                      <div className="flex items-start gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900">{patient.scenarioLabel}</span>
                          <p className="text-[11px] text-slate-600 leading-snug">{patient.scenarioDescription}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Cardiology Proposed:</span>
                        <span className="font-semibold text-blue-900 truncate block">{patient.swarmScenario?.cardioProposal || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Swarm Resolved To:</span>
                        <span className="font-semibold text-emerald-900 truncate block">{patient.swarmScenario?.resolvedDrug || 'Pending analysis'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0 ml-2 flex items-center">
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                    ) : isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between font-sans-medical">
          <span>{patients.length} patient{patients.length === 1 ? '' : 's'} in registry</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-[#0B192C] text-white font-semibold rounded-lg text-xs hover:bg-slate-900">Close</button>
        </div>
      </motion.div>
    </div>
  );
}
