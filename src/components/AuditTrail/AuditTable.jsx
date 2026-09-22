Update the “Back to Audit Trail” link / button in the Audit Trail details page.

Remove the border / outline box completely.

Remove the button background and box shadow.

Change the text to blue, matching the “Back to Opportunities” link style.

Keep the left arrow icon in blue.

It should look like a simple clickable text link, not a button.

Use the same font size, weight, spacing, and alignment style as “Back to Opportunities” shown in the reference image.

Keep the existing navigation / click functionality unchanged.

Do not change any other Audit Trail UI, table, filters, dark / light mode, or layout.

Target appearance:
← Back to Audit Trail

Blue text + blue arrow, no border, no box, no background.// src/components/AuditTrail/AuditTable.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Eye, MoreVertical } from 'lucide-react';
import styles from './AuditTrail.module.css';

/* ── Per-row three-dot action menu ── */
function ActionMenu({ log, onEdit, onRowClick }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div
      ref={menuRef}
      className={styles.actionMenuWrapper}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className={styles.dotsBtn}
        aria-label="Action"
        title="Action"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <div className={styles.dropdownMenu} role="menu">
          <button
            type="button"
            role="menuitem"
            className={styles.dropdownItem}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onEdit && onEdit(log);
            }}
          >
            <Pencil size={13} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className={styles.dropdownItem}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onRowClick && onRowClick(log);
            }}
          >
            <Eye size={13} />
            <span>View</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Format AI Score with 1 decimal place ── */
function formatAiScore(score) {
  if (score === null || score === undefined || score === '') return '—';
  if (typeof score === 'string') {
    const match = score.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      const num = parseFloat(match[1]);
      if (!isNaN(num)) {
        return num.toFixed(1);
      }
    }
    return score;
  }
  const num = Number(score);
  if (!isNaN(num)) {
    return num.toFixed(1);
  }
  return '—';
}

/* ── Main AuditTable component ── */
export default function AuditTable({
  logs,
  onRowClick,
  onEdit,
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  rowsPerPage = 10,
  onPageChange,
}) {
  const getPriorityBadgeClass = (priority) => {
    const p = String(priority || '').trim().toUpperCase();
    switch (p) {
      case 'HIGH': return styles.priorityHigh;
      case 'LOW': return styles.priorityLow;
      case 'MEDIUM':
      default: return styles.priorityMedium;
    }
  };

  const firstRecord = totalRecords === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const lastRecord = Math.min(currentPage * rowsPerPage, totalRecords);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '…', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '…', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages];
  };

  return (
    <>
      {/* ── Scrollable table ── */}
      <div className={styles.tableContainer}>
        <table className={styles.auditTable}>
          <thead>
            <tr>
              <th className={styles.th}>OPPORTUNITY ID</th>
              <th className={styles.th}>OPPORTUNITY</th>
              <th className={styles.th}>USER</th>
              <th className={styles.th}>TIMESTAMP</th>
              <th className={styles.th}>DATE</th>
              <th className={styles.th}>AI SCORE</th>
              <th className={styles.th}>PRIORITY</th>
              <th className={styles.th} style={{ textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr
                key={log.id || `${log.opportunityId}-${index}`}
                className={styles.tr}
                onClick={() => onRowClick && onRowClick(log)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
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
                    {log.userRole && (
                      <span className={styles.userRoleTag}>{log.userRole}</span>
                    )}
                  </div>
                </td>

                {/* Timestamp */}
                <td className={styles.td}>
                  <span className={styles.timestampCell}>{log.timestamp}</span>
                </td>

                {/* Date */}
                <td className={styles.td}>
                  <span className={styles.dateCell}>{log.date || '—'}</span>
                </td>

                {/* AI Score badge */}
                <td className={styles.td}>
                  {log.aiScore !== undefined && log.aiScore !== null && log.aiScore !== '' ? (
                    <span className={styles.aiScoreBadge}>
                      <span className={styles.aiScoreValue}>{formatAiScore(log.aiScore)}</span>
                      <span className={styles.aiScoreScale}> / 10</span>
                    </span>
                  ) : (
                    <span className={styles.emptyScore}>—</span>
                  )}
                </td>

                {/* Priority badge — outline style */}
                <td className={styles.td}>
                  <span className={`${styles.priorityBadge} ${getPriorityBadgeClass(log.currentPriority)}`}>
                    {log.currentPriority || 'Medium'}
                  </span>
                </td>

                {/* Three-dot action menu */}
                <td className={styles.td} style={{ textAlign: 'center' }}>
                  <ActionMenu log={log} onEdit={onEdit} onRowClick={onRowClick} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination footer — sibling of tableContainer, always full card width ── */}
      <div className={styles.paginationFooter}>
        <span className={styles.paginationSummary}>
          Showing {firstRecord} to {lastRecord} of {totalRecords} records
        </span>

        <div className={styles.pageControls}>
          <button
            className={styles.pageBtn}
            onClick={() => onPageChange && onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >«</button>

          <button
            className={styles.pageBtn}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >‹</button>

          {getPageNumbers().map((page, idx) =>
            page === '…' ? (
              <span key={`ell-${idx}`} className={styles.pageEllipsis}>…</span>
            ) : (
              <button
                key={page}
                className={`${styles.pageBtn} ${page === currentPage ? styles.pageBtnActive : ''}`}
                onClick={() => onPageChange && onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >{page}</button>
            )
          )}

          <button
            className={styles.pageBtn}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >›</button>

          <button
            className={styles.pageBtn}
            onClick={() => onPageChange && onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >»</button>
        </div>
      </div>
    </>
  );
}
