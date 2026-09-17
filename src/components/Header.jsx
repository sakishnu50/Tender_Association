import React from 'react';
import { Search, Bell, ChevronDown, Sun, Moon, Menu, RefreshCw } from 'lucide-react';

export default function Header({ searchVal, setSearchVal, activeTabTitle, darkMode, toggleTheme, onMenuClick, onRefresh }) {
  return (
    <header className="top-header mobile-responsive-header">
      
      {/* Title Group */}
      <div className="header-title-group">
        <button className="mobile-menu-btn btn btn-outline" onClick={onMenuClick} style={{ padding: '0.4rem', border: 'none' }}>
          <Menu size={20} />
        </button>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)', whiteSpace: 'nowrap', margin: 0 }}>
          {activeTabTitle}
        </h2>
      </div>
      
      {/* Search Bar */}
      <div className="header-search">
        <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search project, source, sector..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          style={{ minWidth: 0, width: '100%' }}
        />
      </div>

      {/* Action Icons */}
      <div className="header-icons">
        <button
          className="btn btn-outline"
          onClick={onRefresh}
          title="Refresh Data"
        >
          <RefreshCw size={18} color="var(--text-main)" />
        </button>

        <button 
          className="btn btn-outline" 
          style={{ position: 'relative' }}
        >
          <Bell size={18} color="var(--text-main)" />
          <span style={{
            position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px',
            borderRadius: '9999px', backgroundColor: 'var(--danger)'
          }} />
        </button>

        <button
          className="btn btn-outline"
          onClick={toggleTheme}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} color="#F59E0B" /> : <Moon size={18} color="#6366F1" />}
        </button>

        <div id="header-actions-portal" style={{ display: 'contents' }} />
      </div>

      {/* Profile */}
      <div className="user-profile header-profile">
        <div className="user-avatar" style={{
          width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem'
        }}>
          X
        </div>
        <div className="user-info" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="user-name" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>XYZ</span>
          <span className="user-role" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Admin</span>
        </div>
        <ChevronDown size={14} color="var(--text-muted)" />
      </div>

    </header>
  );
}

