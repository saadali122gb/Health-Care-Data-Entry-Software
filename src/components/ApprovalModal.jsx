import React, { useState } from 'react';
import { Award, X, ShieldCheck, PenTool, CheckCircle2, AlertTriangle, Pill } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ApprovalModal({ isOpen, onClose, onConfirmApproval, patientName, swarmSession, activePatient }) {
  const [physicianName, setPhysicianName] = useState('Dr. Evelyn Vance, MD, FACC');
  const [npiNumber, setNpiNumber] = useState('1884029104');
  const [passcode, setPasscode] = useState('8842');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  if (!isOpen) return null;

  const resolvedDrug = activePatient?.swarmScenario?.resolvedDrug || 'Recommended Therapy';
  const conflictType = activePatient?.swarmScenario?.conflictType || '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmChecked) return;
    setIsSubmitting(true);
    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (_) {}
    setTimeout(() => {
      onConfirmApproval({ physicianName, npiNumber, timestamp: new Date().toLocaleTimeString() });
      setIsSubmitting(false);
      setConfirmChecked(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans-medical">
      <div className="bg-white rounded-2xl border border-slate-300 w-full max-w-md shadow-2xl overflow-hidden flex flex-col">

        <div className="bg-[#0B192C] text-white p-5 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-serif-medical text-lg font-bold text-white">Physician Final Sign-Off</h3>
              <p className="text-xs text-slate-300">{patientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">

          {/* Swarm consensus summary */}
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Swarm Consensus Verified (Safety: {swarmSession?.safetyScore}%)
            </div>
            <div className="flex items-start gap-2 text-[11px]">
              <Pill className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-950 block">Approved Regimen: {resolvedDrug}</span>
                <span className="text-emerald-800">Zero genomic/DDI conflicts detected · CPIC Level A compliant</span>
              </div>
            </div>
          </div>

          {/* Physician details */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Attending Physician Signature:</label>
            <input type="text" value={physicianName} onChange={e => setPhysicianName(e.target.value)} required
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">NPI Number:</label>
              <input type="text" value={npiNumber} onChange={e => setNpiNumber(e.target.value)} required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono-code text-xs text-slate-900" />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">2FA Sign-Off PIN:</label>
              <input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-mono-code text-xs text-slate-900" />
            </div>
          </div>

          {/* Confirmation checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <input type="checkbox" checked={confirmChecked} onChange={e => setConfirmChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-amber-600 cursor-pointer" />
            <span className="text-[11px] text-amber-900 leading-snug">
              I confirm I have reviewed the swarm analysis, PGx report, and Prior Authorization document. I approve <strong>{resolvedDrug}</strong> as the care plan for {patientName}.
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !confirmChecked}
              className="px-5 py-2.5 bg-gradient-to-r from-[#0B192C] to-[#1E3E62] hover:from-[#1E3E62] hover:to-[#0B192C] text-amber-300 border border-amber-400/40 font-bold rounded-lg text-xs shadow-md flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <PenTool className="w-4 h-4 text-amber-400" />
              {isSubmitting ? 'Signing...' : 'Digitally Sign & Approve'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
