import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserState {
  token: string | null;
  refreshToken: string | null;
  authenticated: boolean;
  _id?: string | null;
  name?: string | null;
  username?: string | null;
}

interface AuthStore {
  user: UserState;
  setUser: (user: UserState) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthStore>(
  // @ts-ignore
  persist(
    (set) => ({
      user: {
        token: null,
        refreshToken: null,
        authenticated: false,
      },
      setUser: (user: UserState) => set({ user }),
      clearUser: () =>
        set({
          user: { token: null, refreshToken: null, authenticated: false },
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
