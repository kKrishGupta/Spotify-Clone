import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { AppShell } from "@/components/layouts/AppShell";
import { ProtectedRoute } from "@/components/layouts/ProtectedRoute";
import { RoleGate } from "@/components/layouts/RoleGate";
import { AuthShell } from "@/features/auth/components/AuthShell";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const OtpPage = lazy(() => import("@/features/auth/pages/OtpPage"));
const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/features/auth/pages/ResetPasswordPage"));
const UserDashboard = lazy(() => import("@/features/user/pages/UserDashboard"));
const ExplorePage = lazy(() => import("@/features/music/pages/ExplorePage"));
const LibraryPage = lazy(() => import("@/features/music/pages/LibraryPage"));
const PlaylistsPage = lazy(() => import("@/features/playlists/pages/PlaylistsPage"));
const SearchPage = lazy(() => import("@/features/search/pages/SearchPage"));
const AIAssistantPage = lazy(() => import("@/features/ai/assistant/AIAssistantPage"));
const MoodEnginePage = lazy(() => import("@/features/ai/mood-engine/MoodEnginePage"));
const AnalyticsDashboard = lazy(() => import("@/features/analytics/dashboard/AnalyticsDashboard"));
const ArtistDashboard = lazy(() => import("@/features/artist/dashboard/ArtistDashboard"));
const UploadStudio = lazy(() => import("@/features/artist/uploads/UploadStudio"));
const ArtistAnalytics = lazy(() => import("@/features/artist/analytics/ArtistAnalytics"));
const AdminDashboard = lazy(() => import("@/features/admin/dashboard/AdminDashboard"));
const ModerationQueue = lazy(() => import("@/features/admin/moderation/ModerationQueue"));
const ReportCenter = lazy(() => import("@/features/admin/reports/ReportCenter"));
const FeedPage = lazy(() => import("@/features/feed/pages/FeedPage"));
const FollowersPage = lazy(() => import("@/features/social/followers/FollowersPage"));
const InboxPage = lazy(() => import("@/features/notifications/inbox/InboxPage"));
const StreamingPage = lazy(() => import("@/features/streaming/visualizer/StreamingPage"));
const MusicPlayerPage = lazy(() => import("@/features/music/player/MusicPlayerPage"));

function screen(element) {
  return <Suspense fallback={<SuspenseFallback />}>{element}</Suspense>;
}

function roleScreen(roles, element) {
  return screen(<RoleGate roles={roles}>{element}</RoleGate>);
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/home" replace />} />
      <Route element={<AuthShell />}>
        <Route path="/login" element={screen(<LoginPage />)} />
        <Route path="/register" element={screen(<RegisterPage />)} />
        <Route path="/otp" element={screen(<OtpPage />)} />
        <Route path="/forgot-password" element={screen(<ForgotPasswordPage />)} />
        <Route path="/reset-password" element={screen(<ResetPasswordPage />)} />
      </Route>
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/home" replace />} />
        <Route path="home" element={screen(<UserDashboard />)} />
        <Route path="explore" element={screen(<ExplorePage />)} />
        <Route path="library" element={screen(<LibraryPage />)} />
        <Route path="playlists" element={screen(<PlaylistsPage />)} />
        <Route path="search" element={screen(<SearchPage />)} />
        <Route path="feed" element={screen(<FeedPage />)} />
        <Route path="social" element={screen(<FollowersPage />)} />
        <Route path="notifications" element={screen(<InboxPage />)} />
        <Route path="player" element={screen(<MusicPlayerPage />)} />
        <Route path="streaming" element={screen(<StreamingPage />)} />
        <Route path="ai/assistant" element={screen(<AIAssistantPage />)} />
        <Route path="ai/mood" element={screen(<MoodEnginePage />)} />
        <Route path="analytics" element={roleScreen(["artist", "admin"], <AnalyticsDashboard />)} />
        <Route path="artist" element={roleScreen(["artist", "admin"], <ArtistDashboard />)} />
        <Route path="artist/upload" element={roleScreen(["artist", "admin"], <UploadStudio />)} />
        <Route path="artist/analytics" element={roleScreen(["artist", "admin"], <ArtistAnalytics />)} />
        <Route path="admin" element={roleScreen(["admin"], <AdminDashboard />)} />
        <Route path="admin/moderation" element={roleScreen(["admin"], <ModerationQueue />)} />
        <Route path="admin/reports" element={roleScreen(["admin"], <ReportCenter />)} />
      </Route>
      <Route path="*" element={<Navigate to="/app/home" replace />} />
    </Routes>
  );
}
