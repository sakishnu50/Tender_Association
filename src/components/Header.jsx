import React from 'react';
import { Search, Bell, ChevronDown, Sun, Moon } from 'lucide-react';

export default function Header({ searchVal, setSearchVal, activeTabTitle, darkMode, toggleTheme }) {
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)' }}>
          {activeTabTitle || 'Dashboard'}
        </h2>
        <div className="header-search">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search project, source, sector..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      </div>

      <div className="header-actions">
        {/* Dark / Light Theme Toggle Icon Button Only */}
        <button
          className="btn btn-outline"
          onClick={toggleTheme}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            padding: '0.4rem 0.6rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem'
          }}
        >
          {darkMode ? (
            <Sun size={18} color="#F59E0B" />
          ) : (
            <Moon size={18} color="#6366F1" />
          )}
        </button>

        <button className="btn btn-outline" style={{ padding: '0.4rem 0.6rem', position: 'relative' }}>
          <Bell size={18} color="var(--text-main)" />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            borderRadius: '9999px',
            backgroundColor: 'var(--danger)'
          }} />
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            X
          </div>
          <div className="user-info">
            <span className="user-name">XYZ</span>
            <span className="user-role">Admin</span>
          </div>
          <ChevronDown size={14} color="var(--text-muted)" />
        </div>
      </div>
    </header>
  );
}

