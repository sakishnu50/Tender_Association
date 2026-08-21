import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Bell,
  Calendar,
  Users2,
  BarChart3,
  Globe2,
  Building2,
  UserCheck,
  History,
  Settings,
  LogIn
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase, count: 150 },
    { id: 'alerts', label: 'Alerts', icon: Bell, count: 3, urgent: true },
    { id: 'calendar', label: 'Bid Calendar', icon: Calendar },
    { id: 'consortium', label: 'Consortium', icon: Users2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'sources', label: 'Sources', icon: Globe2 },
    { id: 'offices', label: 'Offices', icon: Building2 },
    { id: 'users', label: 'Users & Roles', icon: UserCheck },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'login', label: 'Login Showcase', icon: LogIn }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #2563EB 0%, #0284C7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFF',
          fontWeight: '800',
          fontSize: '0.875rem'
        }}>
          IOT
        </div>
        <div className="sidebar-brand-title">
          Infrastructure<br />
          Opportunity Tracker
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-item-content">
                <Icon size={18} />
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
      </nav>

      <div style={{
        padding: '1rem',
        borderTop: '1px solid var(--sidebar-border)',
        fontSize: '0.75rem',
        color: 'var(--sidebar-text)',
        textAlign: 'center'
      }}>
        v2.4 Enterprise Edition
      </div>
    </aside>
  );
}
