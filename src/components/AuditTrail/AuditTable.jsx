// src/components/AuditTrail/AuditTable.jsx

import React from 'react';
import { Eye } from 'lucide-react';
import styles from './AuditTrail.module.css';

export default function AuditTable({ logs, onRowClick }) {
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'HIGH':
        return styles.priorityHigh;
      case 'MEDIUM':
        return styles.priorityMedium;
      case 'LOW':
        return styles.priorityLow;
      default:
        return '';
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.auditTable}>
        <thead>
          <tr>
            <th className={styles.th}>TIMESTAMP</th>
            <th className={styles.th}>USER</th>
            <th className={styles.th}>ACTION</th>
            <th className={styles.th}>OPPORTUNITY</th>
            <th className={styles.th}>CHANGE</th>
            <th className={styles.th}>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr
              key={log.id || log.opportunityId || index}
              className={styles.tr}
              onClick={() => onRowClick(log)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onRowClick(log);
                }
              }}
            >
              <td className={styles.td}>{log.timestamp}</td>
              <td className={styles.td}>{log.user}</td>
              <td className={styles.td}>{log.action}</td>
              <td className={styles.td}>{log.opportunity}</td>
              <td className={styles.td}>
                <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(log.change)}`}>{log.change}</span>
              </td>
              <td className={styles.td}>
                <button
                  className={styles.viewButton}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRowClick(log);
                  }}
                >
                  <Eye size={12} />
                  <span>View</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
