import { Link, NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { Button } from "@/components/ui/button";
import { sidebarSections } from "@/config/constants";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useAppStore } from "@/stores/app.store";
import { cn } from "@/lib/utils";

export function Sidebar({ mobile = false }) {
  const user = useAuthStore((state) => state.user);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const role = ["user", "artist", "admin"].includes(user?.role) ? user.role : "user";

  return (
    <aside
      className={cn(
        "flex h-full w-72 flex-col border-r border-white/10 bg-black/55 p-4 backdrop-blur-2xl",
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
          const items = section.items.filter((item) => item.roles.includes(role));
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
                          isActive && "bg-white/12 text-white shadow-inset ring-1 ring-white/10",
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
      <div className="mt-4 space-y-3">
        <Link
          to="/app/premium"
          onClick={() => setSidebarOpen(false)}
          className="block rounded-lg border border-volt/20 bg-volt/10 p-4 text-sm font-semibold text-volt transition hover:bg-volt/15"
        >
          Upgrade to Premium
          <span className="mt-1 block text-xs font-normal text-white/60">Lossless-ready playback and smarter AI mixes.</span>
        </Link>
        <div className="glass-soft rounded-lg p-4">
          {user ? (
            <>
              <p className="text-sm font-semibold text-white">{user.username || user.name || "Listener"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{user.plan || "BeatFlow listener"}</p>
            </>
          ) : (
            <div className="grid gap-2">
              <Button asChild variant="neon" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/register">Signup</Link>
              </Button>
            </div>
          )}
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-4/5 rounded-full bg-premium-line" />
          </div>
        </div>
      </div>
    </aside>
  );
}
