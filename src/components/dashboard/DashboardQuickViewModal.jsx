import React from 'react';
import { X, Calendar, MapPin, Building, Award, FileText, CheckCircle, XCircle, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default function DashboardQuickViewModal({ opportunity, isOpen, onClose, onPursue, onDecline }) {
  if (!isOpen || !opportunity) return null;

  const getScoreColor = (score) => {
    if (score >= 9.0) return { bg: '#D1FAE5', text: '#065F46', border: '#10B981' };
    if (score >= 8.0) return { bg: '#E0F2FE', text: '#075985', border: '#0284C7' };
    if (score >= 7.0) return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' };
    return { bg: '#F3F4F6', text: '#374151', border: '#9CA3AF' };
  };

  const scoreStyle = getScoreColor(opportunity.aiScore || 8.5);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'var(--bg-subtle)',
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {opportunity.id || 'TENDER'}
              </span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '0.2rem 0.5rem',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-color)'
              }}>
                {opportunity.source || 'Public Source'}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', lineHeight: '1.3' }}>
              {opportunity.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.35rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Key Metrics Banner */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: '0.75rem',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Award size={14} color="var(--primary)" /> AI Match Score
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: '800',
                color: scoreStyle.text,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: '0.25rem'
              }}>
                {opportunity.aiScore || 8.5} / 10
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Building size={14} color="var(--info)" /> Project Value
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                {opportunity.value || '₹5.00 Crore'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={14} color="var(--warning)" /> Location
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '0.25rem' }}>
                {opportunity.location || 'Pan India'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} color="var(--danger)" /> Submission Deadline
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--danger)', marginTop: '0.25rem' }}>
                {opportunity.deadline || '15 Sep 2028'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} color="var(--primary)" /> Project Description & Scope
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {opportunity.description || 'Infrastructure tender targeting modern urban, highway, or sanitation developments with high strategic fit for consortium partners.'}
            </p>
          </div>

          {/* AI Matching Criteria */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="var(--success)" /> AI Strategic Compatibility Factors
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(opportunity.scoreFactors || ['Sector Match', 'Location Match', 'Capability Match', 'Past Performance']).map((factor, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--success-bg)',
                    color: 'var(--success-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <Zap size={12} /> {factor}
                </span>
              ))}
            </div>
          </div>

          {/* Documents */}
          {opportunity.documents && opportunity.documents.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Attached Procurement Documents
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {opportunity.documents.map((doc, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
                      <FileText size={14} color="var(--primary)" /> {doc}
                    </span>
                    <button style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      Download <ExternalLink size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-subtle)',
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem'
        }}>
          <button
            onClick={onClose}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem' }}
          >
            Close Preview
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => {
                if (onDecline) onDecline(opportunity);
                onClose();
              }}
              className="btn"
              style={{
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger-text)',
                border: '1px solid var(--danger)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.85rem'
              }}
            >
              <XCircle size={14} /> Decline
            </button>

            <button
              onClick={() => {
                if (onPursue) onPursue(opportunity);
                onClose();
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}
            >
              <CheckCircle size={14} /> Pursue Tender
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
