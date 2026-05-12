/**
 * Tipos de la base de datos de Supabase.
 * 
 * IMPORTANTE: Cuando tengas tu proyecto de Supabase creado,
 * generá los tipos automáticamente con el CLI:
 * 
 *   npx supabase login
 *   npx supabase gen types typescript --project-id "tu-project-id" --schema public > src/services/supabase/database.types.ts
 * 
 * Luego importalos acá:
 *   import type { Database } from './database.types';
 *   export type { Database };
 */

// Tipos temporales para desarrollo
// Reemplazar con los tipos generados por el CLI de Supabase

export interface Gym {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  logo_url?: string | null;
  settings?: Record<string, unknown> | null;
  is_active: boolean;
  max_capacity?: number | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Profile {
  id: string;
  user_id: string;
  gym_id: string;
  role: 'super_admin' | 'gym_owner' | 'admin' | 'recepcionista' | 'trainer' | 'member' | 'guest';
  full_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  gym_id: string;
  profile_id: string;
  member_code: string;
  qr_code?: string | null;
  emergency_contact?: string | null;
  emergency_phone?: string | null;
  notes?: string | null;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Membership {
  id: string;
  gym_id: string;
  name: string;
  description?: string | null;
  price: number;
  duration_days: number;
  benefits?: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MemberMembership {
  id: string;
  member_id: string;
  membership_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  payment_status: 'paid' | 'pending' | 'overdue';
  created_at: string;
  updated_at: string;
}

export interface CheckIn {
  id: string;
  gym_id: string;
  member_id: string;
  check_in_at: string;
  check_out_at?: string | null;
  method: 'qr' | 'manual' | 'nfc';
  verified_by?: string | null;
  notes?: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      gyms: { Row: Gym; Insert: Omit<Gym, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Gym, 'id' | 'created_at'>> };
      profiles: { Row: Profile; Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Profile, 'id' | 'created_at'>> };
      members: { Row: Member; Insert: Omit<Member, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Member, 'id' | 'created_at'>> };
      memberships: { Row: Membership; Insert: Omit<Membership, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<Membership, 'id' | 'created_at'>> };
      member_memberships: { Row: MemberMembership; Insert: Omit<MemberMembership, 'id' | 'created_at' | 'updated_at'>; Update: Partial<Omit<MemberMembership, 'id' | 'created_at'>> };
      checkins: { Row: CheckIn; Insert: Omit<CheckIn, 'id' | 'created_at'>; Update: Partial<Omit<CheckIn, 'id' | 'created_at'>> };
    };
  };
};