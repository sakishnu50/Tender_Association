// src/components/AuditTrail/AuditDetailsDrawer.jsx

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { formatAuditDate, formatAuditTime } from '../../services/auditService';
import styles from './AuditTrail.module.css';

export default function AuditDetailsDrawer({ log, onClose }) {
  if (!log) return null;

  const getPriorityBadgeClass = (priority) => {
    const p = String(priority || '').trim().toUpperCase();
    switch (p) {
      case 'HIGH':
        return styles.priorityHigh;
      case 'MEDIUM':
        return styles.priorityMedium;
      case 'LOW':
        return styles.priorityLow;
      default:
        return styles.priorityMedium;
    }
  };

  const getPreviousPriority = (item) => {
    if (!item) return '—';
    if (item.previousPriority && item.previousPriority !== '—') return item.previousPriority;
    if (item.previousValue && item.previousValue !== '—') return item.previousValue;
    if (item.change && item.change.includes('→')) {
      const parts = item.change.split('→');
      return parts[0].trim();
    }
    return '—';
  };

  const getNewPriority = (item) => {
    if (!item) return 'Medium';
    if (item.newPriority) return item.newPriority;
    if (item.newValue) return item.newValue;
    if (item.change && item.change.includes('→')) {
      const parts = item.change.split('→');
      return parts[1].trim();
    }
    if (item.change) return item.change.trim();
    if (item.priority) return item.priority.trim();
    return 'Medium';
  };

  const getDescription = (item, prev, next) => {
    if (!item) return 'No change details available.';
    if (item.details) return item.details;
    if (item.action === 'Priority Changed' || (item.change && item.change.includes('→'))) {
      if (prev && prev !== '—' && next && next !== '—') {
        return `Priority changed: ${prev} → ${next}`;
      }
      return `Priority changed: ${item.change || next}`;
    }
    if (item.action === 'AI score generated') {
      return `AI-generated score evaluated and classified as ${String(next || 'medium').toLowerCase()} priority.`;
    }
    return `Opportunity detected and classified as a ${String(next || 'medium').toLowerCase()}-priority opportunity.`;
  };

  const getTimeString = (item) => {
    if (!item) return '12:56 PM';
    if (item.timestamp) {
      if (item.timestamp.includes('·')) {
        return item.timestamp.split('·')[1].trim();
      }
      return item.timestamp;
    }
    if (item.createdAt) {
      return formatAuditTime(item.createdAt);
    }
    return '12:56 PM';
  };

  const getDateString = (item) => {
    if (!item) return '08-Sep-2026';
    if (item.date) return item.date;
    if (item.timestamp && item.timestamp.includes('·')) {
      return item.timestamp.split('·')[0].trim();
    }
    if (item.createdAt) {
      return formatAuditDate(item.createdAt);
    }
    return '08-Sep-2026';
  };

  const prevPriority = getPreviousPriority(log);
  const newPriority = getNewPriority(log);
  const description = getDescription(log, prevPriority, newPriority);
  const timeStr = getTimeString(log);
  const dateStr = getDateString(log);

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
            <p className={styles.detailSubtitle}>A detailed record of an activity and change recorded in the audit trail.</p>
          </div>

          {/* Activity */}
          <section className={styles.detailCard}>
            <div className={styles.sectionLabel}>Activity</div>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <strong>{log.action || 'Priority Changed'}</strong>
              </div>
            </div>
          </section>

          {/* Opportunity */}
          <section className={styles.detailCard}>
            <div className={styles.sectionLabel}>Opportunity</div>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Name</span>
                <strong>{log.opportunity || log.opportunityTitle || log.recordName || 'Untitled Opportunity'}</strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>ID</span>
                <strong>{log.opportunityId || log.recordId || 'OPP-001'}</strong>
              </div>
            </div>
          </section>

          {/* Change */}
          <section className={styles.detailCard}>
            <div className={styles.sectionLabel}>Change</div>
            <div className={styles.changeGrid}>
              <div className={styles.changeItem}>
                <span className={styles.label}>Previous Priority</span>
                {prevPriority && prevPriority !== '—' ? (
                  <div>
                    <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(prevPriority)}`}>
                      {prevPriority}
                    </span>
                  </div>
                ) : (
                  <strong>—</strong>
                )}
              </div>
              <div className={styles.changeItem}>
                <span className={styles.label}>New Priority</span>
                {newPriority && newPriority !== '—' ? (
                  <div>
                    <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(newPriority)}`}>
                      {newPriority}
                    </span>
                  </div>
                ) : (
                  <strong>—</strong>
                )}
              </div>
              <div className={styles.changeItemWide}>
                <span className={styles.label}>Description</span>
                <strong>{description}</strong>
              </div>
            </div>
          </section>

          {/* Performed By */}
          <section className={styles.detailCard}>
            <div className={styles.sectionLabel}>Performed By</div>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.label}>User</span>
                <strong>{log.user || log.userName || 'XYZ'}</strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Timestamp</span>
                <strong>{timeStr}</strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Date</span>
                <strong>{dateStr}</strong>
              </div>
            </div>
          </section>

          {/* Record Metadata */}
          <section className={styles.detailCard}>
            <div className={styles.sectionLabel}>Record Metadata</div>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Record ID</span>
                <strong>{log.id || 'AUD-1788852383462-lwsa'}</strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Source</span>
                <strong>{log.source || 'Audit Trail'}</strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Status</span>
                <strong>Read-only</strong>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Created</span>
                <strong>{timeStr}</strong>
              </div>
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
