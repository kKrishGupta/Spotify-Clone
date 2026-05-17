import { ListMusic, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePlayerStore } from "@/features/music/store/player.store";
import { formatDuration } from "@/utils/format";

export function QueuePanel() {
  const queue = usePlayerStore((state) => state.queue);
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const playTrack = usePlayerStore((state) => state.playTrack);

  return (
    <aside className="glass fixed bottom-28 right-4 z-40 max-h-[60vh] w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-2">
          <ListMusic className="size-5 text-pulse" />
          <h2 className="font-display text-lg font-semibold text-white">Up next</h2>
        </div>
        <Badge variant="cyan">{queue.length} tracks</Badge>
      </div>
      <div className="scrollbar-premium max-h-[48vh] overflow-y-auto p-2">
        {queue.map((track) => (
          <button
            key={track.id}
            type="button"
            onClick={() => playTrack(track)}
            className="flex w-full items-center gap-3 rounded-md p-3 text-left transition hover:bg-white/10"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-md" style={{ background: track.cover }}>
              {currentTrack?.id === track.id ? <Play className="size-4 fill-white text-white" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{track.title}</p>
              <p className="truncate text-sm text-muted-foreground">{track.artist}</p>
            </div>
            <span className="text-xs text-muted-foreground">{formatDuration(track.duration)}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
