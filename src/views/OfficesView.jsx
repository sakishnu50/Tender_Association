import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  RotateCcw,
  Check,
  Eye,
  Building2,
  MapPin,
  Mail,
  Phone,
  X
} from 'lucide-react';
import { mockOffices } from '../data/mockData';
import { useOffices } from '../hooks/useApiQueries';

export default function OfficesView({ searchVal = '' }) {
  const { data: fetchedOffices } = useOffices();
  const initialOffices = fetchedOffices || mockOffices;

  const [officesList, setOfficesList] = useState(initialOffices);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // New office modal state
  const [newOffice, setNewOffice] = useState({
    name: '',
    location: '',
    region: 'Asia-Pacific',
    projects: '',
    lead: '',
    leadRole: 'Regional Director',
    teamSize: '',
    winRate: '65%',
    email: '',
    phone: '',
    address: '',
    sectors: '',
    notes: '',
    status: 'Active'
  });

  const filterDropdownRef = useRef(null);

  // Close filter dropdown when clicking outside
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

  // Read URL search params
  const [searchParams, setSearchParams] = useSearchParams();
  const regionFilter = searchParams.get('region') || '';
  const locationFilter = searchParams.get('location') || '';
  const statusFilter = searchParams.get('status') || '';
  const localSearch = searchParams.get('search') || searchParams.get('q') || '';

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
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
    setCurrentPage(1);
  };

  // Dynamic filter options
  const regionOptions = useMemo(() => {
    const set = new Set(['Asia-Pacific', 'Europe', 'Middle East']);
    officesList.forEach((item) => {
      if (item.region) set.add(item.region);
    });
    return Array.from(set);
  }, [officesList]);

  const locationOptions = useMemo(() => {
    const set = new Set();
    officesList.forEach((item) => {
      if (item.location) {
        const city = item.location.split(',')[0].trim();
        if (city) set.add(city);
      }
    });
    return Array.from(set);
  }, [officesList]);

  const statusOptions = useMemo(() => {
    return ['Active', 'Inactive'];
  }, []);

  const filterCategories = [
    { id: 'region', label: 'Region', options: regionOptions, selected: regionFilter },
    { id: 'location', label: 'Location', options: locationOptions, selected: locationFilter },
    { id: 'status', label: 'Status', options: statusOptions, selected: statusFilter }
  ];

  const activeFilterCount = [regionFilter, locationFilter, statusFilter].filter(Boolean).length;

  // Filtered offices list
  const filteredOffices = useMemo(() => {
    return officesList.filter((office) => {
      const effectiveSearch = (searchVal || localSearch || '').trim().toLowerCase();
      if (effectiveSearch) {
        const name = (office.name || '').toLowerCase();
        const loc = (office.location || '').toLowerCase();
        const reg = (office.region || '').toLowerCase();
        const lead = (office.lead || '').toLowerCase();
        const notes = (office.notes || '').toLowerCase();

        if (
          !name.includes(effectiveSearch) &&
          !loc.includes(effectiveSearch) &&
          !reg.includes(effectiveSearch) &&
          !lead.includes(effectiveSearch) &&
          !notes.includes(effectiveSearch)
        ) {
          return false;
        }
      }

      if (regionFilter && (office.region || '').toLowerCase() !== regionFilter.toLowerCase()) {
        return false;
      }

      if (locationFilter) {
        const officeLoc = (office.location || '').toLowerCase();
        const filterLoc = locationFilter.toLowerCase();
        if (!officeLoc.includes(filterLoc)) {
          return false;
        }
      }

      if (statusFilter && (office.status || 'Active').toLowerCase() !== statusFilter.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [officesList, searchVal, localSearch, regionFilter, locationFilter, statusFilter]);

  // Handle Add Office submit
  const handleAddOffice = (e) => {
    e.preventDefault();
    if (!newOffice.name.trim() || !newOffice.location.trim()) return;

    const createdOffice = {
      id: `off-${Date.now()}`,
      name: newOffice.name.trim(),
      shortName: newOffice.name.replace(/\s*Office\s*/i, '').trim(),
      location: newOffice.location.trim(),
      region: newOffice.region || 'Asia-Pacific',
      isHQ: false,
      projects: Number(newOffice.projects) || 1,
      total: Number(newOffice.projects) || 1,
      pursued: Math.max(1, Math.round((Number(newOffice.projects) || 1) * 0.3)),
      declined: 0,
      highPriority: Math.max(1, Math.round((Number(newOffice.projects) || 1) * 0.15)),
      winRate: newOffice.winRate.trim() || '65%',
      lead: newOffice.lead.trim() || 'Regional Lead',
      leadRole: newOffice.leadRole.trim() || 'Regional Director',
      teamSize: Number(newOffice.teamSize) || 12,
      email:
        newOffice.email.trim() ||
        `${newOffice.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@tenderhub.org`,
      phone: newOffice.phone.trim() || '+1 (555) 019-2834',
      address: newOffice.address.trim() || `${newOffice.location.trim()}`,
      sectors: newOffice.sectors
        ? newOffice.sectors.split(',').map((s) => s.trim()).filter(Boolean)
        : ['Infrastructure', 'Urban Development'],
      notes:
        newOffice.notes.trim() ||
        'Newly established regional branch supporting local tender monitoring and proposal management.',
      status: newOffice.status || 'Active'
    };

    setOfficesList((prev) => [createdOffice, ...prev]);
    setIsAddModalOpen(false);
    setNewOffice({
      name: '',
      location: '',
      region: 'Asia-Pacific',
      projects: '',
      lead: '',
      leadRole: 'Regional Director',
      teamSize: '',
      winRate: '65%',
      email: '',
      phone: '',
      address: '',
      sectors: '',
      notes: '',
      status: 'Active'
    });
  };

  // Pagination calculation
  const totalCount = filteredOffices.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const startRow = totalCount === 0 ? 0 : (validPage - 1) * pageSize + 1;
  const endRow = Math.min(validPage * pageSize, totalCount);
  const paginatedOffices = filteredOffices.slice((validPage - 1) * pageSize, validPage * pageSize);

  return (
    <div
      className="page-container"
      style={{
        padding: '1rem 1.5rem',
        gap: '0.875rem',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Control Row: Heading on Left, Search + Filter + Add on Right (Identical to Opportunities) */}
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
          Offices
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
              placeholder="Search offices by name, location, or region..."
              value={localSearch}
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

          {/* Filter Button & Floating Dropdown */}
          <div ref={filterDropdownRef} style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              type="button"
              className={`btn ${showFilters || activeFilterCount > 0 ? 'btn-primary' : 'btn-outline'}`}
              style={{
                height: '36px',
                width: activeFilterCount > 0 ? 'auto' : '36px',
                minWidth: '36px',
                padding: activeFilterCount > 0 ? '0 0.5rem' : '0',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                borderRadius: 'var(--radius-md, 6px)',
                flexShrink: 0
              }}
              onClick={() => setShowFilters((prev) => !prev)}
              title="Filter offices"
              aria-label="Filter offices"
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
                  width: '260px',
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
                            maxHeight: '160px',
                            overflowY: 'auto'
                          }}
                        >
                          {cat.options.map((opt) => {
                            const optSelected =
                              cat.selected &&
                              cat.selected.toLowerCase() === opt.toLowerCase();

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
            title="Add Office"
            aria-label="Add Office"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Opportunities-Style Office Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', overflowX: 'auto', overflowY: 'visible' }}>
          <table className="data-table" style={{ width: '100%', tableLayout: 'auto' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '28%', padding: '0.7rem 0.875rem', whiteSpace: 'nowrap' }}>
                  OFFICE NAME
                </th>
                <th style={{ textAlign: 'left', width: '20%', padding: '0.7rem 0.875rem', whiteSpace: 'nowrap' }}>
                  LOCATION
                </th>
                <th style={{ textAlign: 'left', width: '18%', padding: '0.7rem 0.875rem', whiteSpace: 'nowrap' }}>
                  REGION
                </th>
                <th style={{ textAlign: 'left', width: '16%', padding: '0.7rem 0.875rem', whiteSpace: 'nowrap' }}>
                  PROJECTS HANDLED
                </th>
                <th style={{ textAlign: 'center', width: '10%', padding: '0.7rem 0.875rem', whiteSpace: 'nowrap' }}>
                  STATUS
                </th>
                <th style={{ textAlign: 'center', width: '8%', padding: '0.7rem 0.875rem', whiteSpace: 'nowrap' }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOffices.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}
                  >
                    No offices match your search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedOffices.map((office) => (
                  <tr key={office.id || office.name}>
                    {/* 1. Office Name */}
                    <td style={{ textAlign: 'left', padding: '0.68rem 0.875rem', verticalAlign: 'middle' }}>
                      <span
                        style={{
                          fontWeight: '600',
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block'
                        }}
                      >
                        {office.name}
                      </span>
                    </td>

                    {/* 2. Location */}
                    <td style={{ textAlign: 'left', padding: '0.68rem 0.875rem', verticalAlign: 'middle' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                        {office.location || '—'}
                      </span>
                    </td>

                    {/* 3. Region */}
                    <td style={{ textAlign: 'left', padding: '0.68rem 0.875rem', verticalAlign: 'middle' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                        {office.region || '—'}
                      </span>
                    </td>

                    {/* 4. Projects Handled */}
                    <td style={{ textAlign: 'left', padding: '0.68rem 0.875rem', verticalAlign: 'middle' }}>
                      <span style={{ whiteSpace: 'nowrap', display: 'block' }}>
                        {office.projects ?? office.total ?? 0} Projects
                      </span>
                    </td>

                    {/* 5. Status */}
                    <td style={{ textAlign: 'center', padding: '0.68rem 0.875rem', verticalAlign: 'middle' }}>
                      <span
                        className="badge badge-new"
                        style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem', lineHeight: '1.2' }}
                      >
                        {office.status || 'Active'}
                      </span>
                    </td>

                    {/* 6. Action: Eye Icon Button */}
                    <td style={{ textAlign: 'center', padding: '0.68rem 0.875rem', verticalAlign: 'middle' }}>
                      <button
                        type="button"
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '5px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          color: '#2563EB',
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.15s ease',
                          height: '28px',
                          width: '30px'
                        }}
                        onClick={() => setSelectedOffice(office)}
                        title={`View ${office.name}`}
                        aria-label={`View ${office.name}`}
                      >
                        <Eye size={13} color="#2563EB" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div>
            Showing {startRow} to {endRow} of {totalCount} entries
          </div>

          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                opacity: validPage <= 1 ? 0.4 : 1,
                cursor: validPage <= 1 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validPage <= 1}
              aria-label="Previous Page"
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                type="button"
                className={`btn ${validPage === pg ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '0.2rem 0.55rem',
                  fontSize: '0.75rem',
                  minWidth: '1.75rem'
                }}
                onClick={() => setCurrentPage(pg)}
                aria-label={`Page ${pg}`}
                aria-current={validPage === pg ? 'page' : undefined}
              >
                {pg}
              </button>
            ))}

            <button
              type="button"
              className="btn btn-outline"
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                opacity: validPage >= totalPages ? 0.4 : 1,
                cursor: validPage >= totalPages ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validPage >= totalPages}
              aria-label="Next Page"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Complete Office Details Modal (Opened via Eye Icon) */}
      {selectedOffice && (
        <div className="modal-overlay" onClick={() => setSelectedOffice(null)}>
          <div
            className="card"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '1.5rem',
              backgroundColor: 'var(--bg-card)',
              position: 'relative',
              borderRadius: 'var(--radius-lg, 12px)',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.25))'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md, 8px)',
                    backgroundColor: 'var(--primary-light, rgba(29, 78, 216, 0.1))',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                    {selectedOffice.name}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.825rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.25rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={13} color="var(--primary)" />
                      {selectedOffice.location}
                    </span>
                    <span>•</span>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                      {selectedOffice.region || 'Asia-Pacific'}
                    </span>
                    <span>•</span>
                    <span className="badge badge-new" style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}>
                      {selectedOffice.status || 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedOffice(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Key Metrics Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  backgroundColor: 'var(--bg-subtle)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md, 8px)'
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                    Projects Handled
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.15rem' }}>
                    {selectedOffice.projects ?? selectedOffice.total ?? 0}
                  </div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                    Pursued Bids
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--success)', marginTop: '0.15rem' }}>
                    {selectedOffice.pursued ?? Math.round((selectedOffice.projects || 1) * 0.35)}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
                    Win Rate
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.15rem' }}>
                    {selectedOffice.winRate || '65%'}
                  </div>
                </div>
              </div>

              {/* Leadership & Team Size */}
              <div>
                <h4
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em'
                  }}
                >
                  Office Leadership &amp; Team
                </h4>
                <div
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md, 8px)',
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    fontSize: '0.825rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Lead Director:</span>
                    <strong style={{ color: 'var(--text-main)' }}>{selectedOffice.lead || 'Ravi Kumar'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Director Role:</span>
                    <span style={{ color: 'var(--text-main)' }}>{selectedOffice.leadRole || 'Regional Director'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Team Size:</span>
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>
                      {selectedOffice.teamSize ? `${selectedOffice.teamSize} specialists` : '18 specialists'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              {(selectedOffice.email || selectedOffice.phone || selectedOffice.address) && (
                <div>
                  <h4
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'var(--text-main)',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em'
                    }}
                  >
                    Contact &amp; Location Details
                  </h4>
                  <div
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md, 8px)',
                      padding: '0.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                      fontSize: '0.825rem'
                    }}
                  >
                    {selectedOffice.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={14} color="var(--primary)" />
                        <a href={`mailto:${selectedOffice.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                          {selectedOffice.email}
                        </a>
                      </div>
                    )}
                    {selectedOffice.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={14} color="var(--primary)" />
                        <span>{selectedOffice.phone}</span>
                      </div>
                    )}
                    {selectedOffice.address && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{selectedOffice.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Core Sectors / Capabilities */}
              {selectedOffice.sectors && selectedOffice.sectors.length > 0 && (
                <div>
                  <h4
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'var(--text-main)',
                      marginBottom: '0.4rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em'
                    }}
                  >
                    Core Sectors
                  </h4>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {selectedOffice.sectors.map((sec, idx) => (
                      <span
                        key={idx}
                        className="badge badge-info"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes / Description */}
              {selectedOffice.notes && (
                <div>
                  <h4
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      color: 'var(--text-main)',
                      marginBottom: '0.4rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em'
                    }}
                  >
                    Notes &amp; Description
                  </h4>
                  <p
                    style={{
                      fontSize: '0.825rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md, 8px)',
                      margin: 0
                    }}
                  >
                    {selectedOffice.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                marginTop: '1.25rem'
              }}
            >
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedOffice(null)}
                style={{ fontSize: '0.85rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Office Modal (Opened via '+' Button) */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="card"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '1.5rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg, 12px)',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.25))'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.875rem',
                marginBottom: '1.25rem'
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                Add New Office
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddOffice} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                  Office Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sydney Office"
                  value={newOffice.name}
                  onChange={(e) => setNewOffice({ ...newOffice, name: e.target.value })}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 0.75rem',
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    Location (City, Country) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sydney, Australia"
                    value={newOffice.location}
                    onChange={(e) => setNewOffice({ ...newOffice, location: e.target.value })}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.75rem',
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    Region *
                  </label>
                  <select
                    value={newOffice.region}
                    onChange={(e) => setNewOffice({ ...newOffice, region: e.target.value })}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.75rem',
                      borderRadius: 'var(--radius-md, 6px)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Asia-Pacific">Asia-Pacific</option>
                    <option value="Europe">Europe</option>
                    <option value="Middle East">Middle East</option>
                    <option value="North America">North America</option>
                    <option value="Latin America">Latin America</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    Projects Handled
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 15"
                    value={newOffice.projects}
                    onChange={(e) => setNewOffice({ ...newOffice, projects: e.target.value })}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.75rem',
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    Team Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 12"
                    value={newOffice.teamSize}
                    onChange={(e) => setNewOffice({ ...newOffice, teamSize: e.target.value })}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.75rem',
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    Lead Director
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Jenkins"
                    value={newOffice.lead}
                    onChange={(e) => setNewOffice({ ...newOffice, lead: e.target.value })}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.75rem',
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                    Director Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Regional Lead"
                    value={newOffice.leadRole}
                    onChange={(e) => setNewOffice({ ...newOffice, leadRole: e.target.value })}
                    style={{
                      width: '100%',
                      height: '36px',
                      padding: '0 0.75rem',
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
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                  Notes &amp; Strategic Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Overview of office operations, target sectors, and tender responsibilities..."
                  value={newOffice.notes}
                  onChange={(e) => setNewOffice({ ...newOffice, notes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md, 6px)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '1rem',
                  marginTop: '0.5rem'
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Office
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
