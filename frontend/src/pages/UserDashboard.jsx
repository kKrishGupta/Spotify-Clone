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
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const { playSong } = usePlayer();

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      const data = await getUserDashboard();
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
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-beatPink">User Dashboard</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white">Good Evening, {user?.name || "Krish"}</h1>
            <p className="mt-2 text-sm font-medium text-white/55">Welcome back to BeatFlow</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-beat-gradient px-6 py-3 text-sm font-bold text-white shadow-glow transition duration-300 hover:scale-105">
            <Play className="h-4 w-4" fill="currentColor" /> Play
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboard.stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} icon={statIcons[index]} tone={index % 2 ? "pink" : "purple"} />
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">Recently Played</h2>
          <button className="text-sm font-bold text-beatPink transition duration-300 hover:text-white">View all</button>
        </div>

        <Card className="space-y-3 p-3">
          {dashboard.recent.map((song) => (
            <button
              key={song.id}
              onClick={() => playSong(song, dashboard.recent)}
              className="group flex w-full items-center gap-4 rounded-2xl bg-white/[0.045] p-3 text-left transition duration-300 hover:bg-white/10"
            >
              <img src={song.cover} alt="" className="h-14 w-14 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{song.title}</p>
                <p className="truncate text-xs font-medium text-white/45">{song.artist}</p>
              </div>
              <Play className="h-5 w-5 text-white/65 transition duration-300 group-hover:text-beatPink" fill="currentColor" />
            </button>
          ))}
        </Card>
      </section>
    </Layout>
  );
};

export default UserDashboard;
