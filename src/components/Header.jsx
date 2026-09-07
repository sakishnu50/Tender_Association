import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Sun, Moon } from 'lucide-react';
import './HeaderProfile.css';

export default function Header({ searchVal, setSearchVal, activeTabTitle, darkMode, toggleTheme }) {
  // Notification state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New comment', description: 'A new comment was added.', time: '2m ago', read: false },
    { id: 2, title: 'Project updated', description: 'Project details were updated.', time: '15m ago', read: false },
    { id: 3, title: 'Alert', description: 'High priority alert.', time: '1h ago', read: false },
  ]);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setNotificationsOpen(prev => !prev);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !bellRef.current?.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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


        <button ref={bellRef} className="btn btn-outline" style={{ padding: '0.4rem 0.6rem', position: 'relative' }} onClick={toggleNotifications} title="Notifications">
          <Bell size={18} color="var(--text-main)" />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              minWidth: '16px',
              height: '16px',
              padding: '0 4px',
              borderRadius: '9999px',
              backgroundColor: 'var(--danger)',
              color: '#fff',
              fontSize: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>{unreadCount}</span>
          )}
        </button>
        {notificationsOpen && (
          <div ref={dropdownRef} className="notification-dropdown">
            <div className="notification-header">
              <span className="notification-title">Notifications</span>
              <button className="btn btn-outline btn-sm" onClick={markAllAsRead}>Mark all as read</button>
            </div>
            <ul className="notification-list">
              {notifications.map((n) => (
                <li key={n.id} className={`notification-item ${n.read ? '' : 'unread'}`} onClick={() => markAsRead(n.id)}>
                  <div className="notification-content">
                    <strong className="notification-item-title">{n.title}</strong>
                    <p className="notification-item-desc">{n.description}</p>
                  </div>
                  <span className="notification-time">{n.time}</span>
                </li>
              ))}
            </ul>
            <div className="notification-footer">
              <a href="#" className="view-all-link">View all notifications</a>
            </div>
          </div>
        )}
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

