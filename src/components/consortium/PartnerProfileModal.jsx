import React from 'react';
import {
  X,
  Users,
  MapPin,
  CheckCircle2,
  ThumbsUp,
  Star,
  MessageSquare,
  Sparkles,
  Check,
  Target,
  TrendingUp
} from 'lucide-react';

/* ── score helpers ── */
function scoreColor(score) {
  if (score >= 90) return 'var(--success)';
  if (score >= 80) return 'var(--primary)';
  if (score >= 70) return 'var(--warning)';
  return 'var(--text-muted)';
}
function scoreBg(score) {
  if (score >= 90) return 'rgba(16,185,129,0.08)';
  if (score >= 80) return 'rgba(99,102,241,0.08)';
  if (score >= 70) return 'rgba(245,158,11,0.08)';
  return 'rgba(156,163,175,0.08)';
}
function scoreBorder(score) {
  if (score >= 90) return 'rgba(16,185,129,0.3)';
  if (score >= 80) return 'rgba(99,102,241,0.3)';
  if (score >= 70) return 'rgba(245,158,11,0.3)';
  return 'rgba(156,163,175,0.3)';
}

/* ── section heading ── */
function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: '0.69rem',
      fontWeight: '800',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      marginBottom: '10px',
    }}>
      {children}
    </div>
  );
}

export default function PartnerProfileModal({ partner, isOpen, onClose, onUpdateStatus }) {
  if (!isOpen || !partner) return null;

  const isRecommended = partner.status === 'recommended';
  const isShortlisted = partner.status === 'shortlisted';
  const isContacted   = partner.status === 'contacted';

  const techScore    = partner.technicalScore  || parseInt(partner.technicalMatch)  || 94;
  const geoScore     = partner.geographicScore || parseInt(partner.geographicMatch) || 92;
  const overallScore = partner.overallMatch    || partner.match                     || 90;

  const breakdownMetrics = [
    { label: 'Technical Match',  value: partner.technicalMatch  || `${techScore}%`,    num: techScore,    color: scoreColor(techScore) },
    { label: 'Geographic Match', value: partner.geographicMatch || `${geoScore}%`,     num: geoScore,     color: scoreColor(geoScore) },
    { label: 'Overall Score',    value: `${overallScore}%`,                             num: overallScore, color: scoreColor(overallScore) },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(2px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '14px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Avatar */}
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '10px',
              backgroundColor: isRecommended ? 'var(--success-bg)' : 'var(--info-bg)',
              color: isRecommended ? 'var(--success-text)' : 'var(--info-text)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Users size={22} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, lineHeight: '1.3' }}>
                {partner.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{partner.expertise}</span>
                {(partner.headquarters || partner.location) && (
                  <>
                    <span style={{ color: 'var(--border-color)' }}>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <MapPin size={11} /> {partner.headquarters || partner.location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              border: 'none', background: 'transparent',
              cursor: 'pointer', color: 'var(--text-muted)',
              padding: '4px', borderRadius: '6px', flexShrink: 0,
              lineHeight: 0,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Scrollable body — no horizontal scroll ── */}
        <div style={{ overflowY: 'auto', overflowX: 'hidden', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>


          {/* ── Partner Details grid ── */}
          <div>
            <SectionTitle>Partner Details</SectionTitle>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '10px',
            }}>
              {[
                { label: 'Expertise',   value: partner.expertise  },
                { label: 'Experience',  value: partner.experience },
                { label: 'Location',    value: partner.headquarters || partner.location },
                { label: 'Team Size',   value: partner.teamSize || '200+ Personnel' },
                { label: 'Contact',     value: partner.representative || 'Managing Director' },
                { label: 'Email',       value: partner.contactEmail || 'contact@partner.com' },
              ].filter(d => d.value).map(d => (
                <div key={d.label} style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                }}>
                  <div style={{ fontSize: '0.67rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                    {d.label}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', wordBreak: 'break-word' }}>
                    {d.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Why Recommended ── */}
          {partner.whyRecommended && (
            <div style={{
              padding: '14px 16px',
              backgroundColor: 'rgba(29,78,216,0.04)',
              borderLeft: '4px solid var(--primary)',
              borderRadius: '0 8px 8px 0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                <Sparkles size={14} /> Why Recommended
              </div>
              <p style={{ fontSize: '0.845rem', color: 'var(--text-main)', lineHeight: '1.55', margin: 0 }}>
                {partner.whyRecommended}
              </p>
            </div>
          )}

          {/* ── Match Information ── */}
          <div>
            <SectionTitle>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Target size={12} /> Match Information
              </span>
            </SectionTitle>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
            }}>
              {[
                { label: 'Technical Match',  value: partner.technicalMatch  || `${techScore}%`,    color: scoreColor(techScore),    bg: scoreBg(techScore),    border: scoreBorder(techScore) },
                { label: 'Geographic Match', value: partner.geographicMatch || `${geoScore}%`,     color: scoreColor(geoScore),     bg: scoreBg(geoScore),     border: scoreBorder(geoScore) },
                { label: 'Overall Score',    value: `${overallScore}%`,                             color: scoreColor(overallScore), bg: scoreBg(overallScore), border: scoreBorder(overallScore) },
              ].map(m => (
                <div key={m.label} style={{
                  padding: '12px',
                  backgroundColor: m.bg,
                  border: `1px solid ${m.border}`,
                  borderRadius: '8px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.67rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: m.color }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bridges Gaps ── */}
          {partner.capabilitiesCovered?.length > 0 && (
            <div>
              <SectionTitle>Bridges Capability Gaps</SectionTitle>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {partner.capabilitiesCovered.map((cap, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontSize: '0.78rem', fontWeight: '600',
                    padding: '5px 10px', borderRadius: '9999px',
                    backgroundColor: 'var(--success-bg)', color: 'var(--success-text)',
                    border: '1px solid rgba(16,185,129,0.3)',
                  }}>
                    <CheckCircle2 size={12} color="var(--success)" /> {cap}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Match Breakdown (vertical bars) ── */}
          <div>
            <SectionTitle>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <TrendingUp size={12} /> Match Breakdown
              </span>
            </SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {breakdownMetrics.map(m => (
                <div key={m.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>
                      {m.label}
                    </span>
                    <strong style={{ fontSize: '0.95rem', fontWeight: '800', color: m.color }}>
                      {m.value}
                    </strong>
                  </div>
                  <div style={{ width: '100%', height: '7px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: m.value,
                      height: '100%',
                      backgroundColor: m.color,
                      borderRadius: '9999px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Past Projects ── */}
          {partner.pastProjects?.length > 0 && (
            <div>
              <SectionTitle>Key Benchmark Projects</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {partner.pastProjects.map((proj, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.8rem',
                  }}>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{proj.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                        Client: {proj.client} · {proj.year}
                      </div>
                    </div>
                    <span style={{
                      fontWeight: '700', color: 'var(--primary)',
                      padding: '2px 8px', borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-card)',
                      fontSize: '0.78rem',
                      whiteSpace: 'nowrap',
                      marginLeft: '8px',
                    }}>
                      {proj.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Partner Status / actions (at bottom) ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap',
            padding: '14px 16px',
            backgroundColor: isRecommended ? 'rgba(16,185,129,0.06)' : 'var(--bg-subtle)',
            borderRadius: '10px',
            border: `1px solid ${isRecommended ? 'rgba(16,185,129,0.25)' : 'var(--border-color)'}`,
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginRight: 'auto' }}>
              Partner Status
            </span>

            {/* Shortlist */}
            <button
              onClick={() => onUpdateStatus(partner.id, isShortlisted ? 'none' : 'shortlisted')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: '600',
                border: `1px solid ${isShortlisted ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: isShortlisted ? 'var(--primary-light)' : 'transparent',
                color: isShortlisted ? 'var(--primary)' : 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              <Star size={13} />
              {isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}
            </button>

            {/* Mark Contacted */}
            <button
              onClick={() => onUpdateStatus(partner.id, isContacted ? 'none' : 'contacted')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: '600',
                border: `1px solid ${isContacted ? '#9333EA' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: isContacted ? 'rgba(147,51,234,0.1)' : 'transparent',
                color: isContacted ? '#9333EA' : 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              <MessageSquare size={13} />
              {isContacted ? 'Contacted ✓' : 'Mark Contacted'}
            </button>

            {/* Recommend — turns green when active */}
            <button
              onClick={() => onUpdateStatus(partner.id, isRecommended ? 'none' : 'recommended')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '0.38rem 0.9rem', fontSize: '0.8rem', fontWeight: '700',
                border: `1px solid ${isRecommended ? 'var(--success)' : 'var(--primary)'}`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: isRecommended ? 'var(--success)' : 'var(--primary)',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {isRecommended ? '✓ Recommended' : 'Recommend'}
            </button>
          </div>

          {/* bottom padding */}
          <div style={{ height: '4px' }} />
        </div>
      </div>
    </div>
  );
}

