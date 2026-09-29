import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/user";

type AdminAuthState = {
  admin: User | null;
  isAdminAuthChecked: boolean;

  completeAdminAuthCheck: (admin: User | null) => void;
  setAdmin: (admin: User | null) => void;
  clearAdmin: () => void;
};

export const adminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAdminAuthChecked: false,

      completeAdminAuthCheck: (admin) => {
        set({
          admin,
          isAdminAuthChecked: true,
        });
      },

      setAdmin: (admin) => {
        set({
          admin,
        });
      },

      clearAdmin: () => {
        set({
          admin: null,
          isAdminAuthChecked: true,
        });
      },
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({
        admin: state.admin,
      }),
    }
  )
);
