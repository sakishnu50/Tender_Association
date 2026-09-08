import {
  mockOpportunities,
  mockAlerts,
  mockCalendarEvents,
  mockConsortium,
  mockOpportunityRequirements,
  mockSources,
  mockOffices,
  mockUsers,
  mockAuditTrail
} from '../data/mockData';

// Frontend-Only Local Storage Persistence Engine
function getStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

// Initialize Frontend Storage Cache
// Bump DATA_VERSION whenever mockData changes to force a cache refresh
const DATA_VERSION = 'v2';
if (localStorage.getItem('iot_data_version') !== DATA_VERSION) {
  localStorage.removeItem('iot_opportunities');
  localStorage.removeItem('iot_consortium');
  localStorage.removeItem('iot_audit_trail');
  localStorage.setItem('iot_data_version', DATA_VERSION);
}
if (!localStorage.getItem('iot_opportunities')) setStorage('iot_opportunities', mockOpportunities);
if (!localStorage.getItem('iot_consortium')) setStorage('iot_consortium', mockConsortium);
if (!localStorage.getItem('iot_audit_trail')) setStorage('iot_audit_trail', mockAuditTrail);
if (!localStorage.getItem('iot_settings')) {
  setStorage('iot_settings', {
    highPriority: true,
    deadlineAlerts: true,
    dailyReports: true,
    weeklyReports: false,
    threshold: '8.0'
  });
}

// 100% Self-Contained Client-Side API Facade
export const apiFacade = {
  fetchOpportunities: async () => getStorage('iot_opportunities', mockOpportunities),
  fetchAlerts: async () => mockAlerts,
  fetchCalendar: async () => mockCalendarEvents,
  fetchConsortium: async () => getStorage('iot_consortium', mockConsortium),
  fetchOpportunityRequirements: async () => mockOpportunityRequirements,
  fetchSources: async () => mockSources,
  fetchOffices: async () => mockOffices,
  fetchUsers: async () => mockUsers,
  fetchAuditTrail: async () => (await import('../services/auditService')).getAuditLogs(),
  fetchSettings: async () => getStorage('iot_settings', {
    highPriority: true,
    deadlineAlerts: true,
    dailyReports: true,
    weeklyReports: false,
    threshold: '8.0'
  }),

  updateConsortiumStatus: async (id, status) => {
    const list = getStorage('iot_consortium', mockConsortium);
    const updated = list.map(item => item.id === id ? { ...item, status } : item);
    setStorage('iot_consortium', updated);

    const partner = list.find(item => item.id === id);
    const partnerName = partner ? partner.name : id;
    const logs = getStorage('iot_audit_trail', mockAuditTrail);
    
    let actionLabel = 'Updated Partner Status';
    if (status === 'recommended') actionLabel = 'Recommended Partner';
    else if (status === 'shortlisted') actionLabel = 'Shortlisted Partner';
    else if (status === 'contacted') actionLabel = 'Contacted Partner';

    const newLog = {
      user: 'Ravi Kumar',
      action: actionLabel,
      details: `${partnerName} (${status.toUpperCase()})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setStorage('iot_audit_trail', [newLog, ...logs]);

    return { success: true, data: updated, updatedId: id, status };
  },

  pursueOpportunity: async (id, details) => {
    const { logAuditEvent } = await import('../services/auditService');
    const opps = getStorage('iot_opportunities', mockOpportunities);
    const targetOpp = opps.find(o => o.id === id);
    
    // Update opportunity status
    const updatedOpps = opps.map(o => o.id === id ? { ...o, status: 'Pursued' } : o);
    setStorage('iot_opportunities', updatedOpps);

    // Log audit event
    logAuditEvent({
      user: 'Ravi Kumar',
      userName: 'Ravi Kumar',
      userRole: 'Manager',
      action: 'Decision Updated',
      opportunityId: id,
      recordId: id,
      recordName: targetOpp ? targetOpp.name : id,
      opportunityTitle: targetOpp ? targetOpp.name : id,
      office: 'Chennai Office',
      details: 'Management decision - PURSUE',
      previousValue: 'Pending',
      newValue: 'Pursue',
      priority: targetOpp?.priority || 'MEDIUM',
      source: 'Decision Module',
    });

    return { success: true, message: 'Opportunity marked as PURSUED!' };
  },

  declineOpportunity: async (id, details) => {
    const { logAuditEvent } = await import('../services/auditService');
    const opps = getStorage('iot_opportunities', mockOpportunities);
    const targetOpp = opps.find(o => o.id === id);
    
    // Update opportunity status
    const updatedOpps = opps.map(o => o.id === id ? { ...o, status: 'Declined' } : o);
    setStorage('iot_opportunities', updatedOpps);

    // Log audit event
    logAuditEvent({
      user: 'Ravi Kumar',
      userName: 'Ravi Kumar',
      userRole: 'Manager',
      action: 'Decision Updated',
      opportunityId: id,
      recordId: id,
      recordName: targetOpp ? targetOpp.name : id,
      opportunityTitle: targetOpp ? targetOpp.name : id,
      office: 'Chennai Office',
      details: 'Management decision - DECLINE',
      previousValue: 'Pending',
      newValue: 'Decline',
      priority: targetOpp?.priority || 'MEDIUM',
      source: 'Decision Module',
    });

    return { success: true, message: 'Opportunity DECLINED.' };
  },

  addOpportunity: async (opportunity) => {
    const opps = getStorage('iot_opportunities', mockOpportunities);
    const newId = `OPP-${String(opps.length + 1).padStart(3, '0')}`;
    const fullOpp = {
      id: newId,
      name: opportunity.name || 'New Opportunity',
      title: opportunity.name || 'New Opportunity',
      source: opportunity.source || 'World Bank',
      sector: opportunity.sector || 'Infrastructure',
      location: opportunity.location || 'Tamil Nadu, India',
      country: opportunity.country || 'India',
      priority: (opportunity.priority || 'HIGH').toUpperCase(),
      status: opportunity.status || 'New',
      office: opportunity.office || 'Chennai',
      deadline: opportunity.deadline || '15 Oct 2026',
      value: opportunity.value || '₹5.00 Crore',
      aiScore: parseFloat(opportunity.aiScore) || 8.5,
      overallScore: parseFloat(opportunity.aiScore) || 8.5,
      matchLevel: 'High Match',
      type: opportunity.type || 'Construction',
      procurementType: 'National Competitive Bidding',
      description: opportunity.description || `${opportunity.name || 'New Opportunity'} project initiative.`,
      scoreFactors: [
        'Sector Match',
        'Country/Market Match',
        'Past Experience',
        'Capability Match',
        'Strategic/Priority Fit'
      ],
      scoreBreakdown: [
        { label: 'Sector Match', score: 8.5, max: 10 },
        { label: 'Country/Market Match', score: 8.5, max: 10 },
        { label: 'Past Experience', score: 8.0, max: 10 },
        { label: 'Capability Match', score: 8.5, max: 10 },
        { label: 'Strategic/Priority Fit', score: 8.0, max: 10 }
      ],
      aiAnalysis: {
        summary: `AI evaluated ${opportunity.name || 'this opportunity'} as a viable opportunity.`,
        strengths: ['Relevant sector capabilities', 'Regional office availability'],
        risks: ['Standard competitive procurement'],
        recommendation: 'Recommended – Evaluate and Pursue'
      },
      similarProjects: [],
      documents: [],
      auditTrail: [
        {
          id: `AT-${Date.now()}`,
          action: 'Opportunity Created',
          actor: 'Ravi Kumar',
          role: 'Admin',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'create'
        }
      ]
    };
    const updated = [fullOpp, ...opps];
    setStorage('iot_opportunities', updated);

    const logs = getStorage('iot_audit_trail', mockAuditTrail);
    const newLog = {
      user: 'Ravi Kumar',
      action: 'Created Opportunity',
      details: fullOpp.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setStorage('iot_audit_trail', [newLog, ...logs]);

    return { success: true, data: fullOpp };
  },

  updateOpportunityPriority: async (id, priority) => {
    const opps = getStorage('iot_opportunities', mockOpportunities);
    const normalizedPriority = String(priority).toUpperCase();
    const updated = opps.map((opp) => {
      if (opp.id === id) {
        return {
          ...opp,
          priority: normalizedPriority
        };
      }
      return opp;
    });
    setStorage('iot_opportunities', updated);
    return { success: true, id, priority: normalizedPriority };
  },

  saveSettings: async (settings) => {
    setStorage('iot_settings', settings);
    return { success: true, data: settings };
  }
};

