import React from 'react';
import {
  Building2,
  Globe,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock3,
  StickyNote
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import ScoreRing from './ScoreRing';

/**
 * Status badge helper (inline, not a separate component).
 */
function StatusBadge({ status }) {
  const map = {
    New:          'status-new',
    Pursue:       'status-pursue',
    Rejected:     'status-rejected',
    'Under Review': 'status-review'
  };
  return <span className={`status-badge ${map[status] || 'status-new'}`}>{status}</span>;
}

/**
 * Top hero header card for the Opportunity Details page.
 * Props:
 *   opportunity  – enriched opportunity object
 *   status       – current dynamic status string
 *   onPursue     – fn()
 *   onReject     – fn()
 *   onReview     – fn()
 *   onAddNote    – fn()
 */
export default function OpportunityHeader({
  opportunity,
  status,
  onPursue,
  onReject,
  onReview,
  onAddNote
}) {
  if (!opportunity) return null;

  return (
    <div className="opp-header-card">
      {/* ── Row 1: Title + Score Ring ── */}
      <div className="opp-header-top">
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
            marginBottom: '0.6rem'
          }}>
            {opportunity.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            <PriorityBadge priority={opportunity.priority} />
            <StatusBadge status={status} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              #{opportunity.id}
            </span>
          </div>
        </div>

        {/* Score ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          <ScoreRing score={opportunity.aiScore} max={10} />
          <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'center' }}>
            AI SCORE
          </span>
        </div>
      </div>

      {/* ── Row 2: Metadata grid ── */}
      <div className="opp-header-meta" style={{ paddingTop: '0.875rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="opp-meta-item">
          <span className="opp-meta-label">
            <Building2 size={11} style={{ display: 'inline', marginRight: '0.25rem' }} />
            Organization
          </span>
          <span className="opp-meta-value">{opportunity.organization || opportunity.source}</span>
        </div>

        <div className="opp-meta-item">
          <span className="opp-meta-label">
            <ShieldCheck size={11} style={{ display: 'inline', marginRight: '0.25rem' }} />
            Sector
          </span>
          <span className="opp-meta-value">{opportunity.sector}</span>
        </div>

        <div className="opp-meta-item">
          <span className="opp-meta-label">
            <MapPin size={11} style={{ display: 'inline', marginRight: '0.25rem' }} />
            Location
          </span>
          <span className="opp-meta-value">{opportunity.location}</span>
        </div>

        <div className="opp-meta-item">
          <span className="opp-meta-label">
            <Calendar size={11} style={{ display: 'inline', marginRight: '0.25rem' }} />
            Deadline
          </span>
          <span className="opp-meta-value deadline">{opportunity.deadline}</span>
        </div>

        <div className="opp-meta-item">
          <span className="opp-meta-label">
            <Globe size={11} style={{ display: 'inline', marginRight: '0.25rem' }} />
            Procurement Type
          </span>
          <span className="opp-meta-value">{opportunity.procurementType || opportunity.type}</span>
        </div>

        {opportunity.value && (
          <div className="opp-meta-item">
            <span className="opp-meta-label">Project Value</span>
            <span className="opp-meta-value" style={{ color: 'var(--primary)' }}>{opportunity.value}</span>
          </div>
        )}
      </div>

      {/* ── Row 3: Action buttons ── */}
      <div style={{
        paddingTop: '0.875rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Take action on this opportunity:
        </span>
        <div className="action-btn-group">
          <button className="btn btn-pursue" onClick={onPursue} id="btn-pursue-opp">
            <CheckCircle2 size={15} /> Pursue
          </button>
          <button className="btn btn-reject" onClick={onReject} id="btn-reject-opp">
            <XCircle size={15} /> Reject
          </button>
          <button className="btn btn-review" onClick={onReview} id="btn-review-opp">
            <Clock3 size={15} /> Mark for Review
          </button>
          <button className="btn btn-note" onClick={onAddNote} id="btn-add-note-opp">
            <StickyNote size={15} /> Add Note
          </button>
        </div>
      </div>
    </div>
  );
}
