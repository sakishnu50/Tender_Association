import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'opportunities', label: 'Opportunities', icon: Briefcase, count: 150, path: '/opportunities' },
  { id: 'alerts', label: 'Alerts', icon: Bell, count: 3, urgent: true, path: '/alerts' },
  { id: 'calendar', label: 'Bid Calendar', icon: Calendar, path: '/calendar' },
  { id: 'consortium', label: 'Consortium', icon: Users2, path: '/consortium' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'sources', label: 'Sources', icon: Globe2, path: '/sources' },
  { id: 'offices', label: 'Offices', icon: Building2, path: '/offices' },
  { id: 'users', label: 'Users & Roles', icon: UserCheck, path: '/users' },
  { id: 'audit', label: 'Audit Trail', icon: History, path: '/audit' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'login', label: 'Login Showcase', icon: LogIn, path: '/login' }
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedItem = navItems.find(item => item.path === currentPath || (item.path !== '/' && currentPath.startsWith(item.path)));
    if (matchedItem && matchedItem.id !== activeTab) {
      setActiveTab(matchedItem.id);
    }
  }, [location.pathname, activeTab, setActiveTab]);

  const handleNavClick = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

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
              onClick={() => handleNavClick(item)}
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
