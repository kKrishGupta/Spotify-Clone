import { useState } from "react";
import { loginUser, registerUser } from "../features/auth/authAPI";
import { useAuthStore } from "../features/auth/authStore";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const handleLogin = async (form) => {
    try {
      setIsLoading(true);

      const res = await loginUser(form);

      // ✅ SAFETY CHECK (very important)
      if (!res?.user) {
        throw new Error("User data missing from response");
      }

      // ✅ store correct user object
      login(res.user);

      return res.user;
    } catch (err) {
      console.error("Login Error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (form) => {
    try {
      setIsLoading(true);

      const res = await registerUser(form);

      if (!res?.user) {
        throw new Error("User data missing from response");
      }

      login(res.user);

      return res.user;
    } catch (err) {
      console.error("Register Error:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, handleRegister, isLoading };
};