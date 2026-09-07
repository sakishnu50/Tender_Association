import {
  mockOpportunities,
  mockAlerts,
  mockCalendarEvents,
  mockConsortium,
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
if (!localStorage.getItem('iot_opportunities')) setStorage('iot_opportunities', mockOpportunities);
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
  fetchConsortium: async () => mockConsortium,
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

  saveSettings: async (settings) => {
    setStorage('iot_settings', settings);
    return { success: true, data: settings };
  }
};
