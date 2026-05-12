import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { getSession, getProfile } from '@/services/supabase/authService';

export function RootLayout() {
  const { setAuth, setLoading, clearAuth } = useAuthStore();

  // Restaurar sesión al cargar la aplicación
  useEffect(() => {
    async function restoreSession() {
      setLoading(true);
      try {
        const session = await getSession();
        
        if (session?.user) {
          const profileData = await getProfile(session.user.id);
          setAuth(session.user, session, profileData);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [setAuth, setLoading, clearAuth]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans">
      <Outlet />
    </div>
  );
}
