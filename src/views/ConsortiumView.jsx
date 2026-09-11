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
  Building, MapPin, Calendar, X, SlidersHorizontal
} from 'lucide-react';

/* ── Capabilities Popup ── */
function CapabilitiesPopup({ type, requirements, onClose }) {
  if (!requirements) return null;
  const isRequired = type === 'required';
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      backgroundColor: 'rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end',
      padding: '68px 24px 0',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '360px', maxHeight: 'calc(100vh - 90px)', overflowY: 'auto',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: isRequired ? '1px solid var(--border-color)' : '1px solid var(--warning)',
        boxShadow: 'var(--shadow-lg)',
        padding: '1.125rem',
        display: 'flex', flexDirection: 'column', gap: '0.875rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isRequired
              ? <Layers size={15} color="var(--primary)" />
              : <AlertTriangle size={15} color="var(--warning)" />}
            <span style={{
              fontSize: '0.82rem', fontWeight: '700',
              color: isRequired ? 'var(--text-main)' : 'var(--warning-text)',
              textTransform: 'uppercase', letterSpacing: '0.03em'
            }}>
              {isRequired ? 'Required Capabilities' : `Missing Capabilities (${requirements.targetCompany})`}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: '700', padding: '1px 7px', borderRadius: '9999px',
              backgroundColor: isRequired ? 'var(--primary-light)' : 'var(--warning-bg)',
              color: isRequired ? 'var(--primary)' : 'var(--warning-text)',
              border: isRequired ? 'none' : '1px solid var(--warning)',
            }}>
              {isRequired
                ? `${requirements.requiredCapabilities?.length || 0} Mandated`
                : 'Action Needed'}
            </span>
            <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '2px' }}>
              <X size={15} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {isRequired
            ? requirements.requiredCapabilities?.map((cap, idx) => (
                <div key={idx} title={cap.description} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)',
                  fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-main)',
                }}>
                  <CheckCircle2 size={12} color="var(--success)" style={{ flexShrink: 0 }} />
                  {cap.name}
                </div>
              ))
            : requirements.missingCapabilities?.map((gap, idx) => (
                <div key={idx} title={gap.reason} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.3rem 0.65rem', borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--warning-bg)', border: '1px solid rgba(217,119,6,0.35)',
                  fontSize: '0.78rem', fontWeight: '700', color: 'var(--warning-text)',
                }}>
                  <AlertTriangle size={12} color="var(--warning)" style={{ flexShrink: 0 }} />
                  {gap.name}
                </div>
              ))
          }
        </div>

        <div style={{
          fontSize: '0.73rem', lineHeight: '1.5', display: 'flex', gap: '0.4rem',
          borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem',
        }}>
          {isRequired
            ? <><Layers size={12} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: 'var(--text-muted)' }}>
                  Mandatory technical and operational benchmarks required by{' '}
                  <strong style={{ color: 'var(--text-main)' }}>{requirements.fundingAgency}</strong> for consortium qualification.
                </span></>
            : <><Sparkles size={12} color="var(--warning)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong style={{ color: 'var(--warning-text)' }}>AI Recommendation:</strong>{' '}
                  <span style={{ color: 'var(--text-muted)' }}>Partner with listed consortium candidates below to bridge these missing capabilities and reach 100% tender compliance.</span>
                </span></>
          }
        </div>
      </div>
    </div>
  );
}

/* ── Filters Dropdown Popup ── */
function FiltersPopup({ onClose, anchorRef,
  searchQuery, setSearchQuery,
  expertiseFilter, setExpertiseFilter,
  experienceFilter, setExperienceFilter,
  matchScoreFilter, setMatchScoreFilter,
  locationFilter, setLocationFilter,
  statusFilter, setStatusFilter,
  onResetFilters, hasActiveFilters,
}) {
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (popupRef.current && !popupRef.current.contains(e.target) &&
          anchorRef.current && !anchorRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose, anchorRef]);

  const selectStyle = {
    padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)',
    color: 'var(--text-main)', fontSize: '0.79rem', outline: 'none', cursor: 'pointer', width: '100%',
  };
  const labelStyle = {
    fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)',
    textTransform: 'uppercase', marginBottom: '3px', display: 'block', letterSpacing: '0.05em',
  };

  return (
    <div ref={popupRef} style={{
      position: 'absolute', top: '100%', right: 0, marginTop: '6px',
      width: '240px', backgroundColor: 'var(--bg-card)',
      borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)', padding: '14px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      zIndex: 900,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filters</span>
        <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '2px' }}>
          <X size={13} />
        </button>
      </div>

      {/* Search */}
      <div>
        <label style={labelStyle}>Search Partner</label>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)',
          padding: '0.35rem 0.55rem', borderRadius: 'var(--radius-md)',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Search…" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.78rem', width: '100%', color: 'var(--text-main)' }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '700', fontSize: '0.72rem', lineHeight: 1, padding: 0 }}>✕</button>
          )}
        </div>
      </div>

      <div><label style={labelStyle}>Expertise</label>
        <select value={expertiseFilter} onChange={e => setExpertiseFilter(e.target.value)} style={selectStyle}>
          <option value="">All Expertise</option>
          <option value="Transport Infrastructure">Transport Infrastructure</option>
          <option value="Environmental Consultancy">Environmental Consultancy</option>
          <option value="Road Construction">Road Construction</option>
          <option value="Geotechnical & Surveying">Geotechnical &amp; Surveying</option>
          <option value="Intelligent Toll Systems">Intelligent Toll Systems</option>
          <option value="Civil Construction">Civil Construction</option>
        </select>
      </div>

      <div><label style={labelStyle}>Experience</label>
        <select value={experienceFilter} onChange={e => setExperienceFilter(e.target.value)} style={selectStyle}>
          <option value="">All Experience</option>
          <option value="5">5+ Years</option>
          <option value="10">10+ Years</option>
          <option value="15">15+ Years</option>
        </select>
      </div>

      <div><label style={labelStyle}>Match Score</label>
        <select value={matchScoreFilter} onChange={e => setMatchScoreFilter(e.target.value)} style={selectStyle}>
          <option value="">All Scores</option>
          <option value="90">90%+ High</option>
          <option value="80">80%+ Good</option>
          <option value="70">70%+ Moderate</option>
        </select>
      </div>

      <div><label style={labelStyle}>Location</label>
        <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={selectStyle}>
          <option value="">All Locations</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Gujarat">Gujarat</option>
        </select>
      </div>

      <div><label style={labelStyle}>Status</label>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="">All Statuses</option>
          <option value="recommended">Recommended</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="contacted">Contacted</option>
          <option value="none">Not Actioned</option>
        </select>
      </div>

      <button onClick={onResetFilters} disabled={!hasActiveFilters}
        style={{
          padding: '0.35rem', fontSize: '0.75rem', fontWeight: '600',
          border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
          backgroundColor: 'transparent', color: 'var(--text-muted)',
          cursor: hasActiveFilters ? 'pointer' : 'not-allowed',
          opacity: hasActiveFilters ? 1 : 0.38, width: '100%',
        }}>
        ↺ Reset Filters
      </button>
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

  const [activePopup,     setActivePopup]     = useState(null); // 'required'|'missing'|'filters'|null
  const filterBtnRef = useRef(null);

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

  const togglePopup = key => setActivePopup(p => p === key ? null : key);

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

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>

            {/* Required Capabilities */}
            <button onClick={() => togglePopup('required')} title="Required Capabilities"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '0.35rem 0.7rem', fontSize: '0.77rem', fontWeight: '600',
                border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)',
                backgroundColor: activePopup === 'required' ? 'var(--primary-light)' : 'var(--bg-card)',
                color: activePopup === 'required' ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.15s ease', whiteSpace: 'nowrap',
              }}>
              <Layers size={13} />
              Required Capabilities
              <span style={{
                fontSize: '0.62rem', fontWeight: '700', padding: '1px 5px', borderRadius: '9999px',
                backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
              }}>{requirements?.requiredCapabilities?.length || 0}</span>
            </button>

            {/* Missing Capabilities */}
            <button onClick={() => togglePopup('missing')} title="Missing Capabilities"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '0.35rem 0.7rem', fontSize: '0.77rem', fontWeight: '600',
                border: `1px solid ${activePopup === 'missing' ? 'var(--warning)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: activePopup === 'missing' ? 'var(--warning-bg)' : 'var(--bg-card)',
                color: activePopup === 'missing' ? 'var(--warning-text)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.15s ease', whiteSpace: 'nowrap',
              }}>
              <AlertTriangle size={13} />
              Missing Capabilities
              <span style={{
                fontSize: '0.62rem', fontWeight: '700', padding: '1px 5px', borderRadius: '9999px',
                backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)',
                border: '1px solid var(--warning)',
              }}>{requirements?.missingCapabilities?.length || 0}</span>
            </button>

            {/* Filter Button */}
            <button ref={filterBtnRef} onClick={() => togglePopup('filters')} title="Filters"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '0.35rem 0.7rem', fontSize: '0.77rem', fontWeight: '600',
                border: `1px solid ${activePopup === 'filters' || hasActiveFilters ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                backgroundColor: activePopup === 'filters' || hasActiveFilters ? 'var(--primary-light)' : 'var(--bg-card)',
                color: activePopup === 'filters' || hasActiveFilters ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.15s ease', whiteSpace: 'nowrap',
              }}>
              <SlidersHorizontal size={13} />
              Filters
              {hasActiveFilters && (
                <span style={{
                  fontSize: '0.62rem', fontWeight: '700', padding: '1px 5px', borderRadius: '9999px',
                  backgroundColor: 'var(--primary)', color: '#fff',
                }}>ON</span>
              )}
            </button>

            {/* Filters Dropdown */}
            {activePopup === 'filters' && (
              <FiltersPopup
                anchorRef={filterBtnRef}
                onClose={() => setActivePopup(null)}
                searchQuery={searchQuery}     setSearchQuery={setSearchQuery}
                expertiseFilter={expertiseFilter}   setExpertiseFilter={setExpertiseFilter}
                experienceFilter={experienceFilter}  setExperienceFilter={setExperienceFilter}
                matchScoreFilter={matchScoreFilter}  setMatchScoreFilter={setMatchScoreFilter}
                locationFilter={locationFilter}    setLocationFilter={setLocationFilter}
                statusFilter={statusFilter}       setStatusFilter={setStatusFilter}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Full-width Partner Table ── */}
      <PartnerTable
        filteredList={filteredList}
        consortiumList={consortiumList}
        onViewProfile={handleViewProfile}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* ── Capabilities Popups ── */}
      {(activePopup === 'required' || activePopup === 'missing') && (
        <CapabilitiesPopup
          type={activePopup}
          requirements={requirements}
          onClose={() => setActivePopup(null)}
        />
      )}

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
