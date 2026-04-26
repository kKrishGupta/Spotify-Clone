import { useAuthStore } from "../features/auth/authStore";
import { loginUser, logoutUser, registerUser } from "../features/auth/authAPI";

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, logout, setLoading } = useAuthStore();

  const handleLogin = async (data) => {
    setLoading(true);
    const res = await loginUser(data);
    login(res.user);
    return res.user;
  };

  const handleRegister = async (data) => {
    setLoading(true);
    const res = await registerUser(data);
    login(res.user);
    return res.user;
  };

  const handleLogout = async () => {
    setLoading(true);
    await logoutUser();
    logout();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
