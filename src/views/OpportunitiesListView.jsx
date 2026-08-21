import React, { useState } from 'react';
import { Eye, Plus, Filter, RotateCcw } from 'lucide-react';
import { mockOpportunities } from '../data/mockData';

export default function OpportunitiesListView({ onSelectOpportunity }) {
  const [sourceFilter, setSourceFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredOpps = mockOpportunities.filter(item => {
    if (sourceFilter && item.source !== sourceFilter) return false;
    if (sectorFilter && item.sector !== sectorFilter) return false;
    if (locationFilter && item.location !== locationFilter) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    return true;
  });

  const resetFilters = () => {
    setSourceFilter('');
    setSectorFilter('');
    setLocationFilter('');
    setStatusFilter('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Opportunities</h2>
        <button className="btn btn-primary">
          <Plus size={16} /> Add Opportunity
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '160px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Source:</span>
          <select
            style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.875rem', width: '100%' }}
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="World Bank">World Bank</option>
            <option value="ADB">ADB</option>
            <option value="JICA">JICA</option>
            <option value="AIIB">AIIB</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '160px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Sector:</span>
          <select
            style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.875rem', width: '100%' }}
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="">All Sectors</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Transport">Transport</option>
            <option value="Water">Water</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '160px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Location:</span>
          <select
            style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.875rem', width: '100%' }}
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>

        <button className="btn btn-outline" onClick={resetFilters} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Opportunities Data Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Source</th>
                <th>Sector</th>
                <th>Location</th>
                <th>AI Score</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpps.map((opp) => (
                <tr key={opp.id}>
                  <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{opp.name}</td>
                  <td>{opp.source}</td>
                  <td>{opp.sector}</td>
                  <td>{opp.location}</td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.8rem', fontWeight: '700' }}>
                      {opp.aiScore}
                    </span>
                  </td>
                  <td>{opp.deadline}</td>
                  <td>
                    <span className="badge badge-new">{opp.status}</span>
                  </td>
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

        {/* Pagination Footer */}
        <div style={{
          padding: '0.875rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          <div>Showing 1 to {filteredOpps.length} of 150 entries</div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>&lt;</button>
            <button className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>1</button>
            <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>2</button>
            <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>3</button>
            <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
