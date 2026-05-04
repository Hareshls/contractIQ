import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Calendar, History, Shield, FileText, ChevronRight } from 'lucide-react';

const ProfileView = ({ user, history, onLogout, onViewAnalysis }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="profile-view anim-fade-in">
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          <User size={48} color="#fff" />
        </div>
        <div className="profile-info">
          <h1>{user?.full_name || 'User Profile'}</h1>
          <div className="profile-meta">
            <span><Mail size={14} /> {user?.email}</span>
            <span><Calendar size={14} /> Joined {formatDate(user?.created_at)}</span>
          </div>
        </div>
        <button className="logout-btn-large" onClick={onLogout}>
          Sign Out
        </button>
      </div>

      <div className="profile-stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-indigo)' }}>
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Analyses</span>
            <span className="stat-value">{history?.length || 0}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-cyan)' }}>
            <Shield size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Safety Rank</span>
            <span className="stat-value">A+</span>
          </div>
        </div>
      </div>

      <div className="history-section">
        <div className="section-header">
          <h2><History size={20} /> Analysis History</h2>
        </div>

        {!history || history.length === 0 ? (
          <div className="history-empty">
            <p>No analysis history yet. Upload a contract to get started!</p>
          </div>
        ) : (
          <div className="history-list">
            {(Array.isArray(history) ? history : []).map((item) => (
              <div 
                key={item?.id || Math.random()} 
                className="history-item" 
                onClick={() => onViewAnalysis(item)}
                style={{ cursor: 'pointer' }}
              >
                <div className="history-item-icon">
                  <FileText size={18} />
                </div>
                <div className="history-item-details">
                  <h3>{item?.filename || "Untitled Document"}</h3>
                  <p>{item?.file_type?.toUpperCase() || "N/A"} • {item?.created_at ? formatDate(item.created_at) : "Unknown Date"}</p>
                </div>
                <div className="history-item-score">
                  <div className={`score-badge ${(item?.risk_score || 0) > 70 ? 'high' : (item?.risk_score || 0) > 30 ? 'medium' : 'low'}`}>
                    {item?.risk_score || 0}% Risk
                  </div>
                </div>
                <button className="view-history-btn">
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
