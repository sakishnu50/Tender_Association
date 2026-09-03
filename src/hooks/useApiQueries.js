import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFacade } from '../services/apiClient';

export function useOpportunities() {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: apiFacade.fetchOpportunities,
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

export function useOpportunityRequirements() {
  return useQuery({
    queryKey: ['opportunityRequirements'],
    queryFn: apiFacade.fetchOpportunityRequirements,
    staleTime: 1000 * 60 * 5
  });
}

export function useUpdateConsortiumStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => apiFacade.updateConsortiumStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consortium'] });
      queryClient.invalidateQueries({ queryKey: ['auditTrail'] });
    }
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
