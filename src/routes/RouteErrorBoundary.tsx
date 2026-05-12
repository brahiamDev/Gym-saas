import { useRouteError } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export function RouteErrorBoundary() {
  const error = useRouteError();
  
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111827] border border-[#1E293B] rounded-xl p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-[#EF4444] mx-auto mb-4" />
        <h1 className="font-display text-3xl tracking-wider mb-2">
          ¡Ups! Algo salió mal
        </h1>
        <p className="text-[#94A3B8] mb-4">
          Ocurrió un error inesperado en la aplicación.
        </p>
        <div className="bg-[#0F172A] rounded-lg p-3 mb-6 text-left overflow-auto max-h-32">
          <code className="text-xs text-[#EF4444] font-mono">
            {error instanceof Error ? error.message : 'Error desconocido'}
          </code>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 px-4 bg-[#22C55E] hover:bg-[#22C55E]/90 text-[#0F172A] font-semibold rounded-lg transition-colors"
        >
          Recargar página
        </button>
      </div>
    </div>
  );
}
