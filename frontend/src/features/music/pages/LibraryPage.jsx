import { Download, FolderHeart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlassPanel } from "@/components/common/GlassPanel";
import { PageHeader } from "@/components/common/PageHeader";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { SongCard } from "@/features/music/components/SongCard";
import { PlaylistCard } from "@/features/playlists/components/PlaylistCard";
import { useLibraryData } from "@/features/music/hooks/useMusicData";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function LibraryPage() {
  useDocumentTitle("Library", "Saved songs, playlists, and smart collections.");
  const { data, isLoading } = useLibraryData();

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Library"
        title="Your saved sound graph"
        description="Liked songs, offline-ready tracks, and adaptive collections shaped by your listening behavior."
      />
      <section className="grid gap-4 lg:grid-cols-4">
        {data.smartCollections.map((collection) => (
          <GlassPanel key={collection} className="p-5">
            <FolderHeart className="size-6 text-pulse" />
            <h3 className="mt-4 font-display text-lg font-semibold text-white">{collection}</h3>
            <Badge className="mt-4" variant="cyan">
              Smart collection
            </Badge>
          </GlassPanel>
        ))}
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.saved.map((song) => (
          <SongCard key={song.id} song={song} compact />
        ))}
      </section>
      <GlassPanel className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Download className="size-5 text-volt" />
          <h2 className="font-display text-xl font-semibold text-white">Offline queue</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.downloads.map((song) => (
            <SongCard key={song.id} song={song} compact />
          ))}
        </div>
      </GlassPanel>
      <section className="grid gap-4 lg:grid-cols-3">
        {data.playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </section>
    </div>
  );
}
