import React, { useState } from 'react';
import { Download, BarChart2 } from 'lucide-react';

export default function ReportsView() {
  const [timeRange, setTimeRange] = useState('Monthly');

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Reports & Analytics</h2>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['Daily', 'Weekly', 'Monthly'].map(t => (
            <button
              key={t}
              className={`btn ${timeRange === t ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem' }}
              onClick={() => setTimeRange(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <div className="card-title">Total Opportunities</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>150</div>
        </div>
        <div className="card">
          <div className="card-title">High Priority</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--danger)' }}>14</div>
        </div>
        <div className="card">
          <div className="card-title">Average AI Score</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)' }}>8.4</div>
        </div>
        <div className="card">
          <div className="card-title">Pursued</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success)' }}>35</div>
        </div>
        <div className="card">
          <div className="card-title">Declined</div>
          <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>12</div>
        </div>
      </div>

      {/* Chart Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-title">Opportunity Performance</div>
          <div style={{ width: '100%', height: '180px', marginTop: '1rem' }}>
            <svg viewBox="0 0 400 150" style={{ width: '100%', height: '100%' }}>
              {[
                { x: 30, h: 80, label: 'Apr' },
                { x: 80, h: 100, label: 'May' },
                { x: 130, h: 60, label: 'Jun' },
                { x: 180, h: 120, label: 'Jul' },
                { x: 230, h: 90, label: 'Aug' },
                { x: 280, h: 110, label: 'Sep' },
                { x: 330, h: 70, label: 'Oct' }
              ].map((bar, i) => (
                <g key={i}>
                  <rect x={bar.x} y={130 - bar.h} width="24" height={bar.h} fill="#2563EB" rx="3" />
                  <text x={bar.x + 12} y="145" fontSize="10" textAnchor="middle" fill="#64748B">{bar.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title">Score Distribution</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Overall distribution of AI matching accuracy across all tracked tenders.
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'conic-gradient(#10B981 0% 40%, #0284C7 40% 68%, #F59E0B 68% 86%, #CBD5E1 86% 100%)' }} />
              <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div><strong style={{ color: '#10B981' }}>■ 9-10</strong>: 40%</div>
                <div><strong style={{ color: '#0284C7' }}>■ 7-8</strong>: 28%</div>
                <div><strong style={{ color: '#F59E0B' }}>■ 5-6</strong>: 18%</div>
                <div><strong style={{ color: '#CBD5E1' }}>■ 1-4</strong>: 14%</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.75rem' }}>
              <Download size={14} /> Download PDF
            </button>
            <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.75rem' }}>
              <Download size={14} /> Download Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
