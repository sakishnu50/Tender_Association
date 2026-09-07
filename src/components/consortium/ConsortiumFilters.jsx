import React from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

export default function ConsortiumFilters({
  searchQuery,
  setSearchQuery,
  expertiseFilter,
  setExpertiseFilter,
  experienceFilter,
  setExperienceFilter,
  matchScoreFilter,
  setMatchScoreFilter,
  locationFilter,
  setLocationFilter,
  statusFilter,
  setStatusFilter,
  onResetFilters,
  totalResults,
  totalCount
}) {
  const hasActiveFilters = Boolean(
    searchQuery ||
    expertiseFilter ||
    experienceFilter ||
    matchScoreFilter ||
    locationFilter ||
    statusFilter
  );

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Search Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
          padding: '0.45rem 0.875rem',
          borderRadius: 'var(--radius-md)',
          flex: '1 1 260px',
          transition: 'all 0.15s ease'
        }}>
          <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search partner name, expertise, capabilities, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.875rem',
              width: '100%',
              color: 'var(--text-main)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                border: 'none',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Total Results Summary */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={14} />
          <span>Showing <strong>{totalResults}</strong> of <strong>{totalCount}</strong> consortium partners</span>
        </div>
      </div>

      {/* Filter Select Controls Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '0.625rem',
        alignItems: 'center'
      }}>
        {/* Expertise Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Expertise
          </label>
          <select
            value={expertiseFilter}
            onChange={(e) => setExpertiseFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">All Expertise</option>
            <option value="Transport Infrastructure">Transport Infrastructure</option>
            <option value="Environmental Consultancy">Environmental Consultancy</option>
            <option value="Road Construction">Road Construction</option>
            <option value="Geotechnical & Surveying">Geotechnical & Surveying</option>
            <option value="Intelligent Toll Systems">Intelligent Toll Systems</option>
            <option value="Civil Construction">Civil Construction</option>
          </select>
        </div>

        {/* Experience Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Experience
          </label>
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">All Experience</option>
            <option value="5">5+ Years</option>
            <option value="10">10+ Years</option>
            <option value="15">15+ Years</option>
          </select>
        </div>

        {/* Match Score Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Match Score
          </label>
          <select
            value={matchScoreFilter}
            onChange={(e) => setMatchScoreFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">All Scores</option>
            <option value="90">90%+ Match (High)</option>
            <option value="80">80%+ Match (Good)</option>
            <option value="70">70%+ Match (Moderate)</option>
          </select>
        </div>

        {/* Location Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Location
          </label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">All Locations</option>
            <option value="Karnataka">Karnataka (Local State)</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Recommendation Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">All Statuses</option>
            <option value="recommended">Recommended</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="contacted">Contacted</option>
            <option value="none">Not Actioned</option>
          </select>
        </div>

        {/* Reset Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', justifyContent: 'flex-end' }}>
          <label style={{ fontSize: '0.725rem', opacity: 0 }}>Reset</label>
          <button
            className="btn btn-outline"
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            style={{
              padding: '0.45rem 0.75rem',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              opacity: hasActiveFilters ? 1 : 0.6,
              cursor: hasActiveFilters ? 'pointer' : 'not-allowed'
            }}
          >
            <RotateCcw size={14} /> Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
