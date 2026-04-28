import { useEffect } from "react";
import { getCurrentUser } from "../features/auth/authAPI";
import { useAuthStore } from "../features/auth/authStore";

const Providers = ({ children }) => {
  const login = useAuthStore((s) => s.login);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    let mounted = true;

    const hydrateUser = async () => {
      try {
        setLoading(true);

        const res = await getCurrentUser();

        // console.log("HYDRATE USER:", res); // 🔥 DEBUG

        if (mounted && res?.user) {
          login(res.user); // ✅ THIS FIXES YOUR ISSUE
        }
      } catch (err) {
        console.log("Not logged in");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    hydrateUser();

    return () => {
      mounted = false;
    };
  }, [login, setLoading]);

  return children;
};

export default Providers;