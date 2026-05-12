import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  gym_id: string | null;
  role: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  // Estado
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Acciones
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuth: (user: User | null, session: Session | null, profile: Profile | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Estado inicial
  user: null,
  profile: null,
  session: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  // Acciones
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  setProfile: (profile) => set({ profile }),
  
  setSession: (session) => set({ session }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setAuth: (user, session, profile) => set({
    user,
    session,
    profile,
    isAuthenticated: !!user,
    error: null,
  }),
  
  clearAuth: () => set({
    user: null,
    profile: null,
    session: null,
    isAuthenticated: false,
    error: null,
  }),
}));
