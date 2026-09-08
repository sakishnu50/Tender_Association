// src/components/AuditTrail/AuditDetailsDrawer.jsx

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './AuditTrail.module.css';

export default function AuditDetailsDrawer({ log, onClose, relatedLogs = [] }) {
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

  const getDescription = (record) => {
    if (record.action === 'AI score generated') {
      return `AI-generated score evaluated and classified as ${record.change?.toLowerCase() || 'medium'} priority.`;
    }
    return `Opportunity detected and classified as a ${record.change?.toLowerCase() || 'medium'}-priority opportunity.`;
  };

  const timelineEntries = (relatedLogs.length ? relatedLogs : [log])
    .slice()
    .sort((a, b) => {
      const left = a.timestamp || '';
      const right = b.timestamp || '';
      return left.localeCompare(right);
    });

  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.fullscreenView} onClick={(event) => event.stopPropagation()}>
        <header className={styles.fullscreenHeader}>
          <button className={styles.backLink} onClick={onClose} type="button">
            <ArrowLeft size={16} />
            <span>Back to Audit Trail</span>
          </button>

          <div className={styles.headerRight}>
            <span className={styles.readOnlyBadge}>Read-only</span>
          </div>
        </header>

        <div className={styles.fullscreenContent}>
          <div className={styles.pageTitleRow}>
            <h2>Audit Record Details</h2>
          </div>

          <section className={styles.detailCard}>
            <div className={styles.sectionLabel}>Audit Record</div>

            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Activity</span>
                <strong>{log.action}</strong>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.label}>Timestamp</span>
                <strong>{log.timestamp}</strong>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.label}>User</span>
                <strong>{log.user}</strong>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.label}>Opportunity</span>
                <strong>{log.opportunity}</strong>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.label}>Opportunity ID</span>
                <strong>{log.opportunityId}</strong>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.label}>Change</span>
                <strong>
                  <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(log.change)}`}>{log.change}</span>
                </strong>
              </div>
            </div>
          </section>

          <section className={styles.detailCard}>
            <div className={styles.sectionLabel}>Change Details</div>
            <div className={styles.changeGrid}>
              <div className={styles.changeItem}>
                <span className={styles.label}>Previous Value</span>
                <strong>—</strong>
              </div>
              <div className={styles.changeItem}>
                <span className={styles.label}>New Value</span>
                <strong>{log.change}</strong>
              </div>
              <div className={styles.changeItemWide}>
                <span className={styles.label}>Description</span>
                <strong>{getDescription(log)}</strong>
              </div>
            </div>
          </section>

          <section className={styles.detailCard}>
            <div className={styles.sectionLabel}>Opportunity Information</div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Opportunity Name</span>
                <strong>{log.opportunity}</strong>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Opportunity ID</span>
                <strong>{log.opportunityId}</strong>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Action</span>
                <strong>{log.action}</strong>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Priority</span>
                <strong>
                  <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(log.change)}`}>{log.change}</span>
                </strong>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>User</span>
                <strong>{log.user}</strong>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Timestamp</span>
                <strong>{log.timestamp}</strong>
              </div>
            </div>
          </section>

          <section className={styles.detailCard}>
            <div className={styles.sectionLabel}>Activity Timeline</div>
            <div className={styles.timelineList}>
              {timelineEntries.map((entry, index) => (
                <div className={styles.timelineEntry} key={`${entry.opportunityId}-${index}`}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineStamp}>{entry.timestamp}</div>
                    <div className={styles.timelineAction}>{entry.action}</div>
                    <div className={styles.timelineMeta}>{entry.user} · {entry.opportunity}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className={styles.readOnlyFooter}>
            This audit record is read-only and cannot be modified.
          </div>
        </div>
      </div>
    </div>
  );
}
