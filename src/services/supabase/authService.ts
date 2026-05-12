import { supabase } from './client';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/store/authStore';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends AuthCredentials {
  fullName: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: Error | null;
}

/**
 * Helper: Agrega timeout a una promesa.
 * Si la promesa tarda más de X ms, rechaza con timeout.
 */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} (timeout ${ms}ms)`)), ms)
    ),
  ]);
}

/**
 * Inicia sesión con email y contraseña.
 */
export async function signIn({ email, password }: AuthCredentials): Promise<AuthResponse> {
  console.log('🔑 [AuthService] signIn iniciado:', email);
  
  try {
    const { data, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email, password }),
      10000,
      'signIn timeout'
    );

    if (error) {
      console.log('❌ [AuthService] signIn error:', error.message);
      return { user: null, session: null, error };
    }

    console.log('✅ [AuthService] signIn exitoso');
    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Error desconocido en signIn');
    console.error('❌ [AuthService] signIn exception:', error.message);
    return { user: null, session: null, error };
  }
}

/**
 * Registra un nuevo usuario con email y contraseña.
 */
export async function signUp({ email, password, fullName }: SignUpData): Promise<AuthResponse> {
  console.log('📝 [AuthService] signUp iniciado:', email);
  
  try {
    const { data, error } = await withTimeout(
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      }),
      15000,
      'signUp timeout'
    );

    if (error) {
      console.log('❌ [AuthService] signUp error:', error.message);
      return { user: null, session: null, error };
    }

    console.log('✅ [AuthService] signUp exitoso, user:', data.user?.id);
    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Error desconocido en signUp');
    console.error('❌ [AuthService] signUp exception:', error.message);
    return { user: null, session: null, error };
  }
}

/**
 * Crea el perfil de un usuario en public.profiles.
 * Debe llamarse DESPUÉS de signIn (sesión activa).
 */
export async function createProfile(
  userId: string,
  fullName: string,
  role: string = 'member'
): Promise<{ data: Profile | null; error: Error | null }> {
  console.log('👤 [AuthService] createProfile iniciado:', userId);
  
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('profiles')
        .insert([{ id: userId, full_name: fullName, role, is_active: true }])
        .select()
        .single(),
      10000,
      'createProfile timeout'
    );

    if (error) {
      console.error('❌ [AuthService] createProfile error:', error);
      return { data: null, error: new Error(error.message) };
    }

    console.log('✅ [AuthService] createProfile exitoso');
    return { data: data as Profile, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Error desconocido en createProfile');
    console.error('❌ [AuthService] createProfile exception:', error.message);
    return { data: null, error };
  }
}

/**
 * Cierra la sesión actual.
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await withTimeout(supabase.auth.signOut(), 5000, 'signOut timeout');
    return { error };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Error desconocido en signOut');
    return { error };
  }
}

/**
 * Obtiene la sesión actual.
 */
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Obtiene el usuario actual.
 */
export async function getUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/**
 * Obtiene el perfil del usuario desde la tabla profiles.
 * Usa maybeSingle() para no fallar cuando el perfil no existe.
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await withTimeout(
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      8000,
      'getProfile timeout'
    );

    if (error) {
      console.error('[AuthService] getProfile error:', error);
      return null;
    }

    return data as Profile | null;
  } catch (err) {
    console.error('[AuthService] getProfile exception:', err);
    return null;
  }
}

/**
 * Escucha cambios en el estado de autenticación.
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void
) {
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription.unsubscribe;
}
