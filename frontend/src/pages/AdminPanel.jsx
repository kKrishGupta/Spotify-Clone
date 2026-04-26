import { Clock3, Music2, Play, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import StatCard from "../components/ui/StatCard";
import { getAdminDashboard } from "../features/admin/adminAPI";
import { usePlayer } from "../features/player/usePlayer";

const statIcons = [Users, Music2, Clock3, Play];

const AdminPanel = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      const data = await getAdminDashboard();
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
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-beat-gradient shadow-glow">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-beatPink">Admin</p>
              <h1 className="text-3xl font-extrabold text-white">Overview</h1>
            </div>
          </div>
          <Button variant="secondary">Export Report</Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboard.stats.map((stat, index) => (
            <StatCard key={stat.label} {...stat} icon={statIcons[index]} tone={index % 2 ? "pink" : "purple"} />
          ))}
        </div>
      </section>

      <div className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">Pending Songs</h2>
            <button className="text-sm font-bold text-beatPink transition duration-300 hover:text-white">View all</button>
          </div>
          <div className="space-y-3">
            {dashboard.pendingSongs.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-4 rounded-2xl bg-white/[0.045] p-3 transition duration-300 hover:bg-white/10"
              >
                <img src={song.cover} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <button onClick={() => playSong(song, dashboard.pendingSongs)} className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-bold text-white">{song.title}</p>
                  <p className="truncate text-xs font-medium text-white/45">Submitted by {song.submittedBy}</p>
                </button>
                <div className="hidden items-center gap-2 sm:flex">
                  <Button className="px-4 py-2 text-xs">Approve</Button>
                  <Button variant="secondary" className="px-4 py-2 text-xs">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-extrabold text-white">Top Artists</h2>
          <div className="space-y-3">
            {dashboard.topArtists.map((artist, index) => (
              <div key={artist} className="flex items-center gap-3 rounded-2xl bg-white/[0.045] p-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-beat-gradient text-sm font-extrabold shadow-glow">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{artist}</p>
                  <p className="text-xs font-medium text-white/45">High audience growth</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminPanel;
