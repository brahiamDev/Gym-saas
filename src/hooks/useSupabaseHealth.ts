import { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase/client';

interface HealthStatus {
  status: 'checking' | 'connected' | 'error' | 'not_configured';
  message: string;
  error?: string | null;
}

/**
 * Hook para verificar la conexión con Supabase.
 * 
 * @returns Estado de la conexión (checking, connected, error, not_configured)
 * 
 * @example
 * const { status, message } = useSupabaseHealth();
 * if (status === 'connected') console.log('Todo OK');
 * if (status === 'error') console.log('Error:', message);
 */
export function useSupabaseHealth(): HealthStatus {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'checking',
    message: 'Verificando conexión con Supabase...',
  });

  useEffect(() => {
    async function checkConnection() {
      try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!url || !key) {
          setHealth({
            status: 'not_configured',
            message: '❌ Faltan las credenciales de Supabase.\n\n' +
              '1. Andá a https://supabase.com y creá un proyecto.\n' +
              '2. Copiá la URL y la Anon Key del dashboard.\n' +
              '3. Pegalas en el archivo .env:\n\n' +
              'VITE_SUPABASE_URL=https://tu-proyecto.supabase.co\n' +
              'VITE_SUPABASE_ANON_KEY=tu-anon-key',
          });
          return;
        }

        // Intentar hacer una petición simple para verificar conectividad
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          setHealth({
            status: 'error',
            message: `Error de conexión: ${error.message}`,
            error: error.message,
          });
        } else {
          setHealth({
            status: 'connected',
            message: '✅ Conectado a Supabase correctamente.',
          });
        }
      } catch (err) {
        setHealth({
          status: 'error',
          message: `Error inesperado: ${err instanceof Error ? err.message : String(err)}`,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    checkConnection();
  }, []);

  return health;
}

/**
 * Verifica de forma síncrona si Supabase está configurado.
 * Útil para condicionales en componentes.
 */
export function isSupabaseReady(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}
