import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEMO_USER } from "../../utils/constants";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: DEMO_USER,
      isAuthenticated: true,
      isLoading: false,

      setLoading: (isLoading) => set({ isLoading }),

      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user),
        }),

      login: (user) =>
        set({
          user: user || DEMO_USER,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      switchRole: (role) => {
        const currentUser = get().user || DEMO_USER;
        set({
          user: { ...currentUser, role },
          isAuthenticated: true,
        });
      },
    }),
    {
      name: "beatflow-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
