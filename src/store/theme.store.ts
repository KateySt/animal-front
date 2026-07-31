import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type ThemeState = {
  isDark: boolean;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) => ({
        isDark: true,
        toggleTheme: () => set((s) => ({ isDark: !s.isDark }), false, "toggleTheme"),
      }),
      { name: "theme" },
    ),
    { name: "ThemeStore" },
  ),
);
