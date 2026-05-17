import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const location = useLocation();

  if (!user || !accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
