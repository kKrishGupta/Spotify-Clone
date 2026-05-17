import { Menu, Search, Wifi, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { useSocketStatus } from "@/providers/socket-context";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useAppStore } from "@/stores/app.store";

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const switchRole = useAuthStore((state) => state.switchRole);
  const logout = useAuthStore((state) => state.logout);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const { status } = useSocketStatus();
  const connected = status === "connected" || status === "simulated";
  const StatusIcon = connected ? Wifi : WifiOff;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-night/65 px-4 py-3 backdrop-blur-2xl md:px-6">
      <div className="flex items-center gap-3">
        <Button className="md:hidden" variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="size-5" />
        </Button>
        <Button asChild variant="outline" className="hidden min-w-[260px] justify-start text-muted-foreground sm:inline-flex">
          <Link to="/app/search">
            <Search className="size-4" />
            Ask for a vibe, artist, lyric, or mood
          </Link>
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant={connected ? "green" : "amber"} className="hidden sm:inline-flex">
            <StatusIcon className="size-3" />
            {status}
          </Badge>
          <select
            value={user?.role || "user"}
            onChange={(event) => switchRole(event.target.value)}
            className="h-10 rounded-md border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-white outline-none"
            aria-label="Switch demo role"
          >
            <option className="bg-ink" value="user">
              Listener
            </option>
            <option className="bg-ink" value="artist">
              Artist
            </option>
            <option className="bg-ink" value="admin">
              Admin
            </option>
          </select>
          <NotificationBell />
          <Button variant="ghost" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
