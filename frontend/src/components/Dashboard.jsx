import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  AlertTriangle, 
  Clock,
  ExternalLink,
  MoreVertical
} from 'lucide-react';

const Dashboard = ({ recentUploads, onNavigate, onViewAnalysis }) => {
  const safeUploads = Array.isArray(recentUploads) ? recentUploads : [];
  
  const stats = [
    { label: 'Total Analyses', value: safeUploads.length.toString(), icon: <ShieldCheck size={20} color="var(--risk-low)" /> },
    { label: 'High Risk Flagged', value: safeUploads.filter(u => (u?.risk_score || 0) > 70).length.toString(), icon: <AlertTriangle size={20} color="var(--risk-high)" /> },
    { label: 'Recent Documents', value: safeUploads.filter(u => {
      const uploadDate = new Date(u?.created_at);
      const now = new Date();
      return (now - uploadDate) / (1000 * 60 * 60 * 24) < 7; // Last 7 days
    }).length.toString(), icon: <Clock size={20} color="var(--accent-primary)" /> },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-view">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="heading" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Portfolio Overview</h1>
        <p style={{ color: 'var(--text-sub)' }}>Real-time legal risk monitoring and contract intelligence.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div className="stat-label">{stat.label}</div>
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid-main">
        <div className="card-panel">
          <div className="panel-title">
            Recent Uploads
            <button onClick={() => onNavigate('upload')} style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600 }}>New Analysis</button>
          </div>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto', borderRadius: '8px' }}>
            {safeUploads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                <p>No contracts analyzed yet. Start by uploading a document.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 1 }}>Contract Name</th>
                    <th style={{ position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 1 }}>Type</th>
                    <th style={{ position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 1 }}>Risk Score</th>
                    <th style={{ position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 1 }}>Date</th>
                    <th style={{ position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 1 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {safeUploads.map((item, i) => (
                    <tr 
                      key={item?.id || i} 
                      onClick={() => onViewAnalysis && onViewAnalysis(item)}
                      style={{ cursor: 'pointer' }}
                      className="hover-row"
                    >
                      <td style={{ 
                      fontWeight: 600, 
                      maxWidth: '200px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {item?.filename || "Untitled"}
                    </td>
                      <td style={{ color: 'var(--text-sub)' }}>{item?.file_type?.toUpperCase() || "N/A"}</td>
                      <td>
                        <span className="status-badge" style={{ 
                          background: (item?.risk_score || 0) > 70 ? 'rgba(239, 68, 68, 0.1)' : 
                                     (item?.risk_score || 0) > 30 ? 'rgba(249, 115, 22, 0.1)' : 
                                     'rgba(34, 197, 94, 0.1)',
                          color: (item?.risk_score || 0) > 70 ? 'var(--risk-critical)' : 
                                 (item?.risk_score || 0) > 30 ? 'var(--risk-high)' : 
                                 'var(--risk-low)',
                        }}>
                          {item?.risk_score || 0}% Risk
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{formatDate(item?.created_at)}</td>
                      <td>
                        <button style={{ color: 'var(--text-dim)' }}><ExternalLink size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card-panel">
            <div className="panel-title">Active Insights</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {safeUploads.length === 0 ? (
                 <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Analyze documents to generate AI-powered legal distribution insights.</p>
               ) : (
                 <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>MOST FREQUENT RISK</div>
                    <div style={{ fontWeight: 700 }}>Liability Limitations</div>
                 </div>
               )}
            </div>
          </div>

          <div className="card-panel" style={{ background: 'var(--accent-primary)', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem', opacity: 0.8 }}>System Status</div>
              <p style={{ fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.5 }}>
                {safeUploads.length > 0 
                  ? `You have successfully audited ${safeUploads.length} contracts with ContractIQ.`
                  : "ContractIQ is ready. Upload your first contract to begin analysis."
                }
              </p>
            </div>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(20px)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
