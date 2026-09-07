import React, { useState } from 'react';
import { mockConsortium, mockOpportunityRequirements } from '../data/mockData';
import {
  useConsortium,
  useOpportunityRequirements,
  useUpdateConsortiumStatus
} from '../hooks/useApiQueries';

import OpportunityRequirementsCard from '../components/consortium/OpportunityRequirementsCard';
import ConsortiumFilters from '../components/consortium/ConsortiumFilters';
import PartnerCard from '../components/consortium/PartnerCard';
import PartnerProfileModal from '../components/consortium/PartnerProfileModal';
import ConsortiumEmptyState from '../components/consortium/ConsortiumEmptyState';

export default function ConsortiumView() {
  const { data: fetchedConsortium } = useConsortium();
  const { data: fetchedRequirements } = useOpportunityRequirements();
  const updateStatusMutation = useUpdateConsortiumStatus();

  const consortiumList = fetchedConsortium || mockConsortium;
  const requirements = fetchedRequirements || mockOpportunityRequirements;

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [matchScoreFilter, setMatchScoreFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filter Logic
  const filteredList = consortiumList.filter((partner) => {
    // Search Query (name, expertise, whyRecommended, capabilities, location)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = partner.name?.toLowerCase().includes(q);
      const expertiseMatch = partner.expertise?.toLowerCase().includes(q);
      const whyMatch = partner.whyRecommended?.toLowerCase().includes(q);
      const locationMatch = partner.location?.toLowerCase().includes(q) || partner.headquarters?.toLowerCase().includes(q);
      const capsMatch = partner.allCapabilities?.some(c => c.toLowerCase().includes(q));
      if (!nameMatch && !expertiseMatch && !whyMatch && !locationMatch && !capsMatch) {
        return false;
      }
    }

    // Expertise Filter
    if (expertiseFilter) {
      const hasExpertise =
        partner.expertise === expertiseFilter ||
        partner.allCapabilities?.includes(expertiseFilter) ||
        partner.capabilitiesCovered?.includes(expertiseFilter);
      if (!hasExpertise) return false;
    }

    // Experience Filter (Years in business)
    if (experienceFilter) {
      const minYears = parseInt(experienceFilter, 10);
      const partnerYears = partner.yearsInBusiness || parseInt(partner.experience, 10) || 0;
      if (partnerYears < minYears) return false;
    }

    // Match Score Filter
    if (matchScoreFilter) {
      const minScore = parseInt(matchScoreFilter, 10);
      const partnerScore = partner.overallMatch || parseInt(partner.match, 10) || 0;
      if (partnerScore < minScore) return false;
    }

    // Location Filter
    if (locationFilter) {
      const inLocation =
        partner.location === locationFilter ||
        partner.headquarters?.includes(locationFilter);
      if (!inLocation) return false;
    }

    // Status Filter
    if (statusFilter) {
      const currentStatus = partner.status || 'none';
      if (currentStatus !== statusFilter) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setExpertiseFilter('');
    setExperienceFilter('');
    setMatchScoreFilter('');
    setLocationFilter('');
    setStatusFilter('');
  };

  const handleViewProfile = (partner) => {
    setSelectedPartner(partner);
    setIsProfileOpen(true);
  };

  const handleUpdateStatus = async (partnerId, status) => {
    await updateStatusMutation.mutateAsync({ id: partnerId, status });
    // If modal is open for this partner, update modal state too
    if (selectedPartner && selectedPartner.id === partnerId) {
      setSelectedPartner(prev => prev ? { ...prev, status } : prev);
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Consortium Recommendations</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Opportunity: <strong>{requirements?.opportunityName || 'Highway Development Project'}</strong> ({requirements?.location || 'Karnataka'})
          </span>
        </div>
      </div>

      {/* 1. Opportunity Requirements & Missing Capabilities Section */}
      <OpportunityRequirementsCard requirements={requirements} />

      {/* 6. Filter and Search Toolbar */}
      <ConsortiumFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expertiseFilter={expertiseFilter}
        setExpertiseFilter={setExpertiseFilter}
        experienceFilter={experienceFilter}
        setExperienceFilter={setExperienceFilter}
        matchScoreFilter={matchScoreFilter}
        setMatchScoreFilter={setMatchScoreFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onResetFilters={handleResetFilters}
        totalResults={filteredList.length}
        totalCount={consortiumList.length}
      />

      {/* Partner List / Empty State */}
      {filteredList.length === 0 ? (
        /* 7. Empty State */
        <ConsortiumEmptyState onResetFilters={handleResetFilters} />
      ) : (
        /* 3, 4, 5. Partner Recommendation Cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredList.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onViewProfile={handleViewProfile}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      {/* Partner Profile Modal */}
      <PartnerProfileModal
        partner={selectedPartner}
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedPartner(null);
        }}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
