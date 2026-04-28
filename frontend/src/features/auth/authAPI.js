import API from "../../services/api";

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data; // ✅ MUST return data
};

export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};


export const getCurrentUser = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};