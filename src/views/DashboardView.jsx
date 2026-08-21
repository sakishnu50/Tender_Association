import React from 'react';
import { Eye, ArrowUpRight, TrendingUp, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { mockOpportunities } from '../data/mockData';

export default function DashboardView({ onSelectOpportunity, onViewAll }) {
  return (
    <div className="page-container">
      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        {/* KPI 1 */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title">Total Opportunities</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              150
              <TrendingUp size={20} color="var(--primary)" />
            </div>
          </div>
          <button
            onClick={onViewAll}
            style={{ border: 'none', background: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            view all <ArrowUpRight size={12} />
          </button>
        </div>

        {/* KPI 2 */}
        <div className="card">
          <div className="card-title">New Opportunities</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            32
            <CheckCircle size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Added this week</div>
        </div>

        {/* KPI 3 */}
        <div className="card">
          <div className="card-title">High Priority</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--danger)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            14
            <AlertTriangle size={20} color="var(--danger)" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.5rem', fontWeight: '500' }}>Requires immediate review</div>
        </div>

        {/* KPI 4 */}
        <div className="card">
          <div className="card-title">Closing Soon</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            9
            <Clock size={20} color="var(--success)" />
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Closing within 5 days</div>
        </div>
      </div>

      {/* Visual Analytics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {/* Trend Line Chart SVG */}
        <div className="card">
          <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Opportunities Trend</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Apr - Oct 2028</span>
          </div>
          <div style={{ width: '100%', height: '160px', marginTop: '1rem', position: 'relative' }}>
            <svg viewBox="0 0 400 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <line x1="0" y1="30" x2="400" y2="30" stroke="#E2E8F0" strokeDasharray="4 4" />
              <line x1="0" y1="70" x2="400" y2="70" stroke="#E2E8F0" strokeDasharray="4 4" />
              <line x1="0" y1="110" x2="400" y2="110" stroke="#E2E8F0" strokeDasharray="4 4" />

              <path
                d="M 10 100 L 70 120 L 130 80 L 190 100 L 250 50 L 310 90 L 370 40"
                fill="none"
                stroke="#0284C7"
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              {[
                { x: 10, y: 100, label: 'Apr' },
                { x: 70, y: 120, label: 'May' },
                { x: 130, y: 80, label: 'Jun' },
                { x: 190, y: 100, label: 'Jul' },
                { x: 250, y: 50, label: 'Aug' },
                { x: 310, y: 90, label: 'Sep' },
                { x: 370, y: 40, label: 'Oct' }
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
                  <text x={pt.x} y="138" fontSize="10" textAnchor="middle" fill="#64748B">{pt.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* AI Score Distribution Donut */}
        <div className="card">
          <div className="card-title">AI Score Distribution</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', gap: '1.5rem' }}>
            <div style={{ width: '120px', height: '120px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path stroke="#E2E8F0" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path stroke="#10B981" strokeWidth="4" strokeDasharray="40, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path stroke="#0284C7" strokeWidth="4" strokeDasharray="28, 100" strokeDashoffset="-40" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path stroke="#F59E0B" strokeWidth="4" strokeDasharray="18, 100" strokeDashoffset="-68" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>150</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Total</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#10B981' }} />
                <span><strong>9-10</strong> (40%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#0284C7' }} />
                <span><strong>7-8</strong> (28%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#F59E0B' }} />
                <span><strong>5-6</strong> (18%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#CBD5E1' }} />
                <span><strong>1-4</strong> (14%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Source Distribution Pie */}
        <div className="card">
          <div className="card-title">Source Distribution</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', gap: '1.5rem' }}>
            <div style={{ width: '120px', height: '120px' }}>
              <svg viewBox="0 0 32 32" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)', borderRadius: '50%' }}>
                <circle r="16" cx="16" cy="16" fill="#0284C7" />
                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#2563EB" strokeWidth="32" strokeDasharray="35 100" />
                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#F59E0B" strokeWidth="32" strokeDasharray="25 100" strokeDashoffset="-35" />
                <circle r="16" cx="16" cy="16" fill="transparent" stroke="#10B981" strokeWidth="32" strokeDasharray="20 100" strokeDashoffset="-60" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#2563EB' }} />
                <span>World Bank</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#F59E0B' }} />
                <span>ADB</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#10B981' }} />
                <span>JICA</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#0284C7' }} />
                <span>AIIB / Others</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Opportunities Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>Recent Opportunities</h3>
          <button className="btn btn-outline" onClick={onViewAll} style={{ fontSize: '0.75rem' }}>
            View All Opportunities
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Source</th>
                <th>Location</th>
                <th>AI Score</th>
                <th>Deadline</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockOpportunities.slice(0, 4).map((opp) => (
                <tr key={opp.id}>
                  <td style={{ fontWeight: '600' }}>{opp.name}</td>
                  <td>{opp.source}</td>
                  <td>{opp.location}</td>
                  <td>
                    <span className="badge badge-info" style={{ fontWeight: '700' }}>
                      {opp.aiScore}
                    </span>
                  </td>
                  <td>{opp.deadline}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                      onClick={() => onSelectOpportunity(opp)}
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
