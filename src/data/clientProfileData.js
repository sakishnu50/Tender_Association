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
      year: '2023',
      client: 'World Bank / TNRDC',
      status: 'Completed',
      value: '₹82 Crore'
    },
    {
      id: 'PP-002',
      name: 'Nairobi Peri-Urban Water Supply',
      sector: 'Water Infrastructure',
      country: 'Kenya',
      year: '2022',
      client: 'ADB / Nairobi City County',
      status: 'Completed',
      value: '$14.2M'
    },
    {
      id: 'PP-003',
      name: 'Kathmandu Valley Road Corridor Study',
      sector: 'Transportation',
      country: 'Nepal',
      year: '2024',
      client: 'World Bank',
      status: 'Ongoing',
      value: '$6.8M'
    },
    {
      id: 'PP-004',
      name: 'Dubai Smart Mobility Infrastructure DPR',
      sector: 'Urban Development',
      country: 'UAE',
      year: '2022',
      client: 'RTA Dubai',
      status: 'Completed',
      value: 'AED 12M'
    },
    {
      id: 'PP-005',
      name: 'Chennai Metropolitan Water Distribution Upgrade',
      sector: 'Water Infrastructure',
      country: 'India',
      year: '2021',
      client: 'ADB / CMWSSB',
      status: 'Completed',
      value: '₹45 Crore'
    }
  ]
};
