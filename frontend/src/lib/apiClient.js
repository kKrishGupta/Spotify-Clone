import axios from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/features/auth/store/auth.store";

export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const refreshToken = useAuthStore.getState().refreshToken;

    if (status === 401 && refreshToken) {
      const refreshed = await useAuthStore.getState().refreshSession();
      if (refreshed) {
        error.config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
        return apiClient(error.config);
      }
    }

    return Promise.reject(error);
  },
);
