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
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { exportService } from '../services/exportService';
import { mockOpportunities } from '../data/mockData';

export default function Header({
  searchVal,
  setSearchVal,
  activeTabTitle,
  activeTab,
  darkMode,
  toggleTheme,
  onRefresh,
  onExportCSV,
  onDownloadPDF,
  opportunities = mockOpportunities,
  filteredOpportunities = null
}) {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user || { name: 'John Doe', role: 'Admin', email: 'johndoe@tender.org' };

  const inputRef = useRef(null);
  const downloadMenuRef = useRef(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingLabel, setDownloadingLabel] = useState('');

  const effectiveData = filteredOpportunities || opportunities || mockOpportunities;

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    } else {
      await new Promise((res) => setTimeout(res, 700));
    }
    setIsRefreshing(false);
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
    <header className="top-header">
      {/* Real-Time Search Bar */}
      <div className="header-search" style={{ position: 'relative' }}>
        <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search project name, tender ID, source, sector..."
          value={searchVal || ''}
          onChange={(e) => setSearchVal && setSearchVal(e.target.value)}
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
              padding: '2px'
            }}
            title="Clear search (Esc)"
          >
            <X size={14} />
          </button>
        ) : (
          <span style={{
            fontSize: '0.675rem',
            fontWeight: '600',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            padding: '0.1rem 0.4rem',
            borderRadius: '0.25rem',
            boxShadow: 'var(--shadow-xs)',
            pointerEvents: 'none'
          }}>
            ⌘K
          </span>
        )}
      </div>

      {/* Header Action Controls */}
      <div className="header-actions" style={{ gap: '0.65rem' }}>
        {/* 1. Refresh Button */}
        <button
          className="btn-header-action"
          onClick={handleRefreshClick}
          title="Refresh Dashboard Data"
          disabled={isRefreshing}
          style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <RefreshCw size={15} className={isRefreshing ? 'spin-icon' : ''} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>

        {/* 2. Combined Single Download Button with Dropdown (Positioned after Refresh) */}
        <div style={{ position: 'relative' }} ref={downloadMenuRef}>
          <button
            className="btn-header-blue"
            onClick={() => {
              setShowDownloadMenu(!showDownloadMenu);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            title="Download or Export Tenders Data"
            disabled={isDownloading}
            style={{
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            {isDownloading ? (
              <>
                <RefreshCw size={15} className="spin-icon" />
                <span>{downloadingLabel || 'Downloading...'}</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>Download</span>
                <ChevronDown size={13} style={{ marginLeft: 1, opacity: 0.85 }} />
              </>
            )}
          </button>

          {showDownloadMenu && (
            <div
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

        {/* 3. Notifications Bell Icon with Badge */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-btn-header"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              setShowDownloadMenu(false);
            }}
            title="Notifications (3 Urgent Alerts)"
            style={{ position: 'relative', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <Bell size={17} color="var(--text-main)" />
            <span className="notification-badge-count">3</span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
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

        {/* 4. Dark / Light Theme Toggle (Positioned before User Profile) */}
        <button
          className="icon-btn-header"
          onClick={toggleTheme}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            padding: '0.4rem 0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {darkMode ? (
            <Sun size={18} color="#F59E0B" />
          ) : (
            <Moon size={18} color="#6366F1" />
          )}
        </button>

        {/* 5. User Profile Avatar & Dropdown (On the far right) */}
        <div style={{ position: 'relative' }}>
          <div
            className="header-user-profile"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowDownloadMenu(false);
            }}
            title={`User Profile: ${user.name} (${user.role || 'Admin'})`}
            style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <div style={{ position: 'relative' }}>
              <div className="header-user-avatar">
                {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'JD'}
              </div>
              <span style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                border: '1.5px solid var(--bg-card)'
              }} />
            </div>
            <div className="header-user-info">
              <span className="header-user-name">{user.name || 'John Doe'}</span>
              <span className="header-user-role">{user.role || 'Admin'}</span>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" style={{ marginLeft: 2 }} />
          </div>

          {/* User Profile Menu Dropdown */}
          {showProfileMenu && (
            <div
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
                <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-main)' }}>{user.name || 'John Doe'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user.email || 'johndoe@tender.org'}</div>
                <div style={{
                  display: 'inline-block',
                  marginTop: '6px',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '0.25rem'
                }}>
                  {user.role || 'Super Admin'}
                </div>
              </div>
              <button
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
                <Settings size={15} color="var(--text-muted)" /> Account Settings
              </button>
              {auth?.logout && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    auth.logout();
                    navigate('/login');
                  }}
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
                  <LogOut size={15} /> Log Out
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

