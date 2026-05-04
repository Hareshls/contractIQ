import React from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  Search, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Plus,
  LogOut,
  User
} from 'lucide-react';

const Sidebar = ({ activeView, setActiveView, onNewAnalysis, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'upload', label: 'Upload', icon: <Upload size={20} /> },
    { id: 'analysis', label: 'Analysis', icon: <Search size={20} /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-box">
          <FileText size={18} color="#fff" />
        </div>
        <span className="logo-text">LexGuard AI</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <button className="new-analysis-btn" onClick={onNewAnalysis}>
        <Plus size={18} />
        New Analysis
      </button>

      <div style={{ marginTop: 'auto' }}>
        <button 
          className="nav-item" 
          style={{ color: '#ef4444' }}
          onClick={onLogout}
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
