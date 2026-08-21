import React from 'react';
import { mockOffices } from '../data/mockData';

export default function OfficesView() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Offices Overview</h2>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Offices: <strong>11</strong></span>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Office</th>
                <th>Total Opportunities</th>
                <th>Pursued</th>
                <th>Declined</th>
                <th>High Priority</th>
              </tr>
            </thead>
            <tbody>
              {mockOffices.map((off, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '700' }}>{off.name}</td>
                  <td style={{ fontWeight: '600' }}>{off.total}</td>
                  <td style={{ color: 'var(--success)', fontWeight: '600' }}>{off.pursued}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{off.declined}</td>
                  <td>
                    <span className="badge badge-priority">{off.highPriority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
