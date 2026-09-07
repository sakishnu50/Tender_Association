import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, Plus, RotateCcw, Search, SlidersHorizontal, X, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { mockOpportunities } from '../data/mockData';
import { useOpportunities, useAddOpportunity } from '../hooks/useApiQueries';
import AddOpportunityModal from '../components/ui/AddOpportunityModal';

// Fallback office map to ensure office resolution even if using older cached data
const defaultOfficeMap = {
  'OPP-001': 'Chennai',
  'OPP-002': 'Bangalore',
  'OPP-003': 'Mumbai',
  'OPP-004': 'Delhi',
  'OPP-005': 'Kolkata'
};

export default function OpportunitiesListView({ onSelectOpportunity }) {
  const { data: fetchedOpps } = useOpportunities();
  const opportunitiesList = fetchedOpps || mockOpportunities;
  const addOpportunityMutation = useAddOpportunity();

  // Add Opportunity modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // React Router search params for persistent URL state & history
  const [searchParams, setSearchParams] = useSearchParams();

  // Active filters derived directly from URL query parameters
  const activeSearch = searchParams.get('search') || '';
  const activeSource = searchParams.get('source') || '';
  const activeSector = searchParams.get('sector') || '';
  const activeLocation = searchParams.get('location') || searchParams.get('country') || '';
  const activePriority = searchParams.get('priority') || '';
  const activeStatus = searchParams.get('status') || '';
  const activeOffice = searchParams.get('office') || '';

  // Local state for the quick-search input, synced with URL activeSearch
  const [searchInput, setSearchInput] = useState(activeSearch);
  const [prevActiveSearch, setPrevActiveSearch] = useState(activeSearch);

  // Sync search input if activeSearch in URL changes externally (e.g. browser Back/Forward, Reset)
  if (prevActiveSearch !== activeSearch) {
    setPrevActiveSearch(activeSearch);
    setSearchInput(activeSearch);
  }

  // Debounce search query update to URL search params
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== activeSearch) {
        const newParams = new URLSearchParams(searchParams);
        if (searchInput.trim()) {
          newParams.set('search', searchInput.trim());
        } else {
          newParams.delete('search');
        }
        setSearchParams(newParams);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, activeSearch, searchParams, setSearchParams]);

  // Filter panel state & expanded accordion category
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const filterContainerRef = useRef(null);

  const handleToggleCategory = (categoryKey) => {
    setExpandedCategory(prev => (prev === categoryKey ? null : categoryKey));
  };

  // Close filter panel on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterContainerRef.current && !filterContainerRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsFilterOpen(false);
      }
    }

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterOpen]);

  // Dynamic filter options derived from current opportunities data
  const dynamicSources = useMemo(() => {
    return Array.from(new Set(opportunitiesList.map(o => o.source).filter(Boolean))).sort();
  }, [opportunitiesList]);

  const dynamicSectors = useMemo(() => {
    return Array.from(new Set(opportunitiesList.map(o => o.sector).filter(Boolean))).sort();
  }, [opportunitiesList]);

  const dynamicLocations = useMemo(() => {
    const locSet = new Set();
    opportunitiesList.forEach(o => {
      if (o.location) {
        const primaryLoc = o.location.split(',')[0].trim();
        if (primaryLoc) locSet.add(primaryLoc);
      }
      if (o.country) {
        locSet.add(o.country);
      }
    });
    return Array.from(locSet).sort();
  }, [opportunitiesList]);

  const dynamicPriorities = useMemo(() => {
    const prioSet = new Set(['High', 'Medium', 'Low']);
    opportunitiesList.forEach(o => {
      if (o.priority) {
        const formatted = o.priority.charAt(0).toUpperCase() + o.priority.slice(1).toLowerCase();
        prioSet.add(formatted);
      }
    });
    return Array.from(prioSet);
  }, [opportunitiesList]);

  const dynamicStatuses = useMemo(() => {
    const statusSet = new Set(['New', 'In Review', 'Pursued', 'Declined', 'Closed']);
    opportunitiesList.forEach(o => {
      if (o.status) statusSet.add(o.status);
    });
    return Array.from(statusSet);
  }, [opportunitiesList]);

  const dynamicOffices = useMemo(() => {
    const officeSet = new Set();
    opportunitiesList.forEach(o => {
      const officeVal = o.office || defaultOfficeMap[o.id];
      if (officeVal) officeSet.add(officeVal);
    });
    return Array.from(officeSet).sort();
  }, [opportunitiesList]);

  // Active filter count (excluding search bar, as search has its own dedicated input)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeSource) count++;
    if (activeSector) count++;
    if (activeLocation) count++;
    if (activePriority) count++;
    if (activeStatus) count++;
    if (activeOffice) count++;
    return count;
  }, [activeSource, activeSector, activeLocation, activePriority, activeStatus, activeOffice]);

  // Handle immediate filter selection
  const handleSelectOption = (filterKey, value) => {
    const newParams = new URLSearchParams(searchParams);

    const currentVal = (filterKey === 'location')
      ? (searchParams.get('location') || searchParams.get('country') || '')
      : (searchParams.get(filterKey) || '');

    // If clicking "All" or clicking the already selected value, deselect it
    if (!value || value === 'All' || currentVal.toLowerCase() === value.toLowerCase()) {
      if (filterKey === 'location') {
        newParams.delete('location');
        newParams.delete('country');
      } else {
        newParams.delete(filterKey);
      }
    } else {
      if (filterKey === 'location') {
        if (value.toLowerCase() === 'india') {
          newParams.delete('location');
          newParams.set('country', value);
        } else {
          newParams.delete('country');
          newParams.set('location', value);
        }
      } else {
        newParams.set(filterKey, value);
      }
    }

    setSearchParams(newParams);
  };

  // Reset all filters, search query, and clear URL parameters
  const handleResetAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
    setExpandedCategory(null);
  };

  // Filtered opportunities matching search + all active filters
  const filteredOpps = useMemo(() => {
    return opportunitiesList.filter(item => {
      // 1. Search Query: matches name/title primarily, or source/sector
      if (activeSearch.trim()) {
        const q = activeSearch.trim().toLowerCase();
        const matchName = item.name?.toLowerCase().includes(q) || item.title?.toLowerCase().includes(q);
        const matchSource = item.source?.toLowerCase().includes(q);
        const matchSector = item.sector?.toLowerCase().includes(q);
        if (!matchName && !matchSource && !matchSector) return false;
      }

      // 2. Source Filter
      if (activeSource && item.source?.toLowerCase() !== activeSource.toLowerCase()) {
        return false;
      }

      // 3. Sector Filter
      if (activeSector && item.sector?.toLowerCase() !== activeSector.toLowerCase()) {
        return false;
      }

      // 4. Country / Location Filter
      if (activeLocation) {
        const locLower = activeLocation.toLowerCase();
        const matchLoc = item.location?.toLowerCase().includes(locLower);
        const matchCountry = item.country?.toLowerCase().includes(locLower);
        if (!matchLoc && !matchCountry) return false;
      }

      // 5. Priority Filter (case-insensitive)
      if (activePriority && item.priority?.toLowerCase() !== activePriority.toLowerCase()) {
        return false;
      }

      // 6. Status Filter (case-insensitive)
      if (activeStatus && item.status?.toLowerCase() !== activeStatus.toLowerCase()) {
        return false;
      }

      // 7. Office Filter
      if (activeOffice) {
        const itemOffice = item.office || defaultOfficeMap[item.id] || '';
        if (itemOffice.toLowerCase() !== activeOffice.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [opportunitiesList, activeSearch, activeSource, activeSector, activeLocation, activePriority, activeStatus, activeOffice]);

  const handleAddOpportunity = async (newOppData) => {
    await addOpportunityMutation.mutateAsync(newOppData);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Opportunities</h2>
        <button
          id="add-opportunity-btn"
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
          title="Add a new opportunity"
        >
          <Plus size={16} /> Add Opportunity
        </button>
      </div>

      {/* Clean Quick-Search & Filter Toolbar */}
      <div className="card opp-filter-toolbar">
        {/* Quick Search Bar */}
        <div className="opp-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            id="opportunity-search-input"
            type="text"
            className="opp-search-input"
            placeholder="Search opportunities by project name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              className="opp-search-clear"
              onClick={() => setSearchInput('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters Button & Popover */}
        <div className="filter-btn-container" ref={filterContainerRef}>
          <button
            id="filters-button"
            className={`filter-toggle-btn ${activeFilterCount > 0 ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setIsFilterOpen(prev => !prev)}
            aria-expanded={isFilterOpen}
            title="Toggle filter options"
          >
            <SlidersHorizontal size={16} />
            {activeFilterCount > 0 && (
              <span className="filter-active-count" id="active-filter-badge">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Vertical Expandable Filter Panel */}
          {isFilterOpen && (
            <div className="vertical-filter-panel" id="vertical-filter-panel">
              <div className="vertical-filter-topbar">
                <span className="vertical-filter-title">Filters</span>
                <button
                  id="reset-filter-icon-btn"
                  className="vertical-filter-reset-btn"
                  onClick={handleResetAllFilters}
                  title="Reset all filters"
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* 1. Sources */}
              <div className="vertical-filter-item">
                <button
                  id="filter-heading-sources"
                  className={`vertical-filter-header-btn ${activeSource ? 'is-active' : ''}`}
                  onClick={() => handleToggleCategory('sources')}
                >
                  <span>Sources</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {activeSource && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{activeSource}</span>}
                    {expandedCategory === 'sources' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>
                {expandedCategory === 'sources' && (
                  <div className="vertical-filter-options-box" id="options-sources">
                    <button
                      className={`vertical-filter-option-btn ${!activeSource ? 'selected' : ''}`}
                      onClick={() => handleSelectOption('source', '')}
                    >
                      <span>All Sources</span>
                      {!activeSource && <Check size={14} color="var(--primary)" />}
                    </button>
                    {dynamicSources.map(src => (
                      <button
                        key={src}
                        className={`vertical-filter-option-btn ${activeSource.toLowerCase() === src.toLowerCase() ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('source', src)}
                      >
                        <span>{src}</span>
                        {activeSource.toLowerCase() === src.toLowerCase() && <Check size={14} color="var(--primary)" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Sector */}
              <div className="vertical-filter-item">
                <button
                  id="filter-heading-sector"
                  className={`vertical-filter-header-btn ${activeSector ? 'is-active' : ''}`}
                  onClick={() => handleToggleCategory('sector')}
                >
                  <span>Sector</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {activeSector && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{activeSector}</span>}
                    {expandedCategory === 'sector' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>
                {expandedCategory === 'sector' && (
                  <div className="vertical-filter-options-box" id="options-sector">
                    <button
                      className={`vertical-filter-option-btn ${!activeSector ? 'selected' : ''}`}
                      onClick={() => handleSelectOption('sector', '')}
                    >
                      <span>All Sectors</span>
                      {!activeSector && <Check size={14} color="var(--primary)" />}
                    </button>
                    {dynamicSectors.map(sec => (
                      <button
                        key={sec}
                        className={`vertical-filter-option-btn ${activeSector.toLowerCase() === sec.toLowerCase() ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('sector', sec)}
                      >
                        <span>{sec}</span>
                        {activeSector.toLowerCase() === sec.toLowerCase() && <Check size={14} color="var(--primary)" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Country / Location */}
              <div className="vertical-filter-item">
                <button
                  id="filter-heading-location"
                  className={`vertical-filter-header-btn ${activeLocation ? 'is-active' : ''}`}
                  onClick={() => handleToggleCategory('location')}
                >
                  <span>Location</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {activeLocation && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{activeLocation}</span>}
                    {expandedCategory === 'location' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>
                {expandedCategory === 'location' && (
                  <div className="vertical-filter-options-box" id="options-location">
                    <button
                      className={`vertical-filter-option-btn ${!activeLocation ? 'selected' : ''}`}
                      onClick={() => handleSelectOption('location', '')}
                    >
                      <span>All Locations</span>
                      {!activeLocation && <Check size={14} color="var(--primary)" />}
                    </button>
                    {dynamicLocations.map(loc => (
                      <button
                        key={loc}
                        className={`vertical-filter-option-btn ${activeLocation.toLowerCase() === loc.toLowerCase() ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('location', loc)}
                      >
                        <span>{loc}</span>
                        {activeLocation.toLowerCase() === loc.toLowerCase() && <Check size={14} color="var(--primary)" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Priority */}
              <div className="vertical-filter-item">
                <button
                  id="filter-heading-priority"
                  className={`vertical-filter-header-btn ${activePriority ? 'is-active' : ''}`}
                  onClick={() => handleToggleCategory('priority')}
                >
                  <span>Priority</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {activePriority && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{activePriority}</span>}
                    {expandedCategory === 'priority' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>
                {expandedCategory === 'priority' && (
                  <div className="vertical-filter-options-box" id="options-priority">
                    <button
                      className={`vertical-filter-option-btn ${!activePriority ? 'selected' : ''}`}
                      onClick={() => handleSelectOption('priority', '')}
                    >
                      <span>All Priorities</span>
                      {!activePriority && <Check size={14} color="var(--primary)" />}
                    </button>
                    {dynamicPriorities.map(prio => (
                      <button
                        key={prio}
                        className={`vertical-filter-option-btn ${activePriority.toLowerCase() === prio.toLowerCase() ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('priority', prio)}
                      >
                        <span>{prio}</span>
                        {activePriority.toLowerCase() === prio.toLowerCase() && <Check size={14} color="var(--primary)" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Status */}
              <div className="vertical-filter-item">
                <button
                  id="filter-heading-status"
                  className={`vertical-filter-header-btn ${activeStatus ? 'is-active' : ''}`}
                  onClick={() => handleToggleCategory('status')}
                >
                  <span>Status</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {activeStatus && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{activeStatus}</span>}
                    {expandedCategory === 'status' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>
                {expandedCategory === 'status' && (
                  <div className="vertical-filter-options-box" id="options-status">
                    <button
                      className={`vertical-filter-option-btn ${!activeStatus ? 'selected' : ''}`}
                      onClick={() => handleSelectOption('status', '')}
                    >
                      <span>All Status</span>
                      {!activeStatus && <Check size={14} color="var(--primary)" />}
                    </button>
                    {dynamicStatuses.map(st => (
                      <button
                        key={st}
                        className={`vertical-filter-option-btn ${activeStatus.toLowerCase() === st.toLowerCase() ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('status', st)}
                      >
                        <span>{st}</span>
                        {activeStatus.toLowerCase() === st.toLowerCase() && <Check size={14} color="var(--primary)" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Office */}
              <div className="vertical-filter-item">
                <button
                  id="filter-heading-office"
                  className={`vertical-filter-header-btn ${activeOffice ? 'is-active' : ''}`}
                  onClick={() => handleToggleCategory('office')}
                >
                  <span>Office</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {activeOffice && <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{activeOffice}</span>}
                    {expandedCategory === 'office' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>
                </button>
                {expandedCategory === 'office' && (
                  <div className="vertical-filter-options-box" id="options-office">
                    <button
                      className={`vertical-filter-option-btn ${!activeOffice ? 'selected' : ''}`}
                      onClick={() => handleSelectOption('office', '')}
                    >
                      <span>All Offices</span>
                      {!activeOffice && <Check size={14} color="var(--primary)" />}
                    </button>
                    {dynamicOffices.map(off => (
                      <button
                        key={off}
                        className={`vertical-filter-option-btn ${activeOffice.toLowerCase() === off.toLowerCase() ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('office', off)}
                      >
                        <span>{off}</span>
                        {activeOffice.toLowerCase() === off.toLowerCase() && <Check size={14} color="var(--primary)" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
              {filteredOpps.length > 0 ? (
                filteredOpps.map((opp) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-main)' }}>No matching opportunities found</span>
                      <span style={{ fontSize: '0.875rem' }}>Try adjusting your search keywords or clearing active filters.</span>
                      <button
                        className="btn btn-outline"
                        onClick={handleResetAllFilters}
                        style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}
                      >
                        <RotateCcw size={14} /> Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{
          padding: '0.875rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            Showing {filteredOpps.length > 0 ? 1 : 0} to {filteredOpps.length} of {opportunitiesList.length} entries
          </div>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>&lt;</button>
            <button className="btn btn-primary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>1</button>
            <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>2</button>
            <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>3</button>
            <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>&gt;</button>
        </div>
      </div>
    </div>

    {/* Add Opportunity Modal */}
    <AddOpportunityModal
      isOpen={isAddModalOpen}
      onClose={() => setIsAddModalOpen(false)}
      onAdd={handleAddOpportunity}
    />
  </div>
  );
}
