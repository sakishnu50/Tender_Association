import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Plus, RotateCcw, Check } from 'lucide-react';
import { mockOpportunities, mockOffices } from '../data/mockData';
import { useOpportunities, useCreateOpportunity } from '../hooks/useApiQueries';

import OpportunityTable from '../components/OpportunityTable';
import AddOpportunityModal from '../components/ui/AddOpportunityModal';

export default function OpportunitiesListView({ onSelectOpportunity, searchVal = '' }) {
  const { data: fetchedOpps, isLoading, isError } = useOpportunities();
  const createMutation = useCreateOpportunity();
  const opportunitiesList = fetchedOpps || mockOpportunities;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(null);

  const filterDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query parameters
  const sourceFilter = searchParams.get('source') || '';
  const sectorFilter = searchParams.get('sector') || '';
  const locationFilter = searchParams.get('location') || '';
  const priorityFilter = searchParams.get('priority') || '';
  const statusFilter = searchParams.get('status') || '';
  const officeFilter = searchParams.get('office') || '';
  const searchTerm = searchParams.get('search') || searchParams.get('q') || '';

  const handleSearchChange = (val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) {
        next.set('search', val);
      } else {
        next.delete('search');
        next.delete('q');
      }
      return next;
    }, { replace: true });
  };

  const handleFilterSelect = (key, val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const currentVal = next.get(key) || '';
      if (currentVal.toLowerCase() === val.toLowerCase()) {
        next.delete(key);
      } else {
        next.set(key, val);
      }
      return next;
    });
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Dynamic Options derived from data
  const sourceOptions = useMemo(() => {
    const set = new Set();
    opportunitiesList.forEach((item) => {
      if (item.source) set.add(item.source);
    });
    return Array.from(set);
  }, [opportunitiesList]);

  const sectorOptions = useMemo(() => {
    const set = new Set();
    opportunitiesList.forEach((item) => {
      if (item.sector) set.add(item.sector);
    });
    return Array.from(set);
  }, [opportunitiesList]);

  const locationOptions = useMemo(() => {
    const set = new Set();
    opportunitiesList.forEach((item) => {
      if (item.location) {
        const primaryLoc = item.location.split(',')[0].trim();
        if (primaryLoc) set.add(primaryLoc);
      }
      if (item.country) {
        set.add(item.country);
      }
    });
    return Array.from(set);
  }, [opportunitiesList]);

  const priorityOptions = useMemo(() => {
    const set = new Set();
    opportunitiesList.forEach((item) => {
      if (item.priority) {
        const formatted = item.priority.charAt(0).toUpperCase() + item.priority.slice(1).toLowerCase();
        set.add(formatted);
      }
    });
    ['High', 'Medium', 'Low'].forEach((p) => set.add(p));
    return Array.from(set);
  }, [opportunitiesList]);

  const statusOptions = useMemo(() => {
    const set = new Set();
    opportunitiesList.forEach((item) => {
      if (item.status) set.add(item.status);
    });
    ['New', 'Pursued', 'Declined'].forEach((s) => set.add(s));
    return Array.from(set);
  }, [opportunitiesList]);

  const officeOptions = useMemo(() => {
    const set = new Set();
    opportunitiesList.forEach((item) => {
      if (item.office) set.add(item.office);
    });
    if (Array.isArray(mockOffices)) {
      mockOffices.forEach((off) => {
        if (off.name) set.add(off.name);
      });
    }
    return Array.from(set);
  }, [opportunitiesList]);

  const filterCategories = [
    { id: 'source', label: 'Sources', options: sourceOptions, selected: sourceFilter },
    { id: 'sector', label: 'Sector', options: sectorOptions, selected: sectorFilter },
    { id: 'location', label: 'Country / Location', options: locationOptions, selected: locationFilter },
    { id: 'priority', label: 'Priority', options: priorityOptions, selected: priorityFilter },
    { id: 'status', label: 'Status', options: statusOptions, selected: statusFilter },
    { id: 'office', label: 'Office', options: officeOptions, selected: officeFilter }
  ];

  const activeFilterCount = [
    sourceFilter,
    sectorFilter,
    locationFilter,
    priorityFilter,
    statusFilter,
    officeFilter
  ].filter(Boolean).length;

  const handleAddOpportunity = async (newOpportunity) => {
    await createMutation.mutateAsync(newOpportunity);
  };

  const filteredOpps = opportunitiesList.filter((item) => {
    const effectiveSearch = (searchVal || searchTerm || '').trim().toLowerCase();
    if (effectiveSearch) {
      const name = (item.name || item.title || '').toLowerCase();
      const id = (item.id || '').toLowerCase();
      const source = (item.source || '').toLowerCase();
      const sector = (item.sector || '').toLowerCase();
      const location = (item.location || item.country || '').toLowerCase();

      if (!name.includes(effectiveSearch) && !id.includes(effectiveSearch) && !source.includes(effectiveSearch) && !sector.includes(effectiveSearch) && !location.includes(effectiveSearch)) {
        return false;
      }
    }

    if (sourceFilter && (item.source || '').toLowerCase() !== sourceFilter.toLowerCase()) {
      return false;
    }

    if (sectorFilter && (item.sector || '').toLowerCase() !== sectorFilter.toLowerCase()) {
      return false;
    }

    if (locationFilter) {
      const itemLoc = (item.location || '').toLowerCase();
      const itemCountry = (item.country || '').toLowerCase();
      const filterLoc = locationFilter.toLowerCase();
      if (!itemLoc.includes(filterLoc) && !itemCountry.includes(filterLoc)) {
        return false;
      }
    }

    if (priorityFilter && (item.priority || '').toLowerCase() !== priorityFilter.toLowerCase()) {
      return false;
    }

    if (statusFilter && (item.status || '').toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }

    if (officeFilter) {
      const derivedOffice = item.office || (
        item.location?.includes('Tamil Nadu') ? 'Chennai' :
        item.location?.includes('Karnataka') ? 'Bangalore' :
        item.location?.includes('Maharashtra') ? 'Mumbai' :
        item.location?.includes('Delhi') ? 'Delhi' :
        item.location?.includes('Gujarat') ? 'Kolkata' : ''
      );
      if (derivedOffice.toLowerCase() !== officeFilter.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

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
            placeholder="Search opportunities by project name..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
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

        {/* Filter Button & Floating Dropdown Container */}
        <div ref={filterDropdownRef} style={{ position: 'relative', display: 'inline-flex' }}>
          {/* Filter Icon Button */}
          <button
            type="button"
            className={`btn ${showFilters || activeFilterCount > 0 ? 'btn-primary' : 'btn-outline'}`}
            style={{
              height: '36px',
              padding: activeFilterCount > 0 ? '0 0.65rem' : '0',
              width: activeFilterCount > 0 ? 'auto' : '36px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              borderRadius: 'var(--radius-md, 6px)',
              flexShrink: 0
            }}
            onClick={() => setShowFilters((prev) => !prev)}
            title="Filter options"
            aria-label="Filter options"
            aria-expanded={showFilters}
          >
            <Filter size={15} />
            {activeFilterCount > 0 && (
              <span style={{ fontSize: '0.75rem', fontWeight: '700', lineHeight: 1 }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Floating Dropdown Filter Panel */}
          {showFilters && (
            <div
              className="card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                zIndex: 1000,
                width: '280px',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                boxShadow: 'var(--shadow-lg, 0 10px 25px -5px rgba(0, 0, 0, 0.2))',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
              }}
            >
              {filterCategories.map((cat, idx) => {
                const isExpanded = expandedFilter === cat.id;
                const isSelected = Boolean(cat.selected);

                return (
                  <div key={cat.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Filter Item Row */}
                    <div
                      onClick={() => setExpandedFilter(isExpanded ? null : cat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.45rem 0.5rem',
                        borderRadius: 'var(--radius-sm, 6px)',
                        cursor: 'pointer',
                        fontWeight: isSelected ? '600' : '500',
                        fontSize: '0.875rem',
                        color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                        backgroundColor: isExpanded
                          ? 'var(--bg-subtle)'
                          : 'transparent',
                        userSelect: 'none',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{cat.label}</span>
                        {isSelected && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--primary)',
                              fontWeight: '600'
                            }}
                          >
                            ({cat.selected})
                          </span>
                        )}
                      </div>

                      {/* Reset/Refresh icon inside first row as per reference sketch */}
                      {idx === 0 ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            resetFilters();
                          }}
                          title="Reset all filters"
                          aria-label="Reset all filters"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.2rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: activeFilterCount > 0 ? 'var(--primary)' : 'var(--text-muted)',
                            borderRadius: '4px'
                          }}
                        >
                          <RotateCcw size={14} />
                        </button>
                      ) : null}
                    </div>

                    {/* Expandable Filter Options Box directly below filter item */}
                    {isExpanded && (
                      <div
                        style={{
                          margin: '0.25rem 0 0.4rem 0',
                          padding: '0.25rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm, 6px)',
                          backgroundColor: 'var(--bg-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.15rem',
                          maxHeight: '170px',
                          overflowY: 'auto'
                        }}
                      >
                        {cat.options.map((opt) => {
                          const optSelected =
                            cat.selected &&
                            (cat.selected.toLowerCase() === opt.toLowerCase() ||
                             (cat.id === 'location' && opt.toLowerCase().includes(cat.selected.toLowerCase())));

                          return (
                            <div
                              key={opt}
                              onClick={() => handleFilterSelect(cat.id, opt)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                padding: '0.35rem 0.5rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.8125rem',
                                color: optSelected ? 'var(--primary)' : 'var(--text-main)',
                                backgroundColor: optSelected
                                  ? 'var(--primary-light, rgba(29, 78, 216, 0.08))'
                                  : 'transparent',
                                fontWeight: optSelected ? '600' : '400',
                                transition: 'background-color 0.15s ease'
                              }}
                            >
                              <span
                                style={{
                                  width: '14px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {optSelected ? <Check size={13} color="var(--primary)" /> : null}
                              </span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
