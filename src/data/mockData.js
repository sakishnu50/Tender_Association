export const mockOpportunities = [
  {
    id: 'OPP-001',
    name: 'Urban Infrastructure Development',
    organization: 'World Bank – South Asia Region',
    source: 'World Bank',
    sector: 'Infrastructure',
    location: 'Tamil Nadu',
    value: '₹2.50 Crore',
    deadline: '15 Sep 2028',
    status: 'New',
    aiScore: 9.2,
    matchLevel: 'Strong Match',
    priority: 'HIGH',
    type: 'Construction',
    procurementType: 'International Competitive Bidding',
    description: 'Development of urban infrastructure including roads, drainage, and public facilities across key urban zones.',
    scoreFactors: [
      'Sector Match',
      'Location Match',
      'Project Value Match',
      'Capability Match',
      'Past Performance'
    ],
    scoreBreakdown: [
      { label: 'Sector Match',       score: 9.5, max: 10 },
      { label: 'Location Match',     score: 9.0, max: 10 },
      { label: 'Agency Experience',  score: 9.2, max: 10 },
      { label: 'Company Capacity',   score: 9.0, max: 10 }
    ],
    aiAnalysis: {
      summary: "This opportunity received a high score because it strongly matches the company's infrastructure experience, the project location is suitable, and the organization aligns with the company's previous project experience.",
      strengths: [
        'Strong infrastructure sector match',
        'Relevant company experience',
        'Suitable project location',
        'Strong organization alignment'
      ],
      risks: [
        'Competitive bidding process',
        'Submission deadline requires timely preparation',
        'Final eligibility requirements need verification'
      ],
      recommendation: 'Highly Recommended – Pursue'
    },
    similarProjects: [
      {
        id: 'SP-101',
        name: 'Urban Infrastructure Improvement Project',
        client: 'World Bank',
        sector: 'Infrastructure',
        location: 'Tamil Nadu',
        status: 'Completed',
        completionDate: 'Mar 2025',
        similarity: 89
      },
      {
        id: 'SP-102',
        name: 'City Infrastructure Development Project',
        client: 'ADB',
        sector: 'Infrastructure',
        location: 'Karnataka',
        status: 'Completed',
        completionDate: 'Aug 2024',
        similarity: 84
      },
      {
        id: 'SP-103',
        name: 'Regional Infrastructure Development',
        client: 'JICA',
        sector: 'Infrastructure',
        location: 'Maharashtra',
        status: 'Completed',
        completionDate: 'Dec 2023',
        similarity: 81
      }
    ],
    documents: ['Project Document.pdf', 'RFP Document.pdf'],
    auditTrail: [
      { id: 'AT-01', action: 'Tender Collected',    actor: 'System',     role: 'System', date: '03 Sep 2026', time: '10:00 AM', type: 'collect' },
      { id: 'AT-02', action: 'AI Score Calculated', actor: 'AI Engine',  role: 'AI',     date: '03 Sep 2026', time: '10:05 AM', type: 'ai'      },
      { id: 'AT-03', action: 'Manager Reviewed',    actor: 'Ravi Kumar', role: 'Admin',  date: '03 Sep 2026', time: '11:00 AM', type: 'review'  }
    ]
  },

  {
    id: 'OPP-002',
    name: 'Highway Development Project',
    organization: 'Asian Development Bank (ADB)',
    source: 'ADB',
    sector: 'Transport',
    location: 'Karnataka',
    value: '₹8.70 Crore',
    deadline: '20 Sep 2028',
    status: 'New',
    aiScore: 8.7,
    matchLevel: 'High Match',
    priority: 'HIGH',
    type: 'Highway & Roads',
    procurementType: 'International Competitive Bidding',
    description: 'Expansion and widening of 4-lane state highway corridors with modern toll management infrastructure.',
    scoreFactors: ['Sector Match', 'Location Match', 'Capability Match'],
    scoreBreakdown: [
      { label: 'Sector Match',       score: 9, max: 10 },
      { label: 'Location Match',     score: 8, max: 10 },
      { label: 'Agency Experience',  score: 8, max: 10 },
      { label: 'Company Capacity',   score: 9, max: 10 }
    ],
    aiAnalysis: {
      summary: 'This highway tender is an excellent fit for the company\'s demonstrated transport infrastructure expertise. ADB is a known client with whom prior project relationships exist.',
      strengths: [
        'Strong history in highway and road construction',
        'ADB project experience across South Asia',
        'Karnataka office well-positioned for site proximity',
        'High company capacity relative to project scale'
      ],
      risks: [
        'Competitive field with large national contractors',
        'Potential land acquisition delays'
      ],
      recommendation: 'Highly Recommended – Pursue'
    },
    similarProjects: [
      {
        id: 'SP-201',
        name: 'NH-48 Widening Project',
        client: 'NHAI',
        sector: 'Transport',
        location: 'Bengaluru–Mysuru Corridor',
        status: 'Completed',
        completionDate: 'Jun 2024',
        similarity: 87
      },
      {
        id: 'SP-202',
        name: 'Tumkur Ring Road Development',
        client: 'Karnataka PWD',
        sector: 'Transport',
        location: 'Tumkur, Karnataka',
        status: 'Completed',
        completionDate: 'Feb 2025',
        similarity: 79
      }
    ],
    documents: ['Highway_RFP_v2.pdf'],
    auditTrail: [
      { id: 'AT-01', action: 'Tender Collected', actor: 'System', role: 'System', date: '03 Sep 2026', time: '09:00 AM', type: 'collect' },
      { id: 'AT-02', action: 'AI Score Calculated', actor: 'AI Engine', role: 'AI', date: '03 Sep 2026', time: '09:06 AM', type: 'ai' }
    ]
  },
  {
    id: 'OPP-003',
    name: 'Water Supply Improvement Project',
    organization: 'Asian Development Bank (ADB)',
    source: 'JICA',
    sector: 'Water',
    location: 'India',
    value: '₹4.30 Crore',
    deadline: '25 Sep 2026',
    status: 'New',
    aiScore: 8.0,
    matchLevel: 'High Match',
    priority: 'HIGH',
    type: 'Sanitation & Water',
    procurementType: 'International Competitive Bidding',
    description: 'Comprehensive water supply infrastructure improvement including treatment plants, pipeline networks, and distribution systems for urban and peri-urban areas.',
    scoreFactors: ['Sector Match', 'Location Match', 'Agency Experience', 'Company Capacity'],
    scoreBreakdown: [
      { label: 'Sector Match',       score: 9, max: 10 },
      { label: 'Location Match',     score: 8, max: 10 },
      { label: 'Agency Experience',  score: 7, max: 10 },
      { label: 'Company Capacity',   score: 8, max: 10 }
    ],
    aiAnalysis: {
      summary: 'This opportunity received a high score because it strongly matches the company\'s water-sector experience and the company has previous experience working with ADB-funded water projects across India.',
      strengths: [
        'Strong sector match with core water expertise',
        'Relevant company experience with ADB water projects',
        'Suitable project location within operational geography',
        'Well-calibrated company capacity for project scale'
      ],
      risks: [
        'Highly competitive international procurement process',
        'Tight submission deadline – 22 days from today'
      ],
      recommendation: 'Highly Recommended – Pursue'
    },
    similarProjects: [
      {
        id: 'SP-301',
        name: 'Chennai Water Supply Project',
        client: 'Chennai Metropolitan Water Supply',
        sector: 'Water',
        location: 'Chennai, India',
        status: 'Completed',
        completionDate: 'Dec 2024',
        similarity: 87
      },
      {
        id: 'SP-302',
        name: 'Pune Urban Water Distribution',
        client: 'Pune Municipal Corporation',
        sector: 'Water',
        location: 'Pune, India',
        status: 'Completed',
        completionDate: 'Sep 2023',
        similarity: 81
      },
      {
        id: 'SP-303',
        name: 'Ahmedabad Water Treatment Plant',
        client: 'AMC – JICA Funded',
        sector: 'Water',
        location: 'Ahmedabad, India',
        status: 'Completed',
        completionDate: 'Mar 2022',
        similarity: 74
      }
    ],
    documents: ['Water_Project_Brief.pdf'],
    auditTrail: [
      { id: 'AT-01', action: 'Tender Collected', actor: 'System', role: 'System', date: '03 Sep 2026', time: '10:00 AM', type: 'collect' },
      { id: 'AT-02', action: 'AI Score Calculated', actor: 'AI Engine', role: 'AI', date: '03 Sep 2026', time: '10:05 AM', type: 'ai' },
      { id: 'AT-03', action: 'Manager Reviewed', actor: 'Admin', role: 'Admin', date: '03 Sep 2026', time: '11:00 AM', type: 'review' }
    ]
  },
  {
    id: 'OPP-004',
    name: 'Metro Rail Project',
    organization: 'Asian Infrastructure Investment Bank (AIIB)',
    source: 'AIIB',
    sector: 'Transport',
    location: 'Delhi',
    value: '₹12.50 Crore',
    deadline: '30 Sep 2028',
    status: 'New',
    aiScore: 8.1,
    matchLevel: 'High Match',
    priority: 'MEDIUM',
    type: 'Transit',
    procurementType: 'National Competitive Bidding',
    description: 'Elevated metro rail station construction and track laying for Phase IV network extension.',
    scoreFactors: ['Sector Match', 'Project Value Match'],
    scoreBreakdown: [
      { label: 'Sector Match',       score: 8, max: 10 },
      { label: 'Location Match',     score: 7, max: 10 },
      { label: 'Agency Experience',  score: 8, max: 10 },
      { label: 'Company Capacity',   score: 9, max: 10 }
    ],
    aiAnalysis: {
      summary: 'The metro rail project is a strong match for the company\'s large-scale transit construction capability. AIIB provides a stable funding environment with moderate competition.',
      strengths: [
        'Large project value well within company capacity',
        'AIIB funding ensures payment reliability',
        'Previous metro-adjacent project experience'
      ],
      risks: [
        'Limited direct metro rail experience in portfolio',
        'Delhi operations require establishing temporary site office'
      ],
      recommendation: 'Recommended – Evaluate and Pursue'
    },
    similarProjects: [
      {
        id: 'SP-401',
        name: 'Hyderabad Metro Viaduct Package',
        client: 'HMRL',
        sector: 'Transport',
        location: 'Hyderabad, Telangana',
        status: 'Completed',
        completionDate: 'Nov 2023',
        similarity: 72
      },
      {
        id: 'SP-402',
        name: 'Chennai MRTS Elevated Corridor',
        client: 'Southern Railway',
        sector: 'Transport',
        location: 'Chennai, Tamil Nadu',
        status: 'Completed',
        completionDate: 'Jan 2024',
        similarity: 65
      }
    ],
    documents: ['Metro_Phase4_Details.pdf'],
    auditTrail: [
      { id: 'AT-01', action: 'Tender Collected', actor: 'System', role: 'System', date: '03 Sep 2026', time: '08:30 AM', type: 'collect' },
      { id: 'AT-02', action: 'AI Score Calculated', actor: 'AI Engine', role: 'AI', date: '03 Sep 2026', time: '08:35 AM', type: 'ai' }
    ]
  },
  {
    id: 'OPP-005',
    name: 'Industrial Park Development',
    organization: 'World Bank – Infrastructure Finance',
    source: 'World Bank',
    sector: 'Infrastructure',
    location: 'Gujarat',
    value: '₹6.10 Crore',
    deadline: '05 Oct 2028',
    status: 'New',
    aiScore: 7.2,
    matchLevel: 'Moderate Match',
    priority: 'MEDIUM',
    type: 'Commercial',
    procurementType: 'Limited International Bidding',
    description: 'Establishment of eco-industrial park with smart utility grids and green building standards.',
    scoreFactors: ['Sector Match', 'Capability Match'],
    scoreBreakdown: [
      { label: 'Sector Match',       score: 7, max: 10 },
      { label: 'Location Match',     score: 6, max: 10 },
      { label: 'Agency Experience',  score: 8, max: 10 },
      { label: 'Company Capacity',   score: 8, max: 10 }
    ],
    aiAnalysis: {
      summary: 'A moderate opportunity. The company has the capacity and agency familiarity, but green building and eco-industrial experience is limited compared to shortlisted competitors.',
      strengths: [
        'World Bank relationship and prior project compliance',
        'Company capacity is well-suited for project size',
        'Industrial sector adjacent to core competencies'
      ],
      risks: [
        'Limited eco-industrial park specific experience',
        'Gujarat location outside primary operational zones',
        'Green building standards require specialist subcontracting'
      ],
      recommendation: 'Mark for Review – Assess Before Committing'
    },
    similarProjects: [
      {
        id: 'SP-501',
        name: 'Surat Industrial Estate Phase 2',
        client: 'GIDC',
        sector: 'Infrastructure',
        location: 'Surat, Gujarat',
        status: 'Completed',
        completionDate: 'Jul 2023',
        similarity: 68
      }
    ],
    documents: ['Industrial_Park_Specs.pdf'],
    auditTrail: [
      { id: 'AT-01', action: 'Tender Collected', actor: 'System', role: 'System', date: '02 Sep 2026', time: '03:00 PM', type: 'collect' },
      { id: 'AT-02', action: 'AI Score Calculated', actor: 'AI Engine', role: 'AI', date: '02 Sep 2026', time: '03:05 PM', type: 'ai' }
    ]
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
