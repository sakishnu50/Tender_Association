// Mock data for Mukesh & Associates client profile
// Structured for easy API connection in the future

export const mockClientProfile = {
  id: 'CLIENT-001',
  companyName: 'Mukesh & Associates',
  profileStatus: 'Active',
  profileCompleteness: 87,
  lastUpdated: '28 Aug 2026',
  registrationNumber: 'MCA-IND-2008-00412',
  yearEstablished: 2008,
  headOffice: 'Chennai, Tamil Nadu, India',
  totalEmployees: '250+',
  annualTurnover: '₹48 Crore',
  website: 'www.mukeshandassociates.in',
  contactEmail: 'admin@mukeshandassociates.in',
  contactPhone: '+91 44 2345 6789',

  sectors: [
    'Transportation',
    'Water Infrastructure',
    'Urban Development',
    'Infrastructure'
  ],

  geographicPresence: [
    { country: 'India', region: 'South & West India', active: true },
    { country: 'Kenya', region: 'East Africa', active: true },
    { country: 'Nepal', region: 'South Asia', active: true },
    { country: 'UAE', region: 'Middle East', active: true },
    { country: 'Malaysia', region: 'Southeast Asia', active: false }
  ],

  agencyExperience: [
    { agency: 'World Bank', projectCount: 6, since: '2013' },
    { agency: 'Asian Development Bank (ADB)', projectCount: 4, since: '2016' }
  ],

  technicalCapabilities: [
    'Highway Engineering',
    'Water Infrastructure',
    'Transportation Planning',
    'Project Management',
    'Infrastructure Consulting'
  ],

  pastProjects: [
    {
      id: 'PP-001',
      name: 'Tamil Nadu Urban Road Network Development',
      sector: 'Transportation',
      country: 'India',
      location: 'Chennai & Coimbatore Corridors, Tamil Nadu',
      year: '2023',
      duration: '2021 – 2023 (24 Months)',
      client: 'World Bank / TNRDC',
      contractRef: 'TNRDC/WB/URBAN-RD/2021-04',
      status: 'Completed',
      value: '₹82 Crore',
      projectLead: 'K. Senthil Nathan (Chief Highway Engineer)',
      teamSize: '42 Specialists & Field Engineers',
      overview: 'Comprehensive modernization and arterial expansion of 145 km of high-density urban and peri-urban road network connecting major industrial corridors in Chennai and Coimbatore with sustainable, climate-resilient pavements and intelligent traffic systems.',
      scope: 'Detailed Project Report (DPR) preparation, pavement engineering with modified binder asphalt, structural design of 12 grade-separated flyovers/underpasses, smart integrated traffic management systems (ITMS), synchronized pedestrian corridors, and climate-adaptive stormwater drainage.',
      objectives: [
        'Alleviate severe freight and commuter congestion across critical urban arterial links in Chennai and Coimbatore.',
        'Improve multimodal freight logistics efficiency between industrial manufacturing hubs and seaport connectivity routes.',
        'Upgrade road safety infrastructure adhering to the World Bank Environmental and Social Framework (ESF).'
      ],
      keyActivities: [
        'Topographical survey and LiDAR pavement condition assessment across 145 km of arterial roads.',
        'Structural design and construction supervision of 8 major multi-lane flyovers and 4 grade-separated underpasses.',
        'Environmental and social impact mitigation planning, including a comprehensive Resettlement Action Plan (RAP).',
        'Implementation of automated traffic monitoring sensors, variable message signs, and synchronized signals.'
      ],
      outcomes: [
        '38% reduction in peak-hour vehicle travel times across project corridors.',
        '45% decrease in traffic accident fatalities over a 12-month post-commissioning observation period.',
        'Zero monsoon waterlogging across 18 historically vulnerable road intersections.'
      ],
      standards: 'FIDIC Conditions of Contract, Indian Roads Congress (IRC:37 & IRC:112), World Bank ESF Standards'
    },
    {
      id: 'PP-002',
      name: 'Nairobi Peri-Urban Water Supply',
      sector: 'Water Infrastructure',
      country: 'Kenya',
      location: 'Nairobi Metropolitan Region & Satellite Hubs',
      year: '2022',
      duration: '2020 – 2022 (30 Months)',
      client: 'ADB / Nairobi City County',
      contractRef: 'NCWSC/ADB/WTR-PERI/2020-08',
      status: 'Completed',
      value: '$14.2M',
      projectLead: 'Dr. Evans Kiprono (Senior Water Resources Engineer)',
      teamSize: '35 Environmental & Hydraulic Engineers',
      overview: 'Turnkey engineering design, intake rehabilitation, distribution network augmentation, and bulk transmission metering to deliver safe piped drinking water to peri-urban settlements and rapidly growing satellite towns in Nairobi.',
      scope: '92 km HDPE distribution pipelines, 2 high-capacity booster pumping stations (15 MLD each), 4 elevated reservoir tanks (total 8,000 m³), 12,500 smart prepaid water meters, SCADA automation, and solar-hybrid power backups.',
      objectives: [
        'Provide resilient, potable piped water access to over 350,000 residents in unserved peri-urban districts.',
        'Reduce Non-Revenue Water (NRW) from 48% to below 22% through real-time SCADA pressure management.',
        'Establish a financially sustainable tariff recovery model using prepaid smart metering kiosks.'
      ],
      keyActivities: [
        'Hydraulic network modeling using EPANET and GIS integration for demand zoning and pressure optimization.',
        'Construction supervision of 2 raw water treatment intake expansions and elevated balancing reservoirs.',
        'Installation of District Metered Areas (DMA) with acoustic leak detection and automated pressure-reducing valves.',
        'Community engagement, hygiene sensitization, and training of local municipal maintenance teams.'
      ],
      outcomes: [
        'Direct clean drinking water access secured for 380,000+ peri-urban residents.',
        'Non-Revenue Water reduced by 26 percentage points in project DMAs within the first year.',
        'Household expenditure on informal private water tankers decreased by 60%.'
      ],
      standards: 'ADB Environmental Safeguards Policy, WHO Guidelines for Drinking-water Quality, ISO 9001:2015'
    },
    {
      id: 'PP-003',
      name: 'Kathmandu Valley Road Corridor Study',
      sector: 'Transportation',
      country: 'Nepal',
      location: 'Kathmandu Valley & Ring Road Strategic Corridors',
      year: '2024',
      duration: '2023 – 2025 (Ongoing · 24 Months)',
      client: 'World Bank',
      contractRef: 'DOR-NP/WB-KTM-CORR/2023-11',
      status: 'Ongoing',
      value: '$6.8M',
      projectLead: 'A. Ramanathan (Transport Planning Specialist)',
      teamSize: '28 Transport Economists & Structural Geologists',
      overview: 'Strategic feasibility study, multimodal transit integration, slope stabilization design, and detailed project reporting for 68 km of arterial transit corridors and ring road bypasses engineered for high seismic risk and mountainous terrain.',
      scope: 'Detailed geotechnical and geophysical investigations, seismic microzonation, feasibility study for Bus Rapid Transit (BRT), hillside slope stabilization engineering, smart traffic signaling master plan, and economic viability appraisal.',
      objectives: [
        'Formulate a 20-year sustainable urban mobility master plan for the rapidly expanding Kathmandu metropolitan basin.',
        'Design resilient hillside corridor infrastructure engineered against high seismic activity and monsoon landslides.',
        'Prepare bankable Detailed Project Reports (DPR) for prospective multilateral development financing.'
      ],
      keyActivities: [
        'Drone-assisted 3D photogrammetry and seismic refraction surveys along 68 km of challenging mountain corridor.',
        'Traffic flow simulations utilizing VISSIM modeling across 42 key intersections.',
        'Preparation of slope bio-engineering designs using soil nailing, gabions, and reinforced earth retaining walls.',
        'Multilateral stakeholder consultations with municipal wards, transit unions, and environmental authorities.'
      ],
      outcomes: [
        'Phase-1 Feasibility and Alignment Selection Report successfully approved by World Bank and Department of Roads.',
        'Final DPR for 3 priority BRT routes (28 km) prepared and currently entering international contractor bidding.',
        'Climate adaptation and seismic design manual adopted into Nepal National Road Design standards.'
      ],
      standards: 'World Bank Environmental and Social Framework (ESF), AASHTO Highway Design Standards, Nepal Road Standards (NRS)'
    },
    {
      id: 'PP-004',
      name: 'Dubai Smart Mobility Infrastructure DPR',
      sector: 'Urban Development',
      country: 'UAE',
      location: 'Dubai Urban Area & Autonomous Transit Corridors',
      year: '2022',
      duration: '2021 – 2022 (18 Months)',
      client: 'RTA Dubai',
      contractRef: 'RTA-DXB/SMART-MOB/2021-03',
      status: 'Completed',
      value: 'AED 12M',
      projectLead: 'Tariq Al-Mansoor (Smart Mobility & ITS Director)',
      teamSize: '22 IoT Systems & Intelligent Transport Specialists',
      overview: 'Detailed Project Report (DPR) and technological architecture design for Dubai’s Autonomous Mobility and Connected Vehicle Corridor initiative integrating V2X (Vehicle-to-Everything) communications across high-density urban transit nodes.',
      scope: 'Technical DPR, digital twin simulation of 85 km arterial roads, technical specifications for 120 V2X roadside units (RSUs), dedicated autonomous shuttle priority lanes, micro-mobility hub design, and end-to-end cybersecurity architecture.',
      objectives: [
        'Support Dubai’s strategic goal of transforming 25% of total transportation trips to autonomous modes by 2030.',
        'Architect an ultra-low latency connected vehicle communication framework for high-speed arterial roads.',
        'Provide comprehensive cost-benefit analysis and procurement tender documentation for citywide IoT deployment.'
      ],
      keyActivities: [
        'Development of a 3D Digital Twin simulation modeling autonomous vehicle interaction with mixed urban traffic.',
        'RF spectrum and cellular 5G C-V2X signal propagation analysis across dense urban high-rise districts.',
        'Preparation of technical RFPs, procurement bidding dossiers, and vendor evaluation criteria for RTA.',
        'Benchmarking global autonomous transport regulations and formulating local safety audit guidelines.'
      ],
      outcomes: [
        'Approved Blueprint implemented for Dubai’s initial 35 km Autonomous Shuttle pilot corridor.',
        'Tender successfully awarded to international technology providers based on project DPR specifications.',
        'Projected 22% reduction in urban carbon emissions upon full deployment of automated transit fleets.'
      ],
      standards: 'IEEE 802.11p / C-V2X Protocols, ISO 26262 Functional Safety, Dubai Smart City Standards'
    },
    {
      id: 'PP-005',
      name: 'Chennai Metropolitan Water Distribution Upgrade',
      sector: 'Water Infrastructure',
      country: 'India',
      location: 'Chennai Metropolitan Zones 5, 8, 9 & 10',
      year: '2021',
      duration: '2019 – 2021 (28 Months)',
      client: 'ADB / CMWSSB',
      contractRef: 'CMWSSB/ADB/DIST-UPG/2019-15',
      status: 'Completed',
      value: '₹45 Crore',
      projectLead: 'M. Rajendran (Chief Public Health Engineer)',
      teamSize: '38 Pipeline Engineers & GIS Analysts',
      overview: 'Comprehensive rehabilitation and 24x7 pressurized water distribution overhaul across 4 major municipal zones of Chennai, incorporating digital telemetry, pressure management, and trenchless pipeline relining.',
      scope: 'Replacement of 115 km of aging cast-iron pipelines with ductile iron (DI) pipes, installation of 48 electromagnetic flow meters, SCADA-automated pressure control stations, and 28,000 household water connections.',
      objectives: [
        'Transition intermittent municipal water supply to continuous pressurized equitable distribution across project zones.',
        'Eliminate groundwater contamination ingress in legacy coastal piping infrastructure.',
        'Build a real-time IoT monitoring network for central telemetry operations and crisis management.'
      ],
      keyActivities: [
        'Comprehensive ground-penetrating radar (GPR) utility mapping along dense urban street corridors.',
        'Trenchless Horizontal Directional Drilling (HDD) to minimize urban traffic disruption during pipe laying.',
        'Commissioning of a central SCADA dashboard for remote valve modulation and residual chlorine monitoring.',
        'Digital asset inventory migration with live GIS mapping and consumer billing linkage.'
      ],
      outcomes: [
        '24/7 continuous potable water supply successfully achieved for 210,000+ urban households.',
        'Water transmission and distribution losses decreased from 39% down to 14.5%.',
        'Real-time water quality compliance achieved 99.4% adherence to WHO drinking water standards.'
      ],
      standards: 'ADB Environmental & Social Safeguards, Bureau of Indian Standards (IS 10500:2012), CPHEEO Manual'
    }
  ]
};
