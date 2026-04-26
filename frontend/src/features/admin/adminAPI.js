import API, { withFallback } from "../../services/api";
import { adminDashboard } from "../../utils/constants";

export const getAdminDashboard = () =>
  withFallback(() => API.get("/admin/dashboard"), adminDashboard);

export const getPendingSongs = () =>
  withFallback(() => API.get("/admin/songs/pending"), adminDashboard.pendingSongs);
