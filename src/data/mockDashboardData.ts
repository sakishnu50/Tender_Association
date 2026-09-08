// ── Types ──────────────────────────────────────────────────────────────
export interface SummaryData {
  totalOpportunities: number;
  pendingReview: number;
  highPriority: number;
  pursued: number;
}

export interface OfficeBreakdown {
  office: string;
  count: number;
}

export interface HighPriorityItem {
  id: string;
  name: string;
  deadline: string;
  score: number;
  status: 'Urgent' | 'Under Review' | 'New' | 'Closing Soon';
}

// ── Data ───────────────────────────────────────────────────────────────

export const summaryData: SummaryData = {
  totalOpportunities: 42,
  pendingReview: 8,
  highPriority: 5,
  pursued: 12,
};

export const officeBreakdownData: OfficeBreakdown[] = [
  { office: 'Chennai', count: 14 },
  { office: 'Coimbatore', count: 8 },
  { office: 'Bangalore', count: 12 },
  { office: 'Mumbai', count: 8 },
];

export const highPriorityFeed: HighPriorityItem[] = [
  {
    id: 'HP-001',
    name: 'National Highway Widening – NH48 Corridor',
    deadline: '02 Sep 2026',
    score: 9.4,
    status: 'Urgent',
  },
  {
    id: 'HP-002',
    name: 'Smart City Surveillance Network – Phase II',
    deadline: '10 Sep 2026',
    score: 8.8,
    status: 'Under Review',
  },
  {
    id: 'HP-003',
    name: 'Metro Rail Depot Construction – Line 4',
    deadline: '15 Sep 2026',
    score: 9.1,
    status: 'New',
  },
  {
    id: 'HP-004',
    name: 'Coastal Erosion Protection Works – Tamil Nadu',
    deadline: '05 Sep 2026',
    score: 8.6,
    status: 'Closing Soon',
  },
];
