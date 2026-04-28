import API from "../../services/api";

// ✅ MUST be named export
export const getAdminDashboard = async () => {
  const res = await API.get("/admin/dashboard");
  return res.data;
};

export const getPendingSongs = async () => {
  const res = await API.get("/admin/songs/pending");
  return res.data;
};