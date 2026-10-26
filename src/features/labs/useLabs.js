import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../shared/lib/api';

const LABS_KEY = ['labs'];

export function useLabs() {
  return useQuery({ queryKey: LABS_KEY, queryFn: () => api('/labs') });
}

// Після будь-якої зміни список лабораторних перезавантажується з сервера.
function useLabMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LABS_KEY }),
  });
}

export const useCreateLab = () =>
  useLabMutation((lab) => api('/labs', { method: 'POST', body: lab }));

export const useUpdateLab = () =>
  useLabMutation(({ id, ...patch }) =>
    api(`/labs/${id}`, { method: 'PATCH', body: patch }),
  );

export const useDeleteLab = () =>
  useLabMutation((id) => api(`/labs/${id}`, { method: 'DELETE' }));
