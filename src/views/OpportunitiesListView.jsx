import React, { useState } from 'react';
import { Search, Filter, Plus, RotateCcw } from 'lucide-react';
import { mockOpportunities } from '../data/mockData';
import { useOpportunities, useCreateOpportunity } from '../hooks/useApiQueries';

import OpportunityTable from '../components/OpportunityTable';
import AddOpportunityModal from '../components/ui/AddOpportunityModal';

export default function OpportunitiesListView({ onSelectOpportunity }) {
  const { data: fetchedOpps, isLoading, isError } = useOpportunities();
  const createMutation = useCreateOpportunity();
  const opportunitiesList = fetchedOpps || mockOpportunities;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sourceFilter, setSourceFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleAddOpportunity = async (newOpportunity) => {
    await createMutation.mutateAsync(newOpportunity);
  };

  const filteredOpps = opportunitiesList.filter(item => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const name = (item.name || item.title || '').toLowerCase();
      const source = (item.source || '').toLowerCase();
      const sector = (item.sector || '').toLowerCase();
      const location = (item.location || item.country || '').toLowerCase();
      if (!name.includes(term) && !source.includes(term) && !sector.includes(term) && !location.includes(term)) {
        return false;
      }
    }
    if (sourceFilter && item.source !== sourceFilter) return false;
    if (sectorFilter && item.sector !== sectorFilter) return false;
    if (locationFilter && (item.location !== locationFilter && !item.location?.includes(locationFilter))) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    return true;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSourceFilter('');
    setSectorFilter('');
    setLocationFilter('');
    setStatusFilter('');
  };

  const hasActiveFilters = Boolean(sourceFilter || sectorFilter || locationFilter || statusFilter);

  return (
    <div className="page-container" style={{ padding: '1rem 1.5rem', gap: '0.875rem', width: '100%', boxSizing: 'border-box' }}>
      {/* Top Search & Actions Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', width: '100%' }}>
        {/* Wide Search Bar */}
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={15}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              height: '36px',
              padding: '0 0.85rem 0 2.4rem',
              borderRadius: 'var(--radius-md, 6px)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filter Icon Button (Icon only) */}
        <button
          type="button"
          className={`btn ${showFilters || hasActiveFilters ? 'btn-primary' : 'btn-outline'}`}
          style={{
            height: '36px',
            width: '36px',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md, 6px)',
            flexShrink: 0
          }}
          onClick={() => setShowFilters((prev) => !prev)}
          title="Filter options"
          aria-label="Filter options"
        >
          <Filter size={15} />
        </button>

        {/* Compact Add Opportunity Button */}
        <button
          type="button"
          className="btn btn-primary"
          style={{
            height: '36px',
            padding: '0 0.85rem',
            fontSize: '0.8125rem',
            gap: '0.35rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md, 6px)',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={15} /> Add Opportunity
        </button>
      </div>

      {/* Expandable Filter Toolbar */}
      {showFilters && (
        <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', padding: '0.875rem 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Source:</span>
            <select
              style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8125rem', width: '100%' }}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Sector:</span>
            <select
              style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8125rem', width: '100%' }}
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
            >
              <option value="">All Sectors</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Transport">Transport</option>
              <option value="Water">Water</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '150px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Location:</span>
            <select
              style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.8125rem', width: '100%' }}
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

          <button className="btn btn-outline" onClick={resetFilters} style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}>
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      )}

      {/* TanStack Opportunities Data Table */}
      <OpportunityTable
        data={filteredOpps}
        onSelectOpportunity={onSelectOpportunity}
        isLoading={isLoading}
        isError={isError}
      />

      {/* Add Opportunity Popup Modal */}
      <AddOpportunityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddOpportunity}
      />
    </div>
  );
}
