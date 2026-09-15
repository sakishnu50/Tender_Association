import React from 'react';
import { SlidersHorizontal, Eye } from 'lucide-react';

function scoreColor(score) {
  if (score >= 90) return 'var(--success)';
  if (score >= 80) return 'var(--primary)';
  if (score >= 70) return 'var(--warning)';
  return 'var(--text-muted)';
}

export default function PartnerTable({
  filteredList,
  consortiumList,
  onViewProfile,
}) {
  const thStyle = {
    padding: '0.75rem 1rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    textAlign: 'left',
    backgroundColor: 'var(--bg-subtle)',
    borderBottom: '1px solid var(--border-color)',
    whiteSpace: 'nowrap',
  };

  const tdBase = {
    padding: '0.875rem 1rem',
    fontSize: '0.875rem',
    color: 'var(--text-main)',
    verticalAlign: 'middle',
    borderBottom: '1px solid var(--border-color)',
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

      {/* Row count strip */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
        fontSize: '0.76rem', color: 'var(--text-muted)',
        borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)',
      }}>
        <SlidersHorizontal size={12} />
        <span>
          Showing{' '}
          <strong style={{ color: 'var(--text-main)' }}>{filteredList.length}</strong>
          {' '}of{' '}
          <strong style={{ color: 'var(--text-main)' }}>{consortiumList.length}</strong>
          {' '}consortium partners
        </span>
      </div>

      {/* Table — 4 columns: PARTNER | MATCH | EXPERTISE | ACTION */}
      <div style={{ width: '100%' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '40%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '32%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={thStyle}>Partner</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Match</th>
              <th style={thStyle}>Expertise</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>🔍</span>
                    <strong style={{ color: 'var(--text-main)' }}>No partners match your filters</strong>
                  </div>
                </td>
              </tr>
            ) : (
              filteredList.map((partner, idx) => {
                const techScore = partner.technicalScore || parseInt(partner.technicalMatch) || 94;
                const isLast = idx === filteredList.length - 1;
                const td = { ...tdBase, borderBottom: isLast ? 'none' : '1px solid var(--border-color)' };
                return (
                  <tr
                    key={partner.id}
                    style={{ transition: 'background 0.1s ease' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
                  >
                    <td style={td}>
                      <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {partner.name}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem', color: scoreColor(techScore) }}>
                        {partner.technicalMatch || `${techScore}%`}
                      </span>
                    </td>
                    <td style={td}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
                        {partner.expertise}
                      </span>
                    </td>
                    <td style={{ ...td, textAlign: 'center' }}>
                      <button
                        onClick={() => onViewProfile(partner)}
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
