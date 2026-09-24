import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Plus, RotateCcw, Check, ChevronDown } from 'lucide-react';
import { mockOpportunities, mockOffices } from '../data/mockData';
import { useOpportunities, useCreateOpportunity } from '../hooks/useApiQueries';

import OpportunityTable from '../components/OpportunityTable';
import AddOpportunityModal from '../components/ui/AddOpportunityModal';

export default function OpportunitiesListView({ onSelectOpportunity, searchVal = '' }) {
  const { data: fetchedOpps, isLoading, isError } = useOpportunities();
  const createMutation = useCreateOpportunity();
  const opportunitiesList = fetchedOpps || [];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const filterBarRef = useRef(null);

  // Close open dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterBarRef.current && !filterBarRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to parse multi-select filter values from searchParams
  const getMultiFilter = (key) => {
    const all = searchParams.getAll(key);
    if (all.length > 1) {
      return all.flatMap((v) => v.split(',').map((s) => s.trim()).filter(Boolean));
    }
    const single = searchParams.get(key) || '';
    if (!single) return [];
    return single.split(',').map((s) => s.trim()).filter(Boolean);
  };

  // Read URL query parameters
  const sourceFilters = getMultiFilter('source');
  const sectorFilters = getMultiFilter('sector');
  const locationFilters = getMultiFilter('location');
  const priorityFilter = searchParams.get('priority') || ''; // Priority remains SINGLE-SELECT
  const statusFilters = getMultiFilter('status');
  const officeFilters = getMultiFilter('office');
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
      if (key === 'priority') {
        // Priority is SINGLE-SELECT: selecting another replaces previous; clicking same toggles off
        const currentVal = next.get('priority') || '';
        if (currentVal.toLowerCase() === val.toLowerCase()) {
          next.delete('priority');
        } else {
          next.set('priority', val);
        }
      } else {
        // Multi-select categories: Sources, Sector, Country / Location, Status, Office
        const existingValues = (next.get(key) || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        const existsIndex = existingValues.findIndex(
          (v) => v.toLowerCase() === val.toLowerCase()
        );

        let newValues;
        if (existsIndex >= 0) {
          newValues = existingValues.filter((_, i) => i !== existsIndex);
        } else {
          newValues = [...existingValues, val];
        }

        if (newValues.length > 0) {
          next.set(key, newValues.join(','));
        } else {
          next.delete(key);
        }
      }
      return next;
    });
  };

  const resetFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      ['source', 'sector', 'location', 'priority', 'status', 'office'].forEach((k) => {
        next.delete(k);
      });
      return next;
    });
  };

  // Dynamic Options derived from data
  const sourceOptions = useMemo(() => {
    const set = new Set();
    opportunitiesList.forEach((item) => {
      if (item.source && typeof item.source === 'string' && item.source.trim()) {
        set.add(item.source.trim());
      }
    });
    ['World Bank', 'ADB', 'GeM', 'CPPP', 'UNGM', 'Tenders Karnataka'].forEach((s) => set.add(s));
    return Array.from(set);
  }, [opportunitiesList]);

  const sectorOptions = useMemo(() => {
    const set = new Set();
    opportunitiesList.forEach((item) => {
      if (item.sector && typeof item.sector === 'string' && item.sector.trim()) {
        set.add(item.sector.trim());
      }
    });
    ['Infrastructure', 'Healthcare', 'Information Technology', 'Water & Sanitation', 'Renewable Energy', 'Education', 'Transport'].forEach((s) => set.add(s));
    return Array.from(set);
  }, [opportunitiesList]);

  const locationOptions = useMemo(() => {
    const set = new Set();
    opportunitiesList.forEach((item) => {
      if (item.location) {
        const primaryLoc = item.location.split(',')[0].trim();
        if (primaryLoc) set.add(primaryLoc);
      }
      if (item.country && typeof item.country === 'string' && item.country.trim()) {
        set.add(item.country.trim());
      }
    });
    ['India', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Gujarat', 'Bangladesh', 'Sri Lanka', 'Vietnam'].forEach((l) => set.add(l));
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
    ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Kolkata'].forEach((o) => set.add(o));
    return Array.from(set);
  }, [opportunitiesList]);

  const filterCategories = [
    { id: 'source', label: 'Sources', options: sourceOptions, selected: sourceFilters, isMulti: true },
    { id: 'sector', label: 'Sector', options: sectorOptions, selected: sectorFilters, isMulti: true },
    { id: 'location', label: 'Country / Location', options: locationOptions, selected: locationFilters, isMulti: true },
    { id: 'priority', label: 'Priority', options: priorityOptions, selected: priorityFilter ? [priorityFilter] : [], isMulti: false },
    { id: 'status', label: 'Status', options: statusOptions, selected: statusFilters, isMulti: true },
    { id: 'office', label: 'Office', options: officeOptions, selected: officeFilters, isMulti: true }
  ];

  const activeFilterCount =
    sourceFilters.length +
    sectorFilters.length +
    locationFilters.length +
    (priorityFilter ? 1 : 0) +
    statusFilters.length +
    officeFilters.length;

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

    // Sources (MULTI-SELECT: match any selected source)
    if (sourceFilters.length > 0) {
      const itemSource = (item.source || '').toLowerCase();
      if (!sourceFilters.some((s) => itemSource === s.toLowerCase())) {
        return false;
      }
    }

    // Sector (MULTI-SELECT: match any selected sector)
    if (sectorFilters.length > 0) {
      const itemSector = (item.sector || '').toLowerCase();
      if (!sectorFilters.some((s) => itemSector === s.toLowerCase())) {
        return false;
      }
    }

    // Country / Location (MULTI-SELECT: match any selected location/country)
    if (locationFilters.length > 0) {
      const itemLoc = (item.location || '').toLowerCase();
      const itemCountry = (item.country || '').toLowerCase();
      const matches = locationFilters.some((loc) => {
        const l = loc.toLowerCase();
        return itemLoc.includes(l) || itemCountry.includes(l);
      });
      if (!matches) {
        return false;
      }
    }

    // Priority (SINGLE-SELECT: match exact priority)
    if (priorityFilter && (item.priority || '').toLowerCase() !== priorityFilter.toLowerCase()) {
      return false;
    }

    // Status (MULTI-SELECT: match any selected status)
    if (statusFilters.length > 0) {
      const itemStatus = (item.status || '').toLowerCase();
      if (!statusFilters.some((s) => itemStatus === s.toLowerCase())) {
        return false;
      }
    }

    // Office (MULTI-SELECT: match any selected office)
    if (officeFilters.length > 0) {
      const derivedOffice = (item.office || (
        item.location?.includes('Tamil Nadu') ? 'Chennai' :
        item.location?.includes('Karnataka') ? 'Bangalore' :
        item.location?.includes('Maharashtra') ? 'Mumbai' :
        item.location?.includes('Delhi') ? 'Delhi' :
        item.location?.includes('Gujarat') ? 'Kolkata' : ''
      )).toLowerCase();

      if (!officeFilters.some((off) => derivedOffice === off.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="page-container" style={{ padding: '1rem 1.5rem', gap: '0.875rem', width: '100%', boxSizing: 'border-box' }}>
      {/* Single Control Row: Heading on Left, Search + Filter + Add Button on Right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            margin: 0,
            color: 'var(--text-main)',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap'
          }}
        >
          Opportunities
        </h1>

        {/* Grouped Right Controls: Search + Filter + Add Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0
          }}
        >
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '260px', maxWidth: '100%' }}>
            <Search
              size={15}
              color="var(--text-muted)"
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                padding: '0 0.75rem 0 2.2rem',
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

          {/* Filter Button */}
          <button
            type="button"
            className={`btn ${showFilters || activeFilterCount > 0 ? 'btn-primary' : 'btn-outline'}`}
            style={{
              height: '36px',
              minWidth: '36px',
              padding: activeFilterCount > 0 ? '0 0.625rem' : '0',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              borderRadius: 'var(--radius-md, 6px)',
              flexShrink: 0,
              cursor: 'pointer'
            }}
            onClick={() => {
              setShowFilters((prev) => {
                const next = !prev;
                if (!next) setActiveDropdown(null);
                return next;
              });
            }}
            title="Filter opportunities"
            aria-label="Filter opportunities"
            aria-expanded={showFilters}
          >
            <Filter size={15} />
            {activeFilterCount > 0 && (
              <span
                style={{
                  minWidth: '17px',
                  height: '17px',
                  padding: '0 4px',
                  borderRadius: '9999px',
                  backgroundColor: showFilters || activeFilterCount > 0 ? '#FFFFFF' : 'var(--primary)',
                  color: showFilters || activeFilterCount > 0 ? 'var(--primary)' : '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Compact / Square + Add Button */}
          <button
            type="button"
            className="btn btn-primary"
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
            onClick={() => setIsAddModalOpen(true)}
            title="Add Opportunity"
            aria-label="Add Opportunity"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal Row-Wise Filter Bar */}
      {showFilters && (
        <div
          ref={filterBarRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
            padding: '0.5rem 0.75rem',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md, 6px)',
            boxShadow: 'var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05))',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
            {filterCategories.map((cat) => {
              const isOpen = activeDropdown === cat.id;
              const isSelected = Array.isArray(cat.selected) ? cat.selected.length > 0 : Boolean(cat.selected);

              return (
                <div key={cat.id} style={{ position: 'relative', display: 'inline-block' }}>
                  {/* Dropdown / Chip Trigger */}
                  <button
                    type="button"
                    onClick={() => setActiveDropdown((prev) => (prev === cat.id ? null : cat.id))}
                    style={{
                      height: '32px',
                      padding: '0 0.65rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: 'var(--radius-md, 6px)',
                      border: isSelected
                        ? '1px solid var(--primary)'
                        : isOpen
                        ? '1px solid var(--primary)'
                        : '1px solid var(--border-color)',
                      backgroundColor: isSelected
                        ? 'var(--primary-light)'
                        : isOpen
                        ? 'var(--bg-subtle)'
                        : 'var(--bg-card)',
                      color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                      fontSize: '0.8125rem',
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                      outline: 'none'
                    }}
                  >
                    <span>{cat.label}</span>
                    {isSelected && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          backgroundColor: 'var(--primary)',
                          color: '#FFFFFF',
                          padding: '0.05rem 0.35rem',
                          borderRadius: '4px',
                          fontWeight: 600,
                          maxWidth: '110px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={Array.isArray(cat.selected) ? cat.selected.join(', ') : cat.selected}
                      >
                        {Array.isArray(cat.selected)
                          ? cat.selected.length === 1
                            ? cat.selected[0]
                            : `${cat.selected.length} selected`
                          : cat.selected}
                      </span>
                    )}
                    <ChevronDown
                      size={13}
                      style={{
                        color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {/* Dropdown Options Popover */}
                  {isOpen && (
                    <div
                      className="card"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        zIndex: 1000,
                        minWidth: '190px',
                        maxWidth: '280px',
                        padding: '0.35rem',
                        borderRadius: 'var(--radius-md, 6px)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-card)',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.15rem',
                        maxHeight: '220px',
                        overflowY: 'auto'
                      }}
                    >
                      {cat.options.map((opt) => {
                        const optSelected =
                          Array.isArray(cat.selected) &&
                          cat.selected.some((s) => s.toLowerCase() === opt.toLowerCase());

                        return (
                          <div
                            key={opt}
                            onClick={() => handleFilterSelect(cat.id, opt)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: '0.35rem 0.5rem',
                              borderRadius: 'var(--radius-sm, 4px)',
                              cursor: 'pointer',
                              fontSize: '0.8125rem',
                              color: optSelected ? 'var(--primary)' : 'var(--text-main)',
                              backgroundColor: optSelected
                                ? 'var(--primary-light)'
                                : 'transparent',
                              fontWeight: optSelected ? 600 : 400,
                              transition: 'background-color 0.15s ease',
                              userSelect: 'none'
                            }}
                          >
                            {/* Checkbox UI */}
                            <div
                              style={{
                                width: '15px',
                                height: '15px',
                                borderRadius: '3px',
                                border: optSelected
                                  ? '1.5px solid var(--primary)'
                                  : '1.5px solid var(--border-color)',
                                backgroundColor: optSelected ? 'var(--primary)' : 'var(--bg-card)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {optSelected && <Check size={11} strokeWidth={3} color="#FFFFFF" />}
                            </div>

                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reset Action */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              title="Reset all filters"
              aria-label="Reset all filters"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.3rem 0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                color: 'var(--primary)',
                borderRadius: 'var(--radius-sm, 4px)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
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
