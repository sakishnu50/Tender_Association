// src/components/AuditTrail/AuditTable.jsx

import React from 'react';
import { Pencil, Eye } from 'lucide-react';
import styles from './AuditTrail.module.css';

export default function AuditTable({ logs, onRowClick, onEdit }) {
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return styles.priorityHigh;
      case 'Low':
        return styles.priorityLow;
      case 'Medium':
      default:
        return styles.priorityMedium;
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.auditTable}>
        <thead>
          <tr>
            <th className={styles.th}>OPPORTUNITY ID</th>
            <th className={styles.th}>OPPORTUNITY</th>
            <th className={styles.th}>USER</th>
            <th className={styles.th}>TIMESTAMP</th>
            <th className={styles.th}>DATE</th>
            <th className={styles.th}>PRIORITY</th>
            <th className={styles.th} style={{ textAlign: 'center' }}>EDIT</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr
              key={log.id || `${log.opportunityId}-${index}`}
              className={styles.tr}
              onClick={() => onRowClick && onRowClick(log)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onRowClick && onRowClick(log);
                }
              }}
            >
              {/* Opportunity ID */}
              <td className={styles.td}>
                <span className={styles.opportunityIdBadge}>
                  {log.opportunityId || log.recordId || 'OP-001'}
                </span>
              </td>

              {/* Opportunity */}
              <td className={styles.td}>
                <div className={styles.opportunityNameWrapper}>
                  <strong className={styles.opportunityTitle}>
                    {log.opportunity || log.opportunityTitle || log.recordName || 'Untitled Opportunity'}
                  </strong>
                  {log.action && log.action !== 'Priority Changed' && (
                    <span className={styles.actionSubtext}>{log.action}</span>
                  )}
                </div>
              </td>

              {/* User */}
              <td className={styles.td}>
                <div className={styles.userCell}>
                  <span className={styles.userName}>{log.user || 'Admin'}</span>
                  {log.userRole && <span className={styles.userRoleTag}>{log.userRole}</span>}
                </div>
              </td>

              {/* Timestamp */}
              <td className={styles.td}>
                <span className={styles.timestampCell}>{log.timestamp}</span>
              </td>

              {/* Date */}
              <td className={styles.td}>
                <span className={styles.dateCell}>{log.date || '08-Sep-2026'}</span>
              </td>

              {/* Current Priority */}
              <td className={styles.td}>
                <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(log.currentPriority)}`}>
                  {log.currentPriority || 'Medium'}
                </span>
              </td>

              {/* Edit Action */}
              <td className={styles.td} style={{ textAlign: 'center' }}>
                <div className={styles.actionsContainer} onClick={(e) => e.stopPropagation()}>
                  <button
                    className={styles.editButton}
                    type="button"
                    title={`Edit priority for ${log.opportunityId}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit && onEdit(log);
                    }}
                  >
                    <Pencil size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    className={styles.viewIconBtn}
                    type="button"
                    title="View details"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick && onRowClick(log);
                    }}
                  >
                    <Eye size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
