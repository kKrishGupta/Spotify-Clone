import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { usePlayerStore } from "@/features/music/store/player.store";

export function MiniPlayer() {
  const currentTrack = usePlayerStore((state) => state.currentTrack);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const playNext = usePlayerStore((state) => state.playNext);
  const playPrevious = usePlayerStore((state) => state.playPrevious);

  return (
    <div className="flex items-center gap-2">
      <Tooltip label="Previous">
        <Button variant="ghost" size="icon" onClick={playPrevious}>
          <SkipBack className="size-5" />
        </Button>
      </Tooltip>
      <Button variant="neon" size="icon" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
        {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
      </Button>
      <Tooltip label="Next">
        <Button variant="ghost" size="icon" onClick={playNext}>
          <SkipForward className="size-5" />
        </Button>
      </Tooltip>
      <span className="sr-only">{currentTrack?.title}</span>
    </div>
  );
}
