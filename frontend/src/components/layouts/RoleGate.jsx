import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { canAccessRoute } from "@/middleware/auth.middleware";

export function RoleGate({ roles, children }) {
  const user = useAuthStore((state) => state.user);

  if (!canAccessRoute(user, roles)) {
    return <Navigate to="/app/home" replace />;
  }

  return children;
}
