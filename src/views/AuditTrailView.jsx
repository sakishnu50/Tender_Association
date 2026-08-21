import React from 'react';
import { mockAuditTrail } from '../data/mockData';

export default function AuditTrailView() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Audit Trail</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
            <option>All Users</option>
          </select>
          <select style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
            <option>All Actions</option>
          </select>
        </div>
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
              {mockAuditTrail.map((log, idx) => (
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
