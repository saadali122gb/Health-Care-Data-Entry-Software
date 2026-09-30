import React, { useState } from 'react';
import { Upload, X, FileText, User, Calendar, Heart, Dna, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientUploadModal({ isOpen, onClose, onUpload }) {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    mrn: '',
    dob: '',
    roomNumber: '',
    insuranceProvider: '',
    primaryDiagnosis: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    genomicData: '',
    vitals: {
      heartRateBpm: '',
      bloodPressure: '',
      temperature: '',
      spO2: ''
    }
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('vitals.')) {
      const vitalField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vitals: { ...prev.vitals, [vitalField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const now = new Date();
      const [sys, dia] = (formData.vitals.bloodPressure || '120/80').split('/');
      const bpSystolic = parseInt(sys) || 120;
      const bpDiastolic = parseInt(dia) || 80;

      // Medications as structured objects (matches sidebar/widgets expectations)
      const medications = formData.currentMedications
        .split(',')
        .map(m => m.trim())
        .filter(Boolean)
        .map((name, i) => ({
          _id: `m-${Date.now()}-${i}`,
          name,
          dosage: '—',
          route: 'Oral',
          frequency: 'As directed',
          indication: formData.primaryDiagnosis || 'General',
          startDate: now.toISOString().split('T')[0]
        }));

      const allergies = formData.allergies.split(',').map(a => a.trim()).filter(Boolean);

      const newPatient = {
        _id: `PAT-${Date.now()}`,
        mrn: formData.mrn || `MRN-${Date.now().toString().slice(-6)}`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        scenarioLabel: formData.primaryDiagnosis || 'New Admission',
        scenarioDescription: `New patient admission: ${formData.primaryDiagnosis || 'evaluation pending'}.`,
        patientProfile: {
          fullName: formData.fullName,
          age: parseInt(formData.age) || 0,
          gender: formData.gender || 'Unspecified',
          dob: formData.dob || '',
          bloodGroup: 'Unknown',
          weightKg: 0,
          heightCm: 0,
          bmi: 0,
          roomNumber: formData.roomNumber || 'Room not assigned',
          attendingPhysician: 'Attending Physician',
          hospitalAffiliation: 'VitaSync Medical Center',
          insuranceProvider: formData.insuranceProvider || 'Self-pay',
          admissionReason: formData.primaryDiagnosis || 'Evaluation'
        },
        vitals: {
          heartRateBpm: parseInt(formData.vitals.heartRateBpm) || 72,
          heartRateStatus: 'Recorded at intake',
          bpSystolic,
          bpDiastolic,
          bpStatus: bpSystolic >= 140 ? 'Elevated' : 'Normal',
          spO2Percent: parseInt(formData.vitals.spO2) || 98,
          respiratoryRate: 16,
          temperatureC: parseFloat(formData.vitals.temperature) || 37.0,
          ecgSummary: 'Pending review.',
          lastUpdatedIso: now.toISOString()
        },
        clinicalRiskScores: {
          chadsVascScore: 0,
          chadsVascInterpretation: 'Not yet calculated.',
          hasBledScore: 0,
          hasBledInterpretation: 'Not yet calculated.',
          creatinineClearance: 'Pending labs',
          troponinI: 'Pending labs',
          lvefPercent: 0
        },
        medicalHistory: formData.primaryDiagnosis ? [
          {
            _id: `hx-${Date.now()}`,
            condition: formData.primaryDiagnosis,
            icd10: 'R69',
            diagnosedYear: now.getFullYear(),
            status: 'Active',
            severity: 'Under Review'
          }
        ] : [],
        genomicProfile: {
          _id: `pgx-${Date.now()}`,
          specimenId: `GEN-${Date.now().toString().slice(-6)}`,
          panelName: 'Standard PGx Panel',
          sequencingDate: now.toISOString(),
          qualityScore: formData.genomicData ? 'Submitted' : 'Not submitted',
          alleles: formData.genomicData ? [
            {
              gene: 'CYP2C19',
              diplotype: '*1/*1',
              phenotype: 'Normal Metabolizer',
              activityScore: 1.0,
              riskLevel: 'NORMAL',
              clinicalImpact: 'Normal metabolizer — standard dosing appropriate.'
            }
          ] : []
        },
        currentMedications: medications,
        allergies,
        swarmScenario: {
          cardioProposal: 'Standard first-line therapy',
          pgxFlag: 'No genomic conflict detected at intake. Full swarm analysis pending.',
          criticResolution: 'Awaiting swarm analysis for a confirmed care plan.',
          resolvedDrug: 'Pending Analysis',
          conflictType: 'NONE',
          cpicLevel: 'N/A'
        }
      };

      onUpload(newPatient);
      setUploadSuccess(true);
      setIsUploading(false);

      setTimeout(() => {
        setUploadSuccess(false);
        onClose();
        // Reset form
        setFormData({
          fullName: '',
          age: '',
          gender: '',
          mrn: '',
          dob: '',
          roomNumber: '',
          insuranceProvider: '',
          primaryDiagnosis: '',
          medicalHistory: '',
          currentMedications: '',
          allergies: '',
          genomicData: '',
          vitals: {
            heartRateBpm: '',
            bloodPressure: '',
            temperature: '',
            spO2: ''
          }
        });
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-slate-300 w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans-medical"
      >
        {/* Modal Header */}
        <div className="bg-[#0B192C] text-white p-4 px-6 flex items-center justify-between border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-medical text-lg font-bold text-white">
                Upload Patient Information
              </h3>
              <p className="text-xs text-slate-300">
                MoveOn AI Solutions · Secure Data Entry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Message */}
        {uploadSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 p-4 mx-6 mt-4 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-bold text-emerald-900">Patient Data Uploaded Successfully!</p>
              <p className="text-sm text-emerald-700">AI swarm analysis initiated automatically.</p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="45"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">MRN *</label>
                  <input
                    type="text"
                    name="mrn"
                    value={formData.mrn}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="MRN-123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="ICU-301"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Provider</label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Blue Cross"
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Medical Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Diagnosis *</label>
                  <input
                    type="text"
                    name="primaryDiagnosis"
                    value={formData.primaryDiagnosis}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="e.g., Atrial Fibrillation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Medical History</label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Previous conditions, surgeries, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Current Medications (comma-separated)</label>
                  <input
                    type="text"
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Aspirin, Metoprolol, Lisinopril"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Allergies (comma-separated)</label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Penicillin, Sulfa drugs"
                  />
                </div>
              </div>
            </div>

            {/* Vitals */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                Current Vitals
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    name="vitals.heartRateBpm"
                    value={formData.vitals.heartRateBpm}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Blood Pressure</label>
                  <input
                    type="text"
                    name="vitals.bloodPressure"
                    value={formData.vitals.bloodPressure}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="vitals.temperature"
                    value={formData.vitals.temperature}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="37.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    name="vitals.spO2"
                    value={formData.vitals.spO2}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="98"
                  />
                </div>
              </div>
            </div>

            {/* Genomic Data */}
            <div>
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Dna className="w-4 h-4 text-purple-600" />
                Genomic Information
              </h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Genomic Test Results</label>
                <textarea
                  name="genomicData"
                  value={formData.genomicData}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  placeholder="CYP2C19 genotype, TPMT status, etc."
                />
                <p className="text-xs text-slate-500 mt-1">This data will be analyzed by the AI swarm for drug-gene interactions</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || uploadSuccess}
                className="px-6 py-2 bg-[#0B192C] text-amber-300 font-bold rounded-lg hover:bg-[#1E3E62] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : uploadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Uploaded
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Patient Data
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}