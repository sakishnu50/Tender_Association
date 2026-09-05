export const mockOpportunities = [
  {
    id: 'OPP-001',
    name: 'Urban Infrastructure Development',
    title: 'Urban Infrastructure Development',
    organization: 'World Bank – South Asia Region',
    source: 'World Bank',
    sourceUrl: 'https://projects.worldbank.org/en/projects-operations/project-detail/P178234',
    country: 'India',
    sector: 'Infrastructure',
    location: 'Tamil Nadu, India',
    value: '₹2.50 Crore',
    deadline: '15 Sep 2028',
    status: 'New',
    aiScore: 9.2,
    overallScore: 9.2,
    matchLevel: 'Strong Match',
    priority: 'HIGH',
    type: 'Construction',
    procurementType: 'International Competitive Bidding',
    description: 'Development of urban infrastructure including roads, drainage, and public facilities across key urban zones.',
    scoreFactors: [
      'Sector Match',
      'Country/Market Match',
      'Past Experience',
      'Capability Match',
      'Strategic/Priority Fit'
    ],
    scoreBreakdown: [
      { label: 'Sector Match',           score: 9.5, max: 10 },
      { label: 'Country/Market Match',   score: 9.0, max: 10 },
      { label: 'Past Experience',        score: 9.2, max: 10 },
      { label: 'Capability Match',       score: 9.0, max: 10 },
      { label: 'Strategic/Priority Fit', score: 9.3, max: 10 }
    ],
    aiAnalysis: {
      summary: "This opportunity received a high score because it strongly matches the company's infrastructure experience, the project location is suitable, and the organization aligns with the company's previous project experience.",
      strengths: [
        'Strong infrastructure sector match',
        'Relevant company experience in municipal works',
        'Established operational presence in Tamil Nadu',
        'Strong multilateral agency compliance track record'
      ],
      risks: [
        'Competitive international bidding process',
        'Submission deadline requires timely consortium alignment',
        'Final eligibility requirements need formal verification'
      ],
      recommendation: 'Highly Recommended – Pursue'
    },
    similarProjects: [
      {
        id: 'SP-101',
        name: 'Urban Infrastructure Improvement Project',
        country: 'India',
        sector: 'Infrastructure',
        client: 'World Bank',
        similarity: 89,
        description: 'Comprehensive civic infrastructure expansion comprising road widening, stormwater drains, and urban renewal packages.',
        location: 'Tamil Nadu, India',
        status: 'Completed',
        completionDate: 'Mar 2025'
      },
      {
        id: 'SP-102',
        name: 'City Infrastructure Development Project',
        country: 'India',
        sector: 'Infrastructure',
        client: 'ADB',
        similarity: 84,
        description: 'Multi-utility road corridor development and public amenities upgrade for urban municipal corporations.',
        location: 'Karnataka, India',
        status: 'Completed',
        completionDate: 'Aug 2024'
      },
      {
        id: 'SP-103',
        name: 'Regional Infrastructure Development',
        country: 'India',
        sector: 'Infrastructure',
        client: 'JICA',
        similarity: 81,
        description: 'Integrated regional transport and drainage facility construction adhering to international environmental standards.',
        location: 'Maharashtra, India',
        status: 'Completed',
        completionDate: 'Dec 2023'
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
    title: 'Highway Development Project',
    organization: 'Asian Development Bank (ADB)',
    source: 'ADB',
    sourceUrl: 'https://www.adb.org/projects/54123-001/main',
    country: 'India',
    sector: 'Transport',
    location: 'Karnataka, India',
    value: '₹8.70 Crore',
    deadline: '20 Sep 2028',
    status: 'New',
    aiScore: 8.7,
    overallScore: 8.7,
    matchLevel: 'High Match',
    priority: 'HIGH',
    type: 'Highway & Roads',
    procurementType: 'International Competitive Bidding',
    description: 'Expansion and widening of 4-lane state highway corridors with modern toll management infrastructure.',
    scoreFactors: [
      'Sector Match',
      'Country/Market Match',
      'Past Experience',
      'Capability Match',
      'Strategic/Priority Fit'
    ],
    scoreBreakdown: [
      { label: 'Sector Match',           score: 9.0, max: 10 },
      { label: 'Country/Market Match',   score: 8.5, max: 10 },
      { label: 'Past Experience',        score: 8.8, max: 10 },
      { label: 'Capability Match',       score: 9.0, max: 10 },
      { label: 'Strategic/Priority Fit', score: 8.2, max: 10 }
    ],
    aiAnalysis: {
      summary: "This highway tender is an excellent fit for the company's demonstrated transport infrastructure expertise. ADB is a known client with whom prior project relationships exist.",
      strengths: [
        'Strong history in highway and road corridor construction',
        'Extensive ADB project experience across South Asia',
        'Karnataka regional office well-positioned for site supervision',
        'Heavy civil equipment availability matches requirements'
      ],
      risks: [
        'Competitive field with major national highway developers',
        'Right-of-way handover timeline requires close tracking'
      ],
      recommendation: 'Highly Recommended – Pursue'
    },
    similarProjects: [
      {
        id: 'SP-201',
        name: 'NH-48 Widening Project',
        country: 'India',
        sector: 'Transport',
        client: 'NHAI',
        similarity: 87,
        description: 'Four-laning of 62 km high-density corridor including grade separators, service roads, and smart tolling.',
        location: 'Bengaluru–Mysuru Corridor, India',
        status: 'Completed',
        completionDate: 'Jun 2024'
      },
      {
        id: 'SP-202',
        name: 'Tumkur Ring Road Development',
        country: 'India',
        sector: 'Transport',
        client: 'Karnataka PWD',
        similarity: 79,
        description: 'Greenfield bypass arterial road with box culverts, asphalt overlay, and solar street lighting.',
        location: 'Tumkur, Karnataka, India',
        status: 'Completed',
        completionDate: 'Feb 2025'
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
    title: 'Water Supply Improvement Project',
    organization: 'Japan International Cooperation Agency (JICA)',
    source: 'JICA',
    sourceUrl: 'https://www.jica.go.jp/english/our_work/projects/index.html',
    country: 'India',
    sector: 'Water',
    location: 'Maharashtra, India',
    value: '₹4.30 Crore',
    deadline: '25 Sep 2026',
    status: 'New',
    aiScore: 8.0,
    overallScore: 8.0,
    matchLevel: 'High Match',
    priority: 'HIGH',
    type: 'Sanitation & Water',
    procurementType: 'International Competitive Bidding',
    description: 'Comprehensive water supply infrastructure improvement including treatment plants, pipeline networks, and distribution systems for urban and peri-urban areas.',
    scoreFactors: [
      'Sector Match',
      'Country/Market Match',
      'Past Experience',
      'Capability Match',
      'Strategic/Priority Fit'
    ],
    scoreBreakdown: [
      { label: 'Sector Match',           score: 9.0, max: 10 },
      { label: 'Country/Market Match',   score: 8.0, max: 10 },
      { label: 'Past Experience',        score: 7.8, max: 10 },
      { label: 'Capability Match',       score: 8.2, max: 10 },
      { label: 'Strategic/Priority Fit', score: 7.0, max: 10 }
    ],
    aiAnalysis: {
      summary: "This opportunity received a high score because it strongly matches the company's water-sector experience and the company has previous experience working with ADB and JICA funded water projects across India.",
      strengths: [
        'Strong sector match with core water engineering expertise',
        'Proven past performance on water treatment facilities',
        'Established project operations within Maharashtra',
        'Well-calibrated company capacity for the specified volume'
      ],
      risks: [
        'Competitive international procurement standard',
        'Tight submission deadline requiring rapid documentation'
      ],
      recommendation: 'Highly Recommended – Pursue'
    },
    similarProjects: [
      {
        id: 'SP-301',
        name: 'Chennai Water Supply Project',
        country: 'India',
        sector: 'Water',
        client: 'Chennai Metropolitan Water Supply',
        similarity: 87,
        description: 'Construction of 100 MLD water treatment facility and underground distribution trunk mains.',
        location: 'Chennai, Tamil Nadu, India',
        status: 'Completed',
        completionDate: 'Dec 2024'
      },
      {
        id: 'SP-302',
        name: 'Pune Urban Water Distribution',
        country: 'India',
        sector: 'Water',
        client: 'Pune Municipal Corporation',
        similarity: 81,
        description: 'Pressure management pipeline network and smart metering implementation for sub-districts.',
        location: 'Pune, Maharashtra, India',
        status: 'Completed',
        completionDate: 'Sep 2023'
      },
      {
        id: 'SP-303',
        name: 'Ahmedabad Water Treatment Plant',
        country: 'India',
        sector: 'Water',
        client: 'AMC – JICA Funded',
        similarity: 74,
        description: 'Tertiary filtration and biological treatment systems for industrial zone potable supply.',
        location: 'Ahmedabad, Gujarat, India',
        status: 'Completed',
        completionDate: 'Mar 2022'
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
    title: 'Metro Rail Project',
    organization: 'Asian Infrastructure Investment Bank (AIIB)',
    source: 'AIIB',
    sourceUrl: 'https://www.aiib.org/en/projects/details/index.html',
    country: 'India',
    sector: 'Transport',
    location: 'Delhi, India',
    value: '₹12.50 Crore',
    deadline: '30 Sep 2028',
    status: 'New',
    aiScore: 8.1,
    overallScore: 8.1,
    matchLevel: 'High Match',
    priority: 'MEDIUM',
    type: 'Transit',
    procurementType: 'National Competitive Bidding',
    description: 'Elevated metro rail station construction and track laying for Phase IV network extension.',
    scoreFactors: [
      'Sector Match',
      'Country/Market Match',
      'Past Experience',
      'Capability Match',
      'Strategic/Priority Fit'
    ],
    scoreBreakdown: [
      { label: 'Sector Match',           score: 8.2, max: 10 },
      { label: 'Country/Market Match',   score: 8.5, max: 10 },
      { label: 'Past Experience',        score: 7.9, max: 10 },
      { label: 'Capability Match',       score: 8.5, max: 10 },
      { label: 'Strategic/Priority Fit', score: 7.5, max: 10 }
    ],
    aiAnalysis: {
      summary: "The metro rail project is a strong match for the company's large-scale transit construction capability. AIIB provides a stable funding environment with moderate competition.",
      strengths: [
        'Large project value well aligned with expansion targets',
        'AIIB institutional backing guarantees milestone payments',
        'Prior elevated viaduct civil works experience'
      ],
      risks: [
        'Limited direct metro rail signaling experience in portfolio',
        'Delhi dense traffic zone necessitates night work logistics'
      ],
      recommendation: 'Recommended – Evaluate and Pursue'
    },
    similarProjects: [
      {
        id: 'SP-401',
        name: 'Hyderabad Metro Viaduct Package',
        country: 'India',
        sector: 'Transport',
        client: 'HMRL',
        similarity: 72,
        description: 'Construction of 8.2 km elevated guideway and structural pier foundations for urban transit.',
        location: 'Hyderabad, Telangana, India',
        status: 'Completed',
        completionDate: 'Nov 2023'
      },
      {
        id: 'SP-402',
        name: 'Chennai MRTS Elevated Corridor',
        country: 'India',
        sector: 'Transport',
        client: 'Southern Railway',
        similarity: 65,
        description: 'Superstructure girder launching and station platform civil works.',
        location: 'Chennai, Tamil Nadu, India',
        status: 'Completed',
        completionDate: 'Jan 2024'
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
    title: 'Industrial Park Development',
    organization: 'World Bank – Infrastructure Finance',
    source: 'World Bank',
    sourceUrl: 'https://projects.worldbank.org/en/projects-operations/project-detail/P180456',
    country: 'India',
    sector: 'Infrastructure',
    location: 'Gujarat, India',
    value: '₹6.10 Crore',
    deadline: '05 Oct 2028',
    status: 'New',
    aiScore: 7.2,
    overallScore: 7.2,
    matchLevel: 'Moderate Match',
    priority: 'MEDIUM',
    type: 'Commercial',
    procurementType: 'Limited International Bidding',
    description: 'Establishment of eco-industrial park with smart utility grids and green building standards.',
    scoreFactors: [
      'Sector Match',
      'Country/Market Match',
      'Past Experience',
      'Capability Match',
      'Strategic/Priority Fit'
    ],
    scoreBreakdown: [
      { label: 'Sector Match',           score: 7.4, max: 10 },
      { label: 'Country/Market Match',   score: 7.5, max: 10 },
      { label: 'Past Experience',        score: 6.8, max: 10 },
      { label: 'Capability Match',       score: 7.5, max: 10 },
      { label: 'Strategic/Priority Fit', score: 6.8, max: 10 }
    ],
    aiAnalysis: {
      summary: "A moderate opportunity. The company has the general capacity and agency familiarity, but green building and eco-industrial park specialty is emerging compared to niche competitors.",
      strengths: [
        'World Bank relationship and established compliance frameworks',
        'Engineering team capacity matches scale of development',
        'Standard civil infrastructure components are familiar'
      ],
      risks: [
        'Limited specialized eco-park certification references',
        'Gujarat site requires establishing localized contractor partnerships'
      ],
      recommendation: 'Mark for Review – Assess Before Committing'
    },
    similarProjects: [
      {
        id: 'SP-501',
        name: 'Surat Industrial Estate Phase 2',
        country: 'India',
        sector: 'Infrastructure',
        client: 'GIDC',
        similarity: 68,
        description: 'Internal road network, power substations, drainage networks, and industrial warehouse sheds.',
        location: 'Surat, Gujarat, India',
        status: 'Completed',
        completionDate: 'Jul 2023'
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
