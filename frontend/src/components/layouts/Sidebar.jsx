import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { sidebarSections } from "@/config/constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useAppStore } from "@/stores/app.store";
import { cn } from "@/lib/utils";

export function Sidebar({ mobile = false }) {
  const user = useAuthStore((state) => state.user);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

  return (
    <aside
      className={cn(
        "flex h-full w-72 flex-col border-r border-white/10 bg-black/35 p-4 backdrop-blur-2xl",
        !mobile && "fixed inset-y-0 left-0 z-40 hidden md:flex",
      )}
    >
      <NavLink to="/app/home" className="flex items-center gap-3 px-2 py-3" onClick={() => setSidebarOpen(false)}>
        <div className="rounded-md bg-premium-line p-2 text-night shadow-glow">
          <Icons.AudioWaveform className="size-6" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-white">BeatFlow AI</p>
          <p className="text-xs text-muted-foreground">Music intelligence</p>
        </div>
      </NavLink>
      <nav className="scrollbar-premium mt-6 flex-1 space-y-6 overflow-y-auto pr-1">
        {sidebarSections.map((section) => {
          const items = section.items.filter((item) => item.roles.includes(user?.role));
          if (!items.length) {
            return null;
          }

          return (
            <div key={section.label}>
              <p className="px-2 text-xs font-semibold uppercase text-muted-foreground">{section.label}</p>
              <div className="mt-2 space-y-1">
                {items.map((item) => {
                  const Icon = Icons[item.icon] || Icons.Circle;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-white/10 hover:text-white",
                          isActive && "bg-white/12 text-white shadow-inset",
                        )
                      }
                    >
                      <Icon className="size-5" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
      <div className="glass-soft mt-4 rounded-lg p-4">
        <p className="text-sm font-semibold text-white">{user?.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">{user?.plan}</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-4/5 rounded-full bg-premium-line" />
        </div>
      </div>
    </aside>
  );
}
