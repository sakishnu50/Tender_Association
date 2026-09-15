import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Users2,
  BarChart3,
  Globe2,
  Building2,
  UserCheck,
  History,
  Settings,
  LogOut,
  BadgeCheck,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navSections = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { id: 'opportunities', label: 'Opportunities', icon: Briefcase, count: 150, path: '/opportunities' },
      { id: 'calendar', label: 'Bid Calendar', icon: Calendar, path: '/calendar' },
    ]
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { id: 'consortium', label: 'Consortium', icon: Users2, path: '/consortium' },
      { id: 'client_profile', label: 'Client Profile', icon: BadgeCheck, path: '/client-profile' },
      { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, path: '/reports' },
      { id: 'sources', label: 'Tender Sources', icon: Globe2, path: '/sources' },
    ]
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { id: 'offices', label: 'Offices', icon: Building2, path: '/offices' },
      { id: 'users', label: 'Users & Roles', icon: UserCheck, path: '/users' },
      { id: 'audit', label: 'Audit Trail', icon: History, path: '/audit' },
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, onRequestLogout, activeProject }) {
  const navigate = useNavigate();
  const location = useLocation();

  const allNavItems = navSections.flatMap(section => section.items);

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = allNavItems.find(item => item.path === currentPath || (item.path !== '/' && currentPath.startsWith(item.path)));
    if (matchedItem && matchedItem.id !== activeTab) {
      setActiveTab(matchedItem.id);
    }
  }, [location.pathname, activeTab, setActiveTab]);

  const auth = useAuth();

  const handleNavClick = (item) => {
    if (item.id === 'login' || item.path === '/login') {
      if (onRequestLogout) {
        onRequestLogout();
      } else {
        if (auth?.logout) {
          auth.logout();
        }
        setActiveTab(item.id);
        navigate(item.path);
      }
      return;
    }
    setActiveTab(item.id);
    navigate(item.path);
  };

  return (
    <aside className="sidebar">
      {/* Sidebar Branding Header */}
      <div className="sidebar-header">
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #2563EB 0%, #0284C7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: '800',
          fontSize: '0.9rem',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
          flexShrink: 0
        }}>
          TA
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          <span className="sidebar-brand-title">
            Tender Hub
          </span>
          <span style={{ fontSize: '0.675rem', color: 'var(--sidebar-text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ShieldCheck size={11} color="#10B981" /> Enterprise SaaS
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav">
        {navSections.map((section, idx) => (
          <div
            key={idx}
            className={idx < navSections.length - 1 ? 'nav-section-divider' : ''}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item)}
                    type="button"
                  >
                    <div className="nav-item-content">
                      <Icon size={17} className="nav-icon" />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && (
                      <span className={`nav-badge ${item.urgent ? 'urgent' : ''}`}>
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

      {/* Bottom Logout Navigation Area (Pinned at absolute bottom) */}
      <div className="sidebar-bottom-actions">
        <button
          className="sidebar-logout-btn"
          onClick={() => handleNavClick({ id: 'login', path: '/login' })}
          title="Sign out of session"
          type="button"
        >
          <div className="nav-item-content">
            <LogOut size={17} className="nav-icon" />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
