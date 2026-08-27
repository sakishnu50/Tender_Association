import { apiFacade } from './apiClient';

export const apiService = {
  login: async (email) => {
    const token = 'enterprise-mock-jwt-token';
    const user = { name: 'XYZ', email: email || 'xyz10@gmail.com', role: 'Admin', office: 'Chennai' };
    localStorage.setItem('iot_token', token);
    localStorage.setItem('iot_user', JSON.stringify(user));
    return { success: true, token, user };
  },

  getOpportunities: async () => apiFacade.fetchOpportunities(),
  pursueOpportunity: async (id, details) => apiFacade.pursueOpportunity(id, details),
  declineOpportunity: async (id, details) => apiFacade.declineOpportunity(id, details),
  getAlerts: async () => apiFacade.fetchAlerts(),
  getCalendar: async () => apiFacade.fetchCalendar(),
  getConsortium: async () => apiFacade.fetchConsortium(),
  getSources: async () => apiFacade.fetchSources(),
  getOffices: async () => apiFacade.fetchOffices(),
  getUsers: async () => apiFacade.fetchUsers(),
  getAuditTrail: async () => apiFacade.fetchAuditTrail(),
  getSettings: async () => apiFacade.fetchSettings(),
  saveSettings: async (settings) => apiFacade.saveSettings(settings)
};
