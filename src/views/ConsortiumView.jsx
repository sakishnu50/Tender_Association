import React from 'react';
import { Users, Award, ExternalLink, ThumbsUp } from 'lucide-react';
import { mockConsortium } from '../data/mockData';

export default function ConsortiumView() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Consortium Recommendations</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Opportunity: <strong>Highway Development Project</strong>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {mockConsortium.map((partner) => (
          <div
            key={partner.id}
            className="card"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--info-bg)',
                color: 'var(--info-text)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                fontWeight: '800'
              }}>
                <Users size={22} />
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {partner.name}
                </h3>
                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  <span>Technical Match: <strong style={{ color: 'var(--success)' }}>{partner.match}</strong></span>
                  <span>Expertise: <strong>{partner.expertise}</strong></span>
                  <span>Experience: <strong>{partner.experience}</strong></span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ fontSize: '0.75rem' }}>
                <ExternalLink size={14} /> View Profile
              </button>
              <button className="btn btn-primary" style={{ fontSize: '0.75rem' }}>
                <ThumbsUp size={14} /> Recommend
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
