const isProd =
  import.meta.env.PROD;

export const env = {

  API_URL:
    import.meta.env.VITE_API_URL ||
    (
      isProd
        ? "https://music-player-1p8a.onrender.com/api"
        : "http://localhost:3000/api"
    ),

  SOCKET_URL:
    import.meta.env.VITE_SOCKET_URL ||
    (
      isProd
        ? "https://music-player-1p8a.onrender.com"
        : "http://localhost:3000"
    ),

  STREAM_URL:
    import.meta.env.VITE_STREAM_URL ||
    (
      isProd
        ? "https://music-player-1p8a.onrender.com"
        : "http://localhost:3000"
    ),

  ENABLE_SOCKET:
    import.meta.env.VITE_ENABLE_SOCKET === "true",
};