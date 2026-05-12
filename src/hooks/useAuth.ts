import { useAuthStore } from '@/store';

export function useAuth() {
  const { isAuthenticated } = useAuthStore();
  return { isAuthenticated };
}