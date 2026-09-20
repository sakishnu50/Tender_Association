import React, { useState, useCallback, useMemo } from 'react';`r`nimport { ArrowLeft, ChevronRight, CheckCircle2, FileText, Download, Check, X } from 'lucide-react';
import { useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import OpportunityHeader from '../components/ui/OpportunityHeader';
import ScoreBreakdown    from '../components/ui/ScoreBreakdown';
import AIAnalysis        from '../components/ui/AIAnalysis';
import SimilarProjects   from '../components/ui/SimilarProjects';
import AuditTimeline     from '../components/ui/AuditTimeline';
import AddNoteModal      from '../components/ui/AddNoteModal';
import { mockOpportunities } from '../data/mockData';

/* â”€â”€â”€ Helpers â”€â”€â”€ */
function nowDate() {
  const d = new Date();
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function nowTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}
let _seq = 100;
function uid() { return `DYN-${++_seq}`; }

/* Inner Content Component (re-keyed per opportunity) */`r`nfunction OpportunityDetailsContent({ opportunity, onBack, calendarDate }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Local status state (decoupled from global list)
  const [status, setStatus] = useState(opportunity?.status || 'New');

  // Embed audit trail as local state seeded from opportunity data
  const [trail, setTrail] = useState(opportunity?.auditTrail || []);

  // Note modal
  const [noteOpen, setNoteOpen] = useState(false);

  /* â”€â”€ Action handlers â”€â”€ */
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

  const handleDelete = useCallback(() => {
    const oppId = opportunity?.id;
    if (!oppId) return;

    // 1. Remove from in-memory mockOpportunities if present
    const mockIdx = mockOpportunities.findIndex((item) => item.id === oppId);
    if (mockIdx !== -1) {
      mockOpportunities.splice(mockIdx, 1);
    }

    // 2. Remove from persistent localStorage stores
    ['iot_all_opportunities', 'iot_opportunities'].forEach((storageKey) => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            const updated = list.filter((item) => item.id !== oppId);
            localStorage.setItem(storageKey, JSON.stringify(updated));
          }
        }
      } catch (e) {
        console.error(`Error deleting opportunity from ${storageKey}:`, e);
      }
    });

    // 3. Invalidate & update React Query cache for immediate list refresh
    try {
      queryClient.setQueriesData({ queryKey: ['opportunities'] }, (old) => {
        if (!Array.isArray(old)) return [];
        return old.filter((item) => item.id !== oppId);
      });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    } catch (e) {
      console.error('Error updating React Query cache:', e);
    }

    // 4. Navigate back to Opportunities list page
    navigate('/opportunities');
  }, [opportunity?.id, queryClient, navigate]);

  return (
    <div className="page-container">
      {/* â”€â”€ 1. Back button â”€â”€ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

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
          {calendarDate ? 'Back to Bid Calendar' : 'Back to Opportunities'}
        </button>
      </div>

      {/* â”€â”€ 2. Header Block (existing â€“ keep as-is) â”€â”€ */}
      <OpportunityHeader
        opportunity={opportunity}
        status={status}
        onPursue={handlePursue}
        onReject={handleReject}
        onReview={handleReview}
        onDelete={handleDelete}
        onAddNote={() => setNoteOpen(true)}
      />

      {/* â”€â”€ 3. AI Score Breakdown (full-width) â”€â”€ */}
      <ScoreBreakdown
        breakdown={opportunity.scoreBreakdown || []}
        overallScore={opportunity.aiScore || opportunity.overallScore}
      />

      {/* â”€â”€ 4. AI Reason & Recommendation (full-width) â”€â”€ */}
      <AIAnalysis
        analysis={opportunity.aiAnalysis}
        sourceUrl={opportunity.sourceUrl}
        source={opportunity.source}
      />

      {/* â”€â”€ 5. Similar Past Projects (full-width) â”€â”€ */}
      <SimilarProjects projects={opportunity.similarProjects || []} />

      {/* â”€â”€ 6. Embedded Audit Trail (full-width) â”€â”€ */}
      <AuditTimeline trail={trail} />

      {/* â”€â”€ Note Modal â”€â”€ */}
      <AddNoteModal
        isOpen={noteOpen}
        onClose={() => setNoteOpen(false)}
        onSubmit={handleNoteSubmit}
      />
    </div>
  );
}

/* â”€â”€â”€ Main Route Wrapper â”€â”€â”€ */
export default function OpportunityDetailsView({ opportunity: propOpportunity, onBack }) {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const calendarDate = location.state?.calendarDate;

  // Extract opportunity ID from route param, query string, navigation state, or prop
  const activeId = routeId || searchParams.get('id') || location.state?.id || propOpportunity?.id || 'OPP-001';

  // Find corresponding opportunity from mock data
  const opportunity = useMemo(() => {
    if (propOpportunity && propOpportunity.id === activeId) {
      return propOpportunity;
    }
    const found = mockOpportunities.find((item) => item.id === activeId);
    return found || propOpportunity || mockOpportunities[0];
  }, [activeId, propOpportunity]);

  // Safe back handler
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack(calendarDate);
    } else {
      navigate('/opportunities');
    }
  }, [onBack, navigate, calendarDate]);

  if (!opportunity) return null;

  return (
    <OpportunityDetailsContent
      key={opportunity.id}
      opportunity={opportunity}
      onBack={handleBack}
      calendarDate={calendarDate}
    />
  );
}



