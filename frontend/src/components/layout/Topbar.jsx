import { Bell, ChevronDown, Command, Menu, Search, UserCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore";

const pageTitles = {
  "/": "Spotify-level music experience",
  "/search": "Explore every sound",
  "/library": "Your library",
  "/dashboard": "User dashboard",
  "/artist": "Artist dashboard",
  "/admin": "Admin control room",
};

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [query, setQuery] = useState("");

  const title = useMemo(
    () => pageTitles[location.pathname] || "BeatFlow",
    [location.pathname],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    navigate(trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : "/search");
  };

  return (
    <header className="glass-panel sticky top-0 z-30 rounded-[1.7rem] px-4 py-4 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <button className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white/80 transition duration-300 hover:bg-white/15 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden xl:block">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-beatPink">
              BeatFlow
            </p>
            <h1 className="truncate text-xl font-extrabold uppercase tracking-wide text-gradient">
              {title}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative min-w-0 flex-1 md:max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for songs, artists, albums..."
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.075] pl-12 pr-14 text-sm font-medium text-white outline-none transition duration-300 placeholder:text-white/40 focus:border-beatPink/50 focus:bg-white/10 focus:shadow-glow"
          />
          <div className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-white/10 bg-night/60 px-2 py-1 text-[10px] font-bold text-white/35 sm:flex">
            <Command className="h-3 w-3" /> K
          </div>
        </form>

        <div className="flex shrink-0 items-center gap-3">
          <button className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white/75 transition duration-300 hover:bg-white/15 hover:text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500 ring-2 ring-night" />
          </button>

          <button className="hidden items-center gap-3 rounded-2xl bg-white/[0.075] py-2 pl-2 pr-3 ring-1 ring-white/10 transition duration-300 hover:bg-white/12 md:flex">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-beatPink/40"
              />
            ) : (
              <UserCircle className="h-9 w-9 text-white/50" />
            )}
            <span className="max-w-24 truncate text-sm font-semibold">{user?.name || "Guest"}</span>
            <ChevronDown className="h-4 w-4 text-white/45" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
