import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, FileText, Shield, Sparkles, Cpu,
  CheckCircle, TrendingUp, AlertTriangle, Zap,
  BarChart3, Search
} from 'lucide-react';

/* ─── tiny helpers ─────────────────────────────────────────────── */
const Counter = ({ to, suffix = '' }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 60);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(start);
    }, 20);
    return () => clearInterval(t);
  }, [to]);
  return <span>{val.toLocaleString()}{suffix}</span>;
};

const RiskRow = ({ name, risk, level, delay }) => {
  const colors = { critical: '#ef4444', high: '#f97316', low: '#22c55e' };
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <div style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={12} color="#94a3b8" />
        </div>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '60px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${risk}%` }}
            transition={{ delay: delay + 0.3, duration: 0.8 }}
            style={{ height: '100%', background: colors[level], borderRadius: '2px' }}
          />
        </div>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: colors[level], minWidth: '35px', textAlign: 'right' }}>{risk}%</span>
      </div>
    </motion.div>
  );
};

/* ─── main component ────────────────────────────────────────────── */
const LandingPage = ({ onGetStarted }) => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 3000);
    return () => clearInterval(t);
  }, []);

  const features = [
    { icon: <Cpu size={20} />, title: 'Llama 3.3 70B Intelligence', description: 'Powered by a 70-billion parameter model fine-tuned for legal reasoning and contract analysis.' },
    { icon: <Search size={20} />, title: 'Deep Risk Audit', description: 'Scans every clause to surface financial traps, one-sided terms, and hidden liabilities.' },
    { icon: <Shield size={20} />, title: 'Risk Scoring', description: 'Each contract gets a risk score with a breakdown of which clauses contributed and why.' },
    { icon: <BarChart3 size={20} />, title: 'Analysis History', description: 'All past contract analyses saved to your account so you can revisit and compare at any time.' },
  ];

  const steps = [
    { num: '01', title: 'Upload', desc: 'Upload a PDF or Word contract from your device.' },
    { num: '02', title: 'Analyze', desc: 'The AI reads every clause and flags risks with explanations.' },
    { num: '03', title: 'Review', desc: 'Go through the risk report and make an informed decision before signing.' },
  ];

  const cardV = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } } };

  return (
    <div style={{ minHeight: '100vh', background: '#03050a', color: '#f8fafc', overflowX: 'hidden', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Ambient background ── */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.25,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 30%, transparent 100%)'
        }} />
        {/* Orbs */}
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25] }} transition={{ duration: 9, repeat: Infinity }}
          style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', top: -250, right: -150, background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', filter: 'blur(100px)' }} />
        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', bottom: -200, left: -100, background: 'radial-gradient(circle, #22d3ee 0%, transparent 70%)', filter: 'blur(100px)' }} />
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 15, repeat: Infinity, delay: 4 }}
          style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', top: '40%', left: '40%', background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(120px)', opacity: 0.12 }} />
      </div>

      {/* ── Sticky nav ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 5%', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
          background: 'rgba(3,5,10,0.75)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(99,102,241,0.4)' }}>
            <FileText size={16} color="#fff" />
          </div>
          <span style={{ fontSize: '1.375rem', fontWeight: 800, fontFamily: "'Outfit',sans-serif", background: 'linear-gradient(to right,#fff,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ContractIQ</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <motion.button whileHover={{ scale: 1.04, boxShadow: '0 6px 24px rgba(99,102,241,0.5)' }} whileTap={{ scale: 0.96 }}
            onClick={onGetStarted}
            style={{ padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg,#6366f1,#a855f7)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
            Launch Platform
          </motion.button>
        </nav>
      </motion.header>

      {/* ══════════════ HERO SPLIT ══════════════ */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 5%', paddingTop: 72, gap: '4rem' }}>

        {/* LEFT — copy */}
        <motion.div style={{ flex: '0 0 50%', y: heroY }} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, type: 'spring' }}>

          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1rem 0.375rem 0.5rem', background: 'rgba(99,102,241,0.12)', borderRadius: 999, border: '1px solid rgba(99,102,241,0.3)', marginBottom: '1.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: 999, padding: '0.2rem 0.6rem', fontSize: '0.65rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <Sparkles size={10} /> New
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>Powered by Llama 3.3 · 70B legal AI</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(2.75rem, 4.5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            <span style={{ color: '#fff' }}>The AI That Reads</span><br />
            <span style={{ color: '#fff' }}>Contracts </span>
            <span style={{
              background: 'linear-gradient(90deg,#a855f7,#6366f1,#22d3ee,#6366f1,#a855f7)',
              backgroundSize: '300% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shine 4s linear infinite'
            }}>Before You Do</span>
          </motion.h1>

          {/* Sub */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            style={{ color: '#64748b', fontSize: '1.0625rem', lineHeight: 1.75, maxWidth: 480, marginBottom: '2.5rem' }}>
            Upload any contract. In under 30 seconds, get a full risk brief — hidden liabilities, one-sided clauses, financial traps — before you sign anything.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.04, boxShadow: '0 12px 40px rgba(99,102,241,0.4)' }} whileTap={{ scale: 0.96 }} onClick={onGetStarted}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '0.9rem 2.25rem', background: 'linear-gradient(135deg,#6366f1,#a855f7)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              Start Free Audit <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* RIGHT — live animated visualization */}
        <motion.div
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, type: 'spring', stiffness: 80, delay: 0.3 }}
          style={{ flex: '0 0 46%', position: 'relative', height: 580 }}
        >
          {/* Main panel */}
          <div style={{ width: '100%', height: '100%', background: 'rgba(10,13,24,0.8)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', padding: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}>

            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {['#ef4444','#eab308','#22c55e'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />)}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '0.25rem 0.75rem', marginLeft: '0.5rem' }}>
                <Shield size={10} color="#475569" style={{ marginRight: 4 }} />
                <span style={{ fontSize: '0.65rem', color: '#475569' }}>contractiq.ai/analyze</span>
              </div>
            </div>

            {/* File being scanned */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', padding: '1rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: 36, height: 36, background: 'rgba(99,102,241,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={16} color="#6366f1" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>MSA_Acme_Corp_2026.pdf</div>
                  <div style={{ fontSize: '0.65rem', color: '#475569' }}>42 pages · Uploaded just now</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 999, padding: '0.25rem 0.625rem' }}>
                  <motion.div animate={{ opacity: [1,0.3,1] }} transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1' }} />
                  <span style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 700 }}>Analyzing</span>
                </div>
              </div>
              {/* Scan beam */}
              <motion.div animate={{ top: ['10%', '90%', '10%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)', boxShadow: '0 0 15px 4px rgba(34,211,238,0.4)' }} />
              {/* Fake text lines */}
              {[80, 95, 60, 75, 90, 40].map((w, i) => (
                <div key={i} style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, marginBottom: 6, width: `${w}%` }} />
              ))}
            </div>

            {/* Risk score gauge */}
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
                <svg width="56" height="56" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                  <motion.circle cx="28" cy="28" r="22" fill="none" stroke="#ef4444" strokeWidth="5"
                    strokeLinecap="round" strokeDasharray="138"
                    initial={{ strokeDashoffset: 138 }}
                    animate={{ strokeDashoffset: 138 * (1 - 0.845) }}
                    transition={{ duration: 1.5, delay: 1 }}
                    transform="rotate(-90 28 28)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#ef4444' }}>84%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.25rem' }}>⚠ HIGH RISK CONTRACT</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.5 }}>Uncapped liability clause detected on pg. 12. Requires legal review before signing.</div>
              </div>
            </div>

            {/* Risk rows */}
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', padding: '0.875rem 1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Clause Risk Breakdown</span>
                <span style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 700 }}>14 flags found</span>
              </div>
              <RiskRow name="Liability Cap §8.2" risk={84} level="critical" delay={1.2} />
              <RiskRow name="IP Assignment §12" risk={67} level="high" delay={1.4} />
              <RiskRow name="Auto-renewal §3.1" risk={45} level="high" delay={1.6} />
              <RiskRow name="Termination §5.4" risk={18} level="low" delay={1.8} />
            </div>

            {/* Glow edge */}
            <div style={{ position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none', boxShadow: 'inset 0 0 40px rgba(99,102,241,0.06)' }} />
          </div>

          {/* ── Floating mini cards ── */}
          <motion.div
            animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: -28, left: -40, background: 'rgba(15,19,35,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 14, padding: '0.875rem 1.125rem', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', minWidth: 170 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <Zap size={14} color="#6366f1" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Analysis Speed</span>
            </div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.625rem', fontWeight: 800, color: '#fff' }}>28<span style={{ fontSize: '1rem', color: '#64748b' }}>s</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.25rem' }}>
              <TrendingUp size={12} color="#22c55e" />
              <span style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 600 }}>3× faster than manual review</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ position: 'absolute', bottom: 80, right: -44, background: 'rgba(15,19,35,0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: 14, padding: '0.875rem 1.125rem', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', minWidth: 155 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <CheckCircle size={14} color="#22d3ee" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Clauses Safe</span>
            </div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.625rem', fontWeight: 800, color: '#fff' }}><Counter to={37} /></div>
            <div style={{ fontSize: '0.65rem', color: '#475569', marginTop: '0.25rem' }}>of 51 total clauses reviewed</div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{ position: 'absolute', top: '40%', right: -52, background: 'rgba(239,68,68,0.1)', backdropFilter: 'blur(16px)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '0.75rem 1rem', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={14} color="#ef4444" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444' }}>Critical Risk</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.25rem' }}>Uncapped liability §8.2</div>
          </motion.div>
        </motion.div>
      </section>



      {/* ══════════ STEPS ══════════ */}
      <section style={{ padding: '120px 8%', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1rem', background: 'rgba(99,102,241,0.1)', borderRadius: 999, border: '1px solid rgba(99,102,241,0.25)', fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '1.25rem' }}>
            How It Works
          </div>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>Three steps from upload to insight</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: 1100, margin: '0 auto' }}>
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              style={{ background: 'rgba(10,13,24,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: '5rem', fontWeight: 900, color: 'rgba(99,102,241,0.06)', position: 'absolute', top: '-1rem', right: '1rem', fontFamily: "'Outfit',sans-serif", lineHeight: 1 }}>{step.num}</div>
              <div style={{ width: 44, height: 44, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1rem', fontWeight: 800, color: '#6366f1' }}>{step.num}</span>
              </div>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.375rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>{step.title}</h3>
              <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.9rem' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ FEATURES GRID ══════════ */}
      <section style={{ padding: '0 8% 120px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(2rem, 4vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>Everything your legal team needs</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', maxWidth: 1200, margin: '0 auto' }}>
          {features.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6, borderColor: 'rgba(99,102,241,0.4)', background: 'rgba(15,19,35,0.95)' }}
              style={{ background: 'rgba(10,13,24,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '2rem', transition: 'all 0.3s', cursor: 'default' }}>
              <div style={{ width: 44, height: 44, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', marginBottom: '1.25rem' }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.0625rem', fontWeight: 700, color: '#fff', marginBottom: '0.625rem' }}>{f.title}</h3>
              <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.7 }}>{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ padding: '0 8% 120px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          style={{ maxWidth: 1100, margin: '0 auto', borderRadius: 28, position: 'relative', overflow: 'hidden', padding: '5rem 4rem', textAlign: 'center', background: 'linear-gradient(135deg,#1e1b4b 0%,#4c1d95 50%,#1e1b4b 100%)', border: '1px solid rgba(139,92,246,0.3)' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(168,85,247,0.3) 0%, transparent 50%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: 999, marginBottom: '1.5rem', backdropFilter: 'blur(8px)' }}>
              <CheckCircle size={14} color="#22c55e" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>100% Secure · SOC2 Compliant · Zero Data Retention</span>
            </motion.div>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>Stop signing blind.</h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.125rem', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              One hidden clause can cost your company millions. ContractIQ catches what lawyers miss — in seconds, not hours.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(0,0,0,0.4)' }} whileTap={{ scale: 0.96 }} onClick={onGetStarted}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '0.95rem 2.5rem', background: '#fff', border: 'none', borderRadius: 14, color: '#4c1d95', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                Start Free Audit <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2.5rem 8%', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={13} color="#fff" /></div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1rem', fontWeight: 800, background: 'linear-gradient(to right,#fff,#64748b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ContractIQ</span>
        </div>
        <p style={{ color: '#334155', fontSize: '0.8125rem' }}>© 2026 ContractIQ. All rights reserved.</p>
      </footer>

      {/* Shine keyframe */}
      <style>{`
        @keyframes shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
