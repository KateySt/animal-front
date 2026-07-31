import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "../features/auth/types/auth.ts";

type AuthState = {
  isInitialized: boolean;
  user: User | null;
  accessToken: string | null;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setInitialized: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      isInitialized: false,

      setUser: (user) => set({ user }, false, "setUser"),

      setAccessToken: (token) => set({ accessToken: token }, false, "setAccessToken"),

      setInitialized: (value) => set({ isInitialized: value }, false, "setInitialized"),

      logout: () => set({ user: null, accessToken: null }, false, "logout"),
    }),
    { name: "AuthStore" },
  ),
);
