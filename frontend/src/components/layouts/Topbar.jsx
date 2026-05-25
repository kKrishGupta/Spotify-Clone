import { Download, Menu, Search, UserRound, Wifi, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { useSocketStatus } from "@/providers/socket-context";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useAppStore } from "@/stores/app.store";

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const { status } = useSocketStatus();
  const connected = status === "connected" || status === "simulated";
  const StatusIcon = connected ? Wifi : WifiOff;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-night/78 px-4 py-3 backdrop-blur-2xl md:px-6">
      <div className="flex items-center gap-3">
        <Button className="md:hidden" variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="size-5" />
        </Button>

        <Button
          asChild
          variant="outline"
          className="hidden h-11 min-w-[280px] justify-start rounded-full bg-white/[0.06] text-muted-foreground sm:inline-flex lg:min-w-[420px]"
        >
          <Link to="/app/search">
            <Search className="size-4 text-pulse" />
            What do you want to play?
          </Link>
        </Button>

        <nav className="hidden items-center gap-1 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/explore">Explore</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/app/premium">Premium</Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="size-4" />
            Install app
          </Button>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Badge variant={connected ? "green" : "amber"} className="hidden xl:inline-flex">
            <StatusIcon className="size-3" />
            {status}
          </Badge>

          <NotificationBell />

          {user ? (
            <>
              <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/[0.055] py-1 pl-1 pr-3 sm:flex">
                <div className="grid size-9 place-items-center rounded-full bg-premium-line text-night">
                  <UserRound className="size-4" />
                </div>
                <span className="max-w-32 truncate text-sm font-semibold text-white">
                  {user.username || user.name || "Listener"}
                </span>
              </div>
              <Button variant="ghost" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="neon">
                <Link to="/register">Signup</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
