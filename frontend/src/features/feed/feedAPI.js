import API from "../../services/api";

export const getFeed = async () => {
  const res = await API.get("/feed");

  // ✅ FIX: unwrap backend response
  return res.data.data;
};

export const searchFeed = async (query = "") => {
  const res = await API.get("/music/search", {
    params: { q: query },
  });
  return res.data.data;
};

export const getRecommendations = async () => {
  const res = await API.get("/feed/recommendations");
  return res.data.data;
};

export const getUserDashboard = async () => {
  try {
    const res = await API.get("/users/me/dashboard");

    return res.data?.data || {
      stats: [],
      recent: [],
    };
  } catch (err) {
    console.error("Dashboard API error:", err);
    return {
      stats: [],
      recent: [],
    };
  }
};