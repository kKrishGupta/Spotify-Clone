import { Heart, ListMusic, Play, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import StatCard from "../components/ui/StatCard";
import { getUserDashboard } from "../features/feed/feedAPI";
import { usePlayer } from "../features/player/usePlayer";
import { useAuthStore } from "../features/auth/authStore";

const statIcons = [ListMusic, Heart, UserPlus, Users];

const UserDashboard = () => {
  const [dashboard, setDashboard] = useState({
    stats: [],
    recent: [],
    username: null, // ✅ NEW
  });

  const [isLoading, setIsLoading] = useState(true);

  const user = useAuthStore((state) => state.user);
  const { playSong } = usePlayer();

  // 🔥 REAL-TIME GREETING FUNCTION
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // 🔥 USERNAME FALLBACK SYSTEM (MAIN FIX)
  const username =
    user?.username ||
    dashboard?.username ||
    "User";

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);

        const res = await getUserDashboard();

        // ✅ IMPORTANT: handle backend structure
        const data = res?.data || res;

        if (mounted) {
          setDashboard(
            data || { stats: [], recent: [], username: null }
          );
        }
      } catch (error) {
        console.error("Dashboard Error:", error);

        if (mounted) {
          setDashboard({ stats: [], recent: [], username: null });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 🔥 HEADER */}
      <section className="glass-panel rounded-[2rem] p-5 lg:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-beatPink">
              User Dashboard
            </p>

            {/* ✅ FINAL FIXED HEADER */}
            <h1 className="mt-2 text-3xl font-extrabold text-white">
              {getGreeting()}, {username}
            </h1>

            <p className="mt-2 text-sm font-medium text-white/55">
              Welcome back to BeatFlow
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-full bg-beat-gradient px-6 py-3 text-sm font-bold text-white shadow-glow transition duration-300 hover:scale-105">
            <Play className="h-4 w-4" fill="currentColor" />
            Play
          </button>
        </div>

        {/* 🔥 STATS */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboard.stats.length > 0 ? (
            dashboard.stats.map((stat, index) => (
              <StatCard
                key={stat.label || index}
                {...stat}
                icon={statIcons[index % statIcons.length]}
                tone={index % 2 ? "pink" : "purple"}
              />
            ))
          ) : (
            <p className="text-white/60 text-sm">No stats available</p>
          )}
        </div>
      </section>

      {/* 🔥 RECENT SONGS */}
      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">
            Recently Played
          </h2>

          <button className="text-sm font-bold text-beatPink transition duration-300 hover:text-white">
            View all
          </button>
        </div>

        <Card className="space-y-3 p-3">
          {dashboard.recent.length > 0 ? (
            dashboard.recent.map((song, index) => (
              <button
                key={song.id || index}
                onClick={() => playSong(song, dashboard.recent)}
                className="group flex w-full items-center gap-4 rounded-2xl bg-white/[0.045] p-3 text-left transition duration-300 hover:bg-white/10"
              >
                <img
                  src={song.cover || "/placeholder.png"}
                  alt={song.title}
                  className="h-14 w-14 rounded-2xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {song.title || "Unknown Title"}
                  </p>
                  <p className="truncate text-xs font-medium text-white/45">
                    {song.artist || "Unknown Artist"}
                  </p>
                </div>

                <Play
                  className="h-5 w-5 text-white/65 transition duration-300 group-hover:text-beatPink"
                  fill="currentColor"
                />
              </button>
            ))
          ) : (
            <p className="text-white/60 text-sm px-2">
              No recently played songs
            </p>
          )}
        </Card>
      </section>
    </Layout>
  );
};

export default UserDashboard;