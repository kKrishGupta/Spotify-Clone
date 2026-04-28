import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// ✅ ADD THIS
export const withFallback = async (fn, fallback) => {
  try {
    const res = await fn();

    // ✅ ALWAYS RETURN CLEAN DATA
    if (res && res.data) {
      return res.data.data ?? res.data;
    }

    return fallback;
  } catch (err) {
    console.error(
      "API error:",
      err?.response?.data || err.message
    );

    return typeof fallback === "function"
      ? fallback()
      : fallback;
  }
};
export default API;