import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase/client';
import { isSupabaseReady } from '@/hooks';
import { Database, Wifi, WifiOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface DbStatus {
  connected: boolean;
  gymsCount: number | null;
  profilesCount: number | null;
  membersCount: number | null;
  error: string | null;
}

export function SupabaseDiagnostic() {
  const [status, setStatus] = useState<DbStatus>({
    connected: false,
    gymsCount: null,
    profilesCount: null,
    membersCount: null,
    error: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkConnection() {
      try {
        if (!isSupabaseReady()) {
          setStatus({
            connected: false,
            gymsCount: null,
            profilesCount: null,
            membersCount: null,
            error: 'Faltan credenciales de Supabase. Verificá tu archivo .env',
          });
          setLoading(false);
          return;
        }

        // Verificar conexión básica
        const { data: gyms, error: gymsError } = await supabase
          .from('gyms')
          .select('*', { count: 'exact', head: true });

        if (gymsError) throw gymsError;

        const { count: profilesCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        const { count: membersCount } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true });

        setStatus({
          connected: true,
          gymsCount: gyms?.length ?? 0,
          profilesCount: profilesCount ?? 0,
          membersCount: membersCount ?? 0,
          error: null,
        });
      } catch (err) {
        setStatus({
          connected: false,
          gymsCount: null,
          profilesCount: null,
          membersCount: null,
          error: err instanceof Error ? err.message : 'Error desconocido',
        });
      } finally {
        setLoading(false);
      }
    }

    checkConnection();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#22C55E]" />
        <span className="ml-3 text-[#94A3B8]">Verificando conexión...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#F8FAFC] mb-6 font-display">
        Diagnóstico de Supabase
      </h2>

      {/* Estado de conexión */}
      <div className={`p-4 rounded-lg mb-4 border ${
        status.connected 
          ? 'bg-[#22C55E]/10 border-[#22C55E]/30' 
          : 'bg-[#EF4444]/10 border-[#EF4444]/30'
      }`}>
        <div className="flex items-center gap-3">
          {status.connected ? (
            <CheckCircle className="w-6 h-6 text-[#22C55E]" />
          ) : (
            <AlertCircle className="w-6 h-6 text-[#EF4444]" />
          )}
          <div>
            <p className={`font-semibold ${status.connected ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {status.connected ? 'Conectado a Supabase' : 'Error de conexión'}
            </p>
            {status.error && (
              <p className="text-sm text-[#EF4444] mt-1">{status.error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Credenciales */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          {isSupabaseReady() ? (
            <Wifi className="w-5 h-5 text-[#22C55E]" />
          ) : (
            <WifiOff className="w-5 h-5 text-[#EF4444]" />
          )}
          <h3 className="font-semibold text-[#F8FAFC]">Credenciales</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">URL configurada:</span>
            <span className={isSupabaseReady() ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
              {isSupabaseReady() ? 'Sí' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#94A3B8]">Anon Key configurada:</span>
            <span className={isSupabaseReady() ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
              {isSupabaseReady() ? 'Sí' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Tablas */}
      {status.connected && (
        <div className="bg-[#111827] border border-[#1E293B] rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-5 h-5 text-[#06B6D4]" />
            <h3 className="font-semibold text-[#F8FAFC]">Tablas en la Base de Datos</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Gyms (gimnasios):</span>
              <span className="text-[#F8FAFC] font-mono">{status.gymsCount} registros</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Profiles (usuarios):</span>
              <span className="text-[#F8FAFC] font-mono">{status.profilesCount} registros</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Members (socios):</span>
              <span className="text-[#F8FAFC] font-mono">{status.membersCount} registros</span>
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones si hay error */}
      {!status.connected && (
        <div className="bg-[#111827] border border-[#1E293B] rounded-lg p-4">
          <h3 className="font-semibold text-[#F8FAFC] mb-3">¿Cómo solucionarlo?</h3>
          <ol className="space-y-2 text-sm text-[#94A3B8] list-decimal list-inside">
            <li>Verificá que creaste el archivo <code className="text-[#22C55E]">.env</code> en la raíz del proyecto</li>
            <li>Asegurate de que las credenciales son correctas (sin espacios extra)</li>
            <li>Reiniciá el servidor con <code className="text-[#22C55E]">npm run dev</code></li>
            <li>Si ejecutaste el SQL, esperá 30 segundos y recargá</li>
          </ol>
        </div>
      )}

      {/* Botón de recarga */}
      <button
        onClick={() => window.location.reload()}
        className="mt-6 w-full py-3 px-4 bg-[#22C55E] hover:bg-[#22C55E]/90 text-[#0F172A] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Loader2 className="w-4 h-4" />
        Recargar diagnóstico
      </button>
    </div>
  );
}
