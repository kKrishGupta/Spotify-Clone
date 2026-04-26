import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../features/auth/authStore";
import { getRoleHome } from "../utils/helpers";

const ProtectedRoute = ({ children, role }) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-night text-white">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-beatPink" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const allowedRoles = Array.isArray(role) ? role : role ? [role] : [];

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
