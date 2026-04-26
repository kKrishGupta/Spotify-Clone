import API, { withFallback } from "../../services/api";
import { homeFeed, songs, userDashboard } from "../../utils/constants";

export const getFeed = () => withFallback(() => API.get("/feed"), homeFeed);

export const searchFeed = (query = "") =>
  withFallback(() => API.get("/music/search", { params: { q: query } }), () => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return songs;

    return songs.filter((song) =>
      [song.title, song.artist, song.album]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  });

export const getRecommendations = () =>
  withFallback(() => API.get("/feed/recommendations"), homeFeed.recommended);

export const getUserDashboard = () =>
  withFallback(() => API.get("/users/me/dashboard"), userDashboard);
