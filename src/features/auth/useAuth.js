import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError, getToken, setToken } from '../../shared/lib/api';

const ME_KEY = ['me'];

// Поточний користувач: запит на /auth/me виконується, лише якщо є збережений токен.
export function useCurrentUser() {
  return useQuery({
    queryKey: ME_KEY,
    queryFn: async () => {
      try {
        return await api('/auth/me');
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) setToken(null);
        throw error;
      }
    },
    enabled: Boolean(getToken()),
    retry: false,
    staleTime: Infinity,
  });
}

// Спільна частина входу й реєстрації: зберегти токен і користувача, скинути старі дані.
function useAuthMutation(path) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials) => api(path, { method: 'POST', body: credentials }),
    onSuccess: ({ token, user }) => {
      setToken(token);
      queryClient.removeQueries({ queryKey: ['labs'] });
      queryClient.setQueryData(ME_KEY, user);
    },
  });
}

export const useLogin = () => useAuthMutation('/auth/login');
export const useRegister = () => useAuthMutation('/auth/register');

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    setToken(null);
    queryClient.setQueryData(ME_KEY, null);
    queryClient.removeQueries({ queryKey: ['labs'] });
  };
}

export function useAuth() {
  const me = useCurrentUser();
  return {
    user: me.data ?? null,
    isLoading: me.isLoading,
    login: useLogin(),
    register: useRegister(),
    logout: useLogout(),
  };
}
