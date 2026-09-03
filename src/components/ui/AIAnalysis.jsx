import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ThumbsUp } from 'lucide-react';

/**
 * Section 2 — AI Reason & Recommendation
 * Props:
 *   analysis – { summary, strengths[], risks[], recommendation }
 */
export default function AIAnalysis({ analysis }) {
  if (!analysis) return null;
  const { summary, strengths = [], risks = [], recommendation } = analysis;

  return (
    <div className="card">
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Sparkles size={16} color="var(--primary)" />
        </div>
        <div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
            AI Reason &amp; Recommendation
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>
            Why this opportunity received its score
          </p>
        </div>
      </div>

      {/* AI Analysis subsection */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          marginBottom: '0.625rem'
        }}>
          <Sparkles size={13} color="#3B82F6" />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            AI Analysis
          </span>
        </div>
        <div className="ai-summary-box">
          <span>{summary}</span>
        </div>
      </div>

      {/* Strengths & Risks grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Strengths */}
        <div className="ai-subsection">
          <p className="ai-subsection-title">Strengths</p>
          {strengths.map((s, i) => (
            <div key={i} className="ai-item">
              <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{s}</span>
            </div>
          ))}
        </div>

        {/* Risks */}
        <div className="ai-subsection">
          <p className="ai-subsection-title">Risks</p>
          {risks.map((r, i) => (
            <div key={i} className="ai-item">
              <AlertTriangle size={14} color="#D97706" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div style={{ marginBottom: '0.5rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          AI Recommendation
        </p>
        <div className="ai-recommendation-box" style={{ fontSize: '1rem' }}>
          <ThumbsUp size={18} color="#059669" />
          <span style={{ fontWeight: 800 }}>{recommendation}</span>
        </div>
      </div>
    </div>
  );
}
