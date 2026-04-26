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
  const { playSong } = usePlayer();

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      const data = await getArtistDashboard();
      if (mounted) {
        setDashboard(data);
        setIsLoading(false);
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading || !dashboard) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="glass-panel rounded-[2rem] p-5 lg:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-beat-gradient shadow-glow">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-beatPink">Artist Dashboard</p>
            <h1 className="text-3xl font-extrabold text-white">Welcome back, Artist</h1>
            <p className="mt-1 text-sm font-medium text-white/55">Track your performance and audience</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboard.stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} icon={statIcons[index]} tone={index % 2 ? "pink" : "purple"} />
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">Recent Songs</h2>
          <button className="text-sm font-bold text-beatPink transition duration-300 hover:text-white">View all</button>
        </div>

        <Card className="overflow-hidden p-3">
          <div className="space-y-2">
            {dashboard.songs.map((song) => (
              <div
                key={song.id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 rounded-2xl bg-white/[0.045] p-3 transition duration-300 hover:bg-white/10"
              >
                <img src={song.cover} alt="" className="h-11 w-11 rounded-xl object-cover" />
                <button onClick={() => playSong(song, dashboard.songs)} className="min-w-0 text-left">
                  <p className="truncate text-sm font-bold text-white">{song.title}</p>
                  <p className="truncate text-xs font-medium text-white/45">{song.album}</p>
                </button>
                <StatusPill status={song.status} />
                <span className="hidden text-sm font-semibold text-white/55 sm:block">{song.plays}</span>
                <span className="hidden text-sm font-semibold text-white/55 md:block">{song.likes}</span>
              </div>
            ))}
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
    <span className={cn("rounded-full px-3 py-1 text-xs font-bold", statusClass[status])}>
      {status}
    </span>
  );
};

export default ArtistDashboard;
