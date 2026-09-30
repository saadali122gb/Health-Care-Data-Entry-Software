import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Brain,
  Users
} from 'lucide-react';

export default function Header({
  swarmStatus,
  isPlaying,
  onTogglePlay,
  onReset,
  speedMultiplier,
  onChangeSpeed,
  onOpenKnowledgeBase,
  safetyScore
}) {
  const navigate = useNavigate();
  const safety = typeof safetyScore === 'number' ? safetyScore : 99.8;

  const getStatus = () => {
    switch (swarmStatus) {
      case 'INGESTING':
        return { label: 'Ingesting record', dot: 'bg-slate-400' };
      case 'CARDIOLOGY_ACTIVE':
        return { label: 'Cardiology review', dot: 'bg-blue-500 animate-pulse' };
      case 'PGX_INTERVENTION':
        return { label: 'Pharmacogenomic check', dot: 'bg-amber-500 animate-pulse' };
      case 'CRITIC_RESOLUTION':
        return { label: 'Resolving care plan', dot: 'bg-blue-500 animate-pulse' };
      case 'CONSENSUS_REACHED':
        return { label: 'Consensus reached', dot: 'bg-emerald-500' };
      case 'APPROVED':
        return { label: 'Plan approved', dot: 'bg-emerald-500' };
      default:
        return { label: 'Ready', dot: 'bg-slate-400' };
    }
  };

  const status = getStatus();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      {/* Brand */}
      <button onClick={() => navigate('/')} className="flex items-center gap-3 shrink-0 group">
        <div className="w-9 h-9 rounded-lg bg-[#0B192C] flex items-center justify-center">
          <Activity className="w-5 h-5 text-teal-300" />
        </div>
        <div className="text-left leading-tight">
          <h1 className="font-display-medical text-lg font-bold tracking-wide text-[#0B192C]">
            Vita<span className="text-teal-600">Sync</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-sans-medical">Clinical Decision Support</p>
        </div>
      </button>

      {/* Status + playback */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap order-3 lg:order-2 w-full lg:w-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
          <span className={`w-2 h-2 rounded-full ${status.dot}`} />
          {status.label}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Safety</span>
          <span className="font-semibold text-slate-800">{safety.toFixed(1)}%</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause analysis' : 'Play analysis'}
            className="p-1.5 rounded-md hover:bg-white text-slate-600 hover:text-[#0B192C] transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={onReset}
            title="Restart analysis"
            className="p-1.5 rounded-md hover:bg-white text-slate-600 hover:text-[#0B192C] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <div className="flex items-center gap-0.5 px-0.5">
            {[1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  speedMultiplier === s
                    ? 'bg-[#0B192C] text-white'
                    : 'text-slate-500 hover:bg-slate-200'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="flex items-center gap-2 order-2 lg:order-3">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-all"
          title="Patient Registry"
        >
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Patients</span>
        </button>
        <button
          onClick={onOpenKnowledgeBase}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-all"
          title="Knowledge Base"
        >
          <Brain className="w-4 h-4" />
          <span className="hidden sm:inline">Knowledge</span>
        </button>
      </div>
    </header>
  );
}
