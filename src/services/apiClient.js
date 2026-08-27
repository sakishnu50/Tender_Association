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
  fetchAuditTrail: async () => getStorage('iot_audit_trail', mockAuditTrail),
  fetchSettings: async () => getStorage('iot_settings', {
    highPriority: true,
    deadlineAlerts: true,
    dailyReports: true,
    weeklyReports: false,
    threshold: '8.0'
  }),

  pursueOpportunity: async (id, details) => {
    const opps = getStorage('iot_opportunities', mockOpportunities);
    const updatedOpps = opps.map(o => o.id === id ? { ...o, status: 'Pursued' } : o);
    setStorage('iot_opportunities', updatedOpps);

    const targetOpp = opps.find(o => o.id === id);
    const logs = getStorage('iot_audit_trail', mockAuditTrail);
    const newLog = {
      user: 'Ravi Kumar',
      action: 'Pursued Opportunity',
      details: targetOpp ? targetOpp.name : id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setStorage('iot_audit_trail', [newLog, ...logs]);

    return { success: true, message: 'Opportunity marked as PURSUED!' };
  },

  declineOpportunity: async (id, details) => {
    const opps = getStorage('iot_opportunities', mockOpportunities);
    const updatedOpps = opps.map(o => o.id === id ? { ...o, status: 'Declined' } : o);
    setStorage('iot_opportunities', updatedOpps);

    const targetOpp = opps.find(o => o.id === id);
    const logs = getStorage('iot_audit_trail', mockAuditTrail);
    const newLog = {
      user: 'Ravi Kumar',
      action: 'Declined Opportunity',
      details: targetOpp ? targetOpp.name : id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setStorage('iot_audit_trail', [newLog, ...logs]);

    return { success: true, message: 'Opportunity DECLINED.' };
  },

  saveSettings: async (settings) => {
    setStorage('iot_settings', settings);
    return { success: true, data: settings };
  }
};
