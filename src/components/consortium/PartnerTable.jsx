import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

function scoreColor(score) {
  if (score >= 90) return 'var(--success)';
  if (score >= 80) return 'var(--primary)';
  if (score >= 70) return 'var(--warning)';
  return 'var(--text-muted)';
}

/* ── Status text colors ── */
function statusBadge(status) {
  switch (status) {
    case 'recommended':
      return { label: 'Recommended', color: '#16A34A' };
    case 'accepted':
      return { label: 'Accepted', color: '#16A34A' };
    case 'shortlisted':
      return { label: 'Shortlisted', color: '#7E22CE' };
    case 'contacted':
      return { label: 'Contacted', color: '#7E22CE' };
    default:
      return { label: 'Not Actioned', color: '#94A3B8' };
  }
}

export default function PartnerTable({
  filteredList,
  consortiumList,
  onViewProfile,
}) {
  /* ── Header cell style — matches Client Profile th exactly ── */
  const thStyle = {
    textAlign: 'left',
    padding: '0.85rem 1.25rem',
    fontSize: '0.725rem',
    fontWeight: '700',
    color: 'var(--text-muted, #64748B)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
    borderBottom: '1px solid var(--border-color, #E2E8F0)',
    backgroundColor: 'transparent',
  };

  /* ── Body cell style — matches Client Profile td exactly ── */
  const tdBase = {
    padding: '1rem 1.25rem',
    fontSize: '0.875rem',
    color: 'var(--text-main, #0F172A)',
    verticalAlign: 'middle',
    borderBottom: '1px solid var(--border-color, #E2E8F0)',
  };
  /* ── Pagination ── */
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1); }, [filteredList.length]);

  const totalPartners = filteredList.length;
  const totalPages = Math.max(1, Math.ceil(totalPartners / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalPartners);
  const paginatedList = filteredList.slice(startIndex, endIndex);

  return (
    <div
      className="card"
      style={{
        backgroundColor: 'var(--bg-card, #FFFFFF)',
        borderRadius: '0.75rem',
        border: '1px solid var(--border-color, #E2E8F0)',
        overflow: 'hidden',
        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
        padding: 0,
      }}
    >

      {/* ── Table — matches Client Profile data-table layout ── */}

      <div className="table-container" style={{ border: 'none', overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '32%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '26%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '12%' }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color, #E2E8F0)', backgroundColor: 'transparent' }}>
              <th style={{ ...thStyle, padding: '0.85rem 1rem' }}>PARTNER</th>
              <th style={{ ...thStyle, textAlign: 'center', padding: '0.85rem 1rem' }}>MATCH</th>
              <th style={{ ...thStyle, padding: '0.85rem 1rem' }}>EXPERTISE</th>
              <th style={{ ...thStyle, padding: '0.85rem 1rem' }}>STATUS</th>
              <th style={{ ...thStyle, textAlign: 'center', padding: '0.85rem 1rem' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'var(--text-muted, #64748B)',
                    fontSize: '0.9rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>🔍</span>
                    <strong style={{ color: 'var(--text-main, #0F172A)' }}>No partners match your filters</strong>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedList.map((partner, idx) => {
                const techScore = partner.technicalScore || parseInt(partner.technicalMatch) || 94;
                return (
                  <tr
                    key={partner.id}
                    style={{
                      borderBottom: '1px solid var(--border-color, #E2E8F0)',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #F8FAFC)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                  >
                    <td style={{ ...tdBase, padding: '1rem 1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-main, #0F172A)' }}>
                        {partner.name}
                      </span>
                    </td>
                    <td style={{ ...tdBase, textAlign: 'center', padding: '1rem 1rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-secondary, #334155)' }}>
                        {partner.technicalMatch || `${techScore}%`}
                      </span>
                    </td>
                    <td style={{ ...tdBase, padding: '1rem 1rem', color: 'var(--text-secondary, #334155)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {partner.expertise}
                    </td>
                    <td style={{ ...tdBase, padding: '1rem 1rem' }}>
                      {(() => {
                        const badge = statusBadge(partner.status);
                        return (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              color: badge.color,
                            }}
                          >
                            {badge.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td style={{ ...tdBase, textAlign: 'center', padding: '1rem 1rem' }}>
                      <button
                        onClick={() => onViewProfile(partner)}
                        title="View Complete Partner Profile"
                        aria-label={`View profile for ${partner.name}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color, #E2E8F0)',
                          backgroundColor: 'var(--bg-subtle, #F8FAFC)',
                          color: 'var(--primary, #2563EB)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.12)';
                          e.currentTarget.style.borderColor = 'var(--primary, #2563EB)';
                          e.currentTarget.style.transform = 'scale(1.06)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #F8FAFC)';
                          e.currentTarget.style.borderColor = 'var(--border-color, #E2E8F0)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Footer — matches Client Profile exactly ── */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--border-color, #E2E8F0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-muted, #64748B)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          Showing {totalPartners === 0 ? 0 : startIndex + 1} to {endIndex} of {totalPartners} entries
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.75rem',
              opacity: currentPage <= 1 ? 0.4 : 1,
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
            }}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            aria-label="Previous Page"
          >
            &lt;
          </button>

          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem', minWidth: '1.75rem' }}
            aria-label={`Page ${currentPage}`}
            aria-current="page"
          >
            {currentPage}
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{
              padding: '0.2rem 0.5rem',
              fontSize: '0.75rem',
              opacity: currentPage >= totalPages ? 0.4 : 1,
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
            }}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            aria-label="Next Page"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

