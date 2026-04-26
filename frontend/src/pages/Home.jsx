import { Flame, Play, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import SongCard from "../components/ui/SongCard";
import { usePlayer } from "../features/player/usePlayer";
import { getFeed } from "../features/feed/feedAPI";

const Home = () => {
  const [feed, setFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { playSong } = usePlayer();

  useEffect(() => {
    let mounted = true;

    const loadFeed = async () => {
      setIsLoading(true);
      const data = await getFeed();
      if (mounted) {
        setFeed(data);
        setIsLoading(false);
      }
    };

    loadFeed();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading || !feed) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  const heroQueue = [feed.hero, ...feed.trending];

  return (
    <Layout>
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-card backdrop-blur-2xl animate-floatIn lg:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-night/50 to-transparent" />
        <div className="absolute inset-y-0 right-0 hidden w-7/12 lg:block">
          <img src={feed.hero.cover} alt="" className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-night/30 to-night" />
        </div>
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-beatPink/30 blur-3xl" />

        <div className="relative max-w-xl py-10 lg:py-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-white/70">
            <Sparkles className="h-4 w-4 text-beatPink" /> New Release
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            {feed.hero.title}
          </h2>
          <p className="mt-4 text-lg font-medium text-white/65">By {feed.hero.artist}</p>
          <Button className="mt-7" onClick={() => playSong(feed.hero, heroQueue)}>
            <Play className="h-5 w-5" fill="currentColor" /> Play Now
          </Button>
        </div>
      </section>

      <SongSection title="Trending Now" icon={Flame} songs={feed.trending} />
      <MixSection mixes={feed.madeForYou} />
      <SongSection title="Recommended For You" icon={Sparkles} songs={feed.recommended} />
    </Layout>
  );
};

const SongSection = ({ title, icon: Icon, songs }) => (
  <section className="mt-8 animate-floatIn">
    <div className="mb-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-beatPink ring-1 ring-white/10">
          <Icon className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-extrabold text-white">{title}</h2>
      </div>
      <button className="text-sm font-bold text-beatPink transition duration-300 hover:text-white">
        View all
      </button>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} queue={songs} />
      ))}
    </div>
  </section>
);

const MixSection = ({ mixes }) => (
  <section className="mt-8 animate-floatIn">
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-xl font-extrabold text-white">Made for You</h2>
      <button className="text-sm font-bold text-beatPink transition duration-300 hover:text-white">
        View all
      </button>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {mixes.map((mix) => (
        <article
          key={mix.id}
          className="group relative min-h-44 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-beatPink/40 hover:shadow-glow"
        >
          <img
            src={mix.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${mix.accent} opacity-75`} />
          <div className="relative flex h-full flex-col justify-end">
            <p className="text-lg font-extrabold text-white">{mix.title}</p>
            <p className="mt-1 text-xs font-medium text-white/65">{mix.subtitle}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default Home;
