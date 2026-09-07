import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

export default function ConsortiumEmptyState({ onResetFilters }) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        gap: '1rem',
        backgroundColor: 'var(--bg-card)'
      }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-subtle)',
        border: '1px dashed var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }}>
        <SearchX size={32} />
      </div>

      <div style={{ maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
          No suitable partners found
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
          No consortium candidates match your current filter selection. Try expanding the search criteria or resetting filters to discover available partners.
        </p>
      </div>

      <button
        className="btn btn-primary"
        onClick={onResetFilters}
        style={{
          marginTop: '0.5rem',
          fontSize: '0.825rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 1rem'
        }}
      >
        <RotateCcw size={15} /> Reset Search & Filters
      </button>
    </div>
  );
}
