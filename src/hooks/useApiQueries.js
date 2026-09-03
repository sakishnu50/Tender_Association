import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFacade } from '../services/apiClient';
import { mockOpportunities } from '../data/mockData';

// Merges API-returned items with mock data so that rich fields
// (scoreBreakdown, aiAnalysis, similarProjects, priority, etc.)
// are always available on every opportunity object.
function mergeWithMock(fetchedList) {
  if (!fetchedList || !fetchedList.length) return fetchedList;
  return fetchedList.map((item) => {
    const mock = mockOpportunities.find((m) => m.id === item.id);
    return mock ? { ...mock, ...item, ...pickRichFields(mock) } : item;
  });
}

// Returns only the rich fields that the API does not supply.
function pickRichFields(mock) {
  return {
    priority:        mock.priority,
    organization:    mock.organization,
    procurementType: mock.procurementType,
    scoreBreakdown:  mock.scoreBreakdown,
    aiAnalysis:      mock.aiAnalysis,
    similarProjects: mock.similarProjects,
    auditTrail:      mock.auditTrail
  };
}

export function useOpportunities() {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const data = await apiFacade.fetchOpportunities();
      return mergeWithMock(data);
    },
    staleTime: 1000 * 60 * 5
  });
}


export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: apiFacade.fetchAlerts,
    staleTime: 1000 * 60 * 5
  });
}

export function useCalendar() {
  return useQuery({
    queryKey: ['calendar'],
    queryFn: apiFacade.fetchCalendar,
    staleTime: 1000 * 60 * 5
  });
}

export function useConsortium() {
  return useQuery({
    queryKey: ['consortium'],
    queryFn: apiFacade.fetchConsortium,
    staleTime: 1000 * 60 * 5
  });
}

export function useSources() {
  return useQuery({
    queryKey: ['sources'],
    queryFn: apiFacade.fetchSources,
    staleTime: 1000 * 60 * 5
  });
}

export function useOffices() {
  return useQuery({
    queryKey: ['offices'],
    queryFn: apiFacade.fetchOffices,
    staleTime: 1000 * 60 * 5
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: apiFacade.fetchUsers,
    staleTime: 1000 * 60 * 5
  });
}

export function useAuditTrail() {
  return useQuery({
    queryKey: ['auditTrail'],
    queryFn: apiFacade.fetchAuditTrail,
    staleTime: 1000 * 60 * 5
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: apiFacade.fetchSettings,
    staleTime: 1000 * 60 * 5
  });
}

export function usePursueOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, details }) => apiFacade.pursueOpportunity(id, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['auditTrail'] });
    }
  });
}

export function useDeclineOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, details }) => apiFacade.declineOpportunity(id, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['auditTrail'] });
    }
  });
}

export function useSaveSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newSettings) => apiFacade.saveSettings(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });
}
