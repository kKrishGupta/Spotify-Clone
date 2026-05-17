import { SongCard } from "@/features/music/components/SongCard";
import { PlaylistCard } from "@/features/playlists/components/PlaylistCard";

export function SearchResults({ results }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {results.songs.map((song) => (
          <SongCard key={song.id} song={song} compact />
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        {results.playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </section>
    </div>
  );
}
