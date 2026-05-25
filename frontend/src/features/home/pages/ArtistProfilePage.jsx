import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Radio, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/common/GlassPanel";
import { SongCard } from "@/features/music/components/SongCard";
import { mockSongs } from "@/config/constants";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function slug(value = "") {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ArtistProfilePage() {
  const { id } = useParams();
  const artistSongs = useMemo(() => {
    const songs = mockSongs.filter((song) => slug(song.artist) === id);
    return songs.length ? songs : mockSongs.slice(0, 4);
  }, [id]);
  const artist = artistSongs[0]?.artist || "BeatFlow Artist";

  useDocumentTitle(artist, "Artist profile and top tracks.");

  return (
    <div className="space-y-6">
      <GlassPanel className="relative overflow-hidden p-6 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,229,255,.24),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,78,205,.18),transparent_28%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end">
          <div className="size-44 shrink-0 rounded-full bg-premium-line shadow-glow" />
          <div>
            <Badge variant="cyan">
              <Radio className="size-3" />
              Artist
            </Badge>
            <h1 className="mt-4 font-display text-5xl font-semibold text-white md:text-7xl">{artist}</h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Top tracks, live listener signals, and AI-assisted artist discovery.
            </p>
            <Badge className="mt-5" variant="green">
              <UsersRound className="size-3" />
              1.2M monthly listeners
            </Badge>
          </div>
        </div>
      </GlassPanel>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {artistSongs.map((song) => (
          <SongCard key={song.id} song={song} compact />
        ))}
      </section>
    </div>
  );
}
