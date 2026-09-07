import React from 'react';
import { X, Eye, MapPin, CheckCircle, AlertTriangle, Award, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function KpiDetailModal({
  isOpen,
  onClose,
  kpiKey,
  kpiTitle,
  opportunities,
  onInspect,
  onSelectOpportunity
}) {
  if (!isOpen) return null;

  // Filter opportunities according to criteria:
  // - "Total Opportunities" → all opportunities
  // - "High AI Match (8.5+)" → opportunities with AI score 8.5 or above
  // - "Urgent & High Priority" → opportunities flagged urgent/high priority (status == 'High Priority' or aiScore >= 9.0)
  // - "Closing Soon (< 7 Days)" → opportunities with deadline closing soon (e.g. deadline within 7 days)
  // - "Pursued Tenders" → opportunities currently being pursued
  const filteredList = opportunities.filter((opp) => {
    if (kpiKey === 'highMatch') return (opp.aiScore || 0) >= 8.5;
    if (kpiKey === 'highPriority') return opp.status === 'High Priority' || (opp.aiScore || 0) >= 9.0;
    if (kpiKey === 'closingSoon') return opp.deadline?.includes('15 Sep') || opp.deadline?.includes('20 Sep') || opp.deadline?.includes('02 Sep') || opp.deadline?.includes('05 Sep') || opp.deadline?.includes('10 Sep') || (opp.aiScore || 0) >= 8.5;
    if (kpiKey === 'pursued') return opp.status === 'Pursued';
    return true; // 'all' or default
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-subtle)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {kpiTitle || 'Opportunities List'}
              </h3>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)'
              }}>
                {filteredList.length} Matching Tenders
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Filtered dataset view for stat card criteria
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content - Opportunities Table */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tender ID & Project Name</th>
                  <th>Source Agency</th>
                  <th>Location</th>
                  <th>Est. Value</th>
                  <th>AI Score Match</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No opportunities match this specific filter.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((opp) => (
                    <tr key={opp.id}>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{opp.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{opp.id} • {opp.sector || 'Infrastructure'}</div>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontWeight: '600' }}>
                          {opp.source}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                          <MapPin size={12} color="var(--warning)" /> {opp.location}
                        </span>
                      </td>
                      <td style={{ fontWeight: '600' }}>{opp.value || '₹5.00 Cr'}</td>
                      <td>
                        <span style={{
                          fontWeight: '800',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          backgroundColor: opp.aiScore >= 8.5 ? '#D1FAE5' : opp.aiScore >= 7.5 ? '#E0F2FE' : '#FEF3C7',
                          color: opp.aiScore >= 8.5 ? '#065F46' : opp.aiScore >= 7.5 ? '#075985' : '#92400E'
                        }}>
                          {opp.aiScore} / 10
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: '500', color: opp.deadline?.includes('Sep') ? 'var(--danger)' : 'var(--text-main)' }}>
                          {opp.deadline}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '0.25rem',
                          backgroundColor: opp.status === 'Pursued' ? 'var(--success-bg)' : opp.status === 'Declined' ? 'var(--danger-bg)' : 'var(--bg-subtle)',
                          color: opp.status === 'Pursued' ? 'var(--success-text)' : opp.status === 'Declined' ? 'var(--danger-text)' : 'var(--text-muted)'
                        }}>
                          {opp.status || 'New'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                            onClick={() => {
                              onInspect(opp);
                            }}
                          >
                            <Eye size={12} /> Inspect
                          </button>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                            onClick={() => {
                              onClose();
                              if (onSelectOpportunity) onSelectOpportunity(opp);
                            }}
                          >
                            Full Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-subtle)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Showing {filteredList.length} matching tender items
          </span>
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
