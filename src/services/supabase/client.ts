import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan las variables de entorno de Supabase.\n' +
    'Creá un archivo .env en la raíz del proyecto con:\n\n' +
    'VITE_SUPABASE_URL=https://tu-proyecto.supabase.co\n' +
    'VITE_SUPABASE_ANON_KEY=tu-anon-key\n\n' +
    'Podés obtener estos valores desde el dashboard de Supabase.'
  );
}

if (!supabaseUrl.includes('.supabase.co')) {
  console.error('La URL de Supabase no parece correcta:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});