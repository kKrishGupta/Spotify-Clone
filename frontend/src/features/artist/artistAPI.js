import API from "../../services/api";

export const getArtistDashboard = async () => {
  const res = await API.get("/artist/dashboard");
  return res.data;
};

export const getArtistSongs = async () => {
  const res = await API.get("/artist/songs");
  return res.data;
};