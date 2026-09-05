import React from 'react';
import {
  Download,
  Sparkles,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  StickyNote,
  Activity,
  History
} from 'lucide-react';

const TYPE_CONFIG = {
  collect: { icon: Download,     cls: 'tl-collect', label: '' },
  ai:      { icon: Sparkles,     cls: 'tl-ai',      label: '' },
  review:  { icon: Eye,          cls: 'tl-review',  label: '' },
  pursue:  { icon: CheckCircle2, cls: 'tl-pursue',  label: '' },
  reject:  { icon: XCircle,      cls: 'tl-reject',  label: '' },
  note:    { icon: StickyNote,   cls: 'tl-note',    label: '' },
  status:  { icon: Activity,     cls: 'tl-status',  label: '' }
};

/**
 * Section 4 — Embedded Audit Trail (opportunity-specific)
 * Props:
 *   trail – Array of { id, action, actor, role, date, time, type, note? }
 */
export default function AuditTimeline({ trail = [] }) {
  return (
    <div className="card">
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <History size={16} color="#7C3AED" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
              Embedded Audit Trail
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>
              Complete activity history for this opportunity
            </p>
          </div>
        </div>
        <span style={{
          fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)',
          background: 'var(--bg-subtle)', padding: '0.2rem 0.6rem',
          borderRadius: 9999, border: '1px solid var(--border-color)'
        }}>
          {trail.length} event{trail.length !== 1 ? 's' : ''}
        </span>
      </div>

      {trail.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No activity recorded yet.
        </div>
      ) : (
        <div className="audit-timeline">
          {trail.map((entry, idx) => {
            const cfg = TYPE_CONFIG[entry.type] || TYPE_CONFIG.status;
            const Icon = cfg.icon;
            const isLast = idx === trail.length - 1;

            return (
              <div key={entry.id || idx} className="timeline-item">
                {/* Icon dot */}
                <div className={`timeline-icon-wrap ${cfg.cls}`}>
                  <Icon size={16} />
                </div>

                {/* Content */}
                <div className="timeline-body" style={{ paddingBottom: isLast ? 0 : '1.5rem' }}>
                  <p className="timeline-action">{entry.action}</p>
                  <p className="timeline-actor">
                    {entry.actor}
                    {entry.role && entry.role !== entry.actor && (
                      <span style={{ color: 'var(--text-light)', marginLeft: '0.3rem' }}>· {entry.role}</span>
                    )}
                  </p>
                  <p className="timeline-meta">
                    <Clock size={11} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle' }} />
                    {entry.date} · {entry.time}
                  </p>
                  {entry.note && (
                    <div className="timeline-note-bubble">"{entry.note}"</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
