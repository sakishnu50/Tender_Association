import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Building,
  Target,
  Sparkles,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';

export default function OpportunityRequirementsCard({ requirements }) {
  if (!requirements) return null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Row with Context & Tender Meta */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        paddingBottom: '0.875rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Target size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Tender Opportunity Assessment
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              {requirements.opportunityName}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Building size={14} color="var(--primary)" />
            <span>Target Lead: <strong>{requirements.targetCompany}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="var(--primary)" />
            <span>Location: <strong>{requirements.location}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} color="var(--primary)" />
            <span>Deadline: <strong>{requirements.submissionDeadline}</strong></span>
          </div>
        </div>
      </div>

      {/* Grid: Required Capabilities & Missing Capabilities */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* 1. Required Capabilities Section */}
        <div style={{
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Required Capabilities
              </span>
            </div>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)'
            }}>
              {requirements.requiredCapabilities?.length || 0} Mandated Criteria
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {requirements.requiredCapabilities?.map((cap, idx) => (
              <div
                key={idx}
                title={cap.description}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--text-main)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <CheckCircle2 size={14} color="var(--success)" style={{ flexShrink: 0 }} />
                <span>{cap.name}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Mandatory technical and operational benchmarks required by {requirements.fundingAgency} for consortium qualification.
          </div>
        </div>

        {/* 2. Missing Capabilities Section (Mukesh & Associates gap) */}
        <div style={{
          backgroundColor: 'rgba(254, 243, 199, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid var(--warning)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} color="var(--warning)" />
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--warning-text)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Missing Capabilities ({requirements.targetCompany})
              </span>
            </div>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '700',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning-text)',
              border: '1px solid var(--warning)'
            }}>
              Consortium Action Needed
            </span>
          </div>

          {/* Warning-style Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {requirements.missingCapabilities?.map((gap, idx) => (
              <div
                key={idx}
                title={gap.reason}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--warning-bg)',
                  border: '1px solid rgba(217, 119, 6, 0.4)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: 'var(--warning-text)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <AlertTriangle size={14} color="var(--warning)" style={{ flexShrink: 0 }} />
                <span>{gap.name}</span>
              </div>
            ))}
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: 'var(--warning-text)',
            lineHeight: '1.4',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Sparkles size={14} style={{ flexShrink: 0 }} />
            <span>
              <strong>AI Recommendation:</strong> Partner with listed consortium candidates below to bridge these missing capabilities and reach 100% tender compliance.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
