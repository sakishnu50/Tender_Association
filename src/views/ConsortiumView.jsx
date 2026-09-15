import React, { useState, useRef, useEffect } from 'react';
import { mockConsortium, mockOpportunityRequirements } from '../data/mockData';
import {
  useConsortium,
  useOpportunityRequirements,
  useUpdateConsortiumStatus
} from '../hooks/useApiQueries';

import PartnerTable from '../components/consortium/PartnerTable';
import PartnerProfileModal from '../components/consortium/PartnerProfileModal';

import {
  Layers, AlertTriangle, CheckCircle2, Sparkles,
  Building, MapPin, Calendar, Filter, RotateCcw
} from 'lucide-react';

/* ── Inline Capabilities Panel ── */
function CapabilitiesPanel({ requirements }) {
  if (!requirements) return null;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem',
    }}>
      {/* Required Capabilities */}
      <div style={{
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        border: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={15} color="var(--primary)" />
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Required Capabilities
            </span>
          </div>
          <span style={{
            fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px',
            backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
          }}>
            {requirements.requiredCapabilities?.length || 0} Mandated
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {requirements.requiredCapabilities?.map((cap, idx) => (
            <div key={idx} title={cap.description} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)',
              fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-main)',
            }}>
              <CheckCircle2 size={13} color="var(--success)" style={{ flexShrink: 0 }} />
              {cap.name}
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', lineHeight: '1.5', display: 'flex', gap: '0.4rem' }}>
          <Layers size={12} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>Mandatory technical and operational benchmarks required by{' '}
            <strong style={{ color: 'var(--text-main)' }}>{requirements.fundingAgency}</strong> for consortium qualification.
          </span>
        </div>
      </div>

      {/* Missing Capabilities */}
      <div style={{
        backgroundColor: 'rgba(254,243,199,0.18)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        border: '1px solid var(--warning)',
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={15} color="var(--warning)" />
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--warning-text)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Missing Capabilities ({requirements.targetCompany})
            </span>
          </div>
          <span style={{
            fontSize: '0.65rem', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px',
            backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)',
            border: '1px solid var(--warning)',
          }}>
            Action Needed
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {requirements.missingCapabilities?.map((gap, idx) => (
            <div key={idx} title={gap.reason} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warning-bg)', border: '1px solid rgba(217,119,6,0.35)',
              fontSize: '0.8rem', fontWeight: '700', color: 'var(--warning-text)',
            }}>
              <AlertTriangle size={13} color="var(--warning)" style={{ flexShrink: 0 }} />
              {gap.name}
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.73rem', lineHeight: '1.5', display: 'flex', gap: '0.4rem' }}>
          <Sparkles size={12} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong style={{ color: 'var(--warning-text)' }}>AI Recommendation:</strong>{' '}
            <span style={{ color: 'var(--text-muted)' }}>Partner with listed consortium candidates below to bridge these missing capabilities and reach 100% tender compliance.</span>
          </span>
        </div>
      </div>
    </div>
  );
}





/* ══════════════════════════════════════════ */
export default function ConsortiumView({ searchVal = '' }) {
  const { data: fetchedConsortium } = useConsortium();
  const { data: fetchedRequirements } = useOpportunityRequirements();
  const updateStatusMutation = useUpdateConsortiumStatus();

  const consortiumList = fetchedConsortium || mockConsortium;
  const requirements   = fetchedRequirements || mockOpportunityRequirements;

  const [searchQuery,     setSearchQuery]     = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [experienceFilter,setExperienceFilter]= useState('');
  const [matchScoreFilter,setMatchScoreFilter]= useState('');
  const [locationFilter,  setLocationFilter]  = useState('');
  const [statusFilter,    setStatusFilter]    = useState('');
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

  const handleResetFilters = () => {
    setSearchQuery(''); setExpertiseFilter(''); setExperienceFilter('');
    setMatchScoreFilter(''); setLocationFilter(''); setStatusFilter('');
  };

  const hasActiveFilters = Boolean(
    searchQuery || expertiseFilter || experienceFilter ||
    matchScoreFilter || locationFilter || statusFilter
  );

  const handleViewProfile = partner => { setSelectedPartner(partner); setIsProfileOpen(true); };
  const handleUpdateStatus = async (id, status) => {
    await updateStatusMutation.mutateAsync({ id, status });
    if (selectedPartner?.id === id) setSelectedPartner(prev => prev ? { ...prev, status } : prev);
  };

  const activeFilterCount = [
    searchQuery, expertiseFilter, experienceFilter,
    matchScoreFilter, locationFilter, statusFilter,
  ].filter(Boolean).length;

  // Flat filter panel — all filters visible at once, panel stays open on selection
  const filterSlot = (
    <div ref={filterDropdownRef} style={{ position: 'relative', display: 'inline-flex' }}>
      {/* Filter icon toggle button */}
      <button
        type="button"
        className={`btn ${showFilters || activeFilterCount > 0 ? 'btn-primary' : 'btn-outline'}`}
        style={{
          height: '26px',
          padding: activeFilterCount > 0 ? '0 0.5rem' : '0',
          width: activeFilterCount > 0 ? 'auto' : '26px',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          gap: '0.3rem', borderRadius: 'var(--radius-md)', flexShrink: 0,
          fontSize: '0.72rem', fontWeight: '700',
        }}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => { e.stopPropagation(); setShowFilters(p => !p); }}
        title="Filter consortium partners"
        aria-label="Filter consortium partners"
        aria-expanded={showFilters}
      >
        <Filter size={13} />
        {activeFilterCount > 0 && (
          <span style={{ fontSize: '0.68rem', fontWeight: '700', lineHeight: 1 }}>{activeFilterCount}</span>
        )}
      </button>

      {/* Flat filter panel — stopPropagation on mousedown keeps it open during interaction */}
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
          {/* Panel header with reset */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.55rem 0.75rem 0.45rem',
            borderBottom: '1px solid var(--border-color)',
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Filters
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); handleResetFilters(); }}
                  title="Reset all filters"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    color: 'var(--primary)', borderRadius: '4px',
                    fontSize: '0.68rem', fontWeight: '600',
                  }}
                >
                  <RotateCcw size={11} /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Scrollable filter body */}
          <div style={{ padding: '0.5rem 0.75rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.55rem', overflowY: 'auto', maxHeight: '360px' }}>

            {/* Search */}
            <div>
              <label style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
                Search Partner
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)',
                padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-md)',
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
                  fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search partners…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.79rem', width: '100%', color: 'var(--text-main)' }}
                />
                {searchQuery && (
                  <button onClick={e => { e.stopPropagation(); setSearchQuery(''); }}
                    style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '700', fontSize: '0.72rem', lineHeight: 1, padding: 0 }}>✕</button>
                )}
              </div>
            </div>

            {/* Expertise */}
            <div>
              <label style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
                Expertise
              </label>
              <select
                value={expertiseFilter}
                onChange={e => setExpertiseFilter(e.target.value)}
                style={{
                  width: '100%', padding: '0.32rem 0.5rem', fontSize: '0.8rem',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                  backgroundColor: expertiseFilter ? 'var(--primary-light)' : 'var(--bg-card)',
                  color: expertiseFilter ? 'var(--primary)' : 'var(--text-main)',
                  outline: 'none', cursor: 'pointer', fontWeight: expertiseFilter ? '600' : '400',
                }}
              >
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

            {/* Experience */}
            <div>
              <label style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
                Experience
              </label>
              <select
                value={experienceFilter}
                onChange={e => setExperienceFilter(e.target.value)}
                style={{
                  width: '100%', padding: '0.32rem 0.5rem', fontSize: '0.8rem',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                  backgroundColor: experienceFilter ? 'var(--primary-light)' : 'var(--bg-card)',
                  color: experienceFilter ? 'var(--primary)' : 'var(--text-main)',
                  outline: 'none', cursor: 'pointer', fontWeight: experienceFilter ? '600' : '400',
                }}
              >
                <option value="">All Experience</option>
                <option value="5">5+ Years</option>
                <option value="10">10+ Years</option>
                <option value="15">15+ Years</option>
              </select>
            </div>

            {/* Match Score */}
            <div>
              <label style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
                Match Score
              </label>
              <select
                value={matchScoreFilter}
                onChange={e => setMatchScoreFilter(e.target.value)}
                style={{
                  width: '100%', padding: '0.32rem 0.5rem', fontSize: '0.8rem',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                  backgroundColor: matchScoreFilter ? 'var(--primary-light)' : 'var(--bg-card)',
                  color: matchScoreFilter ? 'var(--primary)' : 'var(--text-main)',
                  outline: 'none', cursor: 'pointer', fontWeight: matchScoreFilter ? '600' : '400',
                }}
              >
                <option value="">All Scores</option>
                <option value="90">90%+ High</option>
                <option value="80">80%+ Good</option>
                <option value="70">70%+ Moderate</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
                Location
              </label>
              <select
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                style={{
                  width: '100%', padding: '0.32rem 0.5rem', fontSize: '0.8rem',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                  backgroundColor: locationFilter ? 'var(--primary-light)' : 'var(--bg-card)',
                  color: locationFilter ? 'var(--primary)' : 'var(--text-main)',
                  outline: 'none', cursor: 'pointer', fontWeight: locationFilter ? '600' : '400',
                }}
              >
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

            {/* Status */}
            <div>
              <label style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{
                  width: '100%', padding: '0.32rem 0.5rem', fontSize: '0.8rem',
                  border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                  backgroundColor: statusFilter ? 'var(--primary-light)' : 'var(--bg-card)',
                  color: statusFilter ? 'var(--primary)' : 'var(--text-main)',
                  outline: 'none', cursor: 'pointer', fontWeight: statusFilter ? '600' : '400',
                }}
              >
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
        </div>
      )}
    </div>
  );

  // ── JSX return ──
  return (
    <div className="page-container">

      {/* ── Page Header ── */}
      <div className="page-header" style={{ paddingTop: 0, paddingBottom: 0, minHeight: 'unset' }}>
        <div style={{
          paddingTop: '24px', paddingBottom: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '10px',
        }}>
          {/* Opportunity info */}
          <div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Opportunity:{' '}
              <strong style={{ color: 'var(--text-main)', fontWeight: '700' }}>
                {requirements?.opportunityName || 'Highway Development Project'}
              </strong>
              {' '}({requirements?.location || 'Karnataka'})
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '5px', fontSize: '0.77rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Building size={12} color="var(--primary)" />
                Target Lead: <strong style={{ color: 'var(--text-main)', marginLeft: '2px' }}>{requirements?.targetCompany}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={12} color="var(--primary)" />
                Location: <strong style={{ color: 'var(--text-main)', marginLeft: '2px' }}>{requirements?.location}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={12} color="var(--primary)" />
                Deadline: <strong style={{ color: 'var(--text-main)', marginLeft: '2px' }}>{requirements?.submissionDeadline}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Capabilities Panel (always visible) ── */}
      <CapabilitiesPanel requirements={requirements} />

      {/* ── Full-width Partner Table (filter icon embedded in strip) ── */}
      <PartnerTable
        filteredList={filteredList}
        consortiumList={consortiumList}
        onViewProfile={handleViewProfile}
        onUpdateStatus={handleUpdateStatus}
        filterSlot={filterSlot}
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
