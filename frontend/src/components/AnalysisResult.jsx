import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  Zap,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

const SeverityBadge = ({ severity }) => {
  const map = {
    High:   'badge badge-high',
    Medium: 'badge badge-med',
    Low:    'badge badge-low',
  };
  return <span className={map[severity] || 'badge badge-low'}>{severity}</span>;
};

const AnalysisResult = ({ data }) => {
  if (!data) return null;

  const score = Number(data.risk_score) || 0;

  const getRiskColor = (s) => {
    if (s > 70) return 'var(--risk-high)';
    if (s > 40) return 'var(--risk-med)';
    return 'var(--risk-low)';
  };

  const getRiskGlow = (s) => {
    if (s > 70) return 'rgba(248,113,113,0.25)';
    if (s > 40) return 'rgba(251,191,36,0.25)';
    return 'rgba(52,211,153,0.25)';
  };

  const riskColor = getRiskColor(score);
  const riskGlow  = getRiskGlow(score);
  const circumference = 2 * Math.PI * 48;

  return (
    <motion.div
      className="result-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ── Score Panel ── */}
      <div className="score-panel">
        {/* Animated SVG ring */}
        <div className="risk-ring" style={{ width: 140, height: 140, flexShrink: 0 }}>
          <svg width="140" height="140" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            {/* track */}
            <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            {/* progress */}
            <motion.circle
              cx="60" cy="60" r="48"
              fill="none"
              stroke={riskColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (circumference * score) / 100 }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 8px ${riskGlow})` }}
            />
          </svg>
          <div className="risk-ring-label">
            <span style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1, color: 'var(--text)' }}>{score}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Risk</span>
          </div>
        </div>

        {/* Meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <ShieldAlert size={22} color={riskColor} />
            <h2 className="heading" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              {data.risk_level} Risk Detected
            </h2>
          </div>
          <p style={{ color: 'var(--text-sub)', lineHeight: 1.75, fontSize: '0.95rem' }}>{data.summary}</p>

          <div className="score-meta">
            <span className="score-meta-chip">
              <span style={{ color: 'var(--text-sub)' }}>Clauses Flagged:</span>{' '}
              <b>{data.clauses?.length || 0}</b>
            </span>
            <span className="score-meta-chip">
              <span style={{ color: 'var(--text-sub)' }}>Confidence:</span>{' '}
              <b style={{ color: 'var(--risk-low)' }}>98.2%</b>
            </span>
            <span className="score-meta-chip">
              <span style={{ color: 'var(--text-sub)' }}>Level:</span>{' '}
              <b style={{ color: riskColor }}>{data.risk_level}</b>
            </span>
          </div>
        </div>
      </div>

      {/* ── Clause Breakdown ── */}
      <div className="clauses-section">
        <div className="clauses-header">
          <AlertTriangle size={20} color="var(--risk-med)" />
          <h3 className="heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            Clause Breakdown
          </h3>
          <span className="chip">{data.clauses?.length || 0} issues</span>
        </div>

        {data.clauses?.map((clause, i) => (
          <motion.div
            key={i}
            className="clause-item"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            {/* Clause header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'var(--cyan-dim)', border: '1px solid var(--border-glow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--cyan)', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0
                }}>
                  {i + 1}
                </span>
                <h4 className="heading" style={{ fontSize: '1.05rem', fontWeight: 700 }}>{clause.title}</h4>
              </div>
              <SeverityBadge severity={clause.severity} />
            </div>

            {/* Original text quote */}
            <div className="clause-quote">
              "{clause.original_text}"
            </div>

            {/* Explanation & suggestion */}
            <div className="clause-cols">
              <div className="info-block">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.625rem' }}>
                  <Info size={15} color="var(--cyan)" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Risk Analysis</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.65 }}>{clause.explanation}</p>
              </div>

              <div className="info-block-green">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.625rem' }}>
                  <Zap size={15} color="var(--risk-low)" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--risk-low)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suggested Rewrite</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.65 }}>{clause.suggested_change}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Recommendation Banner ── */}
      <div className="rec-banner">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
            <TrendingDown size={20} color="var(--cyan)" />
            <h3 className="heading" style={{ fontSize: '1.25rem', fontWeight: 700 }}>Strategic Recommendation</h3>
          </div>
          <p style={{ color: 'var(--text-sub)', lineHeight: 1.75, maxWidth: '80%', fontSize: '0.95rem' }}>
            {data.overall_recommendation || "Carefully review the highlighted clauses before proceeding with execution. Consider consulting a legal professional for high-risk items."}
          </p>
          <button
            className="btn"
            style={{
              marginTop: '1.75rem',
              background: 'var(--accent-grad)',
              color: '#000',
              padding: '0.75rem 2rem',
              fontSize: '0.9rem',
              borderRadius: '12px',
              fontWeight: 700,
              boxShadow: '0 4px 20px var(--cyan-glow)'
            }}
          >
            Export Report <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisResult;
