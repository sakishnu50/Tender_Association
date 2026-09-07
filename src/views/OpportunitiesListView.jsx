import React, { useState } from 'react';
import { Plus, RotateCcw } from 'lucide-react';
import { mockOpportunities } from '../data/mockData';
import { useOpportunities } from '../hooks/useApiQueries';

import OpportunityTable from '../components/OpportunityTable';

export default function OpportunitiesListView({ onSelectOpportunity }) {
  const { data: fetchedOpps, isLoading, isError } = useOpportunities();
  const opportunitiesList = fetchedOpps || mockOpportunities;

  const [sourceFilter, setSourceFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredOpps = opportunitiesList.filter(item => {
    if (sourceFilter && item.source !== sourceFilter) return false;
    if (sectorFilter && item.sector !== sectorFilter) return false;
    if (locationFilter && (item.location !== locationFilter && !item.location?.includes(locationFilter))) return false;
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

      {/* TanStack Opportunities Data Table */}
      <OpportunityTable
        data={filteredOpps}
        onSelectOpportunity={onSelectOpportunity}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}
