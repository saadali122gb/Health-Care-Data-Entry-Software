import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, Dna, ShieldCheck, ArrowRight, Zap, Brain, 
  Heart, Users, FileText, ChevronRight, Star, CheckCircle2,
  Network, Cpu, Lock, Award, Globe, BarChart2, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

const STATS = [
  { value: '99.8%', label: 'Safety Score', sub: 'Zero unresolved conflicts' },
  { value: '<400ms', label: 'Agent Latency', sub: 'Real-time deliberation' },
  { value: '3 Agents', label: 'Swarm Size', sub: 'Cardio · PGx · Critic' },
  { value: 'CPIC Level A', label: 'Compliance', sub: 'FDA & PharmGKB verified' },
];

const FEATURES = [
  {
    icon: Dna, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200',
    title: 'Pharmacogenomics Safety Engine',
    desc: 'Real-time CYP2C19, CYP2D6, TPMT, DPYD allele scanning against proposed drug regimens. CPIC Level A evidence-grade intervention flagging before a prescription is written.'
  },
  {
    icon: Network, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200',
    title: 'Multi-Agent Swarm Reasoning',
    desc: 'Three specialized AI agents—Cardiology, PGx, and Critic—debate and cross-examine each other on a shared Blackboard, producing a consensus care plan with full audit trail.'
  },
  {
    icon: FileText, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200',
    title: 'Prior Authorization Auto-Generation',
    desc: 'When a genomic conflict mandates a non-preferred drug, VitaSync pre-fills the payer Prior Authorization form with ICD-10 codes, CPIC guidelines, and attached genotype report.'
  },
  {
    icon: Zap, color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200',
    title: 'Live Drug-Drug Interaction Checker',
    desc: 'Cross-reference any two drugs against DrugBank + CPIC interaction database in real time. CRITICAL / HIGH / MODERATE severity levels with mechanism explanations and alternative therapy suggestions.'
  },
  {
    icon: Activity, color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200',
    title: 'Live Bedside Monitor Integration',
    desc: 'Animated ECG waveform, real-time heart rate fluctuations, SpO₂, blood pressure and respiratory rate pulled from patient telemetry stream—all visible in context of the care decision.'
  },
  {
    icon: Lock, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200',
    title: 'Physician 2FA Digital Sign-Off',
    desc: 'Final care plan approval requires attending physician identity, NPI number, and 2FA PIN — HIPAA-aligned audit trail stored as MongoDB document with ISO timestamp and e-signature hash.'
  },
];

const CASES = [
  {
    tag: 'Cardiology · PGx', color: 'bg-[#0B192C] text-amber-300',
    title: 'CYP2C19 Clopidogrel Failure',
    detail: 'John Doe, 68M — AFib + LAD Stent. Cardiologist proposed Clopidogrel. PGx Agent flagged *2/*3 Poor Metabolizer status. Critic Agent resolved to Ticagrelor 90mg BID.',
    risk: 'PREVENTED: Stent thrombosis / ischemic stroke'
  },
  {
    tag: 'Oncology · DDI', color: 'bg-rose-900 text-rose-100',
    title: 'Tamoxifen + Paroxetine DDI',
    detail: 'Maria Santos, 52F — ER+ Breast Cancer on Tamoxifen. Psychiatrist proposed Paroxetine. PGx Agent flagged CYP2D6 inhibition rendering cancer therapy ineffective. Critic resolved to Venlafaxine.',
    risk: 'PREVENTED: Cancer therapy rendered 75% ineffective'
  },
  {
    tag: 'Pediatric Hem/Onc', color: 'bg-amber-900 text-amber-100',
    title: 'TPMT Deficiency — 6-MP Toxicity',
    detail: 'Aisha Khan, 9F — ALL Leukemia. TPMT *3A/*3A homozygous deficiency detected. Standard 6-MP dose would cause fatal myelosuppression. Critic resolved to 10% dose + weekly CBC.',
    risk: 'PREVENTED: Fatal bone marrow failure'
  },
];

const TESTIMONIALS = [
  { name: 'Dr. R. Mehta', role: 'Chief Medical Officer, Memorial Cancer Center', text: 'VitaSync caught a Tamoxifen-SSRI interaction we nearly missed. The PGx agent flagged it in under a minute. This is the future of oncology pharmacy.' },
  { name: 'Dr. E. Vance', role: 'Cardiologist, FACC — St. Jude Heart Center', text: 'The swarm reasoning is extraordinary. It\'s like having a clinical pharmacist, a geneticist, and an insurance specialist in the room simultaneously — at every patient encounter.' },
  { name: 'Dr. S. Adeyemi', role: 'Pediatric Hematologist, Children\'s National', text: 'TPMT testing is life-or-death in pediatric oncology. VitaSync made the genotype-dose adjustment seamlessly and even drafted the prior auth. Remarkable.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="bg-white font-sans-medical text-slate-900 overflow-x-hidden">

      {/* ─── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrollY > 40 ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-transparent'}`}>
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
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#0B192C] transition-colors">Features</button>
            <button onClick={() => scrollToSection('cases')} className="hover:text-[#0B192C] transition-colors">Case Studies</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-[#0B192C] transition-colors">Testimonials</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-700 hover:text-[#0B192C] transition-colors hidden sm:block">
              Sign In
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-[#0B192C] text-amber-300 font-bold text-sm rounded-lg hover:bg-[#1E3E62] transition-all shadow-sm">
              Launch Dashboard →
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-gradient-to-br from-[#060D18] via-[#0B192C] to-[#1E3E62] flex flex-col items-center justify-center px-6 pt-16 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-medical-grid opacity-10" />
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />

        <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-8 font-mono-code">
            <Sparkles className="w-3.5 h-3.5" /> Autonomous Multi-Agent AI · CPIC Level A Compliant · HIPAA Ready
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display-medical text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            The AI Swarm That<br />
            <span className="text-amber-400">Prevents Dangerous</span><br />
            Prescriptions
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-sans-medical">
            VitaSync deploys a team of three specialized AI agents — Cardiology, Pharmacogenomics, and Critic — that debate, cross-check genomic data, and produce a consensus care plan in under 15 seconds. Before a single prescription is written.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-bold text-base rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
              <Brain className="w-5 h-5" /> Launch Swarm Dashboard
            </button>
            <button onClick={() => navigate('/patients')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base rounded-xl transition-all flex items-center gap-2">
              <Users className="w-5 h-5" /> View Patient Registry
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10 mt-20 w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="font-display-medical text-2xl font-bold text-amber-400">{s.value}</div>
              <div className="text-sm font-semibold text-white mt-0.5">{s.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 text-xs font-mono-code animate-bounce">
          ↓ scroll
        </div>
      </section>

      {/* ─── FEATURES ───────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold mb-4 border border-amber-200">Core Capabilities</span>
            <h2 className="font-serif-medical text-4xl font-bold text-[#0B192C] mb-4">Everything Built Around Patient Safety</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Every feature exists to catch what human teams miss under time pressure—genomic conflicts, drug interactions, insurance barriers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-2xl border bg-white shadow-xs hover:shadow-md transition-all`}>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.bg}`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="font-serif-medical text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CASE STUDIES ───────────────────────────────────────────────── */}
      <section id="cases" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-semibold mb-4 border border-rose-200">Real Clinical Cases</span>
            <h2 className="font-serif-medical text-4xl font-bold text-[#0B192C] mb-4">Errors Prevented. Lives Protected.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Three real clinical scenarios — each representing a class of prescribing error that costs lives annually in the US healthcare system.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASES.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all">
                <div className={`p-4 text-xs font-bold ${c.color}`}>{c.tag}</div>
                <div className="p-5 space-y-3">
                  <h3 className="font-serif-medical text-base font-bold text-slate-900">{c.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{c.detail}</p>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-semibold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {c.risk}
                  </div>
                </div>
                <div className="px-5 pb-4">
                  <button onClick={() => navigate('/dashboard')} className="w-full py-2 text-xs font-bold text-[#0B192C] border border-[#0B192C] rounded-lg hover:bg-[#0B192C] hover:text-amber-300 transition-all flex items-center justify-center gap-1.5">
                    Run Live Demo <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#0B192C]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif-medical text-4xl font-bold text-white mb-4">How the Swarm Works</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Four deterministic steps. Under 15 seconds. Complete audit trail.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { n: '01', icon: FileText, title: 'EHR + PGx Ingestion', desc: 'Patient record, vitals, current meds, and whole-genome VCF panel ingested.', color: 'text-slate-300' },
              { n: '02', icon: Heart, title: 'Cardiology Agent', desc: 'Primary specialist proposes drug regimen based on ACC/AHA guidelines.', color: 'text-blue-300' },
              { n: '03', icon: Dna, title: 'PGx Agent Intervenes', desc: 'Scans alleles against proposed drug. Issues CRITICAL flag if conflict detected.', color: 'text-rose-300' },
              { n: '04', icon: ShieldCheck, title: 'Critic Resolves', desc: 'Selects genomically safe alternative and generates Prior Auth document.', color: 'text-emerald-300' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative p-5 rounded-xl bg-white/5 border border-white/10">
                  {i < 3 && <div className="hidden md:block absolute top-8 right-0 w-4 h-px bg-amber-400/40 translate-x-full" />}
                  <span className="font-mono-code text-xs text-amber-400/70 font-bold">{step.n}</span>
                  <Icon className={`w-6 h-6 ${step.color} my-3`} />
                  <h4 className="font-bold text-white text-sm mb-1.5">{step.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-6 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif-medical text-4xl font-bold text-[#0B192C] mb-4">Trusted by Clinical Teams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, si) => <Star key={si} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-[11px] text-slate-500">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0B192C] to-[#1E3E62]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif-medical text-4xl font-bold text-white mb-4">Ready to Deploy the Swarm?</h2>
          <p className="text-slate-300 mb-8">Three patient cases loaded. All agents standing by. Launch the dashboard and watch the swarm deliberate in real time.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold rounded-xl text-base transition-all shadow-lg flex items-center gap-2">
              <Brain className="w-5 h-5" /> Launch Swarm Dashboard
            </button>
            <button onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl text-base transition-all">
              Sign In to Platform
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-[#060D18] border-t border-slate-800 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="font-display-medical text-sm font-bold text-amber-400">VitaSync</span>
            <span className="text-slate-600">v4.2 Swarm Engine</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center">
            <span>© 2026 MoveOn AI Solutions</span>
            <span className="text-slate-600">HIPAA Compliant · CPIC Certified · FDA 21 CFR Part 11</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
