import React, { useState, useRef, useEffect, useMemo } from 'react';
import { mockConsortium, mockOpportunityRequirements } from '../data/mockData';
import { Search } from 'lucide-react';
import {
  useConsortium,
  useOpportunityRequirements,
  useUpdateConsortiumStatus
} from '../hooks/useApiQueries';

import PartnerTable from '../components/consortium/PartnerTable';
import PartnerProfileModal from '../components/consortium/PartnerProfileModal';

import {
  Filter, RotateCcw
} from 'lucide-react';

/* ══════════════════════════════════════════ */
export default function ConsortiumView({ searchVal = '' }) {
  const { data: fetchedConsortium } = useConsortium();
  const { data: fetchedRequirements } = useOpportunityRequirements();
  const updateStatusMutation = useUpdateConsortiumStatus();

  const rawConsortium   = fetchedConsortium || mockConsortium;
  const requirements   = fetchedRequirements || mockOpportunityRequirements;

  /* ── Local status overrides for instant UI feedback ── */
  const [statusOverrides, setStatusOverrides] = useState({});
  const consortiumList = useMemo(() =>
    rawConsortium.map(p => statusOverrides[p.id] !== undefined
      ? { ...p, status: statusOverrides[p.id] }
      : p
    ),
    [rawConsortium, statusOverrides]
  );

  const [searchQuery,     setSearchQuery]     = useState('');
  /* ── Applied (active) filters — these drive the table ── */
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [experienceFilter,setExperienceFilter]= useState('');
  const [matchScoreFilter,setMatchScoreFilter]= useState('');
  const [locationFilter,  setLocationFilter]  = useState('');
  const [statusFilter,    setStatusFilter]    = useState('');

  /* ── Draft filters — user picks here, applied on "Apply" ── */
  const [draftExpertise,  setDraftExpertise]  = useState('');
  const [draftExperience, setDraftExperience] = useState('');
  const [draftMatchScore, setDraftMatchScore] = useState('');
  const [draftLocation,   setDraftLocation]   = useState('');
  const [draftStatus,     setDraftStatus]     = useState('');

  // Sync global header search into local search query
  React.useEffect(() => {
    setSearchQuery(searchVal || '');
  }, [searchVal]);

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isProfileOpen,   setIsProfileOpen]   = useState(false);

  const [showFilters,     setShowFilters]     = useState(false);
  const filterDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    }
    if (showFilters) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  const filteredList = consortiumList.filter(partner => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const hit = partner.name?.toLowerCase().includes(q)
        || partner.expertise?.toLowerCase().includes(q)
        || partner.whyRecommended?.toLowerCase().includes(q)
        || partner.location?.toLowerCase().includes(q)
        || partner.headquarters?.toLowerCase().includes(q)
        || partner.allCapabilities?.some(c => c.toLowerCase().includes(q));
      if (!hit) return false;
    }
    if (expertiseFilter) {
      const ok = partner.expertise === expertiseFilter
        || partner.allCapabilities?.includes(expertiseFilter)
        || partner.capabilitiesCovered?.includes(expertiseFilter);
      if (!ok) return false;
    }
    if (experienceFilter) {
      const min = parseInt(experienceFilter, 10);
      const yrs = partner.yearsInBusiness || parseInt(partner.experience, 10) || 0;
      if (yrs < min) return false;
    }
    if (matchScoreFilter) {
      const min = parseInt(matchScoreFilter, 10);
      const sc  = partner.overallMatch || parseInt(partner.match, 10) || 0;
      if (sc < min) return false;
    }
    if (locationFilter) {
      if (partner.location !== locationFilter && !partner.headquarters?.includes(locationFilter)) return false;
    }
    if (statusFilter) {
      if ((partner.status || 'none') !== statusFilter) return false;
    }
    return true;
  });

  /* ── Apply: commit draft → active filters ── */
  const handleApplyFilters = () => {
    setExpertiseFilter(draftExpertise);
    setExperienceFilter(draftExperience);
    setMatchScoreFilter(draftMatchScore);
    setLocationFilter(draftLocation);
    setStatusFilter(draftStatus);
    setShowFilters(false);
  };

  /* ── Reset: clear both draft and active ── */
  const handleResetFilters = () => {
    setSearchQuery('');
    setDraftExpertise(''); setDraftExperience(''); setDraftMatchScore('');
    setDraftLocation(''); setDraftStatus('');
    setExpertiseFilter(''); setExperienceFilter(''); setMatchScoreFilter('');
    setLocationFilter(''); setStatusFilter('');
  };

  const hasActiveFilters = Boolean(
    searchQuery || expertiseFilter || experienceFilter ||
    matchScoreFilter || locationFilter || statusFilter
  );

  const handleViewProfile = partner => { setSelectedPartner(partner); setIsProfileOpen(true); };
  const handleUpdateStatus = async (id, status) => {
    // Instantly update local state so table reflects the change
    setStatusOverrides(prev => ({ ...prev, [id]: status }));
    if (selectedPartner?.id === id) setSelectedPartner(prev => prev ? { ...prev, status } : prev);
    // Fire API mutation in background (best-effort)
    try { await updateStatusMutation.mutateAsync({ id, status }); } catch { /* noop */ }
  };

  const activeFilterCount = [
    searchQuery, expertiseFilter, experienceFilter,
    matchScoreFilter, locationFilter, statusFilter,
  ].filter(Boolean).length;

  /* Count of draft selections (to hint user before applying) */
  const draftPickCount = [
    draftExpertise, draftExperience, draftMatchScore,
    draftLocation, draftStatus,
  ].filter(Boolean).length;

  // Sync drafts from active filters when panel opens
  const handleToggleFilters = (e) => {
    e.stopPropagation();
    setShowFilters(p => {
      if (!p) {
        // Opening: seed drafts from current active filters
        setDraftExpertise(expertiseFilter);
        setDraftExperience(experienceFilter);
        setDraftMatchScore(matchScoreFilter);
        setDraftLocation(locationFilter);
        setDraftStatus(statusFilter);
      }
      return !p;
    });
  };

  const selectStyle = (isActive) => ({
    width: '100%', padding: '0.32rem 0.5rem', fontSize: '0.8rem',
    border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
    backgroundColor: isActive ? 'var(--primary-light)' : 'var(--bg-card)',
    color: isActive ? 'var(--primary)' : 'var(--text-main)',
    outline: 'none', cursor: 'pointer', fontWeight: isActive ? '600' : '400',
  });

  const labelStyle = {
    fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px',
  };

  // Flat filter panel
  const filterSlot = (
    <div ref={filterDropdownRef} style={{ position: 'relative', display: 'inline-flex' }}>
      {/* Filter icon toggle button */}
      <button
        type="button"
        className={`btn ${showFilters || activeFilterCount > 0 ? 'btn-primary' : 'btn-outline'}`}
        style={{
          height: '36px',
          padding: activeFilterCount > 0 ? '0 0.5rem' : '0',
          width: activeFilterCount > 0 ? 'auto' : '36px',
          minWidth: '36px',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.35rem', borderRadius: 'var(--radius-md, 6px)', flexShrink: 0,
          fontSize: '0.75rem', fontWeight: '700',
        }}
        onMouseDown={e => e.stopPropagation()}
        onClick={handleToggleFilters}
        title="Filter consortium partners"
        aria-label="Filter consortium partners"
        aria-expanded={showFilters}
      >
        <Filter size={15} />
        {activeFilterCount > 0 && (
          <span style={{ fontSize: '0.75rem', fontWeight: '700', lineHeight: 1 }}>{activeFilterCount}</span>
        )}
      </button>

      {/* Filter panel */}
      {showFilters && (
        <div
          className="card"
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 1000,
            width: '240px',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-card)',
            boxShadow: 'var(--shadow-lg, 0 10px 25px -5px rgba(0,0,0,0.2))',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Panel header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.55rem 0.75rem 0.45rem',
            borderBottom: '1px solid var(--border-color)',
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Filters
            </span>
          </div>

          {/* Scrollable filter body */}
          <div style={{ padding: '0.5rem 0.75rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', overflowY: 'auto', maxHeight: '360px' }}>

            {/* Expertise — draft */}
            <div>
              <label style={labelStyle}>Expertise</label>
              <select value={draftExpertise} onChange={e => setDraftExpertise(e.target.value)} style={selectStyle(draftExpertise)}>
                <option value="">All Expertise</option>
                <option value="Transport Infrastructure">Transport Infrastructure</option>
                <option value="Environmental Consultancy">Environmental Consultancy</option>
                <option value="Road Construction">Road Construction</option>
                <option value="Geotechnical & Surveying">Geotechnical &amp; Surveying</option>
                <option value="Intelligent Toll Systems">Intelligent Toll Systems</option>
                <option value="Civil Construction">Civil Construction</option>
                <option value="Bridge Engineering">Bridge Engineering</option>
                <option value="Urban Planning & DPR">Urban Planning &amp; DPR</option>
                <option value="Utility & Power Infrastructure">Utility &amp; Power Infrastructure</option>
                <option value="Drone Surveying & Remote Sensing">Drone Surveying &amp; Remote Sensing</option>
              </select>
            </div>

            {/* Experience — draft */}
            <div>
              <label style={labelStyle}>Experience</label>
              <select value={draftExperience} onChange={e => setDraftExperience(e.target.value)} style={selectStyle(draftExperience)}>
                <option value="">All Experience</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
                <option value="15">15+ Years</option>
              </select>
            </div>

            {/* Match Score — draft */}
            <div>
              <label style={labelStyle}>Match Score</label>
              <select value={draftMatchScore} onChange={e => setDraftMatchScore(e.target.value)} style={selectStyle(draftMatchScore)}>
                <option value="">All Scores</option>
                <option value="90">90%+ High</option>
                <option value="80">80%+ Good</option>
                <option value="70">70%+ Moderate</option>
              </select>
            </div>

            {/* Location — draft */}
            <div>
              <label style={labelStyle}>Location</label>
              <select value={draftLocation} onChange={e => setDraftLocation(e.target.value)} style={selectStyle(draftLocation)}>
                <option value="">All Locations</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Telangana">Telangana</option>
              </select>
            </div>

            {/* Status — draft */}
            <div>
              <label style={labelStyle}>Status</label>
              <select value={draftStatus} onChange={e => setDraftStatus(e.target.value)} style={selectStyle(draftStatus)}>
                <option value="">All Statuses</option>
                <option value="accepted">Accepted</option>
                <option value="invited">Invited</option>
                <option value="recommended">Recommended</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="contacted">Contacted</option>
                <option value="none">Not Actioned</option>
              </select>
            </div>
          </div>

          {/* ── Action buttons: Apply & Reset ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.5rem 0.75rem',
            borderTop: '1px solid var(--border-color)',
          }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={e => { e.stopPropagation(); handleApplyFilters(); }}
              style={{
                flex: 1, fontSize: '0.75rem', fontWeight: '700',
                padding: '0.35rem 0', borderRadius: 'var(--radius-md)',
              }}
            >
              Apply Filters{draftPickCount > 0 ? ` (${draftPickCount})` : ''}
            </button>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); handleResetFilters(); }}
              title="Reset all filters"
              style={{
                background: 'none', border: '1px solid var(--border-color)', cursor: 'pointer',
                padding: '0.35rem 0.55rem', borderRadius: 'var(--radius-md)',
                display: 'inline-flex', alignItems: 'center', gap: '3px',
                color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: '600',
              }}
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ── JSX return ──
  return (
    <div className="page-container" style={{ padding: '1rem 1.5rem', gap: '0.875rem', width: '100%', boxSizing: 'border-box' }}>
      {/* Single Control Row: Heading on Left, Search + Filter on Right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <h1
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            margin: 0,
            color: 'var(--text-main)',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
          }}
        >
          Consortium
        </h1>

        {/* Grouped Right Controls: Search + Filter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexShrink: 0,
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
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search partners..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Filter Button & Floating Dropdown */}
          {filterSlot}
        </div>
      </div>

      {/* ── Full-width Partner Table (no filter bar inside) ── */}
      <PartnerTable
        filteredList={filteredList}
        consortiumList={consortiumList}
        onViewProfile={handleViewProfile}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* ── Partner Profile Modal ── */}
      <PartnerProfileModal
        partner={selectedPartner}
        isOpen={isProfileOpen}
        onClose={() => { setIsProfileOpen(false); setSelectedPartner(null); }}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

