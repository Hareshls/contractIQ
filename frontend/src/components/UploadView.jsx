import React, { useCallback, useState } from 'react';
import { Upload, FileText, Globe, Link, CheckCircle2, Loader2, Plus } from 'lucide-react';

const UploadView = ({ onUpload, loading, history, onViewAnalysis }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="upload-view">
      {/* Ingestion Area */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
          Document Ingestion
        </div>
        <h1 className="heading" style={{ fontSize: '2.5rem' }}>Ingest Documents</h1>
        <p style={{ color: 'var(--text-sub)' }}>Global legal data platform for smart contract indexing, semantic search, and risk detection.</p>
      </div>

      <div className="card-panel" style={{ padding: '3rem' }}>
        <div 
          className={`upload-area ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <input 
            id="file-upload"
            type="file" 
            style={{ display: 'none' }} 
            onChange={handleChange}
            accept=".pdf,.docx,.txt"
          />
          
          <div className="upload-icon-circle">
            {loading ? <Loader2 className="animate-spin" /> : <Upload />}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h2 className="heading" style={{ fontSize: '1.25rem' }}>
              {loading ? 'Processing Document...' : 'Drag & Drop Documents'}
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>
              Supported formats: PDF, Word, and Text documents.
            </p>
          </div>
        </div>
      </div>

      {/* Real History Integration */}
      <div style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="heading" style={{ fontSize: '1.25rem' }}>Recent Analyses</h3>
        </div>

        {(!history || !Array.isArray(history) || history.length === 0) ? (
          <div className="card-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            No documents in the repository yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {history.slice(0, 3).map((item, i) => (
              <div 
                key={item?.id || i} 
                className="stat-card" 
                style={{ padding: '1.25rem', cursor: 'pointer' }}
                onClick={() => onViewAnalysis && onViewAnalysis(item)}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--bg-raised)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                    <FileText size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                      <div style={{ 
                        fontWeight: 700, 
                        fontSize: '0.9375rem', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        flex: 1,
                        paddingRight: '0.5rem'
                      }}>
                        {item?.filename || "Untitled"}
                      </div>
                      <span style={{ 
                        fontSize: '0.625rem', 
                        fontWeight: 800, 
                        color: (item?.risk_score || 0) > 70 ? 'var(--risk-critical)' : 'var(--risk-low)',
                        whiteSpace: 'nowrap',
                        background: (item?.risk_score || 0) > 70 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        flexShrink: 0
                      }}>
                        {item?.risk_score || 0}% RISK
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {item?.file_type?.toUpperCase() || "N/A"} • {item?.created_at ? new Date(item.created_at).toLocaleDateString() : "Unknown Date"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadView;
