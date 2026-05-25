import { memo } from "react";

import { Outlet } from "react-router-dom";

import { ToastStack }
from "@/components/notifications/ToastStack";

import { NowPlayingBar }
from "@/components/player/NowPlayingBar";

import { MobileNav }
from "@/components/layouts/MobileNav";

import { Sidebar }
from "@/components/layouts/Sidebar";

import { Topbar }
from "@/components/layouts/Topbar";

function AppShellComponent() {

  return (

    <div className="relative min-h-screen overflow-hidden bg-[#04050f] text-white">

      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0">

        <div className="absolute inset-0 bg-aurora-grid opacity-70" />

        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute right-0 top-1/3 h-[450px] w-[450px] rounded-full bg-fuchsia-500/10 blur-[140px]" />

      </div>

      {/* SIDEBAR */}
      <Sidebar />

      {/* MOBILE */}
      <MobileNav />

      {/* CONTENT */}
      <div className="relative min-h-screen md:pl-72">

        <Topbar />

        <main className="relative z-10 mx-auto w-full max-w-[1700px] px-4 pb-44 pt-6 md:px-6 md:pb-36">

          <Outlet />

        </main>

      </div>

      {/* GLOBALS */}
      <ToastStack />

      <NowPlayingBar />

    </div>
  );
}

export const AppShell =
  memo(AppShellComponent);