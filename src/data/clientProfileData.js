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
    },
    {
      id: 'PP-006',
      name: 'Bengaluru Smart Water & Sewerage SCADA Overhaul',
      sector: 'Water Infrastructure',
      country: 'India',
      location: 'Bengaluru Core Zones & Tech Corridors, Karnataka',
      year: '2023',
      duration: '2022 – 2023 (18 Months)',
      client: 'ADB / BWSSB',
      contractRef: 'BWSSB/ADB/SCADA-SMART/2022-09',
      status: 'Completed',
      value: '₹58 Crore',
      projectLead: 'S. N. Anantharaman (Chief Systems Architect)',
      teamSize: '36 Automation & Hydraulic Engineers',
      overview: 'End-to-end integration of automated PLC/SCADA controls, pressure management valves, and 24x7 DMA monitoring across the Bengaluru metropolitan water supply and sewage transmission network.',
      scope: 'Installation of 320 ultrasonic bulk flowmeters, cloud telemetry interface, automated surge anticipation valves, and real-time hydraulic transient analysis.',
      objectives: [
        'Automate distribution pumping across 18 major master balancing reservoirs in Bengaluru.',
        'Mitigate pipe burst frequency and reduce water transmission losses to below 18%.',
        'Implement an integrated operations command center dashboard for emergency dispatch.'
      ],
      keyActivities: [
        'Deployment of IoT telemetry RTUs at all major pumping stations and reservoirs.',
        'Hydraulic transient pressure modeling and automated PRV valve modulation.',
        'Commissioning of centralized monitoring operations center at BWSSB headquarters.'
      ],
      outcomes: [
        'Pumping energy consumption optimized with an 18.4% reduction in annual power bills.',
        'Mean time to detect and isolate distribution leaks reduced from 14 hours to 35 minutes.',
        'Reliable 24x7 water pressure supplied to over 500,000 urban consumers.'
      ],
      standards: 'ISO 27001 Cybersecurity, IEC 61131-3 PLC Standards, BIS 10500 Guidelines'
    },
    {
      id: 'PP-007',
      name: 'Kuala Lumpur Urban Transit Corridor DPR & Feasibility',
      sector: 'Transportation',
      country: 'Malaysia',
      location: 'Klang Valley & Greater Kuala Lumpur',
      year: '2022',
      duration: '2021 – 2022 (16 Months)',
      client: 'World Bank / Prasarana',
      contractRef: 'PRASARANA/WB/TRANSIT-DPR/2021-06',
      status: 'Completed',
      value: '$9.4M',
      projectLead: 'Azman bin Roslan (Senior Transit Specialist)',
      teamSize: '24 Urban Transit Planners & Geotechnical Consultants',
      overview: 'Detailed Project Report (DPR), ridership forecasting, alignment optimization, and multimodal interchange engineering for a 32 km automated light rail transit corridor expansion.',
      scope: 'Multi-modal transit modeling, subterranean geological boring analysis, station pedestrian accessibility studies, and Environmental & Social Impact Assessment (ESIA).',
      objectives: [
        'Provide high-capacity transit links connecting suburban growth clusters to downtown Kuala Lumpur.',
        'Achieve seamless multi-modal transfer with existing LRT and MRT lines.',
        'Deliver a bankable public-private partnership (PPP) concession structure.'
      ],
      keyActivities: [
        'Comprehensive 4-step transport demand modeling using EMME software.',
        'Geotechnical risk assessment along 14 km of underground limestone cavern terrain.',
        'Preparation of comprehensive contractor tender documents and EPC specifications.'
      ],
      outcomes: [
        'Feasibility report cleared with 100% stakeholder compliance and cabinet sanction.',
        'Optimized alignment reduced projected capital expenditure by $42 Million USD.',
        'Forecasted daily ridership of 240,000 passenger trips upon full corridor commissioning.'
      ],
      standards: 'World Bank ESF, FIDIC Yellow Book, Malaysia Urban Transport Guidelines'
    },
    {
      id: 'PP-008',
      name: 'Gujarat Coastal Flood Mitigation & Stormwater Drainage',
      sector: 'Urban Development',
      country: 'India',
      location: 'Surat & Gulf of Khambhat Coastal Belt, Gujarat',
      year: '2024',
      duration: '2023 – 2025 (Ongoing · 24 Months)',
      client: 'JICA / GIDB',
      contractRef: 'GIDB/JICA/COAST-DRAIN/2023-14',
      status: 'Ongoing',
      value: '₹74 Crore',
      projectLead: 'Dr. Rameshwar Patel (Coastal Engineering Lead)',
      teamSize: '40 Marine & Hydrological Engineers',
      overview: 'Engineering design and construction oversight of climate-resilient sea dykes, automated tidal sluice gates, and high-capacity stormwater outfalls to protect coastal urban clusters.',
      scope: '54 km of reinforced coastal dykes, 16 automated dual-action flap gates, tidal hydrodynamics modeling, and GIS-linked early warning flood sensor arrays.',
      objectives: [
        'Protect over 1.2 million urban residents from extreme monsoon storm surges and tidal inundation.',
        'Modernize urban macro-drainage channels discharging into the Arabian Sea.',
        'Integrate satellite radar telemetry for automated flood gate operations.'
      ],
      keyActivities: [
        '2D hydrodynamic storm surge simulation using MIKE 21 coastal modeling suite.',
        'Construction supervision of automated tidal barrage gates and seawall riprap.',
        'Installation of solar-powered real-time water level transmitters across 28 estuaries.'
      ],
      outcomes: [
        'Zero inundation recorded across pilot zones during peak 2024 monsoon high tides.',
        'Drainage outflow efficiency improved by 65% during concurrent rainfall and tidal crests.',
        'Project awarded National Climate Resilience Award 2024 by Ministry of Jal Shakti.'
      ],
      standards: 'JICA Environmental Guidelines, IRC:SP:42 Drainage Manual, Coastal Regulation Zone (CRZ-I)'
    },
    {
      id: 'PP-009',
      name: 'Mombasa Port Access Expressway Engineering Study',
      sector: 'Transportation',
      country: 'Kenya',
      location: 'Mombasa Coastal Corridor & Port Link',
      year: '2023',
      duration: '2022 – 2023 (14 Months)',
      client: 'AfDB / KeNHA',
      contractRef: 'KeNHA/AfDB/MBA-EXPWY/2022-04',
      status: 'Completed',
      value: '$18.5M',
      projectLead: 'Peter Ombati (Highway Infrastructure Director)',
      teamSize: '32 Bridge & Pavement Engineers',
      overview: 'Comprehensive highway geometric engineering, bridge structural design, and freight traffic optimization for a 26 km access expressway connecting Kilindini Port to the Northern Corridor.',
      scope: 'Detailed Project Report (DPR), design of 6 multi-lane viaduct bridges across mangrove channels, intelligent toll collection system design, and pavement life-cycle analysis.',
      objectives: [
        'Eliminate heavy truck queuing and congestion bottleneck at the port container terminal gate.',
        'Deliver heavy-duty pavement design capable of enduring 80 kN standard axle freight loads.',
        'Preserve environmentally sensitive coastal mangrove wetlands along the alignment.'
      ],
      keyActivities: [
        'Topographic surveying and ground LiDAR mapping across 26 km of coastal terrain.',
        'Structural modeling of prestressed concrete continuous girder bridges over marine channels.',
        'Formulation of a stringent Mangrove Wetland Protection and Reforestation plan.'
      ],
      outcomes: [
        'Freight clearance turnaround time at Mombasa Port improved from 4.8 hours to 45 minutes.',
        'Project DPR praised by AfDB as exemplary model for African transport corridors.',
        'Zero net loss of mangrove forest verified through post-project environmental audit.'
      ],
      standards: 'AfDB Environmental Safeguards, BS 5400 Bridge Design, Kenya Road Design Manual'
    },
    {
      id: 'PP-010',
      name: 'Abu Dhabi Sustainable Smart City District Infrastructure',
      sector: 'Urban Development',
      country: 'UAE',
      location: 'Masdar City & South Yas Infrastructure Zone, Abu Dhabi',
      year: '2021',
      duration: '2020 – 2021 (20 Months)',
      client: 'Masdar / DMT',
      contractRef: 'MASDAR/DMT/SMART-DIST/2020-11',
      status: 'Completed',
      value: 'AED 28M',
      projectLead: 'Khalid Al-Hosani (Urban Systems Director)',
      teamSize: '30 Smart City & District Cooling Specialists',
      overview: 'Complete master planning and infrastructure engineering for a zero-carbon urban expansion district, including district cooling networks, vacuum waste collection, and recycled graywater irrigation.',
      scope: '35 km vacuum waste collection tubing, 18 km pre-insulated district cooling piping, tertiary wastewater treatment polishing plant, and AI-enabled smart microgrid distribution.',
      objectives: [
        'Design net-zero carbon municipal infrastructure conforming to Estidama 4-Pearl rating.',
        'Reduce potable municipal water demand for landscaping by 100% using treated effluent.',
        'Incorporate subterranean pneumatic waste transport eliminating trash trucks.'
      ],
      keyActivities: [
        'Thermal energy modeling for optimal district cooling chiller plant operation.',
        'Engineering design of automated pneumatic waste inlets inside residential towers.',
        'Integration of SCADA smart water reuse sensors adhering to Abu Dhabi DMT standards.'
      ],
      outcomes: [
        'District achieved Estidama 4-Pearl sustainability accreditation.',
        '40% reduction in annual cooling energy consumption compared to conventional baseline.',
        'Landfill diversion rate exceeded 82% across residential and commercial sectors.'
      ],
      standards: 'Estidama Pearl Building Rating System, ASHRAE 90.1, Abu Dhabi Urban Planning Council (UPC)'
    },
    {
      id: 'PP-011',
      name: 'Hyderabad Outer Ring Road Intelligent Traffic Management',
      sector: 'Transportation',
      country: 'India',
      location: 'Hyderabad Metropolitan Region, Telangana',
      year: '2023',
      duration: '2022 – 2023 (18 Months)',
      client: 'JICA / HMDA',
      contractRef: 'HMDA/JICA/ORR-ITS/2022-07',
      status: 'Completed',
      value: '₹64 Crore',
      projectLead: 'V. Ramakrishna (ITS Senior Consultant)',
      teamSize: '34 Intelligent Transport & Traffic Engineers',
      overview: 'Deployment of high-speed automatic number plate recognition (ANPR), incident detection cameras, and dynamic speed modulation along 158 km of express ring road.',
      scope: '158 km optical fiber backbone, 96 dynamic message signs, automated toll plazas, and central incident response center.',
      objectives: [
        'Enhance expressway safety and reduce incident response time under 10 minutes.',
        'Automate vehicle classification and dynamic toll auditing.',
        'Streamline heavy commercial transit around Hyderabad.'
      ],
      keyActivities: [
        'LiDAR corridor survey and optical fiber ducting.',
        'Integration of high-definition PTZ surveillance cameras.',
        'Commissioning of unified incident command and control center.'
      ],
      outcomes: [
        'Emergency incident response time reduced from 28 to 8 minutes.',
        'Fatal collision rate reduced by 41% across expressway stretch.',
        'Annual toll revenue leakage reduced by 98.5%.'
      ],
      standards: 'IRC:SP:84, JICA Transport Safeguards, IEEE 802.3 Ethernet Standards'
    },
    {
      id: 'PP-012',
      name: 'Kisumu Lakefront Stormwater & Wetland Rehabilitation',
      sector: 'Water Infrastructure',
      country: 'Kenya',
      location: 'Kisumu Bay & Lake Victoria Basin',
      year: '2024',
      duration: '2023 – 2025 (Ongoing · 20 Months)',
      client: 'World Bank / LVBC',
      contractRef: 'LVBC/WB/KIS-WETLAND/2023-05',
      status: 'Ongoing',
      value: '$11.5M',
      projectLead: 'Grace Odhiambo (Hydrological Systems Lead)',
      teamSize: '26 Aquatic & Environmental Engineers',
      overview: 'Ecological restoration of natural urban wetland channels, constructed bio-filtration swales, and silt trap basins discharging into Lake Victoria.',
      scope: '32 km reconstructed urban swales, 4 bio-filtration sedimentation lagoons, riparian buffer zones, and water quality telemetry stations.',
      objectives: [
        'Prevent urban siltation and eutrophication into Lake Victoria.',
        'Alleviate seasonal stormwater flooding in Kisumu business district.',
        'Restore coastal aquatic biodiversity and wetland bird habitats.'
      ],
      keyActivities: [
        'Hydrologic watershed modeling with SWAT software.',
        'Bio-engineered vegetative revetments and sediment traps.',
        'Community water stewardship and plastic trap barrier installation.'
      ],
      outcomes: [
        'Sediment load into Lake Victoria reduced by 62% in pilot catchment.',
        'Commercial center flood inundation incidents decreased to zero.',
        'Over 45 hectares of wetland riparian habitat successfully rehabilitated.'
      ],
      standards: 'World Bank ESF, UNEP Wetland Conservation Guidelines, NEMA Kenya Standards'
    },
    {
      id: 'PP-013',
      name: 'Sharjah Sustainable Urban Heritage Mobility DPR',
      sector: 'Urban Development',
      country: 'UAE',
      location: 'Heart of Sharjah & Historic Waterfront',
      year: '2022',
      duration: '2021 – 2022 (15 Months)',
      client: 'Sharjah RTA / Shurooq',
      contractRef: 'SRTA/SHQ/HERIT-MOB/2021-08',
      status: 'Completed',
      value: 'AED 16M',
      projectLead: 'Farah Al-Qasimi (Urban Heritage Planner)',
      teamSize: '20 Heritage Architects & Micro-Mobility Specialists',
      overview: 'Comprehensive master plan and engineering DPR for pedestrianization, electric tram connectivity, and micro-mobility hubs in historic cultural quarters.',
      scope: '18 km pedestrian priority boulevards, vintage-electric tram alignment DPR, 24 EV micro-mobility charging docks, and permeable heritage paving.',
      objectives: [
        'Preserve historic architecture while providing zero-emission local transit.',
        'Encourage walking and tourism mobility through climate-shaded colonnades.',
        'Eliminate vehicular through-traffic across cultural preservation zones.'
      ],
      keyActivities: [
        'Pedestrian flow simulation and thermal comfort modeling.',
        'Structural vibration analysis of historic coral-stone buildings along tram routes.',
        'Design of solar-canopy shaded walkways and evaporative cooling misters.'
      ],
      outcomes: [
        'Tourist pedestrian footfall increased by 54% post-implementation.',
        'Localized ambient urban heat island temperature reduced by 3.2°C.',
        'Design awarded Sharjah Sustainable Architecture Prize 2023.'
      ],
      standards: 'UNESCO Historic Urban Landscape (HUL), ICOMOS Conservation Charters, UAE Green Building Regulations'
    },
    {
      id: 'PP-014',
      name: 'Pokhara Regional Water Treatment & Distribution Network',
      sector: 'Water Infrastructure',
      country: 'Nepal',
      location: 'Pokhara Valley & Kaski District',
      year: '2023',
      duration: '2021 – 2023 (28 Months)',
      client: 'ADB / NWSC',
      contractRef: 'NWSC/ADB/POKH-WTR/2021-12',
      status: 'Completed',
      value: '$8.6M',
      projectLead: 'B. K. Shrestha (Water Treatment Specialist)',
      teamSize: '30 Hydraulic & Geotechnical Engineers',
      overview: 'Design and commissioning of 35 MLD gravity-fed water treatment plant and 78 km mountain pipeline network supplying pristine Himalayan meltwater.',
      scope: '35 MLD rapid sand filtration plant, gravity conveyance steel pipelines, 6 mountain break pressure tanks (BPTs), and 16,000 smart household connections.',
      objectives: [
        'Provide 24x7 safe drinking water access to Pokhara tourism hub and local communities.',
        'Harness natural gravitational head to achieve zero-energy water distribution.',
        'Eliminate waterborne seasonal disease outbreaks in urban wards.'
      ],
      keyActivities: [
        'High-altitude pipeline route geotechnical stabilization.',
        'Rapid sand gravity filter and coagulation-flocculation plant design.',
        'Installation of solar-powered chlorine residual monitoring stations.'
      ],
      outcomes: [
        'Delivered clean potable water to over 240,000 residents and 400+ hotels.',
        '100% gravity operation eliminated over $350,000 in annual electricity costs.',
        'Waterborne disease incidence fell by 82% across Pokhara valley.'
      ],
      standards: 'ADB Safeguards, Nepal Drinking Water Quality Standards (NDWQS), WHO Water Guidelines'
    },
    {
      id: 'PP-015',
      name: 'Penang Coastal Expressway & Viaduct Design',
      sector: 'Transportation',
      country: 'Malaysia',
      location: 'George Town & Bayan Lepas, Penang',
      year: '2024',
      duration: '2023 – 2025 (Ongoing · 24 Months)',
      client: 'World Bank / JKR',
      contractRef: 'JKR/PNG/EXPWY-VIAD/2023-02',
      status: 'Ongoing',
      value: '$22.8M',
      projectLead: 'Tan Sri Dr. Lim Eng Guan (Chief Bridge Engineer)',
      teamSize: '38 Marine Structural & Transport Engineers',
      overview: 'Engineering design and geotechnical offshore piling oversight for a 14 km coastal elevated viaduct connecting industrial free-trade zones.',
      scope: 'Detailed design of 14 km 6-lane elevated expressway, 4 interchanges with seismic isolators, marine pile foundation engineering, and acoustic noise barriers.',
      objectives: [
        'Relieve chronic gridlock connecting Penang International Airport and industrial corridors.',
        'Engineer marine viaduct structures resilient to saline corrosion and tidal forces.',
        'Maintain maritime navigation channels beneath main span viaducts.'
      ],
      keyActivities: [
        'Marine geotechnical boreholes and pile load testing in marine clay.',
        'Wind tunnel aerodynamic testing of long-span viaduct box girders.',
        'Continuous marine turbidity and water quality sensor monitoring during piling.'
      ],
      outcomes: [
        'Phase-1 superstructure engineering design successfully cleared by JKR.',
        'Travel time along southern industrial corridor projected to drop by 45 minutes.',
        'Corrosion-resistant epoxy-coated rebar specifications adopted nationwide.'
      ],
      standards: 'BS EN 1992-2 (Eurocode 2 for Bridges), AASHTO LRFD, CIDB Malaysia'
    },
    {
      id: 'PP-016',
      name: 'Pune Municipal Green Hydrogen Bus Depot & Charging Infrastructure',
      sector: 'Infrastructure',
      country: 'India',
      location: 'Pune Metropolitan Area, Maharashtra',
      year: '2023',
      duration: '2022 – 2023 (16 Months)',
      client: 'World Bank / PMPML',
      contractRef: 'PMPML/WB/H2-DEPOT/2022-10',
      status: 'Completed',
      value: '₹52 Crore',
      projectLead: 'Anand Joshi (Clean Energy Transport Lead)',
      teamSize: '25 Hydrogen Systems & Electrical Engineers',
      overview: 'Engineering, procurement, and safety design for India’s pioneering green hydrogen municipal bus dispensing depot and 50-bus fleet service facility.',
      scope: '350-bar hydrogen dispenser systems, 2 MW on-site solar electrolysis unit, cryogenic storage buffer tanks, and comprehensive ATEX explosion safety zoning.',
      objectives: [
        'Establish zero-emission public transit infrastructure powered by renewable hydrogen.',
        'Demonstrate commercial viability of hydrogen fuel cell buses in urban transit.',
        'Set national benchmark safety protocols for municipal hydrogen storage and dispensing.'
      ],
      keyActivities: [
        'Hazard and Operability (HAZOP) study and CFD gas dispersion modeling.',
        'Electrical balance of plant design connecting 2 MW rooftop solar array.',
        'Training 120 technicians on high-pressure gas safety and cryogenic equipment.'
      ],
      outcomes: [
        'Depot successfully commissioned fueling 50 zero-emission fuel cell buses daily.',
        'Displaced 4,200 metric tons of CO2 emissions in first year of operation.',
        'Adopted by Ministry of New and Renewable Energy (MNRE) as national model standard.'
      ],
      standards: 'ISO 19880-1 Gaseous Hydrogen Fuelling Stations, NFPA 2 Hydrogen Technologies Code, PESO India'
    }
  ]
};
