import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin" | "stylist";
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  sessionToken: string | null;
  isLoading: boolean;

  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  sessionToken: null,
  isLoading: true, // Starts loading while we check session

  login: (token, user) => set({ isAuthenticated: true, user, sessionToken: token, isLoading: false }),

  logout: () => set({ isAuthenticated: false, user: null, sessionToken: null, isLoading: false }),

  checkSession: async () => {
    // Architectural placeholder: Verify existing session token with backend
    set({ isLoading: false });
  }
}));
