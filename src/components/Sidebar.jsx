import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Layers,
  Calendar,
  Users2,
  UserCheck,
  FileBarChart,
  Globe,
  Building2,
  History,
  Settings,
  LogOut
} from 'lucide-react';

const navSections = [
  {
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/' },
      { id: 'opportunities', label: 'Opportunities', icon: Layers, path: '/opportunities', count: 150, urgent: false },
      { id: 'calendar', label: 'Bid Calendar', icon: Calendar, path: '/calendar' }
    ]
  },
  {
    items: [
      { id: 'consortium', label: 'Consortium', icon: Users2, path: '/consortium' },
      { id: 'client_profile', label: 'Client Profile', icon: UserCheck, path: '/client-profile' },
      { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart, path: '/reports' },
      { id: 'sources', label: 'Tender Sources', icon: Globe, path: '/sources' }
    ]
  },
  {
    items: [
      { id: 'offices', label: 'Offices', icon: Building2, path: '/offices' },
      { id: 'audit', label: 'Audit Trail', icon: History, path: '/audit' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, onRequestLogout, activeProject, isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const handleNavClick = (item) => {
    if (setActiveTab) {
      setActiveTab(item.id);
    }
    if (item.path) {
      navigate(item.path);
    }
    if (setIsOpen) setIsOpen(false);
  };

  const handleLogoutClick = () => {
    if (onRequestLogout) {
      onRequestLogout();
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen && setIsOpen(false)} 
        />
      )}
      <aside className={`sidebar ${isOpen ? 'open' : ''} dark:bg-[#070A12] dark:border-slate-800`}>
      {/* Sidebar Branding Header */}
      <div className="sidebar-header">
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '0.625rem',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: '800',
          fontSize: '0.95rem',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
          flexShrink: 0
        }}>
          TA
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span className="sidebar-brand-title dark:text-slate-100">
            TENDER HUB
          </span>
          <span style={{ fontSize: '0.675rem', color: 'var(--sidebar-text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }} className="dark:text-slate-400">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span> Enterprise SaaS
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav">
        {navSections.map((section, idx) => (
          <div
            key={idx}
            className={idx < navSections.length - 1 ? 'nav-section-divider dark:border-slate-800' : ''}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    className={`nav-item ${
                      isActive 
                        ? 'active dark:bg-blue-600 dark:text-white' 
                        : 'dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                    }`}
                    onClick={() => handleNavClick(item)}
                    type="button"
                  >
                    <div className="nav-item-content">
                      <Icon size={17} className={`nav-icon ${isActive ? 'dark:text-white' : 'dark:text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && (
                      <span className={`nav-badge ${item.urgent ? 'urgent' : ''} ${
                        isActive 
                          ? 'dark:bg-white/20 dark:text-white' 
                          : 'dark:bg-blue-500/20 dark:text-blue-200'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Logout Navigation Area */}
      <div className="sidebar-bottom-actions dark:border-slate-800">
        <button
          className="sidebar-logout-btn dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
          onClick={handleLogoutClick}
          title="Sign out of your session"
          type="button"
        >
          <div className="nav-item-content">
            <LogOut size={17} className="nav-icon dark:text-slate-400" />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </aside>
    </>
  );
}
