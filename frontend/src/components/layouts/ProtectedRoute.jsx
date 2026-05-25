import {Navigate,Outlet,useLocation} from "react-router-dom";

import { useAuthStore} from "@/features/auth/store/auth.store";

export function ProtectedRoute() {
  const location = useLocation();

  const { user,  hydrated} = useAuthStore();

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#050816]">

        <div className="relative">

          <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/30 blur-2xl" />

          <div className="relative flex flex-col items-center gap-6">

            <div className="h-16 w-16 animate-spin rounded-full border-[3px] border-cyan-500/20 border-t-cyan-400" />

            <div className="space-y-2 text-center">

              <h2 className="text-lg font-semibold text-white">
                Initializing BeatFlow AI
              </h2>

              <p className="text-sm text-zinc-400">
                Preparing your realtime music universe...
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }
  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
}