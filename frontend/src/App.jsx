import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LayoutDashboard,
  Upload,
  Search,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Plus,
  Bell,
  User,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  History,
  Sparkles
} from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UploadView from './components/UploadView';
import AnalysisView from './components/AnalysisView';
import ReportsView from './components/ReportsView';
import LandingPage from './components/LandingPage';
import ProfileView from './components/ProfileView';
import Auth from './components/Auth';

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(token);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    }
  }, [isAuthenticated]);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Session expired');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentUploads(response.data);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleAuthSuccess = () => {
    const token = localStorage.getItem('token');
    fetchUser(token);
    fetchHistory();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setActiveView('auth');
  };

  const handleUpload = async (file) => {
    if (!isAuthenticated) {
      setActiveView('profile');
      return;
    }

    setLoading(true);
    setError(null);
    setActiveView('analysis');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setAnalysisData(response.data);
        const newUpload = {
          id: Date.now(),
          name: file.name,
          type: 'Contract',
          status: 'PROCESSED',
          party: 'Unknown',
          date: 'Just now'
        };
        setRecentUploads([newUpload, ...recentUploads]);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    if (!isAuthenticated) {
      setActiveView('upload'); // Trigger Auth guard
    }
  };

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (!isAuthenticated && activeView !== 'dashboard') {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  const handleViewAnalysis = (analysis) => {
    try {
      const parsedData = typeof analysis.full_analysis === 'string' 
        ? JSON.parse(analysis.full_analysis) 
        : analysis.full_analysis;
      setAnalysisData(parsedData);
      setActiveView('analysis');
    } catch (err) {
      console.error("Error opening analysis report", err);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard recentUploads={recentUploads} onNavigate={setActiveView} onViewAnalysis={handleViewAnalysis} />;
      case 'upload':
        return <UploadView onUpload={handleUpload} loading={loading} history={recentUploads} onViewAnalysis={handleViewAnalysis} />;
      case 'analysis':
        return <AnalysisView data={analysisData} loading={loading} error={error} />;
      case 'reports':
        return <ReportsView recentUploads={recentUploads} onViewAnalysis={handleViewAnalysis} />;
      case 'profile':
        return <ProfileView user={user} history={recentUploads} onLogout={handleLogout} onViewAnalysis={handleViewAnalysis} />;
      default:
        return <Dashboard recentUploads={recentUploads} onNavigate={setActiveView} onViewAnalysis={handleViewAnalysis} />;
    }
  };

  const getUserInitials = () => {
    if (!user?.full_name) return '??';
    return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="app-container">
      <div className="ambient-orb orb-indigo" />
      <div className="ambient-orb orb-cyan" />

      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onNewAnalysis={() => setActiveView('upload')}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <header className="view-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <div style={{ position: 'relative', width: '340px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
              <input
                id="global-search"
                type="text"
                placeholder="Search contracts, risks, or entities..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                onKeyDown={e => { if (e.key === 'Escape') { setSearchQuery(''); setSearchOpen(false); } }}
                style={{
                  width: '100%',
                  padding: '0.625rem 1rem 0.625rem 2.5rem',
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onMouseEnter={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onMouseLeave={e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border)'; }}
              />
              {/* Search results dropdown */}
              {searchOpen && searchQuery.trim().length > 0 && (() => {
                const results = recentUploads.filter(u =>
                  (u.filename && u.filename.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (u.file_type && u.file_type.toLowerCase().includes(searchQuery.toLowerCase()))
                );
                return (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r-md)', zIndex: 999,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                    maxHeight: 320, overflowY: 'auto'
                  }}>
                    {results.length === 0 ? (
                      <div style={{ padding: '1rem', color: 'var(--text-dim)', fontSize: '0.875rem', textAlign: 'center' }}>
                        No contracts found for "{searchQuery}"
                      </div>
                    ) : results.map((u, i) => (
                      <div
                        key={u.id || i}
                        onMouseDown={() => {
                          setAnalysisData(u); // Load the contract analysis
                          setActiveView('analysis');
                          setSearchQuery('');
                          setSearchOpen(false);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.75rem 1rem', cursor: 'pointer',
                          borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-raised)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <FileText size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.filename}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.125rem' }}>
                            {u.file_type ? u.file_type.toUpperCase() : 'Contract'} · {u.created_at ? new Date(u.created_at).toLocaleDateString() : ''}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: 6,
                          background: u.risk_score > 70 ? 'rgba(239, 68, 68, 0.1)' : u.risk_score > 30 ? 'rgba(249, 115, 22, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                          color: u.risk_score > 70 ? 'var(--risk-critical)' : u.risk_score > 30 ? 'var(--risk-high)' : 'var(--risk-low)'
                        }}>{u.risk_score || 0}% RISK</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button className="nav-item" style={{ padding: '0.5rem', borderRadius: '50%' }}>
              <Bell size={20} />
            </button>
            <div 
              onClick={() => setActiveView('profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: 'var(--bg-raised)', borderRadius: 'var(--r-full)', border: '1px solid var(--border)', cursor: 'pointer' }}
            >
              <div style={{ width: '24px', height: '24px', background: 'var(--grad-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isAuthenticated ? (
                  <span style={{ fontSize: '10px', color: '#fff', fontWeight: 800 }}>{getUserInitials()}</span>
                ) : (
                  <User size={14} color="#fff" />
                )}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {isAuthenticated ? user.full_name : 'Sign In'}
              </span>
            </div>
          </div>
        </header>

        <div className="content-area anim-fade-in">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;

