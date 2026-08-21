import React from 'react';
import { ArrowLeft, CheckCircle2, FileText, Download, Check, X } from 'lucide-react';

export default function OpportunityDetailsView({ opportunity, onBack, onOpenPursue, onOpenDecline }) {
  if (!opportunity) return null;

  return (
    <div className="page-container">
      <button
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
          gap: '0.4rem',
          width: 'fit-content'
        }}
      >
        <ArrowLeft size={16} /> Back to Opportunities
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Metadata & Details */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {opportunity.name}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr',
            gap: '0.75rem',
            fontSize: '0.875rem'
          }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Source:</span>
            <span style={{ fontWeight: '500' }}>{opportunity.source}</span>

            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Sector:</span>
            <span style={{ fontWeight: '500' }}>{opportunity.sector}</span>

            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Location:</span>
            <span style={{ fontWeight: '500' }}>{opportunity.location}</span>

            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Project Value:</span>
            <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{opportunity.value}</span>

            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Deadline:</span>
            <span style={{ fontWeight: '600', color: 'var(--danger)' }}>{opportunity.deadline}</span>

            <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Type:</span>
            <span style={{ fontWeight: '500' }}>{opportunity.type}</span>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Description:
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
              {opportunity.description}
            </p>
          </div>

          {/* Actions Row */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              className="btn btn-success"
              style={{ flex: 1, padding: '0.65rem' }}
              onClick={onOpenPursue}
            >
              <Check size={16} /> PURSUE OPPORTUNITY
            </button>
            <button
              className="btn btn-danger"
              style={{ flex: 1, padding: '0.65rem' }}
              onClick={onOpenDecline}
            >
              <X size={16} /> DECLINE OPPORTUNITY
            </button>
          </div>
        </div>

        {/* Right Column: AI Score Breakdown & Attached Docs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* AI Score Badge Card */}
          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              AI OPPORTUNITY SCORE
            </div>
            <div style={{ fontSize: '2.75rem', fontWeight: '900', color: 'var(--text-main)', margin: '0.5rem 0 0.2rem 0' }}>
              {opportunity.aiScore} <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: '600' }}>/ 10</span>
            </div>
            <div style={{
              display: 'inline-block',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success-text)',
              fontWeight: '700',
              fontSize: '0.875rem',
              padding: '0.25rem 0.8rem',
              borderRadius: '9999px',
              marginBottom: '1.25rem'
            }}>
              {opportunity.matchLevel}
            </div>

            <div style={{ textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Why this score?
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {opportunity.scoreFactors.map((factor, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attached Documents Card */}
          <div className="card">
            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Documents
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {opportunity.documents.map((doc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '0.6rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    <FileText size={16} color="var(--primary)" />
                    <span>{doc}</span>
                  </div>
                  <button className="btn btn-outline" style={{ padding: '0.2rem 0.4rem' }}>
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
