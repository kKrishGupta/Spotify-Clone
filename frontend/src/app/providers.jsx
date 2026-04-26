import { useEffect } from "react";
import { getCurrentUser } from "../features/auth/authAPI";
import { useAuthStore } from "../features/auth/authStore";

const Providers = ({ children }) => {
  const login = useAuthStore((state) => state.login);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    let mounted = true;
    const shouldHydrate = useAuthStore.getState().isAuthenticated;

    if (!shouldHydrate) return undefined;

    const hydrateUser = async () => {
      setLoading(true);
      const res = await getCurrentUser();
      if (mounted && res?.user) login(res.user);
      if (mounted) setLoading(false);
    };

    hydrateUser();

    return () => {
      mounted = false;
    };
  }, [login, setLoading]);

  return children;
};

export default Providers;
