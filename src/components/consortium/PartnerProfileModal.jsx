import React from 'react';
import {
  X,
  Users,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ThumbsUp,
  Star,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function PartnerProfileModal({
  partner,
  isOpen,
  onClose,
  onUpdateStatus
}) {
  if (!isOpen || !partner) return null;

  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--success)';
    if (score >= 80) return 'var(--primary)';
    if (score >= 70) return 'var(--warning)';
    return 'var(--text-muted)';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'var(--success-bg)';
    if (score >= 80) return 'var(--primary-light)';
    if (score >= 70) return 'var(--warning-bg)';
    return 'var(--bg-subtle)';
  };

  const isRecommended = partner.status === 'recommended';
  const isShortlisted = partner.status === 'shortlisted';
  const isContacted = partner.status === 'contacted';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '680px', width: '92vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--info-bg)',
              color: 'var(--info-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              flexShrink: 0
            }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  {partner.name}
                </h3>
                {partner.status && partner.status !== 'none' && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    backgroundColor: isRecommended ? 'var(--success-bg)' : isShortlisted ? 'var(--primary-light)' : 'rgba(147, 51, 234, 0.15)',
                    color: isRecommended ? 'var(--success-text)' : isShortlisted ? 'var(--primary)' : '#7E22CE',
                    border: `1px solid ${isRecommended ? 'var(--success)' : isShortlisted ? 'var(--primary)' : '#9333EA'}`
                  }}>
                    {partner.status === 'recommended' && '✓ Recommended'}
                    {partner.status === 'shortlisted' && '★ Shortlisted'}
                    {partner.status === 'contacted' && '✉ Contacted'}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                <span>{partner.expertise}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin size={12} /> {partner.headquarters || partner.location}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body" style={{ padding: '1.5rem', overflowY: 'auto', gap: '1.25rem' }}>
          
          {/* Detailed Match Breakdown Section */}
          <div style={{
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                <TrendingUp size={18} color="var(--primary)" />
                <span>AI Consortium Match Breakdown</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: getScoreBg(partner.overallMatch || 90),
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                border: `1px solid ${getScoreColor(partner.overallMatch || 90)}`
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Overall Match:</span>
                <strong style={{ fontSize: '0.95rem', color: getScoreColor(partner.overallMatch || 90) }}>
                  {partner.overallMatch || partner.match}%
                </strong>
              </div>
            </div>

            {/* Score Bars Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {/* Technical Match */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)' }}>Technical Match</span>
                  <span style={{ color: 'var(--success)', fontWeight: '700' }}>{partner.technicalMatch || `${partner.technicalScore}%`}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: partner.technicalMatch || `${partner.technicalScore}%`, height: '100%', backgroundColor: 'var(--success)', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                </div>
              </div>

              {/* Experience Match */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)' }}>Experience Match</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{partner.experienceMatch || `${partner.experienceScore}%`}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: partner.experienceMatch || `${partner.experienceScore}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                </div>
              </div>

              {/* Geographic Match */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)' }}>Geographic Match</span>
                  <span style={{ color: 'var(--info)', fontWeight: '700' }}>{partner.geographicMatch || `${partner.geographicScore}%`}</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: partner.geographicMatch || `${partner.geographicScore}%`, height: '100%', backgroundColor: 'var(--info)', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                </div>
              </div>

              {/* Overall Match Score */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-main)' }}>Overall Match Score</span>
                  <span style={{ color: getScoreColor(partner.overallMatch || 90), fontWeight: '700' }}>{partner.overallMatch || partner.match}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${partner.overallMatch || 90}%`, height: '100%', backgroundColor: getScoreColor(partner.overallMatch || 90), borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Why Recommended Highlight Box */}
          <div style={{
            backgroundColor: 'rgba(29, 78, 216, 0.05)',
            borderLeft: '4px solid var(--primary)',
            padding: '1rem',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.825rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.35rem' }}>
              <Sparkles size={16} />
              <span>Why Recommended:</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.5', margin: 0 }}>
              {partner.whyRecommended}
            </p>
          </div>

          {/* Missing Capabilities Covered */}
          {partner.capabilitiesCovered && partner.capabilitiesCovered.length > 0 && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Solves Mukesh & Associates Gap:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {partner.capabilitiesCovered.map((cap, idx) => (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      padding: '0.3rem 0.65rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--success-bg)',
                      color: 'var(--success-text)',
                      border: '1px solid var(--success)'
                    }}
                  >
                    <CheckCircle2 size={13} color="var(--success)" />
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Past Project Experience */}
          {partner.pastProjects && partner.pastProjects.length > 0 && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Key Benchmark Projects:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {partner.pastProjects.map((proj, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{proj.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Client: {proj.client} • Year: {proj.year}</div>
                    </div>
                    <span style={{ fontWeight: '700', color: 'var(--primary)', backgroundColor: 'var(--bg-card)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      {proj.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Details & Contact Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            fontSize: '0.8rem'
          }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', textTransform: 'uppercase', fontWeight: '700' }}>
                Representative Contact
              </span>
              <strong style={{ color: 'var(--text-main)' }}>{partner.representative || 'Managing Director'}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', textTransform: 'uppercase', fontWeight: '700' }}>
                Email
              </span>
              <span style={{ color: 'var(--primary)', fontWeight: '500' }}>{partner.contactEmail || 'contact@partner.com'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', textTransform: 'uppercase', fontWeight: '700' }}>
                Phone
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{partner.contactPhone || '+91 80 4000 0000'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.725rem', textTransform: 'uppercase', fontWeight: '700' }}>
                Team Size & Certifications
              </span>
              <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{partner.teamSize || '200+ Personnel'}</span>
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="modal-footer" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn btn-outline" onClick={onClose} style={{ fontSize: '0.825rem' }}>
            Close
          </button>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              className="btn btn-outline"
              onClick={() => onUpdateStatus(partner.id, 'shortlisted')}
              style={{
                fontSize: '0.8rem',
                backgroundColor: isShortlisted ? 'var(--primary-light)' : 'transparent',
                borderColor: isShortlisted ? 'var(--primary)' : 'var(--border-color)',
                color: isShortlisted ? 'var(--primary)' : 'var(--text-main)'
              }}
            >
              <Star size={14} /> {isShortlisted ? 'Shortlisted ✓' : 'Shortlist'}
            </button>

            <button
              className="btn btn-outline"
              onClick={() => onUpdateStatus(partner.id, 'contacted')}
              style={{
                fontSize: '0.8rem',
                backgroundColor: isContacted ? 'rgba(147, 51, 234, 0.1)' : 'transparent',
                borderColor: isContacted ? '#9333EA' : 'var(--border-color)',
                color: isContacted ? '#9333EA' : 'var(--text-main)'
              }}
            >
              <MessageSquare size={14} /> {isContacted ? 'Contacted ✓' : 'Mark Contacted'}
            </button>

            <button
              className="btn btn-primary"
              onClick={() => onUpdateStatus(partner.id, isRecommended ? 'none' : 'recommended')}
              style={{
                fontSize: '0.825rem',
                backgroundColor: isRecommended ? 'var(--success)' : 'var(--primary)'
              }}
            >
              <ThumbsUp size={14} /> {isRecommended ? 'Recommended ✓' : 'Recommend Partner'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
