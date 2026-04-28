import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // ✅ store FULL user object
      login: (user) =>
        set({
          user: user || null,
          isAuthenticated: !!user,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      setLoading: (value) =>
        set({
          isLoading: value,
        }),
    }),
    {
      name: "auth-storage",

      // 🔥 IMPORTANT: only persist needed fields
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);