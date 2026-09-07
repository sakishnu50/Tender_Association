import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuditTrail } from '../../hooks/useApiQueries';
import { getAuditLogById, INITIAL_AUDIT_LOGS } from '../../services/auditService';
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

  const getDescription = (entry) => {
    if (!entry) return 'No change details available.';
    if (entry.action === 'AI score generated') {
      return `AI-generated score evaluated and classified as ${String(entry.change || 'medium').toLowerCase()} priority.`;
    }
    return `Opportunity detected and classified as a ${String(entry.change || 'medium').toLowerCase()}-priority opportunity.`;
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

  const timelineEntries = [record];

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

        <section className={styles.detailCard}>
          <div className={styles.sectionLabel}>Audit Activity</div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Activity</span>
              <strong>{record.action}</strong>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Timestamp</span>
              <strong>{record.timestamp}</strong>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>User</span>
              <strong>{record.user}</strong>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Opportunity</span>
              <strong>{record.opportunity}</strong>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Opportunity ID</span>
              <strong>{record.opportunityId}</strong>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Change</span>
              <strong>
                <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(record.change)}`}>
                  {record.change}
                </span>
              </strong>
            </div>
          </div>
        </section>

        <section className={styles.detailCard}>
          <div className={styles.sectionLabel}>Change Details</div>
          <div className={styles.changeGrid}>
            <div className={styles.changeItem}>
              <span className={styles.label}>Action</span>
              <strong>{record.action}</strong>
            </div>
            <div className={styles.changeItem}>
              <span className={styles.label}>Previous Value</span>
              <strong>—</strong>
            </div>
            <div className={styles.changeItem}>
              <span className={styles.label}>New Value</span>
              <strong>{record.change}</strong>
            </div>
            <div className={styles.changeItemWide}>
              <span className={styles.label}>Description</span>
              <strong>{getDescription(record)}</strong>
            </div>
          </div>
        </section>

        <section className={styles.detailCard}>
          <div className={styles.sectionLabel}>Opportunity Information</div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Opportunity Name</span>
              <strong>{record.opportunity}</strong>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Opportunity ID</span>
              <strong>{record.opportunityId}</strong>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Action</span>
              <strong>{record.action}</strong>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Priority</span>
              <strong>
                <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(record.change)}`}>
                  {record.change}
                </span>
              </strong>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>User</span>
              <strong>{record.user}</strong>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Timestamp</span>
              <strong>{record.timestamp}</strong>
            </div>
          </div>
        </section>

        <section className={styles.detailCard}>
          <div className={styles.sectionLabel}>Record Metadata</div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Record ID</span>
              <strong>{record.id}</strong>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Source</span>
              <strong>Audit Trail</strong>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Record Status</span>
              <strong>Read-only</strong>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Created</span>
              <strong>{record.timestamp}</strong>
            </div>
          </div>
        </section>

        <section className={styles.detailCard}>
          <div className={styles.sectionLabel}>Activity Timeline</div>
          <div className={styles.timelineList}>
            {timelineEntries.map((entry, index) => (
              <div className={styles.timelineEntry} key={`${entry.id || entry.opportunityId}-${index}`}>
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

        <div className={styles.readOnlyFooter}>This audit record is read-only and cannot be modified.</div>
      </div>
    </div>
  );
}
