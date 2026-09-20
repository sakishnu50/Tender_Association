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
  ExternalLink,
  Menu
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
  filteredOpportunities = null,
  onRequestLogout,
  onMenuClick,
  onSelectOpportunity
}) {
  const navigate = useNavigate();
  const auth = useAuth();
  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const user = auth?.user || { name: 'Usera', role: 'Admin', email: 'usera@tenderhub.org' };
  const displayName = user?.name && user.name !== 'S Sakishnu' ? user.name : 'Usera';
  const displayRole = user?.role && user.role !== 'Super Admin' ? user.role : 'Admin';

  const inputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const downloadMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingLabel, setDownloadingLabel] = useState('');
  const [ariaAnnouncement, setAriaAnnouncement] = useState('');

  const effectiveData = filteredOpportunities || opportunities || mockOpportunities;
  const userInitial = displayName.charAt(0).toUpperCase() || 'U';

  // Real-time matched opportunities for quick search dropdown
  const matchingOpportunities = React.useMemo(() => {
    if (!searchVal || !searchVal.trim()) return [];
    const q = searchVal.trim().toLowerCase();
    const list = opportunities && opportunities.length > 0 ? opportunities : mockOpportunities;
    return list.filter((o) => {
      const name = (o.name || o.title || '').toLowerCase();
      const id = (o.id || '').toLowerCase();
      const sector = (o.sector || '').toLowerCase();
      const location = (o.location || o.country || '').toLowerCase();
      const source = (o.source || '').toLowerCase();
      return (
        name.includes(q) ||
        id.includes(q) ||
        sector.includes(q) ||
        location.includes(q) ||
        source.includes(q)
      );
    }).slice(0, 6);
  }, [searchVal, opportunities]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K focus, Escape clear)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        if (setSearchVal) setSearchVal('');
        setIsSearchOpen(false);
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
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
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
    <header className="top-header" role="banner">
      {/* Accessibility Announcement for Screen Readers */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {ariaAnnouncement}
      </div>

      {/* Top Header Navigation Bar (Mobile: Hamburger on left, Actions on right; Desktop: Actions on right) */}
      <div className="top-header-nav-bar">
        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          className="header-mobile-menu-btn"
          onClick={onMenuClick}
          title="Open Navigation Menu"
          aria-label="Open navigation menu"
          type="button"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        {/* Header Action Controls */}
        <div className="header-actions" role="toolbar" aria-label="Global header actions">
          {/* Refresh Button - immediately to the LEFT of the notification bell */}
          <button
            className="btn-header-refresh"
            onClick={handleRefreshClick}
            title="Refresh Dashboard Data"
            aria-label={isRefreshing ? 'Refreshing data...' : 'Refresh dashboard data'}
            disabled={isRefreshing}
            type="button"
          >
            <RefreshCw size={17} className={isRefreshing ? 'spin-icon' : ''} aria-hidden="true" />
          </button>

        {/* 2. Notification Bell Icon */}
        <div style={{ position: 'relative' }} className="relative" ref={notificationMenuRef}>
          <button
            className="header-circle-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
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
              className="header-dropdown-menu header-notifications-menu fixed top-16 right-4 left-4 sm:absolute sm:top-full sm:right-0 sm:left-auto sm:w-80 z-50 max-w-[calc(100vw-2rem)]"
              role="dialog"
              aria-label="Urgent notifications"
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.85rem',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 100,
                padding: '0.85rem',
                animation: 'fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                boxSizing: 'border-box'
              }}
            >
              <div className="max-w-full overflow-hidden" style={{ maxWidth: '100%', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>Notifications</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: '700', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-text)', padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid var(--danger-border)' }}>
                    3 Urgent
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', maxWidth: '100%', overflow: 'hidden' }}>
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
                        transition: 'all 0.15s ease',
                        minWidth: 0,
                        maxWidth: '100%'
                      }}
                    >
                      <AlertTriangle size={15} color={n.urgent ? 'var(--danger)' : 'var(--warning)'} style={{ marginTop: 2, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.25', wordBreak: 'break-word' }}>{n.title}</div>
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
            </div>
          )}
        </div>

        {/* 3. Light/Dark Mode Toggle */}
        <button
          className="header-circle-btn"
          onClick={toggleTheme}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          type="button"
        >
          {darkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>

        {/* 4. User Profile Section */}
        <div style={{ position: 'relative' }} ref={profileMenuRef}>
          <div
            className={`header-user-profile ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            title={isAuthenticated ? `Active User: ${displayName} (${displayRole})` : 'Guest Session (Click for Options)'}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={showProfileMenu}
            aria-label={`User menu for ${displayName}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowProfileMenu(!showProfileMenu);
              }
            }}
          >
            <div className="header-user-avatar">
              {userInitial}
            </div>
            <div className="header-user-info">
              <span className="header-user-name">
                {displayName}
              </span>
              <span className="header-user-role">
                {displayRole}
              </span>
            </div>
            <ChevronDown size={14} className="header-user-chevron" style={{ marginLeft: 2 }} aria-hidden="true" />
          </div>

          {/* User Profile Menu Dropdown */}
          {showProfileMenu && (
            <div
              className="header-dropdown-menu"
              role="menu"
              aria-label="User profile options"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
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
                  {displayName}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {user?.email || 'usera@tenderhub.org'}
                </div>
                <div style={{
                  display: 'inline-block',
                  marginTop: '6px',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  backgroundColor: 'var(--primary-light)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '0.25rem',
                  border: '1px solid var(--border-color)'
                }}>
                  {displayRole}
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
      </div>
    </div>

      {/* Real-Time Interactive Search Bar with Live Suggestions Dropdown */}
      <div
        ref={searchContainerRef}
        style={{
          position: 'relative',
          order: 1,
          width: '440px',
          maxWidth: '100%'
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsSearchOpen(false);
            if (searchVal?.trim()) {
              navigate('/opportunities');
            }
          }}
          className="header-search"
          role="search"
          style={{ width: '100%', margin: 0 }}
        >
          <Search size={16} className="header-search-icon" style={{ flexShrink: 0 }} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            placeholder={
              activeTab === 'opportunities' || activeTab === 'opp_details'
                ? 'Search opportunities, sectors, values...'
                : activeTab === 'calendar'
                ? 'Search events, submission deadlines...'
                : activeTab === 'consortium'
                ? 'Search partners, expertise, credentials...'
                : activeTab === 'sources'
                ? 'Search monitored portals, agencies...'
                : activeTab === 'offices'
                ? 'Search regional offices, locations...'
                : activeTab === 'users'
                ? 'Search users, roles, email accounts...'
                : activeTab === 'audit'
                ? 'Search audit logs, actions, records...'
                : activeTab === 'client_profile'
                ? 'Search client profile, past projects...'
                : activeTab === 'reports'
                ? 'Search analytics, export reports...'
                : 'Search tenders, projects, locations, sectors...'
            }
            value={searchVal || ''}
            onChange={(e) => {
              if (setSearchVal) setSearchVal(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setIsSearchOpen(false);
                if (matchingOpportunities.length === 1 && onSelectOpportunity) {
                  onSelectOpportunity(matchingOpportunities[0]);
                } else if (searchVal?.trim()) {
                  navigate('/opportunities');
                }
              }
            }}
            aria-label="Search content"
          />
          {searchVal ? (
            <button
              type="button"
              onClick={() => {
                if (setSearchVal) setSearchVal('');
                setIsSearchOpen(false);
                inputRef.current?.focus();
              }}
              className="header-search-clear-btn"
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                flexShrink: 0,
                color: 'var(--text-muted)'
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
        </form>

        {/* Live Search Suggestions & Matching Results Popover */}
        {isSearchOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 100,
              overflow: 'hidden',
              animation: 'fadeIn 0.15s ease',
              maxHeight: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {searchVal && searchVal.trim() ? (
              <>
                <div
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--bg-subtle)'
                  }}
                >
                  <span>Matching Tenders &amp; Opportunities</span>
                  <span style={{ color: 'var(--primary)' }}>{matchingOpportunities.length} found</span>
                </div>

                <div style={{ overflowY: 'auto', maxHeight: '280px' }}>
                  {matchingOpportunities.length === 0 ? (
                    <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)' }}>
                        No opportunities matching "{searchVal}"
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem' }}>
                        Try searching by tender name, state (e.g. Karnataka), sector, or ID
                      </p>
                    </div>
                  ) : (
                    matchingOpportunities.map((opp) => (
                      <div
                        key={opp.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          if (onSelectOpportunity) {
                            onSelectOpportunity(opp);
                          } else {
                            navigate(`/opportunities/details?id=${opp.id}`);
                          }
                        }}
                        style={{
                          padding: '0.65rem 0.85rem',
                          borderBottom: '1px solid var(--border-color)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '2px' }}>
                            <span
                              style={{
                                fontSize: '0.675rem',
                                fontWeight: '700',
                                color: 'var(--primary)',
                                backgroundColor: 'var(--primary-light)',
                                padding: '0.1rem 0.35rem',
                                borderRadius: '4px'
                              }}
                            >
                              {opp.id}
                            </span>
                            <span
                              style={{
                                fontSize: '0.825rem',
                                fontWeight: '600',
                                color: 'var(--text-main)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {opp.name}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', gap: '0.6rem' }}>
                            <span>{opp.source || 'Govt Portal'}</span>
                            <span>•</span>
                            <span>{opp.location || 'India'}</span>
                            <span>•</span>
                            <span>{opp.value || 'Value TBD'}</span>
                          </div>
                        </div>

                        {opp.aiScore && (
                          <div
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              color: 'var(--success-text)',
                              backgroundColor: 'var(--success-bg)',
                              border: '1px solid var(--success-border)',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '6px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {opp.aiScore} Match
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigate('/opportunities');
                  }}
                  style={{
                    padding: '0.6rem 0.85rem',
                    borderTop: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                >
                  <span>View all results in Opportunities List</span>
                  <span>↵ Press Enter</span>
                </div>
              </>
            ) : (
              <div style={{ padding: '0.85rem' }}>
                <div
                  style={{
                    fontSize: '0.725rem',
                    fontWeight: '700',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '0.5rem'
                  }}
                >
                  Popular Quick Searches
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {[
                    'Smart Grid',
                    'Highway',
                    'Water Supply',
                    'Metro Rail',
                    'Urban Infra',
                    'ADB',
                    'Karnataka',
                    'World Bank'
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => {
                        if (setSearchVal) setSearchVal(chip);
                        inputRef.current?.focus();
                      }}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: 'var(--text-main)',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '9999px',
                        padding: '0.25rem 0.65rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-main)';
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
