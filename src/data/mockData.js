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

export const mockOpportunityRequirements = {
  id: 'OPP-002',
  opportunityName: 'Highway Development Project',
  tenderCode: 'ADB-IND-HWY-2028-09',
  location: 'Karnataka',
  budget: '₹8.70 Crore',
  fundingAgency: 'Asian Development Bank (ADB)',
  submissionDeadline: '20 Sep 2028',
  targetCompany: 'Mukesh & Associates',
  requiredCapabilities: [
    {
      name: 'Highway Engineering',
      category: 'Core Technical',
      description: '4-lane expressway geometry, bituminous pavement design, and IRC compliance.'
    },
    {
      name: 'Environmental Consultancy',
      category: 'Regulatory & Compliance',
      description: 'Comprehensive EIA report, forest clearances, and ADB environmental safeguard compliance.'
    },
    {
      name: 'Local Geographic Experience',
      category: 'Regional Execution',
      description: 'Documented project execution in Karnataka state highways with local utility liaisoning.'
    },
    {
      name: 'Geotechnical Soil & Pavement Testing',
      category: 'Specialized Testing',
      description: 'NABL accredited CBR soil boring, plate load testing, and pavement deflection studies.'
    },
    {
      name: 'Intelligent Toll & Traffic Management',
      category: 'Smart Systems',
      description: 'RFID FASTag automated lanes, high-speed Weigh-In-Motion (WIM), and SCADA monitoring.'
    }
  ],
  missingCapabilities: [
    {
      name: 'Environmental Consultancy',
      reason: 'Mandatory ADB Category-B Environmental Clearance and Eco-sensitive Zone permissions required.',
      impact: 'High'
    },
    {
      name: 'Local Geographic Experience',
      reason: 'Bidding criteria specifies min. 2 completed state highway assignments in Karnataka within the last 5 years.',
      impact: 'High'
    }
  ],
  internalCapabilities: [
    'Highway Engineering & Structural Design',
    'Project Management & Contract Supervision',
    'Civil Structural Quality Assurance'
  ]
};

export const mockConsortium = [
  {
    id: 'CON-01',
    name: 'ABC Engineering Pvt Ltd',
    match: '92%',
    overallMatch: 92,
    technicalMatch: '94%',
    technicalScore: 94,
    experienceMatch: '90%',
    experienceScore: 90,
    geographicMatch: '92%',
    geographicScore: 92,
    expertise: 'Transport Infrastructure',
    experience: '15+ Years',
    yearsInBusiness: 16,
    location: 'Karnataka',
    headquarters: 'Bangalore, Karnataka',
    whyRecommended: 'Strong experience in transportation infrastructure and relevant local expertise across Karnataka state highways.',
    capabilitiesCovered: ['Environmental Consultancy', 'Local Geographic Experience'],
    allCapabilities: ['Transport Infrastructure', 'Environmental Consultancy', 'Local Geographic Experience', 'Highway Engineering'],
    status: 'accepted',
    teamSize: '450+ Engineers',
    contactEmail: 'partnerships@abcengineering.in',
    contactPhone: '+91 80 4123 7890',
    representative: 'Dr. Suresh Nair, VP Infrastructure',
    pastProjects: [
      { title: 'SH-17 Expressway Expansion (84 km)', client: 'KRDCL / ADB', value: '₹145 Crore', year: '2023' },
      { title: 'Bangalore-Mysore Corridor EIA & DPR', client: 'NHAI', value: '₹28 Crore', year: '2022' }
    ],
    certifications: ['ISO 9001:2015', 'NABL Accredited Lab', 'ADB Tier-1 Registered Consultant']
  },
  {
    id: 'CON-02',
    name: 'GreenTerra Environmental Consultants',
    match: '89%',
    overallMatch: 89,
    technicalMatch: '96%',
    technicalScore: 96,
    experienceMatch: '84%',
    experienceScore: 84,
    geographicMatch: '88%',
    geographicScore: 88,
    expertise: 'Environmental Consultancy',
    experience: '12+ Years',
    yearsInBusiness: 13,
    location: 'Karnataka',
    headquarters: 'Mysore, Karnataka',
    whyRecommended: 'Specialized environmental impact assessment authority with expedited Ministry of Environment and ADB safeguard clearance track record.',
    capabilitiesCovered: ['Environmental Consultancy', 'Local Geographic Experience'],
    allCapabilities: ['Environmental Consultancy', 'EIA Clearance', 'Forest Dept Approvals', 'Ecological Survey'],
    status: 'invited',
    teamSize: '180+ Specialists',
    contactEmail: 'bids@greenterra.org',
    contactPhone: '+91 82 1290 5543',
    representative: 'Ananya Deshmukh, Lead Environmental Director',
    pastProjects: [
      { title: 'Western Ghats Eco-Corridor Assessment', client: 'Karnataka Forest Dept', value: '₹18 Crore', year: '2024' },
      { title: 'ADB Coastal Highway Social & Env Audit', client: 'ADB', value: '₹22 Crore', year: '2023' }
    ],
    certifications: ['QCI-NABET Accredited EIA Consultant', 'ISO 14001:2015']
  },
  {
    id: 'CON-03',
    name: 'XYZ Infrastructure Ltd',
    match: '84%',
    overallMatch: 84,
    technicalMatch: '86%',
    technicalScore: 86,
    experienceMatch: '92%',
    experienceScore: 92,
    geographicMatch: '75%',
    geographicScore: 75,
    expertise: 'Road Construction',
    experience: '18+ Years',
    yearsInBusiness: 19,
    location: 'Maharashtra',
    headquarters: 'Mumbai, Maharashtra',
    whyRecommended: 'Heavy equipment fleet owner and tier-1 road contractor with extensive multi-lane bituminous paving expertise.',
    capabilitiesCovered: ['Road Construction', 'Highway Engineering'],
    allCapabilities: ['Road Construction', 'Bridge Engineering', 'Pavement Milling', 'Highway EPC'],
    status: 'contacted',
    teamSize: '1,200+ Personnel',
    contactEmail: 'tenders@xyzinfraltd.com',
    contactPhone: '+91 22 6789 1234',
    representative: 'Vikramaditya Shinde, Chief Technical Officer',
    pastProjects: [
      { title: 'Mumbai-Pune Expressway Resurfacing', client: 'MSRDC', value: '₹210 Crore', year: '2022' },
      { title: 'NH-48 6-Laning Project Phase II', client: 'NHAI', value: '₹340 Crore', year: '2021' }
    ],
    certifications: ['Class-1A Super Contractor', 'ISO 45001:2018 Safety']
  },
  {
    id: 'CON-04',
    name: 'Deccan Geo & Civil Technologies',
    match: '81%',
    overallMatch: 81,
    technicalMatch: '88%',
    technicalScore: 88,
    experienceMatch: '78%',
    experienceScore: 78,
    geographicMatch: '95%',
    geographicScore: 95,
    expertise: 'Geotechnical & Surveying',
    experience: '10+ Years',
    yearsInBusiness: 11,
    location: 'Karnataka',
    headquarters: 'Hubli, Karnataka',
    whyRecommended: 'Dominant local presence in Karnataka terrain with deep geotechnical soil laboratory setups and LIDAR topographic survey fleets.',
    capabilitiesCovered: ['Local Geographic Experience', 'Geotechnical Soil Testing'],
    allCapabilities: ['Geotechnical Investigation', 'LIDAR Survey', 'Pavement Design', 'Slope Stability'],
    status: 'invited',
    teamSize: '220+ Engineers',
    contactEmail: 'projects@deccangeo.in',
    contactPhone: '+91 83 6234 9811',
    representative: 'Er. Mallikarjun Gowda, Managing Partner',
    pastProjects: [
      { title: 'North Karnataka Ring Road Geotech Survey', client: 'PWD Karnataka', value: '₹14 Crore', year: '2023' },
      { title: 'Hubli-Dharwad Bypass Soil Stabilization', client: 'NHAI', value: '₹31 Crore', year: '2022' }
    ],
    certifications: ['ISO 9001:2015', 'NABL Geotech Accredited']
  },
  {
    id: 'CON-05',
    name: 'Apex Mobility & ITS Solutions',
    match: '78%',
    overallMatch: 78,
    technicalMatch: '91%',
    technicalScore: 91,
    experienceMatch: '72%',
    experienceScore: 72,
    geographicMatch: '70%',
    geographicScore: 70,
    expertise: 'Intelligent Toll Systems',
    experience: '7+ Years',
    yearsInBusiness: 8,
    location: 'Tamil Nadu',
    headquarters: 'Chennai, Tamil Nadu',
    whyRecommended: 'Pioneers in RFID automated toll plazas, AI incident detection cameras, and dynamic weight-in-motion integrations.',
    capabilitiesCovered: ['Intelligent Toll Systems'],
    allCapabilities: ['Intelligent Toll Systems', 'Traffic Monitoring AI', 'FASTag Integration', 'SCADA Network'],
    status: 'contacted',
    teamSize: '150+ Software & Hardware Engineers',
    contactEmail: 'partners@apexmobility.com',
    contactPhone: '+91 44 2876 5432',
    representative: 'Karthik Senthil, Product Head',
    pastProjects: [
      { title: 'Chennai Outer Ring Road Automated Tolls', client: 'TNRDC', value: '₹42 Crore', year: '2023' },
      { title: 'Salem-Namakkal Highway FASTag Plaza', client: 'NHAI', value: '₹19 Crore', year: '2024' }
    ],
    certifications: ['CMMI Level 3', 'ISO 27001']
  },
  {
    id: 'CON-06',
    name: 'LMN Builders & Structures',
    match: '75%',
    overallMatch: 75,
    technicalMatch: '76%',
    technicalScore: 76,
    experienceMatch: '82%',
    experienceScore: 82,
    geographicMatch: '68%',
    geographicScore: 68,
    expertise: 'Civil Construction',
    experience: '8+ Years',
    yearsInBusiness: 9,
    location: 'Gujarat',
    headquarters: 'Ahmedabad, Gujarat',
    whyRecommended: 'Proven precast culvert and flyover bridge fabrication capability for rapid highway grade-separators and drainage structures.',
    capabilitiesCovered: ['Civil Construction', 'Bridge Engineering'],
    allCapabilities: ['Civil Construction', 'Precast Bridge Spans', 'Flyover Fabrication', 'Drainage Structures'],
    status: 'none',
    teamSize: '380+ Workforce',
    contactEmail: 'contact@lmnbuilders.com',
    contactPhone: '+91 79 2654 3210',
    representative: 'Pravin Patel, Director of Operations',
    pastProjects: [
      { title: 'Gujarat State Highway 12 Flyovers', client: 'GSRDC', value: '₹68 Crore', year: '2022' },
      { title: 'Sabarmati Riverfront Access Roads', client: 'AMC', value: '₹35 Crore', year: '2021' }
    ],
    certifications: ['ISO 9001:2015', 'OIDC Certified']
  },
  {
    id: 'CON-07',
    name: 'Horizon Bridge & Structural Works',
    match: '73%',
    overallMatch: 73,
    technicalMatch: '79%',
    technicalScore: 79,
    experienceMatch: '74%',
    experienceScore: 74,
    geographicMatch: '66%',
    geographicScore: 66,
    expertise: 'Bridge Engineering',
    experience: '14+ Years',
    yearsInBusiness: 15,
    location: 'Telangana',
    headquarters: 'Hyderabad, Telangana',
    whyRecommended: 'Specialised in long-span prestressed concrete bridges and cable-stayed structures on busy national highway corridors.',
    capabilitiesCovered: ['Bridge Engineering', 'Highway Engineering'],
    allCapabilities: ['Bridge Engineering', 'Prestressed Concrete', 'Cable-Stayed Structures', 'Highway Overpasses'],
    status: 'none',
    teamSize: '310+ Structural Engineers',
    contactEmail: 'tenders@horizonbridge.in',
    contactPhone: '+91 40 6723 8800',
    representative: 'Ramesh Rao, Chief Structural Engineer',
    pastProjects: [
      { title: 'ORR Hyderabad Package 4 Flyover', client: 'HMDA', value: '₹95 Crore', year: '2023' },
      { title: 'Krishna River Bypass Bridge', client: 'NH Authority', value: '₹130 Crore', year: '2021' },
      { title: 'Nalgonda Toll Bridge Rehabilitation', client: 'PWD Telangana', value: '₹44 Crore', year: '2020' }
    ],
    certifications: ['ISO 9001:2015', 'IRC SP-79 Certified', 'ASCE International Member']
  },
  {
    id: 'CON-08',
    name: 'Saraswati Urban Planners & Associates',
    match: '70%',
    overallMatch: 70,
    technicalMatch: '72%',
    technicalScore: 72,
    experienceMatch: '76%',
    experienceScore: 76,
    geographicMatch: '62%',
    geographicScore: 62,
    expertise: 'Urban Planning & DPR',
    experience: '11+ Years',
    yearsInBusiness: 12,
    location: 'Rajasthan',
    headquarters: 'Jaipur, Rajasthan',
    whyRecommended: 'Expert urban traffic demand modelling, detailed project reports, and land acquisition feasibility studies for multilane highways.',
    capabilitiesCovered: ['Urban Planning', 'Traffic Demand Study'],
    allCapabilities: ['Urban Planning', 'Traffic Demand Study', 'Land Acquisition', 'DPR Preparation', 'Utility Shifting'],
    status: 'none',
    teamSize: '95+ Planners & Analysts',
    contactEmail: 'info@saraswatiurban.co.in',
    contactPhone: '+91 14 1289 4400',
    representative: 'Divya Sharma, Principal Urban Planner',
    pastProjects: [
      { title: 'Jaipur Ring Road DPR & LA Study', client: 'NHAI', value: '₹12 Crore', year: '2023' },
      { title: 'Ajmer Pushkar Highway Utility Shifting', client: 'PWD Rajasthan', value: '₹8 Crore', year: '2022' }
    ],
    certifications: ['ISO 9001:2015', 'ITP Certified Planners', 'MoRTH Empanelled Consultant']
  },
  {
    id: 'CON-09',
    name: 'PowerGrid Civil & Utilities Consortium',
    match: '67%',
    overallMatch: 67,
    technicalMatch: '71%',
    technicalScore: 71,
    experienceMatch: '68%',
    experienceScore: 68,
    geographicMatch: '60%',
    geographicScore: 60,
    expertise: 'Utility & Power Infrastructure',
    experience: '9+ Years',
    yearsInBusiness: 10,
    location: 'Madhya Pradesh',
    headquarters: 'Bhopal, Madhya Pradesh',
    whyRecommended: 'Extensive experience in highway utility diversion — power lines, OFC cables, gas pipelines, and water mains — across multiple state projects.',
    capabilitiesCovered: ['Utility Diversion', 'Civil Infrastructure'],
    allCapabilities: ['Utility Diversion', 'Power Line Shifting', 'OFC Cable Laying', 'Water Main Relocation', 'Gas Pipeline'],
    status: 'none',
    teamSize: '260+ Engineers & Technicians',
    contactEmail: 'bids@powergridcivil.in',
    contactPhone: '+91 75 5322 6670',
    representative: 'Anand Tiwari, Project Director',
    pastProjects: [
      { title: 'MP State Highway 26 Power Line Diversion', client: 'MP PWD', value: '₹22 Crore', year: '2023' },
      { title: 'Bhopal-Indore Expressway Utility Relocation', client: 'NHAI', value: '₹38 Crore', year: '2022' }
    ],
    certifications: ['ISO 9001:2015', 'CEA Certified Electrical Contractor', 'CPWD Empanelled']
  },
  {
    id: 'CON-10',
    name: 'TechSurv Drones & Remote Sensing',
    match: '63%',
    overallMatch: 63,
    technicalMatch: '85%',
    technicalScore: 85,
    experienceMatch: '58%',
    experienceScore: 58,
    geographicMatch: '48%',
    geographicScore: 48,
    expertise: 'Drone Surveying & Remote Sensing',
    experience: '5+ Years',
    yearsInBusiness: 6,
    location: 'Karnataka',
    headquarters: 'Bengaluru, Karnataka',
    whyRecommended: 'High-precision LiDAR and photogrammetric drone surveys for corridor mapping, ROW demarcation, and progress monitoring at scale.',
    capabilitiesCovered: ['Geotechnical Soil Testing', 'Local Geographic Experience'],
    allCapabilities: ['Drone LiDAR Survey', 'Photogrammetry', 'ROW Mapping', 'Progress Monitoring', 'GIS Integration'],
    status: 'none',
    teamSize: '60+ Drone Operators & GIS Analysts',
    contactEmail: 'ops@techsurvdrones.com',
    contactPhone: '+91 98 4521 3366',
    representative: 'Nikhil Hegde, Founder & CTO',
    pastProjects: [
      { title: 'Bengaluru Peripheral Ring Road Corridor Mapping', client: 'BDA / BBMP', value: '₹6 Crore', year: '2024' },
      { title: 'Hassan-Mangaluru NH Drone ROW Survey', client: 'NHAI', value: '₹9 Crore', year: '2023' }
    ],
    certifications: ['DGCA RPAS Certified', 'ISO 9001:2015', 'SOC 2 Type II (Data Security)']
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
