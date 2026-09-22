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

// Master opportunities collection with userId isolation & persistence
function getAllOpportunities() {
  const existing = getStorage('iot_all_opportunities', null);
  if (existing && Array.isArray(existing)) {
    return existing;
  }
  // Initialize baseline seed opportunities for demo accounts
  const seedDemo = mockOpportunities.map((opp) => ({
    ...opp,
    userId: opp.userId || 'xyz10@gmail.com'
  }));
  setStorage('iot_all_opportunities', seedDemo);
  return seedDemo;
}

function saveAllOpportunities(opportunities) {
  setStorage('iot_all_opportunities', opportunities);
}

// Generates initial seed opportunities for a new user account upon first login
function seedNewUserOpportunities(userId) {
  const userPrefix = userId.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6) || 'USR';
  return mockOpportunities.slice(0, 5).map((opp, idx) => ({
    ...opp,
    id: `OPP-${userPrefix}-${String(idx + 1).padStart(3, '0')}`,
    userId: userId,
    status: opp.status || 'New'
  }));
}

// User-Isolated, Persistent Client-Side API Facade
export const apiFacade = {
  fetchOpportunities: async (userId) => {
    if (!userId) return [];
    const normalizedUserId = String(userId).trim().toLowerCase();
    const all = getAllOpportunities();

    const userExisting = all.filter((item) => {
      const owner = (item.userId || item.owner || '').trim().toLowerCase();
      return owner === normalizedUserId;
    });

    // If this user already has saved opportunities, load and return them
    if (userExisting.length > 0) {
      return userExisting;
    }

    // If first-time login for this user, seed their initial opportunities and persist them permanently
    const initialUserOpps = seedNewUserOpportunities(normalizedUserId);
    const updated = [...initialUserOpps, ...all];
    saveAllOpportunities(updated);
    return initialUserOpps;
  },

  fetchOpportunityById: async (id, userId) => {
    if (!id) return null;
    const all = getAllOpportunities();
    if (userId) {
      const normalizedUserId = String(userId).trim().toLowerCase();
      return (
        all.find(
          (o) => o.id === id && (o.userId || '').trim().toLowerCase() === normalizedUserId
        ) || null
      );
    }
    return all.find((o) => o.id === id) || null;
  },

  fetchAlerts: async (userId) => {
    if (!userId) return [];
    const key = `iot_alerts_${String(userId).trim().toLowerCase()}`;
    return getStorage(key, mockAlerts);
  },

  fetchCalendar: async (userId) => {
    if (!userId) return [];
    const key = `iot_calendar_${String(userId).trim().toLowerCase()}`;
    return getStorage(key, mockCalendarEvents);
  },

  fetchConsortium: async (userId) => {
    const key = userId ? `iot_consortium_${String(userId).trim().toLowerCase()}` : 'iot_consortium';
    return getStorage(key, mockConsortium);
  },

  fetchOpportunityRequirements: async () => mockOpportunityRequirements,
  fetchSources: async () => mockSources,
  fetchOffices: async () => mockOffices,
  fetchUsers: async () => mockUsers,

  fetchAuditTrail: async (userId) => {
    const key = userId ? `iot_audit_trail_${String(userId).trim().toLowerCase()}` : 'iot_audit_trail';
    const logs = getStorage(key, mockAuditTrail);
    return logs;
  },

  fetchSettings: async (userId) => {
    const key = userId ? `iot_settings_${String(userId).trim().toLowerCase()}` : 'iot_settings';
    return getStorage(key, {
      highPriority: true,
      deadlineAlerts: true,
      dailyReports: true,
      weeklyReports: false,
      threshold: '8.0'
    });
  },

  updateConsortiumStatus: async (id, status, userId) => {
    const key = userId ? `iot_consortium_${String(userId).trim().toLowerCase()}` : 'iot_consortium';
    const list = getStorage(key, mockConsortium);
    const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
    setStorage(key, updated);

    const partner = list.find((item) => item.id === id);
    const partnerName = partner ? partner.name : id;

    const auditKey = userId ? `iot_audit_trail_${String(userId).trim().toLowerCase()}` : 'iot_audit_trail';
    const logs = getStorage(auditKey, mockAuditTrail);

    let actionLabel = 'Updated Partner Status';
    if (status === 'recommended') actionLabel = 'Recommended Partner';
    else if (status === 'shortlisted') actionLabel = 'Shortlisted Partner';
    else if (status === 'contacted') actionLabel = 'Contacted Partner';

    const newLog = {
      user: userId || 'User',
      action: actionLabel,
      details: `${partnerName} (${status.toUpperCase()})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setStorage(auditKey, [newLog, ...logs]);

    return { success: true, data: updated, updatedId: id, status };
  },

  pursueOpportunity: async (id, details, userId) => {
    const { logAuditEvent } = await import('../services/auditService');
    const normalizedUserId = userId ? String(userId).trim().toLowerCase() : '';
    const all = getAllOpportunities();
    const targetOpp = all.find((o) => o.id === id);

    const updatedOpps = all.map((o) => {
      if (o.id === id) {
        return { ...o, status: 'Pursued' };
      }
      return o;
    });
    saveAllOpportunities(updatedOpps);

    if (normalizedUserId) {
      logAuditEvent({
        user: normalizedUserId,
        userName: normalizedUserId,
        userRole: 'Manager',
        action: 'Decision Updated',
        opportunityId: id,
        recordId: id,
        recordName: targetOpp ? targetOpp.name : id,
        opportunityTitle: targetOpp ? targetOpp.name : id,
        office: targetOpp?.office || 'Chennai Office',
        details: 'Management decision - PURSUE',
        previousValue: targetOpp?.status || 'Pending',
        newValue: 'Pursue',
        priority: targetOpp?.priority || 'MEDIUM',
        source: 'Decision Module'
      });
    }

    return { success: true, message: 'Opportunity marked as PURSUED!' };
  },

  declineOpportunity: async (id, details, userId) => {
    const { logAuditEvent } = await import('../services/auditService');
    const normalizedUserId = userId ? String(userId).trim().toLowerCase() : '';
    const all = getAllOpportunities();
    const targetOpp = all.find((o) => o.id === id);

    const updatedOpps = all.map((o) => {
      if (o.id === id) {
        return { ...o, status: 'Declined' };
      }
      return o;
    });
    saveAllOpportunities(updatedOpps);

    if (normalizedUserId) {
      logAuditEvent({
        user: normalizedUserId,
        userName: normalizedUserId,
        userRole: 'Manager',
        action: 'Decision Updated',
        opportunityId: id,
        recordId: id,
        recordName: targetOpp ? targetOpp.name : id,
        opportunityTitle: targetOpp ? targetOpp.name : id,
        office: targetOpp?.office || 'Chennai Office',
        details: 'Management decision - DECLINE',
        previousValue: targetOpp?.status || 'Pending',
        newValue: 'Decline',
        priority: targetOpp?.priority || 'MEDIUM',
        source: 'Decision Module'
      });
    }

    return { success: true, message: 'Opportunity DECLINED.' };
  },

  createOpportunity: async (opportunity, userId) => {
    const cleanUserId = (opportunity.userId || userId || '').trim().toLowerCase();
    const newOpportunity = {
      ...opportunity,
      userId: cleanUserId
    };

    const all = getAllOpportunities();
    const updatedOpps = [newOpportunity, ...all];
    saveAllOpportunities(updatedOpps);

    const auditKey = cleanUserId ? `iot_audit_trail_${cleanUserId}` : 'iot_audit_trail';
    const logs = getStorage(auditKey, mockAuditTrail);
    const newLog = {
      user: cleanUserId || 'User',
      action: 'Created Opportunity',
      details: newOpportunity.name || newOpportunity.title || newOpportunity.id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setStorage(auditKey, [newLog, ...logs]);

    return { success: true, data: newOpportunity };
  },

  updateOpportunityPriority: async (id, priority, userId) => {
    const all = getAllOpportunities();
    const normalizedPriority = String(priority).toUpperCase();
    const updated = all.map((opp) => {
      if (opp.id === id) {
        return {
          ...opp,
          priority: normalizedPriority
        };
      }
      return opp;
    });
    saveAllOpportunities(updated);
    return { success: true, id, priority: normalizedPriority };
  },

  saveSettings: async (settings, userId) => {
    const key = userId ? `iot_settings_${String(userId).trim().toLowerCase()}` : 'iot_settings';
    setStorage(key, settings);
    return { success: true, data: settings };
  }
};
