import { Heart, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePlaylistsStore } from "@/features/playlists/store/playlists.store";
import { formatNumber } from "@/utils/format";
import { cn } from "@/lib/utils";

export function PlaylistCard({ playlist }) {
  const liked = usePlaylistsStore((state) => state.liked[playlist.id]);
  const optimisticLike = usePlaylistsStore((state) => state.optimisticLike);

  return (
    <article className="glass-soft premium-ring overflow-hidden rounded-lg">
      <div className={cn("h-36 bg-gradient-to-br", playlist.gradient)} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-semibold text-white">{playlist.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{playlist.description}</p>
          </div>
          <Button
            variant={liked ? "neon" : "ghost"}
            size="icon"
            onClick={() => optimisticLike(playlist.id)}
            aria-label={`Like ${playlist.name}`}
          >
            <Heart className={cn("size-5", liked && "fill-current")} />
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="cyan">
            <UsersRound className="size-3" />
            {playlist.collaborators} collaborators
          </Badge>
          <Badge>{formatNumber(playlist.saves)} saves</Badge>
        </div>
      </div>
    </article>
  );
}
