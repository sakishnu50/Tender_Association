import React from 'react';
import { BarChart3 } from 'lucide-react';

/**
 * Section 1 — AI Score Breakdown
 * Props:
 *   breakdown  – Array of { label, score, max }
 *   overallScore – Number
 */
export default function ScoreBreakdown({ breakdown = [], overallScore }) {
  return (
    <div className="card">
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <BarChart3 size={16} color="var(--primary)" />
        </div>
        <div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
            AI Score Breakdown
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>
            How the overall score was calculated
          </p>
        </div>
      </div>

      {/* Criteria rows */}
      <div className="score-breakdown-card">
        {breakdown.map((row, i) => {
          const pct = (row.score / row.max) * 100;
          return (
            <div key={i} className="score-row">
              <span className="score-row-label">{row.label}</span>
              <div className="score-bar-track">
                <div
                  className="score-bar-fill"
                  style={{ '--bar-width': `${pct}%`, width: `${pct}%` }}
                />
              </div>
              <span className="score-row-num">{row.score} / {row.max}</span>
            </div>
          );
        })}
      </div>

      {/* Overall score footer */}
      {overallScore !== undefined && (
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F8FAFC',
          margin: '1.25rem -1.25rem -1.25rem',
          padding: '0.875rem 1.25rem',
          borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Overall Score
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>
              {overallScore}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 10</span>
          </div>
        </div>
      )}
    </div>
  );
}
