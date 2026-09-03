export type RecommendationStatus = 'none' | 'recommended' | 'shortlisted' | 'contacted';

export interface MatchBreakdown {
  overallMatch: number; // e.g. 91
  technicalMatch: number; // e.g. 94
  experienceMatch: number; // e.g. 88
  geographicMatch: number; // e.g. 92
}

export interface ConsortiumPartner {
  id: string;
  name: string;
  location: string;
  match: string; // e.g. "91%" (legacy & card header)
  overallMatch: number; // 91
  technicalMatch: string; // "94%"
  technicalScore: number; // 94
  experienceMatch: string; // "88%"
  experienceScore: number; // 88
  geographicMatch: string; // "92%"
  geographicScore: number; // 92
  expertise: string; // Primary domain
  experience: string; // e.g. "15+ Years"
  yearsInBusiness: number; // 16
  whyRecommended: string;
  capabilitiesCovered: string[]; // Missing capabilities this partner provides
  allCapabilities: string[]; // Full capability list
  status: RecommendationStatus;
  headquarters: string;
  teamSize: string;
  contactEmail: string;
  contactPhone: string;
  representative: string;
  pastProjects: {
    title: string;
    client: string;
    value: string;
    year: string;
  }[];
  certifications: string[];
}

export interface OpportunityRequirements {
  id: string;
  opportunityName: string;
  tenderCode: string;
  location: string;
  budget: string;
  targetCompany: string; // e.g. "Mukesh & Associates"
  requiredCapabilities: {
    name: string;
    category: string;
    description: string;
  }[];
  missingCapabilities: {
    name: string;
    reason: string;
    impact: 'High' | 'Medium';
  }[];
  internalCapabilities: string[];
}
