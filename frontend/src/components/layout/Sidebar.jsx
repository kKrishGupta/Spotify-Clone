import {
  Album,
  BarChart3,
  Heart,
  Home,
  Library,
  ListMusic,
  Mic2,
  Music2,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { playlists } from "../../utils/constants";
import { cn } from "../../utils/helpers";
import { useAuthStore } from "../../features/auth/authStore";

const primaryNav = [
  { label: "Home", to: "/", icon: Home, end: true },
  { label: "Search", to: "/search", icon: Search },
  { label: "Library", to: "/library", icon: Library },
  { label: "Playlists", to: "/library", icon: ListMusic },
  { label: "Artists", to: "/artist", icon: Users, roles: ["artist"] },
  { label: "Albums", to: "/library", icon: Album },
  { label: "Liked Songs", to: "/library", icon: Heart },
];

const roleNav = [
  { label: "User Dashboard", to: "/dashboard", icon: BarChart3, roles: ["user"] },
  { label: "Artist Dashboard", to: "/artist", icon: Mic2, roles: ["artist"] },
  { label: "Admin Panel", to: "/admin", icon: ShieldCheck, roles: ["admin"] },
];

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "user";
  const navItems = [...primaryNav, ...roleNav].filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  return (
    <aside className="glass-panel hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col overflow-hidden rounded-[1.7rem] lg:flex">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-6">
        <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-beat-gradient shadow-glow">
          <Music2 className="h-6 w-6 text-white" fill="currentColor" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-beatPink ring-4 ring-night" />
        </div>
        <div>
          <p className="text-lg font-extrabold tracking-tight">BeatFlow</p>
          <p className="text-xs font-medium text-white/45">Flow with Beat</p>
        </div>
      </div>

      <nav className="scrollbar-hidden flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavItem key={`${item.label}-${item.to}`} item={item} />
          ))}
        </div>

        <div className="my-6 h-px bg-white/10" />

        <div className="mb-3 flex items-center justify-between px-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
            Your Playlists
          </p>
          <Sparkles className="h-4 w-4 text-beatPink" />
        </div>

        <div className="space-y-2">
          {playlists.map((playlist) => (
            <NavLink
              key={playlist.id}
              to="/library"
              className="group flex items-center gap-3 rounded-2xl px-2 py-2 text-sm text-white/70 transition duration-300 hover:bg-white/10 hover:text-white"
            >
              <img
                src={playlist.cover}
                alt=""
                className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10 transition duration-300 group-hover:scale-105"
              />
              <span className="truncate font-medium">{playlist.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-3xl bg-white/[0.055] p-4 ring-1 ring-white/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-beatPink">
            BeatFlow Pro
          </p>
          <p className="mt-2 text-sm text-white/70">
            Spatial mixes, ad-free playback, and artist-first discovery.
          </p>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ item }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-300",
          isActive
            ? "bg-beat-gradient text-white shadow-glow"
            : "text-white/60 hover:bg-white/10 hover:text-white",
        )
      }
    >
      <Icon className="h-5 w-5 transition duration-300 group-hover:scale-110" />
      <span>{item.label}</span>
    </NavLink>
  );
};

export default Sidebar;
