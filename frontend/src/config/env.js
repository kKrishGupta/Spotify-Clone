export const env = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
  STREAM_URL: import.meta.env.VITE_STREAM_URL || "http://localhost:5000",
  ENABLE_SOCKET: import.meta.env.VITE_ENABLE_SOCKET === "true",
};
