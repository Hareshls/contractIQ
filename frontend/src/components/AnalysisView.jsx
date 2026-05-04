import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ChevronRight, 
  Download, 
  FileText,
  Loader2,
  Sparkles,
  Clock,
  ShieldAlert
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AnalysisView = ({ data, loading, error }) => {
  const score = Number(data?.risk_score) || 0;
  
  const getRiskColor = (s) => {
    if (s > 70) return 'var(--risk-critical)';
    if (s > 40) return 'var(--risk-high)';
    return 'var(--risk-low)';
  };

  const handleDownloadPDF = async () => {
    const element = document.querySelector('.doc-viewer');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`LexGuard_Report_${data?.filename || 'Analysis'}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1.5rem' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--bg-raised)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
        <h2 className="heading">AI Intelligence Engine Analyzing...</h2>
        <p style={{ color: 'var(--text-sub)' }}>Evaluating clauses against regulatory standards and risk benchmarks.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-panel" style={{ border: '1px solid var(--risk-critical)', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', gap: '1.5rem', padding: '2rem' }}>
        <AlertTriangle color="var(--risk-critical)" size={32} />
        <div>
          <h2 className="heading" style={{ color: 'var(--risk-critical)', marginBottom: '0.5rem' }}>Analysis Failed</h2>
          <p>{error}</p>
          <button className="btn-raised" style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'var(--bg-raised)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', color: '#fff' }} onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', background: 'var(--bg-raised)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <FileText size={40} color="var(--text-dim)" />
        </div>
        <h2 className="heading">No Document Selected</h2>
        <p style={{ color: 'var(--text-sub)', maxWidth: '400px' }}>Upload a contract or select one from your dashboard to view the AI analysis results.</p>
      </div>
    );
  }

  return (
    <div className="analysis-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <FileText size={16} />
            <span>Document Analysis</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{data?.filename}</span>
          </div>
          <h1 className="heading" style={{ fontSize: '2rem' }}>Risk Intelligence Report</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleDownloadPDF}
            className="btn-raised" 
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'var(--bg-raised)', 
              borderRadius: 'var(--r-md)', 
              fontWeight: 600, 
              fontSize: '0.875rem', 
              border: '1px solid var(--border)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
          >
            <Download size={18} /> Export as PDF
          </button>
        </div>
      </div>

      <div className="analysis-content">
        {/* Document Pane */}
        <div className="doc-viewer" style={{ minHeight: 'calc(100vh - 250px)', height: 'fit-content', marginBottom: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', textTransform: 'uppercase' }}>Contract Analysis Report</h2>
          <p style={{ fontWeight: 700, marginBottom: '1rem' }}>Executive Summary:</p>
          <p>{data?.summary || "No summary available for this document."}</p>
          <hr style={{ margin: '2rem 0', opacity: 0.1 }} />
          {Array.isArray(data?.clauses) && data.clauses.map((clause, i) => (
            <div key={i} style={{ marginBottom: '2rem', padding: '1rem', borderRadius: '8px', background: clause?.severity === 'High' ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem', color: clause?.severity === 'High' ? 'var(--risk-critical)' : 'inherit' }}>
                {i + 1}. {clause?.title || "Untitled Clause"}
              </h3>
              <p style={{ fontStyle: 'italic', color: '#64748b', marginBottom: '1rem' }}>"{clause?.original_text || "Text not extracted"}"</p>
              <p style={{ fontSize: '0.9375rem' }}>{clause?.explanation || "No explanation provided."}</p>
            </div>
          ))}
          {!Array.isArray(data?.clauses) || data.clauses.length === 0 && (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>No specific risk clauses identified in this document.</p>
          )}
        </div>

        {/* Analysis Sidebar */}
        <div className="analysis-sidebar">
          <div className="analysis-card" style={{ borderLeft: `4px solid ${getRiskColor(score)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: getRiskColor(score) }}>Aggregate Risk</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{score}%</div>
            </div>
            <div style={{ height: '4px', background: 'var(--bg-raised)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${score}%`, height: '100%', background: getRiskColor(score) }} />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
              Risk Level: <b style={{ color: getRiskColor(score) }}>{data?.risk_level || "Unknown"}</b>
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-sub)', marginTop: '0.5rem' }}>Clause Compliance Analysis</div>
            
            {Array.isArray(data?.clauses) && data.clauses.map((clause, i) => (
              <div key={i} className="analysis-card" style={{ borderLeft: `4px solid ${clause?.severity === 'High' ? 'var(--risk-critical)' : clause?.severity === 'Medium' ? 'var(--risk-high)' : 'var(--risk-low)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{clause?.title || "Clause"}</div>
                  <span className="status-badge" style={{ 
                    background: clause?.severity === 'High' ? 'rgba(239, 68, 68, 0.1)' : clause?.severity === 'Medium' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                    color: clause?.severity === 'High' ? 'var(--risk-critical)' : clause?.severity === 'Medium' ? 'var(--risk-high)' : 'var(--risk-low)',
                    fontSize: '0.625rem' 
                  }}>
                    {clause?.severity?.toUpperCase() || "LOW"}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>{clause?.explanation?.substring(0, 100) || "No details"}...</p>
              </div>
            ))}
          </div>

          <div className="analysis-card" style={{ background: 'var(--grad-primary)', border: 'none', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Sparkles size={16} />
              <span style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Strategic Insight</span>
            </div>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4 }}>{data?.overall_recommendation || data?.recommendation || "Ensure all identified risks are reviewed by legal counsel before signing."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;

