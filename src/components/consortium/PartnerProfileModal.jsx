import React, { useState } from 'react';
import {
  X,
  Users,
  MapPin,
  CheckCircle2,
  ThumbsUp,
  Star,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Target,
  Mail,
  Phone,

} from 'lucide-react';

/* ── score helpers ── */
function scoreColor(score) {
  if (score >= 90) return 'var(--success)';
  if (score >= 80) return 'var(--primary)';
  if (score >= 70) return 'var(--warning)';
  return 'var(--text-muted)';
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

/* ── thin horizontal divider ── */
function SectionDivider() {
  return (
    <div style={{
      height: '1px',
      backgroundColor: 'var(--border-color, #E2E8F0)',
      margin: '4px 0',
    }} />
  );
}



/* ── Document helper — generate a downloadable blob for demo ── */
function generateDocBlob(docName, partner) {
  const content = `${docName}\n\nPartner: ${partner.name}\nExpertise: ${partner.expertise || ''}\nGenerated for demonstration purposes.`;
  return new Blob([content], { type: 'text/plain' });
}

function getFileType(docName) {
  if (docName.toLowerCase().includes('certification')) return 'PDF';
  if (docName.toLowerCase().includes('profile')) return 'PDF';
  if (docName.toLowerCase().includes('experience')) return 'PDF';
  return 'PDF';
}


export default function PartnerProfileModal({ partner, isOpen, onClose, onUpdateStatus, requirements }) {


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

  /* ── Contact info ── */
  const contactPerson = partner.representative || 'Managing Director';
  const contactEmail  = partner.contactEmail || 'contact@partner.com';
  const contactPhone  = partner.contactPhone || '+91 XX XXXX XXXX';




  /* ── Small action button helper ── */
  const SmallBtn = ({ children, onClick, bg, color, border }) => (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: '600',
        border: `1px solid ${border || 'var(--border-color)'}`,
        borderRadius: 'var(--radius-md, 6px)',
        backgroundColor: bg || 'transparent',
        color: color || 'var(--text-main)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  );

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
        {/* ── Header (fixed) ── */}
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

        {/* ── Scrollable body ── */}
        <div style={{ overflowY: 'auto', overflowX: 'hidden', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>


          {/* ═══ 1. PARTNER DETAILS ═══ */}
          <div>
            <SectionTitle>Partner Details</SectionTitle>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '10px',
            }}>
              {[
                { label: 'Company Name', value: partner.name },
                { label: 'Expertise',    value: partner.expertise },
                { label: 'Experience',   value: partner.experience },
                { label: 'Location',     value: partner.headquarters || partner.location },
                { label: 'Team Size',    value: partner.teamSize || '200+ Personnel' },
                { label: 'Contact Person', value: partner.representative || 'Managing Director' },
                { label: 'Email',        value: partner.contactEmail || 'contact@partner.com' },
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

          <SectionDivider />

          {/* ═══ 2. WHY RECOMMENDED ═══ */}
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

          <SectionDivider />

          {/* ═══ 3. BRIDGES CAPABILITY GAPS ═══ */}
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

          <SectionDivider />

          {/* ═══ 4. MATCH BREAKDOWN ═══ */}
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

          <SectionDivider />

          {/* ═══ 5. KEY BENCHMARK PROJECTS ═══ */}
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

          <SectionDivider />

          {/* ═══ 6. TENDER RELEVANCE ═══ */}
          <div>
            <SectionTitle>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Target size={12} /> Tender Relevance
              </span>
            </SectionTitle>

            {/* Relevance callout */}
            <div style={{
              padding: '14px 16px',
              backgroundColor: 'rgba(99,102,241,0.04)',
              borderLeft: '4px solid var(--primary)',
              borderRadius: '0 8px 8px 0',
              marginBottom: '12px',
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.55', marginBottom: '8px' }}>
                {partner.whyRecommended
                  ? `${partner.name} is relevant to this tender due to their specialization in ${partner.expertise} and proven track record in the ${requirements?.location || 'target'} region.`
                  : `${partner.name} has capabilities that align with the tender requirements.`
                }
              </div>
              {requirements?.opportunityName && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Tender: <strong style={{ color: 'var(--text-main)' }}>{requirements.opportunityName}</strong>
                  {requirements.tenderCode && <> · {requirements.tenderCode}</>}
                </div>
              )}
            </div>

            {/* Relevant sector / experience tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(partner.allCapabilities || []).map((cap, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.75rem', fontWeight: '600',
                  padding: '4px 10px', borderRadius: '9999px',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                }}>
                  {cap}
                </span>
              ))}
              {partner.experience && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.75rem', fontWeight: '700',
                  padding: '4px 10px', borderRadius: '9999px',
                  backgroundColor: 'rgba(16,185,129,0.08)',
                  color: 'var(--success)',
                  border: '1px solid rgba(16,185,129,0.25)',
                }}>
                  {partner.experience} Experience
                </span>
              )}
            </div>
          </div>

          <SectionDivider />

          {/* ═══ 7. CONTACT ═══ */}
          <div>
            <SectionTitle>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={12} /> Contact
              </span>
            </SectionTitle>

            <div style={{
              padding: '14px 16px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              {/* Contact details grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.67rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                    Contact Person
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    {contactPerson}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.67rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                    Email
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--primary)', wordBreak: 'break-all' }}>
                    {contactEmail}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.67rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                    Phone
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    {contactPhone}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <SmallBtn
                  onClick={() => window.open(`mailto:${contactEmail}`, '_blank')}
                  bg="rgba(29,78,216,0.06)"
                  color="var(--primary)"
                  border="rgba(29,78,216,0.2)"
                >
                  <Mail size={13} /> Send Email
                </SmallBtn>
                <SmallBtn
                  onClick={() => window.open(`tel:${contactPhone.replace(/\s/g, '')}`, '_blank')}
                  bg="rgba(16,185,129,0.06)"
                  color="var(--success)"
                  border="rgba(16,185,129,0.2)"
                >
                  <Phone size={13} /> Call
                </SmallBtn>
              </div>
            </div>
          </div>



          <SectionDivider />

          {/* ═══ 10. PARTNER STATUS (LAST) ═══ */}
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
                border: `1px solid ${isShortlisted ? '#2563EB' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: isShortlisted ? '#2563EB' : 'transparent',
                color: isShortlisted ? '#ffffff' : 'var(--text-main)',
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

            {/* Recommend */}
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
