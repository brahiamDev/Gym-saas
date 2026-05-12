import { supabase } from './client';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Crea un canal de Supabase Realtime para un gimnasio específico.
 * 
 * @param gymId - ID del gimnasio
 * @param feature - Nombre del feature (ej: 'checkins', 'rankings', 'aforo')
 * @returns RealtimeChannel
 * 
 * @example
 * const channel = createGymChannel('gym-123', 'aforo');
 * channel.on('broadcast', { event: 'checkin' }, (payload) => {
 *   console.log('Nuevo check-in:', payload);
 * }).subscribe();
 */
export function createGymChannel(gymId: string, feature: string): RealtimeChannel {
  const channelName = `gym:${gymId}:${feature}`;
  
  return supabase.channel(channelName, {
    config: {
      broadcast: {
        self: false,
      },
      presence: {
        key: '',
      },
    },
  });
}

/**
 * Suscribe a cambios en una tabla de PostgreSQL vía Realtime.
 * 
 * @param table - Nombre de la tabla
 * @param filter - Filtro opcional (ej: 'gym_id=eq.123')
 * @param callback - Función a ejecutar cuando hay cambios
 * @returns RealtimeChannel
 */
export function subscribeToTable(
  table: string,
  filter: string | null,
  callback: (payload: unknown) => void
): RealtimeChannel {
  let channel = supabase.channel(`db-changes:${table}`);
  
  if (filter) {
    channel = channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table, filter },
      callback
    );
  } else {
    channel = channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table },
      callback
    );
  }
  
  return channel.subscribe();
}

/**
 * Desuscribe un canal específico.
 */
export async function unsubscribeChannel(channel: RealtimeChannel): Promise<void> {
  await channel.unsubscribe();
}

/**
 * Desuscribe TODOS los canales activos.
 * Útil al hacer logout o desmontar la app.
 */
export async function unsubscribeAllChannels(): Promise<void> {
  await supabase.removeAllChannels();
}