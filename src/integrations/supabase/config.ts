/**
 * Configuración centralizada de Supabase.
 * 
 * Las credenciales se leen del archivo .env:
 *   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
 *   VITE_SUPABASE_ANON_KEY=tu-anon-key
 */
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
} as const;

/**
 * Verifica si la configuración de Supabase está completa.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseConfig.url && supabaseConfig.anonKey);
}

/**
 * Obtiene la URL del proyecto de Supabase.
 */
export function getSupabaseUrl(): string {
  return supabaseConfig.url;
}

/**
 * Obtiene la Anon Key del proyecto de Supabase.
 */
export function getSupabaseAnonKey(): string {
  return supabaseConfig.anonKey;
}