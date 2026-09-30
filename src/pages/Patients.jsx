import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientUploadModal from '../components/PatientUploadModal';
import { usePatientStore } from '../store/PatientStore';
import { 
  Activity, User, Heart, Dna, AlertTriangle, CheckCircle2, 
  ArrowRight, Calendar, MapPin, Shield, Upload, Trash2, X, RotateCcw
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Patients() {
  const navigate = useNavigate();
  const { patients, addPatient, deletePatient, selectPatient, resetToSeed } = usePatientStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handlePatientUpload = (newPatient) => {
    addPatient(newPatient);
  };

  const handleLaunch = (patient) => {
    selectPatient(patient._id);
    navigate('/dashboard');
  };

  const confirmDeletePatient = patients.find(p => p._id === confirmDeleteId) || null;

  const criticalCount = patients.filter(p =>
    (p.genomicProfile?.alleles || []).some(a => a.riskLevel === 'CRITICAL')
  ).length;
  const resolvedCount = patients.filter(p =>
    p.swarmScenario?.resolvedDrug && p.swarmScenario.resolvedDrug !== 'Pending Analysis'
  ).length;

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MODERATE': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const getConflictBadge = (type) => {
    const badges = {
      'CYP2C19_PRODRUG_FAILURE': { color: 'bg-rose-100 text-rose-800 border-rose-300', label: 'CYP2C19 Conflict' },
      'DDI_CYP2D6_INHIBITION': { color: 'bg-orange-100 text-orange-800 border-orange-300', label: 'Drug-Drug Interaction' },
      'TPMT_MYELOSUPPRESSION_RISK': { color: 'bg-purple-100 text-purple-800 border-purple-300', label: 'TPMT Toxicity Risk' }
    };
    return badges[type] || { color: 'bg-slate-100 text-slate-800 border-slate-300', label: 'Genomic Conflict' };
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0B192C] to-[#1E3E62] flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <div className="leading-none">
              <span className="font-display-medical text-lg font-bold tracking-wide text-[#0B192C]">
                Vita<span className="text-amber-600">Sync</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-sans-medical">by MoveOn AI Solutions</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            <button 
              onClick={() => navigate('/')}
              className="text-sm font-semibold text-slate-700 hover:text-[#0B192C] transition-colors hidden sm:block"
            >
              Back to Home
            </button>
            <button
              onClick={resetToSeed}
              title="Restore the built-in sample patients"
              className="p-2 sm:px-3 sm:py-2 border border-slate-300 text-slate-600 font-medium text-sm rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Samples</span>
            </button>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3 sm:px-4 py-2 bg-amber-500 text-amber-950 font-bold text-sm rounded-lg hover:bg-amber-400 transition-all shadow-sm flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Add Patient
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-[#0B192C] text-amber-300 font-bold text-sm rounded-lg hover:bg-[#1E3E62] transition-all shadow-sm"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-display-medical text-3xl font-bold text-[#0B192C] mb-2">Patient Registry</h1>
          <p className="text-slate-600">Active clinical cases with genomic conflicts requiring swarm intervention</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{patients.length}</div>
                <div className="text-xs text-slate-500">Total Patients</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{criticalCount}</div>
                <div className="text-xs text-slate-500">Critical Conflicts</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{resolvedCount}</div>
                <div className="text-xs text-slate-500">Resolved Plans</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">Level A</div>
                <div className="text-xs text-slate-500">CPIC Compliance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {patients.map((patient, index) => {
            const conflictBadge = getConflictBadge(patient.swarmScenario?.conflictType);
            const criticalAllele = (patient.genomicProfile?.alleles || []).find(a => a.riskLevel === 'CRITICAL');
            
            return (
              <motion.div
                key={patient._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-slate-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B192C] to-[#1E3E62] flex items-center justify-center">
                        <User className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{patient.patientProfile.fullName}</h3>
                        <p className="text-sm text-slate-500">{patient.patientProfile.age}y · {patient.patientProfile.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${conflictBadge.color}`}>
                        {conflictBadge.label}
                      </span>
                      <button
                        onClick={() => setConfirmDeleteId(patient._id)}
                        title="Delete patient"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    {patient.patientProfile.roomNumber || 'Room not assigned'}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Scenario */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Clinical Scenario</h4>
                    <p className="text-sm text-slate-700 leading-relaxed">{patient.scenarioDescription || 'New patient — awaiting swarm analysis.'}</p>
                  </div>

                  {/* Critical Genomic Finding */}
                  {criticalAllele && (
                    <div className={`p-3 rounded-lg border ${getRiskColor(criticalAllele.riskLevel)}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Dna className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">{criticalAllele.gene}</span>
                      </div>
                      <p className="text-xs font-semibold mb-1">{criticalAllele.diplotype}</p>
                      <p className="text-xs opacity-80">{criticalAllele.clinicalImpact}</p>
                    </div>
                  )}

                  {/* Swarm Resolution */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-800">Swarm Resolution</span>
                    </div>
                    <p className="text-xs text-emerald-900 font-medium">{patient.swarmScenario?.resolvedDrug || 'Pending swarm analysis'}</p>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>MRN: {patient.mrn}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Heart className="w-3.5 h-3.5 text-slate-400" />
                      <span>HR: {patient.vitals?.heartRateBpm ?? '—'} bpm</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() => handleLaunch(patient)}
                    className="w-full py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-amber-300 font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    Launch Swarm Analysis
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Patient Upload Modal */}
      <PatientUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handlePatientUpload}
      />

      {/* Delete Confirmation Modal */}
      {confirmDeletePatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-5 flex items-start gap-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">Delete Patient</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Remove <span className="font-semibold text-slate-700">{confirmDeletePatient.patientProfile.fullName}</span> ({confirmDeletePatient.mrn}) from the registry? This cannot be undone.
                </p>
              </div>
              <button onClick={() => setConfirmDeleteId(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-white transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => { deletePatient(confirmDeletePatient._id); setConfirmDeleteId(null); }}
                className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition-all text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete Patient
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
