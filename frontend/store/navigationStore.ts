import { create } from "zustand";

interface NavigationState {
  currentPath: string;
  isMenuOpen: boolean;
  history: string[];
  setPath: (path: string) => void;
  toggleMenu: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPath: "/",
  isMenuOpen: false,
  history: [],
  setPath: (path) => set((state) => ({
    currentPath: path,
    history: [...state.history, path]
  })),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen }))
}));
