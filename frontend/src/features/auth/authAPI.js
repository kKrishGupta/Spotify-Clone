import API, { withFallback } from "../../services/api";
import { demoUsers } from "../../utils/constants";

const pickDemoUser = ({ email = "" } = {}) => {
  if (email.includes("admin")) return demoUsers.admin;
  if (email.includes("artist")) return demoUsers.artist;
  return demoUsers.user;
};

export const loginUser = (data) =>
  withFallback(() => API.post("/auth/login", data), () => ({ user: pickDemoUser(data) }));

export const registerUser = (data) =>
  withFallback(() => API.post("/auth/register", data), () => ({
    user: {
      ...demoUsers.user,
      name: data?.username || data?.name || "Krish",
      email: data?.email || demoUsers.user.email,
      role: data?.role || "user",
    },
  }));

export const logoutUser = () => withFallback(() => API.post("/auth/logout"), { ok: true });

export const getCurrentUser = () => withFallback(() => API.get("/auth/me"), { user: demoUsers.user });
