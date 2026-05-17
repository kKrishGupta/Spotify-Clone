import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { PlaylistCard } from "@/features/playlists/components/PlaylistCard";
import { CollaborativePlaylist } from "@/features/playlists/collaboration/CollaborativePlaylist";
import { playlistsService } from "@/features/playlists/services/playlists.service";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function PlaylistsPage() {
  useDocumentTitle("Playlists", "AI playlists and collaborative rooms.");
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["playlists"], queryFn: playlistsService.list });

  useMutation({
    mutationFn: playlistsService.like,
    onMutate: async (playlistId) => {
      await queryClient.cancelQueries({ queryKey: ["playlists"] });
      const previous = queryClient.getQueryData(["playlists"]);
      queryClient.setQueryData(["playlists"], (current = []) =>
        current.map((playlist) => (playlist.id === playlistId ? { ...playlist, saves: playlist.saves + 1 } : playlist)),
      );
      return { previous };
    },
    onError: (_error, _playlistId, context) => queryClient.setQueryData(["playlists"], context.previous),
  });

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 7"
        title="Collaborative playlist rooms"
        description="Realtime playlist creation with optimistic interactions and live collaborator entry points."
      />
      <section className="grid gap-4 lg:grid-cols-3">
        {data.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </section>
      <CollaborativePlaylist playlist={data[0]} />
    </div>
  );
}
