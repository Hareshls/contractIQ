import React from 'react';
import { 
  TrendingUp, 
  AlertCircle, 
  Map as MapIcon, 
  Filter,
  Download,
  Calendar,
  ChevronDown
} from 'lucide-react';

const ReportsView = ({ recentUploads, onViewAnalysis }) => {
  return (
    <div className="reports-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="heading" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Risk Reports Summary</h1>
          <p style={{ color: 'var(--text-sub)' }}>Aggregate risk analytics and compliance trends across your portfolio.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="card-panel">
          <div className="panel-title">
            Risk Concentration Overview
            <MapIcon size={18} color="var(--text-dim)" />
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ flex: 1 }}>
              <div className="heatmap">
                {Array.from({ length: 36 }).map((_, i) => {
                  const hasData = i < recentUploads.length;
                  const score = hasData ? recentUploads[i].risk_score : 0;
                  return (
                    <div 
                      key={i} 
                      className="heatmap-cell" 
                      style={{ 
                        background: score > 70 ? 'var(--risk-critical)' : 
                                    score > 40 ? 'var(--risk-high)' : 
                                    hasData ? 'var(--risk-low)' : 
                                    'var(--bg-raised)',
                        opacity: hasData ? 1 : 0.2
                      }} 
                    />
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.625rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                <span>Safe Documents</span>
                <div style={{ flex: 1, height: '4px', margin: 'auto 1rem', background: 'linear-gradient(to right, var(--bg-raised), var(--risk-critical))', borderRadius: '2px' }} />
                <span>High Risk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '1.5rem' }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="16" fill="none" stroke="var(--bg-raised)" strokeWidth="3" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeDasharray={`${Math.min(recentUploads.length * 10, 100)}, 100`} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>{recentUploads.length}</span>
            </div>
          </div>
          <h3 className="heading" style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Audits Complete</h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.8125rem' }}>Live analysis data is synced with your MongoDB cluster.</p>
        </div>
      </div>

      <div className="card-panel" style={{ marginTop: '1.5rem' }}>
        <div className="panel-title">
          Detailed Analysis Records
          <button style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Filter size={14} /> Filter History
          </button>
        </div>
        
        {recentUploads.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            <p>Select "New Analysis" to generate legal risk reports.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Risk Level</th>
                <th>Primary Insight</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(recentUploads) ? recentUploads : []).map((row, i) => (
                <tr key={i} onClick={() => onViewAnalysis(row)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 700 }}>{row?.filename || "Untitled Document"}</td>
                  <td style={{ color: 'var(--text-sub)' }}>{row?.file_type?.toUpperCase() || "N/A"}</td>
                  <td>
                    <span className="status-badge" style={{ 
                      background: (row?.risk_score || 0) > 70 ? 'rgba(239, 68, 68, 0.1)' : 
                                 (row?.risk_score || 0) > 40 ? 'rgba(249, 115, 22, 0.1)' : 
                                 'rgba(34, 197, 94, 0.1)',
                      color: (row?.risk_score || 0) > 70 ? 'var(--risk-critical)' : 
                             (row?.risk_score || 0) > 40 ? 'var(--risk-high)' : 
                             'var(--risk-low)',
                    }}>
                      {(row?.risk_score || 0) > 70 ? 'CRITICAL' : (row?.risk_score || 0) > 40 ? 'MEDIUM' : 'LOW'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-sub)', maxWidth: '300px' }}>
                    {row?.summary ? (row.summary.substring(0, 80) + (row.summary.length > 80 ? "..." : "")) : "No summary available."}
                  </td>
                  <td>
                    <button style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.75rem' }}>VIEW REPORT</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
