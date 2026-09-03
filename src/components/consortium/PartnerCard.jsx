import React, { useState } from 'react';
import {
  Users,
  ExternalLink,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle2,
  Star,
  MessageSquare,
  Check
} from 'lucide-react';

export default function PartnerCard({
  partner,
  onViewProfile,
  onUpdateStatus
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const isRecommended = partner.status === 'recommended';
  const isShortlisted = partner.status === 'shortlisted';
  const isContacted = partner.status === 'contacted';

  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--success)';
    if (score >= 80) return 'var(--primary)';
    if (score >= 70) return 'var(--warning)';
    return 'var(--text-muted)';
  };

  const handleRecommendClick = (e) => {
    e.stopPropagation();
    // Toggle recommended status
    if (isRecommended) {
      onUpdateStatus(partner.id, 'none');
    } else {
      onUpdateStatus(partner.id, 'recommended');
    }
  };

  const handleSelectStatus = (e, status) => {
    e.stopPropagation();
    onUpdateStatus(partner.id, status);
    setShowStatusMenu(false);
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        border: isRecommended ? '1.5px solid var(--success)' : isShortlisted ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
    >
      {/* Top Main Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Left Side: Avatar, Name & Metadata */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 340px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: isRecommended ? 'var(--success-bg)' : isShortlisted ? 'var(--primary-light)' : 'var(--info-bg)',
            color: isRecommended ? 'var(--success-text)' : isShortlisted ? 'var(--primary)' : 'var(--info-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            flexShrink: 0,
            transition: 'all 0.2s ease'
          }}>
            <Users size={22} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                {partner.name}
              </h3>

              {/* Recommendation Status Badges */}
              {isRecommended && (
                <span className="badge badge-new" style={{ fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Check size={11} /> Recommended
                </span>
              )}
              {isShortlisted && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <Star size={11} /> Shortlisted
                </span>
              )}
              {isContacted && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(147, 51, 234, 0.12)',
                  color: '#7E22CE',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <MessageSquare size={11} /> Contacted
                </span>
              )}
            </div>

            {/* Metrics Row */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.25rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginTop: '0.1rem'
            }}>
              <span>
                Technical Match: <strong style={{ color: 'var(--success)' }}>{partner.technicalMatch || partner.match}</strong>
              </span>
              <span>
                Geographic Match: <strong style={{ color: 'var(--info)' }}>{partner.geographicMatch || '92%'}</strong>
              </span>
              <span>
                Expertise: <strong>{partner.expertise}</strong>
              </span>
              <span>
                Experience: <strong>{partner.experience}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', position: 'relative' }}>
          {/* Expand Breakdown Toggle */}
          <button
            className="btn btn-outline"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ fontSize: '0.75rem', padding: '0.45rem 0.7rem' }}
            title="Toggle Match Breakdown"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={14} /> Hide Breakdown
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Match Breakdown
              </>
            )}
          </button>

          {/* View Profile Button */}
          <button
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem' }}
            onClick={() => onViewProfile(partner)}
          >
            <ExternalLink size={14} /> View Profile
          </button>

          {/* Recommend Button with Quick Menu */}
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              className={`btn ${isRecommended ? 'btn-success' : 'btn-primary'}`}
              style={{
                fontSize: '0.75rem',
                padding: '0.45rem 0.85rem',
                backgroundColor: isRecommended ? 'var(--success)' : 'var(--primary)'
              }}
              onClick={handleRecommendClick}
            >
              <ThumbsUp size={14} /> {isRecommended ? 'Recommended' : 'Recommend'}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusMenu(!showStatusMenu);
              }}
              style={{
                borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                backgroundColor: isRecommended ? 'var(--success)' : 'var(--primary)',
                color: '#FFFFFF',
                padding: '0 0.4rem',
                cursor: 'pointer',
                borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                display: 'flex',
                alignItems: 'center'
              }}
              title="More Status Options"
            >
              <ChevronDown size={12} />
            </button>

            {/* Dropdown Options */}
            {showStatusMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.25rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 20,
                minWidth: '150px',
                overflow: 'hidden'
              }}>
                <button
                  onClick={(e) => handleSelectStatus(e, 'recommended')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    background: isRecommended ? 'var(--bg-subtle)' : 'transparent',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <ThumbsUp size={14} color="var(--success)" />
                  <span>Recommend</span>
                </button>
                <button
                  onClick={(e) => handleSelectStatus(e, 'shortlisted')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    background: isShortlisted ? 'var(--bg-subtle)' : 'transparent',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Star size={14} color="var(--primary)" />
                  <span>Shortlist</span>
                </button>
                <button
                  onClick={(e) => handleSelectStatus(e, 'contacted')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    border: 'none',
                    background: isContacted ? 'var(--bg-subtle)' : 'transparent',
                    color: 'var(--text-main)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <MessageSquare size={14} color="#9333EA" />
                  <span>Mark Contacted</span>
                </button>
                {partner.status && partner.status !== 'none' && (
                  <button
                    onClick={(e) => handleSelectStatus(e, 'none')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      borderTop: '1px solid var(--border-color)',
                      background: 'transparent',
                      color: 'var(--danger)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <span>Clear Status</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Why Recommended Callout Snippet */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem',
        padding: '0.65rem 0.85rem',
        backgroundColor: 'rgba(29, 78, 216, 0.04)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(29, 78, 216, 0.1)',
        fontSize: '0.825rem',
        color: 'var(--text-main)'
      }}>
        <Sparkles size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--primary)', marginRight: '0.35rem' }}>Why Recommended:</strong>
          <span>{partner.whyRecommended}</span>
        </div>
      </div>

      {/* Missing Capabilities Bridged Badges */}
      {partner.capabilitiesCovered && partner.capabilitiesCovered.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.775rem' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Bridges Gaps:</span>
          {partner.capabilitiesCovered.map((cap, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success-text)',
                fontWeight: '600'
              }}
            >
              <CheckCircle2 size={12} /> {cap}
            </span>
          ))}
        </div>
      )}

      {/* Expandable Match Breakdown Drawer */}
      {isExpanded && (
        <div style={{
          marginTop: '0.25rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          animation: 'fadeIn 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Detailed Match Breakdown
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: getScoreColor(partner.overallMatch || 90) }}>
              Overall Score: {partner.overallMatch || partner.match}%
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.875rem' }}>
            {/* Technical Match Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Technical Match</span>
                <strong style={{ color: 'var(--success)' }}>{partner.technicalMatch || '94%'}</strong>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: partner.technicalMatch || '94%', height: '100%', backgroundColor: 'var(--success)', borderRadius: '9999px' }} />
              </div>
            </div>

            {/* Experience Match Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Experience Match</span>
                <strong style={{ color: 'var(--primary)' }}>{partner.experienceMatch || '88%'}</strong>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: partner.experienceMatch || '88%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '9999px' }} />
              </div>
            </div>

            {/* Geographic Match Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Geographic Match</span>
                <strong style={{ color: 'var(--info)' }}>{partner.geographicMatch || '92%'}</strong>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: partner.geographicMatch || '92%', height: '100%', backgroundColor: 'var(--info)', borderRadius: '9999px' }} />
              </div>
            </div>

            {/* Overall Match Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Overall Match Score</span>
                <strong style={{ color: getScoreColor(partner.overallMatch || 90) }}>{partner.overallMatch || partner.match}%</strong>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${partner.overallMatch || 90}%`, height: '100%', backgroundColor: getScoreColor(partner.overallMatch || 90), borderRadius: '9999px' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
