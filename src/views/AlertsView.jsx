import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { mockAlerts } from '../data/mockData';

export default function AlertsView({ onSelectProject }) {
  const [filter, setFilter] = useState('All');

  const filteredAlerts = mockAlerts.filter(a => {
    if (filter === 'High Priority') return a.type === 'High Priority';
    if (filter === 'Deadline') return a.type === 'Deadline';
    if (filter === 'New') return a.type === 'New';
    return true;
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Alerts</h2>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'High Priority', 'Deadline', 'New'].map((tab) => (
            <button
              key={tab}
              className={`btn ${filter === tab ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              borderLeft: `4px solid ${
                alert.type === 'High Priority' ? 'var(--danger)' :
                alert.type === 'Deadline' ? 'var(--warning)' : 'var(--primary)'
              }`
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${
                  alert.type === 'High Priority' ? 'badge-priority' :
                  alert.type === 'Deadline' ? 'badge-warning' : 'badge-info'
                }`}>
                  {alert.priority}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {alert.project}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem' }}>
                <span>AI Score: <strong>{alert.aiScore}</strong></span>
                <span>Source: <strong>{alert.source}</strong></span>
                <span style={{ color: alert.urgent ? 'var(--danger)' : 'var(--text-muted)', fontWeight: alert.urgent ? '700' : '500' }}>
                  {alert.deadlineText}
                </span>
              </div>
            </div>

            <button className="btn btn-outline" style={{ fontSize: '0.75rem' }} onClick={onSelectProject}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
