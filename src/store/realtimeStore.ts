import { create } from 'zustand';

interface RealtimeState {
  connected: boolean;
  setConnected: (value: boolean) => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  connected: false,
  setConnected: (value) => set({ connected: value }),
}));