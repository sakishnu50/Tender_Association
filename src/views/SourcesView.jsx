import React from 'react';
import { Globe, CheckCircle2 } from 'lucide-react';
import { mockSources } from '../data/mockData';
import { useSources } from '../hooks/useApiQueries';

export default function SourcesView() {
  const { data: fetchedSources } = useSources();
  const sourcesList = fetchedSources || mockSources;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Monitored Sources</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {sourcesList.map((source, idx) => (
          <div key={idx} className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--info-bg)',
              color: 'var(--info-text)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              <Globe size={24} />
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>{source.name}</h3>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <strong>{source.projects}</strong> Projects Tracked
            </div>

            <span className="badge badge-new" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={12} /> {source.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
