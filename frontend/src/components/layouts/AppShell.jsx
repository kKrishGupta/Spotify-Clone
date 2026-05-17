import { Outlet } from "react-router-dom";
import { ToastStack } from "@/components/notifications/ToastStack";
import { NowPlayingBar } from "@/components/player/NowPlayingBar";
import { MobileNav } from "@/components/layouts/MobileNav";
import { Sidebar } from "@/components/layouts/Sidebar";
import { Topbar } from "@/components/layouts/Topbar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-aurora-grid text-white">
      <div className="noise-layer pointer-events-none fixed inset-0 opacity-40" />
      <Sidebar />
      <MobileNav />
      <div className="relative min-h-screen md:pl-72">
        <Topbar />
        <main className="mx-auto w-full max-w-[1600px] px-4 pb-44 pt-6 md:px-6 md:pb-36">
          <Outlet />
        </main>
      </div>
      <ToastStack />
      <NowPlayingBar />
    </div>
  );
}
