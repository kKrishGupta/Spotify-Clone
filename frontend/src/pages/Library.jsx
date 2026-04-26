import { Play, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import SongCard from "../components/ui/SongCard";
import { getPlaylists } from "../features/playlist/playlistAPI";
import { usePlayer } from "../features/player/usePlayer";

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setQueue } = usePlayer();

  useEffect(() => {
    let mounted = true;

    const loadPlaylists = async () => {
      setIsLoading(true);
      const data = await getPlaylists();
      if (mounted) {
        setPlaylists(data);
        setIsLoading(false);
      }
    };

    loadPlaylists();

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

  const likedSongs = playlists[0]?.songs || [];

  return (
    <Layout>
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-beatPink">Library</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">Your saved sound</h1>
        </div>
        <Button>
          <Plus className="h-5 w-5" /> Create Playlist
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="group relative min-h-56 overflow-hidden p-4">
            <img
              src={playlist.cover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-transparent" />
            <div className="relative flex h-full flex-col justify-end">
              <h2 className="text-xl font-extrabold text-white">{playlist.name}</h2>
              <p className="mt-1 text-sm font-medium text-white/55">{playlist.songs.length} songs</p>
              <Button className="mt-4 w-full" onClick={() => setQueue(playlist.songs, 0)}>
                <Play className="h-5 w-5" fill="currentColor" /> Play
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white">Liked Songs</h2>
          <button className="text-sm font-bold text-beatPink transition duration-300 hover:text-white">View all</button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {likedSongs.map((song) => (
            <SongCard key={song.id} song={song} queue={likedSongs} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Library;
