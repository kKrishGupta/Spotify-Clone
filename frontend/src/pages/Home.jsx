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
  const [error, setError] = useState(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    let mounted = true;

    const loadFeed = async () => {
      try {
        setIsLoading(true);

        const data = await getFeed();
        console.log("Feed:", data);

        if (mounted) setFeed(data);
      } catch (err) {
        console.error("Feed error:", err?.response?.data || err.message);

        if (mounted) {
          setError("Failed to load feed");
          setFeed({
            hero: null,
            trending: [],
            recommended: [],
            madeForYou: [],
          });
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadFeed();

    return () => {
      mounted = false;
    };
  }, []);

  // ===== LOADING =====
  if (isLoading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  // ===== ERROR =====
  if (error) {
    return (
      <Layout>
        <div className="text-red-400 text-center font-semibold">
          {error}
        </div>
      </Layout>
    );
  }

  // ===== SAFE DATA =====
 const hero =
  feed?.hero ||
  feed?.apiSongs?.[0] ||
  null;

const trending =
  feed?.trending?.length
    ? feed.trending
    : feed?.apiSongs ?? [];

const recommended =
  feed?.recommended?.length
    ? feed.recommended
    : feed?.apiSongs ?? [];

const mixes =
  feed?.madeForYou?.length
    ? feed.madeForYou
    : feed?.apiSongs ?? [];

  const heroQueue = hero
  ? [hero, ...(trending || []).filter((s) => s.id !== hero.id)]
  : trending;

  return (
    <Layout>
      {/* ================= HERO ================= */}
      {hero && (
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-card backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

          {/* Cover Image */}
          <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
            <img
              src={hero.cover}
              alt=""
              className="h-full w-full object-cover opacity-70"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs text-beatPink font-bold">
              <Sparkles className="h-4 w-4" /> Featured
            </div>

            <h2 className="text-4xl font-extrabold text-white">
              {hero.title}
            </h2>

            <p className="mt-2 text-white/60">
              By {hero.artist}
            </p>

            <Button
              className="mt-5"
              onClick={() => playSong(hero, heroQueue)}
            >
              <Play className="h-5 w-5" fill="currentColor" />
              Play Now
            </Button>
          </div>
        </section>
      )}

      {/* ================= TRENDING ================= */}
      <SongSection
        title="Trending Now"
        icon={Flame}
        songs={trending}
      />

      {/* ================= MIXES ================= */}
      <MixSection mixes={mixes} />

      {/* ================= RECOMMENDED ================= */}
      <SongSection
        title="Recommended For You"
        icon={Sparkles}
        songs={recommended}
      />
    </Layout>
  );
};


// ================= SONG SECTION =================
const SongSection = ({ title, icon: Icon, songs }) => {
  const safeSongs = songs ?? [];

  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="text-beatPink" />
        <h2 className="text-white text-xl font-bold">{title}</h2>
      </div>

      {safeSongs.length === 0 ? (
        <p className="text-white/50 text-sm">
          No songs available
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {safeSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              queue={safeSongs}
            />
          ))}
        </div>
      )}
    </section>
  );
};


// ================= MIX SECTION =================
const MixSection = ({ mixes }) => {
  const safeMixes = mixes ?? [];

  return (
    <section className="mt-8">
      <h2 className="text-white text-xl font-bold mb-4">
        Made for You
      </h2>

      {safeMixes.length === 0 ? (
        <p className="text-white/50 text-sm">
          No mixes available
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {safeMixes.map((mix) => (
            <div
              key={mix.id}
              className="relative rounded-xl overflow-hidden bg-white/10 p-4 hover:scale-105 transition"
            >
              <img
                src={mix.cover}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />

              <div className="relative z-10">
                <h3 className="text-white font-bold">
                  {mix.title}
                </h3>
                <p className="text-xs text-white/60">
                  {mix.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Home;