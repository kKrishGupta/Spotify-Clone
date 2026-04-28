import { BarChart3, Heart, Music2, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import StatCard from "../components/ui/StatCard";
import { getArtistDashboard } from "../features/artist/artistAPI";
import { usePlayer } from "../features/player/usePlayer";
import { cn } from "../utils/helpers";

const statIcons = [Music2, Play, Heart, Users];

const ArtistDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);

        const data = await getArtistDashboard();
        console.log("Artist Dashboard:", data); // 🔍 debug

        if (mounted) {
          setDashboard(data);
        }
      } catch (err) {
        console.error("Dashboard error:", err?.response?.data || err.message);

        if (mounted) {
          setError("Failed to load dashboard");
          setDashboard({ stats: [], songs: [] }); // ✅ fallback
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

  // ✅ loading state
  if (isLoading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  // ✅ error state
  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-400 font-semibold">
          {error}
        </div>
      </Layout>
    );
  }

  // ✅ safe defaults (NO CRASH EVER)
  const stats = dashboard?.stats ?? [];
  const songs = dashboard?.songs ?? [];

  return (
    <Layout>
      {/* ===== TOP STATS ===== */}
      <section className="glass-panel rounded-[2rem] p-5 lg:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-beat-gradient shadow-glow">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-beatPink">
              Artist Dashboard
            </p>
            <h1 className="text-3xl font-extrabold text-white">
              Welcome back, Artist
            </h1>
            <p className="mt-1 text-sm font-medium text-white/55">
              Track your performance and audience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.length > 0 ? (
            stats.map((stat, index) => (
              <StatCard
                key={stat.label || index}
                {...stat}
                icon={statIcons[index]}
                tone={index % 2 ? "pink" : "purple"}
              />
            ))
          ) : (
            <p className="text-white/50 text-sm">No stats available</p>
          )}
        </div>
      </section>

      {/* ===== SONGS ===== */}
      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">
            Recent Songs
          </h2>
        </div>

        <Card className="overflow-hidden p-3">
          <div className="space-y-2">
            {songs.length > 0 ? (
              songs.map((song) => (
                <div
                  key={song.id}
                  className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 rounded-2xl bg-white/[0.045] p-3 transition duration-300 hover:bg-white/10"
                >
                  <img
                    src={song.cover}
                    alt=""
                    className="h-11 w-11 rounded-xl object-cover"
                  />

                  <button
                    onClick={() => playSong(song, songs)}
                    className="min-w-0 text-left"
                  >
                    <p className="truncate text-sm font-bold text-white">
                      {song.title}
                    </p>
                    <p className="truncate text-xs text-white/45">
                      {song.album}
                    </p>
                  </button>

                  <StatusPill status={song.status} />

                  <span className="hidden text-sm text-white/55 sm:block">
                    {song.plays}
                  </span>

                  <span className="hidden text-sm text-white/55 md:block">
                    {song.likes}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white/50 text-sm">No songs available</p>
            )}
          </div>
        </Card>
      </section>
    </Layout>
  );
};

const StatusPill = ({ status }) => {
  const statusClass = {
    Approved: "bg-emerald-500/15 text-emerald-300",
    Pending: "bg-amber-500/15 text-amber-300",
    Rejected: "bg-red-500/15 text-red-300",
  };

  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-bold",
        statusClass[status] || "bg-gray-500/15 text-gray-300"
      )}
    >
      {status}
    </span>
  );
};

export default ArtistDashboard;