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
  ShieldCheck,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { exportService } from '../services/exportService';
import { mockClientProfile } from '../data/clientProfileData';

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
      { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
      { id: 'login', label: 'Logout', icon: LogOut, path: '/login' }
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

  const handleDownloadProjectPDF = (e) => {
    e?.stopPropagation();
    // Use activeProject or fallback to the latest selected/first past project
    const targetProject = activeProject || mockClientProfile.pastProjects[0];
    if (targetProject) {
      exportService.exportSingleProjectPDF(targetProject);
    }
  };

  return (
    <aside className="sidebar">
      {/* Sidebar Branding Header */}
      <div className="sidebar-header" style={{ padding: '1.25rem 1.15rem' }}>
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
          <span className="sidebar-brand-title" style={{ letterSpacing: '0.04em', fontSize: '0.85rem' }}>
            Tender Hub
          </span>
          <span style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ShieldCheck size={11} color="#10B981" /> Enterprise SaaS
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav" style={{ padding: '0.75rem 0.65rem' }}>
        {navSections.map((section, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: idx < navSections.length - 1 ? '0.75rem' : '0',
              paddingBottom: idx < navSections.length - 1 ? '0.75rem' : '0',
              borderBottom: idx < navSections.length - 1 ? '1px solid var(--sidebar-border, rgba(255, 255, 255, 0.08))' : 'none'
            }}
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
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.825rem',
                      fontWeight: isActive ? '600' : '500',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      backgroundColor: isActive ? 'rgba(37, 99, 235, 0.16)' : 'transparent',
                      borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="nav-item-content" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Icon size={17} style={{ color: isActive ? '#3B82F6' : '#64748B', flexShrink: 0 }} />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && (
                      <span className={`nav-badge ${item.urgent ? 'urgent' : ''}`} style={{
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '9999px',
                        backgroundColor: item.urgent ? '#DC2626' : 'rgba(255, 255, 255, 0.1)',
                        color: '#FFFFFF',
                        boxShadow: item.urgent ? '0 0 8px rgba(220, 38, 38, 0.5)' : 'none'
                      }}>
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

      {/* Footer: Bottom-Left Download Button & Status */}
      <div style={{
        padding: '0.85rem 1rem',
        borderTop: '1px solid var(--sidebar-border, rgba(255, 255, 255, 0.08))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.65rem'
      }}>
        {/* Download Button at the bottom-left */}
        <button
          type="button"
          onClick={handleDownloadProjectPDF}
          title={activeProject ? `Download ${activeProject.name} PDF` : 'Download Selected Project Details (PDF)'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(37, 99, 235, 0.4)',
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            color: '#60A5FA',
            fontSize: '0.775rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.18s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.3)';
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = '#3B82F6';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.15)';
            e.currentTarget.style.color = '#60A5FA';
            e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.4)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Download size={14} />
          <span>Download</span>
        </button>

        {/* Operational Status Dot */}
        <span style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: '#10B981',
          boxShadow: '0 0 6px #10B981'
        }} title="System Operational" />
      </div>
    </aside>
  );
}
