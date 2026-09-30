import React from 'react';
import { FileText, X, Printer, CheckCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function PriorAuthModal({ isOpen, onClose, doc }) {
  if (!isOpen || !doc) return null;

  const handlePrint = () => window.print();

  const conflictColors = {
    CYP2C19_PRODRUG_FAILURE: 'text-blue-900 bg-blue-50 border-blue-200',
    DDI_CYP2D6_INHIBITION: 'text-rose-900 bg-rose-50 border-rose-200',
    TPMT_MYELOSUPPRESSION_RISK: 'text-amber-900 bg-amber-50 border-amber-200',
  };
  const conflictStyle = conflictColors[doc.conflictType] || 'text-slate-900 bg-slate-50 border-slate-200';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-300 w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] font-sans-medical">

        {/* Header */}
        <div className="bg-[#0B192C] text-white p-4 px-6 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-medical text-lg font-bold text-white">Prior Authorization Document</h3>
              <p className="text-xs text-slate-300">Auto-generated · {doc.formId} · {new Date(doc.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 text-xs font-semibold transition-all px-3">
              <Printer className="w-4 h-4" /> Print / Export
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document */}
        <div className="p-8 bg-[#FAF9F6] flex-1 overflow-y-auto">
          <div className="bg-white p-8 rounded-xl border border-slate-300 shadow-sm max-w-2xl mx-auto space-y-6 text-slate-900">

            {/* Stamp */}
            <div className="border-b-2 border-[#0B192C] pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display-medical text-xl font-bold text-[#0B192C]">PRIOR AUTHORIZATION FORM</h2>
                <p className="text-xs text-slate-500 font-mono-code mt-0.5">DOCUMENT ID: {doc.formId}</p>
              </div>
              <div className="text-right font-mono-code text-xs">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded font-bold block">
                  AUTONOMOUSLY PRE-FILLED
                </span>
                <p className="text-[10px] text-slate-400 mt-1">{doc.generatedBy}</p>
              </div>
            </div>

            {/* Patient + Payer */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Patient</span>
                <span className="font-bold text-slate-900 text-sm">{doc.patientName}</span>
                <p className="text-[11px] text-slate-600 font-mono-code">{doc.mrn} · DOB: {doc.dob}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Payer / Insurance</span>
                <span className="font-bold text-slate-900 text-sm">{doc.insuranceName}</span>
              </div>
            </div>

            {/* Diagnosis Codes */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ICD-10 Diagnoses</span>
              <p className="text-slate-800 font-sans-medical leading-relaxed">{doc.primaryDiagnosisICD10}</p>
            </div>

            {/* Requested Med */}
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-900 uppercase block mb-1">Requested Medication (Non-Preferred / Genomically Indicated)</span>
              <span className="font-bold text-emerald-950 text-base">{doc.requestedMedication}</span>
              <p className="text-xs text-emerald-900 mt-0.5">{doc.quantity}</p>
            </div>

            {/* Clinical Rationale */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#0B192C] font-serif-medical text-sm block">Medical Necessity & PGx Rationale:</span>
              <div className={`p-3.5 rounded-lg border text-xs leading-relaxed font-sans-medical ${conflictStyle}`}>
                {doc.clinicalRationale}
              </div>
            </div>

            {/* CPIC + Attachments */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-[10px] font-bold text-amber-900 uppercase block mb-1">CPIC Reference</span>
                <p className="text-amber-950 font-sans-medical text-[11px]">{doc.cpicGuidelineReference}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Clinical Evidence Attachments</span>
                {doc.attachments?.map((att, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{att}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature block */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Engine: <strong className="text-slate-800">{doc.generatedBy}</strong></span>
              <span className="font-mono-code">{new Date(doc.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="p-3 px-6 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 bg-[#0B192C] text-white font-semibold rounded-lg text-xs hover:bg-slate-900">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
