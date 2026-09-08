import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuditTrail } from '../../hooks/useApiQueries';
import { getAuditLogById, INITIAL_AUDIT_LOGS, formatAuditDate, formatAuditTime } from '../../services/auditService';
import styles from './AuditTrail.module.css';

export default function AuditRecordDetailsPage() {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const { data: logs = [] } = useAuditTrail();

  const record = useMemo(() => {
    const fromQuery = Array.isArray(logs) ? logs.find((log) => log.id === auditId) : null;
    if (fromQuery) return fromQuery;

    const fromStorage = getAuditLogById(auditId);
    if (fromStorage) return fromStorage;

    return INITIAL_AUDIT_LOGS.find((log) => log.id === auditId) || null;
  }, [auditId, logs]);

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

  if (!record) {
    return (
      <div className={styles.page}>
        <button
          type="button"
          className={styles.backLink}
          onClick={() => navigate('/audit')}
          style={{ marginBottom: '1rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Audit Trail</span>
        </button>
        <div className={styles.emptyState}>
          <p className={styles.emptyMessage}>Audit record not found.</p>
          <p className={styles.emptyHint}>The selected record could not be loaded.</p>
        </div>
      </div>
    );
  }

  const prevPriority = getPreviousPriority(record);
  const newPriority = getNewPriority(record);
  const description = getDescription(record, prevPriority, newPriority);
  const timeStr = getTimeString(record);
  const dateStr = getDateString(record);

  return (
    <div className={styles.fullscreenView}>
      <header className={styles.fullscreenHeader}>
        <button className={styles.backLink} onClick={() => navigate('/audit')} type="button">
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
              <strong>{record.action || 'Priority Changed'}</strong>
            </div>
          </div>
        </section>

        {/* Opportunity */}
        <section className={styles.detailCard}>
          <div className={styles.sectionLabel}>Opportunity</div>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Name</span>
              <strong>{record.opportunity || record.opportunityTitle || record.recordName || 'Untitled Opportunity'}</strong>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>ID</span>
              <strong>{record.opportunityId || record.recordId || 'OPP-001'}</strong>
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
              <strong>{record.user || record.userName || 'XYZ'}</strong>
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
              <strong>{record.id || 'AUD-1788852383462-lwsa'}</strong>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.label}>Source</span>
              <strong>{record.source || 'Audit Trail'}</strong>
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
  );
}
