import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  opportunities,
  filteredOpportunities = null
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const user = auth?.user || { name: 'XYZ', role: 'Admin', email: 'xyz10@gmail.com' };
  const userName = user?.name || (user?.email ? user.email.split('@')[0] : 'XYZ');
  const userRole = user?.role || 'Admin';
  const userEmail = user?.email || 'xyz10@gmail.com';
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'X';

  const profileMenuRef = useRef(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Click outside listener for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
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

  const isOpportunitySection =
    activeTab === 'opportunities' ||
    activeTab === 'opp_details' ||
    location.pathname.startsWith('/opportunities');

  // Opportunities Section Header
  if (isOpportunitySection) {
    return (
      <header className="top-header">
        {/* Header Title */}
        <div className="header-left">
          <h1 className="page-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {activeTab === 'opp_details' ? 'Opportunity Details' : 'Opportunities'}
          </h1>
        </div>

        {/* Header Action Controls */}
        <div className="header-actions" style={{ gap: '0.65rem' }}>
          {/* Dark / Light Theme Toggle */}
          <button
            className="icon-btn-header"
            onClick={toggleTheme}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <Sun size={18} color="#F59E0B" />
            ) : (
              <Moon size={18} color="#6366F1" />
            )}
          </button>

          {/* User Profile Avatar & Dropdown */}
          <div style={{ position: 'relative' }} ref={profileMenuRef}>
            <div
              className="header-user-profile"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              title={`User Profile: ${userName} (${userRole})`}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div className="header-user-avatar">
                  {userInitial}
                </div>
                <span style={{
                  position: 'absolute',
                  bottom: '-1px',
                  right: '-1px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  border: '1.5px solid var(--bg-card)'
                }} />
              </div>
              <div className="header-user-info">
                <span className="header-user-name">{userName}</span>
                <span className="header-user-role">{userRole}</span>
              </div>
              <ChevronDown
                size={14}
                color="var(--text-muted)"
                style={{
                  transition: 'transform 0.2s ease',
                  transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
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
                  <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-main)' }}>{userName}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{userEmail}</div>
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
                    {userRole}
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

  // Header for all other sections (Dashboard, Calendar, Alerts, Consortium, Reports, etc.)
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
          {activeTabTitle || 'Dashboard'}
        </h2>
        <div className="header-search">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search project, source, sector..."
            value={searchVal || ''}
            onChange={(e) => setSearchVal && setSearchVal(e.target.value)}
          />
        </div>
      </div>

      <div className="header-actions" style={{ gap: '0.65rem' }}>
        {/* Dark / Light Theme Toggle */}
        <button
          className="header-circle-btn"
          onClick={toggleTheme}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>

        {/* Notifications Bell */}
        <button
          className="icon-btn-header"
          onClick={() => navigate('/alerts')}
          style={{ position: 'relative' }}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} color="var(--text-main)" />
          <span style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--danger)',
            border: '1.5px solid var(--bg-card)'
          }} />
        </button>

        {/* User Profile Avatar with dropdown */}
        <div style={{ position: 'relative' }} ref={profileMenuRef}>
          <div
            className="header-user-profile"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            title={`User Profile: ${userName} (${userRole})`}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div className="header-user-avatar">
                {userInitial}
              </div>
              <span style={{
                position: 'absolute',
                bottom: '-1px',
                right: '-1px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                border: '1.5px solid var(--bg-card)'
              }} />
            </div>
            <div className="header-user-info">
              <span className="header-user-name">{userName}</span>
              <span className="header-user-role">{userRole}</span>
            </div>
            <ChevronDown
              size={14}
              color="var(--text-muted)"
              style={{
                transition: 'transform 0.2s ease',
                transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
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
                <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-main)' }}>{userName}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{userEmail}</div>
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
                  {userRole}
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
