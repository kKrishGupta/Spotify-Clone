import { demoUsers } from "@/config/constants";
import { simulateNetwork } from "@/services/mockData.service";

function resolveRole(email = "") {
  if (email.includes("admin")) {
    return "admin";
  }
  if (email.includes("artist")) {
    return "artist";
  }
  return "user";
}

function createSession(email) {
  const role = resolveRole(email);
  const user = { ...demoUsers[role], email: email || demoUsers[role].email };

  return {
    user,
    accessToken: `${role}.demo.access.${Date.now()}`,
    refreshToken: `${role}.demo.refresh.${Date.now()}`,
  };
}

export const authService = {
  login: (payload) => simulateNetwork(createSession(payload.email), 420),
  register: (payload) =>
    simulateNetwork({
      user: { ...demoUsers.user, name: payload.name, email: payload.email },
      accessToken: `user.demo.access.${Date.now()}`,
      refreshToken: `user.demo.refresh.${Date.now()}`,
    }),
  verifyOtp: (payload) => simulateNetwork({ verified: payload.code.length === 6 }),
  forgotPassword: (payload) => simulateNetwork({ sent: true, email: payload.email }),
  resetPassword: () => simulateNetwork({ reset: true }),
  refresh: (refreshToken) =>
    simulateNetwork({
      accessToken: `refreshed.demo.access.${Date.now()}`,
      refreshToken: refreshToken || `refreshed.demo.refresh.${Date.now()}`,
    }),
};
