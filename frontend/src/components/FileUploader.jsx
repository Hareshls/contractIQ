import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUploader = ({ onUpload, loading }) => {
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDrag(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="uploader-panel">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '10px',
          background: 'var(--cyan-dim)', border: '1px solid var(--border-glow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Upload size={16} color="var(--cyan)" />
        </div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Upload Contract</h2>
      </div>

      {/* Drop Zone */}
      <div
        className={`drop-zone ${drag ? 'active' : ''}`}
        style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          hidden
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1 }}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'var(--bg-raised)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '0.5rem'
              }}>
                <FileText size={26} color="var(--text-dim)" />
              </div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                Drop your contract here
              </p>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>
                PDF, DOCX or TXT · up to 50 MB
              </p>
              <div style={{
                marginTop: '0.75rem',
                padding: '0.45rem 1.25rem',
                background: 'var(--bg-raised)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: 'var(--text-sub)',
                cursor: 'pointer'
              }}>
                Browse files
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                background: 'var(--cyan-dim)', border: '1px solid var(--border-glow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FileText size={26} color="var(--cyan)" />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>
                  {file.name}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '0.25rem' }}>
                  {formatSize(file.size)}
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  background: 'var(--risk-high-bg)', border: '1px solid var(--risk-high-border)',
                  color: 'var(--risk-high)', padding: '0.35rem 0.875rem',
                  borderRadius: '8px', fontSize: '0.775rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                <X size={13} /> Remove
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analyze Button */}
      <button
        className="btn btn-glow"
        style={{ width: '100%', marginTop: '1.25rem', height: '50px', fontSize: '0.95rem', borderRadius: '12px' }}
        disabled={!file || loading}
        onClick={() => onUpload(file)}
      >
        {loading ? (
          <div className="spinner" />
        ) : (
          <><Sparkles size={17} /> Run Analysis</>
        )}
      </button>

      {/* Trust note */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        marginTop: '1rem', padding: '0.875rem 1rem',
        background: 'var(--bg-raised)', borderRadius: '10px',
        border: '1px solid var(--border)'
      }}>
        <Shield size={17} color="var(--risk-low)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-sub)', lineHeight: 1.5 }}>
          Encrypted processing · Documents never stored
        </p>
      </div>
    </div>
  );
};

export default FileUploader;
