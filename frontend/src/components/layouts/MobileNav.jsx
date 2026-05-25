import { Home, Library, LayoutDashboard, Search, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layouts/Sidebar";
import { useAppStore } from "@/stores/app.store";
import { cn } from "@/lib/utils";

const mobileItems = [
  { label: "Home", path: "/app/home", icon: Home },
  { label: "Search", path: "/app/search", icon: Search },
  { label: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard },
  { label: "Library", path: "/app/library", icon: Library },
];

export function MobileNav() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);

  return (
    <>
      {sidebarOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation backdrop"
          />
          <div className="relative h-full w-80 max-w-[86vw]">
            <Sidebar mobile />
            <Button className="absolute right-3 top-3" size="icon" variant="ghost" onClick={() => setSidebarOpen(false)}>
              <X className="size-5" />
            </Button>
          </div>
        </div>
      ) : null}

      <nav className="fixed inset-x-3 bottom-20 z-40 rounded-lg border border-white/10 bg-black/72 p-2 shadow-card backdrop-blur-2xl md:hidden">
        <div className="grid grid-cols-4 gap-1">
          {mobileItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[11px] font-semibold transition",
                  isActive ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/10 hover:text-white",
                )
              }
            >
              <item.icon className="size-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
