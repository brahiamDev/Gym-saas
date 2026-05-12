import { useCallback } from 'react';
import { useAuthStore } from '@/store';
import {
  signIn as signInService,
  signUp as signUpService,
  signOut as signOutService,
  getProfile,
  createProfile,
} from '@/services/supabase/authService';

export function useAuth() {
  const {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated,
    error,
    setLoading,
    setError,
    setAuth,
    clearAuth,
  } = useAuthStore();

  /**
   * Inicia sesión con email y contraseña.
   */
  const signIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        const { user: authUser, session: authSession, error: authError } =
          await signInService({ email, password });

        if (authError) {
          setError(authError.message);
          return { success: false, error: authError.message };
        }

        if (authUser) {
          const profileData = await getProfile(authUser.id);
          setAuth(authUser, authSession, profileData);
        }

        return { success: true, error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido';
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setAuth]
  );

  /**
   * Registra un nuevo usuario.
   * Después del registro, inicia sesión automáticamente y crea el perfil.
   */
  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      setLoading(true);
      setError(null);

      try {
        // 1. Registrar usuario (siempre como 'member')
        const { user: authUser, error: authError } = await signUpService({
          email,
          password,
          fullName,
        });

        if (authError) {
          setError(authError.message);
          return { success: false, error: authError.message };
        }

        if (!authUser) {
          setError('No se pudo crear el usuario');
          return { success: false, error: 'No user returned' };
        }

        // 2. Iniciar sesión automáticamente
        const { user: loginUser, session: loginSession, error: loginError } =
          await signInService({ email, password });

        if (loginError) {
          setError(loginError.message);
          return { success: false, error: loginError.message };
        }

        if (!loginUser) {
          setError('No se pudo iniciar sesión después del registro');
          return { success: false, error: 'Login after signup failed' };
        }

        // 3. Crear perfil (siempre como 'member' — staff se asigna desde Supabase)
        const { data: profileData, error: profileError } = await createProfile(
          loginUser.id,
          fullName,
          'member'
        );

        if (profileError) {
          console.error('Error creando perfil:', profileError);
          setAuth(loginUser, loginSession, null);
          setError(`Cuenta creada, pero hubo un error al crear tu perfil: ${profileError.message}`);
          return { success: true, error: profileError.message };
        }

        setAuth(loginUser, loginSession, profileData);
        return { success: true, error: null };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error desconocido durante el registro';
        setError(message);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setAuth]
  );

  /**
   * Cierra la sesión.
   */
  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      await signOutService();
      clearAuth();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, clearAuth]);

  /**
   * Limpia el error actual.
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  };
}
