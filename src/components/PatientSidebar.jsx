import React, { useState } from 'react';
import {
  Activity, Dna, Pill, FileText,
  ShieldAlert, Stethoscope, Building, Zap, BarChart2, Users
} from 'lucide-react';
import { VitalsMonitor, DrugInteractionChecker } from './Widgets';

export default function PatientSidebar({ patientData, onOpenPatientSelector }) {
  const [activeTab, setActiveTab] = useState('vitals');

  const { patientProfile, vitals, clinicalRiskScores, medicalHistory, genomicProfile, currentMedications } = patientData;

  const tabs = [
    { id: 'vitals', label: 'Monitor', icon: Activity },
    { id: 'genomics', label: 'PGx Panel', icon: Dna },
    { id: 'history', label: 'History', icon: FileText },
    { id: 'meds', label: 'Meds', icon: Pill },
    { id: 'drugcheck', label: 'DDI Check', icon: Zap },
  ];

  return (
    <div className="vs-card overflow-hidden">
      {/* Patient identity header */}
      <div className="p-4 border-b border-[#1e293b] flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-xl bg-teal-500/15 border border-teal-400/30 text-teal-300 flex items-center justify-center font-bold text-base shrink-0">
            {patientProfile.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white leading-tight truncate">{patientProfile.fullName}</h2>
            <p className="text-[11px] font-mono-code text-teal-300/90">
              {patientData.mrn} · {patientProfile.age}Y {patientProfile.gender} · {patientProfile.bloodGroup}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{patientProfile.admissionReason}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Building className="w-3.5 h-3.5 text-teal-400" />
            <span className="truncate max-w-[140px]">{patientProfile.roomNumber}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
            <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
            <span className="truncate max-w-[140px]">{patientProfile.attendingPhysician.split(',')[0]}</span>
          </div>
          <button
            onClick={onOpenPatientSelector}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 text-xs font-medium hover:bg-white/10 transition-all"
          >
            <Users className="w-3.5 h-3.5" /> Switch
          </button>
        </div>
      </div>

      {/* Scenario badge */}
      {patientData.scenarioLabel && (
        <div className="px-4 py-2 bg-teal-500/5 border-b border-[#1e293b] text-[11px]">
          <span className="font-semibold text-teal-300">Case: </span>
          <span className="text-slate-300">{patientData.scenarioLabel}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#1e293b] text-[11px] font-medium overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[74px] py-2.5 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                active ? 'border-teal-400 text-teal-300 bg-white/5' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-4 space-y-4">
        {activeTab === 'vitals' && (
          <>
            <VitalsMonitor vitals={vitals} />
            <div className="vs-card-inset p-4">
              <h3 className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-teal-400" /> Clinical Risk
              </h3>
              <div className="space-y-2 text-xs">
                {patientProfile.age >= 18 && (
                  <RiskRow label="CHA₂DS₂-VASc" value={`${clinicalRiskScores.chadsVascScore} / 9`} note={clinicalRiskScores.chadsVascInterpretation} />
                )}
                <RiskRow label="Renal (CrCl)" value={clinicalRiskScores.creatinineClearance} />
                <RiskRow label="Troponin I" value={clinicalRiskScores.troponinI} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'genomics' && (
          <div className="vs-card-inset p-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e293b] mb-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Dna className="w-4 h-4 text-teal-400" /> PGx Allele Report
              </h3>
              <span className="text-[10px] font-mono-code text-slate-500">{genomicProfile.specimenId}</span>
            </div>
            <div className="space-y-2.5">
              {(genomicProfile.alleles || []).map((allele, idx) => (
                <div key={idx} className={`p-3 rounded-lg border text-xs ${
                  allele.riskLevel === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/30'
                  : allele.riskLevel === 'REDUCED' ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-white/5 border-[#1e293b]'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 font-mono-code">{allele.gene}</span>
                      <span className="font-mono-code text-[11px] px-1.5 py-0.5 rounded bg-black/30 border border-white/10 text-slate-300">{allele.diplotype}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      allele.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300'
                      : allele.riskLevel === 'REDUCED' ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {allele.riskLevel === 'CRITICAL' && <ShieldAlert className="w-3 h-3" />}
                      {allele.riskLevel}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-300">{allele.phenotype}</p>
                  <p className={`text-[11px] leading-snug mt-0.5 ${allele.riskLevel === 'CRITICAL' ? 'text-rose-300' : 'text-slate-500'}`}>
                    {allele.clinicalImpact}
                  </p>
                </div>
              ))}
              {(genomicProfile.alleles || []).length === 0 && (
                <p className="text-xs text-slate-500">No genomic panel on file.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="vs-card-inset p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-100 pb-2 border-b border-[#1e293b]">Clinical Diagnoses</h3>
            {(medicalHistory || []).map(item => (
              <div key={item._id} className="p-2.5 rounded-lg bg-white/5 border border-[#1e293b] text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-100">{item.condition}</span>
                  <span className="font-mono-code text-[10px] text-slate-500">{item.icd10}</span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span>Onset {item.diagnosedYear} · {item.status}</span>
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">{item.severity}</span>
                </div>
              </div>
            ))}
            {(medicalHistory || []).length === 0 && <p className="text-xs text-slate-500">No history recorded.</p>}
          </div>
        )}

        {activeTab === 'meds' && (
          <div className="vs-card-inset p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-100 pb-2 border-b border-[#1e293b]">Active Medications</h3>
            {(currentMedications || []).map(med => (
              <div key={med._id} className="p-2.5 rounded-lg bg-white/5 border border-[#1e293b] flex gap-2.5 text-xs">
                <Pill className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-slate-100 truncate">{med.name}</span>
                    <span className="font-mono-code text-blue-300 shrink-0">{med.dosage}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{med.route} · {med.frequency}</p>
                  <p className="text-[11px] text-slate-500 italic">{med.indication}</p>
                </div>
              </div>
            ))}
            {(currentMedications || []).length === 0 && <p className="text-xs text-slate-500">No active medications.</p>}
          </div>
        )}

        {activeTab === 'drugcheck' && (
          <DrugInteractionChecker currentMeds={currentMedications || []} />
        )}
      </div>
    </div>
  );
}

function RiskRow({ label, value, note }) {
  return (
    <div className="p-2.5 rounded-lg bg-white/5 border border-[#1e293b]">
      <div className="flex items-center justify-between">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="font-mono-code text-slate-100 font-semibold">{value}</span>
      </div>
      {note && <p className="text-[11px] text-slate-500 mt-1 leading-snug">{note}</p>}
    </div>
  );
}
