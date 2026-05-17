import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoUsers } from "@/config/constants";
import { authService } from "@/features/auth/services/auth.service";

const demoSession = {
  user: demoUsers.admin,
  accessToken: "admin.demo.access.seed",
  refreshToken: "admin.demo.refresh.seed",
  status: "authenticated",
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...demoSession,
      isRefreshing: false,
      login: async (payload) => {
        const session = await authService.login(payload);
        set({ ...session, status: "authenticated" });
        return session;
      },
      register: async (payload) => {
        const session = await authService.register(payload);
        set({ ...session, status: "authenticated" });
        return session;
      },
      verifyOtp: async (payload) => authService.verifyOtp(payload),
      forgotPassword: async (payload) => authService.forgotPassword(payload),
      resetPassword: async (payload) => authService.resetPassword(payload),
      refreshSession: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          set({ user: null, accessToken: null, refreshToken: null, status: "anonymous" });
          return false;
        }

        set({ isRefreshing: true });
        try {
          const tokens = await authService.refresh(refreshToken);
          set({ ...tokens, isRefreshing: false, status: "authenticated" });
          return true;
        } catch {
          set({ user: null, accessToken: null, refreshToken: null, isRefreshing: false, status: "anonymous" });
          return false;
        }
      },
      logout: () => set({ user: null, accessToken: null, refreshToken: null, status: "anonymous" }),
      switchRole: (role) => {
        const user = demoUsers[role] || demoUsers.user;
        set({
          user,
          accessToken: `${role}.demo.access.${Date.now()}`,
          refreshToken: `${role}.demo.refresh.${Date.now()}`,
          status: "authenticated",
        });
      },
    }),
    {
      name: "beatflow-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        status: state.status,
      }),
    },
  ),
);
