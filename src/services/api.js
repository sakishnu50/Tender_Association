import { apiFacade } from './apiClient';

export const apiService = {
  login: async (email) => {
    const cleanEmail = (email || 'xyz10@gmail.com').trim().toLowerCase();
    const token = `jwt-token-${btoa(cleanEmail)}-${Date.now()}`;
    const rawName = cleanEmail.split('@')[0];
    const formattedName = rawName.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const user = {
      id: cleanEmail,
      userId: cleanEmail,
      name: formattedName || 'User',
      email: cleanEmail,
      role: 'Admin',
      office: 'Chennai'
    };
    localStorage.setItem('iot_token', token);
    localStorage.setItem('iot_user', JSON.stringify(user));
    return { success: true, token, user };
  },

  getOpportunities: async (userId) => apiFacade.fetchOpportunities(userId),
  getOpportunityById: async (id, userId) => apiFacade.fetchOpportunityById(id, userId),
  createOpportunity: async (opp, userId) => apiFacade.createOpportunity(opp, userId),
  pursueOpportunity: async (id, details, userId) => apiFacade.pursueOpportunity(id, details, userId),
  declineOpportunity: async (id, details, userId) => apiFacade.declineOpportunity(id, details, userId),
  getAlerts: async (userId) => apiFacade.fetchAlerts(userId),
  getCalendar: async (userId) => apiFacade.fetchCalendar(userId),
  getConsortium: async () => apiFacade.fetchConsortium(),
  getSources: async () => apiFacade.fetchSources(),
  getOffices: async () => apiFacade.fetchOffices(),
  getUsers: async () => apiFacade.fetchUsers(),
  getAuditTrail: async () => apiFacade.fetchAuditTrail(),
  getSettings: async () => apiFacade.fetchSettings(),
  saveSettings: async (settings) => apiFacade.saveSettings(settings)
};
