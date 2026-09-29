import { create } from "zustand";
import type { User } from "../types/user";

type AuthState = {
  user: User | null;
  isAuthChecking: boolean;

  completeAuthCheck: (user: User | null) => void;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>()
((set) => ({
  user: null,
  isAuthChecking: true,

  completeAuthCheck: (user) => {
    set({
      user,
      isAuthChecking: false,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  clearUser: () => {
    set({
      user: null,
      isAuthChecking: false,
    });
  },
}));
