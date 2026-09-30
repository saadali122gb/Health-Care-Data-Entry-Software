import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, AlertTriangle, CheckCircle2, XCircle, 
  Zap, Pill, Info, ChevronRight, BookOpen, Shield, ShieldAlert
} from 'lucide-react';
import { DRUG_INTERACTION_DB } from '../data/mockMongoData';
import { motion, AnimatePresence } from 'framer-motion';

function useVitalsStream(baseBpm) {
  const [bpm, setBpm] = useState(baseBpm);
  useEffect(() => {
    const iv = setInterval(() => {
      setBpm(baseBpm + Math.floor(Math.random() * 7) - 3);
    }, 2200);
    return () => clearInterval(iv);
  }, [baseBpm]);
  return bpm;
}

// ─── ECG Strip Component ────────────────────────────────────────────────
function EcgStrip({ color = '#e11d48' }) {
  const points = "0,20 10,20 15,20 20,5 25,35 30,2 35,20 50,20 60,20 65,20 70,8 75,32 80,3 85,20 100,20";
  return (
    <svg viewBox="0 0 100 40" className="w-full h-8" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <animateTransform attributeName="transform" type="translate" from="0 0" to="-100 0" dur="1.8s" repeatCount="indefinite" />
      </polyline>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        transform="translate(100 0)">
        <animateTransform attributeName="transform" type="translate" from="100 0" to="0 0" dur="1.8s" repeatCount="indefinite" />
      </polyline>
    </svg>
  );
}

// ─── Drug Interaction Checker ───────────────────────────────────────────
function DrugInteractionChecker({ currentMeds }) {
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const check = () => {
    if (!drug1 || !drug2) return;
    setChecking(true);
    setResult(null);
    setTimeout(() => {
      const d1 = drug1.toLowerCase().trim();
      const d2 = drug2.toLowerCase().trim();
      let found = null;
      for (const entry of DRUG_INTERACTION_DB) {
        const all = [entry.drug1, entry.drug2, ...(entry.aliases || [])];
        const matchD1 = all.some(a => d1.includes(a) || a.includes(d1));
        const matchD2 = all.some(a => d2.includes(a) || a.includes(d2));
        if (matchD1 && matchD2 && d1 !== d2) { found = entry; break; }
      }
      setResult(found || 'SAFE');
      setChecking(false);
    }, 900);
  };

  const severityStyle = {
    CRITICAL: { bar: 'bg-rose-600', badge: 'bg-rose-100 text-rose-900 border-rose-400', icon: ShieldAlert, text: 'text-rose-700' },
    HIGH: { bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-900 border-amber-400', icon: AlertTriangle, text: 'text-amber-700' },
    MODERATE: { bar: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-900 border-yellow-400', icon: Info, text: 'text-yellow-700' },
  };

  return (
    <div className="vs-card-inset p-4 space-y-3">
      <div className="flex items-center gap-2 pb-2 border-b border-[#1e293b]">
        <Zap className="w-4 h-4 text-teal-400" />
        <h3 className="text-sm font-semibold text-slate-100">Drug Interaction Checker</h3>
        <span className="ml-auto text-[10px] font-mono-code text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded">DrugBank + CPIC</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <label className="block font-medium text-slate-400 mb-1 text-[11px]">Drug A</label>
          <input value={drug1} onChange={e => setDrug1(e.target.value)} placeholder="e.g. warfarin"
            className="w-full p-2 rounded-lg text-xs bg-[#0b1120] border border-[#1e293b] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500/50"
          />
        </div>
        <div>
          <label className="block font-medium text-slate-400 mb-1 text-[11px]">Drug B</label>
          <input value={drug2} onChange={e => setDrug2(e.target.value)} placeholder="e.g. aspirin"
            className="w-full p-2 rounded-lg text-xs bg-[#0b1120] border border-[#1e293b] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500/50"
            onKeyDown={e => e.key === 'Enter' && check()}
          />
        </div>
      </div>
      <button onClick={check} disabled={!drug1 || !drug2 || checking}
        className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-all disabled:opacity-40 flex items-center justify-center gap-2">
        <Search className="w-3.5 h-3.5" />
        {checking ? 'Checking...' : 'Check Interaction'}
      </button>

      <div className="text-[10px] text-slate-500">
        Quick fill: {currentMeds.slice(0,3).map(m => (
          <button key={m._id} onClick={() => setDrug1(m.name.split(' ')[0].toLowerCase())}
            className="underline hover:text-slate-300 mr-2">{m.name.split(' ')[0]}</button>
        ))}
      </div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {result === 'SAFE' ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-xs text-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block">No significant interaction found</span>
                  <span className="text-[11px] text-emerald-300/80">Standard monitoring. Verify with a clinical pharmacist.</span>
                </div>
              </div>
            ) : (
              <div className={`p-3 rounded-lg border text-xs space-y-2 ${
                result.severity === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                : result.severity === 'HIGH' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">{result.severity} interaction detected</span>
                  <span className="font-mono-code text-[10px] font-semibold">{result.cpicLevel}</span>
                </div>
                <p className="leading-snug"><strong>Mechanism:</strong> {result.mechanism}</p>
                <div className="p-2 bg-black/20 rounded border border-white/10">
                  <span className="font-bold block mb-0.5">Clinical action:</span>
                  <p>{result.action}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Vitals Monitor Card ────────────────────────────────────────────────
function VitalsMonitor({ vitals }) {
  const liveBpm = useVitalsStream(vitals.heartRateBpm);
  const liveSpo2 = Math.min(100, vitals.spO2Percent + (Math.random() > 0.5 ? 0 : -1));
  const isAbnormal = liveBpm > 100 || liveBpm < 55;

  return (
    <div className="vs-card-inset p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-teal-300 uppercase tracking-wide">Bedside Monitor</span>
        <span className="flex items-center gap-1.5 text-[10px] font-mono-code text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE
        </span>
      </div>

      {/* ECG Strip */}
      <div className="bg-black/40 rounded-lg p-2 border border-slate-700">
        <EcgStrip color={isAbnormal ? '#f97316' : '#4ade80'} />
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-black/30 rounded-lg p-2.5 border border-slate-700">
          <span className="text-slate-400 text-[10px] block">Heart Rate</span>
          <span className={`font-mono-code text-lg font-bold ${isAbnormal ? 'text-orange-400' : 'text-emerald-300'}`}>
            {liveBpm} <span className="text-[11px] font-normal text-slate-400">BPM</span>
          </span>
          {isAbnormal && <span className="text-[10px] text-orange-400">⚠ Tachycardia</span>}
        </div>
        <div className="bg-black/30 rounded-lg p-2.5 border border-slate-700">
          <span className="text-slate-400 text-[10px] block">Blood Pressure</span>
          <span className="font-mono-code text-base font-bold text-blue-300">
            {vitals.bpSystolic}/{vitals.bpDiastolic}
            <span className="text-[10px] font-normal text-slate-400 ml-1">mmHg</span>
          </span>
        </div>
        <div className="bg-black/30 rounded-lg p-2.5 border border-slate-700">
          <span className="text-slate-400 text-[10px] block">SpO₂</span>
          <span className="font-mono-code text-base font-bold text-cyan-300">
            {vitals.spO2Percent}%
          </span>
        </div>
        <div className="bg-black/30 rounded-lg p-2.5 border border-slate-700">
          <span className="text-slate-400 text-[10px] block">Resp Rate</span>
          <span className="font-mono-code text-base font-bold text-purple-300">
            {vitals.respiratoryRate} <span className="text-[10px] font-normal text-slate-400">/min</span>
          </span>
        </div>
      </div>

      <div className="text-[10px] font-mono-code text-slate-500 text-center">
        Last sync: {new Date().toLocaleTimeString()} · Nurse station alert active
      </div>
    </div>
  );
}

export { DrugInteractionChecker, VitalsMonitor, EcgStrip };
