import { create } from "zustand";

export interface ServerState {
  updating: boolean;
  error: boolean;
  startUpdate: () => void;
  finishUpdate: () => void;
}

const initialState = () => ({
  updating: false,
  error: false,
});

export const useServerStore = create<ServerState>((set) => ({
  ...initialState(),
  startUpdate: () => set({ updating: true, error: false }),
  finishUpdate: () => set({ updating: false, error: false }),
}));
