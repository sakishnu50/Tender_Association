import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  RefreshCw,
  Download,
  FileText,
  Table,
  Bell,
  Sun,
  Moon,
  X,
  ChevronDown,
  Settings,
  LogOut,
  LogIn,
  User,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { exportService } from '../services/exportService';
import { mockOpportunities } from '../data/mockData';

// Context-aware search config keyed by activeTab
const PAGE_SEARCH_CONFIG = {
  dashboard:     { placeholder: 'Search project name, tender ID, source, sector...', ariaLabel: 'Search opportunities by project, source, or sector' },
  opportunities: { placeholder: 'Search project name, tender ID, source, sector...', ariaLabel: 'Search opportunities by project, source, or sector' },
  opp_details:   { placeholder: 'Search project name, tender ID, source, sector...', ariaLabel: 'Search opportunities by project, source, or sector' },
  calendar:      { placeholder: 'Search bid calendar by project or deadline...',      ariaLabel: 'Search bid calendar entries' },
  consortium:    { placeholder: 'Search consortium partners...',                       ariaLabel: 'Search consortium partner organisations' },
  client_profile:{ placeholder: 'Search clients, projects, or sectors...',            ariaLabel: 'Search client profiles and projects' },
  reports:       { placeholder: 'Search reports and analytics...',                    ariaLabel: 'Search reports and analytics data' },
  sources:       { placeholder: 'Search tender sources...',                           ariaLabel: 'Search monitored tender sources' },
  offices:       { placeholder: 'Search offices by name or location...',              ariaLabel: 'Search offices' },
  users:         { placeholder: 'Search users, roles, or permissions...',             ariaLabel: 'Search users and roles' },
  audit:         { placeholder: 'Search audit logs by action, user, or date...',      ariaLabel: 'Search audit trail logs' },
  settings:      { placeholder: 'Search settings...',                                 ariaLabel: 'Search settings' },
  alerts:        { placeholder: 'Search alerts and notifications...',                 ariaLabel: 'Search alerts' },
};

export default function Header({
  searchVal,
  setSearchVal,
  activeTabTitle,
  activeTab,
  darkMode,
  toggleTheme,
  onExportCSV,
  onDownloadPDF,
  opportunities = mockOpportunities,
  filteredOpportunities = null,
  onRequestLogout
}) {
  const navigate = useNavigate();
  const auth = useAuth();
  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const user = auth?.user || { name: 'S Sakishnu', role: 'Super Admin', email: 'sakishnu33@gmail.com' };

  const inputRef = useRef(null);
  const downloadMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingLabel, setDownloadingLabel] = useState('');
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');

  // Resolve search config for the active page
  const searchConfig = PAGE_SEARCH_CONFIG[activeTab] || PAGE_SEARCH_CONFIG['dashboard'];

  const effectiveData = filteredOpportunities || opportunities || mockOpportunities;
  const userInitial = isAuthenticated && user?.name ? user.name.trim().charAt(0).toUpperCase() : 'G';

  // Keyboard shortcut listener (Cmd+K / Ctrl+K focus, Escape clear)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        if (setSearchVal) setSearchVal('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchVal]);

  // Click outside listener for dropdown menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target)) {
        setShowDownloadMenu(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Logout button
  const handleLogout = (e) => {
    e?.stopPropagation();
    setShowProfileMenu(false);
    if (onRequestLogout) {
      onRequestLogout();
    } else {
      if (auth?.logout) {
        auth.logout();
      }
      navigate('/login');
    }
  };

  // Handle Login button
  const handleLogin = (e) => {
    e?.stopPropagation();
    setShowProfileMenu(false);
    navigate('/login');
    setAriaAnnouncement('Navigating to login interface.');
  };


  const handleDownloadCSV = async () => {
    setShowDownloadMenu(false);
    if (onExportCSV) {
      onExportCSV();
      return;
    }
    setIsDownloading(true);
    setDownloadingLabel('Exporting CSV...');
    await new Promise((resolve) => setTimeout(resolve, 350));
    const dateStr = new Date().toISOString().slice(0, 10);
    exportService.exportToExcel(effectiveData, `Tender_Export_${dateStr}.csv`);
    setIsDownloading(false);
  };

  const handleDownloadPDF = async () => {
    setShowDownloadMenu(false);
    if (onDownloadPDF) {
      onDownloadPDF();
      return;
    }
    setIsDownloading(true);
    setDownloadingLabel('Generating PDF...');
    await new Promise((resolve) => setTimeout(resolve, 450));
    const dateStr = new Date().toISOString().slice(0, 10);
    exportService.exportToPDF(effectiveData, `Tender_Report_${dateStr}.pdf`);
    setIsDownloading(false);
  };

  const sampleNotifications = [
    { id: 1, title: 'Urgent: Urban Infrastructure RFP', time: '10m ago', urgent: true },
    { id: 2, title: 'World Bank Tender Submission', time: '1h ago', urgent: true },
    { id: 3, title: 'ADB Smart Grid Evaluation Updated', time: '3h ago', urgent: false }
  ];

  return (
    <header className="top-header" role="banner">
      {/* Accessibility Announcement for Screen Readers */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {ariaAnnouncement}
      </div>

      {/* 1. Context-Aware Real-Time Search Bar */}
      <div className="header-search" role="search">
        <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          placeholder={searchConfig.placeholder}
          value={searchVal || ''}
          onChange={(e) => setSearchVal && setSearchVal(e.target.value)}
          aria-label={searchConfig.ariaLabel}
        />
        {searchVal ? (
          <button
            onClick={() => setSearchVal && setSearchVal('')}
            style={{
              border: 'none',
              background: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              flexShrink: 0
            }}
            title="Clear search (Esc)"
            aria-label="Clear search input"
          >
            <X size={14} />
          </button>
        ) : (
          <span className="header-search-badge" aria-hidden="true">
            ⌘K
          </span>
        )}
      </div>

      {/* Header Action Controls */}
      <div className="header-actions" role="toolbar" aria-label="Global header actions">
        {/* 2. Download Button & Dropdown */}
        <div style={{ position: 'relative' }} ref={downloadMenuRef}>
          <button
            className="btn-header-download"
            onClick={() => {
              setShowDownloadMenu(!showDownloadMenu);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            title="Download or Export Tenders Data"
            aria-label="Export or download tenders data"
            aria-haspopup="true"
            aria-expanded={showDownloadMenu}
            disabled={isDownloading}
            type="button"
          >
            {isDownloading ? (
              <>
                <RefreshCw size={15} className="spin-icon" aria-hidden="true" />
                <span>{downloadingLabel || 'Downloading...'}</span>
              </>
            ) : (
              <>
                <Download size={15} aria-hidden="true" />
                <span>Download</span>
                <ChevronDown size={14} style={{ marginLeft: 3, opacity: 0.9 }} aria-hidden="true" />
              </>
            )}
          </button>

          {showDownloadMenu && (
            <div
              className="header-dropdown-menu"
              role="menu"
              aria-label="Download formats"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '230px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 110,
                padding: '0.5rem',
                animation: 'fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ padding: '0.35rem 0.6rem', fontSize: '0.675rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Export Options
              </div>

              {/* Option 1: Download CSV */}
              <button
                role="menuitem"
                onClick={handleDownloadCSV}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.55rem 0.65rem',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Table size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Download CSV</div>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Spreadsheet data (.csv)</div>
                </div>
              </button>

              {/* Option 2: Download PDF */}
              <button
                role="menuitem"
                onClick={handleDownloadPDF}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.55rem 0.65rem',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: '0.2rem',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Download PDF</div>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>Intelligence report (.pdf)</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* 4. Notification Bell Icon */}
        <div style={{ position: 'relative' }} ref={notificationMenuRef}>
          <button
            className="header-circle-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              setShowDownloadMenu(false);
            }}
            title="Notifications (3 Urgent Alerts)"
            aria-label="Notifications, 3 urgent alerts available"
            aria-haspopup="true"
            aria-expanded={showNotifications}
            type="button"
          >
            <Bell size={18} aria-hidden="true" />
            <span className="header-bell-badge" aria-hidden="true">3</span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="header-dropdown-menu"
              role="dialog"
              aria-label="Urgent notifications"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '330px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.85rem',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 100,
                padding: '0.85rem',
                animation: 'fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>Notifications</span>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid var(--danger-border)' }}>
                  3 Urgent
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {sampleNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/alerts');
                    }}
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderRadius: '0.6rem',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.6rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <AlertTriangle size={15} color={n.urgent ? 'var(--danger)' : 'var(--warning)'} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.25' }}>{n.title}</div>
                      <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/alerts');
                }}
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  padding: '0.45rem',
                  border: 'none',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontWeight: '700',
                  fontSize: '0.775rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease'
                }}
              >
                View All Alerts <ExternalLink size={13} />
              </button>
            </div>
          )}
        </div>

        {/* 5. Dark Mode Toggle */}
        <button
          className="header-circle-btn"
          onClick={toggleTheme}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          type="button"
        >
          {darkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>

        {/* 6. User Profile Card / Status Indicator */}
        <div style={{ position: 'relative' }} ref={profileMenuRef}>
          <div
            className={`header-user-profile ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowDownloadMenu(false);
            }}
            title={isAuthenticated ? `Active User: ${user.name || 'Admin'} (${user.role || 'Super Admin'})` : 'Guest Session (Click for Options)'}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={showProfileMenu}
            aria-label={isAuthenticated ? `User menu for ${user.name || 'Admin'}` : 'Guest user menu'}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowProfileMenu(!showProfileMenu);
              }
            }}
          >
            <div
              className="header-user-avatar"
              style={{
                backgroundColor: isAuthenticated ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              {isAuthenticated ? userInitial : <User size={16} />}
              <span
                className="header-user-status-dot"
                style={{
                  backgroundColor: isAuthenticated ? '#10B981' : '#94A3B8'
                }}
                aria-hidden="true"
              />
            </div>
            <div className="header-user-info">
              <span className="header-user-name">
                {isAuthenticated ? (user.name || 'S Sakishnu') : 'Guest User'}
              </span>
              <span className="header-user-role">
                {isAuthenticated ? (user.role || 'Super Admin') : 'Not Signed In'}
              </span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" style={{ marginLeft: 2 }} aria-hidden="true" />
          </div>

          {/* User Profile Menu Dropdown */}
          {showProfileMenu && (
            <div
              className="header-dropdown-menu"
              role="menu"
              aria-label="User profile options"
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '230px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.85rem',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 100,
                padding: '0.75rem',
                animation: 'fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {isAuthenticated ? (user.name || 'S Sakishnu') : 'Guest Session'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {isAuthenticated ? (user.email || 'sakishnu@tenderhub.org') : 'Sign in to access administration'}
                </div>
                <div style={{
                  display: 'inline-block',
                  marginTop: '6px',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  color: isAuthenticated ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: isAuthenticated ? 'var(--primary-light)' : 'var(--bg-subtle)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '0.25rem',
                  border: '1px solid var(--border-color)'
                }}>
                  {isAuthenticated ? (user.role || 'Super Admin') : 'Guest Mode'}
                </div>
              </div>

              <button
                role="menuitem"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate('/settings');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.5rem 0.6rem',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  borderRadius: '0.4rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease'
                }}
              >
                <Settings size={15} color="var(--text-muted)" aria-hidden="true" /> Account Settings
              </button>

              {/* In-Dropdown Action Toggle */}
              {isAuthenticated ? (
                <button
                  role="menuitem"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.5rem 0.6rem',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--danger)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    borderRadius: '0.4rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginTop: '0.2rem',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <LogOut size={15} aria-hidden="true" /> Log Out
                </button>
              ) : (
                <button
                  role="menuitem"
                  onClick={handleLogin}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    padding: '0.5rem 0.6rem',
                    border: 'none',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    borderRadius: '0.4rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginTop: '0.2rem',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <LogIn size={15} aria-hidden="true" /> Sign In
                </button>
              )}
            </div>
          )}
        </div>


        <div
          id="header-actions-portal"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        />
      </div>
    </header>
  );
}
