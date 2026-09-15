import React, { useState, useEffect, useMemo, useRef } from 'react';
import { mockAuditTrail } from '../data/mockData';
import { useAuditTrail } from '../hooks/useApiQueries';

export default function AuditTrailView({ searchVal, setSearchVal }) {
  const { data: auditTrailData } = useAuditTrail();
  const logs = auditTrailData || mockAuditTrail;

  // ---- State for filters ----
  const [selectedUser, setSelectedUser] = useState('All Users');
  const [selectedAction, setSelectedAction] = useState('All Actions');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  // Ref for click‑outside handling
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);

  // Unique users and actions for dropdowns
  const users = useMemo(() => {
    const set = new Set();
    logs.forEach(l => set.add(l.user));
    return ['All Users', ...Array.from(set)];
  }, [logs]);

  const actions = useMemo(() => {
    const set = new Set();
    logs.forEach(l => set.add(l.action));
    return ['All Actions', ...Array.from(set)];
  }, [logs]);

  // Filter pipeline
  const filteredLogs = useMemo(() => {
    const term = searchVal.trim().toLowerCase();
    return logs.filter(l => {
      // user filter
      if (selectedUser !== 'All Users' && l.user !== selectedUser) return false;
      // action filter
      if (selectedAction !== 'All Actions' && l.action !== selectedAction) return false;
      // search filter
      if (term) {
        const fields = [l.user, l.action, l.details, l.module, l.resourceName, l.source, l.sector, l.ip];
        const match = fields.some(f => (f || '').toString().toLowerCase().includes(term));
        if (!match) return false;
      }
      return true;
    });
  }, [logs, searchVal, selectedUser, selectedAction]);

  // Suggestions based on raw logs (ignore other filters)
  const suggestions = useMemo(() => {
    if (!searchVal.trim()) return [];
    const term = searchVal.trim().toLowerCase();
    const matches = logs.filter(l => {
      const fields = [l.user, l.action, l.details, l.module, l.resourceName, l.source, l.sector, l.ip];
      return fields.some(f => (f || '').toString().toLowerCase().includes(term));
    });
    return matches.slice(0, 8);
  }, [logs, searchVal]);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setHighlightIdx(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation for suggestions (global search input)
  useEffect(() => {
    const inputEl = document.getElementById('global-search-input');
    if (!inputEl) return undefined;
    const handler = (e) => {
      if (!showSuggestions) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIdx(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIdx(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightIdx >= 0 && highlightIdx < suggestions.length) {
          applySuggestion(suggestions[highlightIdx]);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setHighlightIdx(-1);
      }
    };
    inputEl.addEventListener('keydown', handler);
    return () => inputEl.removeEventListener('keydown', handler);
  }, [showSuggestions, suggestions, highlightIdx]);

  function applySuggestion(item) {
    // set search term to a representative string (e.g., user or details)
    setSearchVal(item.user + ' ' + item.action + ' ' + (item.details || ''));
    setShowSuggestions(false);
    setHighlightIdx(-1);
  }

  // When search term changes, open suggestions if not empty
  useEffect(() => {
    if (searchVal && searchVal.trim().length > 0) {
      setShowSuggestions(true);
      setHighlightIdx(-1);
    } else {
      setShowSuggestions(false);
      setHighlightIdx(-1);
    }
  }, [searchVal]);

  // New state for dropdown positioning
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 0 });

  // Update dropdown position when suggestions open
  useEffect(() => {
    if (showSuggestions) {
      const inputEl = document.getElementById('global-search-input');
      if (inputEl) {
        const rect = inputEl.getBoundingClientRect();
        setDropdownStyle({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    }
  }, [showSuggestions]);

  return (
    <div className="page-container" ref={wrapperRef}>
      <div className="page-header">
        <h2 className="page-title">Audit Trail</h2>
      </div>

      {/* Search suggestions dropdown anchored to global header search */}
      {showSuggestions && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: dropdownStyle.top,
            left: dropdownStyle.left,
            width: dropdownStyle.width,
            maxHeight: '400px',
            overflowY: 'auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            zIndex: 999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{
            padding: '8px 12px',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            borderBottom: '1px solid var(--border-color)'
          }}>
            SEARCH RESULTS · {suggestions.length}
          </div>
          {suggestions.length === 0 && (
            <div style={{ padding: '12px', color: 'var(--text-muted)' }}>
              No matching activities found
            </div>
          )}
          {suggestions.slice(0, 8).map((s, idx) => (
            <div
              key={idx}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                background: idx === highlightIdx ? 'var(--bg-hover)' : 'transparent',
                borderBottom: idx < Math.min(suggestions.length, 8) - 1 ? '1px solid var(--border-color)' : 'none',
              }}
              onMouseEnter={() => setHighlightIdx(idx)}
              onClick={() => applySuggestion(s)}
            >
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.user}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.action}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.details}
              </div>
            </div>
          ))}
          {suggestions.length > 8 && (
            <div
              style={{
                padding: '8px 12px',
                fontSize: '0.75rem',
                color: 'var(--link-color)',
                cursor: 'pointer',
                textAlign: 'right',
                borderTop: '1px solid var(--border-color)'
              }}
              onClick={() => {
                setSearchVal(searchVal);
                setShowSuggestions(false);
              }}
            >
              View all results for "{searchVal}" →
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
        {/* User Filter */}
        <select
          style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}
          value={selectedUser}
          onChange={e => { setSelectedUser(e.target.value); }}
        >
          {users.map((u, i) => (
            <option key={i}>{u}</option>
          ))}
        </select>

        {/* Action Filter */}
        <select
          style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}
          value={selectedAction}
          onChange={e => { setSelectedAction(e.target.value); }}
        >
          {actions.map((a, i) => (
            <option key={i}>{a}</option>
          ))}
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600' }}>{log.user}</td>
                  <td>
                    <span className="badge badge-outline" style={{ border: '1px solid var(--border-color)' }}>
                      {log.action}
                    </span>
                  </td>
                  <td>{log.details}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
