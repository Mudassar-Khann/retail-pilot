import { create } from "zustand";

interface ThemeState {
  theme: "dark" | "light" | "system";
  isReducedMotion: boolean;
  setTheme: (theme: "dark" | "light" | "system") => void;
  setReducedMotion: (reduce: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark", // Enforcing dark default for scientific luxury
  isReducedMotion: false,
  setTheme: (theme) => set({ theme }),
  setReducedMotion: (reduce) => set({ isReducedMotion: reduce })
}));
