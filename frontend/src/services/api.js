import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

API.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export const unwrap = (response) => response?.data?.data ?? response?.data ?? response;

export const withFallback = async (request, fallback) => {
  try {
    const response = await request();
    return unwrap(response);
  } catch (error) {
    await new Promise((resolve) => window.setTimeout(resolve, 240));
    return typeof fallback === "function" ? fallback(error) : fallback;
  }
};

export default API;
