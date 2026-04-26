import API, { withFallback } from "../../services/api";
import { artistDashboard } from "../../utils/constants";

export const getArtistDashboard = () =>
  withFallback(() => API.get("/artist/dashboard"), artistDashboard);

export const getArtistSongs = () =>
  withFallback(() => API.get("/artist/songs"), artistDashboard.songs);
