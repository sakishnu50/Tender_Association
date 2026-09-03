import React from 'react';
import { Building2, MapPin, Calendar, Tag, Briefcase } from 'lucide-react';

/**
 * Section 3 — Similar Past Projects
 * Props:
 *   projects – Array of { id, name, client, sector, location, status, completionDate, similarity }
 */
export default function SimilarProjects({ projects = [] }) {
  if (!projects.length) return null;

  return (
    <div className="card">
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Briefcase size={16} color="#059669" />
          </div>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
              Similar Past Projects
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>
              Mukesh &amp; Associates' relevant completed work
            </p>
          </div>
        </div>
        <span style={{
          fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)',
          background: 'var(--bg-subtle)', padding: '0.2rem 0.6rem',
          borderRadius: 9999, border: '1px solid var(--border-color)'
        }}>
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="similar-grid">
        {projects.map((proj) => {
          const isCompleted = proj.status === 'Completed';
          return (
            <div key={proj.id} className="similar-card">
              {/* Name + status */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="similar-card-name">{proj.name}</span>
                <span className={isCompleted ? 'status-pill-completed' : 'status-pill-ongoing'} style={{ flexShrink: 0, marginTop: 2 }}>
                  {proj.status}
                </span>
              </div>

              {/* Metadata */}
              <div className="similar-card-meta">
                <span><Building2 size={12} />{proj.client}</span>
                <span><Tag       size={12} />{proj.sector}</span>
                <span><MapPin   size={12} />{proj.location}</span>
                <span>
                  <Calendar size={12} />
                  {isCompleted ? `Completed ${proj.completionDate}` : `Est. ${proj.completionDate}`}
                </span>
              </div>

              {/* Similarity badge + bar */}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.625rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Similarity
                  </span>
                  <span style={{
                    fontSize: '0.875rem', fontWeight: 800, color: '#059669',
                    background: '#F0FDF4', padding: '0.1rem 0.5rem',
                    borderRadius: 9999, border: '1px solid #BBF7D0'
                  }}>
                    {proj.similarity}% Similar
                  </span>
                </div>
                <div className="similar-score-bar-track">
                  <div
                    className="similar-score-bar-fill"
                    style={{ '--bar-width': `${proj.similarity}%`, width: `${proj.similarity}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
