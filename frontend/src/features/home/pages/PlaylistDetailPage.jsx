import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Headphones, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/common/GlassPanel";
import { SongCard } from "@/features/music/components/SongCard";
import { usePlayerStore } from "@/features/music/store/player.store";
import { playlists } from "@/config/constants";
import { cn } from "@/lib/utils";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const playTrack = usePlayerStore((state) => state.playTrack);

  const playlist = useMemo(
    () => playlists.find((item) => item.id === id) || playlists[0],
    [id],
  );

  useDocumentTitle(playlist.name, playlist.description);

  return (
    <div className="space-y-6">
      <GlassPanel className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className={cn("min-h-80 bg-gradient-to-br", playlist.gradient)} />
          <div className="flex flex-col justify-end p-6 md:p-10">
            <Badge variant="cyan">
              <Headphones className="size-3" />
              Playlist
            </Badge>
            <h1 className="mt-4 font-display text-5xl font-semibold text-white md:text-7xl">{playlist.name}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{playlist.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>{playlist.tracks.length} tracks</Badge>
              <Badge variant="green">{playlist.collaborators} collaborators</Badge>
            </div>
            <Button
              className="mt-8 w-fit rounded-full"
              variant="neon"
              size="lg"
              onClick={() => playTrack(playlist.tracks[0], playlist.tracks)}
            >
              <Play className="size-5 fill-current" />
              Play playlist
            </Button>
          </div>
        </div>
      </GlassPanel>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {playlist.tracks.map((song) => (
          <SongCard key={song.id} song={song} compact />
        ))}
      </section>
    </div>
  );
}
