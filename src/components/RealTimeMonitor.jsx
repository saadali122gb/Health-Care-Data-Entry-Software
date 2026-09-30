import React, { useState, useEffect } from 'react';
import { Activity, Heart, Droplets, Thermometer, Clock, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RealTimeMonitor({ patientData }) {
  const [liveVitals, setLiveVitals] = useState({
    heartRate: patientData?.vitals?.heartRateBpm || 72,
    bloodPressure: patientData?.vitals?.bloodPressure || '120/80',
    temperature: patientData?.vitals?.temperature || 37.0,
    spO2: patientData?.vitals?.spO2 || 98,
    respiratoryRate: 16
  });
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      // Simulate real-time vital sign fluctuations
      setLiveVitals(prev => ({
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 3)),
        bloodPressure: simulateBPChange(prev.bloodPressure),
        temperature: Math.max(36.0, Math.min(38.0, prev.temperature + (Math.random() - 0.5) * 0.1)),
        spO2: Math.max(94, Math.min(100, prev.spO2 + (Math.random() - 0.5) * 0.5)),
        respiratoryRate: Math.max(12, Math.min(20, prev.respiratoryRate + (Math.random() - 0.5) * 1))
      }));
      setLastUpdate(new Date());
      checkForAlerts();
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const simulateBPChange = (currentBP) => {
    const [systolic, diastolic] = currentBP.split('/').map(Number);
    const newSystolic = Math.max(100, Math.min(160, systolic + (Math.random() - 0.5) * 5));
    const newDiastolic = Math.max(60, Math.min(100, diastolic + (Math.random() - 0.5) * 3));
    return `${Math.round(newSystolic)}/${Math.round(newDiastolic)}`;
  };

  const checkForAlerts = () => {
    const newAlerts = [];
    
    if (liveVitals.heartRate > 100) {
      newAlerts.push({
        type: 'warning',
        message: 'Elevated heart rate detected',
        vital: 'Heart Rate',
        value: `${Math.round(liveVitals.heartRate)} bpm`
      });
    }
    
    if (liveVitals.heartRate < 60) {
      newAlerts.push({
        type: 'info',
        message: 'Low heart rate detected',
        vital: 'Heart Rate',
        value: `${Math.round(liveVitals.heartRate)} bpm`
      });
    }

    const [systolic] = liveVitals.bloodPressure.split('/').map(Number);
    if (systolic > 140) {
      newAlerts.push({
        type: 'warning',
        message: 'Elevated blood pressure',
        vital: 'Blood Pressure',
        value: liveVitals.bloodPressure
      });
    }

    if (liveVitals.spO2 < 95) {
      newAlerts.push({
        type: 'critical',
        message: 'Low oxygen saturation',
        vital: 'SpO2',
        value: `${Math.round(liveVitals.spO2)}%`
      });
    }

    if (liveVitals.temperature > 37.5) {
      newAlerts.push({
        type: 'info',
        message: 'Elevated temperature',
        vital: 'Temperature',
        value: `${liveVitals.temperature.toFixed(1)}°C`
      });
    }

    setAlerts(newAlerts.slice(0, 3)); // Keep only recent alerts
  };

  const getVitalStatus = (vital, value) => {
    switch (vital) {
      case 'heartRate':
        if (value > 100 || value < 60) return 'warning';
        return 'normal';
      case 'bloodPressure':
        const systolic = parseInt(value.split('/')[0]);
        if (systolic > 140) return 'warning';
        return 'normal';
      case 'spO2':
        if (value < 95) return 'critical';
        return 'normal';
      case 'temperature':
        if (value > 37.5) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'warning':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="vs-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-2 flex-wrap border-b border-[#1e293b]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">Real-Time Monitor</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-[11px] text-slate-400">{isConnected ? 'Live' : 'Paused'}</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono-code hidden sm:inline">{formatTime(lastUpdate)}</span>
          <button
            onClick={() => setIsConnected(!isConnected)}
            className="text-[11px] px-2.5 py-1 rounded-md font-medium border border-[#1e293b] text-slate-300 hover:bg-white/5 transition-all"
          >
            {isConnected ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      <div className="p-3">
        {/* Live Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <VitalTile icon={Heart} label="Heart Rate" unit="bpm" value={Math.round(liveVitals.heartRate)} status={getVitalStatus('heartRate', liveVitals.heartRate)} />
          <VitalTile icon={Activity} label="Blood Pressure" unit="mmHg" value={liveVitals.bloodPressure} status={getVitalStatus('bloodPressure', liveVitals.bloodPressure)} />
          <VitalTile icon={Thermometer} label="Temperature" unit="°C" value={liveVitals.temperature.toFixed(1)} status={getVitalStatus('temperature', liveVitals.temperature)} />
          <VitalTile icon={Droplets} label="SpO₂" unit="%" value={Math.round(liveVitals.spO2)} status={getVitalStatus('spO2', liveVitals.spO2)} />
        </div>

        {/* ECG and Alerts */}
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          {/* Live ECG */}
          <div className="flex-1 bg-[#0B192C] rounded-lg px-3 py-2 overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-teal-300 font-medium tracking-wide uppercase">ECG · Lead II</span>
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            </div>
            <div className="h-8 flex items-center gap-0.5 overflow-hidden">
              {Array.from({ length: 60 }).map((_, i) => {
                const value = Math.sin(i * 0.3) * 15 + Math.random() * 3;
                return (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-teal-400 rounded-full"
                    style={{ 
                      height: `${Math.max(2, Math.abs(value))}px`,
                      opacity: 0.6 + Math.random() * 0.4
                    }}
                    animate={{
                      height: `${Math.max(2, Math.abs(Math.sin((i + Date.now() / 100) * 0.3) * 15 + Math.random() * 3))}px`
                    }}
                    transition={{ duration: 0.1 }}
                  />
                );
              })}
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="w-full sm:w-32 shrink-0 space-y-1">
              {alerts.slice(0, 2).map((alert, idx) => (
                <div key={idx} className={`p-1.5 rounded border text-[10px] ${
                  alert.type === 'critical' 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}>
                  <div className="font-semibold truncate">{alert.message}</div>
                  <div className="text-[9px] opacity-80">{alert.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// A single vital tile: neutral card with a small status dot (color only when abnormal).
function VitalTile({ icon: Icon, label, unit, value, status }) {
  const dot =
    status === 'critical' ? 'bg-rose-500'
    : status === 'warning' ? 'bg-amber-500'
    : 'bg-emerald-500';
  return (
    <div className="vs-card-inset p-2.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Icon className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
        </div>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-bold text-white tabular-nums">{value}</span>
        <span className="text-[10px] text-slate-500">{unit}</span>
      </div>
    </div>
  );
}
