import React, { useState, useCallback } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

import OpportunityHeader from '../components/ui/OpportunityHeader';
import ScoreBreakdown    from '../components/ui/ScoreBreakdown';
import AIAnalysis        from '../components/ui/AIAnalysis';
import SimilarProjects   from '../components/ui/SimilarProjects';
import AuditTimeline     from '../components/ui/AuditTimeline';
import AddNoteModal      from '../components/ui/AddNoteModal';

/* ─── Helpers ─── */
function nowDate() {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function nowTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}
let _seq = 100;
function uid() { return `DYN-${++_seq}`; }

/* ─── Main Component ─── */
export default function OpportunityDetailsView({ opportunity, onBack }) {
  if (!opportunity) return null;

  // Local status state (decoupled from global list)
  const [status, setStatus] = useState(opportunity.status || 'New');

  // Embed audit trail as local state seeded from opportunity data
  const [trail, setTrail] = useState(opportunity.auditTrail || []);

  // Note modal
  const [noteOpen, setNoteOpen] = useState(false);

  /* ── Action handlers ── */
  const pushEntry = useCallback((entry) => {
    setTrail((prev) => [...prev, entry]);
  }, []);

  const handlePursue = useCallback(() => {
    setStatus('Pursue');
    pushEntry({
      id: uid(), action: 'Status Changed to Pursue',
      actor: 'Admin', role: 'Manager',
      date: nowDate(), time: nowTime(), type: 'pursue'
    });
  }, [pushEntry]);

  const handleReject = useCallback(() => {
    setStatus('Rejected');
    pushEntry({
      id: uid(), action: 'Status Changed to Rejected',
      actor: 'Admin', role: 'Manager',
      date: nowDate(), time: nowTime(), type: 'reject'
    });
  }, [pushEntry]);

  const handleReview = useCallback(() => {
    setStatus('Under Review');
    pushEntry({
      id: uid(), action: 'Marked for Review',
      actor: 'Admin', role: 'Manager',
      date: nowDate(), time: nowTime(), type: 'review'
    });
  }, [pushEntry]);

  const handleNoteSubmit = useCallback((noteText) => {
    pushEntry({
      id: uid(), action: 'Note Added',
      actor: 'Admin', role: 'Manager',
      date: nowDate(), time: nowTime(),
      type: 'note', note: noteText
    });
  }, [pushEntry]);

  return (
    <div className="page-container">

      {/* ── 1. Breadcrumb + Back ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Opportunities</span>
          <ChevronRight size={13} className="breadcrumb-sep" />
          <span className="breadcrumb-current">Opportunity Details</span>
        </nav>

        <button
          id="btn-back-to-opportunities"
          onClick={onBack}
          style={{
            border: 'none',
            background: 'none',
            color: 'var(--primary)',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            width: 'fit-content',
            padding: '0.25rem 0',
            transition: 'opacity 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <ArrowLeft size={15} />
          Back to Opportunities
        </button>
      </div>

      {/* ── 2. Header Block (existing – keep as-is) ── */}
      <OpportunityHeader
        opportunity={opportunity}
        status={status}
        onPursue={handlePursue}
        onReject={handleReject}
        onReview={handleReview}
        onAddNote={() => setNoteOpen(true)}
      />

      {/* ── 3. AI Score Breakdown (full-width) ── */}
      <ScoreBreakdown
        breakdown={opportunity.scoreBreakdown || []}
        overallScore={opportunity.aiScore}
      />

      {/* ── 4. AI Reason & Recommendation (full-width) ── */}
      <AIAnalysis analysis={opportunity.aiAnalysis} />

      {/* ── 5. Similar Past Projects (full-width) ── */}
      <SimilarProjects projects={opportunity.similarProjects || []} />

      {/* ── 6. Embedded Audit Trail (full-width) ── */}
      <AuditTimeline trail={trail} />

      {/* ── Note Modal ── */}
      <AddNoteModal
        isOpen={noteOpen}
        onClose={() => setNoteOpen(false)}
        onSubmit={handleNoteSubmit}
      />
    </div>
  );
}
