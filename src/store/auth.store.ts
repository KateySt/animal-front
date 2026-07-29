import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "../features/auth/types/auth.ts";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  hasHydrated: boolean;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setHasHydrated: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,

      setUser: (user) => set({ user }, false, "setUser"),

      setAccessToken: (token) => set({ accessToken: token }, false, "setAccessToken"),

      setHasHydrated: (value) => set({ hasHydrated: value }, false, "setHasHydrated"),

      logout: () => set({ user: null, accessToken: null }, false, "logout"),
    }),
    { name: "AuthStore" },
  ),
);
