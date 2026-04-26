import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminPanel from "../pages/AdminPanel";
import ArtistDashboard from "../pages/ArtistDashboard";
import Home from "../pages/Home";
import Library from "../pages/Library";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Search from "../pages/Search";
import UserDashboard from "../pages/UserDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <Library />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist"
        element={
          <ProtectedRoute role="artist">
            <ArtistDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
