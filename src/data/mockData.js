export const mockOpportunities = [
  {
    id: 'OPP-001',
    name: 'Urban Infrastructure Development',
    source: 'World Bank',
    sector: 'Infrastructure',
    location: 'Tamil Nadu',
    value: '₹2.50 Crore',
    deadline: '15 Sep 2028',
    status: 'New',
    aiScore: 9.2,
    matchLevel: 'Strong Match',
    type: 'Construction',
    description: 'Development of urban infrastructure including roads, drainage, and public facilities across key urban zones.',
    scoreFactors: [
      'Sector Match',
      'Location Match',
      'Project Value Match',
      'Capability Match',
      'Past Performance'
    ],
    documents: ['Project Document.pdf', 'RFP Document.pdf']
  },
  {
    id: 'OPP-002',
    name: 'Highway Development Project',
    source: 'ADB',
    sector: 'Transport',
    location: 'Karnataka',
    value: '₹8.70 Crore',
    deadline: '20 Sep 2028',
    status: 'New',
    aiScore: 8.7,
    matchLevel: 'High Match',
    type: 'Highway & Roads',
    description: 'Expansion and widening of 4-lane state highway corridors with modern toll management infrastructure.',
    scoreFactors: ['Sector Match', 'Location Match', 'Capability Match'],
    documents: ['Highway_RFP_v2.pdf']
  },
  {
    id: 'OPP-003',
    name: 'Water Supply Project',
    source: 'JICA',
    sector: 'Water',
    location: 'Maharashtra',
    value: '₹4.30 Crore',
    deadline: '25 Sep 2028',
    status: 'New',
    aiScore: 7.8,
    matchLevel: 'Moderate Match',
    type: 'Sanitation & Water',
    description: 'Comprehensive water management and purification plant installation for industrial sub-districts.',
    scoreFactors: ['Location Match', 'Past Performance'],
    documents: ['Water_Project_Brief.pdf']
  },
  {
    id: 'OPP-004',
    name: 'Metro Rail Project',
    source: 'AIIB',
    sector: 'Transport',
    location: 'Delhi',
    value: '₹12.50 Crore',
    deadline: '30 Sep 2028',
    status: 'New',
    aiScore: 8.1,
    matchLevel: 'High Match',
    type: 'Transit',
    description: 'Elevated metro rail station construction and track laying for Phase IV network extension.',
    scoreFactors: ['Sector Match', 'Project Value Match'],
    documents: ['Metro_Phase4_Details.pdf']
  },
  {
    id: 'OPP-005',
    name: 'Industrial Park Development',
    source: 'World Bank',
    sector: 'Infrastructure',
    location: 'Gujarat',
    value: '₹6.10 Crore',
    deadline: '05 Oct 2028',
    status: 'New',
    aiScore: 7.2,
    matchLevel: 'Moderate Match',
    type: 'Commercial',
    description: 'Establishment of eco-industrial park with smart utility grids and green building standards.',
    scoreFactors: ['Sector Match', 'Capability Match'],
    documents: ['Industrial_Park_Specs.pdf']
  }
];

export const mockAlerts = [
  {
    id: 'ALT-101',
    priority: 'HIGH PRIORITY',
    project: 'Highway Development Project',
    aiScore: 9.5,
    source: 'ADB',
    deadlineText: 'Deadline: 4 Days Left!',
    type: 'High Priority',
    urgent: true
  },
  {
    id: 'ALT-102',
    priority: 'DEADLINE',
    project: 'Urban Infrastructure Development',
    aiScore: 9.2,
    source: 'World Bank',
    deadlineText: 'Submission in 2 Days',
    type: 'Deadline',
    urgent: true
  },
  {
    id: 'ALT-103',
    priority: 'NEW OPPORTUNITY',
    project: 'Smart City Command Center',
    aiScore: 8.9,
    source: 'GeM',
    deadlineText: 'Deadline: 14 Days Left',
    type: 'New',
    urgent: false
  }
];

export const mockCalendarEvents = [
  { date: '16 Sep 2028', title: 'Submission Deadline', type: 'deadline', desc: 'Urban Infrastructure Project' },
  { date: '18 Sep 2028', title: 'Pre-bid Meeting', type: 'meeting', desc: 'Highway Development Project' },
  { date: '20 Sep 2028', title: 'Clarification Cut-off', type: 'cutoff', desc: 'Water Supply Project' }
];

export const mockConsortium = [
  {
    id: 'CON-01',
    name: 'ABC Engineering Pvt Ltd',
    match: '83%',
    expertise: 'Transport Infrastructure',
    experience: '15+ Years'
  },
  {
    id: 'CON-02',
    name: 'XYZ Infrastructure Ltd',
    match: '81%',
    expertise: 'Road Construction',
    experience: '18+ Years'
  },
  {
    id: 'CON-03',
    name: 'LMN Builders',
    match: '75%',
    expertise: 'Civil Construction',
    experience: '8+ Years'
  }
];

export const mockSources = [
  { name: 'World Bank', projects: 24, status: 'Active' },
  { name: 'ADB', projects: 18, status: 'Active' },
  { name: 'JICA', projects: 16, status: 'Active' },
  { name: 'AIIB', projects: 12, status: 'Active' },
  { name: 'AfDB', projects: 10, status: 'Active' },
  { name: 'EIB', projects: 8, status: 'Active' },
  { name: 'GeM', projects: 15, status: 'Active' },
  { name: 'TendersIndia', projects: 20, status: 'Active' }
];

export const mockOffices = [
  { name: 'Chennai', total: 24, pursued: 8, declined: 2, highPriority: 3 },
  { name: 'Bangalore', total: 19, pursued: 5, declined: 1, highPriority: 2 },
  { name: 'Mumbai', total: 21, pursued: 7, declined: 3, highPriority: 4 },
  { name: 'Delhi', total: 27, pursued: 9, declined: 2, highPriority: 5 },
  { name: 'Kolkata', total: 15, pursued: 4, declined: 1, highPriority: 1 },
  { name: 'Hyderabad', total: 17, pursued: 5, declined: 1, highPriority: 2 }
];

export const mockUsers = [
  { name: 'Ravi Kumar', office: 'Chennai', role: 'Admin', status: 'Active' },
  { name: 'Arun Singh', office: 'Mumbai', role: 'Manager', status: 'Active' },
  { name: 'Priya Nair', office: 'Delhi', role: 'Researcher', status: 'Active' },
  { name: 'Karthik Raj', office: 'Bangalore', role: 'Researcher', status: 'Active' },
  { name: 'Meena Iyer', office: 'Chennai', role: 'Viewer', status: 'Active' }
];

export const mockAuditTrail = [
  { user: 'Ravi Kumar', action: 'Pursued Opportunity', details: 'Urban Infrastructure Development', time: '10:42 AM' },
  { user: 'Arun Singh', action: 'Changed Priority', details: 'Highway Development Project', time: '10:35 AM' },
  { user: 'Priya Nair', action: 'Viewed Opportunity', details: 'Water Supply Project', time: '10:28 AM' },
  { user: 'Karthik Raj', action: 'Declined Opportunity', details: 'Industrial Park Development', time: '09:58 AM' },
  { user: 'Meena Iyer', action: 'Added Note', details: 'Metro Rail Project', time: '09:14 AM' }
];
