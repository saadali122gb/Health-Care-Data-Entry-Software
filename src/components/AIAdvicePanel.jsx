import React, { useState, useEffect } from 'react';
import { Brain, Stethoscope, AlertTriangle, CheckCircle2, Lightbulb, Clock, ChevronDown, ChevronUp, Activity, Heart, Pill, Dna } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAdvicePanel({ patientData, swarmSession }) {
  const [advice, setAdvice] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    if (patientData) {
      generateDoctorAdvice();
    }
  }, [patientData]);

  const generateDoctorAdvice = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const adviceData = {
        overallAssessment: generateOverallAssessment(),
        vitalAnalysis: analyzeVitals(),
        medicationReview: reviewMedications(),
        genomicInsights: analyzeGenomics(),
        recommendations: generateRecommendations(),
        riskFactors: identifyRiskFactors(),
        followUpPlan: createFollowUpPlan()
      };
      setAdvice(adviceData);
      setIsAnalyzing(false);
    }, 1500);
  };

  const generateOverallAssessment = () => {
    const age = patientData.patientProfile?.age || 0;
    const vitals = patientData.vitals || {};
    const hr = vitals.heartRateBpm || 72;
    const sysBp = vitals.bpSystolic || parseInt((vitals.bloodPressure || '120/80').split('/')[0]) || 120;
    const bp = `${sysBp}`;

    let assessment = 'stable';
    let details = [];

    if (age > 65) {
      assessment = 'moderate-risk';
      details.push('Advanced age requires careful monitoring');
    }

    if (hr > 100 || hr < 60) {
      assessment = 'attention-needed';
      details.push(`Heart rate of ${hr} bpm requires monitoring`);
    }

    if (sysBp > 140) {
      assessment = 'attention-needed';
      details.push('Elevated systolic blood pressure detected');
    }

    return {
      status: assessment,
      summary: assessment === 'stable' 
        ? 'Patient appears clinically stable with normal vital signs.' 
        : 'Patient requires close monitoring due to identified risk factors.',
      details,
      confidence: 0.92
    };
  };

  const analyzeVitals = () => {
    const vitals = patientData.vitals || {};
    const bloodPressure = vitals.bpSystolic
      ? `${vitals.bpSystolic}/${vitals.bpDiastolic}`
      : vitals.bloodPressure;
    const spO2 = vitals.spO2Percent ?? vitals.spO2;
    const findings = [];

    if (vitals.heartRateBpm) {
      if (vitals.heartRateBpm > 100) {
        findings.push({
          type: 'warning',
          parameter: 'Heart Rate',
          value: `${vitals.heartRateBpm} bpm`,
          interpretation: 'Tachycardia - may indicate stress, infection, or cardiac issue',
          action: 'Monitor continuously, consider ECG if persistent'
        });
      } else if (vitals.heartRateBpm < 60) {
        findings.push({
          type: 'info',
          parameter: 'Heart Rate',
          value: `${vitals.heartRateBpm} bpm`,
          interpretation: 'Bradycardia - may be normal in athletes or medication effect',
          action: 'Review medications, assess for symptoms'
        });
      } else {
        findings.push({
          type: 'normal',
          parameter: 'Heart Rate',
          value: `${vitals.heartRateBpm} bpm`,
          interpretation: 'Normal sinus rhythm',
          action: 'Continue routine monitoring'
        });
      }
    }

    if (bloodPressure) {
      const systolic = parseInt(bloodPressure.split('/')[0]);
      if (systolic > 140) {
        findings.push({
          type: 'warning',
          parameter: 'Blood Pressure',
          value: bloodPressure,
          interpretation: 'Stage 2 Hypertension',
          action: 'Initiate or adjust antihypertensive therapy'
        });
      } else if (systolic > 120) {
        findings.push({
          type: 'info',
          parameter: 'Blood Pressure',
          value: bloodPressure,
          interpretation: 'Elevated blood pressure',
          action: 'Lifestyle modification, consider medication adjustment'
        });
      }
    }

    if (spO2 && spO2 < 95) {
      findings.push({
        type: 'warning',
        parameter: 'SpO2',
        value: `${spO2}%`,
        interpretation: 'Mild hypoxemia',
        action: 'Supplemental oxygen evaluation, assess respiratory status'
      });
    }

    return findings;
  };

  const reviewMedications = () => {
    const medications = patientData.currentMedications || [];
    const reviews = [];

    // Simulate medication analysis. Medications are structured objects
    // ({ name, dosage, ... }); guard for any legacy string entries too.
    if (medications.length > 0) {
      medications.forEach(med => {
        const medName = typeof med === 'string' ? med : (med?.name || 'Unknown medication');
        const medLower = medName.toLowerCase();
        
        if (medLower.includes('clopidogrel')) {
          reviews.push({
            medication: medName,
            status: 'review',
            note: 'CYP2C19 genotype may affect efficacy - review genomic data',
            alternative: 'Consider ticagrelor or prasugrel if poor metabolizer'
          });
        } else if (medLower.includes('warfarin')) {
          reviews.push({
            medication: medName,
            status: 'monitor',
            note: 'Requires regular INR monitoring and dose adjustment',
            alternative: 'Consider DOACs if appropriate for indication'
          });
        } else {
          reviews.push({
            medication: medName,
            status: 'appropriate',
            note: 'No significant interactions identified',
            alternative: null
          });
        }
      });
    }

    return reviews;
  };

  const analyzeGenomics = () => {
    const genomic = patientData.genomicProfile || {};
    const alleles = genomic.alleles || [];
    const insights = [];

    alleles.forEach(allele => {
      if (allele.riskLevel === 'CRITICAL') {
        insights.push({
          gene: allele.gene,
          diplotype: allele.diplotype,
          impact: allele.clinicalImpact,
          recommendations: [
            'Avoid medications metabolized by this pathway',
            'Consider alternative therapeutic options',
            'Document in allergy/contraindication list'
          ],
          priority: 'high'
        });
      } else if (allele.riskLevel === 'HIGH') {
        insights.push({
          gene: allele.gene,
          diplotype: allele.diplotype,
          impact: allele.clinicalImpact,
          recommendations: [
            'Dose adjustment may be required',
            'Monitor for adverse effects',
            'Consider therapeutic drug monitoring'
          ],
          priority: 'medium'
        });
      }
    });

    return insights;
  };

  const generateRecommendations = () => {
    const recommendations = [
      {
        priority: 'immediate',
        action: 'Review current medication regimen for drug-drug interactions',
        rationale: 'Polypharmacy increases risk of adverse events in elderly patients'
      },
      {
        priority: 'short-term',
        action: 'Schedule follow-up cardiology evaluation',
        rationale: 'Given cardiac history and current vital signs'
      },
      {
        priority: 'routine',
        action: 'Update vaccination status',
        rationale: 'Ensure influenza and pneumococcal vaccines are current'
      }
    ];

    return recommendations;
  };

  const identifyRiskFactors = () => {
    const risks = [];
    const age = patientData.patientProfile?.age || 0;
    const medicalHistory = patientData.medicalHistory || [];

    if (age > 65) {
      risks.push({
        factor: 'Advanced Age',
        level: 'moderate',
        mitigation: 'Enhanced monitoring, medication dose adjustment'
      });
    }

    medicalHistory.forEach(history => {
      if (history.condition.toLowerCase().includes('diabetes')) {
        risks.push({
          factor: 'Diabetes Mellitus',
          level: 'high',
          mitigation: 'Strict glycemic control, cardiovascular risk reduction'
        });
      }
      if (history.condition.toLowerCase().includes('hypertension')) {
        risks.push({
          factor: 'Hypertension',
          level: 'moderate',
          mitigation: 'Blood pressure monitoring, medication adherence'
        });
      }
    });

    return risks;
  };

  const createFollowUpPlan = () => {
    return {
      timeline: '1-2 weeks',
      monitoring: [
        'Daily blood pressure checks',
        'Heart rate monitoring',
        'Medication adherence assessment'
      ],
      labs: [
        'Complete blood count',
        'Basic metabolic panel',
        'Medication levels if indicated'
      ],
      alerts: [
        'Chest pain or shortness of breath',
        'Heart rate persistently >100 or <50',
        'Blood pressure >160/100'
      ]
    };
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
      case 'appropriate':
        return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
      case 'warning':
      case 'review':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
      case 'info':
      case 'monitor':
        return 'text-blue-300 bg-blue-500/10 border-blue-500/30';
      default:
        return 'text-slate-300 bg-white/5 border-[#1e293b]';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'immediate':
      case 'high':
        return 'text-rose-300 bg-rose-500/10 border-rose-500/30';
      case 'short-term':
      case 'medium':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-slate-300 bg-white/5 border-[#1e293b]';
    }
  };

  if (!advice && isAnalyzing) {
    return (
      <div className="vs-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-teal-300 animate-pulse" />
          </div>
          <h3 className="font-semibold text-slate-100">AI Clinical Analysis</h3>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <span>Analyzing patient data...</span>
        </div>
      </div>
    );
  }

  if (!advice) return null;

  return (
    <div className="vs-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#1e293b]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">AI Clinical Advice</h3>
              <p className="text-[11px] text-slate-500">MoveOn AI Solutions</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase">Confidence</div>
            <div className="text-lg font-bold text-teal-300">{(advice.overallAssessment.confidence * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Overall Assessment */}
        <div className={`p-4 rounded-xl border ${
          advice.overallAssessment.status === 'stable' 
            ? 'bg-emerald-500/10 border-emerald-500/30' 
            : 'bg-amber-500/10 border-amber-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {advice.overallAssessment.status === 'stable' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
            <h4 className="font-semibold text-slate-100">Overall Assessment</h4>
          </div>
          <p className="text-sm text-slate-300 mb-2">{advice.overallAssessment.summary}</p>
          {advice.overallAssessment.details.length > 0 && (
            <ul className="text-xs text-slate-400 space-y-1">
              {advice.overallAssessment.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Vitals Analysis */}
        <div>
          <button
            onClick={() => toggleSection('vitals')}
            className="w-full flex items-center justify-between p-3 bg-white/5 border border-[#1e293b] rounded-lg hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span className="font-medium text-slate-200">Vitals Analysis</span>
              <span className="text-xs text-slate-500">({advice.vitalAnalysis.length} findings)</span>
            </div>
            {expandedSections.vitals ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          <AnimatePresence>
            {expandedSections.vitals && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2"
              >
                {advice.vitalAnalysis.map((finding, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${getStatusColor(finding.type)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{finding.parameter}</span>
                      <span className="text-xs font-mono">{finding.value}</span>
                    </div>
                    <p className="text-xs text-slate-300/90 mb-1">{finding.interpretation}</p>
                    <p className="text-xs font-medium text-slate-200">Action: {finding.action}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Medication Review */}
        <div>
          <button
            onClick={() => toggleSection('medications')}
            className="w-full flex items-center justify-between p-3 bg-white/5 border border-[#1e293b] rounded-lg hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-slate-200">Medication Review</span>
              <span className="text-xs text-slate-500">({advice.medicationReview.length} medications)</span>
            </div>
            {expandedSections.medications ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          <AnimatePresence>
            {expandedSections.medications && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2"
              >
                {advice.medicationReview.map((review, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${getStatusColor(review.status)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{review.medication}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(review.status)}`}>
                        {review.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300/90 mb-1">{review.note}</p>
                    {review.alternative && (
                      <p className="text-xs font-medium text-slate-200">Alternative: {review.alternative}</p>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Genomic Insights */}
        {advice.genomicInsights.length > 0 && (
          <div>
            <button
              onClick={() => toggleSection('genomics')}
              className="w-full flex items-center justify-between p-3 bg-white/5 border border-[#1e293b] rounded-lg hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-2">
                <Dna className="w-4 h-4 text-teal-300" />
                <span className="font-medium text-slate-200">Genomic Insights</span>
                <span className="text-xs text-slate-500">({advice.genomicInsights.length} findings)</span>
              </div>
              {expandedSections.genomics ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            <AnimatePresence>
              {expandedSections.genomics && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 space-y-2"
                >
                  {advice.genomicInsights.map((insight, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${getPriorityColor(insight.priority)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{insight.gene} - {insight.diplotype}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(insight.priority)}`}>
                          {insight.priority} priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-300/90 mb-2">{insight.impact}</p>
                      <ul className="text-xs text-slate-200 space-y-1">
                        {insight.recommendations.map((rec, recIdx) => (
                          <li key={recIdx} className="flex items-start gap-2">
                            <Lightbulb className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <button
            onClick={() => toggleSection('recommendations')}
            className="w-full flex items-center justify-between p-3 bg-white/5 border border-[#1e293b] rounded-lg hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="font-medium text-slate-200">Clinical Recommendations</span>
              <span className="text-xs text-slate-500">({advice.recommendations.length} actions)</span>
            </div>
            {expandedSections.recommendations ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          <AnimatePresence>
            {expandedSections.recommendations && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-2"
              >
                {advice.recommendations.map((rec, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getPriorityColor(rec.priority)}`}>
                        {rec.priority}
                      </span>
                      <span className="font-semibold text-sm">{rec.action}</span>
                    </div>
                    <p className="text-xs text-slate-300/90">{rec.rationale}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Follow-up Plan */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-blue-300" />
            <h4 className="font-semibold text-slate-100">Follow-up Plan</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="font-medium text-slate-200 mb-1">Timeline</div>
              <div className="text-slate-400">{advice.followUpPlan.timeline}</div>
            </div>
            <div>
              <div className="font-medium text-slate-200 mb-1">Monitoring</div>
              <ul className="text-slate-400 space-y-0.5">
                {advice.followUpPlan.monitoring.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-slate-200 mb-1">Alert Conditions</div>
              <ul className="text-slate-400 space-y-0.5">
                {advice.followUpPlan.alerts.map((alert, idx) => (
                  <li key={idx}>• {alert}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}