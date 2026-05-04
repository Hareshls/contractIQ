import React from 'react';
import {
  Zap, Search, Lock, BarChart3,
  ArrowRight, FileText, Shield, Sparkles, Globe, Cpu
} from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Cpu size={24} />,
      title: "Llama 3.3 70B Intelligence",
      description: "Harness the power of a 70-billion parameter model optimized for complex legal reasoning and precision risk scoring."
    },
    {
      icon: <Search size={24} />,
      title: "High-Stakes Risk Audit",
      description: "Beyond simple compliance. Identify financial traps, legal loopholes, and operational liabilities in seconds."
    },
    {
      icon: <Shield size={24} />,
      title: "Financial Exposure Detection",
      description: "Detect uncapped liabilities, punitive penalties, and hidden financial triggers that threaten your bottom line."
    },
    {
      icon: <Sparkles size={24} />,
      title: "Actionable Redlining",
      description: "Get context-aware clause rewrites and strategic negotiation advice to mitigate exposure before you sign."
    }
  ];

  const steps = [
    { num: '01', title: 'Upload', desc: 'Securely ingest any contract PDF or Word doc.' },
    { num: '02', title: 'Analyze', desc: 'AI identifies risks and cross-references standards.' },
    { num: '03', title: 'Execute', desc: 'Sign with confidence or negotiate with AI data.' },
  ];

  return (
    <div className="landing-view" style={{ minHeight: '100vh', background: 'var(--bg-root)', color: 'var(--text)' }}>
      {/* Ambient BG */}
      <div className="grid-overlay" />
      <div className="ambient-orb orb-indigo" />
      <div className="ambient-orb orb-cyan" />
      <div className="ambient-orb orb-purple" />

      {/* Header */}
      <header style={{ 
        height: '80px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 5%', 
        position: 'fixed', 
        top: 0, left: 0, right: 0, 
        zIndex: 100,
        background: 'rgba(3, 5, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-box">
            <FileText size={18} color="#fff" />
          </div>
          <span className="logo-text" style={{ fontSize: '1.5rem' }}>ContractIQ</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button 
            className="new-analysis-btn" 
            style={{ margin: 0, padding: '0.625rem 1.5rem', borderRadius: 'var(--r-md)' }}
            onClick={onGetStarted}
          >
            Launch Platform
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section style={{ 
        paddingTop: '180px', 
        paddingBottom: '100px', 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '180px 5% 100px'
      }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.5rem 1rem', 
          background: 'rgba(99, 102, 241, 0.1)', 
          borderRadius: 'var(--r-full)', 
          border: '1px solid rgba(99, 102, 241, 0.2)',
          color: 'var(--accent-primary)',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '2rem'
        }}>
          <Sparkles size={14} />
          Legal Intelligence at AI Speed
        </div>
        
        <h1 style={{ 
          fontSize: 'clamp(3rem, 8vw, 5.5rem)', 
          fontWeight: 800, 
          lineHeight: 1.1, 
          marginBottom: '1.5rem',
          maxWidth: '1000px',
          fontFamily: 'Outfit'
        }}>
          The Operating System for <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Modern Legal Teams</span>
        </h1>
        
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-sub)', 
          maxWidth: '700px', 
          lineHeight: 1.6, 
          marginBottom: '3rem' 
        }}>
          Automate contract audits, mitigate hidden risks, and accelerate closure with enterprise-grade AI trained on complex legal datasets.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="new-analysis-btn" 
            style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', borderRadius: 'var(--r-lg)' }}
            onClick={onGetStarted}
          >
            Get Started Free <ArrowRight size={20} />
          </button>
        </div>

        {/* Hero Visual (Mockup) */}
        <div style={{ 
          marginTop: '5rem', 
          width: '100%', 
          maxWidth: '1100px', 
          height: '500px', 
          background: 'var(--bg-card)', 
          borderRadius: '24px 24px 0 0', 
          border: '1px solid var(--border)',
          borderBottom: 'none',
          padding: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ width: '100%', height: '100%', background: 'var(--bg-root)', borderRadius: '16px 16px 0 0', display: 'flex', overflow: 'hidden' }}>
             {/* Sidebar Replica */}
             <div style={{ width: '220px', height: '100%', background: 'var(--bg-surface)', borderRight: '1px solid var(--border)', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                   <div className="logo-box" style={{ width: '24px', height: '24px' }}><FileText size={14} color="#fff" /></div>
                   <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>ContractIQ</span>
                </div>
                {['Dashboard', 'Upload', 'Analysis', 'Reports', 'Profile'].map((label, i) => (
                  <div key={i} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    padding: '0.75rem', 
                    background: i === 0 ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    color: i === 0 ? 'var(--accent-primary)' : 'var(--text-sub)'
                  }}>
                    <Search size={16} style={{ opacity: i === 0 ? 1 : 0.5 }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{label}</span>
                  </div>
                ))}
             </div>

             {/* Dashboard Content Replica */}
             <div style={{ flex: 1, padding: '2rem', textAlign: 'left' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ width: '120px', height: '8px', background: 'var(--bg-raised)', borderRadius: '4px', marginBottom: '0.5rem' }} />
                  <div style={{ width: '200px', height: '20px', background: 'var(--text-main)', borderRadius: '4px', opacity: 0.1 }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                   {[1, 2, 3].map((_, i) => (
                     <div key={i} style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                           <div style={{ width: '60px', height: '6px', background: 'var(--bg-raised)', borderRadius: '3px' }} />
                           <Shield size={18} color="var(--accent-primary)" />
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{i === 0 ? '124' : i === 1 ? '18' : '42'}</div>
                     </div>
                   ))}
                </div>

                <div style={{ background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border)', padding: '1rem' }}>
                   {[1, 2, 3].map((_, i) => (
                     <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: i === 2 ? 'none' : '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                           <div style={{ width: '28px', height: '28px', background: 'var(--bg-raised)', borderRadius: '6px' }} />
                           <div style={{ width: i === 0 ? '120px' : '90px', height: '8px', background: 'var(--bg-raised)', borderRadius: '4px' }} />
                        </div>
                        <div style={{ fontSize: '0.625rem', fontWeight: 800, color: i === 1 ? 'var(--risk-critical)' : 'var(--risk-low)', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
                          {i === 1 ? '82.5%' : '7.2%'} RISK
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-root) 0%, transparent 100%)', pointerEvents: 'none' }} />
        </div>
      </section>

      {/* Steps Section */}
      <section id="features" style={{ padding: '100px 5%', background: 'var(--bg-surface)' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 className="heading" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Three Steps to Closure</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '1.125rem' }}>A streamlined workflow designed for high-velocity legal operations.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', maxWidth: '1100px', margin: '0 auto' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: 'rgba(99, 102, 241, 0.05)', position: 'absolute', top: '-2rem', left: '0', zIndex: 0 }}>{step.num}</div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 className="heading" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-sub)', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {features.map((f, i) => (
            <div key={i} className="stat-card" style={{ padding: '2.5rem' }}>
              <div style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>{f.icon}</div>
              <h3 className="heading" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 5%', textAlign: 'center' }}>
        <div className="card-panel" style={{ 
          maxWidth: '1000px', 
          margin: '0 auto', 
          padding: '5rem 2rem', 
          background: 'var(--grad-primary)',
          color: '#fff',
          border: 'none',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              marginBottom: '1.5rem', 
              padding: '0.5rem 1.25rem', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: 'var(--r-full)', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              textTransform: 'uppercase' 
            }}>
              <Shield size={14} /> 100% Secure AI Audits
            </div>
            <h2 className="heading" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Eliminate Hidden <br />Contract Liabilities.</h2>
            <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2.5rem', opacity: 0.9 }}>
              Stop leaving your business exposed. Use ContractIQ to audit your entire contract portfolio for legal and financial traps in minutes.
            </p>
            <button 
              className="btn" 
              style={{ background: '#fff', color: 'var(--accent-primary)', padding: '1.125rem 3.5rem', borderRadius: 'var(--r-lg)', fontSize: '1.125rem', fontWeight: 800, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
              onClick={onGetStarted}
            >
              Start Free Audit
            </button>
          </div>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(50px)' }} />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 5%', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-box" style={{ width: '24px', height: '24px' }}>
            <FileText size={14} color="#fff" />
          </div>
          <span className="logo-text" style={{ fontSize: '1.125rem' }}>ContractIQ</span>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>© 2026 ContractIQ. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

